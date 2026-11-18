"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useCallback, useState } from "react"
import {
  Wrench,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  BriefcaseBusiness,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"

const ROUTE_MAP: Record<string, string> = {
  customer: "/customer/dashboard",
  technician: "/technician/dashboard",
  admin: "/admin/dashboard",
}

const PROFILE_ROUTE_MAP: Record<string, string> = {
  customer: "/customer/profile",
  technician: "/technician/profile",
  admin: "/admin/profile",
}

const ROLE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  customer: {
    label: "Customer",
    bg: "bg-blue-50/60",
    text: "text-blue-700",
    border: "border-blue-200/60",
  },
  technician: {
    label: "Technician",
    bg: "bg-amber-50/60",
    text: "text-amber-700",
    border: "border-amber-200/60",
  },
  admin: {
    label: "Admin",
    bg: "bg-purple-50/60",
    text: "text-purple-700",
    border: "border-purple-200/60",
  },
}

const NAV_LINKS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/services", label: "Services", Icon: BriefcaseBusiness },
  { href: "/about", label: "How It Works", Icon: Info },
] as const

export function Navbar({
  user,
}: {
  user?: { name: string; email: string; role: string; image: string | null } | null
} = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const currentUser = user ?? null
  const isLoggedIn = !!currentUser

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const isActive = (href: string) => pathname === href

  const ThemeToggleIcon = theme === "dark" ? Sun : Moon

  const navLinks = (
    <div className="flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const Icon = link.Icon
        const active = isActive(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
              active
                ? "text-brand-teal bg-brand-teal/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={16} strokeWidth={2} />
            <span>{link.label}</span>
          </Link>
        )
      })}
    </div>
  )

  const authActionsLoggedOut = (
    <div className="flex items-center gap-3">
      <Link
        href="/sign-in"
        className="text-sm font-medium text-foreground hover:text-[#167D9A] transition-colors px-4 py-2.5 rounded-lg hover:bg-muted"
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        className="text-sm font-medium text-white bg-[#167D9A] hover:bg-[#0f5f7a] transition-colors px-5 py-2.5 rounded-lg shadow-sm"
      >
        Sign Up
      </Link>
    </div>
  )

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

  const roleConfig = ROLE_CONFIG[currentUser?.role ?? "customer"]

  const profileDropdown = (
    <div
      className={cn(
        "fixed top-14 right-0 mt-2 w-72 origin-top-right z-50",
        isUserDropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
        "transition-all duration-200 ease-out",
      )}
    >
      <div className="bg-background border border-border rounded-xl shadow-lg p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#167D9A]/10 flex items-center justify-center text-[#167D9A] font-medium text-sm">
                {userInitials}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {currentUser?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#167D9A]" />
              <span
                className={cn(
                  "text-xs font-medium",
                  roleConfig.border,
                  roleConfig.bg,
                  roleConfig.text,
                )}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <Link
              href={ROUTE_MAP[currentUser?.role ?? "customer"]}
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-foreground rounded-lg hover:bg-muted hover:text-[#167D9A] transition-colors"
            >
              <LayoutDashboard size={16} strokeWidth={2} />
              Dashboard
            </Link>
            <Link
              href={PROFILE_ROUTE_MAP[currentUser?.role ?? "customer"]}
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-foreground rounded-lg hover:bg-muted hover:text-[#167D9A] transition-colors"
            >
              <Settings size={16} strokeWidth={2} />
              Update Profile
            </Link>
            <div className="border-t border-border pt-3">
              <button
                onClick={() => setIsUserDropdownOpen(false)}
                className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-destructive rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={16} strokeWidth={2} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const themeToggle = (
    <button
      onClick={handleThemeToggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background/50 transition-all hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
    >
      <ThemeToggleIcon size={18} strokeWidth={2.5} />
      <span className="sr-only">
        {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  )

  const userActionsLoggedIn = (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setIsUserDropdownOpen((prev) => !prev)}
        aria-label="User profile menu"
        aria-expanded={isUserDropdownOpen}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
      >
        <div className="w-8 h-8 rounded-full bg-[#167D9A]/10 flex items-center justify-center text-[#167D9A] font-medium text-xs">
          {userInitials}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-foreground">
          {currentUser?.name}
        </span>
        <ChevronDown size={14} strokeWidth={2.5} className="text-muted-foreground" />
      </button>
      {isLoggedIn && isUserDropdownOpen && profileDropdown}
    </div>
  )

  const rightContent = isLoggedIn ? userActionsLoggedIn : authActionsLoggedOut

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-background/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand */}
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="RepairLagbe homepage"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#167D9A]/10 flex items-center justify-center text-[#167D9A]">
                <Wrench size={20} strokeWidth={2} />
              </div>
              <span className="font-semibold text-[#102A43] tracking-tight text-lg">
                RepairLagbe
              </span>
            </Link>

            {/* Desktop navigation — centered */}
            <div className="hidden lg:flex flex-1 justify-center">
              {navLinks}
            </div>

            {/* Desktop right actions — theme toggle + auth */}
            <div className="hidden lg:flex items-center gap-3">
              {themeToggle}
              {rightContent}
            </div>

            {/* Mobile controls — theme toggle + hamburger. lg:hidden prevents duplicate on desktop. */}
            <div className="flex items-center gap-3 lg:hidden">
              {themeToggle}
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border transition-all hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              >
                {isMobileMenuOpen ? (
                  <X size={20} strokeWidth={2.5} />
                ) : (
                  <Menu size={20} strokeWidth={2.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-full max-w-md transform transition-transform duration-300 ease-in-out bg-background border-l border-border",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#167D9A]/10 flex items-center justify-center text-[#167D9A]">
              <Wrench size={20} strokeWidth={2} />
            </div>
            <span className="font-semibold text-[#102A43] tracking-tight text-lg">
              RepairLagbe
            </span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted text-foreground"
            aria-label="Close navigation menu"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-6 space-y-1">
          {NAV_LINKS.map((link) => {
            const Icon = link.Icon
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  active
                    ? "text-[#167D9A] bg-[#167D9A]/10"
                    : "text-foreground hover:bg-muted hover:text-[#167D9A]",
                )}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{link.label}</span>
              </Link>
            )
          })}
          <div className="border-t border-border pt-6 space-y-2">
            {isLoggedIn ? (
              <>
                <div className="px-4">
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-[#167D9A]/10 flex items-center justify-center text-[#167D9A] font-medium text-xs">
                      {userInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {currentUser?.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {currentUser?.email}
                      </p>
                      <span
                        className={cn(
                          "mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                          roleConfig.border,
                          roleConfig.bg,
                          roleConfig.text,
                        )}
                      >
                        {roleConfig.label}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-1">
                  <Link
                    href={ROUTE_MAP[currentUser?.role ?? "customer"]}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard size={18} strokeWidth={2} />
                    Dashboard
                  </Link>
                  <Link
                    href={PROFILE_ROUTE_MAP[currentUser?.role ?? "customer"]}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-foreground rounded-lg hover:bg-muted transition-colors"
                  >
                    <Settings size={18} strokeWidth={2} />
                    Update Profile
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={18} strokeWidth={2} />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/sign-in"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground rounded-lg hover:bg-muted transition-colors"
                >
                  <User size={18} strokeWidth={2} />
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-[#167D9A] rounded-lg shadow-sm transition-colors"
                >
                  <User size={18} strokeWidth={2} className="text-white" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User dropdown overlay (desktop) — rendered outside nav for correct z-index layering */}
      {isLoggedIn && isUserDropdownOpen && profileDropdown}
    </>
  )
}

export default Navbar