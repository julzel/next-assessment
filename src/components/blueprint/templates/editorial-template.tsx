import { Badge } from "@/components/ui/badge"

import { BlueprintSections, type BlueprintTemplateProps } from "./blueprint-sections"

export function EditorialTemplate({ draft, fullPreview }: BlueprintTemplateProps) {
  return (
    <article className="border-y-4 border-foreground bg-background px-6 py-8 text-foreground sm:px-10">
      <div className="mb-8 space-y-3 text-center">
        <Badge variant="outline" className="uppercase">Editorial blueprint</Badge>
        <h1 className="font-serif text-4xl leading-none tracking-tight sm:text-5xl">
          {draft.brandName.trim() || "Your brand name"}
        </h1>
        <p className="text-sm italic text-muted-foreground">A refined, typography-led point of view</p>
      </div>
      <BlueprintSections draft={draft} fullPreview={fullPreview} />
    </article>
  )
}
