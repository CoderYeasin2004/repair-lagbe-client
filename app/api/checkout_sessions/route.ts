import { NextResponse } from "next/server"
import { headers } from "next/headers"

import { stripe } from "../../../lib/stripe"
import { getSession } from "@/lib/core/server"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export async function POST(request: Request) {
  try {
    const userSession = await getSession()
    const customerEmail = userSession?.user?.email

    if (!customerEmail) {
      return NextResponse.json(
        { error: "Please sign in first." },
        { status: 401 }
      )
    }

    const { bookingId } = await request.json()

    const bookingResponse = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
      cache: "no-store",
    })

    if (!bookingResponse.ok) {
      return NextResponse.json(
        { error: "Booking not found." },
        { status: bookingResponse.status }
      )
    }

    const booking = await bookingResponse.json()

    if (booking.customerEmail !== customerEmail) {
      return NextResponse.json(
        { error: "This booking does not belong to you." },
        { status: 403 }
      )
    }

    if (booking.status !== "completed" || booking.paymentStatus !== "unpaid") {
      return NextResponse.json(
        { error: "This booking is not eligible for payment." },
        { status: 400 }
      )
    }

    const headersList = await headers()
    const origin = headersList.get("origin")
    const USD_TO_BDT_RATE = 81
    const amountInUSD = booking.finalAmount / USD_TO_BDT_RATE

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.serviceTitle,
            },
            unit_amount: Math.round(amountInUSD * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        bookingId,
        customerEmail,
      },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))

    console.error("Stripe Checkout Error:", error.message)

    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
