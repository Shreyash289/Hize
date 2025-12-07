"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navigation from "@/components/Navigation"
import SpeakerCard, { Speaker } from "@/components/SpeakerCard"
import { X } from "lucide-react"

export default function GuestsPage() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
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

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">GUESTS</h1>
          <p className="text-xl text-muted-foreground font-serif max-w-2xl">
            Meet our distinguished speakers and industry experts.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-24 text-center text-muted-foreground">Loading speakers…</div>
        ) : speakers.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            No speakers available right now.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <div key={index}>
                <SpeakerCard
                  speaker={speaker}
                  index={index}
                  onClick={() => speaker.image && setLightboxImage(speaker.image)}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>

      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-6 right-6 z-[10000] p-3 rounded-full bg-orange-600 hover:bg-orange-500 transition-colors shadow-lg"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-4xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-3xl overflow-hidden border-4 border-orange-500/40 bg-black">
                <img
                  src={lightboxImage}
                  alt="Speaker"
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}