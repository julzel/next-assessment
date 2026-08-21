import {
  COLOR_DIRECTION_OPTIONS,
  PERSONALITY_TRAIT_OPTIONS,
  TEMPLATE_OPTIONS,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
  VOICE_TRAIT_OPTIONS,
} from "./options"
import {
  type BlueprintDraft,
  type ColorDirection,
  type PersonalityTrait,
  type TemplateId,
  type TypographyDirection,
  type VisualDirection,
  type VoiceTrait,
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
  contrastColors: {
    surface: string
    text: string
    accent: string
    accentText: string
  }
  effect: string
}

type TypographyTokens = {
  displayClass: string
  bodyClass: string
  labelClass: string
  serviceClass: string
  actionClass: string
  effect: string
}

type GeometryTokens = {
  canvasClass: string
  heroClass: string
  sectionClass: string
  sectionGapClass: string
  mediaFrameClass: string
  serviceCardClass: string
  actionClass: string
  dividerClass: string
  accentShapeClass: string
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
  dimension: "template" | "visual" | "color" | "typography" | "personality" | "voice"
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
  voice: {
    traits: readonly { id: VoiceTrait; label: string }[]
    alwaysCommunicate: string
    avoid: string
    fallback: boolean
  }
  rationale: readonly PresentationRationaleItem[]
}

const TEMPLATE_TOKENS = {
  editorial: {
    composition: "Campaign masthead, crafted service story, and editorial salon details.",
    effect:
      "Frames the salon like a considered beauty or wellness publication, with a campaign image treatment, signature-service emphasis, and a refined booking cue.",
  },
  studio: {
    composition: "Service index, modular proof grid, and a direct appointment path.",
    effect:
      "Organizes the salon as a contemporary working studio, making services, expertise, and the next appointment step precise and easy to scan.",
  },
  warm: {
    composition: "Human introduction, client-care moment, and approachable service flow.",
    effect:
      "Introduces the salon through human care, a recognizable client promise, and an inviting path from discovery to booking.",
  },
} satisfies Record<TemplateId, TemplateTokens>

const PALETTE_TOKENS = {
  neutral: {
    canvasClass: "bg-stone-100",
    surfaceClass: "bg-stone-50",
    softSurfaceClass: "bg-stone-200",
    textClass: "text-stone-950",
    mutedTextClass: "text-stone-700",
    borderClass: "border-stone-400",
    accentClass: "bg-stone-900",
    accentTextClass: "text-white",
    contrastColors: {
      surface: "#fafaf9",
      text: "#0c0a09",
      accent: "#1c1917",
      accentText: "#ffffff",
    },
    effect:
      "Uses warm stone surfaces, near-black text, and a restrained ink accent so salon craft and client information stay central.",
  },
  cool: {
    canvasClass: "bg-slate-100",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-cyan-100",
    textClass: "text-slate-950",
    mutedTextClass: "text-slate-700",
    borderClass: "border-teal-700",
    accentClass: "bg-teal-900",
    accentTextClass: "text-white",
    contrastColors: {
      surface: "#ffffff",
      text: "#020617",
      accent: "#134e4a",
      accentText: "#ffffff",
    },
    effect:
      "Uses clean slate, mineral cyan, and deep teal to give services and booking guidance a precise, contemporary calm.",
  },
  warm: {
    canvasClass: "bg-amber-50",
    surfaceClass: "bg-orange-50",
    softSurfaceClass: "bg-amber-100",
    textClass: "text-stone-950",
    mutedTextClass: "text-stone-700",
    borderClass: "border-orange-400",
    accentClass: "bg-orange-900",
    accentTextClass: "text-white",
    contrastColors: {
      surface: "#fff7ed",
      text: "#0c0a09",
      accent: "#7c2d12",
      accentText: "#ffffff",
    },
    effect:
      "Uses sunlit cream, soft amber, and deep terracotta to make client-care moments feel warm without becoming overly decorative.",
  },
  earthy: {
    canvasClass: "bg-stone-100",
    surfaceClass: "bg-amber-50",
    softSurfaceClass: "bg-lime-100",
    textClass: "text-stone-950",
    mutedTextClass: "text-green-900",
    borderClass: "border-lime-700",
    accentClass: "bg-green-900",
    accentTextClass: "text-lime-50",
    contrastColors: {
      surface: "#fffbeb",
      text: "#0c0a09",
      accent: "#14532d",
      accentText: "#f7fee7",
    },
    effect:
      "Uses sand, botanical lime, and forest green to support a grounded, tactile salon experience with clear service contrast.",
  },
  vibrant: {
    canvasClass: "bg-indigo-50",
    surfaceClass: "bg-white",
    softSurfaceClass: "bg-lime-200",
    textClass: "text-slate-950",
    mutedTextClass: "text-indigo-900",
    borderClass: "border-indigo-500",
    accentClass: "bg-indigo-900",
    accentTextClass: "text-lime-200",
    contrastColors: {
      surface: "#ffffff",
      text: "#020617",
      accent: "#312e81",
      accentText: "#d9f99d",
    },
    effect:
      "Uses electric lime against deep cobalt and clean white for energetic salon campaigns without defaulting to stereotyped pink.",
  },
} satisfies Record<ColorDirection, PaletteTokens>

