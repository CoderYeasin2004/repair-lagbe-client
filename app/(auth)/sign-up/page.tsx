
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import {
  Eye,
  EyeOff,
  Wrench,
  User,
  AlertCircle,
  Hammer,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

const STORAGE_KEY = "repairlagbe-signup-form"

const btnPrimary =
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-[#167D9A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0f5f7a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"

const inputBase =
  "flex w-full items-center rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"

const labelBase = "mb-2 block text-sm font-medium text-foreground"
const fieldError = "text-sm text-destructive mt-1"

const roleOptions = [
  {
    value: "customer",
    label: "Customer",
    icon: User,
    desc: "Homeowner booking repair services",
  },
  {
    value: "technician",
    label: "Technician",
    icon: Hammer,
    desc: "Service provider offering repairs",
  },
] as const

type FormData = {
  fullName: string
  email: string
  password: string
  role: "customer" | "technician"
}

type PersistedFormData = Pick<FormData, "fullName" | "email" | "role">

type FormErrors = {
  fullName?: string
  email?: string
  password?: string
}

const getSavedForm = (): PersistedFormData | null => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)

    if (!saved) return null

    const parsed: unknown = JSON.parse(saved)

    if (typeof parsed !== "object" || parsed === null) return null

    const data = parsed as Record<string, unknown>

    return {
      fullName: typeof data.fullName === "string" ? data.fullName : "",
      email: typeof data.email === "string" ? data.email : "",
      role: data.role === "technician" ? "technician" : "customer",
    }
  } catch {
    return null
  }
}

const saveForm = (data: PersistedFormData) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage may be unavailable.
  }
}

const getInitialForm = (): FormData => {
  if (typeof window === "undefined") {
    return {
      fullName: "",
      email: "",
      password: "",
      role: "customer",
    }
  }

  const saved = getSavedForm()

  return {
    fullName: saved?.fullName ?? "",
    email: saved?.email ?? "",
    password: "",
    role: saved?.role ?? "customer",
  }
}

