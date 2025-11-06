"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Set target date - adjust this to your event date
    const targetDate = new Date("2026-06-01T00:00:00").getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-6 md:gap-12 py-8">
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-7xl font-bold font-mono tracking-wider" style={{ color: "#ff8c00" }}>
            00
          </div>
          <div className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wide font-medium">
            Days
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-7xl font-bold font-mono tracking-wider" style={{ color: "#ff8c00" }}>
            00
          </div>
          <div className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wide font-medium">
            Hours
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-7xl font-bold font-mono tracking-wider" style={{ color: "#ff8c00" }}>
            00
          </div>
          <div className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wide font-medium">
            Minutes
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-5xl md:text-7xl font-bold font-mono tracking-wider" style={{ color: "#ff8c00" }}>
            00
          </div>
          <div className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wide font-medium">
            Seconds
          </div>
        </div>
      </div>
    )
  }

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div
        className="text-5xl md:text-7xl font-bold font-mono tracking-wider"
        style={{ color: "#ff8c00" }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <div className="text-sm md:text-base text-muted-foreground mt-2 uppercase tracking-wide font-medium">
        {label}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-6 md:gap-12 py-8"
    >
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </motion.div>
  )
}