
"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useCallback, useState, useEffect } from "react"
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
import { signOut, useSession } from "@/lib/auth-client"
import { toast } from "sonner"

const ROUTE_MAP: Record<string, string> = {
  customer: "/dashboard/customer",
  technician: "/dashboard/technician",
  admin: "/dashboard/admin",
}

const PROFILE_ROUTE = "/dashboard/profile"

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

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)

  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()

  const { data: session, isPending } = useSession()

  const currentUser = session?.user ?? null
  const isLoggedIn = !!currentUser

  // Resolve role safely
  const userRole =
    currentUser?.role && ROLE_CONFIG[currentUser.role]
      ? currentUser.role
      : "customer"

  const roleConfig = ROLE_CONFIG[userRole]
  const dashboardRoute = ROUTE_MAP[userRole]

  // Welcome toast
  const storage =
    typeof window !== "undefined" ? window.localStorage : null

  useEffect(() => {
    if (isPending) return

    const hasShownLoginToast =
      storage?.getItem("welcomeToastShown") === "true"

    if (isLoggedIn && !hasShownLoginToast) {
      toast.success(`Welcome back, ${currentUser.name}!`)
      storage?.setItem("welcomeToastShown", "true")
    }

    if (!isLoggedIn) {
      storage?.removeItem("welcomeToastShown")
    }
  }, [isPending, isLoggedIn, currentUser?.name, storage])

  const handleSignOut = async () => {
    await signOut()

    setIsUserDropdownOpen(false)
    setIsMobileMenuOpen(false)

    toast.success("Logged out successfully!")
    router.push("/sign-in")
  }

  const handleThemeToggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const isActive = (href: string) => pathname === href

  const ThemeToggleIcon = theme === "dark" ? Sun : Moon

  const userInitials = currentUser?.name
    ? currentUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?"

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
              "flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "text-brand-teal bg-brand-teal/10"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-[#167D9A]"
      >
        Sign In
      </Link>

      <Link
        href="/sign-up"
        className="rounded-lg bg-[#167D9A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0f5f7a]"
      >
        Sign Up
      </Link>
    </div>
  )

  const profileDropdown = (
    <div
      className={cn(
        "fixed top-14 right-0 z-50 mt-2 w-72 origin-top-right",
        isUserDropdownOpen
          ? "scale-100 opacity-100"
          : "pointer-events-none scale-95 opacity-0",
        "transition-all duration-200 ease-out"
      )}
    >
      <div className="rounded-xl border border-border bg-background p-4 shadow-lg">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#167D9A]/10 text-sm font-medium text-[#167D9A]">
                {userInitials}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {currentUser?.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {currentUser?.email}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full px-2 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#167D9A]" />

              <span
                className={cn(
                  "text-xs font-medium rounded-full border px-2 py-0.5",
                  roleConfig.border,
                  roleConfig.bg,
                  roleConfig.text
                )}
              >
                {roleConfig.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <Link
              href={dashboardRoute}
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-[#167D9A]"
            >
              <LayoutDashboard size={16} strokeWidth={2} />
              Dashboard
            </Link>

            <Link
              href={PROFILE_ROUTE}
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-[#167D9A]"
            >
              <Settings size={16} strokeWidth={2} />
              Update Profile
            </Link>

            <div className="border-t border-border pt-3">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
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
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 transition-all hover:bg-muted hover:text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
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
        className="flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#167D9A]/10 text-xs font-medium text-[#167D9A]">
          {userInitials}
        </div>

        <span className="hidden text-sm font-medium text-foreground sm:inline">
          {currentUser?.name}
        </span>

        <ChevronDown
          size={14}
          strokeWidth={2.5}
          className="text-muted-foreground"
        />
      </button>

      {isLoggedIn && isUserDropdownOpen && profileDropdown}
    </div>
  )

  const rightContent = isLoggedIn
    ? userActionsLoggedIn
    : authActionsLoggedOut

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-background/50 bg-background/80 backdrop-blur-md transition-colors supports-backdrop-filter:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="RepairLagbe homepage"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#167D9A]/10 text-[#167D9A]">
                <Wrench size={20} strokeWidth={2} />
              </div>

              <span className="text-lg font-semibold tracking-tight text-[#102A43]">
                RepairLagbe
              </span>
            </Link>

            <div className="hidden flex-1 justify-center lg:flex">
              {navLinks}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              {themeToggle}
              {rightContent}
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              {themeToggle}

              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileMenuOpen}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-all hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:outline-none"
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

      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-full max-w-md transform border-l border-border bg-background transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#167D9A]/10 text-[#167D9A]">
              <Wrench size={20} strokeWidth={2} />
            </div>

            <span className="text-lg font-semibold tracking-tight text-[#102A43]">
              RepairLagbe
            </span>
          </Link>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
            aria-label="Close navigation menu"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-1 p-6">
          {NAV_LINKS.map((link) => {
            const Icon = link.Icon
            const active = isActive(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-[#167D9A]/10 text-[#167D9A]"
                    : "text-foreground hover:bg-muted hover:text-[#167D9A]"
                )}
              >
                <Icon size={18} strokeWidth={2} />
                <span>{link.label}</span>
              </Link>
            )
          })}

          <div className="space-y-2 border-t border-border pt-6">
            {isLoggedIn ? (
              <>
                <div className="px-4">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#167D9A]/10 text-xs font-medium text-[#167D9A]">
                      {userInitials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {currentUser?.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {currentUser?.email}
                      </p>

                      <span
                        className={cn(
                          "mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
                          roleConfig.border,
                          roleConfig.bg,
                          roleConfig.text
                        )}
                      >
                        {roleConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 border-t border-border pt-4">
                  <Link
                    href={dashboardRoute}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <LayoutDashboard size={18} strokeWidth={2} />
                    Dashboard
                  </Link>

                  <Link
                    href={PROFILE_ROUTE}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
                  >
                    <Settings size={18} strokeWidth={2} />
                    Update Profile
                  </Link>

                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
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
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <User size={18} strokeWidth={2} />
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  className="flex items-center gap-3 rounded-lg bg-[#167D9A] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors"
                >
                  <User size={18} strokeWidth={2} className="text-white" />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
