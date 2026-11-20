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

