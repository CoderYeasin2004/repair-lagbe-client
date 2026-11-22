
"use client"

import { useState } from "react"
import { toast } from "sonner"
import { updateUserRole } from "@/lib/actions/user"
import { useSession } from "@/lib/auth-client"

type UserRole = "customer" | "technician" | "admin"

interface RoleChangeButtonProps {
  userId: string
  currentRole: UserRole
}

export default function RoleChangeButton({
  userId,
  currentRole,
}: RoleChangeButtonProps) {
  const [role, setRole] = useState<UserRole>(currentRole)
  const { data: session } = useSession()
const currentUserId = session?.user?.id
const isOwnAccount = currentUserId === userId
  const [loading, setLoading] = useState(false)

  const handleChange = async (newRole: UserRole) => {
    if (newRole === role) return

    try {
      setLoading(true)
      await updateUserRole(userId, newRole)
      setRole(newRole)
      toast.success("User role updated successfully")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role"
      )
    } finally {
      setLoading(false)
    }
  }

 return (
  <select
  value={role}
  disabled={loading || isOwnAccount}
  onChange={(e) => handleChange(e.target.value as UserRole)}
  title={isOwnAccount ? "You cannot change your own role" : "Change role"}
  className={`rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ${
    isOwnAccount ? "cursor-not-allowed opacity-60" : "cursor-pointer"
  }`}
>
  <option value="customer">Customer</option>
  <option value="technician">Technician</option>
  <option value="admin">Admin</option>
</select>
)
}