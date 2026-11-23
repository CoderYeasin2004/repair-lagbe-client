'use server'

import type { IPaidBooking } from "@/lib/types/bookings"
import { headers } from "next/headers";
import { auth } from "../auth";
import type { User } from "@/lib/types/user"
import {  protectedMutation } from "../core/server";


const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"



export const getUsers = async (): Promise<{ users: User[] }> => {
  const result = await auth.api.listUsers({
    query: {
      limit: 100,
      offset: 0,
      sortBy: "createdAt",
      sortDirection: "desc",
    },
    headers: await headers(),
  })

  return result
}




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