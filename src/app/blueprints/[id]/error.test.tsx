import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import BlueprintError from "./error"

describe("saved Blueprint error boundary", () => {
  afterEach(cleanup)

  it("keeps retry and library recovery actions reachable", () => {
    const reset = vi.fn()
    render(<BlueprintError reset={reset} />)

    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalledOnce()
    expect(screen.getByRole("link", { name: "Return to library" }).getAttribute("href")).toBe(
      "/",
    )
  })
})
