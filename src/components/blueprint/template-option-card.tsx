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
        "block h-20 overflow-hidden border bg-background p-2 text-foreground transition-colors group-has-[[data-checked]]:border-primary",
        template === "editorial" && "rounded-sm",
        template === "studio" && "rounded-md",
        template === "warm" && "rounded-2xl",
      )}
    >
      {template === "editorial" && (
        <span className="grid h-full grid-cols-[1.2fr_0.8fr] gap-1.5 border-y-2 border-current py-1.5">
          <span className="grid min-w-0 content-between">
            <span className="h-1 w-1/3 bg-current" />
            <span className="space-y-1">
              <span className="block h-2 w-4/5 bg-current" />
              <span className="block h-1 w-1/2 bg-current/40" />
            </span>
          </span>
          <span className="relative border border-current bg-current/10">
            <span className="absolute right-1 bottom-1 left-1 h-px bg-current" />
          </span>
        </span>
      )}
      {template === "studio" && (
        <span className="grid h-full grid-cols-[0.8fr_1.2fr] grid-rows-[auto_1fr] gap-1">
          <span className="col-span-2 flex items-center justify-between border-b-2 border-current pb-1">
            <span className="h-1.5 w-1/3 bg-current" />
            <span className="size-2 bg-current" />
          </span>
          <span className="grid content-between border border-current p-1">
            <span className="h-1 w-1/2 bg-current/40" />
            <span className="space-y-1">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
          </span>
          <span className="grid grid-cols-2 gap-1">
            <span className="border border-current bg-current/10" />
            <span className="grid grid-rows-2 gap-1">
              <span className="bg-current" />
              <span className="border border-current" />
            </span>
          </span>
        </span>
      )}
      {template === "warm" && (
        <span className="grid h-full grid-rows-[1.15fr_0.85fr] gap-1.5">
          <span className="grid grid-cols-[auto_1fr] items-center gap-2 rounded-xl border border-current p-1.5">
            <span className="size-5 rounded-full bg-current/20" />
            <span className="space-y-1">
              <span className="block h-1.5 w-3/4 bg-current" />
              <span className="block h-1 w-full bg-current/40" />
            </span>
          </span>
          <span className="grid grid-cols-[1fr_0.8fr] gap-1.5">
            <span className="rounded-xl border border-current bg-current/10" />
            <span className="rounded-full bg-current" />
          </span>
        </span>
      )}
    </span>
  )
}
