import Link from "next/link"
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Clock3,
  ArrowUpRight,
  Wrench,
} from "lucide-react"

import { getServices } from "@/lib/api/services"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ServiceImage from "./_components/ServiceImage"
import ServiceSearch from "./_components/ServiceSearch"
import ServiceFilter from "./_components/ServiceFilter"
import { redirect } from "next/dist/server/api-utils"
import ViewDetailsButton from "../components/ServiceViewDetails"

interface IServicesSearchParams {
  [key: string]: string | string[] | undefined
}
interface IService {
  _id: string
  title: string
  category: string
  description: string
  imageUrl?: string
  price?: string | number
  basePrice?: string | number
  duration: string
  serviceMode: string
  serviceArea: string
}

const categoryOptions = [
  { value: "smartphone", label: "Smartphone" },
  { value: "laptop-pc", label: "Laptop & PC" },
  { value: "ac", label: "AC" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "tv", label: "TV" },
  { value: "washing-machine", label: "Washing Machine" },
  { value: "electrical", label: "Electrical" },
]

const getQueryValue = (value: string | string[] | undefined): string => {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

const getCategoryLabel = (category: string): string => {
  const matchedCategory = categoryOptions.find(
    (option) => option.value === category
  )

  return matchedCategory?.label ?? category
}

const getServiceModeLabel = (serviceMode: string): string => {
  if (serviceMode === "home") return "Home Visit"
  if (serviceMode === "shop") return "Shop Drop-off"

  return serviceMode
}

const ServicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<IServicesSearchParams>
}) => {
  const params = await searchParams

  const queryParams = new URLSearchParams()

  const searchQuery = getQueryValue(params.search)
  const selectedCategory = getQueryValue(params.category)
  const selectedServiceMode = getQueryValue(params.serviceMode)
  const selectedSort = getQueryValue(params.sort)

  if (searchQuery) queryParams.set("search", searchQuery)
  if (selectedCategory) queryParams.set("category", selectedCategory)
  if (selectedServiceMode) queryParams.set("serviceMode", selectedServiceMode)
  if (selectedSort) queryParams.set("sort", selectedSort)

  const services: IService[] = await getServices(queryParams.toString())



  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Page Heading */}
        <section className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="transition hover:text-[#167D9A]">
              Home
            </Link>
            <span>/</span>
            <span className="font-medium text-[#102A43]">Services</span>
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <Badge className="mb-3 border-0 bg-[#167D9A]/10 text-[#167D9A] hover:bg-[#167D9A]/10">
                Repair services
              </Badge>

              <h1 className="text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
                Find the Right Repair Service
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Browse trusted repair services for your devices and home
                appliances. Find the right technician for your needs.
              </p>
            </div>

            <div className="text-sm font-medium text-slate-500">
              {services.length} services found
            </div>
          </div>
        </section>

        {/* Search and Filters */}
       {/* Search and Filters */}
<section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
  <form action="/services" method="GET">
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">

      {/* Search Component */}
      <ServiceSearch searchQuery={searchQuery} />

      {/* Filter Component */}
      <ServiceFilter
        selectedCategory={selectedCategory}
        selectedServiceMode={selectedServiceMode}
        selectedSort={selectedSort}
      />

      {/* Actions */}
      <div className="flex items-end gap-2">
        <button
          type="submit"
          className="h-11 flex-1 rounded-md bg-[#167D9A] px-5 text-white hover:bg-[#12677F]"
        >
          <SlidersHorizontal className="mr-2 inline size-4" />
          Apply
        </button>

        <Link
          href="/services"
          className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 px-4 text-sm font-medium transition hover:bg-slate-100"
        >
          Clear
        </Link>
      </div>

    </div>
  </form>
</section>

        {/* Services Grid */}
        {services.length > 0 ? (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#102A43]">
                Available Services
              </h2>
              <span className="text-sm text-slate-500">
                Showing {services.length} results
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service._id}
                  className="group flex h-full flex-col overflow-hidden border-slate-200 bg-white py-0 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative">
                    <ServiceImage src={service.imageUrl} alt={service.title} />

                    <Badge className="absolute top-4 left-4 border-0 bg-white/95 text-[#102A43] shadow-sm hover:bg-white">
                      {getCategoryLabel(service.category)}
                    </Badge>
                  </div>

                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-[#167D9A]">
                        {getServiceModeLabel(service.serviceMode)}
                      </span>

                      <span className="text-xs text-slate-500">
                        <Clock3 className="mr-1 inline size-3.5" />
                        {service.duration}
                      </span>
                    </div>

                    <h3 className="line-clamp-1 text-lg font-bold text-[#102A43] transition group-hover:text-[#167D9A]">
                      {service.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                      {service.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                      <MapPin className="size-4 shrink-0 text-[#167D9A]" />
                      <span className="line-clamp-1">
                        {service.serviceArea}
                      </span>
                    </div>

                    <div className="mt-5 mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs text-slate-500">Starting price</p>
                        <p className="mt-1 text-xl font-bold text-[#102A43]">
                          ৳{Number(service.basePrice ?? service.price ?? 0).toLocaleString("en-BD")}
                        </p>
                      </div>

                     {/* View Details Button */}
                     <ViewDetailsButton serviceId={service._id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          /* Empty State */
          <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#167D9A]/10">
              <Wrench className="size-8 text-[#167D9A]" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#102A43]">
              No Services Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              We couldn&apos;t find any services matching your search or
              selected filters. Try changing your search criteria.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-[#167D9A] px-4 text-sm font-medium text-white transition hover:bg-[#12677F]"
            >
              Clear All Filters
            </Link>
          </section>
        )}
      </div>
    </main>
  )
}

export default ServicesPage
