"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { X, Calendar, Clock } from "lucide-react"
import { shouldReduceAnimations, isMobile } from "@/lib/mobileOptimization"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// Enhanced countdown with modern timer to January 29th
export default function EnhancedCountdown() {
  const posters = [1, 2, 3, 4, 5].map((i) => `/poster/poster${i}.png`)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  // Use refs instead of state to avoid re-renders
  const timeLeftRef = useRef<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const daysRef = useRef<HTMLSpanElement>(null)
  const hoursRef = useRef<HTMLSpanElement>(null)
  const minutesRef = useRef<HTMLSpanElement>(null)
  const secondsRef = useRef<HTMLSpanElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollRef = useRef(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Memoize performance settings
  const mobile = useMemo(() => isMobile(), [])
  const reducedMotion = useMemo(() => shouldReduceAnimations(), [])

  // Target date: January 29th, 2026
  const targetDate = new Date('2026-01-29T00:00:00').getTime()

  // Countdown timer logic - uses direct DOM updates to avoid React re-renders
  useEffect(() => {
    const updateDisplay = (days: number, hours: number, minutes: number, seconds: number) => {
      // Update refs
      timeLeftRef.current = { days, hours, minutes, seconds }
      
      // Direct DOM updates - no React re-render
      if (daysRef.current) daysRef.current.textContent = String(days).padStart(2, '0')
      if (hoursRef.current) hoursRef.current.textContent = String(hours).padStart(2, '0')
      if (minutesRef.current) minutesRef.current.textContent = String(minutes).padStart(2, '0')
      if (secondsRef.current) secondsRef.current.textContent = String(seconds).padStart(2, '0')
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        // Only update DOM if values changed
        const current = timeLeftRef.current
        if (
          current.days !== days ||
          current.hours !== hours ||
          current.minutes !== minutes ||
          current.seconds !== seconds
        ) {
          updateDisplay(days, hours, minutes, seconds)
        }
      } else {
        updateDisplay(0, 0, 0, 0)
      }
    }

    // Initial calculation
    calculateTimeLeft()
    
    // Update every second - but only updates DOM, no React re-renders
    timerRef.current = setInterval(calculateTimeLeft, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [targetDate])

  const goTo = (nextIndex: number) => {
    const total = posters.length
    const index = ((nextIndex % total) + total) % total
    setCurrentIndex(index)
  }

  const next = () => goTo(currentIndex + 1)
  const prev = () => goTo(currentIndex - 1)

  useEffect(() => {
    // Preload all posters in the background to reduce perceived delay
    posters.forEach((src) => {
      const img = new window.Image()
      img.decoding = "async"
      img.loading = "eager"
      img.src = src
    })
  }, [])

  useEffect(() => {
    if (isPaused) return
    if (autoplayRef.current) clearInterval(autoplayRef.current)
    autoplayRef.current = setInterval(() => {
      setCurrentIndex((idx) => (idx + 1) % posters.length)
    }, 2500)
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [isPaused, posters.length])

  // Wheel scroll switches posters (natural to the request)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastScrollRef.current < 400) return
      lastScrollRef.current = now
      if (e.deltaY > 0 || e.deltaX > 0) next()
      else prev()
    }
    el.addEventListener("wheel", onWheel, { passive: true })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  // Basic swipe for touch devices
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    
    let startX = 0
    let startY = 0
    let isScrolling = false
    
    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      isScrolling = false
    }
    
    const onMove = (e: TouchEvent) => {
      if (!isScrolling) {
        const deltaX = Math.abs(e.touches[0].clientX - startX)
        const deltaY = Math.abs(e.touches[0].clientY - startY)
        isScrolling = deltaY > deltaX
      }
    }
    
    const onEnd = (e: TouchEvent) => {
      if (isScrolling) return
      
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) < 30) return
      
      if (dx < 0) next()
      else prev()
    }
    
    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchmove", onMove, { passive: true })
    el.addEventListener("touchend", onEnd, { passive: true })
    
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchmove", onMove)
      el.removeEventListener("touchend", onEnd)
    }
  }, [])

  return (
    <>
      {/* Modern Countdown Timer */}
      <div className="relative w-full py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Countdown Header */}
            <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <motion.div
                className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-pink-500/20 border border-orange-400/30 backdrop-blur-sm mb-3 sm:mb-4"
                animate={reducedMotion || mobile ? {} : { 
                  boxShadow: [
                    "0 0 15px rgba(255, 140, 66, 0.3)",
                    "0 0 20px rgba(255, 140, 66, 0.4)",
                    "0 0 15px rgba(255, 140, 66, 0.3)"
                  ]
                }}
                transition={reducedMotion || mobile ? {} : { duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-400" />
                <span className="text-xs sm:text-sm md:text-base font-semibold text-orange-200">
                  Event Countdown
                </span>
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-orange-400" />
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 bg-clip-text text-transparent mb-2 px-2">
                Time Until HIZE 2026
              </h3>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-orange-200/80 font-serif px-2">
                January 29th, 2026 • SRM Institute of Science & Technology
              </p>
            </div>

            {/* Countdown Display */}
            <div className="relative p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-black/80 via-zinc-900/90 to-black/80 backdrop-blur-2xl border border-orange-500/30 shadow-2xl">
              {/* Animated background gradient - simplified for mobile */}
              <motion.div
                className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-orange-400 opacity-30"
                animate={reducedMotion || mobile ? {} : {
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={reducedMotion || mobile ? {} : {
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
                {[
                  { label: 'Days', ref: daysRef, color: 'from-orange-500 to-orange-400', index: 0 },
                  { label: 'Hours', ref: hoursRef, color: 'from-orange-400 to-pink-500', index: 1 },
                  { label: 'Minutes', ref: minutesRef, color: 'from-pink-500 to-orange-500', index: 2 },
                  { label: 'Seconds', ref: secondsRef, color: 'from-orange-600 to-orange-400', index: 3 }
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: item.index * 0.1, duration: 0.6 }}
                  >
                    <div className="relative mb-2 sm:mb-3 md:mb-4">
                      <motion.div
                        className={`relative p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} shadow-lg`}
                        animate={reducedMotion || mobile ? {} : (item.label === 'Seconds' ? {
                          scale: [1, 1.02, 1],
                        } : {})}
                        transition={reducedMotion || mobile ? {} : (item.label === 'Seconds' ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear"
                        } : {})}
                      >
                        <span
                          ref={item.ref}
                          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-black text-white block leading-none"
                        >
                          00
                        </span>
                        
                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] animate-pulse" />
                      </motion.div>
                      
                      {/* Glow effect */}
                      <div className={`absolute -inset-1 sm:-inset-2 rounded-xl sm:rounded-2xl bg-gradient-to-br ${item.color} blur-lg sm:blur-xl opacity-30 -z-10`} />
                    </div>
                    
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-orange-200 uppercase tracking-wider">
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Event details */}
              <motion.div
                className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t border-orange-500/20 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 text-xs sm:text-sm md:text-base text-orange-200/90">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-400 animate-pulse" />
                    <span>3-Day Event</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-pink-400 animate-pulse" />
                    <span>Multiple Competitions</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 animate-pulse" />
                    <span>Expert Speakers</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Posters Section */}
      <div
        ref={containerRef}
        className="relative w-full py-4 sm:py-6 md:py-8 lg:py-10 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="mx-auto max-w-6xl px-3 sm:px-4 md:px-6">
          <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[900px] aspect-square overflow-hidden rounded-2xl sm:rounded-3xl border border-orange-500/20 bg-black will-change-transform">
            {posters.map((src, i) => (
              <motion.div
                key={src}
                className="absolute inset-0"
                style={{ willChange: "opacity" }}
                animate={{ opacity: i === currentIndex ? 1 : 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                onClick={() => i === currentIndex && setLightboxImage(src)}
              >
                <Image
                  src={src}
                  alt={`Poster ${i + 1}`}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, (max-width: 1024px) 600px, (max-width: 1280px) 800px, 900px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9JyMyMjIyMjInLz48L3N2Zz4="
                  style={{ objectFit: "contain" }}
                  unoptimized
                />
              </motion.div>
            ))}

            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/20" />

            <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
              {posters.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to poster ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-8 bg-orange-400" : "w-3 bg-white/40"
                  }`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>

            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-3 md:px-4">
              <button
                aria-label="Previous poster"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-sm text-sm sm:text-base md:text-lg"
                onClick={prev}
              >
                ‹
              </button>
              <button
                aria-label="Next poster"
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-sm text-sm sm:text-base md:text-lg"
                onClick={next}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
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
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-500/50 bg-black">
              <img
                src={lightboxImage}
                alt="Poster enlarged"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-orange-500/30 rounded-3xl pointer-events-none" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
