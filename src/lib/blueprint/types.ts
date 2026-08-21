export const TEMPLATE_IDS = ["editorial", "studio", "warm"] as const
export const PERSONALITY_TRAITS = [
  "confident",
  "curious",
  "refined",
  "playful",
  "grounded",
  "bold",
  "warm",
  "precise",
] as const
export const VISUAL_DIRECTIONS = [
  "minimal",
  "bold",
  "elegant",
  "playful",
  "organic",
] as const
export const COLOR_DIRECTIONS = [
  "neutral",
  "cool",
  "warm",
  "earthy",
  "vibrant",
] as const
export const TYPOGRAPHY_DIRECTIONS = [
  "modern-sans",
  "editorial-serif",
  "friendly-rounded",
  "expressive-contrast",
] as const
export const VOICE_TRAITS = [
  "clear",
  "warm",
  "playful",
  "authoritative",
  "optimistic",
  "direct",
  "thoughtful",
  "energetic",
] as const

export type TemplateId = (typeof TEMPLATE_IDS)[number]
export type PersonalityTrait = (typeof PERSONALITY_TRAITS)[number]
export type VisualDirection = (typeof VISUAL_DIRECTIONS)[number]
export type ColorDirection = (typeof COLOR_DIRECTIONS)[number]
export type TypographyDirection = (typeof TYPOGRAPHY_DIRECTIONS)[number]
export type VoiceTrait = (typeof VOICE_TRAITS)[number]

export type BrandAnswers = {
  offerAudience: string
  personalityTraits: PersonalityTrait[]
  visualDirection: VisualDirection | null
  colorDirection: ColorDirection | null
  typographyDirection: TypographyDirection | null
  voiceTraits: VoiceTrait[]
  alwaysCommunicate: string
  avoid: string
}

export type BrandBlueprintContent = {
  essence: string
  audiencePromise: string
  personality: string
  visualDirection: string
  voiceTone: string
  guardrail: string | null
}

export type BrandBlueprintConfig = {
  schemaVersion: 1
  answers: BrandAnswers
  content: BrandBlueprintContent
}

export type BlueprintId = number

export type BlueprintDraft = {
  id: BlueprintId | null
  brandName: string
  template: TemplateId
  config: BrandBlueprintConfig
  createdAt: string | null
  updatedAt: string | null
}

export type BlueprintSummary = {
  id: BlueprintId
  brandName: string
  template: TemplateId
  updatedAt: string
}
