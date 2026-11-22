import { redirect } from "next/navigation"
import Link from "next/link"

import { stripe } from "../../lib/stripe"
import { paymentVerify } from "@/lib/actions/payments"
import { getPaidBookingById } from "@/lib/api/user"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }

  const {
    status,
    payment_status,
    customer_email,
    metadata,
    payment_intent,
    amount_total,
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete" && payment_status === "paid") {
    const bookingId = metadata?.bookingId

    if (!bookingId) {
      throw new Error("Booking ID not found in Stripe session")
    }

    const booking = await getPaidBookingById(bookingId)
    const currentPaymentStatus = booking.paymentStatus

    if (currentPaymentStatus === "unpaid") {
      const result = await paymentVerify(session_id)
      console.log("Payment verification result:", result)
    }

    console.log("Payment Status:", payment_status)
    console.log("Customer Email:", customer_email)
    console.log("Booking ID:", bookingId)
    console.log("Payment Intent:", payment_intent)

    // Format the BDT amount using the existing formatPrice utility pattern
    const bdtAmount = `৳${Number(booking.finalAmount).toLocaleString("en-BD")}`

    return (
      <section id="success" className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-[#F5F7FA]">
        <div className="w-full max-w-md space-y-8 text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center rounded-full bg-[#167D9A]/10 p-8 mb-6">
            <CheckCircle className="size-24 text-[#167D9A]" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#102A43] tracking-tight">
            Payment Successful
          </h1>

          {/* BDT Amount */}
          <p className="text-2xl font-medium text-[#102A43] mb-2">
            {bdtAmount}
          </p>

          {/* Transaction ID */}
          <Card className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm mb-8">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Transaction ID</p>
                <p className="font-medium text-[#102A43] truncate">
                  {typeof payment_intent === "string"
                    ? payment_intent
                    : payment_intent?.id}
                </p>
              </div>

              {/* Payment Status Badge */}
              <div>
                <p className="text-sm text-slate-500">Payment Status</p>
                <Badge
                  variant="default"
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium",
                    "bg-[#102A43]/10 text-[#102A43] border border-[#102A43]/20"
                  )}
                >
                  {payment_status}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Back to My Bookings Button */}
          <div className="w-full">
            <Link href="/dashboard/customer/my-bookings">
              <Button className="w-full justify-center bg-[#167D9A] text-white hover:bg-[#102A43]">
                Back to My Bookings
              </Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return redirect("/dashboard/customer/my-bookings")
}