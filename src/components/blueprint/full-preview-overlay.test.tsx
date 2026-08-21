import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import { buildDeterministicContent } from "@/lib/blueprint/content"
import type { BrandAnswers, BlueprintDraft } from "@/lib/blueprint/types"

import { FullPreviewOverlay } from "./full-preview-overlay"

const draft: BlueprintDraft = {
  id: null,
  brandName: "Northstar",
  template: "warm",
  config: createEmptyBlueprintConfig(),
  createdAt: null,
  updatedAt: null,
}

const completeAnswers: BrandAnswers = {
  offerAudience: "Restorative salon care for clients who value a thoughtful consultation",
  personalityTraits: ["warm", "playful"],
  visualDirection: "organic",
  colorDirection: "vibrant",
  typographyDirection: "friendly-rounded",
  voiceTraits: ["warm", "clear"],
  alwaysCommunicate: "useful optimism",
  avoid: "empty buzzwords",
}

describe("FullPreviewOverlay", () => {
  afterEach(cleanup)

  it("renders current draft values and closes from its explicit control", () => {
    const onOpenChange = vi.fn()
    render(<FullPreviewOverlay draft={{ ...draft, brandName: "Northstar Collective" }} open onOpenChange={onOpenChange} />)

    expect(screen.getByRole("dialog")).not.toBeNull()
    expect(screen.getAllByText("Northstar Collective").length).toBeGreaterThan(0)
    fireEvent.click(screen.getByRole("button", { name: "Back to editor" }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("closes when Escape is pressed", () => {
    const onOpenChange = vi.fn()
    render(<FullPreviewOverlay draft={draft} open onOpenChange={onOpenChange} />)

    fireEvent.keyDown(document, { key: "Escape" })
    expect(onOpenChange).toHaveBeenCalledWith(
      false,
      expect.objectContaining({ reason: "escape-key" }),
    )
  })

  it("uses the current unsaved presentation profile and rationale", () => {
    const currentDraft: BlueprintDraft = {
      ...draft,
      config: {
        schemaVersion: 1,
        answers: completeAnswers,
        content: buildDeterministicContent(completeAnswers),
      },
    }
    render(<FullPreviewOverlay draft={currentDraft} open onOpenChange={vi.fn()} />)
    const preview = document.querySelector("[data-blueprint-preview]")

    expect(preview?.getAttribute("data-color-direction")).toBe("vibrant")
    expect(preview?.getAttribute("data-visual-direction")).toBe("organic")
    expect(preview?.getAttribute("data-typography-direction")).toBe("friendly-rounded")
    expect(screen.getByText("Why this direction works")).not.toBeNull()
    expect(screen.getByText("Message priority: useful optimism")).not.toBeNull()
    expect(screen.getAllByText("Neighborhood Welcome").length).toBeGreaterThan(0)
    expect(document.querySelector('[data-salon-module="client-care-moment"]')).not.toBeNull()
    expect(document.querySelector('[data-salon-module="booking-invitation"]')).not.toBeNull()
    expect(screen.getByRole("heading", { level: 3, name: "Brand in use" })).not.toBeNull()
    expect(document.querySelectorAll("[data-brand-application]")).toHaveLength(3)
    expect(document.querySelector("[data-editing-now] [data-brand-applications]")).toBeNull()
  })
})
