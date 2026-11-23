
const SkeletonBlock = ({
  className = "",
}: {
  className?: string;
}) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-md bg-slate-200 ${className}`}
  />
);

const HomePageSkeleton = () => {
  return (
    <main className="min-w-0 overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-[#F5F7FA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 py-20 sm:py-24 lg:grid-cols-2 lg:gap-12 lg:pb-40 lg:pt-32">
            <div className="space-y-6 lg:pr-8">
              <SkeletonBlock className="h-7 w-52 rounded-lg" />

              <div className="space-y-3">
                <SkeletonBlock className="h-10 w-full sm:h-12 lg:h-14" />
                <SkeletonBlock className="h-10 w-[90%] sm:h-12 lg:h-14" />
                <SkeletonBlock className="h-10 w-[65%] sm:h-12 lg:h-14" />
              </div>

              <div className="max-w-2xl space-y-3">
                <SkeletonBlock className="h-5 w-full" />
                <SkeletonBlock className="h-5 w-[95%]" />
                <SkeletonBlock className="h-5 w-[75%]" />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <SkeletonBlock className="h-12 w-full rounded-lg sm:w-44" />
                <SkeletonBlock className="h-12 w-full rounded-lg sm:w-40" />
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <SkeletonBlock className="h-10 w-52 rounded-lg" />
                <SkeletonBlock className="h-10 w-48 rounded-lg" />
                <SkeletonBlock className="h-10 w-48 rounded-lg" />
              </div>
            </div>

            {/* Hero Carousel */}
            <div className="h-[470px] w-full max-w-[720px] self-center overflow-hidden rounded-2xl bg-slate-200 shadow-lg animate-pulse sm:h-[560px] lg:h-[560px]" />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-28" />
              <SkeletonBlock className="h-9 w-72 max-w-full sm:h-10" />
              <SkeletonBlock className="h-5 w-80 max-w-full" />
            </div>
            <SkeletonBlock className="h-5 w-36" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <article
                key={item}
                className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <SkeletonBlock className="h-52 w-full rounded-none" />

                <div className="flex flex-1 flex-col p-5">
                  <SkeletonBlock className="h-6 w-3/4" />

                  <div className="mt-4 space-y-3">
                    <SkeletonBlock className="h-4 w-2/3" />
                    <SkeletonBlock className="h-4 w-4/5" />
                    <SkeletonBlock className="h-4 w-3/5" />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div className="space-y-2">
                      <SkeletonBlock className="h-3 w-20" />
                      <SkeletonBlock className="h-6 w-24" />
                    </div>
                    <SkeletonBlock className="h-10 w-28 rounded-lg" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#F5F7FA] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
            <SkeletonBlock className="mx-auto h-4 w-28" />
            <SkeletonBlock className="mx-auto h-9 w-72 max-w-full sm:h-10" />
            <SkeletonBlock className="mx-auto h-5 w-80 max-w-full" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <SkeletonBlock className="size-14 rounded-xl" />
                  <SkeletonBlock className="h-9 w-10 rounded-lg" />
                </div>

                <SkeletonBlock className="mt-6 h-6 w-3/4" />

                <div className="mt-4 space-y-2">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-[85%]" />
                  <SkeletonBlock className="h-4 w-[65%]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 space-y-3 text-center">
            <SkeletonBlock className="mx-auto h-4 w-32" />
            <SkeletonBlock className="mx-auto h-9 w-80 max-w-full sm:h-10" />
            <SkeletonBlock className="mx-auto h-5 w-72 max-w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-[#F5F7FA] p-5"
              >
                <SkeletonBlock className="size-14 rounded-xl" />
                <SkeletonBlock className="mt-4 h-5 w-24 max-w-full" />
                <SkeletonBlock className="mt-3 h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose RepairLagbe */}
      <section className="bg-[#102A43] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl space-y-3 text-center">
            <SkeletonBlock className="mx-auto h-4 w-32 bg-white/20" />
            <SkeletonBlock className="mx-auto h-9 w-80 max-w-full bg-white/20 sm:h-10" />
            <SkeletonBlock className="mx-auto h-5 w-80 max-w-full bg-white/20" />
            <SkeletonBlock className="mx-auto h-5 w-64 max-w-full bg-white/20" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 p-7"
              >
                <SkeletonBlock className="size-14 rounded-xl bg-white/20" />
                <SkeletonBlock className="mt-6 h-6 w-3/4 bg-white/20" />

                <div className="mt-4 space-y-2">
                  <SkeletonBlock className="h-4 w-full bg-white/20" />
                  <SkeletonBlock className="h-4 w-[85%] bg-white/20" />
                  <SkeletonBlock className="h-4 w-[65%] bg-white/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#167D9A] to-[#102A43] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <SkeletonBlock className="mx-auto h-9 w-80 max-w-full bg-white/20 sm:h-10" />
          <SkeletonBlock className="mx-auto mt-4 h-5 w-80 max-w-full bg-white/20" />
          <SkeletonBlock className="mx-auto mt-3 h-5 w-64 max-w-full bg-white/20" />
          <SkeletonBlock className="mx-auto mt-8 h-12 w-40 rounded-lg bg-white/20" />
        </div>
      </section>
    </main>
  );
};

export { HomePageSkeleton };
