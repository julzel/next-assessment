import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FoundationStep({
  offerAudience,
  onChange,
  error,
}: {
  offerAudience: string
  onChange: (value: string) => void
  error?: string
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor="offer-audience">
        What experience does your salon offer, and who is it for?
      </Label>
      <p id="offer-audience-help" className="text-sm text-muted-foreground">
        Describe the salon&apos;s signature services or experience and ideal client in one concise
        thought. This becomes the client promise used throughout the Blueprint.
      </p>
      <Textarea
        id="offer-audience"
        value={offerAudience}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="e.g. Precision services and a calm visit for clients who value thoughtful care."
        maxLength={400}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "offer-audience-help offer-audience-error" : "offer-audience-help"}
      />
      {error && (
        <p id="offer-audience-error" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
