"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface Speaker {
  name: string
  title?: string
  image?: string
  bio?: string
}

// Inline SpeakerCard component
function SpeakerCard({
  speaker,
  index,
  onClick,
}: {
  speaker: Speaker
  index?: number
  onClick?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index ?? 0) * 0.15, duration: 0.7 }}
      whileHover={{ y: -8 }}
      className="
        clay-card group relative cursor-pointer rounded-3xl overflow-hidden
        border border-orange-500/20 bg-gradient-to-br from-black/60 to-zinc-900/60 
        backdrop-blur-xl
      "
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      aria-label={`View details for ${speaker.name}${speaker.title ? `, ${speaker.title}` : ''}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-zinc-900 to-black">
        {speaker.image ? (
          <img
            src={speaker.image}
            alt={`${speaker.name} - ${speaker.title || 'Speaker'}`}
            className="
              w-full h-full object-cover object-center
              transition-all duration-700 ease-out
              group-hover:scale-110
            "
            loading="lazy"
            style={{ filter: 'grayscale(100%)' }}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-900/20 to-orange-950/20">
            <div className="text-6xl font-bold text-orange-500/30">
              {speaker.name.charAt(0)}
            </div>
          </div>
        )}

        <div className="
          absolute inset-0 
          bg-gradient-to-t from-black via-black/50 to-transparent
          transition-all duration-700
        " />

        <div className="
          absolute inset-0 opacity-0 group-hover:opacity-100
          transition-opacity duration-500
          ring-2 ring-inset ring-orange-500/50
          rounded-3xl pointer-events-none
        " />

        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
              {speaker.name}
            </h3>
            {speaker.title && (
              <p className="text-sm text-orange-200 font-serif line-clamp-2 drop-shadow-lg mt-1">
                {speaker.title}
              </p>
            )}
          </div>
        </div>
      </div>

      <motion.div
        className="absolute -inset-[1px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
      />
    </motion.div>
  )
}

// Mock Navigation component
function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent truncate">
            IEEE CS SYP HIZE 2026
          </h1>
          <div className="hidden sm:flex gap-4 md:gap-6">
            <a href="/" className="text-orange-200 hover:text-orange-400 transition-colors text-sm md:text-base">Home</a>
            <a href="/guests" className="text-orange-400 font-bold text-sm md:text-base">Guests</a>
            <a href="/register" className="text-orange-200 hover:text-orange-400 transition-colors text-sm md:text-base">Register</a>
          </div>
          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button className="text-orange-200 hover:text-orange-400 transition-colors p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function GuestsPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch("/data/speakers.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load speakers")
        return res.json()
      })
      .then((data) => {
        if (mounted) setSpeakers(data || [])
      })
      .catch(() => {
        if (mounted) setSpeakers([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  // Escape key handler for lightbox
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedSpeaker(null)
    }

    if (selectedSpeaker) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [selectedSpeaker])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-20 sm:py-24 md:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3 sm:space-y-4 mb-8 sm:mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
            GUESTS
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl">
            Meet our distinguished speakers and industry experts.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-16 sm:py-20 md:py-24 text-center">
            <div className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border-3 sm:border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-orange-200/60 mt-3 sm:mt-4 text-sm sm:text-base">Loading speakers…</p>
          </div>
        ) : speakers.length === 0 ? (
          <div className="py-16 sm:py-20 md:py-24 text-center">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🎤</div>
            <p className="text-orange-200/60 text-base sm:text-lg">No speakers announced yet.</p>
            <p className="text-orange-200/40 text-xs sm:text-sm mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl w-full">
              {speakers.map((speaker, index) => (
                <SpeakerCard
                  key={speaker.name || index}
                  speaker={speaker}
                  onClick={() => speaker.image && setSelectedSpeaker(speaker)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-orange-500/20 mt-12 sm:mt-16 md:mt-20 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 text-center text-xs sm:text-sm text-orange-200/60">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedSpeaker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedSpeaker(null)}
          >
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-[10000] p-2 sm:p-3 rounded-full bg-orange-600 hover:bg-orange-500 transition-colors shadow-2xl shadow-orange-500/50"
              onClick={() => setSelectedSpeaker(null)}
              aria-label="Close lightbox"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[95vh] sm:max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-orange-500/50 bg-gradient-to-br from-zinc-900 to-black">
                {selectedSpeaker.image && (
                  <img
                    src={selectedSpeaker.image}
                    alt={`${selectedSpeaker.name} - ${selectedSpeaker.title || 'Speaker'}`}
                    className="w-full max-h-[60vh] sm:max-h-[70vh] object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 70vw"
                  />
                )}

                {/* Speaker Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                    {selectedSpeaker.name}
                  </h2>
                  {selectedSpeaker.title && (
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-orange-200/90 font-serif">
                      {selectedSpeaker.title}
                    </p>
                  )}
                  {selectedSpeaker.bio && (
                    <p className="text-xs sm:text-sm md:text-base text-orange-100/70 mt-2 sm:mt-3 md:mt-4 leading-relaxed">
                      {selectedSpeaker.bio}
                    </p>
                  )}
                </div>
              </div>

              <motion.div
                className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-orange-600/30 via-orange-500/30 to-orange-600/30 rounded-2xl sm:rounded-3xl blur-2xl sm:blur-3xl -z-10"
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
    </div>
  )
}