"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteService } from "@/lib/actions/services"
import { toast } from "sonner"


interface DeleteDialougeProps {
  serviceId: string
  serviceTitle: string
}

export const DeleteDialouge = ({ serviceId, serviceTitle }: DeleteDialougeProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleDelete = async () => {
  try {
    await deleteService(serviceId)
    toast.success(`${serviceTitle} deleted successfully`)
    window.location.reload()
  } catch (error) {
    toast.error("Failed to delete service")
    console.error(error)
  }
}

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="size-3.5" />
        Delete
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Service?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this service? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              setIsOpen(false)
              handleDelete()
            }}
          >
            Delete Service
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
