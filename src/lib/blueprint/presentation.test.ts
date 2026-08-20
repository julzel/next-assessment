import { describe, expect, it } from "vitest"

import { buildDeterministicContent } from "./content"
import { createEmptyBlueprintConfig } from "./defaults"
import { resolveBlueprintPresentation } from "./presentation"
import {
  COLOR_DIRECTIONS,
  PERSONALITY_TRAITS,
  TEMPLATE_IDS,
  TYPOGRAPHY_DIRECTIONS,
  VISUAL_DIRECTIONS,
  type BrandAnswers,
  type BlueprintDraft,
} from "./types"

const answers: BrandAnswers = {
  offerAudience: "Independent founders building thoughtful products",
  personalityTraits: ["confident"],
  visualDirection: "minimal",
  colorDirection: "neutral",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear"],
  alwaysCommunicate: "calm expertise",
  avoid: "",
}

function createDraft(answerOverrides: Partial<BrandAnswers> = {}): BlueprintDraft {
  const nextAnswers = { ...answers, ...answerOverrides }

  return {
    id: null,
    brandName: "Northstar",
    template: "editorial",
    config: {
      schemaVersion: 1,
      answers: nextAnswers,
      content: buildDeterministicContent(nextAnswers),
    },
    createdAt: null,
    updatedAt: null,
  }
}

describe("resolveBlueprintPresentation", () => {
  it("resolves every closed presentation enum through a trusted registry", () => {
    for (const template of TEMPLATE_IDS) {
      expect(resolveBlueprintPresentation({ ...createDraft(), template }).template.id).toBe(template)
    }
    for (const visualDirection of VISUAL_DIRECTIONS) {
      const profile = resolveBlueprintPresentation(createDraft({ visualDirection }))
      expect(profile.geometry.id).toBe(visualDirection)
      expect(profile.geometry.fallback).toBe(false)
    }
    for (const colorDirection of COLOR_DIRECTIONS) {
      const profile = resolveBlueprintPresentation(createDraft({ colorDirection }))
      expect(profile.palette.id).toBe(colorDirection)
      expect(profile.palette.fallback).toBe(false)
    }
    for (const typographyDirection of TYPOGRAPHY_DIRECTIONS) {
      const profile = resolveBlueprintPresentation(createDraft({ typographyDirection }))
      expect(profile.typography.id).toBe(typographyDirection)
      expect(profile.typography.fallback).toBe(false)
    }
    for (const personalityTrait of PERSONALITY_TRAITS) {
      const profile = resolveBlueprintPresentation(
        createDraft({ personalityTraits: [personalityTrait] }),
      )
      expect(profile.personality.modifiers[0]?.id).toBe(personalityTrait)
      expect(profile.personality.fallback).toBe(false)
    }
  })

  it("uses described neutral presentation fallbacks for an incomplete draft", () => {
    const profile = resolveBlueprintPresentation({
      ...createDraft(),
      config: createEmptyBlueprintConfig(),
    })

    expect(profile.palette).toMatchObject({ id: "neutral", fallback: true })
    expect(profile.typography).toMatchObject({ id: "modern-sans", fallback: true })
    expect(profile.geometry).toMatchObject({ id: "minimal", fallback: true })
    expect(profile.personality).toMatchObject({ modifiers: [], fallback: true })
    expect(profile.rationale.filter((item) => item.fallback).map((item) => item.dimension)).toEqual([
      "visual",
      "color",
      "typography",
      "personality",
      "voice",
    ])
  })

  it("changes palette, typography, geometry, and emphasis independently", () => {
    const base = resolveBlueprintPresentation(createDraft())
    const vibrant = resolveBlueprintPresentation(createDraft({ colorDirection: "vibrant" }))
    const editorial = resolveBlueprintPresentation(
      createDraft({ typographyDirection: "editorial-serif" }),
    )
    const playful = resolveBlueprintPresentation(createDraft({ visualDirection: "playful" }))
    const bold = resolveBlueprintPresentation(createDraft({ personalityTraits: ["bold"] }))

    expect(vibrant.palette.canvasClass).not.toBe(base.palette.canvasClass)
    expect(vibrant.typography.displayClass).toBe(base.typography.displayClass)
    expect(editorial.typography.displayClass).not.toBe(base.typography.displayClass)
    expect(editorial.geometry.sectionClass).toBe(base.geometry.sectionClass)
    expect(playful.geometry.sectionClass).not.toBe(base.geometry.sectionClass)
    expect(playful.palette.canvasClass).toBe(base.palette.canvasClass)
    expect(bold.personality.modifiers[0]?.accentClass).not.toBe(
      base.personality.modifiers[0]?.accentClass,
    )
  })
})
