
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

  useEffect(() => {
    const { fullName, email, role } = form

    saveForm({ fullName, email, role })

    console.log("[RepairLagbe] Sign Up Input:", {
      fullName,
      email,
      role,
    })
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
      newErrors.password =
        "Password must contain at least one uppercase letter"
    } else if (!/[a-z]/.test(form.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

 

const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault()

  if (!validate()) {
    setSubmitMessage("")
    return
  }

  try {
    const { data, error } = await authClient.signUp.email({
      name: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
      callbackURL: "/",
    })

    if (error) {
  console.error("SIGN UP ERROR:", error)
  console.error("ERROR MESSAGE:", error.message)
  setSubmitMessage(error.message || "Sign Up failed.")
  return
}

console.log("SIGN UP SUCCESS")
setSubmitMessage("Account created successfully!")
  } catch (error) {
    console.error("Sign Up Exception:", error)
    setSubmitMessage("Something went wrong. Please try again.")
  }
}



  const passwordRequirements = [
    { text: "At least 6 characters", met: form.password.length >= 6 },
    { text: "One uppercase letter", met: /[A-Z]/.test(form.password) },
    { text: "One lowercase letter", met: /[a-z]/.test(form.password) },
  ]

  return (
    <div className="min-h-svh flex flex-col bg-background">
      <nav className="sticky top-0 z-50 w-full border-b border-background/50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              aria-label="RepairLagbe homepage"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                <Wrench size={20} strokeWidth={2} />
              </div>
              <span className="font-semibold text-[#102A43] tracking-tight text-lg">
                RepairLagbe
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <div className="bg-brand-bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold mb-6">
                  <Wrench size={14} strokeWidth={2} />
                  Join RepairLagbe
                </div>

                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
                  Create your account
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Create an account to access RepairLagbe home repair services.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
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

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-brand-amber/10 flex items-center justify-center text-amber-600">
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
                      <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                          <User size={24} strokeWidth={2} />
                        </div>
                      </div>

                      <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
                        Sign Up
                      </h2>

                      <p className="text-center text-muted-foreground text-sm mb-8">
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
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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

                          <div className="space-y-1 mt-2">
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
                                    "w-1.5 h-1.5 rounded-full",
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
                               {/* {Account types field } */}


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
                                  onClick={() => updateForm({ role: role.value })}
                                  className={cn(
                                    "flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition-all",
                                    isSelected
                                      ? "border-[#167D9A] bg-[#167D9A]/5 text-[#167D9A]"
                                      : "border-input bg-background hover:bg-muted text-foreground"
                                  )}
                                  aria-checked={isSelected}
                                  role="radio"
                                >
                                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                    <Icon
                                      size={16}
                                      strokeWidth={2}
                                      fill={isSelected ? "currentColor" : "none"}
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
                            className="flex items-start gap-2 p-3 rounded-lg bg-muted border border-border text-muted-foreground text-sm"
                            role="status"
                          >
                            <AlertCircle
                              size={16}
                              strokeWidth={2}
                              className="shrink-0 mt-0.5"
                            />
                            {submitMessage}
                          </div>
                        )}

                        <Button
                          type="submit"
                          className={`${btnPrimary} w-full`}
                        >
                          Create Account
                        </Button>
                      </form>

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
