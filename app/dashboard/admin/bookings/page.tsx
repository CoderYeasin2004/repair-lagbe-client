
import React from "react";
import Image from "next/image";
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
  UserRound,
  Wrench,
  Filter,
  ChevronDown,
  PackageCheck,
  Mail,
  Phone,
} from "lucide-react";

import { getAdminBookings } from "@/lib/api/user";
import type {
  IAdminBooking,
  BookingStatus,
} from "@/lib/types/admin";

// Available booking status filters
const filters: { label: string; value: BookingStatus | "all" }[] = [
  { label: "All Bookings", value: "all" },
  { label: "Requested", value: "requested" },
  { label: "Accepted", value: "accepted" },
  { label: "In Progress", value: "in-progress" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

// Format booking amount as Bangladeshi Taka
const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount || 0);

// Format preferred service date
const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

// Return matching colors and labels for each booking status
const getStatusStyle = (status: BookingStatus) => {
  const styles: Record<BookingStatus, string> = {
    requested: "bg-blue-50 text-blue-700 border-blue-100",
    accepted: "bg-indigo-50 text-indigo-700 border-indigo-100",
    "in-progress": "bg-amber-50 text-amber-700 border-amber-100",
    completed: "bg-green-50 text-green-700 border-green-100",
    rejected: "bg-red-50 text-red-700 border-red-100",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return styles[status] || styles.requested;
};

// Return matching colors for payment status
const getPaymentStyle = (status: string) =>
  status === "paid"
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-amber-50 text-amber-700 border-amber-100";

// Booking status badge
const StatusBadge = ({ status }: { status: BookingStatus }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
      status
    )}`}
  >
    {status.replace("-", " ")}
  </span>
);

// Payment status badge
const PaymentBadge = ({ status }: { status: string }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getPaymentStyle(
      status
    )}`}
  >
    <CreditCard size={13} />
    {status}
  </span>
);

// Service image with fallback
const ServiceImage = ({
  image,
  title,
}: {
  image: string;
  title: string;
}) => (
  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
    {image ? (
      <Image
        src={image}
        alt={title}
        fill
        sizes="48px"
        className="object-cover"
      />
    ) : (
      <div className="flex h-full items-center justify-center text-slate-400">
        <Wrench size={20} />
      </div>
    )}
  </div>
);

