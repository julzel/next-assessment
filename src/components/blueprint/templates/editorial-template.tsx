import { Badge } from "@/components/ui/badge"
import { BrandApplications } from "@/components/blueprint/brand-applications"
import { DesignRationale } from "@/components/blueprint/design-rationale"
import type { BlueprintPresentationProfile } from "@/lib/blueprint/presentation"
import { cn } from "@/lib/utils"

import {
  BlueprintSections,
  canvasFocusClasses,
  type BlueprintTemplateProps,
} from "./blueprint-sections"

export function EditorialTemplate({
  draft,
  fullPreview,
  presentation,
  applications,
  activeStep,
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
        canvasFocusClasses(activeStep),
      )}
      data-presentation-surface="canvas"
      data-composition="editorial-narrative"
      data-salon-direction="editorial-luxe"
      data-blueprint-section="canvas"
      data-editing-context={activeStep === "visual" ? "true" : undefined}
    >
      <div
        className={cn(
          "-mx-5 mb-8 px-5 sm:-mx-8 sm:px-8",
          presentation.geometry.heroClass,
          presentation.palette.surfaceClass,
          presentation.palette.borderClass,
        )}
        data-presentation-surface="hero"
      >
        <div className="grid items-center gap-7 sm:grid-cols-[minmax(0,1.2fr)_minmax(9rem,0.8fr)]">
          <div className="space-y-4">
            <Badge
              className={cn(
                "border-0 uppercase",
                presentation.palette.accentClass,
                presentation.palette.accentTextClass,
                presentation.typography.labelClass,
              )}
            >
              Editorial Luxe
            </Badge>
            <h2
              className={cn(
                "text-4xl leading-none sm:text-5xl",
                presentation.typography.displayClass,
              )}
              data-typography-role="display"
            >
              {draft.brandName.trim() || "Your salon name"}
            </h2>
            <p className={cn("max-w-xl text-sm leading-6", presentation.palette.mutedTextClass)}>
              A campaign-led salon direction built around craft, client care, and a clear next step.
            </p>
            <span
              className={cn(
                "inline-flex w-fit items-center justify-center",
                presentation.geometry.actionClass,
                presentation.palette.accentClass,
                presentation.palette.accentTextClass,
                presentation.palette.borderClass,
                presentation.typography.actionClass,
              )}
              data-salon-module="booking-cue"
              data-typography-role="action"
            >
              Book your visit
            </span>
          </div>
          <div
            role="img"
            aria-label="Abstract salon campaign frame showing the selected visual direction"
            className={cn(
              "relative isolate mx-auto w-full max-w-52 overflow-hidden",
              presentation.geometry.mediaFrameClass,
              presentation.palette.softSurfaceClass,
              presentation.palette.borderClass,
            )}
            data-salon-module="campaign-frame"
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute top-[14%] right-[12%]",
                presentation.geometry.accentShapeClass,
                presentation.palette.borderClass,
              )}
              data-salon-module="accent-shape"
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute right-[12%] bottom-[12%] left-[12%] block",
                presentation.geometry.dividerClass,
              )}
              data-salon-module="divider"
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute bottom-[19%] left-[12%] text-[0.6rem]",
                presentation.typography.labelClass,
                presentation.palette.mutedTextClass,
              )}
            >
              Craft / care / character
            </span>
          </div>
        </div>
        <div
          className={cn(
            "mt-6 grid gap-3 border-t py-4 sm:grid-cols-[auto_1fr] sm:items-center",
            presentation.palette.borderClass,
          )}
          data-salon-module="credentials-callout"
        >
          <p className={cn("text-xs", presentation.typography.labelClass)}>
            Proof to feature
          </p>
          <p className={cn("text-sm", presentation.palette.mutedTextClass)}>
            Technique, consultation, and client care — add verified credentials or a signature
            treatment when available.
          </p>
        </div>
      </div>
      <BlueprintSections
        draft={draft}
        fullPreview={fullPreview}
        presentation={presentation}
        composition="editorial"
        activeStep={activeStep}
      />
      <BrandApplications viewModel={applications} presentation={presentation} />
      <DesignRationale presentation={presentation} />
    </article>
  )
}
