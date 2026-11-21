
import {
  PaymentHistoryContent,
  type PaymentRecord,
} from "./_components/payment-history-content"

export default function CustomerPaymentsPage() {
  // Connect real payment data here in the next step.
  const payments: PaymentRecord[] = []

  return (
    <div className="w-full min-w-0 space-y-7 p-4 sm:p-6 lg:p-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-[#167D9A]">
          Customer Dashboard / Payments
        </p>

        <h1 className="text-2xl font-bold tracking-tight text-[#102A43] sm:text-3xl">
          Payment History
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Keep track of your repair service payments and transaction details.
        </p>
      </div>

      <PaymentHistoryContent payments={payments} />
    </div>
  )
}
