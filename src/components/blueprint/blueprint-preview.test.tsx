import { cleanup, render, screen, within } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BrandAnswers, BlueprintDraft } from "@/lib/blueprint/types"

import { BlueprintPreview } from "./blueprint-preview"

const answers: BrandAnswers = {
  offerAudience: "Precision services for clients who value a calm visit",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "elegant",
  colorDirection: "earthy",
  typographyDirection: "editorial-serif",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "thoughtful expertise and care",
  avoid: "pressure or beauty stereotypes",
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
      "Salon positioning",
      "Client promise",
      "Salon character",
      "Salon visual direction",
      "Client-facing voice",
      "Communication guardrail",
    ]) {
      expect(screen.getByText(title)).not.toBeNull()
    }
    expect(
      screen.getByText("Avoid pressure or beauty stereotypes in client-facing communication."),
    ).not.toBeNull()
    expect(screen.getAllByText("Earthy").length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Editorial serif/).length).toBeGreaterThan(0)
  })

  it("uses a distinct trusted renderer for every template while keeping the document contract", () => {
    const renderers = [
      ["editorial", "Editorial Luxe", "editorial-narrative", "editorial-flow", "editorial-luxe"],
      ["studio", "Modern Studio", "studio-system-board", "modular-grid", "modern-studio"],
      ["warm", "Neighborhood Welcome", "warm-story-flow", "story-flow", "neighborhood-welcome"],
    ] as const

    for (const [template, label, composition, sectionLayout, direction] of renderers) {
      const view = render(<BlueprintPreview draft={{ ...draft, template }} />)
      expect(screen.getAllByText(label).length).toBeGreaterThan(0)
      expect(screen.getByText("Client promise")).not.toBeNull()
      expect(screen.getByText("Client-facing voice")).not.toBeNull()
      expect(view.container.querySelector(`[data-composition="${composition}"]`)).not.toBeNull()
      expect(view.container.querySelector(`[data-salon-direction="${direction}"]`)).not.toBeNull()
      expect(view.container.querySelector(`[data-section-layout="${sectionLayout}"]`)).not.toBeNull()
      expect(view.container.querySelector('[data-presentation-surface="canvas"]')?.className).toContain(
        "bg-stone-100",
      )
      expect(screen.getByRole("heading", { level: 2, name: "Northstar" }).className).toContain(
        "font-blueprint-editorial",
      )
      expect(view.container.querySelector('[data-personality="precise"]')).not.toBeNull()
      expect(screen.getByText(draft.config.content.essence)).not.toBeNull()
      expect(screen.getByText(draft.config.content.audiencePromise)).not.toBeNull()
      expect(screen.getByText(draft.config.content.personality)).not.toBeNull()
      expect(screen.getByText(draft.config.content.visualDirection)).not.toBeNull()
      expect(screen.getByText(draft.config.content.voiceTone)).not.toBeNull()
      expect(screen.getByText(draft.config.content.guardrail!)).not.toBeNull()
      expect(screen.getAllByText("thoughtful expertise and care").length).toBeGreaterThan(0)
      expect(screen.getByText("Avoid: pressure or beauty stereotypes")).not.toBeNull()
      expect(screen.getByText("Why this direction works")).not.toBeNull()
      view.unmount()
    }
  })

  it("gives every salon direction a distinct service, proof, care, and booking hierarchy", () => {
    const structures = {
      editorial: ["campaign-frame", "credentials-callout", "booking-cue"],
      studio: ["service-index", "expertise-proof", "appointment-path"],
      warm: ["client-care-moment", "booking-invitation"],
    } as const

    for (const template of ["editorial", "studio", "warm"] as const) {
      const view = render(<BlueprintPreview draft={{ ...draft, template }} />)
      for (const moduleName of structures[template]) {
        expect(
          view.container.querySelector(`[data-salon-module="${moduleName}"]`),
          `${template} should render ${moduleName}`,
        ).not.toBeNull()
      }
      expect(view.container.querySelector('[data-salon-module="service-card"]')).not.toBeNull()
      view.unmount()
    }
  })

  it("applies the resolved visual system to each template-owned service and action module", () => {
    const modulePairs = {
      editorial: ["campaign-frame", "booking-cue"],
      studio: ["expertise-proof", "appointment-path"],
      warm: ["client-care-moment", "booking-invitation"],
    } as const

    for (const template of ["editorial", "studio", "warm"] as const) {
      const view = render(<BlueprintPreview draft={{ ...draft, template }} />)
      const [surfaceModule, actionModule] = modulePairs[template]
      const surface = view.container.querySelector(`[data-salon-module="${surfaceModule}"]`)
      const action = view.container.querySelector(`[data-salon-module="${actionModule}"]`)

      expect(surface?.className).toMatch(/bg-(amber|lime)/)
      expect(surface?.className).toMatch(/border-lime/)
      expect(action?.className).toContain("bg-green-900")
      expect(action?.className).toContain("text-lime-50")
      view.unmount()
    }
  })

  it("keeps realistic long salon and service copy wrap-safe across all templates", () => {
    const brandName = "The Neighborhood Color, Texture, and Restorative Care Studio"
    const offerAudience =
      "Dimensional color, textured-hair shaping, and restorative care for clients who want a collaborative consultation and a calm appointment"
    const longAnswers = { ...answers, offerAudience }

    for (const template of ["editorial", "studio", "warm"] as const) {
      const view = render(
        <BlueprintPreview
          draft={{
            ...draft,
            brandName,
            template,
            config: {
              ...draft.config,
              answers: longAnswers,
              content: buildDeterministicContent(longAnswers),
            },
          }}
        />,
      )

      expect(screen.getByRole("heading", { level: 2, name: brandName })).not.toBeNull()
      expect(screen.getAllByText(offerAudience).length).toBeGreaterThan(0)
      expect(view.container.querySelector("article")?.className).toContain("overflow-hidden")
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
      expect(
        screen.getByRole("heading", { level: 2, name: "Northstar" }).className,
      ).toContain("font-sans")

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
      expect(canvas?.className).toContain("bg-indigo-50")
      expect(canvas?.className).toContain("rounded-[2rem]")
      expect(screen.getByRole("heading", { level: 2, name: "Northstar" }).className).toContain(
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
    expect(screen.getByRole("heading", { level: 2, name: "Northstar" }).className).toContain(
      "font-sans",
    )
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
    expect(playfulCanvas?.className).toContain("bg-indigo-50")
    expect(playfulCanvas?.className).toContain("rounded-[2rem]")
    expect(screen.getByRole("heading", { level: 2, name: "Northstar" }).className).toContain(
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

  it("applies every visual direction to salon campaign, service, booking, divider, and accent modules", () => {
    const cases = [
      ["minimal", "blueprint-media-minimal", "border-y", "rounded-none", "h-px", "size-9"],
      ["bold", "blueprint-media-bold", "shadow-[4px_4px_0_currentColor]", "border-2", "h-1", "border-4"],
      ["elegant", "blueprint-media-elegant", "rounded-sm", "rounded-full", "w-20", "rotate-45"],
      ["playful", "blueprint-media-playful", "rounded-2xl", "-rotate-1", "h-2", "rounded-full"],
      ["organic", "blueprint-media-organic", "rounded-[2rem_0.75rem_2rem_0.75rem]", "rounded-[999px_1rem_999px_999px]", "blueprint-organic-divider", "blueprint-organic-mark"],
    ] as const

    for (const [visualDirection, frame, service, action, divider, accent] of cases) {
      const nextAnswers = { ...answers, visualDirection }
      const view = render(
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

      expect(view.container.querySelector('[data-salon-module="campaign-frame"]')?.className).toContain(frame)
      expect(view.container.querySelector('[data-salon-module="service-card"]')?.className).toContain(service)
      expect(view.container.querySelector('[data-salon-module="booking-cue"]')?.className).toContain(action)
      expect(view.container.querySelector('[data-salon-module="divider"]')?.className).toContain(divider)
      expect(view.container.querySelector('[data-salon-module="accent-shape"]')?.className).toContain(accent)
      view.unmount()
    }
  })

  it("applies every typography direction to display, service, and booking roles", () => {
    const cases = [
      ["modern-sans", "font-sans", "font-sans", "tracking-[0.14em]"],
      ["editorial-serif", "font-blueprint-editorial", "font-blueprint-editorial", "tracking-[0.18em]"],
      ["friendly-rounded", "font-blueprint-rounded", "font-blueprint-rounded", "font-blueprint-rounded"],
      ["expressive-contrast", "font-blueprint-editorial", "font-sans", "font-mono"],
    ] as const

    for (const [typographyDirection, display, service, action] of cases) {
      const nextAnswers = { ...answers, typographyDirection }
      const view = render(
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

      expect(view.container.querySelector('[data-typography-role="display"]')?.className).toContain(display)
      expect(view.container.querySelector('[data-typography-role="service"]')?.className).toContain(service)
      expect(view.container.querySelector('[data-typography-role="action"]')?.className).toContain(action)
      view.unmount()
    }
  })

  it("maps every guided step to a named primary preview region and supporting context", () => {
    const mappings = [
      ["foundation", "audience-promise", []],
      ["personality", "personality", ["brand-header"]],
      ["visual", "visual-direction", ["canvas"]],
      ["voice", "voice-tone", ["guardrail"]],
    ] as const

    for (const [step, primary, context] of mappings) {
      const view = render(<BlueprintPreview draft={draft} activeStep={step} />)
      const primaryRegion = view.container.querySelector(
        `[data-blueprint-section="${primary}"]`,
      )
      expect(primaryRegion?.getAttribute("data-editing-now")).toBe("true")
      expect(within(primaryRegion as HTMLElement).getByText("Editing now")).not.toBeNull()
      for (const section of context) {
        expect(
          view.container
            .querySelector(`[data-blueprint-section="${section}"]`)
            ?.getAttribute("data-editing-context"),
        ).toBe("true")
      }
      expect(view.container.querySelectorAll("[data-editing-indicator]")).toHaveLength(1)
      view.unmount()
    }
  })

  it("removes editor-only focus treatment from full preview", () => {
    const { container } = render(<BlueprintPreview draft={draft} activeStep="visual" fullPreview />)

    expect(container.querySelector("[data-editing-indicator]")).toBeNull()
    expect(container.querySelector("[data-editing-now]")).toBeNull()
    expect(container.querySelector("[data-editing-context]")).toBeNull()
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
      screen.getByText(
        "No guardrail yet — add one when client communication needs a clear boundary.",
      ),
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

      expect(screen.queryByText("Communication guardrail")).toBeNull()
      view.unmount()
    }
  })
})
