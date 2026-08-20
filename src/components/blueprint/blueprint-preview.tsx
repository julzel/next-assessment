import { EditorialTemplate } from "@/components/blueprint/templates/editorial-template"
import { StudioTemplate } from "@/components/blueprint/templates/studio-template"
import { WarmTemplate } from "@/components/blueprint/templates/warm-template"
import { resolveBlueprintPresentation } from "@/lib/blueprint/presentation"
import type { BlueprintDraft } from "@/lib/blueprint/types"

export function BlueprintPreview({ draft, fullPreview = false }: { draft: BlueprintDraft; fullPreview?: boolean }) {
  const presentation = resolveBlueprintPresentation(draft)
  let template

  switch (draft.template) {
    case "studio":
      template = (
        <StudioTemplate draft={draft} fullPreview={fullPreview} presentation={presentation} />
      )
      break
    case "warm":
      template = (
        <WarmTemplate draft={draft} fullPreview={fullPreview} presentation={presentation} />
      )
      break
    default:
      template = (
        <EditorialTemplate
          draft={draft}
          fullPreview={fullPreview}
          presentation={presentation}
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
    >
      {template}
    </div>
  )
}
