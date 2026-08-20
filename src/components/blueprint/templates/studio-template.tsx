import { Badge } from "@/components/ui/badge"

import { BlueprintSections, type BlueprintTemplateProps } from "./blueprint-sections"

export function StudioTemplate({ draft, fullPreview }: BlueprintTemplateProps) {
  return (
    <article className="bg-slate-950 p-4 text-slate-50 sm:p-6">
      <div className="mb-6 grid gap-3 border-b border-slate-700 pb-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold tracking-[0.24em] text-cyan-300 uppercase">Brand system / 01</p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{draft.brandName.trim() || "Your brand name"}</h1>
        </div>
        <Badge className="w-fit bg-cyan-300 text-slate-950">Studio blueprint</Badge>
      </div>
      <div className="rounded-lg bg-slate-900 p-5 sm:p-6">
        <BlueprintSections draft={draft} fullPreview={fullPreview} />
      </div>
    </article>
  )
}
