import { useEffect, useRef, useState, type ReactNode } from "react"

import { FoundationStep } from "@/components/blueprint/foundation-step"
import { PersonalityStep } from "@/components/blueprint/personality-step"
import { VisualSystemStep } from "@/components/blueprint/visual-system-step"
import { VoiceStep } from "@/components/blueprint/voice-step"
import { Button } from "@/components/ui/button"
import {
  BLUEPRINT_STEP_DEFINITIONS,
  getBlueprintProgress,
  type BlueprintFieldErrors,
  type BlueprintStepId,
  type BlueprintStepStatus,
} from "@/lib/blueprint/progress"
import type { AnswerChangedAction } from "@/lib/blueprint/reducer"
import type { BrandAnswers } from "@/lib/blueprint/types"

const statusLabels: Record<BlueprintStepStatus, string> = {
  "not-started": "Not started",
  "in-progress": "In progress",
  complete: "Complete",
}

export function GuidedEditor({
  answers,
  currentStep,
  onStepChange,
  onAnswerChange,
  onReview,
  mobileImpact,
  fieldErrors = {},
}: {
  answers: BrandAnswers
  currentStep: BlueprintStepId
  onStepChange: (step: BlueprintStepId) => void
  onAnswerChange: (action: AnswerChangedAction) => void
  onReview: () => void
  mobileImpact?: ReactNode
  fieldErrors?: BlueprintFieldErrors
}) {
  const [reviewAttempted, setReviewAttempted] = useState(false)
  const pendingFocusId = useRef<string | null>(null)
  const progress = getBlueprintProgress(answers)
  const stepIndex = BLUEPRINT_STEP_DEFINITIONS.findIndex((step) => step.id === currentStep)
  const activeStep = progress.steps[stepIndex]

  useEffect(() => {
    if (!pendingFocusId.current) return

    document.getElementById(pendingFocusId.current)?.focus()
    pendingFocusId.current = null
  }, [currentStep, reviewAttempted])

  function selectStep(step: BlueprintStepId) {
    setReviewAttempted(false)
    onStepChange(step)
  }

  function handleReview() {
    if (progress.isComplete) {
      setReviewAttempted(false)
      onReview()
      return
    }

    const firstMissing = progress.missing[0]
    pendingFocusId.current = firstMissing.focusId
    setReviewAttempted(true)
    onStepChange(firstMissing.step)
  }

  return (
    <section aria-labelledby="guided-editor-heading" className="space-y-7">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Guided capture</p>
        <h2 id="guided-editor-heading" className="text-xl font-semibold tracking-tight">
          Shape your salon brand direction
        </h2>
        <p className="text-sm text-muted-foreground">
          Complete four short steps to guide how the salon should look and sound across its website,
          social media, and printed touchpoints. You can save an incomplete draft at any point.
        </p>
        <p aria-live="polite" className="text-sm font-medium">
          {progress.completedCount} of {progress.steps.length} steps complete
        </p>
      </div>

      <ol aria-label="Blueprint steps" className="grid gap-2 sm:grid-cols-2">
        {progress.steps.map((item, index) => (
          <li key={item.id}>
            <Button
              type="button"
              variant={item.id === currentStep ? "secondary" : "outline"}
              className="h-auto min-h-20 w-full items-start justify-start whitespace-normal py-3 text-left"
              aria-current={item.id === currentStep ? "step" : undefined}
              onClick={() => selectStep(item.id)}
            >
              <span className="grid min-w-0 gap-1">
                <span className="font-medium">
                  {index + 1}. {item.title}
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {item.description}
                </span>
                <span className="text-xs font-medium">
                  {item.id === currentStep ? "Current · " : ""}
                  {statusLabels[item.status]}
                </span>
              </span>
            </Button>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border bg-card p-5">
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold">{activeStep.title}</h3>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="font-medium">Why this matters</p>
              <p className="mt-1 text-muted-foreground">{activeStep.purpose}</p>
            </div>
            <div className="rounded-lg bg-muted/60 p-3">
              <p className="font-medium">You will see this change</p>
              <p className="mt-1 text-muted-foreground">{activeStep.impact}</p>
            </div>
          </div>
        </div>

        {currentStep === "foundation" && (
          <FoundationStep
            offerAudience={answers.offerAudience}
            error={fieldErrors.offerAudience}
            onChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "offerAudience", value })
            }
          />
        )}
        {currentStep === "personality" && (
          <PersonalityStep
            personalityTraits={answers.personalityTraits}
            visualDirection={answers.visualDirection}
            errors={fieldErrors}
            onTraitsChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "personalityTraits", value })
            }
            onVisualDirectionChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "visualDirection", value })
            }
          />
        )}
        {currentStep === "visual" && (
          <VisualSystemStep
            colorDirection={answers.colorDirection}
            typographyDirection={answers.typographyDirection}
            errors={fieldErrors}
            onColorDirectionChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "colorDirection", value })
            }
            onTypographyDirectionChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "typographyDirection", value })
            }
          />
        )}
        {currentStep === "voice" && (
          <VoiceStep
            voiceTraits={answers.voiceTraits}
            alwaysCommunicate={answers.alwaysCommunicate}
            avoid={answers.avoid}
            errors={fieldErrors}
            onVoiceTraitsChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "voiceTraits", value })
            }
            onAlwaysCommunicateChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "alwaysCommunicate", value })
            }
            onAvoidChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "avoid", value })
            }
          />
        )}
      </div>

      {mobileImpact}

      {reviewAttempted && !progress.isComplete && (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <p className="font-medium">Complete the required decisions before review.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            You can still save this work as a draft.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {progress.missing.map((requirement) => (
              <li key={requirement.field}>{requirement.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={stepIndex === 0}
          onClick={() => selectStep(BLUEPRINT_STEP_DEFINITIONS[stepIndex - 1].id)}
        >
          Back
        </Button>
        {stepIndex === BLUEPRINT_STEP_DEFINITIONS.length - 1 ? (
          <Button type="button" onClick={handleReview}>
            Review blueprint
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => selectStep(BLUEPRINT_STEP_DEFINITIONS[stepIndex + 1].id)}
          >
            Next: {BLUEPRINT_STEP_DEFINITIONS[stepIndex + 1].title}
          </Button>
        )}
      </div>
    </section>
  )
}
