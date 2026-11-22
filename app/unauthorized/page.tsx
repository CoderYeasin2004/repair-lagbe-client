import Link from "next/link"
import { ShieldAlert, ArrowLeft, Home } from "lucide-react"

const UnauthorizedPage = () => {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#F5F7FA] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-amber-50">
          <ShieldAlert className="size-10 text-amber-500" />
        </div>

        <p className="mb-3 text-sm font-semibold tracking-wider text-[#167D9A] uppercase">
          Access Restricted
        </p>

        <h1 className="mb-3 text-3xl font-bold text-[#102A43]">
          Oops! You Can’t Access This Page
        </h1>

        <p className="mx-auto mb-8 max-w-sm text-sm leading-6 text-slate-500">
          Sorry about that! Your account doesn’t have permission to view this
          page. Please return to your dashboard or head back home.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#167D9A] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#12677F]"
          >
            <Home className="mr-2 size-4" />
            Back to Home
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Need help? Contact RepairLagbe Support.
        </p>
      </div>
    </main>
  )
}

export default UnauthorizedPage
