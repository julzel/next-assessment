import { BlueprintPreview } from "@/components/blueprint/blueprint-preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { BlueprintDraft } from "@/lib/blueprint/types"

export function FullPreviewOverlay({
  draft,
  open,
  onOpenChange,
}: {
  draft: BlueprintDraft
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] overflow-x-hidden overflow-y-auto p-3 sm:h-[calc(100dvh-2rem)] sm:max-w-5xl sm:p-6" showCloseButton={false}>
        <DialogHeader className="sticky top-0 z-10 flex-col items-start gap-3 bg-popover pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <DialogTitle>Full preview</DialogTitle>
            <DialogDescription>Review the current unsaved blueprint without leaving the editor.</DialogDescription>
          </div>
          <Button type="button" variant="outline" className="shrink-0" onClick={() => onOpenChange(false)}>
            Back to editor
          </Button>
        </DialogHeader>
        <BlueprintPreview draft={draft} fullPreview />
      </DialogContent>
    </Dialog>
  )
}
