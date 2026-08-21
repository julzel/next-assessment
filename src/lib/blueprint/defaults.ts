import type { BrandAnswers, BrandBlueprintConfig } from "./types"

export function createEmptyBrandAnswers(): BrandAnswers {
  return {
    offerAudience: "",
    personalityTraits: [],
    visualDirection: null,
    colorDirection: null,
    typographyDirection: null,
    voiceTraits: [],
    alwaysCommunicate: "",
    avoid: "",
  }
}

export function createEmptyBlueprintConfig(): BrandBlueprintConfig {
  return {
    schemaVersion: 1,
    answers: createEmptyBrandAnswers(),
    content: {
      essence: "A focused salon brand direction will take shape here.",
      audiencePromise:
        "Describe the salon's signature services or experience and the clients it is designed for.",
      personality: "Choose three traits to define the salon's character.",
      visualDirection: "Choose visual, color, and typography directions for the salon brand.",
      voiceTone: "Choose voice traits to guide client-facing communication.",
      guardrail: null,
    },
  }
}
