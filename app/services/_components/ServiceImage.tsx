"use client"

import { useState } from "react"
import { Wrench } from "lucide-react"

interface IServiceImageProps {
  src?: string
  alt: string
}

const ServiceImage = ({ src, alt }: IServiceImageProps) => {
  const [hasImageError, setHasImageError] = useState(false)

  if (!src || hasImageError) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Wrench className="size-12" />
          <span className="text-xs font-medium">Image unavailable</span>
        </div>
      </div>
    )
  }

  return (
    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100">
      <img
        src={src}
        alt={alt}
        onError={() => setHasImageError(true)}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </div>
  )
}

export default ServiceImage