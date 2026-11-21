"use client"

import type { ElementType } from "react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { format, isValid, parseISO } from "date-fns"
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  CalendarDays,
  CircleCheckBig,
  Clock3,
  Inbox,
  RefreshCw,
  UserRound,
  Wrench,
} from "lucide-react"

import { useSession } from "@/lib/auth-client"
import { getMyBookings } from "@/lib/api/services"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@/lib/utils"

/* ---------------------------------- types --------------------------------- */

type StatVariant = "navy" | "teal" | "amber" | "green"

interface CustomerBooking {
  _id: string
  serviceTitle?: string
  technicianName?: string
  preferredDate?: string
  createdAt?: string
  status?: string
  bookingStatus?: string
  finalAmount?: number | string
}

interface MyBookingsApiResponse {
  success: boolean
  totalBookings: number
  bookings: CustomerBooking[]
}

interface MonthlyBookingActivity {
  monthLabel: string
  bookings: number
}

interface DashboardStatistics {
  totalRequests: number
  activeJobs: number
  completedJobs: number
}

/* --------------------------------- constants ------------------------------- */

const MY_BOOKINGS_ROUTE = "/dashboard/customer/my-bookings"
const SERVICES_ROUTE = "/services"

const ACTIVE_STATUS_KEYS = ["requested", "accepted", "in-progress"]
const COMPLETED_STATUS_KEYS = ["completed"]

const BOOKING_STATUS_DISPLAY: Record<string, { label: string; className: string }> = {
  requested: {
    label: "Requested",
    className: "border-[#F59E0B]/30 bg-[#F59E0B]/10 text-[#B45309]",
  },
  accepted: {
    label: "Accepted",
    className: "border-[#167D9A]/30 bg-[#167D9A]/10 text-[#167D9A]",
  },
  "in-progress": {
    label: "In Progress",
    className: "border-[#167D9A]/30 bg-[#167D9A]/10 text-[#167D9A]",
  },
  completed: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
}

const STAT_VARIANT_CLASS_NAMES: Record<StatVariant, string> = {
  navy: "border-[#102A43]/20 bg-[#102A43]/10 text-[#102A43]",
  teal: "border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]",
  amber: "border-[#F59E0B]/25 bg-[#F59E0B]/10 text-[#B45309]",
  green: "border-emerald-200 bg-emerald-50 text-emerald-600",
}

const bookingChartConfig = {
  bookings: {
    label: "Bookings",
    color: "#167D9A",
  },
} satisfies ChartConfig

/* --------------------------------- helpers -------------------------------- */

const normalizeStatusKey = (statusValue?: string): string =>
  statusValue?.trim().toLowerCase().replace(/[\s_]+/g, "-") ?? ""

const resolveBookingStatus = (booking: CustomerBooking): string | undefined =>
  booking.status ?? booking.bookingStatus

const formatAmount = (amount?: number | string): string => {
  const numericAmount = Number(amount)
  if (!Number.isFinite(numericAmount)) return "—"
  return `৳${numericAmount.toLocaleString("en-BD")}`
}

const formatDisplayDate = (dateValue?: string): string => {
  if (!dateValue) return "—"
  const parsedDate = parseISO(dateValue)
  if (!isValid(parsedDate)) return "—"
  return format(parsedDate, "dd MMM, yyyy")
}

const resolveBookingDate = (booking: CustomerBooking): string =>
  booking.createdAt ?? booking.preferredDate ?? ""

const countBookingsWithStatus = (
  bookings: CustomerBooking[],
  statusKeys: string[]
): number =>
  bookings.filter((booking) =>
    statusKeys.includes(normalizeStatusKey(resolveBookingStatus(booking)))
  ).length

const buildDashboardStatistics = (
  bookings: CustomerBooking[]
): DashboardStatistics => ({
  totalRequests: bookings.length,
  activeJobs: countBookingsWithStatus(bookings, ACTIVE_STATUS_KEYS),
  completedJobs: countBookingsWithStatus(bookings, COMPLETED_STATUS_KEYS),
})

const buildMonthlyBookingActivity = (
  bookings: CustomerBooking[]
): MonthlyBookingActivity[] => {
  const bookingsPerMonth = bookings.reduce((monthTotals, booking) => {
    const bookingDate = parseISO(resolveBookingDate(booking))
    if (!isValid(bookingDate)) return monthTotals

    const monthKey = format(bookingDate, "yyyy-MM")
    monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + 1)
    return monthTotals
  }, new Map<string, number>())

  return Array.from(bookingsPerMonth.entries())
    .sort(([firstMonth], [secondMonth]) => firstMonth.localeCompare(secondMonth))
    .map(([monthKey, bookingCount]) => ({
      monthLabel: format(parseISO(`${monthKey}-01`), "MMM"),
      bookings: bookingCount,
    }))
}

