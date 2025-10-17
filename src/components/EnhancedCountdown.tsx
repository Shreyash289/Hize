"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

// Posters carousel replacing the previous 4 circular countdown circles
export default function EnhancedCountdown() {
  const posters = [1, 2, 3, 4, 5].map((i) => `/poster/poster${i}.png`)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollRef = useRef(0)

  const goTo = (nextIndex: number) => {
    const total = posters.length
    const index = ((nextIndex % total) + total) % total
    setCurrentIndex(index)
  }

  const next = () => goTo(currentIndex + 1)
  const prev = () => goTo(currentIndex - 1)

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
    const onStart = (e: TouchEvent) => (startX = e.touches[0].clientX)
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      if (Math.abs(dx) < 30) return
      if (dx < 0) next()
      else prev()
    }
    el.addEventListener("touchstart", onStart, { passive: true })
    el.addEventListener("touchend", onEnd, { passive: true })
    return () => {
      el.removeEventListener("touchstart", onStart)
      el.removeEventListener("touchend", onEnd)
    }
  }, [])

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full py-10 select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative mx-auto w-full max-w-[900px] aspect-square overflow-hidden rounded-3xl border border-orange-500/20 bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={posters[currentIndex]}
                alt={`Poster ${currentIndex + 1}`}
                className="absolute inset-0 w-full h-full object-contain"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onClick={() => setLightboxImage(posters[currentIndex])}
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement
                  if (!img.dataset.fallback) {
                    img.dataset.fallback = "1"
                    img.src = img.src.replace("/poster/", "/posters/")
                  }
                }}
              />
            </AnimatePresence>

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

            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 md:px-4">
              <button
                aria-label="Previous poster"
                className="h-10 w-10 md:h-12 md:w-12 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-sm"
                onClick={prev}
              >
                ‹
              </button>
              <button
                aria-label="Next poster"
                className="h-10 w-10 md:h-12 md:w-12 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 border border-white/20 text-white backdrop-blur-sm"
                onClick={next}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
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
      </AnimatePresence>
    </>
  )
}
