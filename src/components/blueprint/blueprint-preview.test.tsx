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
    expect(screen.getAllByText("Earthy").length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Editorial serif/).length).toBeGreaterThan(0)
  })

  it("uses a distinct trusted renderer for every template while keeping the document contract", () => {
    const renderers = [
      ["editorial", "Editorial blueprint", "editorial-narrative", "editorial-flow"],
      ["studio", "Studio blueprint", "studio-system-board", "modular-grid"],
      ["warm", "Warm blueprint", "warm-story-flow", "story-flow"],
    ] as const

    for (const [template, label, composition, sectionLayout] of renderers) {
      const view = render(<BlueprintPreview draft={{ ...draft, template }} />)
      expect(screen.getByText(label)).not.toBeNull()
      expect(screen.getByText("Audience & promise")).not.toBeNull()
      expect(screen.getByText("Voice & tone")).not.toBeNull()
      expect(view.container.querySelector(`[data-composition="${composition}"]`)).not.toBeNull()
      expect(view.container.querySelector(`[data-section-layout="${sectionLayout}"]`)).not.toBeNull()
      expect(view.container.querySelector('[data-presentation-surface="canvas"]')?.className).toContain(
        "bg-amber-50",
      )
      expect(screen.getByRole("heading", { level: 1 }).className).toContain(
        "font-blueprint-editorial",
      )
      expect(view.container.querySelector('[data-personality="precise"]')).not.toBeNull()
      expect(screen.getByText(draft.config.content.essence)).not.toBeNull()
      expect(screen.getByText(draft.config.content.audiencePromise)).not.toBeNull()
      expect(screen.getByText(draft.config.content.personality)).not.toBeNull()
      expect(screen.getByText(draft.config.content.visualDirection)).not.toBeNull()
      expect(screen.getByText(draft.config.content.voiceTone)).not.toBeNull()
      expect(screen.getByText(draft.config.content.guardrail!)).not.toBeNull()
      expect(screen.getByText("calm expertise")).not.toBeNull()
      expect(screen.getByText("Avoid: empty buzzwords")).not.toBeNull()
      expect(screen.getByText("Why this direction works")).not.toBeNull()
      view.unmount()
    }
  })

  it("applies visual-system changes to every composition", () => {
    for (const template of ["editorial", "studio", "warm"] as const) {
      const initialAnswers: BrandAnswers = {
        ...answers,
        colorDirection: "neutral",
        typographyDirection: "modern-sans",
        visualDirection: "minimal",
      }
      const view = render(
        <BlueprintPreview
          draft={{
            ...draft,
            template,
            config: {
              ...draft.config,
              answers: initialAnswers,
              content: buildDeterministicContent(initialAnswers),
            },
          }}
        />,
      )
      expect(
        view.container.querySelector('[data-presentation-surface="canvas"]')?.className,
      ).toContain("bg-stone-100")
      expect(screen.getByRole("heading", { level: 1 }).className).toContain("font-sans")

      const changedAnswers: BrandAnswers = {
        ...answers,
        colorDirection: "vibrant",
        typographyDirection: "editorial-serif",
        visualDirection: "playful",
      }
      view.rerender(
        <BlueprintPreview
          draft={{
            ...draft,
            template,
            config: {
              ...draft.config,
              answers: changedAnswers,
              content: buildDeterministicContent(changedAnswers),
            },
          }}
        />,
      )
      const canvas = view.container.querySelector('[data-presentation-surface="canvas"]')
      expect(canvas?.className).toContain("bg-fuchsia-50")
      expect(canvas?.className).toContain("rounded-[2rem]")
      expect(screen.getByRole("heading", { level: 1 }).className).toContain(
        "font-blueprint-editorial",
      )
      view.unmount()
    }
  })

  it("applies resolved Editorial color, type, geometry, and personality to the artifact", () => {
    const { container, rerender } = render(
      <BlueprintPreview
        draft={{
          ...draft,
          config: {
            ...draft.config,
            answers: {
              ...answers,
              colorDirection: "neutral",
              typographyDirection: "modern-sans",
              visualDirection: "minimal",
              personalityTraits: ["confident"],
            },
          },
        }}
      />,
    )
    const neutralCanvas = container.querySelector('[data-presentation-surface="canvas"]')
    expect(neutralCanvas?.className).toContain("bg-stone-100")
    expect(neutralCanvas?.className).toContain("rounded-none")
    expect(screen.getByRole("heading", { level: 1 }).className).toContain("font-sans")
    expect(container.querySelector('[data-personality="confident"]')?.className).toContain(
      "uppercase",
    )

    rerender(
      <BlueprintPreview
        draft={{
          ...draft,
          config: {
            ...draft.config,
            answers: {
              ...answers,
              colorDirection: "vibrant",
              typographyDirection: "editorial-serif",
              visualDirection: "playful",
              personalityTraits: ["playful"],
            },
          },
        }}
      />,
    )

    const playfulCanvas = container.querySelector('[data-presentation-surface="canvas"]')
    expect(playfulCanvas?.className).toContain("bg-fuchsia-50")
    expect(playfulCanvas?.className).toContain("rounded-[2rem]")
    expect(screen.getByRole("heading", { level: 1 }).className).toContain(
      "font-blueprint-editorial",
    )
    expect(container.querySelector('[data-personality="playful"]')?.className).toContain("rotate-1")
    expect(screen.getByText(draft.config.content.audiencePromise)).not.toBeNull()
  })

  it("exposes stable resolved presentation semantics and updates deterministic content", () => {
    const nextAnswers = { ...answers, colorDirection: "vibrant" as const }
    const { container } = render(
      <BlueprintPreview
        draft={{
          ...draft,
          config: {
            ...draft.config,
            answers: nextAnswers,
            content: buildDeterministicContent(nextAnswers),
          },
        }}
      />,
    )
    const preview = container.querySelector("[data-blueprint-preview]")

    expect(preview?.getAttribute("data-template")).toBe("editorial")
    expect(preview?.getAttribute("data-visual-direction")).toBe("elegant")
    expect(preview?.getAttribute("data-color-direction")).toBe("vibrant")
    expect(preview?.getAttribute("data-typography-direction")).toBe("editorial-serif")
    expect(screen.getByText(/vibrant-leaning color/)).not.toBeNull()
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
    for (const template of ["editorial", "studio", "warm"] as const) {
      const view = render(
        <BlueprintPreview
          fullPreview
          draft={{
            ...draft,
            template,
            config: {
              ...draft.config,
              answers: { ...answers, avoid: "" },
              content: { ...draft.config.content, guardrail: null },
            },
          }}
        />,
      )

      expect(screen.queryByText("Brand guardrail")).toBeNull()
      view.unmount()
    }
  })
})
