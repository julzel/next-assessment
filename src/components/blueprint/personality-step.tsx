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
}: {
  personalityTraits: PersonalityTrait[]
  visualDirection: VisualDirection | null
  onTraitsChange: (traits: PersonalityTrait[]) => void
  onVisualDirectionChange: (direction: VisualDirection) => void
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
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Choose three traits that should define the brand.</legend>
        <div className="flex flex-wrap gap-2">
          {PERSONALITY_TRAIT_OPTIONS.map((trait) => {
            const selected = personalityTraits.includes(trait.id)
            const disabled = !selected && personalityTraits.length === 3
            return (
              <Button
                key={trait.id}
                type="button"
                variant={selected ? "secondary" : "outline"}
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => toggleTrait(trait.id)}
              >
                {trait.label}
              </Button>
            )
          })}
        </div>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {personalityTraits.length === 3
            ? "Three traits selected."
            : `Choose ${3 - personalityTraits.length} more trait${3 - personalityTraits.length === 1 ? "" : "s"}.`}
        </p>
      </fieldset>
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Which visual direction feels most like the brand?</legend>
        <RadioGroup
          value={visualDirection ?? undefined}
          onValueChange={(value) => onVisualDirectionChange(value as VisualDirection)}
          className="gap-2"
        >
          {VISUAL_DIRECTION_OPTIONS.map((direction) => (
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
