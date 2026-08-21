import { describe, expect, it } from "vitest"

import { applyAiPatch, type AiBlueprintPatch } from "./ai-contract"
import { buildDeterministicContent } from "./content"
import type { BlueprintDraft, BrandAnswers } from "./types"

const answers: BrandAnswers = {
  offerAudience: "Precision color and calm care for clients with busy schedules",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "direct"],
  alwaysCommunicate: "Useful clarity at every visit",
  avoid: "Pressure",
}

const draft: BlueprintDraft = {
  id: 4,
  brandName: "Northstar Salon",
  template: "editorial",
  config: {
    schemaVersion: 1,
    answers,
    content: buildDeterministicContent(answers),
  },
  createdAt: "2026-08-20T12:00:00.000Z",
  updatedAt: "2026-08-20T12:00:00.000Z",
}

function emptyPatch(): AiBlueprintPatch {
  return {
    answers: {
      personalityTraits: null,
      visualDirection: null,
      colorDirection: null,
      typographyDirection: null,
      voiceTraits: null,
      alwaysCommunicate: null,
      avoid: null,
    },
    content: {
      essence: null,
      audiencePromise: null,
      personality: null,
      visualDirection: null,
      voiceTone: null,
      guardrail: null,
    },
    changeSummary: "No supported changes requested.",
  }
}

describe("AI blueprint patch merge", () => {
  it("applies supported answers, recomputes dependencies, then applies copy overrides", () => {
    const patch = emptyPatch()
    patch.answers.voiceTraits = ["warm", "playful"]
    patch.answers.alwaysCommunicate = "Every client feels heard"
    patch.content.voiceTone = "Warm, playful, and still clear about every next step."

    const result = applyAiPatch(draft, patch)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.config.answers.voiceTraits).toEqual(["warm", "playful"])
    expect(result.data.config.content.audiencePromise).toContain("Every client feels heard")
    expect(result.data.config.content.voiceTone).toBe(
      "Warm, playful, and still clear about every next step.",
    )
  })

  it("preserves identity, template, offer/audience, timestamps, and unrelated content", () => {
    const patch = emptyPatch()
    patch.answers.colorDirection = "vibrant"

    const result = applyAiPatch(draft, patch)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data).toMatchObject({
      id: draft.id,
      brandName: draft.brandName,
      template: draft.template,
      createdAt: draft.createdAt,
      updatedAt: draft.updatedAt,
    })
    expect(result.data.config.answers.offerAudience).toBe(answers.offerAudience)
    expect(result.data.config.content.voiceTone).toBe(draft.config.content.voiceTone)
  })

  it("can deliberately clear the optional guardrail through the avoid answer", () => {
    const patch = emptyPatch()
    patch.answers.avoid = ""

    const result = applyAiPatch(draft, patch)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.data.config.answers.avoid).toBe("")
    expect(result.data.config.content.guardrail).toBeNull()
  })

  it("rejects a merged draft that violates the full blueprint contract", () => {
    const patch = emptyPatch()
    patch.answers.alwaysCommunicate = " "

    expect(applyAiPatch(draft, patch).success).toBe(false)
  })
})
