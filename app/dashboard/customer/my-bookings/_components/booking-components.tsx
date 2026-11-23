
"use client";

import { useState } from "react";
import Link from "next/link";
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
  Loader2,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import PayNowButton from "./pay-now-button";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";

import {
  calculateSummaryMetrics,
  formatBookingDate,
  formatPrice,
  getBookingStatusDisplay,
  getCategoryLabel,
  getPaymentStatusDisplay,
  resolveServiceSummary,
  resolveTechnicianName,
  STATUS_TONE_CLASSES,
  type CustomerBooking,
  type StatusDisplay,
  type StatusTone,
} from "@/lib/utils";
import { cancelBooking } from "@/lib/actions/services";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

/* ------------------------------- Status Badge ------------------------------- */

const StatusBadge = ({
  statusDisplay,
}: {
  statusDisplay: StatusDisplay;
}) => (
  <Badge
    variant="outline"
    className={cn("border", STATUS_TONE_CLASSES[statusDisplay.tone])}
  >
    {statusDisplay.label}
  </Badge>
);

/* -------------------------------- Summary Card ------------------------------- */

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  subtitle: string;
  tone: StatusTone;
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
);

/* ----------------------------- Booking Service Image ----------------------------- */

const BookingServiceImage = ({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const showFallback = !src || hasImageError;

  return (
    <div className="flex aspect-16/10 w-full items-center justify-center overflow-hidden bg-slate-100">
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
  );
};

/* -------------------------------- Booking Card -------------------------------- */

export const BookingCard = ({
  booking,
  onPayNow,
  onCancelled,
}: {
  booking: CustomerBooking;
  onPayNow: (bookingId: string) => void;
  onCancelled: () => void;
}) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const serviceSummary = resolveServiceSummary(booking);
  const serviceTitle = serviceSummary?.title ?? "Untitled Service";
  const technicianName = resolveTechnicianName(booking);

  const currentStatus = String(
    booking.status ?? booking.bookingStatus
  ).toLowerCase();

  const bookingStatusDisplay = getBookingStatusDisplay(
    booking.status ?? booking.bookingStatus
  );

  const paymentStatusDisplay = getPaymentStatusDisplay(
    booking.paymentStatus
  );

  const servicePrice =
    booking.finalAmount ?? booking.basePrice ?? serviceSummary?.price;

  const handleCancel = async () => {
  try {
    setIsCancelling(true);

    const result = await cancelBooking(booking._id);

    toast.success(result.message || "Booking cancelled successfully");
    onCancelled();
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Failed to cancel booking"
    );
  } finally {
    setIsCancelling(false);
  }
};

  return (
    <Card className="group flex h-full flex-col gap-0 overflow-hidden bg-white py-0 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <BookingServiceImage
          src={serviceSummary?.imageUrl}
          alt={serviceTitle}
        />

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
            <Tag className="size-3.5 text-[#167D9A]" />
            Service Price
          </p>

          <p className="mt-1 text-lg font-bold text-[#102A43]">
            {formatPrice(servicePrice)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarDays className="size-3.5 text-[#167D9A]" />
              Preferred
            </p>

            <p className="mt-1 text-sm font-semibold text-[#102A43]">
              {formatBookingDate(booking.preferredDate)}
            </p>
          </div>

          <div>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="size-3.5 text-[#167D9A]" />
              Booked On
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

        {currentStatus === "completed" &&
          String(booking.paymentStatus).toLowerCase() === "unpaid" && (
            <PayNowButton
              bookingId={booking._id}
              onPayNow={onPayNow}
            />
          )}

        {currentStatus === "requested" && (
          <AlertDialog>
  <AlertDialogTrigger
  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-100 hover:text-red-700 active:scale-[0.98]"
>
  <XCircle className="size-4" />
  Cancel Booking
</AlertDialogTrigger>

  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Cancel This Booking?
      </AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to cancel this booking?
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Keep Booking
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={handleCancel}
        disabled={isCancelling}
      >
        {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        )}
      </CardContent>
    </Card>
  );
};

/* ------------------------------ Loading State ------------------------------ */

export const BookingsLoadingState = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={`summary-skeleton-${index}`}
          className="h-28 rounded-xl"
        />
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton
          key={`booking-skeleton-${index}`}
          className="h-96 rounded-xl"
        />
      ))}
    </div>
  </div>
);

/* ------------------------------- Empty State ------------------------------- */

export const EmptyBookingsState = () => (
  <Card className="border-dashed bg-white py-0">
    <CardContent className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-[#167D9A]/10">
        <Inbox className="size-8 text-[#167D9A]" />
      </div>

      <h2 className="mt-5 text-xl font-bold text-[#102A43]">
        No Bookings Yet
      </h2>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        You haven&apos;t booked any repair services yet. Browse our services and
        request a repair to get started.
      </p>

      <Link href="/services" className="mt-6">
        <Button className="bg-[#167D9A] text-white hover:bg-[#102A43]">
          Browse Services
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
);

/* -------------------------------- Error State -------------------------------- */

interface BookingsErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const BookingsErrorState = ({
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
);

/* ----------------------------- Sign In Required ----------------------------- */

export const SignInRequiredState = () => (
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
);

/* ----------------------------- Booking Page Content ----------------------------- */

interface BookingPageContentProps {
  bookings: CustomerBooking[];
  onPayNow: (bookingId: string) => void;
  onCancelled: () => void;
}

export const BookingPageContent = ({
  bookings,
  onPayNow,
  onCancelled,
}: BookingPageContentProps) => {
  const summaryMetrics = calculateSummaryMetrics(bookings);

  return (
    <>
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

      {bookings.length === 0 ? (
        <EmptyBookingsState />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onPayNow={onPayNow}
              onCancelled={onCancelled}
            />
          ))}
        </div>
      )}
    </>
  );
};
