
export { cn } from "cn"

import type {
  BookingServiceSummary,
  CustomerBooking,
  BookingSummaryMetrics,
  StatusDisplay,
  StatusTone,
} from "@/lib/types/bookings"

// Status colors
export function getStatusTone(status: string): StatusTone {
  switch (status) {
    case "requested":
      return "amber"
    case "accepted":
      return "teal"
    case "in-progress":
      return "navy"
    case "completed":
      return "green"
    case "rejected":
    case "cancelled":
      return "red"
    default:
      return "navy"
  }
}

// Status labels
export function getStatusLabel(status: string): string {
  switch (status) {
    case "requested":
      return "Requested"
    case "accepted":
      return "Accepted"
    case "in-progress":
      return "In Progress"
    case "completed":
      return "Completed"
    case "rejected":
      return "Rejected"
    case "cancelled":
      return "Cancelled"
    default:
      return "Unknown"
  }
}

// Status badge classes
export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  navy: "border-blue-200 bg-blue-50 text-blue-700",
  teal: "border-teal-200 bg-teal-50 text-teal-700",
  amber: "border-amber-200 bg-amber-50 text-amber-700",
  green: "border-green-200 bg-green-50 text-green-700",
  red: "border-red-200 bg-red-50 text-red-700",
}

// Booking status display
export function getBookingStatusDisplay(status?: string): StatusDisplay {
  const currentStatus = status || "requested"

  return {
    label: getStatusLabel(currentStatus),
    tone: getStatusTone(currentStatus),
  }
}

// Payment status display
export function getPaymentStatusDisplay(
  paymentStatus?: string
): StatusDisplay {
  const isPaid = paymentStatus === "paid"

  return {
    label: isPaid ? "Paid" : "Unpaid",
    tone: isPaid ? "green" : "amber",
  }
}

// Format booking date
export function formatBookingDate(date?: string): string {
  if (!date) return "—"

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) return "—"

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  })
}

// Format price in BDT
export function formatPrice(price?: number | string): string {
  const amount = Number(price)

  if (!Number.isFinite(amount)) return "৳0"

  return `৳${amount.toLocaleString("en-BD")}`
}

// Category label
export function getCategoryLabel(category?: string): string {
  if (!category) return "General"

  return category
    .split(/[\s&_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Resolve service summary
export function resolveServiceSummary(
  booking: CustomerBooking
): BookingServiceSummary {
  const nestedService =
    booking.service ||
    (typeof booking.serviceId === "object" ? booking.serviceId : null)

  return {
    _id: nestedService?._id,
    title: booking.serviceTitle || nestedService?.title || "Unknown Service",
    category: booking.category || nestedService?.category || "General",
    price: booking.finalAmount ?? booking.basePrice ?? nestedService?.price ?? 0,
    imageUrl: booking.serviceImage || nestedService?.imageUrl,
    technicianName:
      booking.technicianName || nestedService?.technicianName,
  }
}

// Resolve technician name
export function resolveTechnicianName(
  booking: CustomerBooking
): string {
  return booking.technicianName || booking.service?.technicianName || "Unknown Technician"
}

// Dashboard summary metrics
export function calculateSummaryMetrics(
  bookings: CustomerBooking[]
): BookingSummaryMetrics {
  return {
    total: bookings.length,
    requested: bookings.filter(
      (booking) => booking.status === "requested"
    ).length,
    inProgress: bookings.filter(
      (booking) => booking.status === "in-progress"
    ).length,
    completed: bookings.filter(
      (booking) => booking.status === "completed"
    ).length,
  }
}
