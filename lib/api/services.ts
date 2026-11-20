const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000" 

 export const getServices = async () => {
    const res = await fetch(`${BASE_URL}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    return res.json()
  }