const TYPOGRAPHY_TOKENS = {
  "modern-sans": {
    displayClass: "font-sans font-bold tracking-tight",
    bodyClass: "font-sans",
    labelClass: "font-sans font-semibold tracking-wide uppercase",
    serviceClass: "font-sans font-semibold tracking-tight",
    actionClass: "font-sans text-xs font-bold tracking-[0.14em] uppercase",
    effect:
      "Uses crisp sans-serif display and body type, compact service headings, and direct uppercase booking cues.",
  },
  "editorial-serif": {
    displayClass: "font-blueprint-editorial font-medium tracking-tight",
    bodyClass: "font-blueprint-editorial",
    labelClass: "font-sans font-semibold tracking-[0.16em] uppercase",
    serviceClass: "font-blueprint-editorial text-lg italic",
    actionClass: "font-sans text-xs font-semibold tracking-[0.18em] uppercase",
    effect:
      "Uses expressive serif display and service type with precise sans-serif labels and booking cues, creating a crafted editorial rhythm.",
  },
  "friendly-rounded": {
    displayClass: "font-blueprint-rounded font-semibold tracking-tight",
    bodyClass: "font-blueprint-rounded",
    labelClass: "font-blueprint-rounded font-bold tracking-wide",
    serviceClass: "font-blueprint-rounded font-semibold",
    actionClass: "font-blueprint-rounded text-xs font-bold tracking-wide",
    effect:
      "Uses soft rounded display, body, service, and action type so client guidance feels conversational and approachable.",
  },
  "expressive-contrast": {
    displayClass: "font-blueprint-editorial font-black tracking-[-0.04em]",
    bodyClass: "font-sans",
    labelClass: "font-mono font-semibold tracking-[0.14em] uppercase",
    serviceClass: "font-sans font-bold tracking-tight",
    actionClass: "font-mono text-xs font-bold tracking-[0.16em] uppercase",
    effect:
      "Pairs dramatic serif display type with restrained sans-serif copy, strong service headings, and precise mono booking cues.",
  },
} satisfies Record<TypographyDirection, TypographyTokens>

export function getTypographyPreviewClasses(direction: TypographyDirection) {
  const { displayClass, bodyClass, labelClass, serviceClass, actionClass } =
    TYPOGRAPHY_TOKENS[direction]

  return { displayClass, bodyClass, labelClass, serviceClass, actionClass }
}

