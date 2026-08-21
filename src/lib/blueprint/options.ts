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
    label: "Editorial Luxe",
    description: "Craft-led, campaign-minded, and typography-forward.",
    effect: "Frames the salon through an editorial story, signature-service focus, and booking cue.",
    composition: "Campaign masthead, crafted service story, refined booking cue",
  },
  {
    id: "studio",
    label: "Modern Studio",
    description: "Service-led, contemporary, and precisely organized.",
    effect:
      "Turns the salon direction into a systematic service menu, expertise proof, and clear appointment path.",
    composition: "Service index, modular proof grid, direct appointment path",
  },
  {
    id: "warm",
    label: "Neighborhood Welcome",
    description: "Human, care-led, and built for lasting client relationships.",
    effect:
      "Shapes an inviting salon story around the client-care promise, approachable services, and a warm booking cue.",
    composition: "Human introduction, care moment, approachable service flow",
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
    effect:
      "Uses square campaign crops, open service rows, fine dividers, and a restrained booking cue.",
  },
  {
    id: "bold",
    label: "Bold",
    description: "High-impact and recognizable for a salon with a strong point of view.",
    effect:
      "Uses block campaign crops, heavy service cards, thick dividers, and an assertive booking cue.",
  },
  {
    id: "elegant",
    label: "Elegant",
    description: "Graceful and composed, emphasizing craft and considered client care.",
    effect:
      "Uses arched campaign crops, measured service cards, fine dividers, and a polished booking cue.",
  },
  {
    id: "playful",
    label: "Playful",
    description: "Expressive and energetic for a salon that welcomes experimentation.",
    effect:
      "Uses lively campaign shapes, rounded service cards, energetic dividers, and a playful booking cue.",
  },
  {
    id: "organic",
    label: "Organic",
    description: "Natural and tactile for a care-led or wellness-minded salon experience.",
    effect:
      "Uses botanical campaign curves, layered service surfaces, flowing dividers, and a soft booking cue.",
  },
]

export const COLOR_DIRECTION_OPTIONS: readonly BlueprintOption<ColorDirection>[] = [
  {
    id: "neutral",
    label: "Neutral",
    description: "Warm stone, soft white, and near-black keep salon work and information central.",
    effect: "Applies calm stone surfaces, readable ink text, and a restrained near-black accent.",
  },
  {
    id: "cool",
    label: "Cool",
    description: "Slate, mineral cyan, and deep teal give a salon precise contemporary calm.",
    effect: "Applies clean light surfaces, dark slate text, and a composed teal action accent.",
  },
  {
    id: "warm",
    label: "Warm",
    description: "Sunlit cream, amber, and terracotta make client-care moments feel welcoming.",
    effect: "Applies warm light surfaces, near-black text, and a deep terracotta action accent.",
  },
  {
    id: "earthy",
    label: "Earthy",
    description: "Sand, botanical lime, and forest green support a grounded salon direction.",
    effect: "Applies tactile light surfaces, readable dark text, and a deep green action accent.",
  },
  {
    id: "vibrant",
    label: "Vibrant",
    description:
      "Electric lime and deep cobalt give an expressive salon energy without a stereotyped pink default.",
    effect: "Applies clean white surfaces, dark text, cobalt actions, and vivid lime highlights.",
  },
]

export const COLOR_DIRECTION_SWATCHES: Record<ColorDirection, readonly string[]> = {
  neutral: ["bg-stone-900", "bg-stone-400", "bg-stone-50"],
  cool: ["bg-teal-900", "bg-cyan-400", "bg-slate-100"],
  warm: ["bg-orange-900", "bg-amber-400", "bg-orange-50"],
  earthy: ["bg-green-900", "bg-lime-500", "bg-amber-50"],
  vibrant: ["bg-indigo-900", "bg-lime-400", "bg-white"],
}

export const TYPOGRAPHY_DIRECTION_OPTIONS: readonly BlueprintOption<TypographyDirection>[] = [
  {
    id: "modern-sans",
    label: "Modern sans",
    description: "Clean, direct letterforms for contemporary services and booking guidance.",
    effect:
      "Uses crisp sans-serif display and body type, compact service headings, and direct booking cues.",
  },
  {
    id: "editorial-serif",
    label: "Editorial serif",
    description: "Expressive serif headlines that spotlight craft while body copy stays readable.",
    effect:
      "Uses expressive serif display and service type with precise sans-serif labels and booking cues.",
  },
  {
    id: "friendly-rounded",
    label: "Friendly rounded",
    description: "Soft, open letterforms that make client guidance feel approachable.",
    effect:
      "Uses rounded display, body, service, and action type for approachable client guidance.",
  },
  {
    id: "expressive-contrast",
    label: "Expressive contrast",
    description: "Dramatic display type for campaign moments with restrained client information.",
    effect:
      "Pairs dramatic serif display with restrained body copy, strong service type, and mono booking cues.",
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
