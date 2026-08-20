import { Badge } from "@/components/ui/badge"
import type { BlueprintPresentationProfile } from "@/lib/blueprint/presentation"
import { cn } from "@/lib/utils"

import { BlueprintSections, type BlueprintTemplateProps } from "./blueprint-sections"

export function EditorialTemplate({
  draft,
  fullPreview,
  presentation,
}: BlueprintTemplateProps & { presentation: BlueprintPresentationProfile }) {
  return (
    <article
      className={cn(
        "overflow-hidden px-5 pb-7 sm:px-8 sm:pb-9",
        presentation.palette.canvasClass,
        presentation.palette.textClass,
        presentation.palette.borderClass,
        presentation.typography.bodyClass,
        presentation.geometry.canvasClass,
      )}
      data-presentation-surface="canvas"
    >
      <div
        className={cn(
          "-mx-5 mb-8 space-y-3 px-5 sm:-mx-8 sm:px-8",
          presentation.geometry.heroClass,
          presentation.palette.surfaceClass,
          presentation.palette.borderClass,
        )}
        data-presentation-surface="hero"
      >
        <Badge
          className={cn(
            "border-0 uppercase",
            presentation.palette.accentClass,
            presentation.palette.accentTextClass,
            presentation.typography.labelClass,
          )}
        >
          Editorial blueprint
        </Badge>
        <h1 className={cn("text-4xl leading-none sm:text-5xl", presentation.typography.displayClass)}>
          {draft.brandName.trim() || "Your brand name"}
        </h1>
        <p className={cn("text-sm italic", presentation.palette.mutedTextClass)}>
          A refined, typography-led point of view
        </p>
        {presentation.personality.modifiers.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2" aria-label="Personality accents">
            {presentation.personality.modifiers.map((modifier) => (
              <span
                key={modifier.id}
                data-personality={modifier.id}
                className={cn(
                  "inline-flex border px-3 py-1 text-xs",
                  presentation.palette.softSurfaceClass,
                  presentation.palette.borderClass,
                  modifier.accentClass,
                )}
              >
                {modifier.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <BlueprintSections draft={draft} fullPreview={fullPreview} presentation={presentation} />
    </article>
  )
}