// Admin Bookings Page
const BookingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) => {
  // Read selected status from URL query
  const params = await searchParams;

  // Validate selected status before fetching
  const selectedStatus = filters.some(
    (filter) => filter.value === params.status
  )
    ? (params.status as BookingStatus)
    : "all";

  // Fetch all bookings or bookings matching selected status
  const bookings: IAdminBooking[] = await getAdminBookings(
    selectedStatus === "all" ? undefined : selectedStatus
  );

  // Calculate booking statistics
  const totalBookings = bookings.length;
  const requestedCount = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;
  const inProgressCount = bookings.filter(
    (booking) => booking.status === "in-progress"
  ).length;
  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div className="min-h-screen min-w-0 w-full space-y-7 bg-[#F5F7FA] p-3 sm:p-5 lg:p-6 xl:p-8">
      {/* Page heading and description */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
            All Bookings
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor and manage an overview of all repair bookings.
          </p>
        </div>

        {/* Total booking count */}
        <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <ClipboardList size={19} className="text-[#167D9A]" />
          <span className="text-sm font-semibold text-[#102A43]">
            {totalBookings} Bookings
          </span>
        </div>
      </div>

      {/* Booking summary statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Bookings
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {totalBookings}
              </h2>
            </div>
            <div className="rounded-xl bg-[#E8F3F6] p-3 text-[#167D9A]">
              <ClipboardList size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Requested</p>
              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {requestedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Clock3 size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {inProgressCount}
              </h2>
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
              <Wrench size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <h2 className="mt-2 text-2xl font-bold text-[#102A43]">
                {completedCount}
              </h2>
            </div>
            <div className="rounded-xl bg-green-50 p-3 text-green-600">
              <PackageCheck size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Booking filter section */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-bold text-[#102A43]">
            Booking Records
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            View all customer repair requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <details className="group relative">
            <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#102A43] shadow-sm transition hover:border-[#167D9A]">
              <Filter size={16} className="text-[#167D9A]" />
              Filter
              <ChevronDown
                size={16}
                className="transition-transform group-open:rotate-180"
              />
            </summary>

            {/* Filter options */}
            <div className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
              {filters.map((filter) => {
                const isActive = selectedStatus === filter.value;

                return (
                  <a
                    key={filter.value}
                    href={
                      filter.value === "all"
                        ? "/dashboard/admin/bookings"
                        : `/dashboard/admin/bookings?status=${filter.value}`
                    }
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                      isActive
                        ? "bg-[#E8F3F6] font-semibold text-[#167D9A]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                    {isActive && (
                      <CheckCircle2 size={15} className="text-[#167D9A]" />
                    )}
                  </a>
                );
              })}
            </div>
          </details>

          <span className="text-xs font-medium text-slate-500">
            {filters.find((filter) => filter.value === selectedStatus)?.label}
          </span>
        </div>
      </div>

      {/* Mobile and tablet responsive booking cards */}
      {bookings.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:hidden">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              {/* Service information */}
              <div className="flex min-w-0 items-center gap-3">
                <ServiceImage
                  image={booking.serviceImage}
                  title={booking.serviceTitle}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-bold text-[#102A43]">
                    {booking.serviceTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {booking.category}
                  </p>
                </div>
              </div>

              {/* Booking status and payment */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={booking.status} />
                <PaymentBadge status={booking.paymentStatus} />
              </div>

              <div className="my-4 border-t border-slate-100" />

              {/* Customer information */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <UserRound
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="break-words text-sm font-semibold text-[#102A43]">
                      {booking.customerName}
                    </p>
                    <p className="mt-1 flex items-center gap-1 break-all text-xs text-slate-500">
                      <Mail size={12} className="shrink-0" />
                      {booking.customerEmail}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Phone size={12} className="shrink-0" />
                      {booking.customerPhone}
                    </p>
                  </div>
                </div>

                {/* Technician information */}
                <div className="flex items-start gap-2">
                  <Wrench
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Technician</p>
                    <p className="break-words text-sm font-semibold text-[#102A43]">
                      {booking.technicianName}
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {booking.technicianEmail}
                    </p>
                  </div>
                </div>

                {/* Preferred date */}
                <div className="flex items-start gap-2">
                  <CalendarDays
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />
                  <div>
                    <p className="text-xs text-slate-400">Preferred Date</p>
                    <p className="text-sm text-slate-600">
                      {formatDate(booking.preferredDate)}
                    </p>
                  </div>
                </div>

                {/* Service address */}
                <div className="flex items-start gap-2">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Address</p>
                    <p className="break-words text-sm text-slate-600">
                      {booking.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking amount */}
              <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-[#F5F7FA] p-3">
                <span className="text-xs font-medium text-slate-500">
                  Final Amount
                </span>
                <span className="text-base font-bold text-[#102A43]">
                  {formatPrice(booking.finalAmount ?? booking.basePrice)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop booking table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm 2xl:block">
        {bookings.length > 0 ? (
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[17%]" />
              <col className="w-[17%]" />
              <col className="w-[15%]" />
              <col className="w-[11%]" />
              <col className="w-[11%]" />
              <col className="w-[9%]" />
            </colgroup>

            {/* Table column headings */}
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Service",
                  "Customer",
                  "Technician",
                  "Preferred Date",
                  "Status",
                  "Payment",
                  "Amount",
                ].map((heading, index) => (
                  <th
                    key={heading}
                    className={`px-2 py-4 text-[10px] font-bold uppercase tracking-wide text-slate-500 2xl:px-3 2xl:text-xs ${
                      index === 6 ? "text-right" : "text-left"
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Render booking records */}
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="transition hover:bg-slate-50/70"
                >
                  {/* Service information */}
                  <td className="px-2 py-4 2xl:px-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="hidden 2xl:block">
                        <ServiceImage
                          image={booking.serviceImage}
                          title={booking.serviceTitle}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="break-words text-xs font-semibold text-[#102A43] 2xl:text-sm">
                          {booking.serviceTitle}
                        </p>
                        <p className="mt-1 break-words text-[10px] text-slate-500 2xl:text-xs">
                          {booking.category}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Customer information */}
                  <td className="px-2 py-4 2xl:px-3">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <UserRound
                        size={14}
                        className="mt-0.5 shrink-0 text-[#167D9A]"
                      />
                      <div className="min-w-0">
                        <p className="break-words text-xs font-semibold text-[#102A43]">
                          {booking.customerName}
                        </p>
                        <p className="mt-1 break-all text-[10px] text-slate-500 2xl:text-xs">
                          {booking.customerEmail}
                        </p>
                        <p className="mt-1 break-words text-[10px] text-slate-400">
                          {booking.customerPhone}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Technician information */}
                  <td className="px-2 py-4 2xl:px-3">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <Wrench
                        size={14}
                        className="mt-0.5 shrink-0 text-[#167D9A]"
                      />
                      <div className="min-w-0">
                        <p className="break-words text-xs font-semibold text-[#102A43]">
                          {booking.technicianName}
                        </p>
                        <p className="mt-1 break-all text-[10px] text-slate-500 2xl:text-xs">
                          {booking.technicianEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Preferred date and address */}
                  <td className="px-2 py-4 2xl:px-3">
                    <div className="flex items-start gap-1.5 text-xs text-slate-600">
                      <CalendarDays
                        size={13}
                        className="mt-0.5 shrink-0 text-[#167D9A]"
                      />
                      <span className="break-words">
                        {formatDate(booking.preferredDate)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-start gap-1.5 text-[10px] text-slate-400 2xl:text-xs">
                      <MapPin size={13} className="mt-0.5 shrink-0" />
                      <span className="break-words">
                        {booking.address}
                      </span>
                    </div>
                  </td>

                  {/* Booking status */}
                  <td className="px-2 py-4 2xl:px-3">
                    <StatusBadge status={booking.status} />
                  </td>

                  {/* Payment status */}
                  <td className="px-2 py-4 2xl:px-3">
                    <PaymentBadge status={booking.paymentStatus} />
                  </td>

                  {/* Final amount */}
                  <td className="px-2 py-4 text-right 2xl:px-3">
                    <p className="break-words text-xs font-bold text-[#102A43] 2xl:text-sm">
                      {formatPrice(
                        booking.finalAmount ?? booking.basePrice
                      )}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      Final amount
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-2xl bg-[#E8F3F6] p-4 text-[#167D9A]">
              <ClipboardList size={32} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-[#102A43]">
              No Bookings Found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              There are no bookings available for this status right now.
            </p>
          </div>
        )}
      </div>

      {/* Empty state for mobile, tablet and laptop */}
      {bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-5 py-16 text-center shadow-sm 2xl:hidden">
          <div className="rounded-2xl bg-[#E8F3F6] p-4 text-[#167D9A]">
            <ClipboardList size={32} />
          </div>
          <h3 className="mt-4 text-lg font-bold text-[#102A43]">
            No Bookings Found
          </h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            There are no bookings available for this status right now.
          </p>
        </div>
      )}

      {/* Read-only notice for admin */}
      <div className="flex items-start gap-3 rounded-xl border border-[#D7E9EE] bg-[#E8F3F6] p-3 sm:p-4">
        <XCircle size={19} className="mt-0.5 shrink-0 text-[#167D9A]" />
        <p className="text-xs leading-6 text-[#102A43] sm:text-sm">
          <span className="font-semibold">Read-only overview:</span> This page
          allows administrators to monitor all platform bookings. Booking
          statuses are managed by the respective technicians and customers.
        </p>
      </div>
    </div>
  );
};

export default BookingsPage;
