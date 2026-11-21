import { redirect } from "next/navigation"

import { stripe } from "../../lib/stripe"
import { paymentVerify } from "@/lib/actions/payments"
import { getPaidBookingById } from "@/lib/api/user"


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

    const currentPaymentStatus = await getPaidBookingById(bookingId)

    if (currentPaymentStatus === "unpaid") {
      const result = await paymentVerify(session_id)
      console.log("Payment verification result:", result)
    }

    console.log("Payment Status:", payment_status)
    console.log("Customer Email:", customer_email)
    console.log("Booking ID:", bookingId)
    console.log("Payment Intent:", payment_intent)

    return (
     <section id="success">
  <h1>
    {currentPaymentStatus === "paid"
      ? "Payment Already Completed"
      : "Payment Successful"}
  </h1>

  <p>We appreciate your business!</p>

  <p>Amount: ${(amount_total ?? 0) / 100}</p>

  <p>
    Transaction ID:{" "}
    {typeof payment_intent === "string"
      ? payment_intent
      : payment_intent?.id}
  </p>

  <a href="/dashboard/customer/my-bookings">
    Back to My Bookings
  </a>
</section>
    )
  }

  return redirect("/dashboard/customer/my-bookings")
}