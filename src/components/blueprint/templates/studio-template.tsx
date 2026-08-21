import { DesignRationale } from "@/components/blueprint/design-rationale"
import { BrandApplications } from "@/components/blueprint/brand-applications"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import {
  BlueprintSections,
  canvasFocusClasses,
  type BlueprintTemplateProps,
} from "./blueprint-sections"

export function StudioTemplate({
  draft,
  fullPreview,
  presentation,
  applications,
  activeStep,
}: BlueprintTemplateProps) {
  return (
    <article
      className={cn(
        "blueprint-studio-grid overflow-hidden p-4 sm:p-6",
        presentation.palette.canvasClass,
        presentation.palette.textClass,
        presentation.palette.borderClass,
        presentation.typography.bodyClass,
        presentation.geometry.canvasClass,
        canvasFocusClasses(activeStep),
      )}
      data-composition="studio-system-board"
      data-salon-direction="modern-studio"
      data-presentation-surface="canvas"
      data-blueprint-section="canvas"
      data-editing-context={activeStep === "visual" ? "true" : undefined}
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
            Salon system / 01
          </p>
          <h2
            className={cn(
              "text-4xl leading-none sm:text-5xl",
              presentation.typography.displayClass,
            )}
            data-typography-role="display"
          >
            {draft.brandName.trim() || "Your salon name"}
          </h2>
        </div>
        <Badge
          className={cn(
            "w-fit border-0",
            presentation.palette.accentClass,
            presentation.palette.accentTextClass,
            presentation.typography.labelClass,
          )}
        >
          Modern Studio
        </Badge>
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
        <section
          className={cn(
            "min-w-0 border p-5",
            presentation.palette.surfaceClass,
            presentation.palette.borderClass,
            presentation.geometry.sectionClass,
          )}
          data-salon-module="service-index"
        >
          <div className="flex items-center justify-between gap-4">
            <p className={cn("text-xs", presentation.typography.labelClass)}>Service index</p>
            <span className={cn("text-xs", presentation.palette.mutedTextClass)}>01—03</span>
          </div>
          <p
            className={cn(
              "mt-5 break-words text-xl leading-tight sm:text-2xl",
              presentation.typography.serviceClass,
            )}
            data-typography-role="service"
          >
            {draft.config.answers.offerAudience ||
              "Your signature service or salon experience will be organized here."}
          </p>
          <div className={cn("mt-5 space-y-2", presentation.palette.mutedTextClass)}>
            {[
              "Make the core offer easy to scan",
              "Pair services with client needs",
              "Keep the next step unmistakable",
            ].map((item, index) => (
              <div
                key={item}
                className={cn(
                  "grid grid-cols-[auto_1fr] gap-3 border-t pt-2 text-xs",
                  presentation.palette.borderClass,
                )}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="grid min-w-0 gap-3">
          <section
            className={cn(
              "border p-5",
              presentation.palette.softSurfaceClass,
              presentation.palette.borderClass,
              presentation.geometry.serviceCardClass,
            )}
            data-salon-module="expertise-proof"
          >
            <p className={cn("text-xs", presentation.typography.labelClass)}>
              Expertise framework
            </p>
            <p className="mt-3 text-sm leading-6">
              Show verified technique, experience, and care signals here—never unsupported
              claims.
            </p>
          </section>
          <div
            className={cn(
              "flex items-center justify-between gap-4",
              presentation.geometry.actionClass,
              presentation.palette.accentClass,
              presentation.palette.accentTextClass,
              presentation.palette.borderClass,
              presentation.typography.actionClass,
            )}
            data-salon-module="appointment-path"
            data-typography-role="action"
          >
            <span>Choose service</span>
            <span aria-hidden="true">→ Book</span>
          </div>
        </div>
      </div>
      <BlueprintSections
        draft={draft}
        fullPreview={fullPreview}
        presentation={presentation}
        composition="studio"
        activeStep={activeStep}
      />
      <BrandApplications viewModel={applications} presentation={presentation} />
      <DesignRationale presentation={presentation} />
    </article>
  )
}
