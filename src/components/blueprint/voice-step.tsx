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
        <legend className="text-sm font-medium">Choose one to three voice traits.</legend>
        <p id="voice-traits-help" className="text-sm text-muted-foreground">
          One trait is required. Together, the selected traits shape the voice summary and message treatment.
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
        <Label htmlFor="always-communicate">What should the brand always communicate?</Label>
        <p id="always-communicate-help" className="text-sm text-muted-foreground">
          This becomes the recurring message in the audience promise and voice guidance.
        </p>
        <Textarea
          id="always-communicate"
          value={alwaysCommunicate}
          onChange={(event) => onAlwaysCommunicateChange(event.currentTarget.value)}
          maxLength={240}
          placeholder="e.g. Calm expertise, even when the topic is complex."
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
        <Label htmlFor="avoid">What should the brand avoid? (Optional)</Label>
        <p id="avoid-help" className="text-sm text-muted-foreground">
          Add a boundary only when it will help the brand stay recognizable and trustworthy.
        </p>
        <Textarea
          id="avoid"
          value={avoid}
          onChange={(event) => onAvoidChange(event.currentTarget.value)}
          maxLength={240}
          placeholder="e.g. Empty jargon or scare tactics."
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
