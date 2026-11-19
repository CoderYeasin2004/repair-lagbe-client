import { NextResponse } from "next/server"

const IMGBB_API_KEY = process.env.IMGBB_API_KEY

interface ImgBBUploadResponse {
  success: boolean
  status: number
  data: {
    url: string
    display_url: string
    size: number
    error?: {
      message: string
    }
  }
}

export async function POST(request: Request) {
  if (!IMGBB_API_KEY) {
    return NextResponse.json(
      { error: "Image upload service is not configured." },
      { status: 500 }
    )
  }

  const formData = await request.formData()
  const file = formData.get("image") as File | null

  if (!file) {
    return NextResponse.json(
      { error: "No image file provided." },
      { status: 400 }
    )
  }

  const uploadFormData = new FormData()
  uploadFormData.append("image", file)

  try {
   const imgbbResponse = await fetch(
  `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
  {
    method: "POST",
    body: uploadFormData,
  }
)

    const result: ImgBBUploadResponse = await imgbbResponse.json()

    if (!result.success) {
      return NextResponse.json(
        { error: result.data?.error?.message || "Image upload failed." },
        { status: 500 }
      )
    }

   return NextResponse.json({ imageUrl: result.data.url })
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred while uploading the image." },
      { status: 500 }
    )
  }
}
