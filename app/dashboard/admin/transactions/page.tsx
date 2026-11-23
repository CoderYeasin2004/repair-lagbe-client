
import React from "react";
import {
  Receipt,
  Wallet,
  CalendarDays,
  UserRound,
  Wrench,
  CreditCard,
  Mail,
  CheckCircle2,
  Hash,
} from "lucide-react";

import { getAdminPayments } from "@/lib/api/user";
import type { IAdminPayment } from "@/lib/types/admin";

// Format payment amount in BDT
const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

// Format payment date
const formatDate = (date: string | Date) => {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Paid status badge
const PaymentBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
    <CheckCircle2 size={13} />
    Paid
  </span>
);

// Transactions Page
const TransactionsPage = async () => {
  const { payments, totalRevenue } = await getAdminPayments();

  const totalTransactions = payments.length;

  return (
    <div className="min-h-screen min-w-0 w-full space-y-7 bg-[#F5F7FA] p-3 sm:p-5 lg:p-6 xl:p-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor all successful payments made through the platform.
          </p>
        </div>

        <div className="flex w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Receipt size={19} className="text-[#167D9A]" />
          <span className="text-sm font-semibold text-[#102A43]">
            {totalTransactions} Transactions
          </span>
        </div>
      </div>

      {/* Revenue and transaction statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Total revenue card */}
        <div className="relative overflow-hidden rounded-2xl bg-[#102A43] p-5 shadow-sm sm:p-6">
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-300">
                Total Revenue
              </p>
              <h2 className="mt-3 break-words text-2xl font-bold text-white sm:text-3xl">
                {formatPrice(totalRevenue)}
              </h2>
              <p className="mt-2 text-xs text-slate-300">
                Revenue from successful payments
              </p>
            </div>

            <div className="shrink-0 rounded-2xl bg-white/10 p-4 text-amber-400">
              <Wallet size={28} />
            </div>
          </div>

          <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 right-24 h-36 w-36 rounded-full bg-white/5" />
        </div>

        {/* Total transactions card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Transactions
              </p>
              <h2 className="mt-3 text-3xl font-bold text-[#102A43]">
                {totalTransactions}
              </h2>
              <p className="mt-2 text-xs text-slate-400">
                Successful payments recorded
              </p>
            </div>

            <div className="rounded-2xl bg-[#E8F3F6] p-4 text-[#167D9A]">
              <CreditCard size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions section heading */}
      <div>
        <h2 className="text-lg font-bold text-[#102A43]">
          Payment Records
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          A complete overview of platform payment transactions.
        </p>
      </div>

      {/* Mobile and tablet transaction cards */}
      {payments.length > 0 && (
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 2xl:hidden">
          {payments.map((payment: IAdminPayment) => (
            <div
              key={payment._id}
              className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              {/* Service information */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E8F3F6] text-[#167D9A]">
                  <Wrench size={22} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="break-words text-sm font-bold text-[#102A43]">
                    {payment.serviceTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Service Payment
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <PaymentBadge />
              </div>

              <div className="my-4 border-t border-slate-100" />

              {/* Customer and technician information */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <UserRound
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="break-words text-sm font-semibold text-[#102A43]">
                      {payment.customerName}
                    </p>
                    <p className="mt-1 flex items-center gap-1 break-all text-xs text-slate-500">
                      <Mail size={12} className="shrink-0" />
                      {payment.customerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Wrench
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Technician</p>
                    <p className="break-words text-sm font-semibold text-[#102A43]">
                      {payment.technicianName}
                    </p>
                    <p className="mt-1 break-all text-xs text-slate-500">
                      {payment.technicianEmail}
                    </p>
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="flex items-start gap-2">
                  <Hash
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Transaction ID</p>
                    <p className="mt-1 break-all text-xs font-medium text-slate-600">
                      {payment.transactionId || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Payment date */}
                <div className="flex items-start gap-2">
                  <CalendarDays
                    size={16}
                    className="mt-0.5 shrink-0 text-[#167D9A]"
                  />

                  <div>
                    <p className="text-xs text-slate-400">Payment Date</p>
                    <p className="text-sm text-slate-600">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment amount */}
              <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-[#F5F7FA] p-3">
                <span className="text-xs font-medium text-slate-500">
                  Amount Paid
                </span>
                <span className="break-words text-base font-bold text-[#102A43]">
                  {formatPrice(payment.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop transactions table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm 2xl:block">
        {payments.length > 0 ? (
          <table className="w-full table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[16%]" />
              <col className="w-[16%]" />
              <col className="w-[22%]" />
              <col className="w-[13%]" />
              <col className="w-[9%]" />
              <col className="w-[9%]" />
            </colgroup>

            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Service",
                  "Customer",
                  "Technician",
                  "Transaction ID",
                  "Payment Date",
                  "Status",
                  "Amount",
                ].map((heading, index) => (
                  <th
                    key={heading}
                    className={`px-3 py-4 text-xs font-bold uppercase tracking-wide text-slate-500 ${
                      index === 6 ? "text-right" : "text-left"
                    }`}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {payments.map((payment: IAdminPayment) => (
                <tr
                  key={payment._id}
                  className="transition hover:bg-slate-50/70"
                >
                  {/* Service */}
                  <td className="px-3 py-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E8F3F6] text-[#167D9A]">
                        <Wrench size={19} />
                      </div>

                      <p className="break-words text-sm font-semibold text-[#102A43]">
                        {payment.serviceTitle}
                      </p>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-3 py-4">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <UserRound
                        size={14}
                        className="mt-0.5 shrink-0 text-[#167D9A]"
                      />

                      <div className="min-w-0">
                        <p className="break-words text-xs font-semibold text-[#102A43]">
                          {payment.customerName}
                        </p>
                        <p className="mt-1 break-all text-[10px] text-slate-500 2xl:text-xs">
                          {payment.customerEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Technician */}
                  <td className="px-3 py-4">
                    <div className="flex min-w-0 items-start gap-1.5">
                      <Wrench
                        size={14}
                        className="mt-0.5 shrink-0 text-[#167D9A]"
                      />

                      <div className="min-w-0">
                        <p className="break-words text-xs font-semibold text-[#102A43]">
                          {payment.technicianName}
                        </p>
                        <p className="mt-1 break-all text-[10px] text-slate-500 2xl:text-xs">
                          {payment.technicianEmail}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Transaction ID */}
                  <td className="px-3 py-4">
                    <p className="break-all text-xs font-medium text-slate-600">
                      {payment.transactionId || "N/A"}
                    </p>
                  </td>

                  {/* Payment date */}
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CalendarDays
                        size={14}
                        className="shrink-0 text-[#167D9A]"
                      />
                      {formatDate(payment.paidAt)}
                    </div>
                  </td>

                  {/* Payment status */}
                  <td className="px-3 py-4">
                    <PaymentBadge />
                  </td>

                  {/* Amount */}
                  <td className="px-3 py-4 text-right">
                    <p className="break-words text-sm font-bold text-[#102A43]">
                      {formatPrice(payment.amount)}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="rounded-2xl bg-[#E8F3F6] p-4 text-[#167D9A]">
              <Receipt size={32} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-[#102A43]">
              No Transactions Found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Payment transactions will appear here after customers
              successfully complete their payments.
            </p>
          </div>
        )}
      </div>

      {/* Empty state for mobile, tablet and laptop */}
      {payments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-white px-5 py-16 text-center shadow-sm 2xl:hidden">
          <div className="rounded-2xl bg-[#E8F3F6] p-4 text-[#167D9A]">
            <Receipt size={32} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#102A43]">
            No Transactions Found
          </h3>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Payment transactions will appear here after customers
            successfully complete their payments.
          </p>
        </div>
      )}

      {/* Read-only notice */}
      <div className="flex items-start gap-3 rounded-xl border border-[#D7E9EE] bg-[#E8F3F6] p-3 sm:p-4">
        <CheckCircle2
          size={19}
          className="mt-0.5 shrink-0 text-[#167D9A]"
        />

        <p className="text-xs leading-6 text-[#102A43] sm:text-sm">
          <span className="font-semibold">Payment overview:</span> This
          page displays successful payment records and total revenue
          from the platform&apos;s transactions.
        </p>
      </div>
    </div>
  );
};

export default TransactionsPage;
