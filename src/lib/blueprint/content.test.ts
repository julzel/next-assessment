import { describe, expect, it } from "vitest"

import { applyManualAnswer, ANSWER_CONTENT_DEPENDENCIES, buildDeterministicContent } from "./content"
import { createEmptyBlueprintConfig } from "./defaults"
import type { BrandAnswers } from "./types"

const completeAnswers: BrandAnswers = {
  offerAudience: "Dimensional color and calm care for clients with busy schedules",
  personalityTraits: ["confident", "curious", "warm"],
  visualDirection: "elegant",
  colorDirection: "earthy",
  typographyDirection: "editorial-serif",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "thoughtful expertise",
  avoid: "pressure or beauty stereotypes",
}

describe("blueprint content", () => {
  it("builds a deterministic presentation snapshot", () => {
    expect(buildDeterministicContent(completeAnswers)).toEqual({
      essence: "A confident, curious, and warm, elegant salon brand expression.",
      audiencePromise:
        "Dimensional color and calm care for clients with busy schedules. Every touchpoint should communicate thoughtful expertise.",
      personality: "The salon brand feels confident, curious, and warm.",
      visualDirection:
        "A salon visual system with elegant and earthy-leaning color and editorial serif typography.",
      voiceTone:
        "Use a clear and thoughtful voice across booking, social, and client communication, consistently reinforcing thoughtful expertise.",
      guardrail: "Avoid pressure or beauty stereotypes in client-facing communication.",
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

    const next = applyManualAnswer(
      config,
      "offerAudience",
      "Precision services for clients who value a calm visit",
    )

    expect(next.content.audiencePromise).toBe(
      "Precision services for clients who value a calm visit. Every touchpoint should communicate thoughtful expertise.",
    )
    expect(next.content.personality).toBe("AI-authored personality copy.")
    expect(next.content.voiceTone).toBe("AI-authored voice copy.")
    expect(next.answers).not.toBe(config.answers)
    expect(next.answers.personalityTraits).not.toBe(config.answers.personalityTraits)
  })

  it("uses neutral salon guidance for an empty draft without inventing services or claims", () => {
    expect(buildDeterministicContent(createEmptyBlueprintConfig().answers)).toEqual({
      essence: "A focused salon brand direction will take shape here.",
      audiencePromise:
        "Describe the salon's signature services or experience and the clients it is designed for.",
      personality: "Choose three traits to define the salon's character.",
      visualDirection: "Choose visual, color, and typography directions for the salon brand.",
      voiceTone: "Choose voice traits to guide client-facing communication.",
      guardrail: null,
    })
  })
})
