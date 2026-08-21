import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import Error from "./error"

describe("root error boundary", () => {
  afterEach(cleanup)

  it("offers retry and a route back to the Blueprint library", () => {
    const reset = vi.fn()
    render(<Error reset={reset} />)

    fireEvent.click(screen.getByRole("button", { name: "Try again" }))
    expect(reset).toHaveBeenCalledOnce()
    expect(screen.getByRole("link", { name: "Back to library" }).getAttribute("href")).toBe("/")
  })
})
