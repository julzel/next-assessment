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
      essence: "A focused brand direction will take shape here.",
      audiencePromise: "Clarify what the brand offers and who it serves.",
      personality: "Choose three traits to define the brand personality.",
      visualDirection: "Choose visual, color, and typography directions.",
      voiceTone: "Choose voice traits to define the brand tone.",
      guardrail: null,
    },
  }
}
