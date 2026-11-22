import Link from "next/link"
import {
  AlertCircle,
  Ban,
  Building2,
  CheckCircle,
  Clock,
  LayoutDashboard,
  MapPin,
  Plus,
  Tag,
  Eye,
  Edit,
  Wrench as WrenchIcon,
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
import { DeleteDialouge } from "../../../components/DeleteDialouge"
import { cn } from "@/lib/utils"
import { getServices } from "@/lib/api/services"
import { getSession } from "@/lib/core/server"

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

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  smartphone: "Smartphone",
  "laptop-pc": "Laptop & PC",
  ac: "Air Conditioner",
  refrigerator: "Refrigerator",
  tv: "TV",
  "washing-machine": "Washing Machine",
  electrical: "Electrical",
}

const MODE_LABELS: Record<ServiceMode, string> = {
  home: "Home Visit",
  shop: "Shop Drop-off",
}

const getApprovalConfig = (status: ApprovalStatus) => {
  const config: Record<ApprovalStatus, { label: string; className: string }> = {
    approved: {
      label: "Approved",
      className: "border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]",
    },
    pending: {
      label: "Pending Approval",
      className: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#F59E0B]",
    },
    rejected: {
      label: "Rejected",
      className: "border-border bg-muted text-muted-foreground",
    },
  }
  return config[status]
}

const getAvailabilityConfig = (availability: Availability) => {
  const config: Record<Availability, { label: string; className: string }> = {
    available: {
      label: "Available",
      className: "border-[#167D9A]/20 bg-[#167D9A]/10 text-[#167D9A]",
    },
    unavailable: {
      label: "Unavailable",
      className: "border-border bg-muted text-muted-foreground",
    },
  }
  return config[availability]
}

const formatPrice = (price: number) => `৳${price}`

const handleEdit = (id: string) => {
  // UI-only action placeholder
  console.log(`Edit service: ${id}`)
}

const ServiceCard = ({ service }: { service: Service }) => {
  const approval = getApprovalConfig(service.approvalStatus ?? "pending")

  const availability = getAvailabilityConfig(
    service.availability ?? "available"
  )
  const categoryLabel = CATEGORY_LABELS[service.category]
  const modeLabel = MODE_LABELS[service.serviceMode]

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-sm">
      <div className="relative h-48 overflow-hidden">
        {service.imageUrl ? (
          <img src={service.imageUrl} alt={service.title} />
        ) : (
          <div className="flex h-48 items-center justify-center bg-slate-100">
            <Wrench className="h-12 w-12 text-slate-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className={approval.className}>
            {approval.label}
          </Badge>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="leading-snug font-semibold text-[#102A43]">
              {service.title}
            </h3>
            <Badge variant="outline" className="mt-1 text-xs">
              {categoryLabel}
            </Badge>
          </div>
          <Badge variant="outline" className={availability.className}>
            {availability.label}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Tag className="size-4" />
            <span>{formatPrice(service.price)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="size-4" />
            <span>{modeLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>{service.serviceArea}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-end gap-2">


  <Button variant="outline" size="sm">
    <Edit className="size-3.5" />
    Edit
  </Button>

  <DeleteDialouge
    serviceId={service._id}
    serviceTitle={service.title}
  />
</div>
      </CardFooter>
    </Card>
  )
}

const SummaryCard = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType
  label: string
  value: number
  className?: string
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="size-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-[#102A43]">{value}</div>
      </CardContent>
    </Card>
  )
}

const EmptyState = () => (
  <Card className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 flex size-16 items-center justify-center rounded-xl bg-[#167D9A]/10 text-[#167D9A]">
      <WrenchIcon className="size-8" />
    </div>
    <h3 className="text-lg font-semibold text-[#102A43]">No services yet</h3>
    <p className="mt-1 max-w-xs text-center text-muted-foreground">
      You haven&lsquo;t listed any repair services yet. Add your first service
      to start receiving customer requests.
    </p>
    <Link href="/dashboard/technician/add-service">
      <Button className="mt-6 bg-[#167D9A] text-white shadow-sm hover:bg-[#0f5f7a]">
        Add New Service
      </Button>
    </Link>
  </Card>
)

export default async function MyServicesPage() {
  const userSession = await getSession()
  const technicianEmail = userSession?.user?.email

  const servicesData = technicianEmail
    ? await getServices(
        `technicianEmail=${encodeURIComponent(technicianEmail)}`
      )
    : []

  const services: Service[] = servicesData

  const totalServices = services.length
  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length
  const pendingServices = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length
  const unavailableServices = services.filter(
    (service) => service.availability === "unavailable"
  ).length

  const hasServices = services.length > 0

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
            <Link
              href="/dashboard/technician"
              className="transition-colors hover:text-[#167D9A]"
            >
              Dashboard
            </Link>
            <span className="mx-1">/</span>
            <span className="font-medium text-foreground">My Services</span>
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#102A43]">
                My Services
              </h1>
              <p className="mt-1 text-muted-foreground">
                Manage your listed repair services. View, edit, or remove
                services at any time.
              </p>
            </div>

            <Link href="/dashboard/technician/add-service">
              <Button className="bg-[#167D9A] text-white shadow-sm hover:bg-[#0f5f7a]">
                <Plus className="size-4" />
                Add New Service
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            icon={LayoutDashboard}
            label="Total Services"
            value={totalServices}
          />
          <SummaryCard
            icon={CheckCircle}
            label="Approved Services"
            value={approvedServices}
          />
          <SummaryCard
            icon={AlertCircle}
            label="Pending Approval"
            value={pendingServices}
          />
          <SummaryCard
            icon={Ban}
            label="Unavailable Services"
            value={unavailableServices}
          />
        </div>

        {/* Service Management */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#102A43]">
                Your Services
              </h2>
              <p className="text-muted-foreground">
                All your listed services and their current status.
              </p>
            </div>
          </div>

          {hasServices ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>
    </div>
  )
}
