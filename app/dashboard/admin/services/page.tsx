
import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  XCircle,
  Wrench,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronDown,
  Filter,
} from "lucide-react"

import { getAdminServices } from "@/lib/api/user"
import { updateServiceApproval } from "@/lib/actions/services"
import type { ApprovalStatus, IAdminService } from "@/lib/types/admin"

const filters = [
  { label: "All Services", value: "all" as const },
  { label: "Pending", value: "pending" as const },
  { label: "Approved", value: "approved" as const },
  { label: "Rejected", value: "rejected" as const },
] as const

type FilterValue = (typeof filters)[number]["value"]

const formatPrice = (price?: number | string) => {
  if (price === undefined || price === null || price === "") return "—"

  const num = Number(price)
  if (!Number.isFinite(num)) return "—"

  return `৳${num.toLocaleString("en-BD")}`
}

const statusBadgeClasses = (status: ApprovalStatus) => {
  if (status === "approved") return "bg-green-50 text-green-700"
  if (status === "rejected") return "bg-red-50 text-red-600"
  return "bg-amber-50 text-amber-700"
}

const AdminServicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) => {
  const params = await searchParams

  const selectedStatus: FilterValue = filters.some(
    (filter) => filter.value === params.status
  )
    ? (params.status as FilterValue)
    : "all"

  let allServices: IAdminService[] = []
  let errorMessage = ""

  try {
    allServices = await getAdminServices()
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Failed to load services"
  }

  const services =
    selectedStatus === "all"
      ? allServices
      : allServices.filter(
          (service) => service.approvalStatus === selectedStatus
        )

  const pendingCount = allServices.filter(
    (service) => service.approvalStatus === "pending"
  ).length

  const approvedCount = allServices.filter(
    (service) => service.approvalStatus === "approved"
  ).length

  const rejectedCount = allServices.filter(
    (service) => service.approvalStatus === "rejected"
  ).length

  return (
    <div className="min-h-full space-y-7 bg-[var(--background)] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium text-[var(--primary)]">
          ADMIN PANEL / SERVICES
        </p>

        <h1 className="text-2xl font-bold text-[var(--primary)] sm:text-3xl">
          Service Approval
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Review technician services and manage their approval status.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Services */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Services</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--primary)]">
                {allServices.length}
              </h2>
            </div>

            <div className="rounded-lg bg-[var(--primary)]/10 p-3">
              <Wrench size={20} className="text-[var(--primary)]" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Pending Approval</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--accent)]">
                {pendingCount}
              </h2>
            </div>

            <div className="rounded-lg bg-[var(--accent)]/10 p-3">
              <Clock size={20} className="text-[var(--accent)]" />
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Approved</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--primary)]">
                {approvedCount}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3">
              <CheckCircle2 size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Rejected</p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--primary)]">
                {rejectedCount}
              </h2>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <XCircle size={20} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Dropdown */}
      <div className="flex items-center gap-3">
        <details className="group relative">
          <summary className="flex h-10 cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-[#102A43] shadow-sm transition hover:border-[#167D9A]">
            <Filter size={16} className="text-[#167D9A]" />
            Filter
            <ChevronDown
              size={16}
              className="transition-transform group-open:rotate-180"
            />
          </summary>

          <div className="absolute left-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg">
            {filters.map((filter) => {
              const isActive = selectedStatus === filter.value

              return (
                <Link
                  key={filter.value}
                  href={
                    filter.value === "all"
                      ? "/dashboard/admin/services"
                      : `/dashboard/admin/services?status=${filter.value}`
                  }
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? "bg-[#167D9A]/10 text-[#167D9A]"
                      : "text-[#102A43] hover:bg-slate-50"
                  }`}
                >
                  {filter.label}

                  {isActive && (
                    <CheckCircle2 size={15} className="text-[#167D9A]" />
                  )}
                </Link>
              )
            })}
          </div>
        </details>

        <span className="text-sm text-slate-500">
          Showing:{" "}
          <span className="font-semibold text-[#102A43]">
            {filters.find((filter) => filter.value === selectedStatus)?.label}
          </span>
        </span>
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Services */}
      {errorMessage ? null : services.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Wrench className="mx-auto mb-4 text-slate-400" size={40} />

          <h3 className="text-lg font-bold text-[var(--primary)]">
            No services found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            There are no services in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Wrench size={32} className="opacity-50" />
                  </div>
                )}
              </div>

              <div className="space-y-4 p-5">
                {/* Title and Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="line-clamp-1 font-bold text-[var(--primary)]">
                      {service.title}
                    </h2>

                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {service.category}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${statusBadgeClasses(service.approvalStatus)}`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>

                {/* Service Information */}
                <div className="space-y-2 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <Wrench size={13} className="text-slate-400" />
                    {service.technicianName}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-slate-400" />
                    {service.serviceArea}
                  </p>

                  <p className="flex items-center gap-2">
                    <Calendar size={13} className="text-slate-400" />
                    {new Date(service.createdAt).toLocaleDateString()}
                  </p>

                  <p className="mt-2 flex items-center gap-2 font-semibold text-[var(--primary)]">
                    <IndianRupee size={13} />
                    {formatPrice(service.basePrice ?? service.price)}
                  </p>
                </div>

                {/* Technician Email */}
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-400">
                    Technician: {service.technicianEmail}
                  </p>
                </div>

                {/* Pending: Approve + Reject */}
                {service.approvalStatus === "pending" && (
                  <div className="mt-4 flex items-center gap-3">
                    <form action={updateServiceApproval} className="flex-1">
                      <input
                        type="hidden"
                        name="id"
                        value={service._id}
                      />
                      <input
                        type="hidden"
                        name="approvalStatus"
                        value="approved"
                      />

                      <button
                        type="submit"
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#167D9A] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#12677F] hover:shadow-md active:scale-[0.98]"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                    </form>

                    <form action={updateServiceApproval} className="flex-1">
                      <input
                        type="hidden"
                        name="id"
                        value={service._id}
                      />
                      <input
                        type="hidden"
                        name="approvalStatus"
                        value="rejected"
                      />

                      <button
                        type="submit"
                        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 active:scale-[0.98]"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </form>
                  </div>
                )}

                {/* Approved: Reject only */}
                {service.approvalStatus === "approved" && (
                  <form action={updateServiceApproval} className="mt-4">
                    <input
                      type="hidden"
                      name="id"
                      value={service._id}
                    />
                    <input
                      type="hidden"
                      name="approvalStatus"
                      value="rejected"
                    />

                    <button
                      type="submit"
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 active:scale-[0.98]"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                  </form>
                )}

                {/* Rejected: Approve only */}
                {service.approvalStatus === "rejected" && (
                  <form action={updateServiceApproval} className="mt-4">
                    <input
                      type="hidden"
                      name="id"
                      value={service._id}
                    />
                    <input
                      type="hidden"
                      name="approvalStatus"
                      value="approved"
                    />

                    <button
                      type="submit"
                      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#167D9A] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#12677F] hover:shadow-md active:scale-[0.98]"
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminServicesPage
