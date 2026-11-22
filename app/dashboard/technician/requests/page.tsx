"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { Clock, Calendar, UserRound, MapPin, Wrench } from "lucide-react"
import type { CustomerBooking, BookingStatus } from "@/lib/types/bookings"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

import {
  cn,
  getStatusTone,
  getStatusLabel,
  STATUS_TONE_CLASSES,
} from "@/lib/utils"

import { getMyBookings } from "@/lib/api/services"
import { updateBookingStatus } from "@/lib/actions/services"

const STATUS_FILTERS = [
  "all",
  "requested",
  "accepted",
  "in-progress",
  "completed",
] as const

export default function TechnicianRequestsPage() {
  const { data: session, isPending } = useSession()

  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<BookingStatus | "all">("all")

  const [isMarkingCompleted, setIsMarkingCompleted] = useState<string | null>(
    null
  )
  const [finalAmount, setFinalAmount] = useState("")

  const technicianEmail = session?.user?.email

  useEffect(() => {
    if (isPending) return

    let cancelled = false

    const loadBookings = async () => {
      if (!technicianEmail) {
        setBookings([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const bookingsData = await getMyBookings(technicianEmail, "technician")

        if (cancelled) return

        const transformed: CustomerBooking[] = (
          Array.isArray(bookingsData.bookings) ? bookingsData.bookings : []
        ).map((booking: CustomerBooking) => ({
          ...booking,
          customerName: booking.customerName || "Unknown",
          customerPhone: booking.customerPhone || "",
          address: booking.address || "",
          serviceTitle: booking.serviceTitle || "Unknown Service",
          problemDescription: booking.problemDescription || "",
          status: booking.status || "requested",
        }))

        setBookings(transformed)
      } catch (err) {
        if (cancelled) return

        const message =
          err instanceof Error ? err.message : "Failed to fetch bookings"

        setError(message)
        toast.error("Failed to load bookings. Please try again.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadBookings()

    return () => {
      cancelled = true
    }
  }, [technicianEmail, isPending])

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  )

  // Accept booking
  const handleAccept = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "accepted")

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "accepted" }
            : booking
        )
      )

      toast.success("Booking accepted successfully.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to accept booking."
      )
    }
  }

  // Reject booking
  const handleReject = async (bookingId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this booking request?"
    )

    if (!confirmed) return

    try {
      await updateBookingStatus(bookingId, "rejected")

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "rejected" }
            : booking
        )
      )

      toast.success("Booking rejected successfully.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reject booking."
      )
    }
  }

  // Start work
  const handleStartWork = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, "in-progress")

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "in-progress" }
            : booking
        )
      )

      toast.success("You have started work on this booking.")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to start work."
      )
    }
  }

  // Open completion modal
  const handleMarkCompleted = (bookingId: string) => {
    setIsMarkingCompleted(bookingId)

    const booking = bookings.find((item) => item._id === bookingId)

    setFinalAmount(
      booking?.basePrice !== undefined ? String(booking.basePrice) : ""
    )
  }

  // Complete booking
  const confirmCompleteBooking = async (bookingId: string) => {
    const amount = Number(finalAmount)

    if (!finalAmount || !Number.isFinite(amount) || amount <= 0) {
      toast.error("Final amount must be greater than 0.")
      return
    }

    try {
      await updateBookingStatus(bookingId, "completed", amount)

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: "completed",
                finalAmount: amount,
              }
            : booking
        )
      )

      toast.success("Booking marked as completed successfully.")

      setIsMarkingCompleted(null)
      setFinalAmount("")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to complete booking."
      )
    }
  }

  // Status badge
  const renderStatus = (status: BookingStatus) => (
    <Badge
      variant="outline"
      className={cn(
        "text-xs whitespace-nowrap",
        STATUS_TONE_CLASSES[getStatusTone(status)]
      )}
    >
      {getStatusLabel(status)}
    </Badge>
  )

  // Action buttons
  const renderActions = (booking: CustomerBooking) => (
    <div className="flex flex-wrap gap-2">
      {booking.status === "requested" && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAccept(booking._id)}
          >
            Accept
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleReject(booking._id)}
          >
            Reject
          </Button>
        </>
      )}

      {booking.status === "accepted" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleStartWork(booking._id)}
        >
          Start Work
        </Button>
      )}

      {booking.status === "in-progress" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleMarkCompleted(booking._id)}
        >
          Mark Completed
        </Button>
      )}

      {["completed", "rejected", "cancelled"].includes(
        booking.status || ""
      ) && <span className="text-xs text-slate-400">No actions</span>}
    </div>
  )

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-8">
          <Clock className="mb-4 size-12 animate-spin text-slate-400" />
          <p className="text-slate-500">Loading bookings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
            <h3 className="mb-2 font-semibold text-[#102A43]">Error</h3>
            <p>{error}</p>
            <Link
              href="/dashboard/technician"
              className="text-[#167D9A] hover:text-[#102A43]"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-w-0 bg-[#F5F7FA]">
      <div className="mx-auto w-full max-w-7xl min-w-0 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[#102A43] sm:text-3xl">
              Manage Requests
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              View and manage customer service requests assigned to you.
            </p>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as BookingStatus | "all")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#167D9A]/20 sm:w-48"
          >
            {STATUS_FILTERS.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "All Status" : getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#167D9A]/10 text-[#167D9A]">
              <UserRound className="size-8" />
            </div>

            <h2 className="mt-4 text-xl font-bold text-[#102A43] sm:text-2xl">
              No Bookings Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              No bookings match the current filter.{" "}
              <Link
                href="/dashboard/technician"
                className="font-medium text-[#167D9A] hover:text-[#102A43]"
              >
                View Dashboard
              </Link>{" "}
              or adjust the filter.
            </p>
          </div>
        ) : (
          <Card className="w-full min-w-0 overflow-hidden border-slate-200">
            <CardHeader className="border-b px-4 py-4 sm:px-6">
              <CardTitle className="font-medium text-[#102A43]">
                My Bookings ({filteredBookings.length})
              </CardTitle>
            </CardHeader>

            <CardContent className="min-w-0 p-0">
              {/* Desktop and Tablet Table */}
              <div className="hidden w-full min-w-0 overflow-hidden md:block">
                <Table className="w-full table-fixed">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[11%] px-2">Customer</TableHead>
                      <TableHead className="w-[12%] px-2">Phone</TableHead>
                      <TableHead className="w-[12%] px-2">Address</TableHead>
                      <TableHead className="w-[13%] px-2">
                        Preferred Date
                      </TableHead>
                      <TableHead className="w-[13%] px-2">Service</TableHead>
                      <TableHead className="w-[14%] px-2">Problem</TableHead>
                      <TableHead className="w-[11%] px-2">Status</TableHead>
                      <TableHead className="w-[14%] px-2">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="px-2 py-3 text-xs font-medium wrap-break-word">
                          {booking.customerName || "—"}
                        </TableCell>

                        <TableCell className="px-2 py-3 text-xs break-all">
                          {booking.customerPhone || "—"}
                        </TableCell>

                        <TableCell className="px-2 py-3 text-xs wrap-break-word">
                          {booking.address || "—"}
                        </TableCell>

                        <TableCell className="px-2 py-3 text-xs">
                          {booking.preferredDate ? (
                            <span className="flex flex-wrap items-center gap-1">
                              <Calendar className="size-3.5 shrink-0" />
                              {new Date(
                                booking.preferredDate
                              ).toLocaleDateString("en-GB", {
                                timeZone: "Asia/Dhaka",
                              })}
                            </span>
                          ) : (
                            "—"
                          )}
                        </TableCell>

                        <TableCell className="px-2 py-3 text-xs wrap-break-word">
                          {booking.serviceTitle || "—"}
                        </TableCell>

                        <TableCell className="px-2 py-3 text-xs wrap-break-word text-slate-500">
                          <p className="line-clamp-3">
                            {booking.problemDescription || "—"}
                          </p>
                        </TableCell>

                        <TableCell className="px-2 py-3">
                          {renderStatus(
                            (booking.status ?? "requested") as BookingStatus
                          )}
                        </TableCell>

                        <TableCell className="px-2 py-3">
                          {renderActions(booking)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Booking Cards */}
              <div className="grid grid-cols-1 gap-3 p-3 md:hidden">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="min-w-0 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#167D9A]/10 text-[#167D9A]">
                          <UserRound className="size-5" />
                        </div>

                        <div className="min-w-0">
                          <h3 className="font-semibold wrap-break-word text-[#102A43]">
                            {booking.customerName || "Unknown"}
                          </h3>
                          <p className="text-xs break-all text-slate-500">
                            {booking.customerPhone || "—"}
                          </p>
                        </div>
                      </div>

                      {renderStatus(
                        (booking.status ?? "requested") as BookingStatus
                      )}
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex min-w-0 items-start gap-2">
                        <Wrench className="mt-0.5 size-4 shrink-0 text-[#167D9A]" />
                        <span className="wrap-break-word text-slate-700">
                          {booking.serviceTitle || "—"}
                        </span>
                      </div>

                      <div className="flex min-w-0 items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-[#167D9A]" />
                        <span className="wrap-break-word text-slate-600">
                          {booking.address || "—"}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 size-4 shrink-0 text-[#167D9A]" />
                        <span className="text-slate-600">
                          {booking.preferredDate
                            ? new Date(
                                booking.preferredDate
                              ).toLocaleDateString("en-GB", {
                                timeZone: "Asia/Dhaka",
                              })
                            : "—"}
                        </span>
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <p className="mb-1 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                          Problem Description
                        </p>
                        <p className="text-sm leading-relaxed wrap-break-word text-slate-600">
                          {booking.problemDescription || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3">
                      {renderActions(booking)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Modal */}
        <Dialog
          open={Boolean(isMarkingCompleted)}
          onOpenChange={(open) => {
            if (!open) {
              setIsMarkingCompleted(null)
              setFinalAmount("")
            }
          }}
        >
          <DialogContent className="w-[calc(100%-2rem)] rounded-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Mark as Completed</DialogTitle>
              <DialogDescription>
                Set the final amount for this booking and mark it as completed.
              </DialogDescription>
            </DialogHeader>

            <form
              className="space-y-4 pt-4"
              onSubmit={(e) => {
                e.preventDefault()

                if (isMarkingCompleted) {
                  confirmCompleteBooking(isMarkingCompleted)
                }
              }}
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-600">
                  Final Amount (৳)
                </label>

                <input
                  type="number"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  min="0"
                  step="100"
                  required
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-[#167D9A]/20"
                />
              </div>

              <DialogFooter className="flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsMarkingCompleted(null)
                    setFinalAmount("")
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-[#102A43] text-white hover:bg-[#0f5f7a]"
                >
                  Mark Completed
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
