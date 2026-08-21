import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PERSONALITY_TRAIT_OPTIONS, VISUAL_DIRECTION_OPTIONS } from "@/lib/blueprint/options"
import type { PersonalityTrait, VisualDirection } from "@/lib/blueprint/types"

export function PersonalityStep({
  personalityTraits,
  visualDirection,
  onTraitsChange,
  onVisualDirectionChange,
  errors = {},
}: {
  personalityTraits: PersonalityTrait[]
  visualDirection: VisualDirection | null
  onTraitsChange: (traits: PersonalityTrait[]) => void
  onVisualDirectionChange: (direction: VisualDirection) => void
  errors?: Partial<Record<"personalityTraits" | "visualDirection", string>>
}) {
  function toggleTrait(trait: PersonalityTrait) {
    if (personalityTraits.includes(trait)) {
      onTraitsChange(personalityTraits.filter((value) => value !== trait))
    } else if (personalityTraits.length < 3) {
      onTraitsChange([...personalityTraits, trait])
    }
  }

  return (
    <div className="space-y-7">
      <fieldset
        id="personality-traits"
        tabIndex={-1}
        className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-invalid={Boolean(errors.personalityTraits)}
        aria-describedby={errors.personalityTraits ? "personality-count personality-traits-error" : "personality-count"}
      >
        <legend className="text-sm font-medium">
          Choose three traits that should define the salon experience.
        </legend>
        <p className="text-sm text-muted-foreground">
          These shape how clients should feel across the salon, website, social content, and print.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {PERSONALITY_TRAIT_OPTIONS.map((trait) => {
            const selected = personalityTraits.includes(trait.id)
            const disabled = !selected && personalityTraits.length === 3
            return (
              <Button
                key={trait.id}
                type="button"
                variant={selected ? "secondary" : "outline"}
                className="h-auto min-h-24 w-full items-start justify-start whitespace-normal p-3 text-left"
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => toggleTrait(trait.id)}
              >
                <span className="grid gap-1">
                  <span className="font-medium">{trait.label}</span>
                  <span className="text-xs font-normal text-muted-foreground">{trait.description}</span>
                  <span className="text-xs font-normal">{trait.effect}</span>
                </span>
              </Button>
            )
          })}
        </div>
        <p id="personality-count" aria-live="polite" className="text-sm text-muted-foreground">
          {personalityTraits.length === 3
            ? "Three traits selected."
            : `Choose ${3 - personalityTraits.length} more trait${3 - personalityTraits.length === 1 ? "" : "s"}.`}
        </p>
        {errors.personalityTraits && (
          <p id="personality-traits-error" className="text-sm text-destructive">
            {errors.personalityTraits}
          </p>
        )}
      </fieldset>
      <fieldset
        id="visual-direction"
        tabIndex={-1}
        className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-invalid={Boolean(errors.visualDirection)}
        aria-describedby={errors.visualDirection ? "visual-direction-help visual-direction-error" : "visual-direction-help"}
      >
        <legend className="text-sm font-medium">
          Which visual direction feels most like your salon?
        </legend>
        <p id="visual-direction-help" className="text-sm text-muted-foreground">
          This controls how the salon&apos;s craft and experience appear through spacing, borders,
          shapes, and decorative energy.
        </p>
        <RadioGroup
          value={visualDirection ?? ""}
          onValueChange={(value) => onVisualDirectionChange(value as VisualDirection)}
          className="gap-2"
        >
          {VISUAL_DIRECTION_OPTIONS.map((direction) => (
            <Label
              key={direction.id}
              htmlFor={`visual-direction-${direction.id}`}
              className="cursor-pointer items-start gap-3 rounded-lg border p-3"
            >
              <RadioGroupItem id={`visual-direction-${direction.id}`} value={direction.id} />
              <span className="grid gap-1">
                <span>{direction.label}</span>
                <span className="font-normal text-muted-foreground">{direction.description}</span>
                <span className="text-xs font-normal">{direction.effect}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
        {errors.visualDirection && (
          <p id="visual-direction-error" className="text-sm text-destructive">
            {errors.visualDirection}
          </p>
        )}
      </fieldset>
    </div>
  )
}
