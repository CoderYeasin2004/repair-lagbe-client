import { requireRole } from "@/lib/core/server"

export default async function TechnicianDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireRole("technician")
  return children
}