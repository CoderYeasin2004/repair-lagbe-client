const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000" 

 export const getServices = async (query = '') => {
    const res = await fetch(`${BASE_URL}/services?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return res.json()
  }