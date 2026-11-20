
"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface RepairRequestButtonProps {
  service: {
    _id: string
    title: string
  }
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

export function RepairRequestButton({
  service,
}: RepairRequestButtonProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [preferredDate, setPreferredDate] = useState("")
  const [problemDescription, setProblemDescription] = useState("")

 const handleRepairBtn = () => {
  if (isPending) return

  if (!session?.user) {
    router.push(
      `/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`
    )
    return
    }

  if (session.user.role !== "customer") {
    toast.error("Only customers can request a repair.")
    return
  }

  setIsDialogOpen(true)
}

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!session?.user) {
      toast.error("Please sign in first.")
      return
    }

    if (problemDescription.trim().length < 20) {
      toast.error("Problem description must be at least 20 characters.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceId: service._id,
          customerName: session.user.name,
          customerEmail: session.user.email,
          customerPhone: phone,
          address,
          preferredDate,
          problemDescription,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit request.")
      }

      toast.success("Repair request submitted successfully!")
      setIsDialogOpen(false)
      router.push("/dashboard/customer/bookings")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit repair request."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleRepairBtn}
        disabled={isPending}
        className="w-full bg-[#167D9A] hover:bg-[#102A43]"
      >
        Request Repair
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request a Repair</DialogTitle>
            <DialogDescription>
              Submit your repair request for {service.title}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Service</Label>
              <Input value={service.title} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input value={session?.user.name ?? ""} readOnly />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={session?.user.email ?? ""} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Enter your full address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <Input
                id="preferredDate"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={preferredDate}
                onChange={(event) => setPreferredDate(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="problemDescription">
                Describe Your Problem
              </Label>
              <Textarea
                id="problemDescription"
                value={problemDescription}
                onChange={(event) =>
                  setProblemDescription(event.target.value)
                }
                placeholder="Describe the problem with your device..."
                minLength={20}
                required
              />
              <p className="text-xs text-muted-foreground">
                Minimum 20 characters.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#167D9A] hover:bg-[#102A43]"
            >
              {isSubmitting ? "Submitting..." : "Submit Repair Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
