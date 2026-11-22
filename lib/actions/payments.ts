'use server'

import { authFetch } from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"

export const paymentVerify = async (sessionId: string) => {
  const response = await authFetch(`${BASE_URL}/payments/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId }),
    cache: "no-store",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Payment verification failed")
  }

  return result
}