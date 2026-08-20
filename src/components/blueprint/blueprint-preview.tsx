import { EditorialTemplate } from "@/components/blueprint/templates/editorial-template"
import { StudioTemplate } from "@/components/blueprint/templates/studio-template"
import { WarmTemplate } from "@/components/blueprint/templates/warm-template"
import { resolveBlueprintPresentation } from "@/lib/blueprint/presentation"
import type { BlueprintStepId } from "@/lib/blueprint/progress"
import type { BlueprintDraft } from "@/lib/blueprint/types"

export function BlueprintPreview({
  draft,
  fullPreview = false,
  activeStep,
}: {
  draft: BlueprintDraft
  fullPreview?: boolean
  activeStep?: BlueprintStepId
}) {
  const presentation = resolveBlueprintPresentation(draft)
  const editorStep = fullPreview ? undefined : activeStep
  let template

  switch (draft.template) {
    case "studio":
      template = (
        <StudioTemplate
          draft={draft}
          fullPreview={fullPreview}
          presentation={presentation}
          activeStep={editorStep}
        />
      )
      break
    case "warm":
      template = (
        <WarmTemplate
          draft={draft}
          fullPreview={fullPreview}
          presentation={presentation}
          activeStep={editorStep}
        />
      )
      break
    default:
      template = (
        <EditorialTemplate
          draft={draft}
          fullPreview={fullPreview}
          presentation={presentation}
          activeStep={editorStep}
        />
      )
  }

  return (
    <div
      data-blueprint-preview=""
      data-template={presentation.template.id}
      data-visual-direction={presentation.geometry.id}
      data-color-direction={presentation.palette.id}
      data-typography-direction={presentation.typography.id}
      data-active-step={editorStep}
    >
      {template}
    </div>
  )
}
