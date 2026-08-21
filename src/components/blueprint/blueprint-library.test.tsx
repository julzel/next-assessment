import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { BlueprintLibrary } from "./blueprint-library"

describe("BlueprintLibrary", () => {
  afterEach(cleanup)

  it("uses native links for navigation actions styled as buttons", () => {
    const view = render(<BlueprintLibrary blueprints={[]} />)

    const emptyAction = screen.getByRole("link", { name: "Create your first blueprint" })
    expect(emptyAction.tagName).toBe("A")
    expect(emptyAction.getAttribute("href")).toBe("/blueprints/new")

    view.rerender(
      <BlueprintLibrary
        blueprints={[
          {
            id: 1,
            brandName: "Northstar",
            template: "editorial",
            updatedAt: "2026-08-20T12:00:00.000Z",
          },
        ]}
      />,
    )

    const populatedAction = screen.getByRole("link", { name: "New blueprint" })
    expect(populatedAction.tagName).toBe("A")
    expect(populatedAction.getAttribute("href")).toBe("/blueprints/new")
  })

  it("states the salon and cross-channel purpose in the empty experience", () => {
    render(<BlueprintLibrary blueprints={[]} />)

    expect(screen.getByText("Salon brand strategy workspace")).not.toBeNull()
    expect(screen.getByText(/website, social media, and printed touchpoints/)).not.toBeNull()
    expect(screen.getByText(/without needing design expertise/)).not.toBeNull()
  })
})
