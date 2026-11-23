
"use client"

import Link from "next/link"
import { Suspense, useState } from "react"
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
  "inline-flex items-center justify-center rounded-lg border border-transparent bg-[#167D9A] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#0f5f7a] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50"

const inputBase =
  "flex w-full items-center rounded-lg border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

const labelBase = "mb-2 block text-sm font-medium text-foreground"
const fieldError = "text-sm text-destructive mt-1"

type FormErrors = {
  email?: string
  password?: string
}

const SignInForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const redirectTo = searchParams.get("redirect") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitMessage, setSubmitMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

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

    if (!validate() || isSubmitting || isGoogleLoading) {
      setSubmitMessage("")
      return
    }

    setIsSubmitting(true)

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
      toast.success("Signed in successfully!")

      router.replace(redirectTo)
      router.refresh()
    } catch (error) {
      console.error("Sign In Error:", error)
      toast.error("Something went wrong. Please try again.")
      setSubmitMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading || isSubmitting) return

    setIsGoogleLoading(true)
    setSubmitMessage("")

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      })

      if (error) {
        toast.error(error.message || "Google Sign In failed.")
        setSubmitMessage(error.message || "Google Sign In failed.")
        setIsGoogleLoading(false)
      }
    } catch (error) {
      console.error("Google Sign In Error:", error)
      toast.error("Google Sign In failed. Please try again.")
      setSubmitMessage("Google Sign In failed. Please try again.")
      setIsGoogleLoading(false)
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
                              setErrors({
                                ...errors,
                                email: undefined,
                              })
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
                                setErrors({
                                  ...errors,
                                  password: undefined,
                                })
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
                          disabled={isSubmitting || isGoogleLoading}
                        >
                          {isSubmitting ? "Signing In..." : "Sign In"}
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
                          onClick={handleGoogleSignIn}
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center bg-background">
          Loading...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  )
}
