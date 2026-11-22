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
export const getMyBookings = async (
  email: string,
  role: "customer" | "technician" = "customer"
) => {
  const queryKey = role === "technician"
    ? "technicianEmail"
    : "customerEmail"

  const response = await fetch(
    `${BASE_URL}/bookings?${queryKey}=${encodeURIComponent(email)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch bookings")
  }

  return result
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


