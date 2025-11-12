"use client"

import { Button } from "@/components/ui/button"
import Script from "next/script"

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function PaymentModal({ amount }: { amount: number }) {
  const handlePayment = async () => {
    const order = await fetch("/api/create-order", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }).then((r) => r.json())

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "College Registration",
      description: "Event Registration Payment",
      order_id: order.id,
      handler: function (response: any) {
        alert("Payment Successful!")
        console.log(response)
      },
      theme: { color: "#262424" },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Button onClick={handlePayment} className="bg-[#EEE5DA] text-[#262424] border border-[#262424]">
        Pay ₹{amount}
      </Button>
    </>
  )
}
