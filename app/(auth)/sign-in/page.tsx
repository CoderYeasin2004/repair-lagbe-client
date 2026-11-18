
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
      callbackURL: "/",
    })

    if (error) {
      console.error("Sign In Error:", error)
      setSubmitMessage(error.message || "Sign In failed. Please try again.")
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
                  Welcome back
                </div>

                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
                  Sign in to your account
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                  Enter your email and password to access your RepairLagbe
                  account and manage your service bookings.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
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

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                    <div className="w-10 h-10 rounded-lg bg-brand-teal/10 flex items-center justify-center text-brand-teal">
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
                      <div className="flex items-center justify-center mb-8">
                        <div className="w-12 h-12 rounded-xl bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                          <User size={24} strokeWidth={2} />
                        </div>
                      </div>

                      <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
                        Sign In
                      </h2>

                      <p className="text-center text-muted-foreground text-sm mb-8">
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
