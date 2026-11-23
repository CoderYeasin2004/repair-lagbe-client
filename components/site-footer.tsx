"use client"

import { usePathname } from "next/navigation"

import Footer from "@/components/footer"

// Routes that should not render the public footer.
const HIDDEN_PREFIXES = ["/dashboard"]
const HIDDEN_ROUTES = ["/sign-in", "/sign-up"]

const SiteFooter = () => {
  const pathname = usePathname()

  const isHidden =
    HIDDEN_ROUTES.includes(pathname) ||
    HIDDEN_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )

  if (isHidden) return null

  return <Footer />
}

export default SiteFooter
