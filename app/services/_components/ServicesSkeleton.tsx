
import { Skeleton } from "@/components/ui/skeleton"

const ServicesSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-3" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="w-full">
              <Skeleton className="mb-3 h-6 w-32 rounded-full" />
              <Skeleton className="h-9 w-full max-w-md sm:h-10" />
              <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
              <Skeleton className="mt-2 h-4 w-3/4 max-w-xl" />
            </div>

            <Skeleton className="h-5 w-28" />
          </div>
        </section>

        {/* Search and Filters */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />

            <div className="flex gap-2">
              <Skeleton className="h-11 flex-1" />
              <Skeleton className="h-11 w-20" />
            </div>
          </div>
        </section>

        {/* Services Heading */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-28" />
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Image */}
                <Skeleton className="h-52 w-full rounded-none" />

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />

                  <div className="mt-4 flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-5">
                    <div>
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="mt-2 h-6 w-20" />
                    </div>

                    <Skeleton className="h-10 w-28 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ServicesSkeleton
