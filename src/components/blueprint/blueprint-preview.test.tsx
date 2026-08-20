import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BrandAnswers, BlueprintDraft } from "@/lib/blueprint/types"

import { BlueprintPreview } from "./blueprint-preview"

const answers: BrandAnswers = {
  offerAudience: "Independent founders building thoughtful products",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "elegant",
  colorDirection: "earthy",
  typographyDirection: "editorial-serif",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "calm expertise",
  avoid: "empty buzzwords",
}

const draft: BlueprintDraft = {
  id: null,
  brandName: "Northstar",
  template: "editorial",
  config: { schemaVersion: 1, answers, content: buildDeterministicContent(answers) },
  createdAt: null,
  updatedAt: null,
}

describe("BlueprintPreview", () => {
  afterEach(cleanup)

  it("renders the six curated blueprint sections", () => {
    render(<BlueprintPreview draft={draft} />)

    for (const title of [
      "Brand header",
      "Audience & promise",
      "Personality",
      "Visual direction",
      "Voice & tone",
      "Brand guardrail",
    ]) {
      expect(screen.getByText(title)).not.toBeNull()
    }
    expect(screen.getByText("Avoid empty buzzwords.")).not.toBeNull()
    expect(screen.getByText("Earthy")).not.toBeNull()
    expect(screen.getByText(/Editorial serif/)).not.toBeNull()
  })

  it("uses a distinct trusted renderer for every template while keeping the document contract", () => {
    const renderers = [
      ["editorial", "Editorial blueprint"],
      ["studio", "Studio blueprint"],
      ["warm", "Warm blueprint"],
    ] as const

    for (const [template, label] of renderers) {
      const view = render(<BlueprintPreview draft={{ ...draft, template }} />)
      expect(screen.getByText(label)).not.toBeNull()
      expect(screen.getByText("Audience & promise")).not.toBeNull()
      expect(screen.getByText("Voice & tone")).not.toBeNull()
      view.unmount()
    }
  })

  it("keeps an intentional edit-preview prompt when the optional guardrail is blank", () => {
    render(
      <BlueprintPreview
        draft={{
          ...draft,
          config: {
            ...draft.config,
            answers: { ...answers, avoid: "" },
            content: { ...draft.config.content, guardrail: null },
          },
        }}
      />,
    )

    expect(
      screen.getByText("No guardrail yet — add one when the brand needs a clear boundary."),
    ).not.toBeNull()
  })

  it("omits an empty optional guardrail from full presentation mode", () => {
    render(
      <BlueprintPreview
        fullPreview
        draft={{
          ...draft,
          config: { ...draft.config, answers: { ...answers, avoid: "" }, content: { ...draft.config.content, guardrail: null } },
        }}
      />,
    )

    expect(screen.queryByText("Brand guardrail")).toBeNull()
  })
})
