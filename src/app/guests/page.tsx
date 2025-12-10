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
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
            IEEE CS SYP HIZE 2026
          </h1>
          <div className="flex gap-6">
            <a href="/" className="text-orange-200 hover:text-orange-400 transition-colors">Home</a>
            <a href="/guests" className="text-orange-400 font-bold">Guests</a>
            <a href="/register" className="text-orange-200 hover:text-orange-400 transition-colors">Register</a>
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

      <main className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
            GUESTS
          </h1>
          <p className="text-xl text-orange-200/80 font-serif max-w-2xl">
            Meet our distinguished speakers and industry experts.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-orange-200/60 mt-4">Loading speakers…</p>
          </div>
        ) : speakers.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">🎤</div>
            <p className="text-orange-200/60 text-lg">No speakers announced yet.</p>
            <p className="text-orange-200/40 text-sm mt-2">Check back soon for updates!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <SpeakerCard
                key={speaker.name || index}
                speaker={speaker}
                index={index}
                onClick={() => speaker.image && setSelectedSpeaker(speaker)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-orange-500/20 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-orange-200/60">
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
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedSpeaker(null)}
          >
            <button
              className="absolute top-6 right-6 z-[10000] p-3 rounded-full bg-orange-600 hover:bg-orange-500 transition-colors shadow-2xl shadow-orange-500/50"
              onClick={() => setSelectedSpeaker(null)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-500/50 bg-gradient-to-br from-zinc-900 to-black">
                {selectedSpeaker.image && (
                  <img
                    src={selectedSpeaker.image}
                    alt={`${selectedSpeaker.name} - ${selectedSpeaker.title || 'Speaker'}`}
                    className="w-full max-h-[70vh] object-contain"
                  />
                )}
                
                {/* Speaker Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/90 to-transparent">
                  <h2 className="text-4xl font-bold text-white mb-2">
                    {selectedSpeaker.name}
                  </h2>
                  {selectedSpeaker.title && (
                    <p className="text-xl text-orange-200/90 font-serif">
                      {selectedSpeaker.title}
                    </p>
                  )}
                  {selectedSpeaker.bio && (
                    <p className="text-orange-100/70 mt-4 leading-relaxed">
                      {selectedSpeaker.bio}
                    </p>
                  )}
                </div>
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
    </div>
  )
}