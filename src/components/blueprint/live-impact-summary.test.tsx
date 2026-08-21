import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BrandAnswers, BlueprintDraft } from "@/lib/blueprint/types"

import { LiveImpactSummary } from "./live-impact-summary"

const answers: BrandAnswers = {
  offerAudience: "Precision services for clients who value a calm visit",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "playful",
  colorDirection: "vibrant",
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

describe("LiveImpactSummary", () => {
  afterEach(cleanup)

  it("uses current draft content and resolved presentation tokens for each step", () => {
    const { container, rerender } = render(
      <LiveImpactSummary draft={draft} currentStep="foundation" onView={vi.fn()} />,
    )
    expect(screen.getByText("Salon positioning and client promise")).not.toBeNull()
    expect(screen.getByText(draft.config.content.audiencePromise)).not.toBeNull()

    rerender(<LiveImpactSummary draft={draft} currentStep="visual" onView={vi.fn()} />)
    expect(screen.getByText("Salon palette, type, and geometry")).not.toBeNull()
    expect(screen.getByText(draft.config.content.visualDirection)).not.toBeNull()
    const sample = container.querySelector("[data-impact-sample]")
    expect(sample?.className).toContain("bg-lime-200")
    expect(sample?.className).toContain("font-blueprint-editorial")
    expect(container.querySelector("[data-impact-visual-proof]")).not.toBeNull()
    expect(screen.getByText("Signature care").className).toContain("font-blueprint-editorial")
    expect(screen.getByText("Book").className).toContain("tracking-[0.18em]")

    rerender(<LiveImpactSummary draft={draft} currentStep="voice" onView={vi.fn()} />)
    expect(screen.getByText(/Always communicate: thoughtful expertise and care/)).not.toBeNull()
  })

  it("offers one explicit action to inspect the affected preview region", () => {
    const onView = vi.fn()
    render(<LiveImpactSummary draft={draft} currentStep="personality" onView={onView} />)

    fireEvent.click(screen.getByRole("button", { name: "View this change" }))
    expect(onView).toHaveBeenCalledOnce()
  })
})
