import { Badge } from "@/components/ui/badge"

import { BlueprintSections, type BlueprintTemplateProps } from "./blueprint-sections"

export function WarmTemplate({ draft, fullPreview }: BlueprintTemplateProps) {
  return (
    <article className="rounded-[2rem] bg-orange-100 p-5 text-orange-950 sm:p-8">
      <div className="mb-7 rounded-3xl bg-orange-500 p-5 text-orange-950 sm:p-7">
        <Badge className="mb-4 bg-orange-950 text-orange-50">Warm blueprint</Badge>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{draft.brandName.trim() || "Your brand name"}</h1>
        <p className="mt-3 max-w-md text-sm leading-6">An approachable, expressive brand direction designed to invite connection.</p>
      </div>
      <div className="rounded-3xl bg-orange-50 p-5 sm:p-6">
        <BlueprintSections draft={draft} fullPreview={fullPreview} />
      </div>
    </article>
  )
}
