const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

export const getPaidBookingById = async (bookingId: string) => {
  const response = await fetch(
    `${BASE_URL}/bookings/${bookingId}/paid`,
    { cache: "no-store" }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to get payment status")
  }

  return data.paymentStatus
}