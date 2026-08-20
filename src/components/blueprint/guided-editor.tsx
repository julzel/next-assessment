import { useState } from "react"

import { FoundationStep } from "@/components/blueprint/foundation-step"
import { PersonalityStep } from "@/components/blueprint/personality-step"
import { VisualSystemStep } from "@/components/blueprint/visual-system-step"
import { VoiceStep } from "@/components/blueprint/voice-step"
import { Button } from "@/components/ui/button"
import type { AnswerChangedAction } from "@/lib/blueprint/reducer"
import type { BrandAnswers } from "@/lib/blueprint/types"

const steps = [
  { title: "Foundation", description: "Audience and offer" },
  { title: "Personality", description: "Traits and visual direction" },
  { title: "Visual system", description: "Color and typography" },
  { title: "Voice", description: "Tone and guardrails" },
] as const

export function GuidedEditor({
  answers,
  onAnswerChange,
}: {
  answers: BrandAnswers
  onAnswerChange: (action: AnswerChangedAction) => void
}) {
  const [step, setStep] = useState(0)

  return (
    <section aria-labelledby="guided-editor-heading" className="space-y-7">
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Guided capture</p>
        <h2 id="guided-editor-heading" className="text-xl font-semibold tracking-tight">
          Shape the brand direction
        </h2>
        <p className="text-sm text-muted-foreground">
          Each answer updates the blueprint alongside it. Save at any point.
        </p>
      </div>

      <ol aria-label="Blueprint steps" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {steps.map((item, index) => (
          <li key={item.title}>
            <Button
              type="button"
              variant={index === step ? "secondary" : "outline"}
              className="h-auto w-full items-start justify-start py-2 text-left"
              aria-current={index === step ? "step" : undefined}
              onClick={() => setStep(index)}
            >
              <span className="grid gap-0.5">
                <span>{index + 1}. {item.title}</span>
                <span className="text-xs font-normal text-muted-foreground">{item.description}</span>
              </span>
            </Button>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-5 text-lg font-semibold">{steps[step].title}</h3>
        {step === 0 && (
          <FoundationStep
            offerAudience={answers.offerAudience}
            onChange={(value) => onAnswerChange({ type: "answerChanged", field: "offerAudience", value })}
          />
        )}
        {step === 1 && (
          <PersonalityStep
            personalityTraits={answers.personalityTraits}
            visualDirection={answers.visualDirection}
            onTraitsChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "personalityTraits", value })
            }
            onVisualDirectionChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "visualDirection", value })
            }
          />
        )}
        {step === 2 && (
          <VisualSystemStep
            colorDirection={answers.colorDirection}
            typographyDirection={answers.typographyDirection}
            onColorDirectionChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "colorDirection", value })
            }
            onTypographyDirectionChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "typographyDirection", value })
            }
          />
        )}
        {step === 3 && (
          <VoiceStep
            voiceTraits={answers.voiceTraits}
            alwaysCommunicate={answers.alwaysCommunicate}
            avoid={answers.avoid}
            onVoiceTraitsChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "voiceTraits", value })
            }
            onAlwaysCommunicateChange={(value) =>
              onAnswerChange({ type: "answerChanged", field: "alwaysCommunicate", value })
            }
            onAvoidChange={(value) => onAnswerChange({ type: "answerChanged", field: "avoid", value })}
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={step === steps.length - 1}
          onClick={() => setStep(step + 1)}
        >
          Next: {step === steps.length - 1 ? "Complete" : steps[step + 1].title}
        </Button>
      </div>
    </section>
  )
}
