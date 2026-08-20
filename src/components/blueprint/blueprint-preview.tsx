import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BlueprintDraft } from "@/lib/blueprint/types"

const templateDescriptions = {
  editorial: "Refined and typography-led",
  studio: "Clean and modular",
  warm: "Approachable and expressive",
} as const

export function BlueprintPreview({ draft }: { draft: BlueprintDraft }) {
  return (
    <Card className="min-h-72 bg-muted/30">
      <CardHeader>
        <Badge variant="secondary" className="w-fit capitalize">
          {draft.template} template
        </Badge>
        <CardTitle className="text-2xl">{draft.brandName.trim() || "Your brand name"}</CardTitle>
        <p className="text-sm text-muted-foreground">{templateDescriptions[draft.template]}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="font-medium">{draft.config.content.essence}</p>
        <p className="text-sm leading-6 text-muted-foreground">
          This is the first saved view. Guided brand questions and the full presentation arrive in the
          next step.
        </p>
      </CardContent>
    </Card>
  )
}
