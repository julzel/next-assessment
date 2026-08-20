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
}: {
  colorDirection: ColorDirection | null
  typographyDirection: TypographyDirection | null
  onColorDirectionChange: (direction: ColorDirection) => void
  onTypographyDirectionChange: (direction: TypographyDirection) => void
}) {
  return (
    <div className="space-y-7">
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Choose a color direction.</legend>
        <RadioGroup
          value={colorDirection ?? undefined}
          onValueChange={(value) => onColorDirectionChange(value as ColorDirection)}
          className="gap-2"
        >
          {COLOR_DIRECTION_OPTIONS.map((direction) => (
            <Label key={direction.id} className="cursor-pointer gap-3 rounded-lg border p-3">
              <RadioGroupItem value={direction.id} />
              <span className="flex gap-1" aria-hidden="true">
                {COLOR_DIRECTION_SWATCHES[direction.id].map((color) => (
                  <span key={color} className={`size-4 rounded-full ${color}`} />
                ))}
              </span>
              {direction.label}
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Choose a typography direction.</legend>
        <RadioGroup
          value={typographyDirection ?? undefined}
          onValueChange={(value) => onTypographyDirectionChange(value as TypographyDirection)}
          className="gap-2"
        >
          {TYPOGRAPHY_DIRECTION_OPTIONS.map((direction) => (
            <Label key={direction.id} className="cursor-pointer gap-3 rounded-lg border p-3">
              <RadioGroupItem value={direction.id} />
              {direction.label}
            </Label>
          ))}
        </RadioGroup>
      </fieldset>
    </div>
  )
}
