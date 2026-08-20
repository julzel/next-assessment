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
}: {
  voiceTraits: VoiceTrait[]
  alwaysCommunicate: string
  avoid: string
  onVoiceTraitsChange: (traits: VoiceTrait[]) => void
  onAlwaysCommunicateChange: (value: string) => void
  onAvoidChange: (value: string) => void
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
      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Choose up to three voice traits.</legend>
        <div className="flex flex-wrap gap-2">
          {VOICE_TRAIT_OPTIONS.map((trait) => {
            const selected = voiceTraits.includes(trait.id)
            return (
              <Button
                key={trait.id}
                type="button"
                variant={selected ? "secondary" : "outline"}
                aria-pressed={selected}
                disabled={!selected && voiceTraits.length === 3}
                onClick={() => toggleTrait(trait.id)}
              >
                {trait.label}
              </Button>
            )
          })}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="always-communicate">What should the brand always communicate?</Label>
        <Textarea
          id="always-communicate"
          value={alwaysCommunicate}
          onChange={(event) => onAlwaysCommunicateChange(event.currentTarget.value)}
          maxLength={240}
          placeholder="e.g. Calm expertise, even when the topic is complex."
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="avoid">What should the brand avoid? (Optional)</Label>
        <Textarea
          id="avoid"
          value={avoid}
          onChange={(event) => onAvoidChange(event.currentTarget.value)}
          maxLength={240}
          placeholder="e.g. Empty jargon or scare tactics."
        />
      </div>
    </div>
  )
}
