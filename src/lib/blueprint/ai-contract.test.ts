import { describe, expect, it } from "vitest"

import {
  AI_BLUEPRINT_PATCH_SCHEMA,
  type AiBlueprintPatch,
  validateAiBlueprintPatch,
  validateAiBlueprintPatchScope,
  validateAiRefinementTarget,
} from "./ai-contract"

export const validAiPatch: AiBlueprintPatch = {
  answers: {
    personalityTraits: null,
    visualDirection: null,
    colorDirection: null,
    typographyDirection: null,
    voiceTraits: ["warm", "playful"],
    alwaysCommunicate: "Welcoming expertise at every visit",
    avoid: null,
  },
  content: {
    essence: null,
    audiencePromise: null,
    personality: null,
    visualDirection: null,
    voiceTone: "Use a warm and playful voice that keeps every appointment clear.",
    guardrail: null,
  },
  changeSummary: "Made the salon voice warmer and more playful.",
}

describe("AI blueprint patch contract", () => {
  it("publishes a strict schema with every nullable field required", () => {
    expect(AI_BLUEPRINT_PATCH_SCHEMA.additionalProperties).toBe(false)
    expect(AI_BLUEPRINT_PATCH_SCHEMA.required).toEqual([
      "answers",
      "content",
      "changeSummary",
    ])
    expect(AI_BLUEPRINT_PATCH_SCHEMA.properties.answers.required).toHaveLength(7)
    expect(AI_BLUEPRINT_PATCH_SCHEMA.properties.content.required).toHaveLength(6)
  })

  it("accepts and normalizes a supported patch", () => {
    const result = validateAiBlueprintPatch({
      ...validAiPatch,
      changeSummary: "  Made the voice warmer.  ",
    })

    expect(result).toMatchObject({
      success: true,
      data: { changeSummary: "Made the voice warmer." },
    })
  })

  it("rejects unknown keys, invalid enums, duplicates, and oversized copy", () => {
    const result = validateAiBlueprintPatch({
      ...validAiPatch,
      unexpected: true,
      answers: {
        ...validAiPatch.answers,
        voiceTraits: ["warm", "warm"],
        visualDirection: "cinematic",
      },
      content: {
        ...validAiPatch.content,
        voiceTone: "x".repeat(601),
      },
    })

    expect(result.success).toBe(false)
  })

  it("rejects missing nullable fields and a blank change summary", () => {
    const answers: Record<string, unknown> = { ...validAiPatch.answers }
    delete answers.avoid
    const result = validateAiBlueprintPatch({
      ...validAiPatch,
      answers,
      changeSummary: " ",
    })

    expect(result.success).toBe(false)
  })

  it("accepts supported targets and rejects target-scoped field escapes", () => {
    expect(validateAiRefinementTarget("voice")).toEqual({ success: true, data: "voice" })
    expect(validateAiRefinementTarget("database").success).toBe(false)
    expect(validateAiBlueprintPatchScope(validAiPatch, "voice").success).toBe(true)

    const escapedPatch: AiBlueprintPatch = {
      ...validAiPatch,
      answers: { ...validAiPatch.answers, colorDirection: "warm" },
    }
    const result = validateAiBlueprintPatchScope(escapedPatch, "voice")

    expect(result).toMatchObject({
      success: false,
      issues: [{ path: "patch.answers.colorDirection" }],
    })
  })
})