const selectNextBooking = (
  bookings: CustomerBooking[]
): CustomerBooking | null => {
  const activeBookings = bookings
    .filter((booking) =>
      ACTIVE_STATUS_KEYS.includes(
        normalizeStatusKey(resolveBookingStatus(booking))
      )
    )
    .sort((first, second) =>
      (first.preferredDate ?? "").localeCompare(second.preferredDate ?? "")
    )

  return activeBookings[0] ?? null
}

const buildRecentBookings = (
  bookings: CustomerBooking[],
  limit: number
): CustomerBooking[] =>
  [...bookings]
    .sort((first, second) =>
      resolveBookingDate(second).localeCompare(resolveBookingDate(first))
    )
    .slice(0, limit)

/* ------------------------------- sub-components --------------------------- */

const StatusBadge = ({ status }: { status?: string }) => {
  const statusKey = normalizeStatusKey(status)
  const statusDisplay = BOOKING_STATUS_DISPLAY[statusKey]

  return (
    <Badge
      variant="outline"
      className={cn(
        "border",
        statusDisplay?.className ??
          "border-[#102A43]/20 bg-[#102A43]/10 text-[#102A43]"
      )}
    >
      {statusDisplay?.label ?? status ?? "Unknown"}
    </Badge>
  )
}

interface DashboardStatCardProps {
  icon: ElementType
  label: string
  value: string
  subtitle: string
  variant: StatVariant
}

const DashboardStatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  variant,
}: DashboardStatCardProps) => (
  <Card className="bg-white shadow-sm transition-shadow hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-slate-500">
        {label}
      </CardTitle>
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg",
          STAT_VARIANT_CLASS_NAMES[variant]
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

const WelcomeSection = ({ customerName }: { customerName?: string }) => {
  const greeting = customerName
    ? `Welcome back, ${customerName}!`
    : "Welcome back!"

  return (
    <Card className="mb-6 border-0 bg-gradient-to-br from-[#102A43] via-[#102A43] to-[#167D9A] p-0 text-white shadow-lg ring-0">
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="min-w-0">
          <Badge className="mb-3 border-0 bg-white/15 text-white hover:bg-white/20">
            Customer Dashboard
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
            Manage your bookings, track repair progress and review everything
            from one place.
          </p>
        </div>

        <Link href={SERVICES_ROUTE} className="shrink-0">
          <Button className="bg-white text-[#102A43] shadow-sm hover:bg-white/90">
            Book a Service
            <ArrowRight />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

const StatisticsSection = ({
  statistics,
}: {
  statistics: DashboardStatistics
}) => (
  <section className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <DashboardStatCard
      icon={CalendarDays}
      label="Total Requests"
      value={String(statistics.totalRequests)}
      subtitle="All repair requests you have made"
      variant="navy"
    />
    <DashboardStatCard
      icon={Clock3}
      label="Active Jobs"
      value={String(statistics.activeJobs)}
      subtitle="Requested, accepted or in progress"
      variant="amber"
    />
    <DashboardStatCard
      icon={CircleCheckBig}
      label="Completed Jobs"
      value={String(statistics.completedJobs)}
      subtitle="Successfully finished repairs"
      variant="green"
    />
  </section>
)

interface BookingOverviewSectionProps {
  activity: MonthlyBookingActivity[]
}

const BookingOverviewSection = ({ activity }: BookingOverviewSectionProps) => (
  <Card className="bg-white shadow-sm lg:col-span-2">
    <CardHeader>
      <CardTitle className="text-[#102A43]">Booking Overview</CardTitle>
      <CardDescription>Your repair requests grouped by month</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={bookingChartConfig}
        className="aspect-auto h-[240px] w-full sm:h-[280px]"
      >
        <BarChart
          data={activity}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey="monthLabel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fontSize: 12 }}
            width={40}
          />
          <ChartTooltip
            cursor={{ fill: "rgba(22,125,154,0.08)" }}
            content={<ChartTooltipContent />}
          />
          <Bar
            dataKey="bookings"
            fill="var(--color-bookings)"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
)

const NextBookingSection = ({
  booking,
}: {
  booking: CustomerBooking | null
}) => (
  <Card className="bg-white shadow-sm">
    <CardHeader>
      <CardTitle className="text-[#102A43]">Your Next Booking</CardTitle>
      <CardDescription>Upcoming service appointment</CardDescription>
    </CardHeader>
    <CardContent>
      {booking ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]">
              <Wrench className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="text-base leading-snug font-bold text-[#102A43]">
                {booking.serviceTitle ?? "Repair Service"}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">
                Booked on {formatDisplayDate(booking.createdAt)}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-[#F5F7FA] p-3">
              <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                <UserRound className="size-3.5 text-[#167D9A]" /> Technician
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[#102A43]">
                {booking.technicianName ?? "To be assigned"}
              </dd>
            </div>
            <div className="rounded-lg bg-[#F5F7FA] p-3">
              <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarClock className="size-3.5 text-[#167D9A]" /> Preferred
                Date
              </dt>
              <dd className="mt-1 text-sm font-semibold text-[#102A43]">
                {formatDisplayDate(booking.preferredDate)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
            <span className="text-xs text-slate-500">Booking Status</span>
            <StatusBadge status={resolveBookingStatus(booking)} />
          </div>
        </div>
      ) : (
        <p className="text-sm leading-6 text-slate-500">
          No active bookings right now. Book a service to see it appear here.
        </p>
      )}
    </CardContent>
  </Card>
)

const RecentBookingsSection = ({
  bookings,
}: {
  bookings: CustomerBooking[]
}) => (
  <Card className="bg-white shadow-sm">
    <CardHeader>
      <CardTitle className="text-[#102A43]">Recent Bookings</CardTitle>
      <CardDescription>Your latest service requests</CardDescription>
      <CardAction>
        <Link href={MY_BOOKINGS_ROUTE}>
          <Button variant="outline" size="sm">
            View All Bookings
            <ArrowRight />
          </Button>
        </Link>
      </CardAction>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Technician</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking._id}>
              <TableCell className="font-medium text-[#102A43]">
                {booking.serviceTitle ?? "Repair Service"}
              </TableCell>
              <TableCell className="text-slate-600">
                {booking.technicianName ?? "To be assigned"}
              </TableCell>
              <TableCell className="text-slate-600">
                {formatDisplayDate(resolveBookingDate(booking))}
              </TableCell>
              <TableCell className="text-right font-semibold text-[#102A43]">
                {formatAmount(booking.finalAmount)}
              </TableCell>
              <TableCell>
                <StatusBadge status={resolveBookingStatus(booking)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
)

const DashboardLoadingState = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton
          key={`stat-skeleton-${index}`}
          className="h-32 rounded-xl bg-white"
        />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Skeleton className="h-80 rounded-xl bg-white lg:col-span-2" />
      <Skeleton className="h-80 rounded-xl bg-white" />
    </div>
    <Skeleton className="h-72 rounded-xl bg-white" />
  </div>
)

const DashboardEmptyState = () => (
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
      <Link href={SERVICES_ROUTE} className="mt-6">
        <Button className="bg-[#167D9A] text-white hover:bg-[#102A43]">
          Browse Services
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
)

interface DashboardErrorStateProps {
  message: string
  onRetry: () => void
}

const DashboardErrorState = ({
  message,
  onRetry,
}: DashboardErrorStateProps) => (
  <Card className="border-red-200 bg-white py-0">
    <CardContent className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50">
        <AlertCircle className="size-8 text-red-600" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-[#102A43]">
        Failed to Load Dashboard
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
        Please sign in to view your dashboard.
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

const CustomerDashboardPage = () => {
  const { data: session, isPending } = useSession()
  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const customerName = session?.user?.name
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

  const showLoading = isPending || (Boolean(customerEmail) && isLoading)
  const statistics = buildDashboardStatistics(bookings)

  const renderDashboardBody = () => {
    if (showLoading) return <DashboardLoadingState />
    if (!customerEmail) return <SignInRequiredState />
    if (errorMessage) return <DashboardErrorState message={errorMessage} onRetry={handleRetry} />

    return (
      <>
        <StatisticsSection statistics={statistics} />

        {bookings.length === 0 ? (
          <DashboardEmptyState />
        ) : (
          <>
            <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <BookingOverviewSection
                activity={buildMonthlyBookingActivity(bookings)}
              />
              <NextBookingSection booking={selectNextBooking(bookings)} />
            </section>

            <RecentBookingsSection
              bookings={buildRecentBookings(bookings, 5)}
            />
          </>
        )}
      </>
    )
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] px-4 py-8 sm:px-6 lg:px-8">
      <WelcomeSection customerName={customerName} />
      {renderDashboardBody()}
    </div>
  )
}

export default CustomerDashboardPage
