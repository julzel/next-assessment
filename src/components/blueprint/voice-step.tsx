import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { VOICE_TRAIT_OPTIONS } from "@/lib/blueprint/options"
import type { VoiceTrait } from "@/lib/blueprint/types"

export function VoiceStep({
  voiceTraits,
  alwaysCommunicate,
  avoid,
  onVoiceTraitsChange,
  onAlwaysCommunicateChange,
  onAvoidChange,
  errors = {},
}: {
  voiceTraits: VoiceTrait[]
  alwaysCommunicate: string
  avoid: string
  onVoiceTraitsChange: (traits: VoiceTrait[]) => void
  onAlwaysCommunicateChange: (value: string) => void
  onAvoidChange: (value: string) => void
  errors?: Partial<Record<"voiceTraits" | "alwaysCommunicate" | "avoid", string>>
}) {
  function toggleTrait(trait: VoiceTrait) {
    if (voiceTraits.includes(trait)) {
      onVoiceTraitsChange(voiceTraits.filter((value) => value !== trait))
    } else if (voiceTraits.length < 3) {
      onVoiceTraitsChange([...voiceTraits, trait])
    }
  }

  return (
    <div className="space-y-7">
      <fieldset
        id="voice-traits"
        tabIndex={-1}
        className="space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-invalid={Boolean(errors.voiceTraits)}
        aria-describedby={errors.voiceTraits ? "voice-traits-help voice-traits-error" : "voice-traits-help"}
      >
        <legend className="text-sm font-medium">
          Choose one to three traits for the salon&apos;s voice.
        </legend>
        <p id="voice-traits-help" className="text-sm text-muted-foreground">
          One trait is required. Together, they guide website, social, printed, and in-salon client
          communication.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {VOICE_TRAIT_OPTIONS.map((trait) => {
            const selected = voiceTraits.includes(trait.id)
            return (
              <Button
                key={trait.id}
                type="button"
                variant={selected ? "secondary" : "outline"}
                className="h-auto min-h-24 w-full items-start justify-start whitespace-normal p-3 text-left"
                aria-pressed={selected}
                disabled={!selected && voiceTraits.length === 3}
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
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {voiceTraits.length === 0
            ? "Choose at least one trait."
            : `${voiceTraits.length} of 3 voice traits selected.`}
        </p>
        {errors.voiceTraits && (
          <p id="voice-traits-error" className="text-sm text-destructive">
            {errors.voiceTraits}
          </p>
        )}
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="always-communicate">
          What should clients always understand about your salon?
        </Label>
        <p id="always-communicate-help" className="text-sm text-muted-foreground">
          This becomes the recurring promise across booking, social content, printed materials, and
          client guidance.
        </p>
        <Textarea
          id="always-communicate"
          value={alwaysCommunicate}
          onChange={(event) => onAlwaysCommunicateChange(event.currentTarget.value)}
          maxLength={240}
          placeholder="e.g. Thoughtful expertise and care at every step."
          aria-invalid={Boolean(errors.alwaysCommunicate)}
          aria-describedby={errors.alwaysCommunicate ? "always-communicate-help always-communicate-error" : "always-communicate-help"}
        />
        {errors.alwaysCommunicate && (
          <p id="always-communicate-error" className="text-sm text-destructive">
            {errors.alwaysCommunicate}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="avoid">What should salon communication avoid? (Optional)</Label>
        <p id="avoid-help" className="text-sm text-muted-foreground">
          Add a boundary that keeps client communication recognizable, inclusive, and trustworthy.
        </p>
        <Textarea
          id="avoid"
          value={avoid}
          onChange={(event) => onAvoidChange(event.currentTarget.value)}
          maxLength={240}
          placeholder="e.g. Pressure, beauty stereotypes, or unclear promises."
          aria-invalid={Boolean(errors.avoid)}
          aria-describedby={errors.avoid ? "avoid-help avoid-error" : "avoid-help"}
        />
        {errors.avoid && (
          <p id="avoid-error" className="text-sm text-destructive">
            {errors.avoid}
          </p>
        )}
      </div>
    </div>
  )
}
