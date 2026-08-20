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
    expect(screen.getByText("Refined and typography-led.")).not.toBeNull()
    expect(screen.getByRole("radio", { name: /Editorial/ }).getAttribute("aria-checked")).toBe(
      "true",
    )

    fireEvent.click(screen.getByRole("radio", { name: /Studio/ }))
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
    const studio = screen.getByRole("radio", { name: /Studio/ })

    expect(editorial.getAttribute("tabindex")).toBe("0")
    expect(studio.getAttribute("tabindex")).toBe("-1")
    editorial.focus()
    expect(document.activeElement).toBe(editorial)
  })
})
