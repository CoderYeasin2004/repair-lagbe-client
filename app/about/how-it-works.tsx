import Image from "next/image"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  CircleCheckBig,
  ClipboardList,
  CreditCard,
  Eye,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UserRound,
  Wrench,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

interface Step {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse approved repair services for phones, laptops, and home appliances, with clear starting prices and service areas.",
    icon: Search,
  },
  {
    number: "02",
    title: "Send a Repair Request",
    description:
      "Share your device details, preferred date, and address. Your chosen technician receives the request instantly.",
    icon: ClipboardList,
  },
  {
    number: "03",
    title: "Technician Fixes It",
    description:
      "The technician accepts the job, starts the work, and keeps the booking status updated from start to finish.",
    icon: Wrench,
  },
  {
    number: "04",
    title: "Pay After Completion",
    description:
      "Review the final amount once the repair is done, then pay securely through Stripe. No upfront charges.",
    icon: CreditCard,
  },
]

interface Benefit {
  title: string
  description: string
}

const CUSTOMER_BENEFITS: Benefit[] = [
  {
    title: "Browse repair services",
    description:
      "Explore verified listings with transparent starting prices and honest service details.",
  },
  {
    title: "Submit repair requests",
    description:
      "Tell the technician what is wrong, choose a date, and send your request in a few taps.",
  },
  {
    title: "Track repair progress",
    description:
      "Follow every update from requested to completed from your customer dashboard.",
  },
  {
    title: "Pay after job completion",
    description:
      "Only pay once the repair is finished, with a secure Stripe checkout.",
  },
]

const TECHNICIAN_BENEFITS: Benefit[] = [
  {
    title: "Register as a technician",
    description:
      "Create your technician profile and get approved to start receiving repair requests.",
  },
  {
    title: "Add repair services",
    description:
      "List the services you offer with pricing, duration, and the areas you cover.",
  },
  {
    title: "Manage customer requests",
    description:
      "Accept or reject requests, start work, and keep customers informed at every step.",
  },
  {
    title: "Complete jobs and set final prices",
    description:
      "Finish the job, set the final amount, and get paid securely after completion.",
  },
]

interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

const WHY_CHOOSE_US: Feature[] = [
  {
    title: "Approved service listings",
    description:
      "Every service is reviewed and approved before it goes live, so you always book with confidence.",
    icon: BadgeCheck,
  },
  {
    title: "Transparent repair process",
    description:
      "Clear steps, visible status updates, and no hidden surprises from request to payment.",
    icon: Eye,
  },
  {
    title: "Trackable booking status",
    description:
      "Know exactly where your repair stands at every stage with real-time status tracking.",
    icon: Activity,
  },
  {
    title: "Secure Stripe payment after completion",
    description:
      "Payments are processed safely through Stripe only after the repair is completed.",
    icon: ShieldCheck,
  },
]

/* -------------------------------------------------------------------------- */
/*                                 Sub-components                             */
/* -------------------------------------------------------------------------- */

const StepCard = ({ step }: { step: Step }) => {
  const Icon = step.icon

  return (
    <div
      data-number={step.number}
      className="group relative z-10 flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_2px_rgba(16,42,67,0.04)] transition-all duration-300 before:pointer-events-none before:absolute before:top-3 before:right-5 before:text-[3.25rem] before:leading-none before:font-semibold before:tracking-tighter before:text-[#102A43]/[0.055] before:transition-colors before:duration-300 before:content-[attr(data-number)] before:select-none after:pointer-events-none after:absolute after:inset-x-6 after:top-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[#167D9A]/50 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 hover:-translate-y-1.5 hover:border-[#167D9A]/30 hover:shadow-xl hover:shadow-[#102A43]/5 hover:before:text-[#167D9A]/10 hover:after:opacity-100 sm:p-7"
    >
      <div className="mb-6 flex size-12 items-center justify-center rounded-[14px] bg-[#167D9A]/10 text-[#167D9A] ring-1 ring-[#167D9A]/10 transition-all duration-300 group-hover:bg-[#167D9A] group-hover:text-white group-hover:ring-[#167D9A]/20">
        <Icon className="size-[22px]" />
      </div>

      <h3 className="text-[1.0625rem] font-semibold tracking-tight text-[#102A43]">
        {step.title}
      </h3>
      <p className="mt-2.5 text-sm leading-6 text-slate-600">
        {step.description}
      </p>
    </div>
  )
}

