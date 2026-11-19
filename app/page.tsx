"use client"

import Link from "next/link"
import Image from "next/image"
import React from "react"
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
} from "lucide-react"

const HERO_IMAGES = [
  { src: "/assets/img-1.png", alt: "Technician repairing a smartphone" },
  { src: "/assets/img-2.png", alt: "Technician servicing an air conditioner" },
  { src: "/assets/img-3.png", alt: "Technician fixing a refrigerator" },
  { src: "/assets/img-4.png", alt: "Technician repairing a television" },
] as const

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
    <div className="w-full max-w-[720px] h-[470px] sm:h-[560px] lg:h-[560px] self-center rounded-2xl overflow-hidden shadow-lg">
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
        className="w-full h-full"
      >
        {HERO_IMAGES.map((image, index) => (
          <SwiperSlide key={index} className="relative w-full h-full flex-shrink-0 overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 720px"
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default function HomePage() {
  return (
    <section className="bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center py-20 sm:py-24 lg:pt-32 lg:pb-40"
        >
          {/* Hero content */}
          <div className="space-y-6 lg:pr-8">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#167D9A]/10 px-3 py-1.5 text-xs font-semibold text-[#167D9A] uppercase tracking-wider">
              Verified Repair Technicians
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#102A43] leading-[1.1]">
              Broken Device? Get It Fixed by Verified Technicians.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Find trusted technicians for smartphone, laptop, AC, refrigerator,
              TV, and other appliance repairs. Transparent pricing, verified
              pros, and easy booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#167D9A] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0f5f7a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                Explore Services
                <ArrowRight size={18} strokeWidth={2} className="ml-2" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-[#102A43] hover:bg-[#102A43]/5 hover:text-[#167D9A] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
          {/* Hero illustration */}
          <HeroCarousel />
        </div>
      </div>
    </section>
  )
}
