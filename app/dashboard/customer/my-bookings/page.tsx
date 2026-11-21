"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  Clock,
  Inbox,
  RefreshCw,
  Tag,
  UserRound,
  Wallet,
  Wrench,
} from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getMyBookings } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/* ---------------------------------- types --------------------------------- */

interface BookingServiceSummary {
  _id?: string
  title?: string
  category?: string
  price?: number | string
  imageUrl?: string
  technicianName?: string
}

interface CustomerBooking {
  _id: string
  service?: BookingServiceSummary | null
  serviceId?: string | BookingServiceSummary | null
  preferredDate?: string
  status?: string
  bookingStatus?: string
  paymentStatus?: string
  technicianName?: string
  createdAt?: string
}

interface MyBookingsApiResponse {
  success: boolean
  totalBookings: number
  bookings: CustomerBooking[]
}

interface StatusDisplay {
  label: string
  tone: StatusTone
}

interface BookingSummaryMetrics {
  total: number
  requested: number
  inProgress: number
  completed: number
}

type StatusTone = "navy" | "teal" | "amber" | "green" | "red"

/* --------------------------------- constants ------------------------------- */

const CATEGORY_LABELS: Record<string, string> = {
  smartphone: "Smartphone",
  "laptop-pc": "Laptop & PC",
  ac: "AC",
  refrigerator: "Refrigerator",
  tv: "TV",
  "washing-machine": "Washing Machine",
  electrical: "Electrical",
}

const STATUS_TONE_CLASSES: Record<StatusTone, string> = {
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

const DEFAULT_PAYMENT_STATUS: StatusDisplay = { label: "Unpaid", tone: "red" }

const REQUESTED_STATUS_KEYS = ["requested", "pending"]
const IN_PROGRESS_STATUS_KEYS = [
  "in-progress",
  "assigned",
  "accepted",
  "confirmed",
  "processing",
]
const COMPLETED_STATUS_KEYS = ["completed", "done"]

/* --------------------------------- helpers -------------------------------- */

const normalizeStatusKey = (statusValue?: string): string =>
  statusValue?.trim().toLowerCase().replace(/[\s_]+/g, "-") ?? ""

const resolveServiceSummary = (
  booking: CustomerBooking
): BookingServiceSummary | null => {
  if (booking.service && typeof booking.service === "object") {
    return booking.service
  }
  if (booking.serviceId && typeof booking.serviceId === "object") {
    return booking.serviceId
  }
  return null
}

const resolveTechnicianName = (booking: CustomerBooking): string | null => {
  const serviceSummary = resolveServiceSummary(booking)
  const technicianName =
    booking.technicianName ?? serviceSummary?.technicianName
  return technicianName || null
}

const resolveBookingStatus = (booking: CustomerBooking): string | undefined =>
  booking.status ?? booking.bookingStatus

const getBookingStatusDisplay = (booking: CustomerBooking): StatusDisplay => {
  const statusKey = normalizeStatusKey(resolveBookingStatus(booking))
  if (!statusKey) return DEFAULT_BOOKING_STATUS
  return (
    BOOKING_STATUS_CONFIG[statusKey] ?? {
      label: resolveBookingStatus(booking) ?? "Unknown",
      tone: "navy",
    }
  )
}

const getPaymentStatusDisplay = (booking: CustomerBooking): StatusDisplay => {
  const statusKey = normalizeStatusKey(booking.paymentStatus)
  if (!statusKey) return DEFAULT_PAYMENT_STATUS
  return (
    PAYMENT_STATUS_CONFIG[statusKey] ?? {
      label: booking.paymentStatus ?? "Unknown",
      tone: "navy",
    }
  )
}

const getCategoryLabel = (category?: string): string => {
  if (!category) return "Service"
  return CATEGORY_LABELS[category] ?? category
}

const formatBookingDate = (dateValue?: string): string => {
  if (!dateValue) return "—"
  const parsedDate = parseISO(dateValue)
  if (!isValid(parsedDate)) return "—"
  return format(parsedDate, "dd MMM, yyyy")
}

const formatPrice = (price?: number | string): string => {
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

const calculateSummaryMetrics = (
  bookings: CustomerBooking[]
): BookingSummaryMetrics => ({
  total: bookings.length,
  requested: countBookingsWithStatus(bookings, REQUESTED_STATUS_KEYS),
  inProgress: countBookingsWithStatus(bookings, IN_PROGRESS_STATUS_KEYS),
  completed: countBookingsWithStatus(bookings, COMPLETED_STATUS_KEYS),
})

/* ------------------------------- sub-components --------------------------- */

const StatusBadge = ({ statusDisplay }: { statusDisplay: StatusDisplay }) => (
  <Badge
    variant="outline"
    className={cn("border", STATUS_TONE_CLASSES[statusDisplay.tone])}
  >
    {statusDisplay.label}
  </Badge>
)

interface SummaryCardProps {
  icon: React.ElementType
  label: string
  value: number
  subtitle: string
  tone: StatusTone
}

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  tone,
}: SummaryCardProps) => (
  <Card className="overflow-hidden bg-white shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-500">
        {label}
      </CardTitle>
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          STATUS_TONE_CLASSES[tone]
        )}
      >
        <Icon className="size-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-[#102A43]">{value}</div>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </CardContent>
  </Card>
)

