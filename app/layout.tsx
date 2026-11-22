
import { Geist, Geist_Mono } from "next/font/google"
import type { Metadata } from "next"
import type { ReactNode } from "react"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import Footer from "@/components/footer"



const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "RepairLagbe — Home Appliance & Service Booking",
  description:
    "Find trusted technicians for plumbing, electrical, carpentry, and more. Transparent pricing, verified pros, and easy booking.",
  icons: [
    { rel: "icon", url: "/icon.svg", sizes: "any" },
    { rel: "apple-touch-icon", url: "/icon.svg" },
  ],
  openGraph: {
    title: "RepairLagbe — Home Appliance & Service Booking",
    description:
      "Find trusted technicians for plumbing, electrical, carpentry, and more.",
    siteName: "RepairLagbe",
    type: "website",
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode
}>) => {
 
return (
  <html
    lang="en"
    suppressHydrationWarning
    className={cn(
      "antialiased",
      fontMono.variable,
      "font-sans",
      geist.variable
    )}
  >
    <body>
      <ThemeProvider>
        <Navbar />
        {children}
        <Footer />
      </ThemeProvider>

      <Toaster />
    </body>
  </html>
)

}

export default RootLayout