const SignUpPage = () => {
  const [form, setForm] = useState<FormData>(getInitialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitMessage, setSubmitMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const { fullName, email, role } = form

    saveForm({ fullName, email, role })
  }, [form.fullName, form.email, form.role])

  const updateForm = (updates: Partial<FormData>) => {
    setForm((previous) => ({
      ...previous,
      ...updates,
    }))

    setSubmitMessage("")
  }

  const validate = () => {
    const newErrors: FormErrors = {}

    if (!form.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!form.password) {
      newErrors.password = "Password is required"
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password = "Password must contain at least one lowercase letter"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate() || isSubmitting || isGoogleLoading) {
      setSubmitMessage("")
      return
    }

    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const { error } = await authClient.signUp.email({
        name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        callbackURL: "/",
      })

      if (error) {
        setSubmitMessage(error.message || "Sign Up failed.")
        return
      }

      sessionStorage.removeItem(STORAGE_KEY)
      setSubmitMessage("Account created successfully!")

      router.replace("/")
      router.refresh()
    } catch (error) {
      console.error("Sign Up Exception:", error)
      setSubmitMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    if (isGoogleLoading || isSubmitting) return

    setIsGoogleLoading(true)
    setSubmitMessage("")

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        setSubmitMessage(error.message || "Google Sign Up failed.")
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error("Google Sign Up Exception:", error)
      setSubmitMessage("Google Sign Up failed. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  const passwordRequirements = [
    { text: "At least 6 characters", met: form.password.length >= 6 },
    { text: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { text: "One lowercase letter", met: /[a-z]/.test(form.password) },
  ]

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <nav className="sticky top-0 z-50 w-full border-b border-background/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="RepairLagbe homepage"
            >
              <div className="bg-brand-teal/10 text-brand-teal flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg">
                <Wrench size={20} strokeWidth={2} />
              </div>
              <span className="text-lg font-semibold tracking-tight text-[#102A43]">
                RepairLagbe
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="bg-brand-bg-light">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <div className="bg-brand-teal/10 text-brand-teal mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold">
                  <Wrench size={14} strokeWidth={2} />
                  Join RepairLagbe
                </div>

                <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Create your account
                </h1>

                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                  Create an account to access RepairLagbe home repair services.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="bg-brand-teal/10 text-brand-teal flex h-10 w-10 items-center justify-center rounded-lg">
                      <Sparkles size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Simple registration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your details to prepare your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="bg-brand-amber/10 flex h-10 w-10 items-center justify-center rounded-lg text-amber-600">
                      <Hammer size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Choose your role
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Select customer or technician.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="p-8">
                      <div className="mb-8 flex items-center justify-center">
                        <div className="bg-brand-teal/10 text-brand-teal flex h-12 w-12 items-center justify-center rounded-xl">
                          <User size={24} strokeWidth={2} />
                        </div>
                      </div>

                      <h2 className="mb-2 text-center text-2xl font-semibold text-foreground">
                        Sign Up
                      </h2>

                      <p className="mb-8 text-center text-sm text-muted-foreground">
                        Enter your account information
                      </p>

                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="fullName" className={labelBase}>
                            Full name
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            placeholder="Your Name"
                            value={form.fullName}
                            onChange={(event) => {
                              updateForm({ fullName: event.target.value })
                              setErrors((previous) => ({
                                ...previous,
                                fullName: undefined,
                              }))
                            }}
                            className={cn(
                              inputBase,
                              errors.fullName &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                            aria-invalid={!!errors.fullName}
                            aria-describedby={
                              errors.fullName ? "fullname-error" : undefined
                            }
                          />
                          {errors.fullName && (
                            <p id="fullname-error" className={fieldError}>
                              {errors.fullName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className={labelBase}>
                            Email address
                          </label>
                          <input
                            id="email"
                            type="email"
                            placeholder="Your@Email.com"
                            value={form.email}
                            onChange={(event) => {
                              updateForm({ email: event.target.value })
                              setErrors((previous) => ({
                                ...previous,
                                email: undefined,
                              }))
                            }}
                            className={cn(
                              inputBase,
                              errors.email &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                            aria-invalid={!!errors.email}
                            aria-describedby={
                              errors.email ? "email-error" : undefined
                            }
                          />
                          {errors.email && (
                            <p id="email-error" className={fieldError}>
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="password" className={labelBase}>
                            Password
                          </label>

                          <div className="relative">
                            <input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              value={form.password}
                              onChange={(event) => {
                                updateForm({ password: event.target.value })
                                setErrors((previous) => ({
                                  ...previous,
                                  password: undefined,
                                }))
                              }}
                              className={cn(
                                inputBase,
                                "pr-12",
                                errors.password &&
                                  "border-destructive focus-visible:ring-destructive"
                              )}
                              aria-invalid={!!errors.password}
                              aria-describedby={
                                errors.password ? "password-error" : undefined
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword((previous) => !previous)
                              }
                              aria-label={
                                showPassword ? "Hide password" : "Show password"
                              }
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff size={18} strokeWidth={2} />
                              ) : (
                                <Eye size={18} strokeWidth={2} />
                              )}
                            </button>
                          </div>

                          {errors.password && (
                            <p id="password-error" className={fieldError}>
                              {errors.password}
                            </p>
                          )}

                          <div className="mt-2 space-y-1">
                            {passwordRequirements.map((requirement) => (
                              <div
                                key={requirement.text}
                                className={cn(
                                  "flex items-center gap-2 text-xs",
                                  requirement.met
                                    ? "text-emerald-600"
                                    : "text-muted-foreground"
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    requirement.met
                                      ? "bg-emerald-600"
                                      : "bg-muted"
                                  )}
                                />
                                {requirement.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Account types field */}

                        <div className="space-y-2">
                          <label className={labelBase}>Account type</label>
                          <div
                            className="grid grid-cols-2 gap-3"
                            role="radiogroup"
                            aria-label="Account type"
                          >
                            {roleOptions.map((role) => {
                              const Icon = role.icon
                              const isSelected = form.role === role.value

                              return (
                                <button
                                  key={role.value}
                                  type="button"
                                  onClick={() =>
                                    updateForm({ role: role.value })
                                  }
                                  className={cn(
                                    "flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all",
                                    isSelected
                                      ? "border-[#167D9A] bg-[#167D9A]/5 text-[#167D9A]"
                                      : "border-input bg-background text-foreground hover:bg-muted"
                                  )}
                                  aria-checked={isSelected}
                                  role="radio"
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                                    <Icon
                                      size={16}
                                      strokeWidth={2}
                                      fill={
                                        isSelected ? "currentColor" : "none"
                                      }
                                    />
                                  </div>
                                  <span className="text-xs font-medium">
                                    {role.label}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {role.desc}
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {submitMessage && (
                          <div
                            className="flex items-start gap-2 rounded-lg border border-border bg-muted p-3 text-sm text-muted-foreground"
                            role="status"
                          >
                            <AlertCircle
                              size={16}
                              strokeWidth={2}
                              className="mt-0.5 shrink-0"
                            />
                            {submitMessage}
                          </div>
                        )}

                        <Button
                          type="submit"
                          className={`${btnPrimary} w-full`}
                          disabled={isSubmitting || isGoogleLoading}
                        >
                          {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                        </Button>
                      </form>

                      <div className="mt-5">
                        <div className="relative mb-5">
                          <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                          </div>
                          <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-3 text-muted-foreground">
                              Or continue with
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="w-full gap-3"
                          onClick={handleGoogleSignUp}
                          disabled={isGoogleLoading || isSubmitting}
                        >
                          <svg
                            viewBox="0 0 48 48"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path
                              fill="#EA4335"
                              d="M24 9.5c3.5 0 6.3 1.2 8.5 3.2l6.3-6.3C35 2.5 30 0.5 24 0.5 14.8.5 6.9 5.8 3.1 13.5l7.4 5.7C12.3 13.1 17.7 9.5 24 9.5Z"
                            />
                            <path
                              fill="#4285F4"
                              d="M46.1 24.5c0-1.6-.2-3.2-.5-4.7H24v9h12.4c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.4-4.1 7.1-10.1 7.1-17.2Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M10.5 28.8a14.5 14.5 0 0 1 0-9.6l-7.4-5.7a23.5 23.5 0 0 0 0 21l7.4-5.7Z"
                            />
                            <path
                              fill="#34A853"
                              d="M24 47.5c6 0 11-2 14.7-5.8l-7.4-5.7c-2 1.4-4.5 2.2-7.3 2.2-6.3 0-11.7-3.6-13.5-9.2l-7.4 5.7C6.9 42.2 14.8 47.5 24 47.5Z"
                            />
                          </svg>

                          {isGoogleLoading
                            ? "Connecting to Google..."
                            : "Continue with Google"}
                        </Button>
                      </div>

                      <p className="mt-8 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                          href="/sign-in"
                          className="text-brand-teal font-medium hover:underline"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SignUpPage
