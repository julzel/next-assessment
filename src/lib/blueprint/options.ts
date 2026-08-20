import {
  type ColorDirection,
  type PersonalityTrait,
  type TemplateId,
  type TypographyDirection,
  type VisualDirection,
  type VoiceTrait,
} from "./types"

export type BlueprintOption<T extends string> = {
  id: T
  label: string
  description: string
  effect: string
}

export const TEMPLATE_OPTIONS: readonly BlueprintOption<TemplateId>[] = [
  {
    id: "editorial",
    label: "Editorial",
    description: "Refined and typography-led.",
    effect: "Sets a narrative composition with generous hierarchy.",
  },
  {
    id: "studio",
    label: "Studio",
    description: "Clean, modular, and systematic.",
    effect: "Sets a structured composition built from clear modules.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Approachable and expressive.",
    effect: "Sets a softer composition designed to invite connection.",
  },
]

export const PERSONALITY_TRAIT_OPTIONS: readonly BlueprintOption<PersonalityTrait>[] = [
  {
    id: "confident",
    label: "Confident",
    description: "Assured and decisive without sounding arrogant.",
    effect: "Strengthens hierarchy and emphasis cues.",
  },
  {
    id: "curious",
    label: "Curious",
    description: "Open-minded, exploratory, and interested in possibility.",
    effect: "Introduces moments of visual discovery.",
  },
  {
    id: "refined",
    label: "Refined",
    description: "Considered, polished, and attentive to detail.",
    effect: "Favors restraint, fine rules, and deliberate spacing.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Light-hearted, surprising, and comfortable with delight.",
    effect: "Adds lively accent and shape cues.",
  },
  {
    id: "grounded",
    label: "Grounded",
    description: "Stable, practical, and connected to real needs.",
    effect: "Favors solid surfaces and calm emphasis.",
  },
  {
    id: "bold",
    label: "Bold",
    description: "Unmistakable, energetic, and willing to take a position.",
    effect: "Increases contrast and visual weight.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Human, welcoming, and emotionally generous.",
    effect: "Softens shapes and supporting treatments.",
  },
  {
    id: "precise",
    label: "Precise",
    description: "Clear, disciplined, and exact in every detail.",
    effect: "Reinforces alignment and systematic rhythm.",
  },
]

export const VISUAL_DIRECTION_OPTIONS: readonly BlueprintOption<VisualDirection>[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Quiet, spacious, and reduced to the essentials.",
    effect: "Controls whitespace, light borders, and restrained decoration.",
  },
  {
    id: "bold",
    label: "Bold",
    description: "High-impact, assertive, and immediately recognizable.",
    effect: "Controls larger scale, heavier borders, and stronger contrast.",
  },
  {
    id: "elegant",
    label: "Elegant",
    description: "Graceful, balanced, and intentionally composed.",
    effect: "Controls fine details, measured spacing, and a polished rhythm.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Expressive, energetic, and comfortable with surprise.",
    effect: "Controls rounded shapes, offsets, and decorative energy.",
  },
  {
    id: "organic",
    label: "Organic",
    description: "Natural, tactile, and less mechanically uniform.",
    effect: "Controls softer edges, flowing space, and layered surfaces.",
  },
]

export const COLOR_DIRECTION_OPTIONS: readonly BlueprintOption<ColorDirection>[] = [
  {
    id: "neutral",
    label: "Neutral",
    description: "Black, white, and stone tones with restrained contrast.",
    effect: "Will set calm canvas, surface, text, and accent colors.",
  },
  {
    id: "cool",
    label: "Cool",
    description: "Blue-led tones that feel clear, modern, and composed.",
    effect: "Will set cool canvas, surface, text, and accent colors.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Sunlit orange and cream tones that feel welcoming.",
    effect: "Will set warm canvas, surface, text, and accent colors.",
  },
  {
    id: "earthy",
    label: "Earthy",
    description: "Green, clay, and sand tones grounded in nature.",
    effect: "Will set grounded canvas, surface, text, and accent colors.",
  },
  {
    id: "vibrant",
    label: "Vibrant",
    description: "Bright, saturated tones designed for visible energy.",
    effect: "Will set energetic canvas, surface, text, and accent colors.",
  },
]

export const COLOR_DIRECTION_SWATCHES: Record<ColorDirection, readonly string[]> = {
  neutral: ["bg-stone-950", "bg-stone-500", "bg-stone-100"],
  cool: ["bg-sky-900", "bg-sky-500", "bg-sky-100"],
  warm: ["bg-orange-900", "bg-orange-500", "bg-orange-100"],
  earthy: ["bg-emerald-900", "bg-amber-600", "bg-amber-100"],
  vibrant: ["bg-fuchsia-800", "bg-pink-500", "bg-yellow-300"],
}

export const TYPOGRAPHY_DIRECTION_OPTIONS: readonly BlueprintOption<TypographyDirection>[] = [
  {
    id: "modern-sans",
    label: "Modern sans",
    description: "Clean, direct letterforms with a contemporary feel.",
    effect: "Will use a crisp sans-serif hierarchy throughout the Blueprint.",
  },
  {
    id: "editorial-serif",
    label: "Editorial serif",
    description: "Expressive serif headlines balanced by readable body copy.",
    effect: "Will use a publication-inspired display hierarchy.",
  },
  {
    id: "friendly-rounded",
    label: "Friendly rounded",
    description: "Soft, open letterforms that feel informal and accessible.",
    effect: "Will soften the heading rhythm and supporting labels.",
  },
  {
    id: "expressive-contrast",
    label: "Expressive contrast",
    description: "Dramatic display type paired with restrained supporting text.",
    effect: "Will create a high-contrast headline and body relationship.",
  },
]

export const VOICE_TRAIT_OPTIONS: readonly BlueprintOption<VoiceTrait>[] = [
  {
    id: "clear",
    label: "Clear",
    description: "Easy to understand on the first read.",
    effect: "Shapes a concise, accessible voice summary.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Human, encouraging, and emotionally present.",
    effect: "Shapes a welcoming voice summary and message treatment.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Light, surprising, and comfortable with personality.",
    effect: "Shapes a lively voice summary and message treatment.",
  },
  {
    id: "authoritative",
    label: "Authoritative",
    description: "Credible, assured, and grounded in expertise.",
    effect: "Shapes a decisive voice summary and message treatment.",
  },
  {
    id: "optimistic",
    label: "Optimistic",
    description: "Forward-looking, constructive, and possibility-led.",
    effect: "Shapes an encouraging voice summary and message treatment.",
  },
  {
    id: "direct",
    label: "Direct",
    description: "Straightforward, concise, and action-oriented.",
    effect: "Shapes a focused voice summary and message treatment.",
  },
  {
    id: "thoughtful",
    label: "Thoughtful",
    description: "Considered, nuanced, and respectful of context.",
    effect: "Shapes a measured voice summary and message treatment.",
  },
  {
    id: "energetic",
    label: "Energetic",
    description: "Active, motivating, and full of momentum.",
    effect: "Shapes a dynamic voice summary and message treatment.",
  },
]

export function optionLabel<T extends string>(
  options: readonly BlueprintOption<T>[],
  value: T | null,
) {
  return value === null ? null : options.find((option) => option.id === value)?.label ?? value
}
