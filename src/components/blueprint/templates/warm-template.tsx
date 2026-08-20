import { DesignRationale } from "@/components/blueprint/design-rationale"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import {
  BlueprintSections,
  canvasFocusClasses,
  type BlueprintTemplateProps,
} from "./blueprint-sections"

export function WarmTemplate({
  draft,
  fullPreview,
  presentation,
  activeStep,
}: BlueprintTemplateProps) {
  return (
    <article
      className={cn(
        "blueprint-warm-glow overflow-hidden p-5 sm:p-8",
        presentation.palette.canvasClass,
        presentation.palette.textClass,
        presentation.palette.borderClass,
        presentation.typography.bodyClass,
        presentation.geometry.canvasClass,
        canvasFocusClasses(activeStep),
      )}
      data-composition="warm-story-flow"
      data-presentation-surface="canvas"
      data-blueprint-section="canvas"
      data-editing-context={activeStep === "visual" ? "true" : undefined}
    >
      <div
        className={cn(
          "mb-6 p-6 sm:p-8",
          presentation.palette.softSurfaceClass,
          presentation.palette.borderClass,
          presentation.geometry.heroClass,
        )}
        data-presentation-surface="hero"
      >
        <Badge
          className={cn(
            "mb-5 border-0",
            presentation.palette.accentClass,
            presentation.palette.accentTextClass,
            presentation.typography.labelClass,
          )}
        >
          Warm blueprint
        </Badge>
        <h2
          className={cn(
            "max-w-2xl text-4xl leading-none sm:text-5xl",
            presentation.typography.displayClass,
          )}
        >
          {draft.brandName.trim() || "Your brand name"}
        </h2>
        <p className={cn("mt-4 max-w-lg text-sm leading-6", presentation.palette.mutedTextClass)}>
          An approachable brand story designed to feel human from the first interaction.
        </p>
      </div>
      <BlueprintSections
        draft={draft}
        fullPreview={fullPreview}
        presentation={presentation}
        composition="warm"
        activeStep={activeStep}
      />
      <DesignRationale presentation={presentation} />
    </article>
  )
}
