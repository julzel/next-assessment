import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { SaveStatus } from "@/lib/blueprint/reducer"

type WorkspaceHeaderProps = {
  brandName: string
  isDirty: boolean
  saveStatus: SaveStatus
  saveMessage: string | null
  onSave: () => void
}

export function WorkspaceHeader({
  brandName,
  isDirty,
  saveStatus,
  saveMessage,
  onSave,
}: WorkspaceHeaderProps) {
  const status =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "error"
        ? "Save failed"
        : isDirty
          ? "Unsaved changes"
          : "Saved"

  return (
    <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← Brand Blueprints
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {brandName.trim() || "Untitled blueprint"}
        </h1>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {saveMessage ?? status}
        </p>
      </div>
      <Button onClick={onSave} disabled={saveStatus === "saving"} size="lg">
        {saveStatus === "saving" ? "Saving…" : "Save blueprint"}
      </Button>
    </header>
  )
}
