'use server'
import { protectedMutation } from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"


export const createServices = async (serviceData: FormData) => {
  const serviceObject = Object.fromEntries(serviceData.entries())

 const response = await protectedMutation(
  `${BASE_URL}/services`,
  "POST",
  serviceObject
)
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
  const response = await protectedMutation(
    `${BASE_URL}/bookings`,
    "POST",
    bookingData
  )

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to submit request.")
  }

  return result
}

 

export const deleteService = async (serviceId: string) => {
  const response = await protectedMutation(
  `${BASE_URL}/services/${serviceId}`,
  "DELETE"
)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete service")
  }

  return result
}


export const updateBookingStatus = async (
  bookingId: string,
  status: string,
  finalAmount?: number
) => {
  const res = await protectedMutation(
  `${BASE_URL}/bookings/${bookingId}`,
  "PATCH",
  {
    status,
    ...(finalAmount !== undefined && { finalAmount }),
  }
)

  const result = await res.json()

  if (!res.ok) {
    throw new Error(result.message || "Failed to update booking status")
  }

  return result
}

export const updateServiceApproval = async (formData: FormData) => {
  const id = formData.get("id");
  const approvalStatus = formData.get("approvalStatus");

  const response = await protectedMutation(
    `${BASE_URL}/admin/services/${id}/approval`,
    "PATCH",
    { approvalStatus }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update service approval");
  }

  return data;
};


export const updateService = async (formData: FormData) => {
  const id = formData.get("id");

  if (!id || typeof id !== "string") {
    throw new Error("Service ID is required");
  }

  const serviceData = {
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    image: formData.get("image"),
    basePrice: Number(formData.get("basePrice")),
    estimatedDuration: formData.get("estimatedDuration"),
    serviceMode: formData.get("serviceMode"),
    serviceArea: formData.get("serviceArea"),
  };

  const response = await protectedMutation(
    `${BASE_URL}/services/${id}`,
    "PATCH",
    serviceData
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update service");
  }

  return data;
};

export const cancelBooking = async (bookingId: string) => {
  if (!bookingId) {
    throw new Error("Booking ID is required");
  }

  const response = await protectedMutation(
    `${BASE_URL}/bookings/${bookingId}/cancel`,
    "PATCH"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel booking");
  }

  return data;
};