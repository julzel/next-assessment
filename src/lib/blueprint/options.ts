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

export type TemplateOption = BlueprintOption<TemplateId> & {
  composition: string
}

export const TEMPLATE_OPTIONS: readonly TemplateOption[] = [
  {
    id: "editorial",
    label: "Editorial",
    description: "Refined and typography-led.",
    effect: "Sets a narrative composition with generous hierarchy.",
    composition: "Masthead, fine rule, flowing story",
  },
  {
    id: "studio",
    label: "Studio",
    description: "Clean, modular, and systematic.",
    effect: "Sets a structured composition built from clear modules.",
    composition: "System header, modular grid, compact panels",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Approachable and expressive.",
    effect: "Sets a softer composition designed to invite connection.",
    composition: "Welcoming intro, layered cards, soft flow",
  },
]

export const PERSONALITY_TRAIT_OPTIONS: readonly BlueprintOption<PersonalityTrait>[] = [
  {
    id: "confident",
    label: "Confident",
    description: "Assured about the salon's expertise without sounding unapproachable.",
    effect: "Strengthens the client promise and its emphasis cues.",
  },
  {
    id: "curious",
    label: "Curious",
    description: "Open to new looks, techniques, and each client's point of view.",
    effect: "Introduces discovery cues around the salon experience.",
  },
  {
    id: "refined",
    label: "Refined",
    description: "Considered, polished, and attentive to every client detail.",
    effect: "Favors restraint, fine rules, and a carefully paced salon story.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Light-hearted and expressive while keeping client information clear.",
    effect: "Adds lively accents to the salon's personality cues.",
  },
  {
    id: "grounded",
    label: "Grounded",
    description: "Practical, dependable, and connected to everyday client needs.",
    effect: "Favors solid surfaces and calm service-oriented emphasis.",
  },
  {
    id: "bold",
    label: "Bold",
    description: "Unmistakable and energetic enough to stand out in a busy market.",
    effect: "Increases contrast and weight around the salon's key promise.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Human, welcoming, and attentive from booking through the visit.",
    effect: "Softens shapes and client-care treatments.",
  },
  {
    id: "precise",
    label: "Precise",
    description: "Clear and disciplined, with confidence in craft and process.",
    effect: "Reinforces alignment and a systematic service rhythm.",
  },
]

export const VISUAL_DIRECTION_OPTIONS: readonly BlueprintOption<VisualDirection>[] = [
  {
    id: "minimal",
    label: "Minimal",
    description: "Quiet and spacious, keeping services and client guidance easy to scan.",
    effect: "Uses open space, light borders, and restrained salon presentation cues.",
  },
  {
    id: "bold",
    label: "Bold",
    description: "High-impact and recognizable for a salon with a strong point of view.",
    effect: "Uses larger scale, heavier borders, and stronger campaign contrast.",
  },
  {
    id: "elegant",
    label: "Elegant",
    description: "Graceful and composed, emphasizing craft and considered client care.",
    effect: "Uses fine details, measured spacing, and a polished service rhythm.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Expressive and energetic for a salon that welcomes experimentation.",
    effect: "Uses rounded shapes, offsets, and lively social-ready energy.",
  },
  {
    id: "organic",
    label: "Organic",
    description: "Natural and tactile for a care-led or wellness-minded salon experience.",
    effect: "Uses softer edges, flowing space, and layered material cues.",
  },
]

export const COLOR_DIRECTION_OPTIONS: readonly BlueprintOption<ColorDirection>[] = [
  {
    id: "neutral",
    label: "Neutral",
    description: "Black, white, and stone tones that keep salon work and information central.",
    effect: "Sets a calm canvas, surfaces, text, and accents across the brand guide.",
  },
  {
    id: "cool",
    label: "Cool",
    description: "Blue-led tones for a clear, modern, and composed client experience.",
    effect: "Sets cool canvas, surface, text, and accent colors across the guide.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Sunlit cream and warm accents that make the salon feel welcoming.",
    effect: "Sets warm canvas, surface, text, and accent colors across the guide.",
  },
  {
    id: "earthy",
    label: "Earthy",
    description: "Green, clay, and sand tones for a grounded, care-led salon direction.",
    effect: "Sets grounded canvas, surface, text, and accent colors across the guide.",
  },
  {
    id: "vibrant",
    label: "Vibrant",
    description: "Bright, saturated tones for an expressive salon and visible campaigns.",
    effect: "Sets energetic canvas, surface, text, and accent colors across the guide.",
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
    description: "Clean, direct letterforms for contemporary services and booking guidance.",
    effect: "Uses a crisp sans-serif hierarchy across the salon Blueprint.",
  },
  {
    id: "editorial-serif",
    label: "Editorial serif",
    description: "Expressive serif headlines that spotlight craft while body copy stays readable.",
    effect: "Uses a publication-inspired hierarchy for the salon story.",
  },
  {
    id: "friendly-rounded",
    label: "Friendly rounded",
    description: "Soft, open letterforms that make client guidance feel approachable.",
    effect: "Softens salon headings and supporting service labels.",
  },
  {
    id: "expressive-contrast",
    label: "Expressive contrast",
    description: "Dramatic display type for campaign moments with restrained client information.",
    effect: "Creates a high-contrast salon-name, headline, and body relationship.",
  },
]

export const VOICE_TRAIT_OPTIONS: readonly BlueprintOption<VoiceTrait>[] = [
  {
    id: "clear",
    label: "Clear",
    description: "Makes services, care guidance, and booking information easy to understand.",
    effect: "Shapes a concise voice for website, social, and printed touchpoints.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Human and encouraging before, during, and after a salon visit.",
    effect: "Shapes a welcoming client-facing voice and message treatment.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Light and expressive while keeping salon information useful.",
    effect: "Shapes a lively social and client-message treatment.",
  },
  {
    id: "authoritative",
    label: "Authoritative",
    description: "Credible and assured when explaining salon expertise and care.",
    effect: "Shapes a decisive service and client-guidance treatment.",
  },
  {
    id: "optimistic",
    label: "Optimistic",
    description: "Encouraging and focused on how clients want to feel next.",
    effect: "Shapes an uplifting website, social, and print message treatment.",
  },
  {
    id: "direct",
    label: "Direct",
    description: "Straightforward about services, expectations, and next steps.",
    effect: "Shapes focused booking and service messages.",
  },
  {
    id: "thoughtful",
    label: "Thoughtful",
    description: "Considered and respectful of each client's context and preferences.",
    effect: "Shapes a measured client-care voice and message treatment.",
  },
  {
    id: "energetic",
    label: "Energetic",
    description: "Active and motivating for launches, appointments, and salon moments.",
    effect: "Shapes dynamic social, booking, and in-salon messages.",
  },
]

export function optionLabel<T extends string>(
  options: readonly BlueprintOption<T>[],
  value: T | null,
) {
  return value === null ? null : options.find((option) => option.id === value)?.label ?? value
}
