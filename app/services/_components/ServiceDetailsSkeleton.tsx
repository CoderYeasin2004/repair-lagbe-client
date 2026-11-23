
import { Skeleton } from "@/components/ui/skeleton"

const ServiceDetailsSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#F5F7FA] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <Skeleton className="mb-6 h-5 w-36" />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Service Information */}
          <div className="space-y-6 lg:col-span-2">

            {/* Service Image */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <Skeleton className="h-[280px] w-full rounded-none sm:h-[420px]" />
            </div>

            {/* Service Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              {/* Category and Service Mode */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-32 rounded-full" />
              </div>

              {/* Title */}
              <Skeleton className="h-8 w-3/4 sm:h-10" />

              {/* Service Information */}
              <div className="my-6 grid grid-cols-1 gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">

                {/* Price */}
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>

                {/* Service Area */}
                <div className="flex items-center gap-3">
                  <Skeleton className="size-11 shrink-0 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <Skeleton className="mb-4 h-7 w-52" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          </div>

          {/* Technician and Request Information */}
          <aside className="space-y-6">

            {/* Technician Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center gap-3">
                <Skeleton className="size-12 shrink-0 rounded-xl" />
                <Skeleton className="h-6 w-48" />
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-36" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-full" />
                </div>
              </div>
            </div>

            {/* Request Card */}
            <div className="rounded-2xl bg-[#102A43] p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Skeleton className="size-7 rounded-md bg-slate-500/40" />
                <Skeleton className="h-6 w-44 bg-slate-500/40" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-slate-500/40" />
                <Skeleton className="h-4 w-full bg-slate-500/40" />
                <Skeleton className="h-4 w-4/5 bg-slate-500/40" />
              </div>

              <Skeleton className="mt-6 h-11 w-full rounded-md bg-slate-500/40" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default ServiceDetailsSkeleton
