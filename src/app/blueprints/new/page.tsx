import { BlueprintWorkspace } from "@/components/blueprint/blueprint-workspace"
import { createEmptyBlueprintConfig } from "@/lib/blueprint/defaults"

export default function NewBlueprintPage() {
  return (
    <BlueprintWorkspace
      initialDraft={{
        id: null,
        brandName: "",
        template: "editorial",
        config: createEmptyBlueprintConfig(),
        createdAt: null,
        updatedAt: null,
      }}
    />
  )
}
