"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Navigation from "@/components/Navigation"
import { Mail, Phone } from "lucide-react"
import { useState, useEffect } from "react"

type FacultyContact = {
  name: string
  designation?: string
  role?: string
  email?: string
  phone?: string
  image?: string
  responsibilities?: string
}

export default function ContactPage() {
  const [faculty, setFaculty] = useState<FacultyContact[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch("/data/faculty.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load faculty.json")
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        setFaculty(Array.isArray(data) ? (data as FacultyContact[]) : [])
      })
      .catch(() => {
        if (mounted) setFaculty([])
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 mb-12 sm:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
            CONTACT
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl">
            Reach our faculty coordinators for HIZE 2026.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
            <p className="text-slate-400 mt-4">Loading contacts…</p>
          </div>
        ) : faculty && faculty.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-slate-400 text-lg">No faculty contacts available.</p>
            <p className="text-slate-500 text-sm mt-2">Try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {(faculty ?? []).map((coordinator, index) => (
              <motion.div
                key={coordinator.name + index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 space-y-5 sm:space-y-6 group"
              >
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-orange-500/30">
                    <Image
                      src={coordinator.image ?? "/faculty/placeholder.jpg"}
                      alt={coordinator.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 80px, (max-width: 1024px) 88px, 96px"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{coordinator.name}</h3>
                    <p className="text-sm sm:text-base text-slate-400 font-serif">{coordinator.designation || coordinator.role}</p>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-white/10">
                  <motion.a
                    href={`mailto:${coordinator.email ?? ""}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                    </div>
                    <span className="text-xs sm:text-sm font-mono break-all">{coordinator.email ?? "—"}</span>
                  </motion.a>

                  {coordinator.phone && (
                    <motion.a
                      href={`tel:+91${coordinator.phone.replace(/\s/g, '')}`}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                      </div>
                      <span className="text-xs sm:text-sm font-mono">+91 {coordinator.phone}</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-orange-500/20 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>
    </div>
  )
}