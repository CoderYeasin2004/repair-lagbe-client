"use client"

import { CreditCard, LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

interface PayNowButtonProps {
  bookingId: string
  isLoading?: boolean
  onPayNow: (bookingId: string) => void
}

const PayNowButton = ({
  bookingId,
  isLoading = false,
  onPayNow,
}: PayNowButtonProps) => {
  return (
    <Button
      type="button"
      onClick={() => onPayNow(bookingId)}
      disabled={isLoading}
      className="w-full bg-[#167D9A] text-white hover:bg-[#102A43]"
    >
      {isLoading ? (
        <>
          <LoaderCircle className="size-4 animate-spin" />
          Redirecting...
        </>
      ) : (
        <>
          <CreditCard className="size-4" />
          Pay Now
        </>
      )}
    </Button>
  )
}

export default PayNowButton