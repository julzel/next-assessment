import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { createBrandApplicationViewModel } from "@/lib/blueprint/applications"
import { buildDeterministicContent } from "@/lib/blueprint/content"
import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import { resolveBlueprintPresentation } from "@/lib/blueprint/presentation"
import type { BrandAnswers, BlueprintDraft } from "@/lib/blueprint/types"

import { BrandApplications } from "./brand-applications"

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

function createDraft(answerOverrides: Partial<BrandAnswers> = {}): BlueprintDraft {
  const nextAnswers = { ...answers, ...answerOverrides }
  return {
    id: null,
    brandName: "Northstar Salon",
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

function renderApplications(draft: BlueprintDraft) {
  const presentation = resolveBlueprintPresentation(draft)
  return render(
    <BrandApplications
      viewModel={createBrandApplicationViewModel(draft, presentation)}
      presentation={presentation}
    />,
  )
}

describe("BrandApplications", () => {
  afterEach(cleanup)

  it("renders representative website, social, and print proofs with shared brand inputs", () => {
    const { container } = renderApplications(createDraft())

    expect(screen.getByRole("heading", { level: 3, name: "Brand in use" })).not.toBeNull()
    expect(screen.getByText(/not publishable website, social, or print files/i)).not.toBeNull()
    expect(screen.getAllByText("Northstar Salon")).toHaveLength(3)
    expect(screen.getByText(/Color, typography, shape, and voice/)).not.toBeNull()
    expect(screen.getByText(/Layout, information density/)).not.toBeNull()
    expect(container.querySelectorAll("[data-brand-application]")).toHaveLength(3)
    expect(container.querySelectorAll("[data-application-personality]")).toHaveLength(3)
    expect(container.querySelectorAll("[data-application-voice]")).toHaveLength(3)

    for (const proof of container.querySelectorAll("[data-brand-application]")) {
      expect(proof.getAttribute("data-application-palette")).toBe("earthy")
      expect(proof.getAttribute("data-application-typography")).toBe("editorial-serif")
      expect(proof.getAttribute("data-application-geometry")).toBe("elegant")
      expect(proof.className).toContain("border-lime-700")
      expect(proof.className).toContain("font-blueprint-editorial")
    }
  })

  it("updates all three proofs in one render when the visual system changes", () => {
    const initialDraft = createDraft()
    const view = renderApplications(initialDraft)
    const changedDraft = createDraft({
      visualDirection: "playful",
      colorDirection: "vibrant",
      typographyDirection: "modern-sans",
    })
    const changedPresentation = resolveBlueprintPresentation(changedDraft)

    view.rerender(
      <BrandApplications
        viewModel={createBrandApplicationViewModel(changedDraft, changedPresentation)}
        presentation={changedPresentation}
      />,
    )

    for (const proof of view.container.querySelectorAll("[data-brand-application]")) {
      expect(proof.getAttribute("data-application-palette")).toBe("vibrant")
      expect(proof.getAttribute("data-application-typography")).toBe("modern-sans")
      expect(proof.getAttribute("data-application-geometry")).toBe("playful")
      expect(proof.className).toContain("border-indigo-500")
      expect(proof.className).toContain("font-sans")
    }
  })

  it("keeps channel boundaries semantic and small-format safe", () => {
    const { container } = renderApplications(createDraft())
    const social = container.querySelector("[data-social-safe-area]")
    const website = container.querySelector('[data-brand-application="website"]')

    expect(social?.className).toContain("aspect-square")
    expect(container.querySelector("[data-print-safe-area]")).not.toBeNull()
    expect(container.querySelector('[data-application-action="preview-only"]')?.tagName).toBe(
      "SPAN",
    )
    expect(website?.querySelector("a, button")).toBeNull()
    expect(container.innerHTML).not.toMatch(/animate-|transition-/)
  })

  it("renders honest labeled examples for an empty draft", () => {
    const draft: BlueprintDraft = {
      ...createDraft(),
      brandName: "",
      config: createEmptyBlueprintConfig(),
    }
    const { container } = renderApplications(draft)

    expect(container.querySelector("[data-brand-applications]")?.getAttribute("data-application-fallback")).toBe(
      "true",
    )
    expect(screen.getAllByText("Your salon name")).toHaveLength(3)
    expect(screen.getAllByText(/^Example service context/).length).toBeGreaterThan(0)
    expect(screen.getByText(/^Example client message/)).not.toBeNull()
    expect(screen.getByText(/not print-ready/i)).not.toBeNull()
  })

  it("contains long owner-authored copy without truncation utilities", () => {
    const offerAudience = "x".repeat(400)
    const alwaysCommunicate = "y".repeat(240)
    const { container } = renderApplications(createDraft({ offerAudience, alwaysCommunicate }))

    expect(screen.getAllByText(offerAudience).length).toBeGreaterThan(0)
    expect(screen.getByText(alwaysCommunicate)).not.toBeNull()
    expect(container.querySelector('[data-brand-application="print"]')?.innerHTML).not.toMatch(
      /truncate|line-clamp|whitespace-nowrap/,
    )
  })
})
