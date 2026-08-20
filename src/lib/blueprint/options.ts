import {
  type ColorDirection,
  type PersonalityTrait,
  type TemplateId,
  type TypographyDirection,
  type VisualDirection,
  type VoiceTrait,
} from "./types"

type Option<T extends string> = {
  id: T
  label: string
}

export const TEMPLATE_OPTIONS: readonly Option<TemplateId>[] = [
  { id: "editorial", label: "Editorial" },
  { id: "studio", label: "Studio" },
  { id: "warm", label: "Warm" },
]

export const PERSONALITY_TRAIT_OPTIONS: readonly Option<PersonalityTrait>[] = [
  { id: "confident", label: "Confident" },
  { id: "curious", label: "Curious" },
  { id: "refined", label: "Refined" },
  { id: "playful", label: "Playful" },
  { id: "grounded", label: "Grounded" },
  { id: "bold", label: "Bold" },
  { id: "warm", label: "Warm" },
  { id: "precise", label: "Precise" },
]

export const VISUAL_DIRECTION_OPTIONS: readonly Option<VisualDirection>[] = [
  { id: "minimal", label: "Minimal" },
  { id: "bold", label: "Bold" },
  { id: "elegant", label: "Elegant" },
  { id: "playful", label: "Playful" },
  { id: "organic", label: "Organic" },
]

export const COLOR_DIRECTION_OPTIONS: readonly Option<ColorDirection>[] = [
  { id: "neutral", label: "Neutral" },
  { id: "cool", label: "Cool" },
  { id: "warm", label: "Warm" },
  { id: "earthy", label: "Earthy" },
  { id: "vibrant", label: "Vibrant" },
]

export const COLOR_DIRECTION_SWATCHES: Record<ColorDirection, readonly string[]> = {
  neutral: ["bg-stone-950", "bg-stone-500", "bg-stone-100"],
  cool: ["bg-sky-900", "bg-sky-500", "bg-sky-100"],
  warm: ["bg-orange-900", "bg-orange-500", "bg-orange-100"],
  earthy: ["bg-emerald-900", "bg-amber-600", "bg-amber-100"],
  vibrant: ["bg-fuchsia-800", "bg-pink-500", "bg-yellow-300"],
}

export const TYPOGRAPHY_DIRECTION_OPTIONS: readonly Option<TypographyDirection>[] = [
  { id: "modern-sans", label: "Modern sans" },
  { id: "editorial-serif", label: "Editorial serif" },
  { id: "friendly-rounded", label: "Friendly rounded" },
  { id: "expressive-contrast", label: "Expressive contrast" },
]

export const VOICE_TRAIT_OPTIONS: readonly Option<VoiceTrait>[] = [
  { id: "clear", label: "Clear" },
  { id: "warm", label: "Warm" },
  { id: "playful", label: "Playful" },
  { id: "authoritative", label: "Authoritative" },
  { id: "optimistic", label: "Optimistic" },
  { id: "direct", label: "Direct" },
  { id: "thoughtful", label: "Thoughtful" },
  { id: "energetic", label: "Energetic" },
]

export function optionLabel<T extends string>(
  options: readonly Option<T>[],
  value: T | null,
) {
  return value === null ? null : options.find((option) => option.id === value)?.label ?? value
}
