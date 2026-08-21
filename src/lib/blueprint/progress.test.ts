import { describe, expect, it } from "vitest"

import { buildDeterministicContent } from "./content"
import { createEmptyBlueprintConfig } from "./defaults"
import {
  BLUEPRINT_REQUIRED_FIELDS,
  getBlueprintFieldErrors,
  getBlueprintProgress,
  isBlueprintComplete,
} from "./progress"
import type { BrandAnswers } from "./types"

const completeAnswers: BrandAnswers = {
  offerAudience: "Precision services for clients who value a calm visit",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "thoughtful expertise and care",
  avoid: "pressure or beauty stereotypes",
}

describe("blueprint progress", () => {
  it("maps every required answer to exactly one guided step", () => {
    const progress = getBlueprintProgress(createEmptyBlueprintConfig().answers)

    expect(progress.missing.map((requirement) => requirement.field)).toEqual(
      BLUEPRINT_REQUIRED_FIELDS,
    )
    expect(new Set(progress.missing.map((requirement) => requirement.field)).size).toBe(
      BLUEPRINT_REQUIRED_FIELDS.length,
    )
    expect(progress.steps.map((step) => step.status)).toEqual([
      "not-started",
      "not-started",
      "not-started",
      "not-started",
    ])
  })

  it("reports in-progress steps and dynamic missing guidance", () => {
    const config = createEmptyBlueprintConfig()
    config.answers.personalityTraits = ["confident", "curious"]
    config.content = buildDeterministicContent(config.answers)

    const progress = getBlueprintProgress(config.answers)
    const personality = progress.steps.find((step) => step.id === "personality")

    expect(personality?.status).toBe("in-progress")
    expect(personality?.missing.map((requirement) => requirement.message)).toEqual([
      "Choose 1 more personality trait.",
      "Choose one visual direction.",
    ])
  })

  it("uses the same completion result as the exported predicate", () => {
    const config = {
      schemaVersion: 1 as const,
      answers: completeAnswers,
      content: buildDeterministicContent(completeAnswers),
    }
    const progress = getBlueprintProgress(config.answers)

    expect(progress.completedCount).toBe(4)
    expect(progress.firstIncompleteStep).toBeNull()
    expect(progress.isComplete).toBe(true)
    expect(isBlueprintComplete(config)).toBe(true)
  })

  it("maps server validation paths to their editable fields", () => {
    expect(
      getBlueprintFieldErrors([
        { path: "draft.brandName", message: "Cannot be blank." },
        { path: "answers.personalityTraits[1]", message: "Must be supported." },
        { path: "config", message: "Invalid." },
      ]),
    ).toEqual({
      brandName: "Cannot be blank.",
      personalityTraits: "Must be supported.",
    })
  })
})
