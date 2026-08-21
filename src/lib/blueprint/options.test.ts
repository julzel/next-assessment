import { describe, expect, it } from "vitest"

import {
  COLOR_DIRECTION_OPTIONS,
  PERSONALITY_TRAIT_OPTIONS,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
  VOICE_TRAIT_OPTIONS,
} from "./options"
import {
  COLOR_DIRECTIONS,
  PERSONALITY_TRAITS,
  TYPOGRAPHY_DIRECTIONS,
  VISUAL_DIRECTIONS,
  VOICE_TRAITS,
} from "./types"

const SALON_CONTEXT =
  /salon|client|service|booking|appointment|visit|care|campaign|social|website|print/i

describe("blueprint option metadata", () => {
  it("keeps every persisted answer ID stable", () => {
    expect(PERSONALITY_TRAIT_OPTIONS.map(({ id }) => id)).toEqual(PERSONALITY_TRAITS)
    expect(VISUAL_DIRECTION_OPTIONS.map(({ id }) => id)).toEqual(VISUAL_DIRECTIONS)
    expect(COLOR_DIRECTION_OPTIONS.map(({ id }) => id)).toEqual(COLOR_DIRECTIONS)
    expect(TYPOGRAPHY_DIRECTION_OPTIONS.map(({ id }) => id)).toEqual(TYPOGRAPHY_DIRECTIONS)
    expect(VOICE_TRAIT_OPTIONS.map(({ id }) => id)).toEqual(VOICE_TRAITS)
  })

  it("gives every answer a concrete salon-relevant meaning or consequence", () => {
    const options = [
      ...PERSONALITY_TRAIT_OPTIONS,
      ...VISUAL_DIRECTION_OPTIONS,
      ...COLOR_DIRECTION_OPTIONS,
      ...TYPOGRAPHY_DIRECTION_OPTIONS,
      ...VOICE_TRAIT_OPTIONS,
    ]

    for (const option of options) {
      expect(`${option.description} ${option.effect}`, option.id).toMatch(SALON_CONTEXT)
    }
  })

  it("does not encode gendered salon defaults in the trusted option copy", () => {
    const copy = [
      ...PERSONALITY_TRAIT_OPTIONS,
      ...VISUAL_DIRECTION_OPTIONS,
      ...COLOR_DIRECTION_OPTIONS,
      ...TYPOGRAPHY_DIRECTION_OPTIONS,
      ...VOICE_TRAIT_OPTIONS,
    ]
      .flatMap(({ description, effect }) => [description, effect])
      .join(" ")

    expect(copy).not.toMatch(/for women|for men|feminine|masculine|girly/i)
  })
})
