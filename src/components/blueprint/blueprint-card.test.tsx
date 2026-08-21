import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { BlueprintCard } from "./blueprint-card"

describe("BlueprintCard", () => {
  it("shows a machine-readable update time with same-day precision", () => {
    const updatedAt = "2026-08-20T18:34:00.000Z"
    const { container } = render(
      <BlueprintCard
        blueprint={{
          id: 7,
          brandName: "Marigold Salon",
          template: "warm",
          updatedAt,
        }}
      />,
    )

    expect(container.querySelector("time")?.getAttribute("datetime")).toBe(updatedAt)
    expect(screen.getByText(/^Updated .*\d{1,2}:\d{2}/)).not.toBeNull()
  })
})
