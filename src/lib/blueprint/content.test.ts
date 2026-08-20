import { describe, expect, it } from "vitest"

import { applyManualAnswer, ANSWER_CONTENT_DEPENDENCIES, buildDeterministicContent } from "./content"
import { createEmptyBlueprintConfig } from "./defaults"
import type { BrandAnswers } from "./types"

const completeAnswers: BrandAnswers = {
  offerAudience: "Independent makers who want a memorable launch",
  personalityTraits: ["confident", "curious", "warm"],
  visualDirection: "elegant",
  colorDirection: "earthy",
  typographyDirection: "editorial-serif",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "calm expertise",
  avoid: "empty buzzwords",
}

describe("blueprint content", () => {
  it("builds a deterministic presentation snapshot", () => {
    expect(buildDeterministicContent(completeAnswers)).toEqual({
      essence: "A confident, curious, and warm, elegant brand expression.",
      audiencePromise:
        "Independent makers who want a memorable launch, always communicating calm expertise.",
      personality: "The brand feels confident, curious, and warm.",
      visualDirection: "A visual system with elegant and earthy-leaning color and editorial serif typography.",
      voiceTone: "Use a clear and thoughtful voice that consistently communicates calm expertise.",
      guardrail: "Avoid empty buzzwords.",
    })
  })

  it("maps every answer field to its intended content sections", () => {
    expect(ANSWER_CONTENT_DEPENDENCIES).toEqual({
      offerAudience: ["audiencePromise"],
      personalityTraits: ["essence", "personality"],
      visualDirection: ["essence", "visualDirection"],
      colorDirection: ["visualDirection"],
      typographyDirection: ["visualDirection"],
      voiceTraits: ["voiceTone"],
      alwaysCommunicate: ["audiencePromise", "voiceTone"],
      avoid: ["guardrail"],
    })
  })

  it("recomputes the documented sections for every answer field", () => {
    const replacements: { [K in keyof BrandAnswers]: BrandAnswers[K] } = {
      offerAudience: "Independent studios ready to grow",
      personalityTraits: ["bold", "grounded", "refined"],
      visualDirection: "organic",
      colorDirection: "vibrant",
      typographyDirection: "friendly-rounded",
      voiceTraits: ["energetic"],
      alwaysCommunicate: "practical optimism",
      avoid: "generic language",
    }

    for (const [field, value] of Object.entries(replacements) as [
      keyof BrandAnswers,
      BrandAnswers[keyof BrandAnswers],
    ][]) {
      const config = {
        schemaVersion: 1 as const,
        answers: completeAnswers,
        content: {
          essence: "Keep essence.",
          audiencePromise: "Keep audience promise.",
          personality: "Keep personality.",
          visualDirection: "Keep visual direction.",
          voiceTone: "Keep voice tone.",
          guardrail: "Keep guardrail.",
        },
      }
      const next = applyManualAnswer(config, field, value as never)
      const deterministic = buildDeterministicContent(next.answers)

      for (const section of Object.keys(config.content) as (keyof typeof config.content)[]) {
        if (ANSWER_CONTENT_DEPENDENCIES[field].includes(section)) {
          expect(next.content[section]).toEqual(deterministic[section])
        } else {
          expect(next.content[section]).toEqual(config.content[section])
        }
      }
    }
  })

  it("recomputes only sections that depend on a manual answer", () => {
    const config = {
      ...createEmptyBlueprintConfig(),
      answers: completeAnswers,
      content: {
        ...buildDeterministicContent(completeAnswers),
        personality: "AI-authored personality copy.",
        voiceTone: "AI-authored voice copy.",
      },
    }

    const next = applyManualAnswer(config, "offerAudience", "Local studios ready to grow")

    expect(next.content.audiencePromise).toBe(
      "Local studios ready to grow, always communicating calm expertise.",
    )
    expect(next.content.personality).toBe("AI-authored personality copy.")
    expect(next.content.voiceTone).toBe("AI-authored voice copy.")
    expect(next.answers).not.toBe(config.answers)
    expect(next.answers.personalityTraits).not.toBe(config.answers.personalityTraits)
  })
})
