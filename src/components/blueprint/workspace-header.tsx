import Link from "next/link"
import type { Ref } from "react"

import { Button } from "@/components/ui/button"
import type { SaveStatus } from "@/lib/blueprint/reducer"

type WorkspaceHeaderProps = {
  brandName: string
  hasSavedRecord: boolean
  isDirty: boolean
  saveStatus: SaveStatus
  saveMessage: string | null
  isComplete: boolean
  isAiPending: boolean
  onSave: () => void
  onFullPreview: () => void
  fullPreviewButtonRef: Ref<HTMLButtonElement>
}

export function WorkspaceHeader({
  brandName,
  hasSavedRecord,
  isDirty,
  saveStatus,
  saveMessage,
  isComplete,
  isAiPending,
  onSave,
  onFullPreview,
  fullPreviewButtonRef,
}: WorkspaceHeaderProps) {
  const status =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "error"
        ? "Save failed"
        : isDirty
          ? "Unsaved changes"
          : hasSavedRecord
            ? "Saved"
            : "Not saved yet"
  const saveLabel = isComplete ? "Save blueprint" : "Save draft"
  const savingLabel = isComplete ? "Saving blueprint…" : "Saving draft…"

  return (
    <header className="flex items-center justify-between gap-3 border-b py-3 sm:gap-4 sm:py-4">
      <div className="min-w-0 space-y-0.5 sm:space-y-1">
        <Link href="/" className="text-xs text-muted-foreground hover:text-foreground sm:text-sm">
          ← Brand Blueprints
        </Link>
        <h1 className="truncate text-lg font-semibold tracking-tight sm:text-2xl">
          {brandName.trim() || "Untitled blueprint"}
        </h1>
        <p aria-live="polite" className="text-xs text-muted-foreground sm:text-sm">
          {saveMessage ?? status}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button ref={fullPreviewButtonRef} variant="outline" size="sm" onClick={onFullPreview}>
          Full preview
        </Button>
        <Button
          onClick={onSave}
          disabled={!isDirty || saveStatus === "saving" || isAiPending}
          size="sm"
        >
          {saveStatus === "saving" ? savingLabel : saveLabel}
        </Button>
      </div>
    </header>
  )
}
