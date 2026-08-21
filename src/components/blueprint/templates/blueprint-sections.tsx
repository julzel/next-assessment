import {
  COLOR_DIRECTION_OPTIONS,
  COLOR_DIRECTION_SWATCHES,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
  VOICE_TRAIT_OPTIONS,
  optionLabel,
} from "@/lib/blueprint/options"
import type { BlueprintPresentationProfile } from "@/lib/blueprint/presentation"
import {
  BLUEPRINT_STEP_PREVIEW_IMPACTS,
  type BlueprintStepId,
} from "@/lib/blueprint/progress"
import type { BlueprintDraft, TemplateId } from "@/lib/blueprint/types"
import { cn } from "@/lib/utils"

export type BlueprintTemplateProps = {
  draft: BlueprintDraft
  fullPreview?: boolean
  presentation: BlueprintPresentationProfile
  activeStep?: BlueprintStepId
}

type BlueprintSectionsProps = BlueprintTemplateProps & {
  composition: TemplateId
}

export function BlueprintSections({
  draft,
  fullPreview = false,
  presentation,
  composition,
  activeStep,
}: BlueprintSectionsProps) {
  const sections = createSemanticSections(draft, presentation, fullPreview, activeStep)

  if (composition === "studio") {
    return (
      <div
        className="blueprint-studio-grid grid gap-3 border p-3 sm:grid-cols-2 sm:p-4"
        data-section-layout="modular-grid"
      >
        <div className="sm:col-span-2">{sections.brandHeader}</div>
        <div className="sm:col-span-2">{sections.audience}</div>
        {sections.personality}
        {sections.visual}
        {sections.voice}
        {sections.guardrail && <div>{sections.guardrail}</div>}
      </div>
    )
  }

  if (composition === "warm") {
    return (
      <div className="blueprint-warm-glow space-y-4" data-section-layout="story-flow">
        {sections.brandHeader}
        <div className="ml-auto max-w-[92%]">{sections.audience}</div>
        <div className="mr-auto max-w-[92%]">{sections.personality}</div>
        <div className="ml-auto max-w-[92%]">{sections.visual}</div>
        <div className="mr-auto max-w-[92%]">{sections.voice}</div>
        {sections.guardrail && <div className="ml-auto max-w-[92%]">{sections.guardrail}</div>}
      </div>
    )
  }

  return (
    <div className={presentation.geometry.sectionGapClass} data-section-layout="editorial-flow">
      {sections.brandHeader}
      <div className="sm:ml-[12%]">{sections.audience}</div>
      <div className="grid gap-6 sm:grid-cols-[0.8fr_1.2fr]">
        {sections.personality}
        {sections.visual}
      </div>
      <div className="grid gap-6 sm:grid-cols-[1.2fr_0.8fr]">
        {sections.voice}
        {sections.guardrail}
      </div>
    </div>
  )
}

function createSemanticSections(
  draft: BlueprintDraft,
  presentation: BlueprintPresentationProfile,
  fullPreview: boolean,
  activeStep: BlueprintStepId | undefined,
) {
  const { answers, content } = draft.config
  const visualDirection = optionLabel(VISUAL_DIRECTION_OPTIONS, answers.visualDirection)
  const colorDirection = optionLabel(COLOR_DIRECTION_OPTIONS, answers.colorDirection)
  const typographyDirection = optionLabel(
    TYPOGRAPHY_DIRECTION_OPTIONS,
    answers.typographyDirection,
  )
  const frameProps = { presentation, activeStep }

  return {
    brandHeader: (
      <SectionFrame
        {...frameProps}
        title="Salon positioning"
        section="brand-header"
        className="relative overflow-hidden"
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-y-0 left-0 w-1.5",
            presentation.palette.accentClass,
          )}
        />
        <p className={cn("text-xl leading-8 sm:text-2xl", presentation.typography.displayClass)}>
          <span aria-hidden="true">“</span>
          <span>{content.essence}</span>
          <span aria-hidden="true">”</span>
        </p>
      </SectionFrame>
    ),
    audience: (
      <SectionFrame {...frameProps} title="Client promise" section="audience-promise">
        <p className="text-lg leading-8 sm:text-xl">{content.audiencePromise}</p>
        {answers.offerAudience && (
          <p className={cn("mt-4 text-xs", presentation.palette.mutedTextClass)}>
            Owner direction: {answers.offerAudience}
          </p>
        )}
      </SectionFrame>
    ),
    personality: (
      <SectionFrame {...frameProps} title="Salon character" section="personality">
        <p className="text-sm leading-6">{content.personality}</p>
        <PersonalityAccents presentation={presentation} />
      </SectionFrame>
    ),
    visual: (
      <SectionFrame {...frameProps} title="Salon visual direction" section="visual-direction">
        <p className="text-sm leading-6">{content.visualDirection}</p>
        <div
          className={cn(
            "mt-4 flex flex-wrap items-center gap-2 text-sm",
            presentation.palette.mutedTextClass,
          )}
        >
          {colorDirection && answers.colorDirection && (
            <span className="flex items-center gap-1.5">
              <span className="flex gap-1" aria-hidden="true">
                {COLOR_DIRECTION_SWATCHES[answers.colorDirection].map((color) => (
                  <span key={color} className={`size-3 rounded-full ${color}`} />
                ))}
              </span>
              {colorDirection}
            </span>
          )}
          {visualDirection && <span>• {visualDirection}</span>}
          {typographyDirection && <span>• {typographyDirection}</span>}
          {!colorDirection && !visualDirection && !typographyDirection && (
            <span>Neutral defaults are shown until the visual system is selected.</span>
          )}
        </div>
      </SectionFrame>
    ),
    voice: (
      <SectionFrame {...frameProps} title="Client-facing voice" section="voice-tone">
        <p className="text-sm leading-6">{content.voiceTone}</p>
        <div className="mt-4 flex flex-wrap gap-2" aria-label="Voice traits">
          {answers.voiceTraits.length > 0 ? (
            answers.voiceTraits.map((trait) => (
              <span
                key={trait}
                className={cn(
                  "border px-2.5 py-1 text-xs font-medium",
                  presentation.palette.softSurfaceClass,
                  presentation.palette.borderClass,
                )}
              >
                {optionLabel(VOICE_TRAIT_OPTIONS, trait)}
              </span>
            ))
          ) : (
            <span className={cn("text-xs", presentation.palette.mutedTextClass)}>
              Choose voice traits to guide website, social, print, and in-salon communication.
            </span>
          )}
        </div>
        <div className={cn("mt-4 border-t pt-3", presentation.palette.borderClass)}>
          <p className={sectionLabelClasses(presentation)}>Always communicate</p>
          <p className="mt-1 text-sm">
            {answers.alwaysCommunicate ||
              "Add the message clients should recognize across every salon touchpoint."}
          </p>
        </div>
      </SectionFrame>
    ),
    guardrail:
      content.guardrail || !fullPreview ? (
        <SectionFrame {...frameProps} title="Communication guardrail" section="guardrail">
          <p className={cn("text-sm leading-6", presentation.palette.mutedTextClass)}>
            {content.guardrail ??
              "No guardrail yet — add one when client communication needs a clear boundary."}
          </p>
          {answers.avoid && (
            <p className={cn("mt-3 text-xs", presentation.palette.mutedTextClass)}>
              Avoid: {answers.avoid}
            </p>
          )}
        </SectionFrame>
      ) : null,
  }
}

function SectionFrame({
  title,
  section,
  presentation,
  activeStep,
  className,
  children,
}: {
  title: string
  section: string
  presentation: BlueprintPresentationProfile
  activeStep?: BlueprintStepId
  className?: string
  children: React.ReactNode
}) {
  const impact = activeStep ? BLUEPRINT_STEP_PREVIEW_IMPACTS[activeStep] : null
  const isPrimary = impact?.primarySection === section
  const isContext = (impact?.sections as readonly string[] | undefined)?.includes(section) ?? false

  return (
    <section
      aria-label={title}
      className={cn(
        "blueprint-focus-target h-full space-y-3 transition-shadow motion-reduce:transition-none",
        presentation.geometry.sectionClass,
        presentation.palette.surfaceClass,
        presentation.palette.borderClass,
        isPrimary && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        isContext && !isPrimary && "ring-1 ring-primary/50 ring-offset-1",
        className,
      )}
      data-blueprint-section={section}
      data-editing-now={isPrimary ? "true" : undefined}
      data-editing-context={isContext && !isPrimary ? "true" : undefined}
      tabIndex={-1}
    >
      {isPrimary && impact && (
        <p
          className="flex flex-wrap items-center gap-2 rounded-md bg-primary px-2.5 py-1.5 text-xs text-primary-foreground"
          data-editing-indicator=""
        >
          <span className="font-semibold">Editing now</span>
          <span>{impact.inputLabel}</span>
        </p>
      )}
      <h3 className={sectionLabelClasses(presentation)}>{title}</h3>
      {children}
    </section>
  )
}

export function canvasFocusClasses(activeStep: BlueprintStepId | undefined) {
  return activeStep === "visual"
    ? "blueprint-focus-target ring-2 ring-primary ring-offset-2 ring-offset-background transition-shadow motion-reduce:transition-none"
    : undefined
}

function PersonalityAccents({ presentation }: { presentation: BlueprintPresentationProfile }) {
  return (
    <div className="mt-4 flex flex-wrap gap-2" aria-label="Personality accents">
      {presentation.personality.modifiers.length > 0 ? (
        presentation.personality.modifiers.map((modifier) => (
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
        ))
      ) : (
        <span className={cn("text-xs", presentation.palette.mutedTextClass)}>
          Neutral accents are shown until personality traits are selected.
        </span>
      )}
    </div>
  )
}

function sectionLabelClasses(presentation: BlueprintPresentationProfile) {
  return cn(
    "text-xs",
    presentation.typography.labelClass,
    presentation.palette.mutedTextClass,
  )
}
