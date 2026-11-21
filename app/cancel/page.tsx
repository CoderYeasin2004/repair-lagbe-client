
import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentCancelPageProps {
  searchParams: Promise<{
    canceled?: string
  }>
}

export default async function PaymentCancelPage({
  searchParams,
}: PaymentCancelPageProps) {
  const { canceled } = await searchParams

  if (canceled === "true") {
    console.log(
      "Order canceled -- continue to shop around and check out when you're ready."
    )
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5 text-center">
        <XCircle className="mx-auto size-16 text-red-500" />

        <h1 className="text-2xl font-bold text-[#102A43]">
          Payment Cancelled
        </h1>

        <p className="text-slate-500">
          Your payment was cancelled. No payment has been made.
          You can try again whenever you&lsquo;re ready.
        </p>

        <Link href="/dashboard/customer/my-bookings">
  <Button className="bg-[#167D9A]">
    Try Again
  </Button>
</Link>
      </div>
    </div>
  )
}
