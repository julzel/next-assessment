import { useState, type ReactNode } from "react"
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import { createEmptyBrandAnswers } from "@/lib/blueprint/defaults"
import type { BlueprintFieldErrors, BlueprintStepId } from "@/lib/blueprint/progress"
import type { AnswerChangedAction } from "@/lib/blueprint/reducer"
import type { BrandAnswers } from "@/lib/blueprint/types"

import { GuidedEditor } from "./guided-editor"

const completeAnswers: BrandAnswers = {
  offerAudience: "Independent founders building thoughtful products",
  personalityTraits: ["confident", "curious", "precise"],
  visualDirection: "minimal",
  colorDirection: "cool",
  typographyDirection: "modern-sans",
  voiceTraits: ["clear", "thoughtful"],
  alwaysCommunicate: "calm, useful clarity",
  avoid: "empty buzzwords",
}

function ControlledEditor({
  answers = createEmptyBrandAnswers(),
  fieldErrors,
  onAnswerChange = vi.fn(),
  onReview = vi.fn(),
  mobileImpact,
}: {
  answers?: BrandAnswers
  fieldErrors?: BlueprintFieldErrors
  onAnswerChange?: (action: AnswerChangedAction) => void
  onReview?: () => void
  mobileImpact?: ReactNode
}) {
  const [currentStep, setCurrentStep] = useState<BlueprintStepId>("foundation")

  return (
    <GuidedEditor
      answers={answers}
      currentStep={currentStep}
      fieldErrors={fieldErrors}
      onStepChange={setCurrentStep}
      onAnswerChange={onAnswerChange}
      onReview={onReview}
      mobileImpact={mobileImpact}
    />
  )
}

describe("GuidedEditor", () => {
  afterEach(cleanup)

  it("explains each step while navigating without clipping step copy", () => {
    render(<ControlledEditor />)

    expect(screen.getByText("0 of 4 steps complete")).not.toBeNull()
    expect(screen.getByText("Current · Not started")).not.toBeNull()
    expect(screen.getByText("Why this matters")).not.toBeNull()
    expect(screen.getByText("You will see this change")).not.toBeNull()
    expect(screen.getByLabelText("What does the brand offer, and who is it for?")).not.toBeNull()

    const personalityStep = screen.getByRole("button", { name: /2\. Personality/ })
    expect(personalityStep.className).toContain("whitespace-normal")
    fireEvent.click(screen.getByRole("button", { name: /Next: Personality/ }))
    expect(screen.getByText("Choose three traits that should define the brand.")).not.toBeNull()
    expect(screen.getByText(/Define how the brand should feel/)).not.toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /Next: Visual system/ }))
    expect(screen.getByText("Choose a color direction.")).not.toBeNull()
    expect(screen.getByText(/palette and type character/)).not.toBeNull()

    fireEvent.click(screen.getByRole("button", { name: /Next: Voice/ }))
    expect(screen.getByText("Choose one to three voice traits.")).not.toBeNull()
    expect(screen.getByText("One trait is required. Together, the selected traits shape the voice summary and message treatment.")).not.toBeNull()
  })

  it("renders contextual mobile impact content without replacing step status semantics", () => {
    render(
      <ControlledEditor
        answers={completeAnswers}
        mobileImpact={<aside>Current impact sample</aside>}
      />,
    )

    expect(screen.getByText("Current impact sample")).not.toBeNull()
    const foundation = screen.getByRole("button", { name: /1\. Foundation/ })
    expect(foundation.getAttribute("aria-current")).toBe("step")
    expect(foundation.textContent).toContain("Current · Complete")
    expect(screen.getByRole("button", { name: /2\. Personality/ }).textContent).toContain(
      "Complete",
    )
  })

  it("limits personality traits to three and explains the remaining selection", () => {
    const onAnswerChange = vi.fn<(action: AnswerChangedAction) => void>()
    render(
      <ControlledEditor
        answers={{
          ...createEmptyBrandAnswers(),
          personalityTraits: ["confident", "curious", "refined"],
        }}
        onAnswerChange={onAnswerChange}
      />,
    )
    fireEvent.click(screen.getByRole("button", { name: /^2\. Personality/ }))

    expect(screen.getByText("Three traits selected.")).not.toBeNull()
    expect(screen.getByRole("button", { name: /Playful/ }).hasAttribute("disabled")).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: /Confident/ }))
    expect(onAnswerChange).toHaveBeenCalledWith({
      type: "answerChanged",
      field: "personalityTraits",
      value: ["curious", "refined"],
    })
  })

  it("emits typed answer changes for text and direction controls", () => {
    const onAnswerChange = vi.fn<(action: AnswerChangedAction) => void>()
    render(<ControlledEditor onAnswerChange={onAnswerChange} />)

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

  it("shows field-level feedback beside its control", () => {
    render(
      <ControlledEditor
        fieldErrors={{ offerAudience: "Describe the offer before saving." }}
      />,
    )

    const field = screen.getByLabelText("What does the brand offer, and who is it for?")
    expect(field.getAttribute("aria-invalid")).toBe("true")
    expect(screen.getByText("Describe the offer before saving.")).not.toBeNull()
  })

  it("uses Review to announce missing decisions and focus the first incomplete field", async () => {
    render(<ControlledEditor />)
    fireEvent.click(screen.getByRole("button", { name: /^4\. Voice/ }))
    fireEvent.click(screen.getByRole("button", { name: "Review blueprint" }))

    expect(screen.getByRole("alert")).not.toBeNull()
    expect(screen.getByText("Complete the required decisions before review.")).not.toBeNull()
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByLabelText("What does the brand offer, and who is it for?"),
      ),
    )
  })

  it("opens review when every required decision is complete", () => {
    const onReview = vi.fn()
    render(<ControlledEditor answers={completeAnswers} onReview={onReview} />)

    expect(screen.getByText("4 of 4 steps complete")).not.toBeNull()
    fireEvent.click(screen.getByRole("button", { name: /^4\. Voice/ }))
    fireEvent.click(screen.getByRole("button", { name: "Review blueprint" }))
    expect(onReview).toHaveBeenCalledOnce()
    expect(screen.queryByRole("alert")).toBeNull()
  })
})
