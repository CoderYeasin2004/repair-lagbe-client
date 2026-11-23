
import { Skeleton } from "@/components/ui/skeleton"

const HowItWorksSkeleton = () => {
  return (
    <main className="bg-[#F5F7FA]">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:gap-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28">

          <div>
            <Skeleton className="h-7 w-40 rounded-full" />

            <Skeleton className="mt-7 h-12 w-full max-w-md sm:h-14" />

            <div className="mt-6 space-y-3">
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-full max-w-lg" />
              <Skeleton className="h-4 w-4/5 max-w-md" />
            </div>

            <div className="mt-9 flex flex-wrap gap-3 border-t border-[#102A43]/10 pt-7">
              <Skeleton className="h-10 w-44 rounded-full" />
              <Skeleton className="h-10 w-44 rounded-full" />
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] sm:aspect-[3/2]">
            <Skeleton className="h-full w-full rounded-none" />

            <div className="absolute inset-x-3 bottom-3 flex flex-wrap justify-between gap-2 sm:inset-x-4 sm:bottom-4">
              <Skeleton className="h-10 w-40 rounded-2xl" />
              <Skeleton className="h-10 w-40 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Four Simple Steps */}
      <section className="bg-white py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <Skeleton className="mx-auto h-7 w-32 rounded-full" />
            <Skeleton className="mx-auto mt-4 h-9 w-64 max-w-full sm:h-11" />

            <div className="mx-auto mt-4 max-w-xl space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mx-auto h-4 w-4/5" />
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm sm:p-7"
              >
                <Skeleton className="mb-6 size-12 rounded-[14px]" />
                <Skeleton className="h-6 w-3/4" />

                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customers and Technicians */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <Skeleton className="mx-auto h-7 w-32 rounded-full" />
            <Skeleton className="mx-auto mt-4 h-9 w-full max-w-md sm:h-11" />

            <div className="mx-auto mt-4 max-w-xl space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mx-auto h-4 w-4/5" />
            </div>
          </div>

          <div className="mt-14 grid gap-6 sm:mt-16 lg:grid-cols-2 lg:gap-8">

            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9 lg:p-10"
              >
                <Skeleton className="mb-6 size-12 rounded-[14px]" />
                <Skeleton className="h-8 w-48" />

                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>

                <div className="mt-7 divide-y divide-slate-100">
                  {Array.from({ length: 4 }).map((_, benefitIndex) => (
                    <div
                      key={benefitIndex}
                      className="flex gap-3.5 py-4"
                    >
                      <Skeleton className="mt-0.5 size-7 shrink-0 rounded-full" />

                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Why Choose RepairLagbe */}
      <section className="relative overflow-hidden bg-[#102A43] py-16 sm:py-24 lg:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <Skeleton className="mx-auto h-7 w-36 rounded-full bg-slate-500/40" />
            <Skeleton className="mx-auto mt-4 h-9 w-full max-w-sm bg-slate-500/40 sm:h-11" />

            <div className="mx-auto mt-4 max-w-xl space-y-2">
              <Skeleton className="h-4 w-full bg-slate-500/40" />
              <Skeleton className="mx-auto h-4 w-4/5 bg-slate-500/40" />
            </div>
          </div>

          <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 sm:p-7"
              >
                <Skeleton className="mb-6 size-11 rounded-xl bg-slate-500/40" />
                <Skeleton className="h-5 w-3/4 bg-slate-500/40" />

                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-full bg-slate-500/40" />
                  <Skeleton className="h-4 w-full bg-slate-500/40" />
                  <Skeleton className="h-4 w-4/5 bg-slate-500/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#167D9A] to-[#102A43] px-6 py-16 text-center shadow-2xl sm:px-12 sm:py-20">

            <div className="relative mx-auto max-w-2xl">
              <Skeleton className="mx-auto h-7 w-36 rounded-full bg-white/20" />

              <Skeleton className="mx-auto mt-5 h-9 w-full max-w-md bg-white/20 sm:h-11" />

              <div className="mx-auto mt-4 max-w-xl space-y-2">
                <Skeleton className="h-4 w-full bg-white/20" />
                <Skeleton className="mx-auto h-4 w-4/5 bg-white/20" />
              </div>

              <Skeleton className="mx-auto mt-8 h-12 w-44 rounded-xl bg-white/20" />
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

export default HowItWorksSkeleton
