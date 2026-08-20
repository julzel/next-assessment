import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { createEmptyBrandAnswers } from "@/lib/blueprint/defaults"
import type { AnswerChangedAction } from "@/lib/blueprint/reducer"

import { GuidedEditor } from "./guided-editor"

describe("GuidedEditor", () => {
  afterEach(cleanup)

  it("shows the required questions through keyboard-usable step navigation", () => {
    const onAnswerChange = vi.fn<(action: AnswerChangedAction) => void>()
    render(<GuidedEditor answers={createEmptyBrandAnswers()} onAnswerChange={onAnswerChange} />)

    expect(screen.getByLabelText("What does the brand offer, and who is it for?")).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: /Next: Personality/ }))
    expect(screen.getByText("Choose three traits that should define the brand.")).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: /Next: Visual system/ }))
    expect(screen.getByText("Choose a color direction.")).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: /Next: Voice/ }))
    expect(screen.getByLabelText("What should the brand always communicate?")).not.toBeNull()
    expect(screen.getByLabelText("What should the brand avoid? (Optional)")).not.toBeNull()
  })

  it("limits personality traits to three and explains the remaining selection", () => {
    const onAnswerChange = vi.fn<(action: AnswerChangedAction) => void>()
    render(
      <GuidedEditor
        answers={{ ...createEmptyBrandAnswers(), personalityTraits: ["confident", "curious", "refined"] }}
        onAnswerChange={onAnswerChange}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: /^2\. Personality/ }))

    expect(screen.getByText("Three traits selected.")).not.toBeNull()
    expect(screen.getByRole("button", { name: "Playful" }).hasAttribute("disabled")).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "Confident" }))
    expect(onAnswerChange).toHaveBeenCalledWith({
      type: "answerChanged",
      field: "personalityTraits",
      value: ["curious", "refined"],
    })
  })

  it("emits typed answer changes for text and direction controls", () => {
    const onAnswerChange = vi.fn<(action: AnswerChangedAction) => void>()
    render(<GuidedEditor answers={createEmptyBrandAnswers()} onAnswerChange={onAnswerChange} />)

    fireEvent.change(screen.getByLabelText("What does the brand offer, and who is it for?"), {
      target: { value: "Tools for independent founders" },
    })
    fireEvent.click(screen.getByRole("button", { name: /^2\. Personality/ }))
    fireEvent.click(screen.getByRole("radio", { name: /Elegant/ }))

    expect(onAnswerChange).toHaveBeenCalledWith({
      type: "answerChanged",
      field: "offerAudience",
      value: "Tools for independent founders",
    })
    expect(onAnswerChange).toHaveBeenCalledWith({
      type: "answerChanged",
      field: "visualDirection",
      value: "elegant",
    })
  })
})
