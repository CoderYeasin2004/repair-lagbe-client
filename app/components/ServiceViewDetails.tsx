import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface ViewDetailsButtonProps {
  serviceId: string
}

const ViewDetailsButton = ({ serviceId }: ViewDetailsButtonProps) => {
  return (
    <Link
      href={`/services/${serviceId}`}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#167D9A] px-4 text-sm font-medium text-white transition hover:bg-[#12677F]"
    >
      View Details
      <ArrowUpRight className="size-4" />
    </Link>
  )
}

export default ViewDetailsButton