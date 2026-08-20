import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function FoundationStep({
  offerAudience,
  onChange,
}: {
  offerAudience: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-3">
      <Label htmlFor="offer-audience">What does the brand offer, and who is it for?</Label>
      <Textarea
        id="offer-audience"
        value={offerAudience}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="e.g. Thoughtful financial coaching for first-time founders."
        maxLength={400}
      />
      <p className="text-sm text-muted-foreground">A concise answer is enough for a useful first draft.</p>
    </div>
  )
}
