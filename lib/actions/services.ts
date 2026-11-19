const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

export const createServices = async (serviceData: FormData) => {
  const serviceObject = Object.fromEntries(serviceData.entries())

  const response = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceObject),
  })

  if (!response.ok) {
    throw new Error("Failed to create service.")
  }

  return response.json()
}