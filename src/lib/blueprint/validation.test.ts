import { describe, expect, it } from "vitest"

import { buildDeterministicContent } from "./content"
import { createEmptyBlueprintConfig } from "./defaults"
import type { BrandAnswers, BlueprintDraft } from "./types"
import {
  isBlueprintComplete,
  validateBlueprintConfig,
  validateBlueprintDraft,
  validateCompleteBlueprintDraft,
} from "./validation"

const completeAnswers: BrandAnswers = {
  offerAudience: "Founders building thoughtful products",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "direct"],
  alwaysCommunicate: "useful clarity",
  avoid: "jargon",
}

function completeDraft(): BlueprintDraft {
  return {
    id: null,
    brandName: "Northstar",
    template: "editorial",
    config: {
      schemaVersion: 1,
      answers: completeAnswers,
      content: buildDeterministicContent(completeAnswers),
    },
    createdAt: null,
    updatedAt: null,
  }
}

describe("blueprint validation", () => {
  it("accepts an empty JSON-safe config but marks it incomplete", () => {
    const config = createEmptyBlueprintConfig()

    expect(JSON.parse(JSON.stringify(config))).toEqual(config)
    expect(validateBlueprintConfig(config).success).toBe(true)
    expect(isBlueprintComplete(config)).toBe(false)
  })

  it("rejects unsupported, duplicate, and oversized answer values", () => {
    const config = createEmptyBlueprintConfig()
    config.answers.personalityTraits = ["confident", "confident"]
    config.answers.visualDirection = "custom" as never
    config.answers.offerAudience = "x".repeat(401)

    const validation = validateBlueprintConfig(config)

    expect(validation.success).toBe(false)
    if (!validation.success) {
      expect(validation.issues.map((issue) => issue.path)).toEqual(
        expect.arrayContaining([
          "answers.personalityTraits",
          "answers.visualDirection",
          "answers.offerAudience",
        ]),
      )
    }
  })

  it("rejects unknown fields and an unsupported schema version", () => {
    const config = {
      ...createEmptyBlueprintConfig(),
      schemaVersion: 2,
      unexpected: true,
    }

    const validation = validateBlueprintConfig(config)

    expect(validation.success).toBe(false)
    if (!validation.success) {
      expect(validation.issues.some((issue) => issue.path === "config")).toBe(true)
    }
  })

  it("validates an incoming DTO and its required completion state", () => {
    const draft = completeDraft()

    expect(validateBlueprintDraft(draft)).toMatchObject({ success: true })
    expect(validateCompleteBlueprintDraft(draft)).toMatchObject({ success: true })
    expect(isBlueprintComplete(draft.config)).toBe(true)

    const incomplete = { ...draft, config: createEmptyBlueprintConfig() }
    expect(validateBlueprintDraft(incomplete)).toMatchObject({ success: true })
    expect(validateCompleteBlueprintDraft(incomplete)).toMatchObject({ success: false })
  })
})
