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
  offerAudience: "Precision services for clients who value a calm visit",
  personalityTraits: ["confident"],
  visualDirection: "minimal",
  colorDirection: "neutral",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear"],
  alwaysCommunicate: "thoughtful expertise and care",
  avoid: "",
}

function relativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)!
    .map((channel) => Number.parseInt(channel, 16) / 255)
    .map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    )

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(first: string, second: string) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second))
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second))
  return (lighter + 0.05) / (darker + 0.05)
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
      expect(profile.geometry).toMatchObject({
        mediaFrameClass: expect.any(String),
        serviceCardClass: expect.any(String),
        actionClass: expect.any(String),
        dividerClass: expect.any(String),
        accentShapeClass: expect.any(String),
      })
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
      expect(profile.typography).toMatchObject({
        displayClass: expect.any(String),
        bodyClass: expect.any(String),
        labelClass: expect.any(String),
        serviceClass: expect.any(String),
        actionClass: expect.any(String),
      })
    }
    for (const personalityTrait of PERSONALITY_TRAITS) {
      const profile = resolveBlueprintPresentation(
        createDraft({ personalityTraits: [personalityTrait] }),
      )
      expect(profile.personality.modifiers[0]?.id).toBe(personalityTrait)
      expect(profile.personality.fallback).toBe(false)
    }
  })

  it("keeps stable persisted IDs while resolving salon-specific compositions", () => {
    const expected = {
      editorial: "Campaign masthead",
      studio: "Service index",
      warm: "Human introduction",
    } as const

    for (const template of TEMPLATE_IDS) {
      const resolved = resolveBlueprintPresentation({ ...createDraft(), template }).template
      expect(resolved.id).toBe(template)
      expect(resolved.composition).toContain(expected[template])
      expect(resolved.effect).toMatch(/salon/i)
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

  it("gives every salon palette accessible primary and action contrast", () => {
    for (const colorDirection of COLOR_DIRECTIONS) {
      const { contrastColors } = resolveBlueprintPresentation(
        createDraft({ colorDirection }),
      ).palette

      expect(
        contrastRatio(contrastColors.surface, contrastColors.text),
        `${colorDirection} text on surface`,
      ).toBeGreaterThanOrEqual(4.5)
      expect(
        contrastRatio(contrastColors.accent, contrastColors.accentText),
        `${colorDirection} action text on accent`,
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("uses an inclusive cobalt-and-lime vibrant system instead of a pink default", () => {
    const vibrant = resolveBlueprintPresentation(createDraft({ colorDirection: "vibrant" }))
      .palette
    const trustedClasses = [
      vibrant.canvasClass,
      vibrant.surfaceClass,
      vibrant.softSurfaceClass,
      vibrant.textClass,
      vibrant.mutedTextClass,
      vibrant.borderClass,
      vibrant.accentClass,
      vibrant.accentTextClass,
    ].join(" ")

    expect(trustedClasses).toMatch(/indigo/)
    expect(trustedClasses).toMatch(/lime/)
    expect(trustedClasses).not.toMatch(/pink|fuchsia|rose/)
  })

  it("changes five salon treatment categories for every visual direction", () => {
    const profiles = VISUAL_DIRECTIONS.map((visualDirection) =>
      resolveBlueprintPresentation(createDraft({ visualDirection })),
    )

    for (const field of [
      "mediaFrameClass",
      "serviceCardClass",
      "actionClass",
      "dividerClass",
      "accentShapeClass",
    ] as const) {
      expect(new Set(profiles.map((profile) => profile.geometry[field])).size, field).toBe(
        VISUAL_DIRECTIONS.length,
      )
    }
  })

  it("changes display, service, and booking type roles for every typography direction", () => {
    const profiles = TYPOGRAPHY_DIRECTIONS.map((typographyDirection) =>
      resolveBlueprintPresentation(createDraft({ typographyDirection })),
    )

    for (const field of ["displayClass", "serviceClass", "actionClass"] as const) {
      expect(new Set(profiles.map((profile) => profile.typography[field])).size, field).toBe(
        TYPOGRAPHY_DIRECTIONS.length,
      )
    }
  })
})
