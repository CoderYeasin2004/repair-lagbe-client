"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { getMyBookings } from "@/lib/api/services"
import { Badge } from "@/components/ui/badge"

import {
  BookingPageContent,
  BookingsErrorState,
  BookingsLoadingState,
  SignInRequiredState,
} from "./_components/booking-components"

import type {
  CustomerBooking,
} from "@/lib/utils"

const MyBookingsPage = () => {
  const { data: session, isPending } = useSession()

  const [bookings, setBookings] = useState<CustomerBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const customerEmail = session?.user?.email

  const handleRetry = () => {
  setErrorMessage(null)
  setReloadToken((previousToken) => previousToken + 1)
}

const handlePayNow = (bookingId: string) => {
  console.log("Pay Now clicked:", bookingId)
}


 useEffect(() => {
  if (!customerEmail) return

  let isMounted = true

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const response = await getMyBookings(customerEmail)

      if (isMounted) {
        const bookingList = Array.isArray(response?.bookings)
          ? response.bookings
          : []

        setBookings(bookingList)
      }
    } catch (error) {
      if (isMounted) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to load bookings."
        )
      }
    } finally {
      if (isMounted) {
        setIsLoading(false)
      }
    }
  }

  fetchBookings()

  return () => {
    isMounted = false
  }
}, [customerEmail, reloadToken])

  const showLoading = isPending || (Boolean(customerEmail) && isLoading)

  const renderBookings = () => {
    if (showLoading) {
      return <BookingsLoadingState />
    }

    if (!customerEmail) {
      return <SignInRequiredState />
    }

    if (errorMessage) {
      return (
        <BookingsErrorState
          message={errorMessage}
          onRetry={handleRetry}
        />
      )
    }

    return <BookingPageContent bookings={bookings} onPayNow={handlePayNow} />
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <nav className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="transition hover:text-[#167D9A]">
            Home
          </Link>

          <span>/</span>

          <span className="font-medium text-[#102A43]">
            My Bookings
          </span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Badge className="mb-3 border-0 bg-[#167D9A]/10 text-[#167D9A] hover:bg-[#167D9A]/10">
              Your bookings
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-[#102A43] sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Track the status of your repair requests and stay updated on
              every booking you have made.
            </p>
          </div>

          {!showLoading &&
            !errorMessage &&
            customerEmail &&
            bookings.length > 0 && (
              <div className="text-sm font-medium text-slate-500">
                {bookings.length} booking
                {bookings.length === 1 ? "" : "s"} found
              </div>
            )}
        </div>
      </section>

      {renderBookings()}
    </div>
  )
}

export default MyBookingsPage