const GEOMETRY_TOKENS = {
  minimal: {
    canvasClass: "rounded-none border",
    heroClass: "border-b py-10 text-left",
    sectionClass: "rounded-none border-0 border-t px-0 py-6",
    sectionGapClass: "space-y-10",
    mediaFrameClass: "blueprint-media-minimal aspect-[4/5] rounded-none border",
    serviceCardClass: "rounded-none border-y px-0 py-4",
    actionClass: "rounded-none border px-4 py-2",
    dividerClass: "h-px w-full bg-current opacity-30",
    accentShapeClass: "size-9 rounded-none border",
    effect:
      "Uses generous whitespace, square campaign crops, restrained rules, open service rows, and a quiet outlined booking cue.",
  },
  bold: {
    canvasClass: "rounded-none border-4",
    heroClass: "border-b-4 py-7 text-left",
    sectionClass: "rounded-none border-2 px-5 py-5 shadow-[5px_5px_0_currentColor]",
    sectionGapClass: "space-y-7",
    mediaFrameClass:
      "blueprint-media-bold aspect-square rounded-none border-4 shadow-[8px_8px_0_currentColor]",
    serviceCardClass: "rounded-none border-2 p-4 shadow-[4px_4px_0_currentColor]",
    actionClass: "rounded-none border-2 px-4 py-2 shadow-[3px_3px_0_currentColor]",
    dividerClass: "h-1 w-full bg-current",
    accentShapeClass: "size-10 rotate-6 rounded-none border-4",
    effect:
      "Uses heavy campaign frames, assertive scale, block-like service cards, thick dividers, and a high-impact booking cue.",
  },
  elegant: {
    canvasClass: "rounded-[1.5rem] border",
    heroClass: "border-b py-12 text-center",
    sectionClass: "rounded-xl border px-6 py-6",
    sectionGapClass: "space-y-10",
    mediaFrameClass: "blueprint-media-elegant aspect-[3/4] rounded-t-full border",
    serviceCardClass: "rounded-sm border px-5 py-5",
    actionClass: "rounded-full border px-5 py-2",
    dividerClass: "mx-auto h-px w-20 bg-current opacity-40",
    accentShapeClass: "size-10 rotate-45 rounded-sm border",
    effect:
      "Uses arched campaign framing, centered balance, fine dividers, measured service cards, and a polished pill-shaped booking cue.",
  },
  playful: {
    canvasClass: "rounded-[2rem] border-2",
    heroClass: "rounded-t-[1.85rem] border-b-2 py-8 text-left",
    sectionClass: "rounded-2xl border-2 px-5 py-5 shadow-sm",
    sectionGapClass: "space-y-6",
    mediaFrameClass:
      "blueprint-media-playful aspect-square rotate-1 rounded-[2rem_0.75rem_2rem_0.75rem] border-2",
    serviceCardClass: "rounded-2xl border-2 p-4 shadow-sm",
    actionClass: "-rotate-1 rounded-full border-2 px-5 py-2",
    dividerClass: "h-2 w-20 rounded-full bg-current",
    accentShapeClass: "size-11 -rotate-6 rounded-full border-2",
    effect:
      "Uses lively campaign shapes, rounded service cards, energetic dividers, friendly offsets, and a playful booking pill.",
  },
  organic: {
    canvasClass: "rounded-[3rem_1rem_3rem_1rem] border",
    heroClass: "rounded-t-[2.9rem] border-b py-10 text-left",
    sectionClass: "rounded-[2rem_0.75rem_2rem_0.75rem] border px-6 py-5",
    sectionGapClass: "space-y-7",
    mediaFrameClass:
      "blueprint-media-organic aspect-[4/5] rounded-[48%_48%_30%_30%] border",
    serviceCardClass: "rounded-[2rem_0.75rem_2rem_0.75rem] border p-5",
    actionClass: "rounded-[999px_1rem_999px_999px] border px-5 py-2",
    dividerClass: "blueprint-organic-divider h-3 w-full",
    accentShapeClass: "blueprint-organic-mark size-11 rounded-[60%_40%_65%_35%] border",
    effect:
      "Uses botanical campaign curves, flowing dividers, layered service surfaces, leaf-like accents, and a soft rounded booking cue.",
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

function rationaleEffect<T extends string>(
  options: readonly { id: T; effect: string }[],
  value: T,
) {
  return options.find((option) => option.id === value)?.effect ?? "Applies the selected direction."
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
  const voiceTraits = answers.voiceTraits.map((id) => ({
    id,
    label: rationaleLabel(VOICE_TRAIT_OPTIONS, id),
  }))
  const voiceFallback =
    voiceTraits.length === 0 && answers.alwaysCommunicate.trim() === "" && answers.avoid.trim() === ""

  return {
    template: { id: draft.template, ...template },
    palette: { id: colorId, fallback: colorFallback, ...palette },
    typography: { id: typographyId, fallback: typographyFallback, ...typography },
    geometry: { id: visualId, fallback: visualFallback, ...geometry },
    personality: { modifiers, fallback: personalityFallback },
    voice: {
      traits: voiceTraits,
      alwaysCommunicate: answers.alwaysCommunicate,
      avoid: answers.avoid,
      fallback: voiceFallback,
    },
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
      ...(voiceTraits.length > 0
        ? voiceTraits.map((trait) => ({
            dimension: "voice" as const,
            label: trait.label,
            effect: rationaleEffect(VOICE_TRAIT_OPTIONS, trait.id),
            fallback: false,
          }))
        : []),
      ...(answers.alwaysCommunicate.trim()
        ? [
            {
              dimension: "voice" as const,
              label: `Message priority: ${answers.alwaysCommunicate.trim()}`,
              effect: "Makes this idea a recurring promise in the audience and voice modules.",
              fallback: false,
            },
          ]
        : []),
      ...(answers.avoid.trim()
        ? [
            {
              dimension: "voice" as const,
              label: `Guardrail: avoid ${answers.avoid.trim()}`,
              effect: "Turns the stated boundary into a visible brand guardrail.",
              fallback: false,
            },
          ]
        : []),
      ...(voiceFallback
        ? [
            {
              dimension: "voice" as const,
              label: "Neutral voice guidance",
              effect: "Keeps messaging guidance open until voice decisions are selected.",
              fallback: true,
            },
          ]
        : []),
    ],
  }
}
