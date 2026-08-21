import { DesignRationale } from "@/components/blueprint/design-rationale"
import { BrandApplications } from "@/components/blueprint/brand-applications"
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
  applications,
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
      data-salon-direction="neighborhood-welcome"
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
          Neighborhood Welcome
        </Badge>
        <h2
          className={cn(
            "max-w-2xl text-4xl leading-none sm:text-5xl",
            presentation.typography.displayClass,
          )}
          data-typography-role="display"
        >
          {draft.brandName.trim() || "Your salon name"}
        </h2>
        <p className={cn("mt-4 max-w-lg text-sm leading-6", presentation.palette.mutedTextClass)}>
          A human salon introduction designed to make care recognizable before the first visit.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div
            className={cn(
              "min-w-0 border p-5",
              presentation.palette.surfaceClass,
              presentation.palette.borderClass,
              presentation.geometry.serviceCardClass,
            )}
            data-salon-module="client-care-moment"
          >
            <p className={cn("text-xs", presentation.typography.labelClass)}>
              Client-care promise
            </p>
            <p
              className={cn(
                "mt-3 break-words text-xl leading-7",
                presentation.typography.serviceClass,
              )}
              data-typography-role="service"
            >
              <span aria-hidden="true">“</span>
              {draft.config.answers.alwaysCommunicate ||
                "Add the message every client should feel across the salon experience."}
              <span aria-hidden="true">”</span>
            </p>
          </div>
          <span
            className={cn(
              "inline-flex w-fit items-center justify-center",
              presentation.geometry.actionClass,
              presentation.palette.accentClass,
              presentation.palette.accentTextClass,
              presentation.palette.borderClass,
              presentation.typography.actionClass,
            )}
            data-salon-module="booking-invitation"
            data-typography-role="action"
          >
            Find your next visit
          </span>
        </div>
      </div>
      <BlueprintSections
        draft={draft}
        fullPreview={fullPreview}
        presentation={presentation}
        composition="warm"
        activeStep={activeStep}
      />
      <BrandApplications viewModel={applications} presentation={presentation} />
      <DesignRationale presentation={presentation} />
    </article>
  )
}
