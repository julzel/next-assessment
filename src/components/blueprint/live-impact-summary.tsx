import { Button } from "@/components/ui/button"
import { resolveBlueprintPresentation } from "@/lib/blueprint/presentation"
import {
  BLUEPRINT_STEP_PREVIEW_IMPACTS,
  type BlueprintStepId,
} from "@/lib/blueprint/progress"
import type { BlueprintDraft } from "@/lib/blueprint/types"
import { cn } from "@/lib/utils"

export function LiveImpactSummary({
  draft,
  currentStep,
  onView,
}: {
  draft: BlueprintDraft
  currentStep: BlueprintStepId
  onView: () => void
}) {
  const presentation = resolveBlueprintPresentation(draft)
  const impact = BLUEPRINT_STEP_PREVIEW_IMPACTS[currentStep]
  const summary = impactSummary(draft, currentStep)

  return (
    <aside
      aria-label={`Live impact: ${impact.title}`}
      className="rounded-xl border bg-muted/40 p-4 lg:hidden"
      data-live-impact={currentStep}
    >
      <p className="text-xs font-semibold tracking-wide text-primary uppercase">Live impact</p>
      <h3 className="mt-1 font-semibold">{impact.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{impact.inputLabel}</p>
      <div
        className={cn(
          "mt-3 rounded-lg border p-3 text-sm",
          presentation.palette.softSurfaceClass,
          presentation.palette.borderClass,
          presentation.palette.textClass,
          currentStep === "visual" && [
            presentation.typography.bodyClass,
            presentation.geometry.sectionClass,
          ],
        )}
        data-impact-sample=""
      >
        <p>{summary}</p>
        {currentStep === "personality" && presentation.personality.modifiers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Personality impact sample">
            {presentation.personality.modifiers.map((modifier) => (
              <span
                key={modifier.id}
                className={cn(
                  "border px-2 py-1 text-xs",
                  presentation.palette.borderClass,
                  modifier.accentClass,
                )}
              >
                {modifier.label}
              </span>
            ))}
          </div>
        )}
        {currentStep === "voice" && presentation.voice.traits.length > 0 && (
          <p className="mt-3 text-xs font-medium">
            Voice traits: {presentation.voice.traits.map((trait) => trait.label).join(" · ")}
          </p>
        )}
      </div>
      <Button type="button" variant="outline" size="sm" className="mt-3 w-full" onClick={onView}>
        View this change
      </Button>
    </aside>
  )
}

function impactSummary(draft: BlueprintDraft, step: BlueprintStepId) {
  const { answers, content } = draft.config

  switch (step) {
    case "foundation":
      return content.audiencePromise
    case "personality":
      return content.essence
    case "visual":
      return content.visualDirection
    case "voice":
      return answers.alwaysCommunicate.trim()
        ? `${content.voiceTone} Always communicate: ${answers.alwaysCommunicate.trim()}`
        : content.voiceTone
  }
}
