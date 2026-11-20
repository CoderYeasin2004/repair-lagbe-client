import { getServices } from "@/lib/api/services"

const ServicesPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) => {
  const search = await searchParams

  console.log("Search Params:", search)

  const services = await getServices(search)

  return <div>

    <ul>
        {services.map((service) => (
            <li key={service.id}>{service.title}</li>
        ))}
    </ul>
  </div>
}

export default ServicesPage
