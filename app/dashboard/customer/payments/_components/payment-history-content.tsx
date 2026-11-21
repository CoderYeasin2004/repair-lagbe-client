
"use client"

import {
  CalendarDays,
  CreditCard,
  ReceiptText,
  Wallet,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface PaymentRecord {
  _id: string
  serviceTitle: string
  technicianName: string
  amount: number
  transactionId: string
  paidAt: string
}

interface PaymentHistoryContentProps {
  payments: PaymentRecord[]
}

interface PaymentSummaryCardsProps {
  totalPayments: number
  totalAmount: number
}

function formatBDT(amount: number) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatPaymentDate(date: string) {
  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return "—"
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  })
}

function PaymentSummaryCards({
  totalPayments,
  totalAmount,
}: PaymentSummaryCardsProps) {
  const summaryItems = [
    {
      title: "Total Payments",
      value: totalPayments.toString(),
      description: "Successful transactions",
      icon: CreditCard,
    },
    {
      title: "Total Amount Paid",
      value: formatBDT(totalAmount),
      description: "Your completed payments",
      icon: Wallet,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {summaryItems.map((item) => {
        const Icon = item.icon

        return (
          <Card key={item.title} className="border-slate-200 shadow-sm">
            <CardContent className="flex items-center justify-between p-5">
              <div className="space-y-1">
                <p className="text-sm font-medium text-slate-500">
                  {item.title}
                </p>
                <p className="text-2xl font-bold tracking-tight text-[#102A43]">
                  {item.value}
                </p>
                <p className="text-xs text-slate-500">
                  {item.description}
                </p>
              </div>

              <div className="flex size-12 items-center justify-center rounded-xl bg-[#167D9A]/10 text-[#167D9A]">
                <Icon className="size-6" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function PaymentHistoryTable({
  payments,
}: {
  payments: PaymentRecord[]
}) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#167D9A]/10 text-[#167D9A]">
          <ReceiptText className="size-7" />
        </div>

        <h3 className="text-lg font-semibold text-[#102A43]">
          No payment history yet
        </h3>

        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
          Your successful repair service payments will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="min-w-[190px]">Service</TableHead>
              <TableHead className="min-w-[150px]">Technician</TableHead>
              <TableHead className="min-w-[120px]">Amount</TableHead>
              <TableHead className="min-w-[190px]">Transaction ID</TableHead>
              <TableHead className="min-w-[130px]">Payment Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment._id}>
                <TableCell className="font-medium text-[#102A43]">
                  {payment.serviceTitle}
                </TableCell>

                <TableCell className="text-slate-600">
                  {payment.technicianName}
                </TableCell>

                <TableCell className="font-semibold text-[#102A43]">
                  {formatBDT(payment.amount)}
                </TableCell>

                <TableCell className="font-mono text-xs text-slate-500">
                  {payment.transactionId}
                </TableCell>

                <TableCell className="text-slate-600">
                  {formatPaymentDate(payment.paidAt)}
                </TableCell>

                <TableCell className="text-right">
                  <Badge className="border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50">
                    Paid
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export function PaymentHistoryContent({
  payments,
}: PaymentHistoryContentProps) {
  const totalAmount = payments.reduce(
    (total, payment) => total + payment.amount,
    0
  )

  return (
    <div className="space-y-6">
      <PaymentSummaryCards
        totalPayments={payments.length}
        totalAmount={totalAmount}
      />

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#102A43]">
              Payment History
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review your successful repair service payments.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <CalendarDays className="size-4" />
            <span>All transactions</span>
          </div>
        </div>

        <PaymentHistoryTable payments={payments} />
      </section>
    </div>
  )
}
