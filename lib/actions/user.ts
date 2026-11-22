'use server'

import { authFetch } from "../core/server"

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"

export const updateUserRole = async (
  userId: string,
  role: "customer" | "technician" | "admin"
) => {
  const response = await authFetch(`${BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user role")
  }

  return result
}