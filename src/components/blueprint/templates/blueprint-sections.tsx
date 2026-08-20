import {
  COLOR_DIRECTION_OPTIONS,
  COLOR_DIRECTION_SWATCHES,
  TYPOGRAPHY_DIRECTION_OPTIONS,
  VISUAL_DIRECTION_OPTIONS,
  optionLabel,
} from "@/lib/blueprint/options"
import type { BlueprintDraft } from "@/lib/blueprint/types"

export type BlueprintTemplateProps = {
  draft: BlueprintDraft
  fullPreview?: boolean
}

export function BlueprintSections({ draft, fullPreview = false }: BlueprintTemplateProps) {
  const { answers, content } = draft.config
  const visualDirection = optionLabel(VISUAL_DIRECTION_OPTIONS, answers.visualDirection)
  const colorDirection = optionLabel(COLOR_DIRECTION_OPTIONS, answers.colorDirection)
  const typographyDirection = optionLabel(TYPOGRAPHY_DIRECTION_OPTIONS, answers.typographyDirection)

  return (
    <div className="space-y-6">
      <section aria-labelledby="brand-header-heading" className="space-y-2">
        <h2 id="brand-header-heading" className="text-sm font-medium text-current/70">Brand header</h2>
        <p className="text-lg font-medium leading-7">{content.essence}</p>
      </section>
      <BlueprintSection title="Audience & promise" value={content.audiencePromise} />
      <BlueprintSection title="Personality" value={content.personality} />
      <section aria-labelledby="visual-direction-heading" className="space-y-2">
        <h2 id="visual-direction-heading" className="text-sm font-medium text-current/70">Visual direction</h2>
        <p className="text-sm leading-6">{content.visualDirection}</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-current/70">
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
      <BlueprintSection title="Voice & tone" value={content.voiceTone} />
      {(content.guardrail || !fullPreview) && (
        <section aria-labelledby="guardrail-heading" className="space-y-2">
          <h2 id="guardrail-heading" className="text-sm font-medium text-current/70">Brand guardrail</h2>
          <p className="text-sm leading-6 text-current/70">
            {content.guardrail ?? "No guardrail yet — add one when the brand needs a clear boundary."}
          </p>
        </section>
      )}
    </div>
  )
}

function BlueprintSection({ title, value }: { title: string; value: string }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-medium text-current/70">{title}</h2>
      <p className="text-sm leading-6">{value}</p>
    </section>
  )
}
