const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

export const createServices = async  (serviceData: FormData) => {
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


export const createBooking = async (bookingData: {
  serviceId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  preferredDate: string
  problemDescription: string
}) => {
  const response = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  })

  if (!response.ok) {
    const result = await response.json()
    throw new Error(result.message || "Failed to submit request.")
  }

  return response.json()
}


 

export const deleteService = async (serviceId: string) => {
  const response = await fetch(`${BASE_URL}/services/${serviceId}`, {
    method: "DELETE",
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete service")
  }

  return result
}