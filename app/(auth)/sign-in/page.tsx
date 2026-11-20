"use client"

import Link from "next/link"
import { useState } from "react"
import type { FormEvent } from "react"
import {
  Lock,
  Eye,
  EyeOff,
  Wrench,
  User,
  BriefcaseBusiness,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"


const btnPrimary =
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-[#167D9A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0f5f7a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"

const inputBase =
  "flex w-full items-center rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

const labelBase = "mb-2 block text-sm font-medium text-foreground"
const fieldError = "text-sm text-destructive mt-1"

type FormErrors = {
  email?: string
  password?: string
}

const SignInPage = () => {
const searchParams = useSearchParams()
const router = useRouter()

const redirectTo = searchParams.get("redirect") || "/"


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitMessage, setSubmitMessage] = useState("")

  const validate = () => {
    const newErrors: FormErrors = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validate()) {
      setSubmitMessage("")
      return
    }

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
        callbackURL: redirectTo,
      })

      if (error) {
        console.error("Sign In Error:", error)
        toast.error(error.message || "Invalid email or password.")
        setSubmitMessage(error.message || "Invalid email or password.")
        return
      }
      console.log("Sign In Successful", data)
      setSubmitMessage("Signed in successfully!")
    } catch (error) {
      console.error("Sign In Error:", error)
      setSubmitMessage("Something went wrong. Please try again.")
    }
  }

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
                  Welcome back
                </div>

                <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                  Sign in to your account
                </h1>

                <p className="mb-8 max-w-md text-lg text-muted-foreground">
                  Enter your email and password to access your RepairLagbe
                  account and manage your service bookings.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="bg-brand-teal/10 text-brand-teal flex h-10 w-10 items-center justify-center rounded-lg">
                      <Lock size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Secure access
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Access your RepairLagbe account securely.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                    <div className="bg-brand-teal/10 text-brand-teal flex h-10 w-10 items-center justify-center rounded-lg">
                      <BriefcaseBusiness size={20} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Manage your services
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Access your bookings and account information.
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
                        Sign In
                      </h2>

                      <p className="mb-8 text-center text-sm text-muted-foreground">
                        Welcome back to RepairLagbe
                      </p>

                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="email" className={labelBase}>
                            Email address
                          </label>

                          <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              setErrors({ ...errors, email: undefined })
                              setSubmitMessage("")
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
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value)
                                setErrors({ ...errors, password: undefined })
                                setSubmitMessage("")
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
                              onClick={() => setShowPassword(!showPassword)}
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
                        >
                          Sign In
                        </Button>
                      </form>

                      <p className="mt-8 text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link
                          href="/sign-up"
                          className="text-brand-teal font-medium hover:underline"
                        >
                          Create an account
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

export default SignInPage
