interface ServiceFilterProps {
  selectedCategory: string
  selectedServiceMode: string
  selectedSort: string
}

const categoryOptions = [
  { value: "smartphone", label: "Smartphone" },
  { value: "laptop-pc", label: "Laptop & PC" },
  { value: "ac", label: "AC" },
  { value: "refrigerator", label: "Refrigerator" },
  { value: "tv", label: "TV" },
  { value: "washing-machine", label: "Washing Machine" },
  { value: "electrical", label: "Electrical" },
]

const ServiceFilter = ({
  selectedCategory,
  selectedServiceMode,
  selectedSort,
}: ServiceFilterProps) => {
  return (
    <>
      {/* Category */}
      <div>
        <label
          htmlFor="service-category"
          className="mb-2 block text-sm font-semibold text-[#102A43]"
        >
          Category
        </label>

        <select
          id="service-category"
          name="category"
          defaultValue={selectedCategory}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#167D9A] focus:ring-2 focus:ring-[#167D9A]/10"
        >
          <option value="">All Categories</option>
          {categoryOptions.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      {/* Service Mode */}
      <div>
        <label
          htmlFor="service-mode"
          className="mb-2 block text-sm font-semibold text-[#102A43]"
        >
          Service Mode
        </label>

        <select
          id="service-mode"
          name="serviceMode"
          defaultValue={selectedServiceMode}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#167D9A] focus:ring-2 focus:ring-[#167D9A]/10"
        >
          <option value="">All Modes</option>
          <option value="home">Home Visit</option>
          <option value="shop">Shop Drop-off</option>
        </select>
      </div>

      {/* Sorting */}
      <div>
        <label
          htmlFor="service-sort"
          className="mb-2 block text-sm font-semibold text-[#102A43]"
        >
          Sort by
        </label>

        <select
          id="service-sort"
          name="sort"
          defaultValue={selectedSort}
          className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#167D9A] focus:ring-2 focus:ring-[#167D9A]/10"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </>
  )
}

export default ServiceFilter