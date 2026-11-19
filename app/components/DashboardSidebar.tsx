"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  UserRound,
  Plus,
  ClipboardList,
  Wrench,
  Users,
  BriefcaseBusiness,
  Receipt,
} from "lucide-react"

type DashboardRole = "customer" | "technician" | "admin"



const menuItemsByRole = {
  customer: [
    {
      name: "Dashboard",
      url: "/dashboard/customer",
      icon: LayoutDashboard,
    },
    {
      name: "My Bookings",
      url: "/dashboard/customer/my-bookings",
      icon: CalendarDays,
    },
    {
      name: "Payments",
      url: "/dashboard/customer/payments",
      icon: CreditCard,
    },
  ],

  technician: [
    {
      name: "Dashboard",
      url: "/dashboard/technician",
      icon: LayoutDashboard,
    },
    {
      name: "Add Service",
      url: "/dashboard/technician/add-service",
      icon: Plus,
    },
    {
      name: "My Services",
      url: "/dashboard/technician/my-services",
      icon: Wrench,
    },
    {
      name: "Requests",
      url: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
  ],

  admin: [
    {
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Services",
      url: "/dashboard/admin/services",
      icon: BriefcaseBusiness,
    },
    {
      name: "Bookings",
      url: "/dashboard/admin/bookings",
      icon: CalendarDays,
    },
    {
      name: "Transactions",
      url: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
} satisfies Record<
  DashboardRole,
  {
    name: string
    url: string
    icon: typeof LayoutDashboard
  }[]
>

export const DashboardSidebar = () => {
  const { data: session, isPending } = useSession()
  const pathname = usePathname()

  const userRole = session?.user?.role

  // ORIGINAL ROLE LOGIC — restore after Admin UI preview
  const role: DashboardRole =
    userRole === "technician" || userRole === "admin" ? userRole : "customer"

  // TEMPORARY: Admin Dashboard UI preview only
  // const isAdminPreview = true

  // const role: DashboardRole = isAdminPreview
  //   ? "admin"
  //   : userRole === "technician" || userRole === "admin"
  //     ? userRole
  //     : "customer"


 const router = useRouter()
 

useEffect(() => {
  if (isPending) return

  if (!session) {
    router.replace("/sign-in")
    return
  }

  const userRole = session.user.role

  if (
    pathname.startsWith("/dashboard/admin") &&
    userRole !== "admin"
  ) {
    router.replace(`/dashboard/${userRole}`)
  } else if (
    pathname.startsWith("/dashboard/technician") &&
    userRole !== "technician"
  ) {
    router.replace(`/dashboard/${userRole}`)
  } else if (
    pathname.startsWith("/dashboard/customer") &&
    userRole !== "customer"
  ) {
    router.replace(`/dashboard/${userRole}`)
  }
}, [isPending, session, pathname, router])

  const menuItems = menuItemsByRole[role]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-white/10 px-4 py-5">
        <Link href="/" className="text-2xl font-bold text-white">
          Repair<span className="text-amber-500">Lagbe</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-[#102A43] text-white">
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={pathname === item.url}
                  className="h-11 text-sm"
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}

            <SidebarMenuItem>
              <SidebarMenuButton
                render={<Link href="/dashboard/profile" />}
                isActive={pathname === "/dashboard/profile"}
                className="h-11 text-sm"
              >
                <UserRound />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#102A43]" />
    </Sidebar>
  )
}
