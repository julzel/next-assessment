import type { BrandApplicationViewModel } from "@/lib/blueprint/applications"
import type { BlueprintPresentationProfile } from "@/lib/blueprint/presentation"
import { cn } from "@/lib/utils"

export function BrandApplications({
  viewModel,
  presentation,
}: {
  viewModel: BrandApplicationViewModel
  presentation: BlueprintPresentationProfile
}) {
  const applicationAttributes = {
    "data-application-palette": viewModel.sharedSystem.palette,
    "data-application-typography": viewModel.sharedSystem.typography,
    "data-application-geometry": viewModel.sharedSystem.geometry,
  }
  const personalityLabel =
    viewModel.sharedSystem.personality.length > 0
      ? viewModel.sharedSystem.personality.join(" · ")
      : "Neutral character example"
  const voiceLabel =
    viewModel.sharedSystem.voice.length > 0
      ? viewModel.sharedSystem.voice.join(" · ")
      : "Neutral voice example"
  const primaryPersonality = presentation.personality.modifiers[0]

  return (
    <section
      aria-label="Brand in use"
      className={cn(
        "mt-8 min-w-0 border p-4 sm:p-6",
        presentation.palette.surfaceClass,
        presentation.palette.borderClass,
        presentation.geometry.sectionClass,
      )}
      data-brand-applications=""
      data-application-fallback={viewModel.isPartial ? "true" : "false"}
    >
      <p className={cn("text-xs", presentation.typography.labelClass)}>
        Representative channel proofs
      </p>
      <h3 className={cn("mt-2 text-2xl sm:text-3xl", presentation.typography.displayClass)}>
        Brand in use
      </h3>
      <p className={cn("mt-2 max-w-3xl text-sm leading-6", presentation.palette.mutedTextClass)}>
        These are illustrative previews, not publishable website, social, or print files. They show
        how one salon direction behaves at different scales.
      </p>
      <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
        <div className={cn("border-t pt-3", presentation.palette.borderClass)}>
          <dt className={cn("text-xs", presentation.typography.labelClass)}>Carries across</dt>
          <dd className="mt-1 leading-6">{viewModel.guidance.carries}</dd>
        </div>
        <div className={cn("border-t pt-3", presentation.palette.borderClass)}>
          <dt className={cn("text-xs", presentation.typography.labelClass)}>Adapts by channel</dt>
          <dd className="mt-1 leading-6">{viewModel.guidance.adapts}</dd>
        </div>
      </dl>

      <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div
          aria-label="Website application proof"
          className={cn(
            "min-w-0 overflow-hidden border",
            presentation.palette.softSurfaceClass,
            presentation.palette.borderClass,
            presentation.geometry.serviceCardClass,
            presentation.typography.bodyClass,
          )}
          data-brand-application="website"
          {...applicationAttributes}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-3 border-b px-3 py-2",
              presentation.palette.surfaceClass,
              presentation.palette.borderClass,
            )}
          >
            <span className={cn("break-words text-[0.65rem]", presentation.typography.labelClass)}>
              {viewModel.brandName}
            </span>
            <span className={cn("text-[0.6rem]", presentation.palette.mutedTextClass)}>
              Website
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <p className={cn("text-[0.65rem]", presentation.typography.labelClass)}>
              {viewModel.website.label}
            </p>
            <h4
              className={cn(
                "mt-3 break-words text-xl leading-tight sm:text-2xl",
                presentation.typography.displayClass,
              )}
            >
              {viewModel.website.positioning}
            </h4>
            <p className={cn("mt-3 break-words text-xs leading-5", presentation.palette.mutedTextClass)}>
              {viewModel.website.clientPromise}
            </p>
            <ApplicationSignature
              personalityLabel={personalityLabel}
              voiceLabel={voiceLabel}
              presentation={presentation}
              personalityClass={primaryPersonality?.accentClass}
            />
            <span
              className={cn(
                "mt-5 inline-flex w-fit items-center justify-center",
                presentation.geometry.actionClass,
                presentation.palette.accentClass,
                presentation.palette.accentTextClass,
                presentation.palette.borderClass,
                presentation.typography.actionClass,
              )}
              data-application-action="preview-only"
            >
              {viewModel.website.action}
            </span>
          </div>
        </div>

        <div
          aria-label="Social application proof"
          className={cn(
            "min-w-0 overflow-hidden border",
            presentation.palette.surfaceClass,
            presentation.palette.borderClass,
            presentation.geometry.serviceCardClass,
            presentation.typography.bodyClass,
          )}
          data-brand-application="social"
          {...applicationAttributes}
        >
          <div
            className={cn(
              "blueprint-application-safe-area flex aspect-square min-h-0 flex-col justify-between gap-3 p-4 sm:p-5",
              presentation.palette.accentClass,
              presentation.palette.accentTextClass,
            )}
            data-social-safe-area=""
          >
            <div className="flex items-start justify-between gap-3">
              <p className={cn("break-words text-[0.6rem] leading-tight", presentation.typography.labelClass)}>
                {viewModel.brandName}
              </p>
              <span className="shrink-0 text-[0.6rem]">Social / 1:1</span>
            </div>
            <div className="min-w-0">
              <p className={cn("text-[0.6rem]", presentation.typography.labelClass)}>
                {viewModel.social.messageLabel}
              </p>
              <h4
                className={cn(
                  "mt-2 break-words text-2xl leading-none sm:text-3xl",
                  presentation.typography.displayClass,
                )}
              >
                {viewModel.social.message}
              </h4>
            </div>
            <p className={cn("break-words text-[0.65rem]", presentation.typography.labelClass)}>
              {viewModel.social.voiceTreatment}
            </p>
          </div>
          <div className="min-w-0 p-3">
            <p className={cn("text-[0.6rem]", presentation.typography.labelClass)}>
              Foundation context
            </p>
            <p className={cn("mt-1 break-words text-xs leading-5", presentation.palette.mutedTextClass)}>
              {viewModel.social.foundationContext}
            </p>
            <ApplicationSignature
              personalityLabel={personalityLabel}
              voiceLabel={voiceLabel}
              presentation={presentation}
              personalityClass={primaryPersonality?.accentClass}
            />
          </div>
        </div>

        <div
          aria-label="Print application proof"
          className={cn(
            "min-w-0 border p-3 sm:col-span-2 sm:p-4 xl:col-span-1",
            presentation.palette.softSurfaceClass,
            presentation.palette.borderClass,
            presentation.geometry.serviceCardClass,
            presentation.typography.bodyClass,
          )}
          data-brand-application="print"
          {...applicationAttributes}
        >
          <div
            className={cn(
              "blueprint-print-safe-area grid min-h-48 min-w-0 content-between gap-5 border p-4",
              presentation.palette.surfaceClass,
              presentation.palette.borderClass,
            )}
            data-print-safe-area=""
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={cn("text-[0.6rem]", presentation.typography.labelClass)}>
                  {viewModel.print.proofLabel}
                </p>
                <h4
                  className={cn(
                    "mt-1 break-words text-lg leading-tight",
                    presentation.typography.displayClass,
                  )}
                >
                  {viewModel.brandName}
                </h4>
              </div>
              <span className={cn("shrink-0 text-[0.6rem]", presentation.palette.mutedTextClass)}>
                Print
              </span>
            </div>
            <p className={cn("break-words text-sm leading-5", presentation.typography.serviceClass)}>
              {viewModel.print.serviceContext}
            </p>
            <ApplicationSignature
              personalityLabel={personalityLabel}
              voiceLabel={voiceLabel}
              presentation={presentation}
              personalityClass={primaryPersonality?.accentClass}
            />
            <div className={cn("border-t pt-3", presentation.palette.borderClass)}>
              <p className="break-words text-xs leading-5">{viewModel.print.clientMessage}</p>
              <p className={cn("mt-2 text-[0.6rem]", presentation.typography.labelClass)}>
                {viewModel.print.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ApplicationSignature({
  personalityLabel,
  voiceLabel,
  presentation,
  personalityClass,
}: {
  personalityLabel: string
  voiceLabel: string
  presentation: BlueprintPresentationProfile
  personalityClass?: string
}) {
  return (
    <div className="mt-3 flex min-w-0 flex-wrap gap-1.5 text-[0.6rem]">
      <span
        className={cn("border px-2 py-1", presentation.palette.borderClass, personalityClass)}
        data-application-personality=""
      >
        Character: {personalityLabel}
      </span>
      <span
        className={cn(
          "border px-2 py-1",
          presentation.palette.borderClass,
          presentation.typography.labelClass,
        )}
        data-application-voice=""
      >
        Voice: {voiceLabel}
      </span>
    </div>
  )
}
