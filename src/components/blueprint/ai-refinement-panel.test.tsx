import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { AiRefinementPanel } from "./ai-refinement-panel"

describe("AiRefinementPanel", () => {
  afterEach(cleanup)

  it("explains why refinement is unavailable for an incomplete draft", () => {
    render(
      <AiRefinementPanel
        isComplete={false}
        status="idle"
        message={null}
        canUndo={false}
        onRefine={vi.fn()}
        onUndo={vi.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "Refine with AI" }).hasAttribute("disabled")).toBe(
      true,
    )
    expect(screen.getByText(/Complete all four guided steps/)).not.toBeNull()
  })

  it("submits one normalized instruction and disables duplicate work while pending", async () => {
    const onRefine = vi.fn().mockResolvedValue(undefined)
    const { rerender } = render(
      <AiRefinementPanel
        isComplete
        status="idle"
        message={null}
        canUndo={false}
        onRefine={onRefine}
        onUndo={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByLabelText("What should change?"), {
      target: { value: "  Make the voice warmer  " },
    })
    fireEvent.click(screen.getByRole("button", { name: "Refine with AI" }))

    await waitFor(() => expect(onRefine).toHaveBeenCalledWith("Make the voice warmer"))
    rerender(
      <AiRefinementPanel
        isComplete
        status="loading"
        message="Refining the current Blueprint…"
        canUndo={false}
        onRefine={onRefine}
        onUndo={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Refining…" }).hasAttribute("disabled")).toBe(true)
  })

  it("announces safe failures and exposes undo after a successful edit", () => {
    const { rerender } = render(
      <AiRefinementPanel
        isComplete
        status="error"
        message="AI refinement is temporarily unavailable."
        canUndo={false}
        onRefine={vi.fn()}
        onUndo={vi.fn()}
      />,
    )
    expect(screen.getByRole("alert").textContent).toContain("temporarily unavailable")

    rerender(
      <AiRefinementPanel
        isComplete
        status="applied"
        message="Made the voice warmer."
        canUndo
        onRefine={vi.fn()}
        onUndo={vi.fn()}
      />,
    )
    expect(screen.getByRole("button", { name: "Undo AI edit" })).not.toBeNull()
  })
})