const BookingServiceImage = ({
  src,
  alt,
}: {
  src?: string
  alt: string
}) => {
  const [hasImageError, setHasImageError] = useState(false)
  const showFallback = !src || hasImageError

  return (
    <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-slate-100">
      {showFallback ? (
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Wrench className="size-10" />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setHasImageError(true)}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      )}
    </div>
  )
}

const BookingCard = ({ booking }: { booking: CustomerBooking }) => {
  const serviceSummary = resolveServiceSummary(booking)
  const serviceTitle = serviceSummary?.title ?? "Untitled Service"
  const technicianName = resolveTechnicianName(booking)
  const bookingStatusDisplay = getBookingStatusDisplay(booking)
  const paymentStatusDisplay = getPaymentStatusDisplay(booking)

  return (
    <Card className="group flex h-full flex-col overflow-hidden gap-0 bg-white py-0 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <BookingServiceImage src={serviceSummary?.imageUrl} alt={serviceTitle} />
        <Badge className="absolute top-4 left-4 border-0 bg-white/95 text-[#102A43] shadow-sm hover:bg-white">
          {getCategoryLabel(serviceSummary?.category)}
        </Badge>
      </div>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pt-5 pb-5">
        <div>
          <h3 className="line-clamp-2 text-lg font-bold text-[#102A43]">
            {serviceTitle}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
            <UserRound className="size-4 shrink-0 text-[#167D9A]" />
            {technicianName ?? "Technician not assigned"}
          </p>
        </div>

        <div className="rounded-lg bg-[#F5F7FA] p-3">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Tag className="size-3.5 text-[#167D9A]" /> Service Price
          </p>
          <p className="mt-1 text-lg font-bold text-[#102A43]">
            {formatPrice(serviceSummary?.price)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarDays className="size-3.5 text-[#167D9A]" /> Preferred
            </p>
            <p className="mt-1 text-sm font-semibold text-[#102A43]">
              {formatBookingDate(booking.preferredDate)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5 text-[#167D9A]" /> Booked On
            </p>
            <p className="mt-1 text-sm font-semibold text-[#102A43]">
              {formatBookingDate(booking.createdAt)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <StatusBadge statusDisplay={bookingStatusDisplay} />
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Wallet className="size-3.5 text-[#167D9A]" />
            <StatusBadge statusDisplay={paymentStatusDisplay} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const BookingsLoadingState = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={`summary-skeleton-${index}`} className="h-28 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={`booking-skeleton-${index}`} className="h-96 rounded-xl" />
      ))}
    </div>
  </div>
)

const EmptyBookingsState = () => (
  <Card className="border-dashed bg-white py-0">
    <CardContent className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#167D9A]/10">
        <Inbox className="size-8 text-[#167D9A]" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-[#102A43]">No Bookings Yet</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        You haven&apos;t booked any repair services yet. Browse our services
        and request a repair to get started.
      </p>
      <Link href="/services" className="mt-6">
        <Button className="bg-[#167D9A] text-white hover:bg-[#102A43]">
          Browse Services
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
)

interface BookingsErrorStateProps {
  message: string
  onRetry: () => void
}

const BookingsErrorState = ({
  message,
  onRetry,
}: BookingsErrorStateProps) => (
  <Card className="border-red-200 bg-white py-0">
    <CardContent className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="size-8 text-red-600" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-[#102A43]">
        Failed to Load Bookings
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>
      <Button onClick={onRetry} variant="outline" className="mt-6">
        <RefreshCw className="size-4" />
        Try Again
      </Button>
    </CardContent>
  </Card>
)

const SignInRequiredState = () => (
  <Card className="border-dashed bg-white py-0">
    <CardContent className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#102A43]/10">
        <UserRound className="size-8 text-[#102A43]" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-[#102A43]">
        Sign In Required
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Please sign in to view your bookings.
      </p>
      <Link href="/sign-in" className="mt-6">
        <Button className="bg-[#167D9A] text-white hover:bg-[#102A43]">
          Sign In
        </Button>
      </Link>
    </CardContent>
  </Card>
)

/* ----------------------------------- page --------------------------------- */

const MyBookingsPage = () => {
  const { data: session, isPending } = useSession()
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const customerEmail = session?.user?.email

  useEffect(() => {
    if (!customerEmail) return

    let isCancelled = false

    const loadCustomerBookings = async () => {
      setIsLoading(true)
      setErrorMessage(null)
      try {
        const response: MyBookingsApiResponse = await getMyBookings(
          customerEmail
        )
        const fetchedBookings = Array.isArray(response.bookings)
          ? response.bookings
          : []
        if (!isCancelled) setBookings(fetchedBookings)
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Something went wrong while fetching your bookings."
          )
        }
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    loadCustomerBookings()

    return () => {
      isCancelled = true
    }
  }, [customerEmail, reloadToken])

  const handleRetry = () => setReloadToken((previous) => previous + 1)

  const summaryMetrics = calculateSummaryMetrics(bookings)
  const showLoading = isPending || (Boolean(customerEmail) && isLoading)

  const renderBookings = () => {
    if (showLoading) return <BookingsLoadingState />
    if (!customerEmail) return <SignInRequiredState />
    if (errorMessage) return <BookingsErrorState message={errorMessage} onRetry={handleRetry} />
    if (bookings.length === 0) return <EmptyBookingsState />

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => (
          <BookingCard key={booking._id} booking={booking} />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-[#167D9A]">
            Home
          </Link>
          <span>/</span>
          <span className="font-medium text-[#102A43]">My Bookings</span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge className="mb-3 border-0 bg-[#167D9A]/10 text-[#167D9A] hover:bg-[#167D9A]/10">
              Your bookings
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              My Bookings
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Track the status of your repair requests and stay updated on
              every booking you have made.
            </p>
          </div>

          {!showLoading && !errorMessage && bookings.length > 0 && (
            <div className="text-sm font-medium text-slate-500">
              {summaryMetrics.total} booking
              {summaryMetrics.total === 1 ? "" : "s"} found
            </div>
          )}
        </div>
      </section>

      <section className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={CalendarDays}
          label="Total Bookings"
          value={summaryMetrics.total}
          subtitle="All repair requests"
          tone="navy"
        />
        <SummaryCard
          icon={Inbox}
          label="Requested"
          value={summaryMetrics.requested}
          subtitle="Awaiting confirmation"
          tone="amber"
        />
        <SummaryCard
          icon={Clock}
          label="In Progress"
          value={summaryMetrics.inProgress}
          subtitle="Currently being worked on"
          tone="teal"
        />
        <SummaryCard
          icon={Wrench}
          label="Completed"
          value={summaryMetrics.completed}
          subtitle="Successfully finished"
          tone="green"
        />
      </section>

      {renderBookings()}
    </div>
  )
}

export default MyBookingsPage
