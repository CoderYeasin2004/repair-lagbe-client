export { cn } from "cn"

/* -------------------------- My Bookings types -------------------------- */

export interface BookingServiceSummary {
  _id?: string
  title?: string
  category?: string
  price?: number | string
  imageUrl?: string
  technicianName?: string
}

export interface CustomerBooking {
  _id: string
  serviceTitle?: string
  serviceImage?: string
  category?: string
  basePrice?: number | string
  finalAmount?: number | string
  service?: BookingServiceSummary | null
  serviceId?: string | BookingServiceSummary | null
  preferredDate?: string
  status?: string
  bookingStatus?: string
  paymentStatus?: string
  technicianName?: string
  createdAt?: string
}

export interface MyBookingsApiResponse {
  success: boolean
  totalBookings: number
  bookings: CustomerBooking[]
}

export interface StatusDisplay {
  label: string
  tone: StatusTone
}

export interface BookingSummaryMetrics {
  total: number
  requested: number
  inProgress: number
  completed: number
}

export type StatusTone = "navy" | "teal" | "amber" | "green" | "red"

/* -------------------------- My Bookings constants -------------------------- */

export const CATEGORY_LABELS: Record<string, string> = {
  smartphone: "Smartphone",
  "laptop-pc": "Laptop & PC",
  ac: "AC",
  refrigerator: "Refrigerator",
  tv: "TV",
  "washing-machine": "Washing Machine",
  electrical: "Electrical",
}

export const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
  navy: "border-[#102A43]/20 bg-[#102A43]/10 text-[#102A43]",
  teal: "border-[#167D9A]/25 bg-[#167D9A]/10 text-[#167D9A]",
  amber: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309]",
  green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  red: "border-red-200 bg-red-50 text-red-700",
}

const BOOKING_STATUS_CONFIG: Record<string, StatusDisplay> = {
  requested: { label: "Requested", tone: "amber" },
  pending: { label: "Pending", tone: "amber" },
  accepted: { label: "Accepted", tone: "teal" },
  assigned: { label: "Assigned", tone: "teal" },
  confirmed: { label: "Confirmed", tone: "teal" },
  "in-progress": { label: "In Progress", tone: "teal" },
  processing: { label: "In Progress", tone: "teal" },
  completed: { label: "Completed", tone: "green" },
  done: { label: "Completed", tone: "green" },
  cancelled: { label: "Cancelled", tone: "red" },
  rejected: { label: "Rejected", tone: "red" },
}

const PAYMENT_STATUS_CONFIG: Record<string, StatusDisplay> = {
  paid: { label: "Paid", tone: "green" },
  pending: { label: "Pending", tone: "amber" },
  unpaid: { label: "Unpaid", tone: "red" },
  partial: { label: "Partially Paid", tone: "teal" },
  refunded: { label: "Refunded", tone: "navy" },
}

const DEFAULT_BOOKING_STATUS: StatusDisplay = {
  label: "Requested",
  tone: "amber",
}

const DEFAULT_PAYMENT_STATUS: StatusDisplay = {
  label: "Unpaid",
  tone: "red",
}

const REQUESTED_STATUS_KEYS = ["requested", "pending"]

const IN_PROGRESS_STATUS_KEYS = [
  "in-progress",
  "assigned",
  "accepted",
  "confirmed",
  "processing",
]

const COMPLETED_STATUS_KEYS = ["completed", "done"]

/* -------------------------- My Bookings helpers -------------------------- */

export const normalizeStatusKey = (statusValue?: string): string =>
  statusValue?.trim().toLowerCase().replace(/[\s_]+/g, "-") ?? ""

export const resolveServiceSummary = (
  booking: CustomerBooking
): BookingServiceSummary | null => {
  if (booking.service && typeof booking.service === "object") {
    return booking.service
  }

  if (booking.serviceId && typeof booking.serviceId === "object") {
    return booking.serviceId
  }

  // Supports the current MongoDB booking document structure.
  if (booking.serviceTitle || booking.serviceImage || booking.category) {
    return {
      title: booking.serviceTitle,
      category: booking.category,
      imageUrl: booking.serviceImage,
      price: booking.finalAmount ?? booking.basePrice,
      technicianName: booking.technicianName,
    }
  }

  return null
}

export const resolveTechnicianName = (
  booking: CustomerBooking
): string | null => {
  const serviceSummary = resolveServiceSummary(booking)
  const technicianName =
    booking.technicianName ?? serviceSummary?.technicianName

  return technicianName || null
}

export const resolveBookingStatus = (
  booking: CustomerBooking
): string | undefined => booking.status ?? booking.bookingStatus

export const getBookingStatusDisplay = (
  booking: CustomerBooking
): StatusDisplay => {
  const statusKey = normalizeStatusKey(resolveBookingStatus(booking))

  if (!statusKey) return DEFAULT_BOOKING_STATUS

  return (
    BOOKING_STATUS_CONFIG[statusKey] ?? {
      label: resolveBookingStatus(booking) ?? "Unknown",
      tone: "navy",
    }
  )
}

export const getPaymentStatusDisplay = (
  booking: CustomerBooking
): StatusDisplay => {
  const statusKey = normalizeStatusKey(booking.paymentStatus)

  if (!statusKey) return DEFAULT_PAYMENT_STATUS

  return (
    PAYMENT_STATUS_CONFIG[statusKey] ?? {
      label: booking.paymentStatus ?? "Unknown",
      tone: "navy",
    }
  )
}

export const getCategoryLabel = (category?: string): string => {
  if (!category) return "Service"

  return CATEGORY_LABELS[category.toLowerCase()] ?? category
}

export const formatBookingDate = (dateValue?: string): string => {
  if (!dateValue) return "—"

  const parsedDate = new Date(dateValue)

  if (Number.isNaN(parsedDate.getTime())) return "—"

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  })
}

export const formatPrice = (price?: number | string): string => {
  const numericPrice = Number(price)

  if (!Number.isFinite(numericPrice)) return "৳—"

  return `৳${numericPrice.toLocaleString("en-BD")}`
}

const countBookingsWithStatus = (
  bookings: CustomerBooking[],
  statusKeys: string[]
): number =>
  bookings.filter((booking) =>
    statusKeys.includes(normalizeStatusKey(resolveBookingStatus(booking)))
  ).length

export const calculateSummaryMetrics = (
  bookings: CustomerBooking[]
): BookingSummaryMetrics => ({
  total: bookings.length,
  requested: countBookingsWithStatus(bookings, REQUESTED_STATUS_KEYS),
  inProgress: countBookingsWithStatus(bookings, IN_PROGRESS_STATUS_KEYS),
  completed: countBookingsWithStatus(bookings, COMPLETED_STATUS_KEYS),
})