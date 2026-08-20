import { Label } from "@/components/ui/label"
import { RadioGroupItem } from "@/components/ui/radio-group"
import type { TemplateOption } from "@/lib/blueprint/options"
import type { TemplateId } from "@/lib/blueprint/types"
import { cn } from "@/lib/utils"

export function TemplateOptionCard({ option }: { option: TemplateOption }) {
  return (
    <Label
      htmlFor={`template-${option.id}`}
      className="group cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5"
      data-template-option={option.id}
    >
      <RadioGroupItem id={`template-${option.id}`} value={option.id} className="mt-0.5" />
      <span className="grid min-w-0 flex-1 gap-3">
        <TemplateThumbnail template={option.id} />
        <span className="grid gap-1">
          <span>{option.label}</span>
          <span className="font-normal text-muted-foreground">{option.description}</span>
          <span className="text-xs font-normal">{option.effect}</span>
          <span className="sr-only">Composition: {option.composition}</span>
        </span>
      </span>
    </Label>
  )
}

function TemplateThumbnail({ template }: { template: TemplateId }) {
  return (
    <span
      aria-hidden="true"
      data-template-thumbnail={template}
      className={cn(
        "block h-16 overflow-hidden border bg-background p-2 text-foreground transition-colors group-has-[[data-checked]]:border-primary",
        template === "warm" && "rounded-2xl bg-orange-50",
        template === "studio" && "rounded-sm bg-slate-950 text-slate-50",
      )}
    >
      {template === "editorial" && (
        <span className="grid h-full grid-rows-[auto_1fr] gap-1 border-y-2 border-current py-1">
          <span className="mx-auto h-1.5 w-2/5 bg-current" />
          <span className="grid grid-cols-[1.25fr_0.75fr] gap-1">
            <span className="border-t border-current" />
            <span className="space-y-1 border-l border-current pl-1">
              <span className="block h-1 bg-current" />
              <span className="block h-1 w-2/3 bg-current/40" />
            </span>
          </span>
        </span>
      )}
      {template === "studio" && (
        <span className="grid h-full grid-cols-2 grid-rows-[auto_1fr] gap-1">
          <span className="col-span-2 h-2 border-b border-cyan-300" />
          <span className="border border-slate-600 bg-slate-900" />
          <span className="grid grid-rows-2 gap-1">
            <span className="bg-cyan-300" />
            <span className="border border-slate-600" />
          </span>
        </span>
      )}
      {template === "warm" && (
        <span className="grid h-full grid-rows-[1.15fr_0.85fr] gap-1">
          <span className="rounded-xl bg-orange-400" />
          <span className="grid grid-cols-2 gap-1">
            <span className="rounded-lg bg-white" />
            <span className="rounded-lg bg-orange-200" />
          </span>
        </span>
      )}
    </span>
  )
}
