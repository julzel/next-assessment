import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  COLOR_DIRECTION_OPTIONS,
  COLOR_DIRECTION_SWATCHES,
  TYPOGRAPHY_DIRECTION_OPTIONS,
} from "@/lib/blueprint/options"
import { getTypographyPreviewClasses } from "@/lib/blueprint/presentation"
import type { ColorDirection, TypographyDirection } from "@/lib/blueprint/types"
import { cn } from "@/lib/utils"

export function VisualSystemStep({
  colorDirection,
  typographyDirection,
  onColorDirectionChange,
  onTypographyDirectionChange,
  errors = {},
}: {
  colorDirection: ColorDirection | null
  typographyDirection: TypographyDirection | null
  onColorDirectionChange: (direction: ColorDirection) => void
  onTypographyDirectionChange: (direction: TypographyDirection) => void
  errors?: Partial<Record<"colorDirection" | "typographyDirection", string>>
}) {
  return (
    <div className="space-y-7">
      <fieldset
        id="color-direction"
        tabIndex={-1}
        className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-invalid={Boolean(errors.colorDirection)}
        aria-describedby={errors.colorDirection ? "color-direction-help color-direction-error" : "color-direction-help"}
      >
        <legend className="text-sm font-medium">Choose a color direction for the salon.</legend>
        <p id="color-direction-help" className="text-sm text-muted-foreground">
          The palette controls the Blueprint canvas, surfaces, text, borders, and accents that will
          carry into website, social, and print examples.
        </p>
        <RadioGroup
          value={colorDirection ?? ""}
          onValueChange={(value) => onColorDirectionChange(value as ColorDirection)}
          className="gap-2"
        >
          {COLOR_DIRECTION_OPTIONS.map((direction) => (
            <Label
              key={direction.id}
              htmlFor={`color-direction-${direction.id}`}
              className="cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <RadioGroupItem id={`color-direction-${direction.id}`} value={direction.id} />
              <span
                className="flex h-10 w-16 shrink-0 overflow-hidden rounded-md border"
                aria-label={`${direction.label} palette sample`}
                role="img"
              >
                {COLOR_DIRECTION_SWATCHES[direction.id].map((color, index) => (
                  <span
                    key={color}
                    className={`${index === 0 ? "w-1/2" : "w-1/4"} ${color}`}
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span className="grid gap-1">
                <span>{direction.label}</span>
                <span className="font-normal text-muted-foreground">{direction.description}</span>
                <span className="text-xs font-normal">{direction.effect}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
        {errors.colorDirection && (
          <p id="color-direction-error" className="text-sm text-destructive">
            {errors.colorDirection}
          </p>
        )}
      </fieldset>
      <fieldset
        id="typography-direction"
        tabIndex={-1}
        className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-invalid={Boolean(errors.typographyDirection)}
        aria-describedby={errors.typographyDirection ? "typography-direction-help typography-direction-error" : "typography-direction-help"}
      >
        <legend className="text-sm font-medium">Choose a typography direction for the salon.</legend>
        <p id="typography-direction-help" className="text-sm text-muted-foreground">
          This controls how the salon name, service headlines, and client guidance relate in every
          template and channel.
        </p>
        <RadioGroup
          value={typographyDirection ?? ""}
          onValueChange={(value) => onTypographyDirectionChange(value as TypographyDirection)}
          className="gap-2"
        >
          {TYPOGRAPHY_DIRECTION_OPTIONS.map((direction) => {
            const preview = getTypographyPreviewClasses(direction.id)

            return (
              <Label
                key={direction.id}
                htmlFor={`typography-direction-${direction.id}`}
                className="cursor-pointer items-start gap-3 rounded-lg border p-3"
              >
                <RadioGroupItem id={`typography-direction-${direction.id}`} value={direction.id} />
                <span className="grid min-w-0 flex-1 gap-2">
                  <span>{direction.label}</span>
                  <span
                    className="grid gap-1 rounded-md bg-muted/50 p-3"
                    aria-label={`${direction.label} type sample`}
                  >
                    <span className={cn("text-xl leading-none", preview.displayClass)}>
                      Salon name
                    </span>
                    <span className={cn("text-xs", preview.serviceClass)}>Signature service</span>
                    <span className={cn("text-[0.65rem]", preview.actionClass)}>Book your visit</span>
                  </span>
                  <span className="font-normal text-muted-foreground">
                    {direction.description}
                  </span>
                  <span className="text-xs font-normal">{direction.effect}</span>
                </span>
              </Label>
            )
          })}
        </RadioGroup>
        {errors.typographyDirection && (
          <p id="typography-direction-error" className="text-sm text-destructive">
            {errors.typographyDirection}
          </p>
        )}
      </fieldset>
    </div>
  )
}
