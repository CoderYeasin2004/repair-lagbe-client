const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

export const getServices = async (query = "") => {
  const url = query
    ? `${BASE_URL}/services?${query}`
    : `${BASE_URL}/services`

  const res = await fetch(url, {
    method: "GET",
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch services")
  }

  return res.json()
}


export const getServiceById = async (serviceId: string) => {
  const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

// Get customer's bookings
export const getMyBookings = async (customerEmail: string) => {
  const response = await fetch(
    `${BASE_URL}/bookings?customerEmail=${encodeURIComponent(customerEmail)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch your bookings.")
  }

  return response.json()
}

export const getMyBookingCounts = async (
  email: string,
  role?: string
) => {
  const response = await fetch(
    `${BASE_URL}/bookings/count?userid=${encodeURIComponent(email)}&role=${role || "customer"}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booking counts");
  }

  return response.json();
};