import {
  COLOR_DIRECTION_OPTIONS,
  PERSONALITY_TRAIT_OPTIONS,
  TEMPLATE_OPTIONS,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
} from "./options"
import {
  type BlueprintDraft,
  type ColorDirection,
  type PersonalityTrait,
  type TemplateId,
  type TypographyDirection,
  type VisualDirection,
} from "./types"

type PaletteTokens = {
  canvasClass: string
  surfaceClass: string
  softSurfaceClass: string
  textClass: string
  mutedTextClass: string
  borderClass: string
  accentClass: string
  accentTextClass: string
  effect: string
}

type TypographyTokens = {
  displayClass: string
  bodyClass: string
  labelClass: string
  effect: string
}

type GeometryTokens = {
  canvasClass: string
  heroClass: string
  sectionClass: string
  sectionGapClass: string
  effect: string
}

type PersonalityTokens = {
  accentClass: string
  effect: string
}

type TemplateTokens = {
  composition: string
  effect: string
}

export type PresentationRationaleItem = {
  dimension: "template" | "visual" | "color" | "typography" | "personality"
  label: string
  effect: string
  fallback: boolean
}

export type BlueprintPresentationProfile = {
  template: { id: TemplateId; composition: string; effect: string }
  palette: PaletteTokens & { id: ColorDirection; fallback: boolean }
  typography: TypographyTokens & { id: TypographyDirection; fallback: boolean }
  geometry: GeometryTokens & { id: VisualDirection; fallback: boolean }
  personality: {
    modifiers: readonly (PersonalityTokens & { id: PersonalityTrait; label: string })[]
    fallback: boolean
  }
  rationale: readonly PresentationRationaleItem[]
}

const TEMPLATE_TOKENS = {
  editorial: {
    composition: "Narrative masthead, fine rules, and flowing sections.",
    effect: "Creates a publication-inspired hierarchy with a strong point of view.",
  },
  studio: {
    composition: "System header, modular grid, and compact information panels.",
    effect: "Creates a structured brand board designed for systematic scanning.",
  },
  warm: {
    composition: "Welcoming introduction, layered cards, and conversational flow.",
    effect: "Creates a softer brand story designed to invite connection.",
  },
} satisfies Record<TemplateId, TemplateTokens>

const PALETTE_TOKENS = {
  neutral: {
    canvasClass: "bg-stone-100",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-stone-200",
    textClass: "text-stone-950",
    mutedTextClass: "text-stone-600",
    borderClass: "border-stone-300",
    accentClass: "bg-stone-950",
    accentTextClass: "text-stone-50",
    effect: "Uses a calm stone canvas, white surfaces, and a restrained black accent.",
  },
  cool: {
    canvasClass: "bg-sky-50",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-sky-100",
    textClass: "text-slate-950",
    mutedTextClass: "text-sky-800",
    borderClass: "border-sky-300",
    accentClass: "bg-sky-800",
    accentTextClass: "text-white",
    effect: "Uses a clear blue canvas, cool surfaces, and a composed blue accent.",
  },
  warm: {
    canvasClass: "bg-orange-50",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-orange-100",
    textClass: "text-orange-950",
    mutedTextClass: "text-orange-800",
    borderClass: "border-orange-300",
    accentClass: "bg-orange-700",
    accentTextClass: "text-white",
    effect: "Uses a sunlit cream canvas, warm surfaces, and a welcoming orange accent.",
  },
  earthy: {
    canvasClass: "bg-amber-50",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-emerald-100",
    textClass: "text-stone-950",
    mutedTextClass: "text-emerald-900",
    borderClass: "border-amber-400",
    accentClass: "bg-emerald-900",
    accentTextClass: "text-amber-50",
    effect: "Uses sand and green surfaces with a grounded forest accent.",
  },
  vibrant: {
    canvasClass: "bg-fuchsia-50",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-yellow-200",
    textClass: "text-fuchsia-950",
    mutedTextClass: "text-fuchsia-800",
    borderClass: "border-fuchsia-300",
    accentClass: "bg-fuchsia-700",
    accentTextClass: "text-white",
    effect: "Uses an energetic pink canvas, bright yellow surfaces, and a saturated accent.",
  },
} satisfies Record<ColorDirection, PaletteTokens>

const TYPOGRAPHY_TOKENS = {
  "modern-sans": {
    displayClass: "font-sans font-bold tracking-tight",
    bodyClass: "font-sans",
    labelClass: "font-sans font-semibold tracking-wide uppercase",
    effect: "Uses a crisp sans-serif hierarchy with direct, compact labels.",
  },
  "editorial-serif": {
    displayClass: "font-blueprint-editorial font-medium tracking-tight",
    bodyClass: "font-blueprint-editorial",
    labelClass: "font-sans font-semibold tracking-[0.16em] uppercase",
    effect: "Uses expressive serif headlines and body copy with publication-style labels.",
  },
  "friendly-rounded": {
    displayClass: "font-blueprint-rounded font-semibold tracking-tight",
    bodyClass: "font-blueprint-rounded",
    labelClass: "font-blueprint-rounded font-bold tracking-wide",
    effect: "Uses soft, open letterforms and friendly supporting labels.",
  },
  "expressive-contrast": {
    displayClass: "font-blueprint-editorial font-black tracking-[-0.04em]",
    bodyClass: "font-sans",
    labelClass: "font-mono font-semibold tracking-[0.14em] uppercase",
    effect: "Pairs a dramatic serif display with restrained sans-serif body copy.",
  },
} satisfies Record<TypographyDirection, TypographyTokens>

