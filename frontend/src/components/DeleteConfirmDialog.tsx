import { useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Entry } from "@/lib/api"

interface DeleteConfirmDialogProps {
  entry: Entry | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (entry: Entry) => Promise<void>
  isLoading?: boolean
}

export function DeleteConfirmDialog({
  entry,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management for accessibility
  useEffect(() => {
    if (open && cancelButtonRef.current) {
      // Focus the cancel button by default for safety
      cancelButtonRef.current.focus()
    }
  }, [open])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!open) return

      switch (event.key) {
        case 'Tab':
          // Trap focus within the dialog
          event.preventDefault()
          if (document.activeElement === cancelButtonRef.current) {
            confirmButtonRef.current?.focus()
          } else {
            cancelButtonRef.current?.focus()
          }
          break
        case 'Enter':
          // Prevent accidental confirmation on Enter
          if (document.activeElement === confirmButtonRef.current) {
            event.preventDefault()
            handleConfirm()
          }
          break
        case 'Escape':
          // Close dialog on Escape
          event.preventDefault()
          handleCancel()
          break
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false)
    }
  }

  const handleConfirm = async () => {
    if (!entry || isLoading) return

    try {
      await onConfirm(entry)
      onOpenChange(false)
    } catch (error) {
      // Error handling is done by the parent component
      console.error("Delete confirmation error:", error)
    }
  }

  if (!entry) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="delete-dialog-title">
            Delete Entry
          </DialogTitle>
          <DialogDescription id="delete-dialog-description">
            Are you sure you want to delete "{entry.title}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm text-gray-600">
              <div><strong>Title:</strong> {entry.title}</div>
              <div><strong>Type:</strong> {entry.type === 'MOVIE' ? 'Movie' : 'TV Show'}</div>
              <div><strong>Director:</strong> {entry.director}</div>
              <div><strong>Year:</strong> {entry.year}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            ref={cancelButtonRef}
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            aria-label="Cancel deletion"
          >
            Cancel
          </Button>
          <Button
            ref={confirmButtonRef}
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            aria-label={`Confirm deletion of ${entry.title}`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}