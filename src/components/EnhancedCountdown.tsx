"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const timeUnitImages = [
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1181316/pexels-photo-1181316.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1200"
]

export default function EnhancedCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)
  const [prevTime, setPrevTime] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const targetDate = new Date("2026-06-01T00:00:00").getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const newTime = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
        setPrevTime(timeLeft)
        setTimeLeft(newTime)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  if (!mounted) {
    return null
  }

  const TimeUnit = ({ value, prevValue, label, imageIndex }: { value: number; prevValue: number; label: string; imageIndex: number }) => {
    const progress = ((value % 60) / 60) * 360

    return (
      <div className="relative flex flex-col items-center group cursor-pointer">
        <motion.div
          className="relative overflow-hidden rounded-full"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onClick={() => setLightboxImage(timeUnitImages[imageIndex])}
        >
          <svg className="absolute inset-0 w-32 h-32 -rotate-90 z-10 pointer-events-none" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#gradient-bg)"
              strokeWidth="4"
              opacity="0.3"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="url(#gradient-active)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 360 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                strokeDasharray: 352,
                strokeDashoffset: 352 * (1 - progress / 360),
              }}
            />
            <defs>
              <linearGradient id="gradient-bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b1a" />
                <stop offset="50%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#ff6b1a" />
              </linearGradient>
              <linearGradient id="gradient-active" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff6b1a" />
                <stop offset="50%" stopColor="#ff8c42" />
                <stop offset="100%" stopColor="#ff6b1a" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-black">
            <div className="absolute inset-2 rounded-full overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-125"
                style={{
                  backgroundImage: `url(${timeUnitImages[imageIndex]})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 group-hover:from-black/30 group-hover:via-black/10 group-hover:to-black/50 transition-all duration-700" />
            </div>

            <div className="relative w-full h-full flex items-center justify-center z-10 pointer-events-none">
              <div className="relative w-24 h-24 perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={value}
                    initial={{ rotateX: -90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    exit={{ rotateX: 90, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white font-mono drop-shadow-[0_0_20px_rgba(0,0,0,1)]">
                      {String(value).padStart(2, "0")}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600/40 via-orange-500/40 to-orange-600/40 blur-xl group-hover:from-orange-500/80 group-hover:via-orange-400/80 group-hover:to-orange-500/80 transition-all duration-700"
            initial={{ opacity: 0.4 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-sm md:text-base text-orange-300/80 uppercase tracking-widest font-semibold"
        >
          {label}
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-wrap items-center justify-center gap-8 md:gap-12 py-12"
      >
        <TimeUnit value={timeLeft.days} prevValue={prevTime.days} label="Days" imageIndex={0} />
        <TimeUnit value={timeLeft.hours} prevValue={prevTime.hours} label="Hours" imageIndex={1} />
        <TimeUnit value={timeLeft.minutes} prevValue={prevTime.minutes} label="Minutes" imageIndex={2} />
        <TimeUnit value={timeLeft.seconds} prevValue={prevTime.seconds} label="Seconds" imageIndex={3} />
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 z-[10000] p-3 rounded-full bg-orange-600 hover:bg-orange-500 transition-colors shadow-2xl shadow-orange-500/50"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-500/50">
                <img
                  src={lightboxImage}
                  alt="Enlarged view"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-orange-500/30 rounded-3xl pointer-events-none" />
              </div>
              
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-orange-600/30 via-orange-500/30 to-orange-600/30 rounded-3xl blur-3xl -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
