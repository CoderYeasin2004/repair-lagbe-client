import { Search } from "lucide-react"

interface ServiceSearchProps {
  searchQuery: string
}

const ServiceSearch = ({ searchQuery }: ServiceSearchProps) => {
  return (
    <div>
      <label
        htmlFor="service-search"
        className="mb-2 block text-sm font-semibold text-[#102A43]"
      >
        Search services
      </label>

      <div className="relative">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

        <input
          id="service-search"
          type="search"
          name="search"
          defaultValue={searchQuery}
          placeholder="Search by title or category..."
          className="h-11 w-full rounded-lg border border-slate-200 bg-white pr-3 pl-10 text-sm transition outline-none placeholder:text-slate-400 focus:border-[#167D9A] focus:ring-2 focus:ring-[#167D9A]/10"
        />
      </div>
    </div>
  )
}

export default ServiceSearch