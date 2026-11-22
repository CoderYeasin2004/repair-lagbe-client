"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import {
  AlertCircle,
  CheckCircle,
  Clock,
  LayoutDashboard,
  Plus,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getServices, getMyBookingCounts } from "@/lib/api/services"

type ServiceCategory =
  | "smartphone"
  | "laptop-pc"
  | "ac"
  | "refrigerator"
  | "tv"
  | "washing-machine"
  | "electrical"

type ServiceMode = "home" | "shop"
type ApprovalStatus = "approved" | "pending" | "rejected"
type Availability = "available" | "unavailable"

interface Service {
  _id: string
  title: string
  category: ServiceCategory
  imageUrl: string
  price: number
  duration: string
  serviceMode: ServiceMode
  serviceArea: string
  approvalStatus: ApprovalStatus
  availability: Availability
}

type StatVariant = "teal" | "amber" | "navy"

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: number | string
  subtitle: string
  variant: StatVariant
  href?: string
}

const STAT_VARIANT_CONFIG: Record<StatVariant, string> = {
  teal: "border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]",
  amber: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]",
  navy: "border-[#102A43]/20 bg-[#102A43]/10 text-[#102A43]",
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  subtitle,
  variant,
  href,
}: StatCardProps) => {
  return (
    <Card
      className={cn("group overflow-hidden transition-shadow hover:shadow-sm")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            STAT_VARIANT_CONFIG[variant]
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#102A43]">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
      {href ? (
        <CardFooter className="pt-3">
          <Link href={href}>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </CardFooter>
      ) : null}
    </Card>
  )
}

const TechnicianDashboardPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingRequests, setPendingRequests] = useState(0)
  const { data: session, isPending } = useSession()

  const currentDate = format(new Date(), "dd MMM, yyyy")

  useEffect(() => {
    if (isPending) return

    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)

        const technicianEmail = session?.user?.email

        if (!technicianEmail) {
          setServices([])
          setPendingRequests(0)
          return
        }

        const counts = await getMyBookingCounts(technicianEmail, "technician")
        setPendingRequests(counts.pendingRequests ?? 0)

        const data = await getServices(
          `technicianEmail=${encodeURIComponent(technicianEmail)}`
        )

        setServices(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch services"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [session, isPending])

  const totalServices = services.length
  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#102A43]">
                  Welcome Back, Technician!
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Manage your repair services and keep track of customer
                  requests.
                </p>
              </div>

              <Badge className="border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]">
                {currentDate}
              </Badge>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard
              icon={Wrench}
              label="Total Services"
              value="--"
              subtitle="All listed services"
              variant="teal"
              href="/dashboard/technician/my-services"
            />
            <StatCard
              icon={CheckCircle}
              label="Approved Services"
              value="--"
              subtitle="Visible to customers"
              variant="teal"
              href="/dashboard/technician/my-services"
            />
            <StatCard
              icon={Clock}
              label="Pending Requests"
              value="--"
              subtitle="Waiting for your response"
              variant="amber"
              href="/dashboard/technician/requests"
            />
          </div>

          <section className="mb-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Quick Actions
                </h2>
                <p className="text-muted-foreground">
                  Common tasks to manage your technician dashboard.
                </p>
              </div>

              <Link href="/dashboard/technician/add-service">
                <Button className="bg-[#167D9A] text-white shadow-sm hover:bg-[#0f5f7a]">
                  <Plus className="size-4" />
                  Add New Service
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">
                        Add New Service
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        List a new repair service for customers.
                      </p>
                    </div>
                    <LayoutDashboard className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/technician/add-service">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to Add Service
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">
                        My Services
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        View and manage your listed services.
                      </p>
                    </div>
                    <Wrench className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/technician/my-services">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to My Services
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">
                        Pending Requests
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Respond to customer service requests.
                      </p>
                    </div>
                    <Clock className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/technician/requests">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to Requests
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your technician profile details.
                      </p>
                    </div>
                    <AlertCircle className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to Profile
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#102A43]">
                  Welcome Back, Technician!
                </h1>
                <p className="mt-1 text-muted-foreground">
                  Manage your repair services and keep track of customer
                  requests.
                </p>
              </div>

              <Badge className="border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]">
                {currentDate}
              </Badge>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <StatCard
              icon={Wrench}
              label="Total Services"
              value="--"
              subtitle="All listed services"
              variant="teal"
              href="/dashboard/technician/my-services"
            />
            <StatCard
              icon={CheckCircle}
              label="Approved Services"
              value="--"
              subtitle="Visible to customers"
              variant="teal"
              href="/dashboard/technician/my-services"
            />
            <StatCard
              icon={Clock}
              label="Pending Requests"
              value="--"
              subtitle="Waiting for your response"
              variant="amber"
              href="/dashboard/technician/requests"
            />
          </div>

          <div className="mb-10 rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-destructive">
            <h3 className="font-semibold text-[#102A43]">
              Failed to load services
            </h3>
            <p className="mt-1 text-sm">{error}</p>
          </div>

          <section className="mb-10">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">
                  Quick Actions
                </h2>
                <p className="text-muted-foreground">
                  Common tasks to manage your technician dashboard.
                </p>
              </div>

              <Link href="/dashboard/technician/add-service">
                <Button className="bg-[#167D9A] text-white shadow-sm hover:bg-[#0f5f7a]">
                  <Plus className="size-4" />
                  Add New Service
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">
                        Add New Service
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        List a new repair service for customers.
                      </p>
                    </div>
                    <LayoutDashboard className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/technician/add-service">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to Add Service
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">
                        My Services
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        View and manage your listed services.
                      </p>
                    </div>
                    <Wrench className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/technician/my-services">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to My Services
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">
                        Pending Requests
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Respond to customer service requests.
                      </p>
                    </div>
                    <Clock className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/technician/requests">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to Requests
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card className="transition-shadow hover:shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-[#102A43]">Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Update your technician profile details.
                      </p>
                    </div>
                    <AlertCircle className="size-5 text-muted-foreground" />
                  </div>
                </CardContent>
                <CardFooter className="pt-3">
                  <Link href="/dashboard/profile">
                    <Button variant="outline" size="sm" className="w-full">
                      Go to Profile
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#102A43]">
                Welcome Back, Technician!
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your repair services and keep track of customer requests.
              </p>
            </div>

            <Badge className="border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]">
              {currentDate}
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <StatCard
            icon={Wrench}
            label="Total Services"
            value={totalServices}
            subtitle="All listed services"
            variant="teal"
            href="/dashboard/technician/my-services"
          />
          <StatCard
            icon={CheckCircle}
            label="Approved Services"
            value={approvedServices}
            subtitle="Visible to customers"
            variant="teal"
            href="/dashboard/technician/my-services"
          />
          <StatCard
            icon={Clock}
            label="Pending Requests"
            value={pendingRequests}
            subtitle="Waiting for your response"
            variant="amber"
            href="/dashboard/technician/requests"
          />
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                Quick Actions
              </h2>
              <p className="text-muted-foreground">
                Common tasks to manage your technician dashboard.
              </p>
            </div>

            <Link href="/dashboard/technician/add-service">
              <Button className="bg-[#167D9A] text-white shadow-sm hover:bg-[#0f5f7a]">
                <Plus className="size-4" />
                Add New Service
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#102A43]">
                      Add New Service
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      List a new repair service for customers.
                    </p>
                  </div>
                  <LayoutDashboard className="size-5 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Link href="/dashboard/technician/add-service">
                  <Button variant="outline" size="sm" className="w-full">
                    Go to Add Service
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="transition-shadow hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#102A43]">
                      My Services
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      View and manage your listed services.
                    </p>
                  </div>
                  <Wrench className="size-5 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Link href="/dashboard/technician/my-services">
                  <Button variant="outline" size="sm" className="w-full">
                    Go to My Services
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="transition-shadow hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#102A43]">
                      Pending Requests
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Respond to customer service requests.
                    </p>
                  </div>
                  <Clock className="size-5 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Link href="/dashboard/technician/requests">
                  <Button variant="outline" size="sm" className="w-full">
                    Go to Requests
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="transition-shadow hover:shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-[#102A43]">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Update your technician profile details.
                    </p>
                  </div>
                  <AlertCircle className="size-5 text-muted-foreground" />
                </div>
              </CardContent>
              <CardFooter className="pt-3">
                <Link href="/dashboard/profile">
                  <Button variant="outline" size="sm" className="w-full">
                    Go to Profile
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

export default TechnicianDashboardPage
