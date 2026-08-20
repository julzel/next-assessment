import { EditorialTemplate } from "@/components/blueprint/templates/editorial-template"
import { StudioTemplate } from "@/components/blueprint/templates/studio-template"
import { WarmTemplate } from "@/components/blueprint/templates/warm-template"
import type { BlueprintDraft } from "@/lib/blueprint/types"

export function BlueprintPreview({ draft, fullPreview = false }: { draft: BlueprintDraft; fullPreview?: boolean }) {
  switch (draft.template) {
    case "studio":
      return <StudioTemplate draft={draft} fullPreview={fullPreview} />
    case "warm":
      return <WarmTemplate draft={draft} fullPreview={fullPreview} />
    default:
      return <EditorialTemplate draft={draft} fullPreview={fullPreview} />
  }
}
