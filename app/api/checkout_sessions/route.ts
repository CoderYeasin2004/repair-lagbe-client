import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '../../../lib/stripe'
import { getSession } from '@/lib/core/server'

export async function POST(request: Request) {
  const userSession = await getSession()
  const { bookingId } = await request.json()


  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, price_1234) of the product you want to sell
          price: 'price_1UeGxdRlggzSDT6ftQcePubR',
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: userSession?.user?.email,
      metadata: {
  bookingId,
  customerEmail: userSession.user.email,
},
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      // Provide a name (for example, hosted_web_0001) to label this Checkout integration and measure its conversion independently
    //   integration_identifier: '{{INTEGRATION_ID}}',
    });
    return NextResponse.json({ url: session.url })
 } catch (err) {
  const error =
    err instanceof Error ? err : new Error(String(err))

  console.error("Stripe Checkout Error:", error.message)

  return NextResponse.json(
    { error: error.message },
    { status: 500 }
  )
}
}