interface AudienceCardProps {
  title: string
  description: string
  icon: LucideIcon
  benefits: Benefit[]
  tone: "teal" | "amber"
}

const AudienceCard = ({
  title,
  description,
  icon: Icon,
  benefits,
  tone,
}: AudienceCardProps) => {
  const isTeal = tone === "teal"

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#102A43]/5 sm:p-9 lg:p-10",
        isTeal
          ? "border-[#167D9A]/20 hover:border-[#167D9A]/30"
          : "border-[#F59E0B]/25 hover:border-[#F59E0B]/40"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute -top-12 -right-12 size-44 rounded-full blur-3xl",
          isTeal ? "bg-[#167D9A]/10" : "bg-[#F59E0B]/15"
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent to-transparent",
          isTeal ? "via-[#167D9A]/30" : "via-[#F59E0B]/40"
        )}
      />

      <div className="relative">
        <div
          className={cn(
            "mb-6 flex size-12 items-center justify-center rounded-[14px] ring-1 transition-transform duration-300 group-hover:scale-105",
            isTeal
              ? "bg-[#167D9A]/10 text-[#167D9A] ring-[#167D9A]/10"
              : "bg-[#F59E0B]/15 text-[#B45309] ring-[#F59E0B]/20"
          )}
        >
          <Icon className="size-6" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-[#102A43]">
          {title}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-slate-600">{description}</p>

        <ul className="mt-7 divide-y divide-slate-100">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="flex gap-3.5 py-4 first:pt-0 last:pb-0"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ring-1",
                  isTeal
                    ? "bg-[#167D9A]/10 text-[#167D9A] ring-[#167D9A]/10"
                    : "bg-[#F59E0B]/15 text-[#B45309] ring-[#F59E0B]/20"
                )}
              >
                <CircleCheckBig className="size-4" />
              </span>
              <div>
                <p className="text-[15px] font-semibold text-[#102A43]">
                  {benefit.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {benefit.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const FeatureCard = ({ feature }: { feature: Feature }) => {
  const Icon = feature.icon

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#F59E0B]/30 hover:bg-white/[0.075] sm:p-7">
      <div
        aria-hidden="true"
        className="absolute -top-8 -right-8 size-24 rounded-full bg-[#F59E0B]/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">
        <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-[#FBBF24] ring-1 ring-[#F59E0B]/20 transition-transform duration-300 group-hover:scale-105">
          <Icon className="size-5" />
        </div>
        <h3 className="text-[15px] font-semibold tracking-tight text-white">
          {feature.title}
        </h3>
        <p className="mt-2.5 text-sm leading-6 text-slate-300">
          {feature.description}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

const HowItWorks = () => {
  return (
    <main className="bg-[#F5F7FA]">
      {/* -------------------------------- Hero -------------------------------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute top-10 -left-32 size-72 rounded-full bg-[#167D9A]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 size-80 rounded-full bg-[#F59E0B]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:gap-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">
          <div>
            <Badge className="h-auto gap-1.5 rounded-full border-0 bg-[#167D9A]/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#0F5F7A] uppercase">
              <Sparkles className="size-3.5" />
              Simple &amp; Hassle-Free
            </Badge>

            <h1 className="mt-7 text-4xl leading-[1.08] font-bold tracking-tight text-balance text-[#102A43] sm:text-5xl lg:text-[3.5rem]">
              How RepairLagbe Works
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-pretty text-slate-600 sm:text-lg sm:leading-8">
              Booking a repair has never been easier. Browse trusted services,
              send a request, and let a verified technician handle the rest. You
              only pay once the job is done.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3 border-t border-[#102A43]/10 pt-7 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-2 shadow-sm backdrop-blur">
                <ShieldCheck className="size-4 text-[#167D9A]" />
                Verified technicians
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3.5 py-2 shadow-sm backdrop-blur">
                <CreditCard className="size-4 text-[#167D9A]" />
                No upfront payment
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-5 rounded-[2.25rem] bg-gradient-to-br from-[#167D9A]/15 via-transparent to-[#F59E0B]/15 blur-2xl"
            />

            <div className="group/image relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] border border-white/70 bg-white shadow-2xl ring-1 shadow-[#102A43]/10 ring-[#102A43]/5 sm:aspect-[3/2]">
              <Image
                src="/assets/img-5.png"
                alt="Verified technician servicing a home appliance"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover/image:scale-[1.03]"
              />

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#102A43]/55 via-[#102A43]/5 to-transparent"
              />

              <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2 sm:inset-x-4 sm:bottom-4 sm:gap-2.5">
                <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 shadow-lg shadow-[#102A43]/10 backdrop-blur-md sm:gap-2.5 sm:px-3.5 sm:py-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#167D9A]/10 text-[#167D9A] sm:size-7">
                    <ShieldCheck className="size-3.5 sm:size-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-[#102A43] sm:text-xs">
                    Verified Technicians
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-2 shadow-lg shadow-[#102A43]/10 backdrop-blur-md sm:gap-2.5 sm:px-3.5 sm:py-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#F59E0B]/15 text-[#B45309] sm:size-7">
                    <CreditCard className="size-3.5 sm:size-4" />
                  </span>
                  <span className="text-[11px] font-semibold text-[#102A43] sm:text-xs">
                    Pay After Completion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- 4 Steps ------------------------------ */}
      <section className="bg-white py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="h-auto rounded-full border-0 bg-[#167D9A]/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#0F5F7A] uppercase">
              The Process
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-[#102A43] sm:text-4xl">
              Four Simple Steps
            </h2>
            <p className="mt-4 text-base leading-7 text-pretty text-slate-600">
              From finding the right service to paying after the repair, every
              step is designed to be quick, clear, and stress-free.
            </p>
          </div>

          <div className="relative mt-14 sm:mt-16">
            <div
              aria-hidden="true"
              className="absolute inset-x-[12.5%] top-[3.25rem] hidden border-t border-dashed border-[#167D9A]/30 lg:block"
            />

            <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {STEPS.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- For Both Sides --------------------------- */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="h-auto rounded-full border-0 bg-[#F59E0B]/15 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#92400E] uppercase">
              For Everyone
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-[#102A43] sm:text-4xl">
              Built for Customers and Technicians
            </h2>
            <p className="mt-4 text-base leading-7 text-pretty text-slate-600">
              One platform, two experiences. Customers get a smooth booking
              journey, while technicians get the tools to run their work.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-8">
            <AudienceCard
              title="For Customers"
              description="Everything you need to book a repair and stay informed from start to finish."
              icon={UserRound}
              benefits={CUSTOMER_BENEFITS}
              tone="teal"
            />
            <AudienceCard
              title="For Technicians"
              description="Simple tools to showcase your services, manage requests, and get paid."
              icon={UserPlus}
              benefits={TECHNICIAN_BENEFITS}
              tone="amber"
            />
          </div>
        </div>
      </section>

      {/* ----------------------------- Why Choose ----------------------------- */}
      <section className="relative overflow-hidden bg-[#102A43] py-16 sm:py-24 lg:py-28">
        <div
          aria-hidden="true"
          className="absolute top-0 -left-24 size-72 rounded-full bg-[#167D9A]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 bottom-0 size-80 rounded-full bg-[#F59E0B]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="h-auto rounded-full border-0 bg-[#F59E0B]/15 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[#FBBF24] uppercase">
              Why RepairLagbe
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
              Why Choose RepairLagbe
            </h2>
            <p className="mt-4 text-base leading-7 text-pretty text-slate-300">
              A repair experience built on trust, transparency, and secure
              payments from the first click to the final fix.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Final CTA ----------------------------- */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#167D9A] to-[#102A43] px-6 py-16 text-center shadow-2xl shadow-[#102A43]/20 sm:px-12 sm:py-20">
            <div
              aria-hidden="true"
              className="absolute -top-16 -left-16 size-56 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -right-10 -bottom-20 size-64 rounded-full bg-[#F59E0B]/20 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl">
              <Badge className="h-auto rounded-full border-0 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-white uppercase">
                Get Started Today
              </Badge>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
                Ready to Fix What&apos;s Broken?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-pretty text-slate-100">
                Find a trusted technician and book your repair in minutes.
                Transparent pricing, verified pros, and payment only after
                completion.
              </p>

              <Link
                href="/services"
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-7 py-3.5 text-sm font-semibold text-[#102A43] shadow-lg shadow-[#102A43]/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FBBF24] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#167D9A] focus-visible:outline-none"
              >
                Browse Services
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HowItWorks
