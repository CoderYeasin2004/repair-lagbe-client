
"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import {
  CheckCircle,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Search,
  ClipboardList,
  Wrench,
  CreditCard,
  Smartphone,
  Laptop,
  Snowflake,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  MapPin,
  Clock3,
  LoaderCircle,
  BadgeCheck,
} from "lucide-react"

import { getServices } from "@/lib/api/services"
import { HomePageSkeleton } from "@/components/home-page-skeleton"

const HERO_IMAGES = [
  { src: "/assets/img-1.png", alt: "Technician repairing a smartphone" },
  { src: "/assets/img-2.png", alt: "Technician servicing an air conditioner" },
  { src: "/assets/img-3.png", alt: "Technician fixing a refrigerator" },
  { src: "/assets/img-4.png", alt: "Technician repairing a television" },
] as const

interface Service {
  _id: string
  title: string
  category: string
  imageUrl?: string
  image?: string
  price?: number
  basePrice?: number
  serviceMode?: string
  serviceArea?: string
  duration?: string
  estimatedDuration?: string
  technicianName?: string
  approvalStatus?: string
  isAvailable?: boolean | string
}

const TrustBadge = ({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground shadow-sm">
    <Icon size={14} strokeWidth={2} />
    <span>{label}</span>
  </div>
)

const HeroCarousel = () => {
  return (
    <div className="h-[470px] w-full max-w-[720px] self-center overflow-hidden rounded-2xl shadow-lg sm:h-[560px] lg:h-[560px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation
        pagination={{ clickable: true }}
        className="h-full w-full"
      >
        {HERO_IMAGES.map((image, index) => (
          <SwiperSlide
            key={index}
            className="relative h-full w-full flex-shrink-0 overflow-hidden rounded-2xl"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

const CATEGORIES = [
  { name: "Smartphone", icon: Smartphone, value: "Smartphone" },
  { name: "Laptop & PC", icon: Laptop, value: "Laptop & PC" },
  { name: "AC", icon: Snowflake, value: "AC" },
  { name: "Refrigerator", icon: Refrigerator, value: "Refrigerator" },
  { name: "TV", icon: Tv, value: "TV" },
  { name: "Washing Machine", icon: WashingMachine, value: "Washing Machine" },
  { name: "Electrical", icon: Zap, value: "Electrical" },
]

const STEPS = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse repair services and choose the one that matches your needs.",
    icon: Search,
  },
  {
    number: "02",
    title: "Send a Request",
    description:
      "Share your problem, address and preferred date with the technician.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description:
      "The technician accepts your request and completes the repair job.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Once the repair is completed, pay for your service online.",
    icon: CreditCard,
  },
]

const WHY_CHOOSE_US = [
  {
    title: "Verified Technicians",
    description:
      "Find technicians with service listings reviewed by the platform.",
    icon: BadgeCheck,
  },
  {
    title: "Transparent Pricing",
    description:
      "View the starting price before sending your repair request.",
    icon: CheckCircle,
  },
  {
    title: "Track Your Repair",
    description:
      "Follow your booking through each repair status.",
    icon: ClipboardList,
  },
  {
    title: "Pay After Service",
    description:
      "Pay online only after the technician completes the job.",
    icon: ShieldCheck,
  },
]

function formatCategory(category: string) {
  const categoryMap: Record<string, string> = {
    ac: "AC",
    smartphone: "Smartphone",
    laptop: "Laptop & PC",
    "laptop & pc": "Laptop & PC",
    refrigerator: "Refrigerator",
    tv: "TV",
    "washing machine": "Washing Machine",
    electrical: "Electrical",
  }

  return categoryMap[category.toLowerCase()] || category
}

function formatServiceMode(mode?: string) {
  if (mode === "home" || mode === "Home Visit") return "Home Visit"
  if (mode === "shop" || mode === "Shop Drop-off") return "Shop Drop-off"
  return mode || "Service"
}

function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFeaturedServices = async () => {
      try {
        setLoading(true)
        setError("")

        const data = await getServices("featured=true")

        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load featured services"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedServices()
  }, [])

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-[#167D9A]">
              Our Services
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              Featured Repair Services
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Explore available repair services from our technicians.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#167D9A] transition-colors hover:text-[#102A43]"
          >
            View All Services
            <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <LoaderCircle className="size-8 animate-spin text-[#167D9A]" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-[#F5F7FA] px-6 py-16 text-center">
            <Wrench className="mx-auto size-10 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-[#102A43]">
              No Featured Services Yet
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Approved and available services will appear here.
            </p>
            <Link
              href="/services"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#167D9A] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0f5f7a]"
            >
              Browse Services
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-52 w-full shrink-0 bg-slate-100">
                  {service.imageUrl || service.image ? (
                    <Image
                      src={(service.imageUrl || service.image)!}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Wrench className="size-12 text-slate-300" />
                    </div>
                  )}

                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-[#167D9A] shadow-sm">
                    {formatCategory(service.category)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex-1">
                    <h3 className="line-clamp-1 text-lg font-bold text-[#102A43]">
                      {service.title}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                      <Wrench className="size-4 text-[#167D9A]" />
                      <span>{formatServiceMode(service.serviceMode)}</span>
                    </div>

                    {service.serviceArea && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin className="size-4 text-[#167D9A]" />
                        <span className="line-clamp-1">
                          {service.serviceArea}
                        </span>
                      </div>
                    )}

                    {service.technicianName && (
                      <p className="mt-3 text-sm text-slate-600">
                        Technician:{" "}
                        <span className="font-semibold text-[#102A43]">
                          {service.technicianName}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Starting from</p>
                      <p className="text-xl font-bold text-[#167D9A]">
                        ৳{(service.price ?? service.basePrice ?? 0).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#167D9A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0f5f7a]"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading then render the page
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timeout)
  }, [])

  return isLoading ? (
    <HomePageSkeleton />
  ) : (
    <main className="min-w-0 overflow-x-hidden">
      {/* Existing Hero Section */}
      <section className="bg-[#F5F7FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-12 lg:pb-40 lg:pt-32">
            <div className="space-y-6 lg:pr-8">
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#167D9A]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#167D9A]">
                Verified Repair Technicians
              </div>

              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-[#102A43] sm:text-5xl lg:text-6xl">
                Broken Device? Get It Fixed by Verified Technicians.
              </h1>

              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Find trusted technicians for smartphone, laptop, AC,
                refrigerator, TV, and other appliance repairs. Transparent
                pricing, verified pros, and easy booking.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#167D9A] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0f5f7a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  Explore Services
                  <ArrowRight size={18} strokeWidth={2} className="ml-2" />
                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-[#102A43] transition-colors hover:bg-[#102A43]/5 hover:text-[#167D9A] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  How It Works
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                <TrustBadge
                  icon={CheckCircle}
                  label="500+ Verified Technicians"
                />
                <TrustBadge
                  icon={ShieldCheck}
                  label="1-Year Service Warranty"
                />
                <TrustBadge
                  icon={Headphones}
                  label="24/7 Customer Support"
                />
              </div>
            </div>

            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* Dynamic Featured Services */}
      <FeaturedServices />

      {/* How It Works */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#167D9A]">
              Simple Process
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              How RepairLagbe Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Getting your device repaired is simple. Follow four easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => {
              const Icon = step.icon

              return (
                <div
                  key={step.number}
                  className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex size-14 items-center justify-center rounded-xl bg-[#167D9A]/10 text-[#167D9A]">
                      <Icon size={27} strokeWidth={1.8} />
                    </div>
                    <span className="text-3xl font-bold text-[#167D9A]/20">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-[#102A43]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#167D9A]">
              Explore Categories
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              What Do You Need to Repair?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Choose a category to find the right repair service.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((category) => {
              const Icon = category.icon

              return (
                <Link
                  key={category.value}
                  href={`/services?category=${encodeURIComponent(category.value)}`}
                  className="group flex min-h-36 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-[#F5F7FA] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#167D9A]/40 hover:bg-[#167D9A]/5 hover:shadow-md"
                >
                  <div className="flex size-14 items-center justify-center rounded-xl bg-white text-[#167D9A] shadow-sm transition-colors group-hover:bg-[#167D9A] group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-[#102A43]">
                    {category.name}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#167D9A]">
                    Explore
                    <ArrowRight size={13} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose RepairLagbe */}
      <section className="bg-[#102A43] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-[#F59E0B]">
              Why RepairLagbe
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Repair Service You Can Trust
            </h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              A clear and convenient way to connect with repair technicians
              and manage your repair journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#167D9A]/60 hover:bg-white/10"
                >
                  <div className="flex size-14 items-center justify-center rounded-xl bg-[#167D9A]/20 text-[#45B5D1]">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  <h3 className="mt-6 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#167D9A] to-[#102A43] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Fix What&apos;s Broken?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/80">
            Find a suitable repair service and send your request to get started.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-7 py-3.5 text-sm font-bold text-[#102A43] shadow-lg transition-all hover:bg-amber-400 hover:shadow-xl"
          >
            Browse Services
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  )
}
