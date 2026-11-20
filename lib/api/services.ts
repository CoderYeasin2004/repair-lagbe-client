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