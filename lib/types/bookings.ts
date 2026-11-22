
export interface IPaidBooking {
  paymentStatus: string
  finalAmount: number
}

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
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  address?: string
  preferredDate?: string
  problemDescription?: string
  serviceTitle?: string
  serviceImage?: string
  category?: string
  basePrice?: number | string
  finalAmount?: number | string
  service?: BookingServiceSummary | null
  serviceId?: string | BookingServiceSummary | null
  status?: string
  bookingStatus?: string
  paymentStatus?: string
  technicianName?: string
  technicianEmail?: string
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

export type BookingStatus =
  | "requested"
  | "accepted"
  | "in-progress"
  | "completed"
  | "rejected"
  | "cancelled"