const GEOMETRY_TOKENS = {
  minimal: {
    canvasClass: "rounded-none border",
    heroClass: "border-b py-8 text-left",
    sectionClass: "rounded-none border-l-2 px-5 py-4",
    sectionGapClass: "space-y-8",
    effect: "Uses open space, square edges, and restrained rules.",
  },
  bold: {
    canvasClass: "rounded-none border-4",
    heroClass: "border-b-4 py-7 text-left",
    sectionClass: "rounded-none border-2 px-5 py-5 shadow-[5px_5px_0_currentColor]",
    sectionGapClass: "space-y-7",
    effect: "Uses heavy borders, assertive scale, and high-impact section blocks.",
  },
  elegant: {
    canvasClass: "rounded-sm border",
    heroClass: "border-b py-10 text-center",
    sectionClass: "rounded-sm border px-6 py-5",
    sectionGapClass: "space-y-9",
    effect: "Uses fine details, centered balance, and measured spacing.",
  },
  playful: {
    canvasClass: "rounded-[2rem] border-2",
    heroClass: "rounded-t-[1.85rem] border-b-2 py-8 text-left",
    sectionClass: "rounded-2xl border-2 px-5 py-5 shadow-sm",
    sectionGapClass: "space-y-6",
    effect: "Uses rounded shapes, lively offsets, and energetic section cards.",
  },
  organic: {
    canvasClass: "rounded-[3rem_1rem_3rem_1rem] border",
    heroClass: "rounded-t-[2.9rem] border-b py-10 text-left",
    sectionClass: "rounded-[2rem_0.75rem_2rem_0.75rem] border px-6 py-5",
    sectionGapClass: "space-y-7",
    effect: "Uses flowing curves, softer edges, and layered natural surfaces.",
  },
} satisfies Record<VisualDirection, GeometryTokens>

const PERSONALITY_TOKENS = {
  confident: {
    accentClass: "rounded-sm font-bold uppercase",
    effect: "Adds assured weight and decisive capitalization to accent cues.",
  },
  curious: {
    accentClass: "-rotate-1 rounded-lg border-dashed",
    effect: "Adds an exploratory offset and dashed detail to accent cues.",
  },
  refined: {
    accentClass: "rounded-none border-current/40 bg-transparent",
    effect: "Adds restrained fine rules to accent cues.",
  },
  playful: {
    accentClass: "rotate-1 rounded-full",
    effect: "Adds a lively rotation and pill shape to accent cues.",
  },
  grounded: {
    accentClass: "rounded-sm border-b-4",
    effect: "Adds a stable baseline and solid shape to accent cues.",
  },
  bold: {
    accentClass: "scale-105 rounded-none font-black uppercase",
    effect: "Adds stronger scale, weight, and contrast to accent cues.",
  },
  warm: {
    accentClass: "rounded-full px-4",
    effect: "Adds a softer, more welcoming curve to accent cues.",
  },
  precise: {
    accentClass: "rounded-none tracking-widest uppercase",
    effect: "Adds exact edges and systematic tracking to accent cues.",
  },
} satisfies Record<PersonalityTrait, PersonalityTokens>

function rationaleLabel<T extends string>(
  options: readonly { id: T; label: string }[],
  value: T,
) {
  return options.find((option) => option.id === value)?.label ?? value
}

export function resolveBlueprintPresentation(draft: BlueprintDraft): BlueprintPresentationProfile {
  const { answers } = draft.config
  const colorId = answers.colorDirection ?? "neutral"
  const typographyId = answers.typographyDirection ?? "modern-sans"
  const visualId = answers.visualDirection ?? "minimal"
  const colorFallback = answers.colorDirection === null
  const typographyFallback = answers.typographyDirection === null
  const visualFallback = answers.visualDirection === null
  const personalityFallback = answers.personalityTraits.length === 0
  const template = TEMPLATE_TOKENS[draft.template]
  const palette = PALETTE_TOKENS[colorId]
  const typography = TYPOGRAPHY_TOKENS[typographyId]
  const geometry = GEOMETRY_TOKENS[visualId]
  const modifiers = answers.personalityTraits.map((id) => ({
    id,
    label: rationaleLabel(PERSONALITY_TRAIT_OPTIONS, id),
    ...PERSONALITY_TOKENS[id],
  }))

  return {
    template: { id: draft.template, ...template },
    palette: { id: colorId, fallback: colorFallback, ...palette },
    typography: { id: typographyId, fallback: typographyFallback, ...typography },
    geometry: { id: visualId, fallback: visualFallback, ...geometry },
    personality: { modifiers, fallback: personalityFallback },
    rationale: [
      {
        dimension: "template",
        label: rationaleLabel(TEMPLATE_OPTIONS, draft.template),
        effect: template.effect,
        fallback: false,
      },
      {
        dimension: "visual",
        label: rationaleLabel(VISUAL_DIRECTION_OPTIONS, visualId),
        effect: geometry.effect,
        fallback: visualFallback,
      },
      {
        dimension: "color",
        label: rationaleLabel(COLOR_DIRECTION_OPTIONS, colorId),
        effect: palette.effect,
        fallback: colorFallback,
      },
      {
        dimension: "typography",
        label: rationaleLabel(TYPOGRAPHY_DIRECTION_OPTIONS, typographyId),
        effect: typography.effect,
        fallback: typographyFallback,
      },
      ...(modifiers.length > 0
        ? modifiers.map((modifier) => ({
            dimension: "personality" as const,
            label: modifier.label,
            effect: modifier.effect,
            fallback: false,
          }))
        : [
            {
              dimension: "personality" as const,
              label: "Neutral personality accents",
              effect: "Keeps accent cues restrained until personality traits are selected.",
              fallback: true,
            },
          ]),
    ],
  }
}
