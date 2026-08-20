import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"
import type { BlueprintDraft } from "@/lib/blueprint/types"

import { FullPreviewOverlay } from "./full-preview-overlay"

const draft: BlueprintDraft = {
  id: null,
  brandName: "Northstar",
  template: "warm",
  config: createEmptyBlueprintConfig(),
  createdAt: null,
  updatedAt: null,
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
})
