
import Link from "next/link"
import {
  Wrench,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUpRight,
} from "lucide-react"

const popularCategories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
]

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Services", href: "/services" },
  { label: "How It Works", href: "/about" },
]

const Footer = () => {
  return (
    <footer className="bg-[#102A43] text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex size-11 items-center justify-center rounded-xl bg-[#167D9A]">
                <Wrench className="size-6 text-white" />
              </span>
              <span className="text-2xl font-bold tracking-tight">
                Repair<span className="text-[#F59E0B]">Lagbe</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-slate-300">
              Reliable repair services at your doorstep. Find trusted
              technicians and get your appliances fixed without hassle.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#167D9A]"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#167D9A]"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 transition hover:bg-[#167D9A]"
              >
                <Linkedin className="size-4" />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-sm font-bold transition hover:bg-[#167D9A]"
              >
                X
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-base font-semibold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-[#F59E0B]"
                  >
                    <ArrowUpRight className="size-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-5 text-base font-semibold">
              Popular Categories
            </h3>
            <ul className="space-y-3">
              {popularCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/services?category=${encodeURIComponent(category)}`}
                    className="text-sm text-slate-300 transition hover:text-[#F59E0B]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-base font-semibold">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin className="mt-0.5 size-5 shrink-0 text-[#F59E0B]" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Phone className="size-5 shrink-0 text-[#F59E0B]" />
                <span>+880 1XXX-XXXXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-300">
                <Mail className="size-5 shrink-0 text-[#F59E0B]" />
                <a
                  href="mailto:support@repairlagbe.com"
                  className="transition hover:text-[#F59E0B]"
                >
                  support@repairlagbe.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/15 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} RepairLagbe. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Made with <span className="text-[#F59E0B]">♥</span> in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
