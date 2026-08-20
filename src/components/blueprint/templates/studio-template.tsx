import { DesignRationale } from "@/components/blueprint/design-rationale"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import { BlueprintSections, type BlueprintTemplateProps } from "./blueprint-sections"

export function StudioTemplate({ draft, fullPreview, presentation }: BlueprintTemplateProps) {
  return (
    <article
      className={cn(
        "blueprint-studio-grid overflow-hidden p-4 sm:p-6",
        presentation.palette.canvasClass,
        presentation.palette.textClass,
        presentation.palette.borderClass,
        presentation.typography.bodyClass,
        presentation.geometry.canvasClass,
      )}
      data-composition="studio-system-board"
      data-presentation-surface="canvas"
    >
      <div
        className={cn(
          "mb-4 grid gap-4 border p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6",
          presentation.palette.surfaceClass,
          presentation.palette.borderClass,
          presentation.geometry.heroClass,
        )}
        data-presentation-surface="hero"
      >
        <div>
          <p className={cn("mb-3 text-xs", presentation.typography.labelClass)}>
            Brand system / 01
          </p>
          <h1
            className={cn(
              "text-4xl leading-none sm:text-5xl",
              presentation.typography.displayClass,
            )}
          >
            {draft.brandName.trim() || "Your brand name"}
          </h1>
        </div>
        <Badge
          className={cn(
            "w-fit border-0",
            presentation.palette.accentClass,
            presentation.palette.accentTextClass,
            presentation.typography.labelClass,
          )}
        >
          Studio blueprint
        </Badge>
      </div>
      <BlueprintSections
        draft={draft}
        fullPreview={fullPreview}
        presentation={presentation}
        composition="studio"
      />
      <DesignRationale presentation={presentation} />
    </article>
  )
}
