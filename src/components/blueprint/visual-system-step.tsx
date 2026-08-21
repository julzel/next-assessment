import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  COLOR_DIRECTION_OPTIONS,
  COLOR_DIRECTION_SWATCHES,
  TYPOGRAPHY_DIRECTION_OPTIONS,
} from "@/lib/blueprint/options"
import type { ColorDirection, TypographyDirection } from "@/lib/blueprint/types"

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
              <span className="flex gap-1" aria-hidden="true">
                {COLOR_DIRECTION_SWATCHES[direction.id].map((color) => (
                  <span key={color} className={`size-4 rounded-full ${color}`} />
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
          {TYPOGRAPHY_DIRECTION_OPTIONS.map((direction) => (
            <Label
              key={direction.id}
              htmlFor={`typography-direction-${direction.id}`}
              className="cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <RadioGroupItem id={`typography-direction-${direction.id}`} value={direction.id} />
              <span className="grid gap-1">
                <span>{direction.label}</span>
                <span className="font-normal text-muted-foreground">{direction.description}</span>
                <span className="text-xs font-normal">{direction.effect}</span>
              </span>
            </Label>
          ))}
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
