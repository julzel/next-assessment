import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { RadioGroup } from "@/components/ui/radio-group"
import { TEMPLATE_OPTIONS } from "@/lib/blueprint/options"

import { TemplateOptionCard } from "./template-option-card"

describe("TemplateOptionCard", () => {
  afterEach(cleanup)

  it("shows a structural thumbnail, description, and selected radio state", () => {
    const onValueChange = vi.fn()
    const { container } = render(
      <RadioGroup defaultValue="editorial" onValueChange={onValueChange}>
        {TEMPLATE_OPTIONS.map((option) => (
          <TemplateOptionCard key={option.id} option={option} />
        ))}
      </RadioGroup>,
    )

    expect(container.querySelector('[data-template-thumbnail="editorial"]')).not.toBeNull()
    expect(container.querySelector('[data-template-thumbnail="studio"]')).not.toBeNull()
    expect(container.querySelector('[data-template-thumbnail="warm"]')).not.toBeNull()
    expect(screen.getByText("Modern Studio")).not.toBeNull()
    expect(screen.getByText("Neighborhood Welcome")).not.toBeNull()
    expect(screen.getByText("Craft-led, campaign-minded, and typography-forward.")).not.toBeNull()
    expect(screen.getByRole("radio", { name: /Editorial/ }).getAttribute("aria-checked")).toBe(
      "true",
    )

    fireEvent.click(screen.getByRole("radio", { name: /Modern Studio/ }))
    expect(onValueChange).toHaveBeenCalledWith("studio", expect.anything())
  })

  it("retains the radio primitive's keyboard-operable semantics", () => {
    render(
      <RadioGroup defaultValue="editorial">
        {TEMPLATE_OPTIONS.map((option) => (
          <TemplateOptionCard key={option.id} option={option} />
        ))}
      </RadioGroup>,
    )
    const editorial = screen.getByRole("radio", { name: /Editorial/ })
    const studio = screen.getByRole("radio", { name: /Modern Studio/ })

    expect(editorial.getAttribute("tabindex")).toBe("0")
    expect(studio.getAttribute("tabindex")).toBe("-1")
    editorial.focus()
    expect(document.activeElement).toBe(editorial)
  })

  it("uses neutral structural thumbnails rather than template-owned color direction", () => {
    const { container } = render(
      <RadioGroup defaultValue="editorial">
        {TEMPLATE_OPTIONS.map((option) => (
          <TemplateOptionCard key={option.id} option={option} />
        ))}
      </RadioGroup>,
    )

    for (const thumbnail of container.querySelectorAll("[data-template-thumbnail]")) {
      expect(thumbnail.className).not.toMatch(/orange|pink|rose|cyan|slate-950/)
    }
  })
})
