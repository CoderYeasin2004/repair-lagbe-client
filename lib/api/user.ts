'use server'

import type { IPaidBooking } from "@/lib/types/bookings"
import {  authFetch, protectedMutation } from "../core/server";
import { ApprovalStatus, IAdminService } from "../types/admin";
import type {  BookingStatus, IAdminBooking, IAdminPaymentsResponse } from "@/lib/types/admin";



const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"



export const getUsers = async () => {
  const res = await authFetch(`${BASE_URL}/user`);

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
};


export const getPaidBookingById = async (
  bookingId: string
): Promise<IPaidBooking> => {
 const response = await protectedMutation(
  `${BASE_URL}/bookings/${bookingId}/paid`,
  "GET"
)

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to get booking details")
  }

  return data
}


export const getAdminStats = async () => {
  const response = await protectedMutation(
    `${BASE_URL}/admin/stats`,
    "GET"
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch admin stats");
  }

  return data;
};


export const getAdminServices = async (
  status?: ApprovalStatus
): Promise<IAdminService[]> => {
  const url = status
    ? `${BASE_URL}/admin/services?status=${status}`
    : `${BASE_URL}/admin/services`;

  const response = await protectedMutation(url, "GET");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch services");
  }

  return data;
};




export const getAdminBookings = async (
  status?: BookingStatus
): Promise<IAdminBooking[]> => {
  const url = status
    ? `${BASE_URL}/admin/bookings?status=${status}`
    : `${BASE_URL}/admin/bookings`;

  const response = await protectedMutation(url, "GET");

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data;
};



// Fetch all admin payment transactions
export const getAdminPayments =
  async (): Promise<IAdminPaymentsResponse> => {
    const response = await protectedMutation(
      `${BASE_URL}/admin/payments`,
      "GET"
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch transactions");
    }

    return data;
  };
