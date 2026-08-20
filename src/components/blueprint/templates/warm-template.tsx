import { DesignRationale } from "@/components/blueprint/design-rationale"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { BlueprintSections, type BlueprintTemplateProps } from "./blueprint-sections"

export function WarmTemplate({ draft, fullPreview, presentation }: BlueprintTemplateProps) {
  return (
    <article
      className={cn(
        "blueprint-warm-glow overflow-hidden p-5 sm:p-8",
        presentation.palette.canvasClass,
        presentation.palette.textClass,
        presentation.palette.borderClass,
        presentation.typography.bodyClass,
        presentation.geometry.canvasClass,
      )}
      data-composition="warm-story-flow"
      data-presentation-surface="canvas"
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
        <h1
          className={cn(
            "max-w-2xl text-4xl leading-none sm:text-5xl",
            presentation.typography.displayClass,
          )}
        >
          {draft.brandName.trim() || "Your brand name"}
        </h1>
        <p className={cn("mt-4 max-w-lg text-sm leading-6", presentation.palette.mutedTextClass)}>
          An approachable brand story designed to feel human from the first interaction.
        </p>
      </div>
      <BlueprintSections
        draft={draft}
        fullPreview={fullPreview}
        presentation={presentation}
        composition="warm"
      />
      <DesignRationale presentation={presentation} />
    </article>
  )
}
