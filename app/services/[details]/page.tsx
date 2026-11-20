import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wrench,
  UserRound,
  Tag,
  CalendarCheck,
} from "lucide-react"

import { getServiceById } from "@/lib/api/services"
import { RepairRequestButton } from "../_components/RepairRequestButton"

interface Service {
  _id: string
  title: string
  category: string
  description: string
  imageUrl?: string
  price: string | number
  duration: string
  serviceMode: string
  serviceArea: string
  technicianName?: string
  technicianEmail?: string
  approvalStatus?: string
  availability?: string
  isAvailable?: boolean
}

interface ServiceDetailsPageProps {
  params: Promise<{
    details: string
  }>
}

const ServiceDetailsPage = async ({ params }: ServiceDetailsPageProps) => {
  const { details } = await params

  const service: Service | null = await getServiceById(details)

  if (!service) {
    notFound()
  }

  // Only approved and available services are publicly accessible.
  if (
    service.approvalStatus !== "approved" ||
    service.isAvailable === false ||
    service.availability === "unavailable"
  ) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#167D9A] hover:text-[#102A43]"
        >
          <ArrowLeft className="size-4" />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Service Information */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="h-[280px] w-full object-cover sm:h-[420px]"
                />
              ) : (
                <div className="flex h-[280px] items-center justify-center bg-slate-200 sm:h-[420px]">
                  <Wrench className="size-16 text-slate-400" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#167D9A]/10 px-4 py-1.5 text-sm font-semibold text-[#167D9A]">
                  {service.category}
                </span>

                <span className="rounded-full bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-700">
                  {service.serviceMode}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-[#102A43] sm:text-3xl">
                {service.title}
              </h1>

              <div className="my-6 grid grid-cols-1 gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-[#167D9A]/10 p-3">
                    <Tag className="size-5 text-[#167D9A]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Starting Price</p>
                    <p className="font-bold text-[#102A43]">
                      ৳{Number(service.price).toLocaleString("en-BD")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-50 p-3">
                    <Clock className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Estimated Duration</p>
                    <p className="font-bold text-[#102A43]">
                      {service.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <MapPin className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Service Area</p>
                    <p className="font-bold text-[#102A43]">
                      {service.serviceArea}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="mb-3 text-xl font-bold text-[#102A43]">
                Service Description
              </h2>

              <p className="leading-7 text-slate-600">{service.description}</p>
            </div>
          </div>

          {/* Technician and Request Information */}
          <aside className="space-y-6">
            {/* Technician Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#167D9A]/10 p-3">
                  <UserRound className="size-6 text-[#167D9A]" />
                </div>

                <h2 className="text-xl font-bold text-[#102A43]">
                  Technician Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Technician Name</p>
                  <p className="font-semibold text-[#102A43]">
                    {service.technicianName || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Service Area</p>
                  <p className="font-semibold text-[#102A43]">
                    {service.serviceArea}
                  </p>
                </div>

                {service.technicianEmail && (
                  <div>
                    <p className="text-sm text-slate-500">Technician Email</p>
                    <p className="font-medium break-all text-[#102A43]">
                      {service.technicianEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Request Card */}
            <div className="rounded-2xl bg-[#102A43] p-6 text-white shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <CalendarCheck className="size-6 text-[#F59E0B]" />
                <h2 className="text-xl font-bold">Need This Service?</h2>
              </div>

              <p className="mb-6 text-sm leading-6 text-slate-300">
                Get professional repair assistance from our technicians. Submit
                a repair request to get started.
              </p>

              <p className="text-sm text-slate-300">
                <RepairRequestButton
                  service={{
                    _id: service._id,
                    title: service.title,
                  }}
                />
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default ServiceDetailsPage
