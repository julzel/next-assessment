import {
  COLOR_DIRECTION_OPTIONS,
  COLOR_DIRECTION_SWATCHES,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
  optionLabel,
} from "@/lib/blueprint/options"
import type { BlueprintDraft } from "@/lib/blueprint/types"
import type { BlueprintPresentationProfile } from "@/lib/blueprint/presentation"
import { cn } from "@/lib/utils"

export type BlueprintTemplateProps = {
  draft: BlueprintDraft
  fullPreview?: boolean
  presentation?: BlueprintPresentationProfile
}

export function BlueprintSections({ draft, fullPreview = false, presentation }: BlueprintTemplateProps) {
  const { answers, content } = draft.config
  const visualDirection = optionLabel(VISUAL_DIRECTION_OPTIONS, answers.visualDirection)
  const colorDirection = optionLabel(COLOR_DIRECTION_OPTIONS, answers.colorDirection)
  const typographyDirection = optionLabel(TYPOGRAPHY_DIRECTION_OPTIONS, answers.typographyDirection)

  return (
    <div className={presentation?.geometry.sectionGapClass ?? "space-y-6"}>
      <section
        aria-labelledby="brand-header-heading"
        className={sectionClasses(presentation, "space-y-2")}
      >
        <h2 id="brand-header-heading" className={headingClasses(presentation)}>Brand header</h2>
        <p className="text-lg font-medium leading-7">{content.essence}</p>
      </section>
      <BlueprintSection title="Audience & promise" value={content.audiencePromise} presentation={presentation} />
      <BlueprintSection title="Personality" value={content.personality} presentation={presentation} />
      <section
        aria-labelledby="visual-direction-heading"
        className={sectionClasses(presentation, "space-y-2")}
        data-blueprint-section="visual-direction"
      >
        <h2 id="visual-direction-heading" className={headingClasses(presentation)}>Visual direction</h2>
        <p className="text-sm leading-6">{content.visualDirection}</p>
        <div className={cn("flex flex-wrap items-center gap-2 text-sm", presentation?.palette.mutedTextClass ?? "text-current/70")}>
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
            <span>Choose visual, color, and typography directions to see the system.</span>
          )}
        </div>
      </section>
      <BlueprintSection title="Voice & tone" value={content.voiceTone} presentation={presentation} />
      {(content.guardrail || !fullPreview) && (
        <section aria-labelledby="guardrail-heading" className={sectionClasses(presentation, "space-y-2")}>
          <h2 id="guardrail-heading" className={headingClasses(presentation)}>Brand guardrail</h2>
          <p className={cn("text-sm leading-6", presentation?.palette.mutedTextClass ?? "text-current/70")}>
            {content.guardrail ?? "No guardrail yet — add one when the brand needs a clear boundary."}
          </p>
        </section>
      )}
    </div>
  )
}

function BlueprintSection({
  title,
  value,
  presentation,
}: {
  title: string
  value: string
  presentation?: BlueprintPresentationProfile
}) {
  return (
    <section className={sectionClasses(presentation, "space-y-2")}>
      <h2 className={headingClasses(presentation)}>{title}</h2>
      <p className="text-sm leading-6">{value}</p>
    </section>
  )
}

function sectionClasses(presentation: BlueprintPresentationProfile | undefined, className: string) {
  return cn(
    className,
    presentation?.geometry.sectionClass,
    presentation?.palette.surfaceClass,
    presentation?.palette.borderClass,
  )
}

function headingClasses(presentation: BlueprintPresentationProfile | undefined) {
  return cn(
    "text-sm font-medium",
    presentation?.typography.labelClass,
    presentation?.palette.mutedTextClass ?? "text-current/70",
  )
}
