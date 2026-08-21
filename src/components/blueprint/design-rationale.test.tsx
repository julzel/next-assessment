import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { buildDeterministicContent } from "@/lib/blueprint/content"
import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import { resolveBlueprintPresentation } from "@/lib/blueprint/presentation"
import type { BrandAnswers, BlueprintDraft } from "@/lib/blueprint/types"

import { DesignRationale } from "./design-rationale"

const answers: BrandAnswers = {
  offerAudience: "Precision services for clients who value a calm visit",
  personalityTraits: ["confident", "precise"],
  visualDirection: "elegant",
  colorDirection: "earthy",
  typographyDirection: "editorial-serif",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "thoughtful expertise and care",
  avoid: "pressure or beauty stereotypes",
}

function draft(config = { schemaVersion: 1 as const, answers, content: buildDeterministicContent(answers) }): BlueprintDraft {
  return {
    id: null,
    brandName: "Northstar",
    template: "editorial",
    config,
    createdAt: null,
    updatedAt: null,
  }
}

describe("DesignRationale", () => {
  afterEach(cleanup)

  it("explains every selected design and voice decision from the resolved profile", () => {
    render(<DesignRationale presentation={resolveBlueprintPresentation(draft())} />)
    const rationale = screen.getByText("Why this direction works").closest("section")!

    for (const label of [
      "Editorial Luxe",
      "Elegant",
      "Earthy",
      "Editorial serif",
      "Confident",
      "Precise",
      "Clear",
      "Thoughtful",
      "Message priority: thoughtful expertise and care",
      "Guardrail: avoid pressure or beauty stereotypes",
    ]) {
      expect(within(rationale).getByText(label)).not.toBeNull()
    }
    expect(
      within(rationale).getByText(/salon campaign frame, service story, booking cue/),
    ).not.toBeNull()
    for (const dimension of [
      "Composition",
      "Shape and rhythm",
      "Palette",
      "Type system",
      "Character cue",
      "Client communication",
    ]) {
      expect(within(rationale).getAllByText(dimension).length).toBeGreaterThan(0)
    }
    expect(rationale.querySelectorAll('[data-rationale-fallback="true"]')).toHaveLength(0)
  })

  it("labels incomplete visual and voice decisions as defaults rather than selections", () => {
    render(
      <DesignRationale
        presentation={resolveBlueprintPresentation(draft(createEmptyBlueprintConfig()))}
      />,
    )

    expect(screen.getByText("Default while undecided: Minimal")).not.toBeNull()
    expect(screen.getByText("Default while undecided: Neutral")).not.toBeNull()
    expect(screen.getByText("Default while undecided: Modern sans")).not.toBeNull()
    expect(screen.getByText("Default while undecided: Neutral personality accents")).not.toBeNull()
    expect(screen.getByText("Default while undecided: Neutral voice guidance")).not.toBeNull()
  })
})
