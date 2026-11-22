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
      className="group relative z-10 flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 before:pointer-events-none before:absolute before:right-5 before:top-3 before:text-5xl before:font-bold before:leading-none before:tracking-tight before:text-[#102A43]/5 before:transition-colors before:duration-300 before:content-[attr(data-number)] hover:-translate-y-1 hover:border-[#167D9A]/30 hover:shadow-lg hover:before:text-[#167D9A]/10"
    >
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#167D9A]/10 text-[#167D9A] transition-colors duration-300 group-hover:bg-[#167D9A] group-hover:text-white">
        <Icon className="size-6" />
      </div>

      <h3 className="text-lg font-bold text-[#102A43]">{step.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
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
        "relative overflow-hidden rounded-3xl border bg-white p-7 shadow-sm sm:p-9",
        isTeal ? "border-[#167D9A]/20" : "border-[#F59E0B]/30"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "absolute -right-10 -top-10 size-40 rounded-full blur-3xl",
          isTeal ? "bg-[#167D9A]/10" : "bg-[#F59E0B]/15"
        )}
      />

      <div className="relative">
        <div
          className={cn(
            "mb-5 flex size-12 items-center justify-center rounded-xl",
            isTeal
              ? "bg-[#167D9A]/10 text-[#167D9A]"
              : "bg-[#F59E0B]/15 text-[#B45309]"
          )}
        >
          <Icon className="size-6" />
        </div>

        <h3 className="text-2xl font-bold tracking-tight text-[#102A43]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>

        <ul className="mt-6 space-y-4">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                  isTeal
                    ? "bg-[#167D9A]/10 text-[#167D9A]"
                    : "bg-[#F59E0B]/15 text-[#B45309]"
                )}
              >
                <CircleCheckBig className="size-4" />
              </span>
              <div>
                <p className="font-semibold text-[#102A43]">{benefit.title}</p>
                <p className="text-sm leading-6 text-slate-600">
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
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#F59E0B]/30 hover:bg-white/10">
      <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#F59E0B]/15 text-[#FBBF24]">
        <Icon className="size-5" />
      </div>
      <h3 className="text-base font-bold text-white">{feature.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">
        {feature.description}
      </p>
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
          className="absolute -left-32 top-10 size-72 rounded-full bg-[#167D9A]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-24 bottom-0 size-80 rounded-full bg-[#F59E0B]/10 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <Badge className="h-auto gap-1.5 rounded-full border-0 bg-[#167D9A]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F5F7A]">
              <Sparkles className="size-3.5" />
              Simple &amp; Hassle-Free
            </Badge>

            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-[#102A43] sm:text-5xl lg:text-6xl">
              How RepairLagbe Works
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Booking a repair has never been easier. Browse trusted services,
              send a request, and let a verified technician handle the rest.
              You only pay once the job is done.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#167D9A]" />
                Verified technicians
              </span>
              <span className="inline-flex items-center gap-2">
                <CreditCard className="size-4 text-[#167D9A]" />
                No upfront payment
              </span>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-[#167D9A]/15 via-transparent to-[#F59E0B]/15 blur-2xl"
            />

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/60 bg-white shadow-xl">
              <Image
  src="/assets/img-5.png"
  alt="Verified technician servicing a home appliance"
  fill
  priority
  sizes="(max-width: 1024px) 100vw, 50vw"
  className="object-cover"
/>

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#102A43]/45 via-transparent to-transparent"
              />

              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
                  <ShieldCheck className="size-4 text-[#167D9A]" />
                  <span className="text-xs font-semibold text-[#102A43]">
                    Verified Technicians
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/95 px-3 py-2 shadow-md backdrop-blur">
                  <CreditCard className="size-4 text-[#B45309]" />
                  <span className="text-xs font-semibold text-[#102A43]">
                    Pay After Completion
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------- 4 Steps ------------------------------ */}
      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="h-auto rounded-full border-0 bg-[#167D9A]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0F5F7A]">
              The Process
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              Four Simple Steps
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              From finding the right service to paying after the repair, every
              step is designed to be quick, clear, and stress-free.
            </p>
          </div>

          <div className="relative mt-12">
            <div
              aria-hidden="true"
              className="absolute inset-x-[12.5%] top-12 hidden border-t-2 border-dashed border-[#167D9A]/25 lg:block"
            />

            <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- For Both Sides --------------------------- */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="h-auto rounded-full border-0 bg-[#F59E0B]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#92400E]">
              For Everyone
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              Built for Customers and Technicians
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              One platform, two experiences. Customers get a smooth booking
              journey, while technicians get the tools to run their work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
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
      <section className="relative overflow-hidden bg-[#102A43] py-16 sm:py-20 lg:py-24">
        <div
          aria-hidden="true"
          className="absolute -left-24 top-0 size-72 rounded-full bg-[#167D9A]/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 bottom-0 size-80 rounded-full bg-[#F59E0B]/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge className="h-auto rounded-full border-0 bg-[#F59E0B]/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#FBBF24]">
              Why RepairLagbe
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Why Choose RepairLagbe
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              A repair experience built on trust, transparency, and secure
              payments from the first click to the final fix.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------ Final CTA ----------------------------- */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#167D9A] to-[#102A43] px-6 py-14 text-center shadow-xl sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="absolute -left-16 -top-16 size-56 rounded-full bg-white/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-20 -right-10 size-64 rounded-full bg-[#F59E0B]/20 blur-3xl"
            />

            <div className="relative mx-auto max-w-2xl">
              <Badge className="h-auto rounded-full border-0 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                Get Started Today
              </Badge>

              <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Fix What&apos;s Broken?
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-100">
                Find a trusted technician and book your repair in minutes.
                Transparent pricing, verified pros, and payment only after
                completion.
              </p>

              <Link
                href="/services"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-[#102A43] shadow-sm transition hover:bg-[#FBBF24] hover:shadow-md"
              >
                Browse Services
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HowItWorks
