"use client"

import { useState, type FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { AiStatus } from "@/lib/blueprint/reducer"

type AiRefinementPanelProps = {
  isComplete: boolean
  status: AiStatus
  message: string | null
  canUndo: boolean
  onRefine: (instruction: string) => Promise<void>
  onUndo: () => void
}

export function AiRefinementPanel({
  isComplete,
  status,
  message,
  canUndo,
  onRefine,
  onUndo,
}: AiRefinementPanelProps) {
  const [instruction, setInstruction] = useState("")
  const pending = status === "loading"
  const unavailableReason = !isComplete
    ? "Complete all four guided steps before requesting an AI edit."
    : null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalized = instruction.trim()
    if (!isComplete || pending || normalized.length === 0) return
    await onRefine(normalized)
  }

  return (
    <section
      aria-labelledby="ai-refinement-heading"
      className="space-y-4 rounded-2xl border bg-muted/30 p-5 sm:p-6"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-primary">Optional AI edit</p>
        <h2 id="ai-refinement-heading" className="text-xl font-semibold tracking-tight">
          Refine the salon direction
        </h2>
        <p className="text-sm text-muted-foreground">
          Ask for one focused change to the direction, voice, or Blueprint copy. The result updates
          this local draft and preview; it is not persisted until you choose Save.
        </p>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="ai-refinement-instruction">What should change?</Label>
          <Textarea
            id="ai-refinement-instruction"
            value={instruction}
            onChange={(event) => setInstruction(event.currentTarget.value)}
            placeholder="e.g. Make the voice warmer and more playful while keeping booking details clear."
            maxLength={500}
            rows={4}
            disabled={!isComplete || pending}
            aria-describedby="ai-refinement-help ai-refinement-status"
          />
          <p id="ai-refinement-help" className="text-sm text-muted-foreground">
            AI cannot change the salon name, presentation template, Foundation answer, layout, or
            saved record directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            disabled={!isComplete || pending || instruction.trim().length === 0}
          >
            {pending ? "Refining…" : "Refine with AI"}
          </Button>
          {canUndo && (
            <Button type="button" variant="outline" onClick={onUndo} disabled={pending}>
              Undo AI edit
            </Button>
          )}
        </div>
      </form>
      <p
        id="ai-refinement-status"
        aria-live="polite"
        role={status === "error" ? "alert" : "status"}
        className={status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}
      >
        {unavailableReason ?? message ?? "Your current draft remains unchanged until an edit succeeds."}
      </p>
    </section>
  )
}
