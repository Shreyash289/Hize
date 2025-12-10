"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'
import { Code2, Lightbulb, Mic2, Mail, Phone, ArrowDown, ChevronUp, X, FileText } from "lucide-react"
import Image from "next/image"
import dynamic from "next/dynamic"
import facultyContacts from "@/lib/facultyContacts"

// Lazy load heavy components for better initial load performance with loading states
const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>
})
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black"></div>
})
const ScrollProgress = dynamic(() => import("@/components/ScrollProgress"), { ssr: false })
const EnhancedCountdown = dynamic(() => import("@/components/EnhancedCountdown"), { 
  ssr: false,
  loading: () => <div className="h-32 bg-gradient-to-r from-orange-600/20 to-orange-400/20 rounded-2xl animate-pulse"></div>
})
const MagneticCursor = dynamic(() => import("@/components/MagneticCursor"), { ssr: false })
const Marquee = dynamic(() => import("react-fast-marquee").then(mod => ({ default: mod.default })), { 
  ssr: false,
  loading: () => <div className="h-20 bg-gradient-to-r from-orange-600/10 to-orange-400/10 rounded-xl animate-pulse"></div>
})
const SpeakerCard = dynamic(() => import('@/components/SpeakerCard'), { ssr: false })
const Navigation = dynamic(() => import('@/components/Navigation'), { ssr: false })
const Timeline = dynamic(() => import('@/components/Timeline'), { 
  ssr: false,
  loading: () => <div className="max-w-7xl mx-auto px-4 py-16"><div className="space-y-8">{[1,2,3].map(i => <div key={i} className="h-64 bg-gradient-to-br from-black/60 to-zinc-900/60 rounded-2xl animate-pulse"></div>)}</div></div>
})

interface Speaker {
  name: string
  title?: string
  image?: string
  bio?: string
  social?: {
    linkedin?: string
  }
}

interface EventItem {
  icon?: string
  title: string
  tags?: string[]
  description?: string
  color?: string
}

const ICON_MAP: Record<string, any> = {
  Code2,
  Lightbulb,
  Mic2,
} as const

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [eventsData, setEventsData] = useState<EventItem[] | null>(null) // null = loading, [] = loaded empty
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true
    let abortController = new AbortController()
    
    // Use static cache with revalidation for better performance
    fetch("/data/speakers.json", { 
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: abortController.signal
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load speakers")
        return res.json()
      })
      .then((data) => {
        if (mounted) setSpeakers(data as Speaker[])
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.warn('Failed to load speakers:', error)
        }
      })
    
    return () => {
      mounted = false
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let abortController = new AbortController()
    
    // Use static cache with revalidation for better performance
    fetch("/data/events.json", { 
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: abortController.signal
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load events")
        return res.json()
      })
      .then((data) => {
        if (mounted) {
          // Validate it's an array
          if (Array.isArray(data)) setEventsData(data as EventItem[])
          else setEventsData([])
        }
      })
      .catch((error) => {
        if (mounted && error.name !== 'AbortError') {
          console.warn('Failed to load events:', error)
          setEventsData([])
        }
      })
    
    return () => {
      mounted = false
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    let mounted = true
    let abortController = new AbortController()
    
    fetch("/data/student-team.json", { 
      cache: "force-cache",
      next: { revalidate: 3600 },
      signal: abortController.signal
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load student team")
        return res.json()
      })
      .then(data => {
        if (mounted) setStudents(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        if (mounted && error.name !== 'AbortError') {
          console.warn('Failed to load student team:', error)
          setStudents([])
        }
      })
    
    return () => {
      mounted = false
      abortController.abort()
    }
  }, []);

  const sections = ["Hero", "Events", "Guests", "Partners", "Previous Events", "Student Team", "Contact"]

  // Detect iOS device
  useEffect(() => {
    const checkIOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
             (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    }
    setIsIOS(checkIOS())
  }, [])

  useEffect(() => {
    if (!loadingComplete) return

    let ticking = false
    let rafId: number | null = null
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Only process if scroll position changed significantly
      if (Math.abs(currentScrollY - lastScrollY) < 10) return
      lastScrollY = currentScrollY

      if (!ticking) {
        rafId = requestAnimationFrame(() => {
          const scrollPosition = currentScrollY + window.innerHeight / 2

          sectionsRef.current.forEach((section, index) => {
            if (section) {
              const { offsetTop, offsetHeight } = section
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(prev => prev !== index ? index : prev)
              }
            }
          })
          ticking = false
        })
        ticking = true
      }
    }

    // Use passive listener for better scroll performance with throttling
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [loadingComplete])

  const scrollToSection = useCallback((index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (!loadingComplete) {
    return <LoadingScreen onLoadingComplete={() => setLoadingComplete(true)} />
  }

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden">
      <Navigation
        sections={sections}
        onSectionClick={scrollToSection}
        activeSection={activeSection}
      />
      <DynamicBackground />
      <MagneticCursor />
      <ScrollProgress
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <section
        ref={(el) => { sectionsRef.current[0] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-0 right-0 opacity-30 hidden md:block">
            <Marquee speed={80} gradient={false}>
              <span className="text-[80px] md:text-[120px] font-black text-orange-600/25 mx-4 md:mx-8">INNOVATE</span>
              <span className="text-[80px] md:text-[120px] font-black text-orange-500/25 mx-4 md:mx-8">CREATE</span>
              <span className="text-[80px] md:text-[120px] font-black text-orange-700/25 mx-4 md:mx-8">INSPIRE</span>
              <span className="text-[80px] md:text-[120px] font-black text-orange-400/25 mx-4 md:mx-8">CONNECT</span>
            </Marquee>
          </div>
          <div className="absolute bottom-[15%] left-0 right-0 opacity-30 hidden md:block">
            <Marquee speed={60} gradient={false} direction="right">
              <span className="text-[80px] md:text-[120px] font-black text-orange-500/25 mx-4 md:mx-8">LEARN</span>
              <span className="text-[80px] md:text-[120px] font-black text-orange-600/25 mx-4 md:mx-8">BUILD</span>
              <span className="text-[80px] md:text-[120px] font-black text-orange-700/25 mx-4 md:mx-8">COMPETE</span>
              <span className="text-[80px] md:text-[120px] font-black text-orange-400/25 mx-4 md:mx-8">EXCEL</span>
            </Marquee>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-12 max-w-6xl mx-auto relative z-10"
        >
          <motion.div className="relative">
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-[10rem] xl:text-[14rem] font-black tracking-tighter relative">
              <span className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent blur-2xl opacity-60">
                IEEE CS SYP HIZE
              </span>
              <span className="relative bg-gradient-to-r from-orange-600 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                IEEE CS SYP HIZE
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-orange-600 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-wider mt-2 md:mt-4"
            >
              2026
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative w-full"
          >
            <div className="px-4 sm:px-8 md:px-12 py-4 sm:py-5 md:py-6 rounded-2xl md:rounded-3xl bg-gradient-to-r from-orange-600/15 via-orange-500/15 to-orange-600/15 backdrop-blur-xl border border-orange-500/30">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 bg-clip-text text-transparent">
                HIGH IMPACT ZONAL EVENTS
              </h2>
            </div>
            <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-orange-600/30 via-orange-500/30 to-orange-600/30 rounded-2xl md:rounded-3xl blur-xl -z-10" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-orange-100/90 font-serif max-w-5xl mx-auto leading-relaxed px-4"
          >
            A flagship IEEE Computer Society initiative bringing together <span className="text-orange-500 font-bold">innovation</span>, <span className="text-orange-400 font-bold">technology</span>, and <span className="text-orange-300 font-bold">academic excellence</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 max-w-6xl mx-auto"
          >
            <div className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/40 to-zinc-900/40 backdrop-blur-xl border border-orange-500/20">
              <div className="space-y-4 sm:space-y-5 md:space-y-6 text-orange-100/90 font-serif leading-relaxed">
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  At the IEEE High Impact Zonal Events (HIZE), we don't just showcase the future — we create it. The stage is now set for our high-impact Zonal Events 2.0, led by <span className="text-orange-400 font-semibold">Abhinav Gambhir, Associate Director at Oracle</span>. This marks the culmination of an inspiring journey that has brought together some of the most creative and driven tech minds from across the country.
                </p>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Every edition of HIZE is built on a foundation of <span className="text-orange-500 font-semibold">excellence</span>, <span className="text-orange-400 font-semibold">inclusivity</span>, and <span className="text-orange-300 font-semibold">innovation</span>. From expert-led workshops and panel discussions to dynamic hackathons and startup showcases, the series cultivates a rich environment for skill development and networking. Participants not only gain technical mastery but also experience the collaborative energy that defines the IEEE ecosystem.
                </p>
                
                <p className="text-sm sm:text-base md:text-lg lg:text-xl">
                  Backed by the global legacy of IEEE and the forward-thinking vision of the IEEE Computer Society, HIZE has become one of India's most anticipated student-driven technology movements. It's more than just a set of events — it's a <span className="text-orange-500 font-semibold">transformative journey</span> that shapes today's learners into tomorrow's leaders.
                </p>
              </div>
              
              <motion.div
                className="absolute -inset-[1px] bg-gradient-to-r from-orange-600/20 via-orange-500/20 to-orange-600/20 rounded-3xl blur-xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <EnhancedCountdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="pt-12 flex flex-col items-center gap-4"
          >
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 font-black text-base sm:text-lg md:text-xl text-black shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all w-full sm:w-auto"
              >
                REGISTER NOW
              </motion.button>
            </Link>

            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-400/20 backdrop-blur-sm border-2 border-orange-500/30"
            >
              <ArrowDown className="w-7 h-7 text-orange-400" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <section
        ref={(el) => { sectionsRef.current[1] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              EVENTS
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl mx-auto px-4">
              Explore our lineup of competitions, workshops and keynotes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {eventsData === null ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-slate-400">Loading events…</p>
              </div>
            ) : eventsData.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12">
                <p className="text-slate-400">No events available.</p>
              </div>
            ) : (
              eventsData.map((event, index) => {
                const Icon = event.icon ? ICON_MAP[event.icon] ?? Code2 : Code2
                return (
                  <motion.div
                    key={event.title ?? index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                    className="group relative h-full flex flex-col"
                    style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
                  >
                    <div className="relative p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 overflow-hidden h-full flex flex-col">

                      <div className="relative z-10 flex flex-col flex-grow space-y-4 sm:space-y-5 md:space-y-6">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl ${event.color ?? "bg-gradient-to-br from-orange-600 to-orange-400"} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">{event.title}</h3>
                          <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-3 sm:mb-4">
                            {(event.tags ?? []).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 sm:px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs sm:text-sm font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm sm:text-base text-slate-400 font-serif leading-relaxed">
                            {event.description}
                          </p>
                        </div>

                        <button className="w-full py-2.5 sm:py-3 rounded-lg md:rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              EVENT TIMELINE
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl mx-auto px-4">
              Detailed schedule of all activities across the three days
            </p>
          </motion.div>
          <Timeline />
        </div>
      </section>

      <section
        ref={(el) => { sectionsRef.current[2] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12 md:mb-14"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              Meet the Visionaries
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 font-serif max-w-2xl mx-auto mb-0 px-4">
              Our distinguished guest speakers and tech thought leaders for HIZE.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {speakers.map((speaker, idx) => (
              <SpeakerCard
                key={speaker.name || idx}
                speaker={speaker}
                index={idx}
                onClick={() => setSelectedSpeaker(speaker)}
              />
            ))}
          </div>
        </div>
        {/* Speaker detail lightbox modal */}
        <AnimatePresence>
          {selectedSpeaker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl px-6"
              onClick={() => setSelectedSpeaker(null)}
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.23 }}
                className="relative max-w-2xl w-full rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-orange-500/30 p-0 overflow-hidden"
                onClick={e => e.stopPropagation()}
                style={{ willChange: "transform" }}
              >
                {/* Orange accent header bar */}
                <div className="h-2 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 mb-0" />
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-zinc-900/60 text-white hover:bg-zinc-900/80 shadow transition-colors"
                  onClick={() => setSelectedSpeaker(null)}
                  aria-label="Close"
                  type="button"
                >
                  <svg width="20" height="20" className="sm:w-[22px] sm:h-[22px]" fill="none" stroke="currentColor" strokeWidth="2.1" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 p-6 sm:p-8 md:p-10">
                  {selectedSpeaker.image && (
                    <img
                      src={selectedSpeaker.image}
                      alt={selectedSpeaker.name}
                      className="w-32 h-44 sm:w-40 sm:h-56 rounded-xl md:rounded-2xl object-cover object-center border border-orange-400/30 shadow-lg bg-neutral-900"
                      loading="eager"
                      decoding="async"
                    />
                  )}
                  <div className="flex-1 text-left w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedSpeaker.name}</h2>
                    {selectedSpeaker.title && (
                      <div className="text-base sm:text-lg font-semibold text-orange-200 mb-2">{selectedSpeaker.title}</div>
                    )}
                    {selectedSpeaker.bio && (
                      <p className="text-sm sm:text-base text-orange-100 mt-2 leading-relaxed whitespace-pre-line">{selectedSpeaker.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      
      <section
        ref={(el) => { sectionsRef.current[3] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              PARTNERS
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl mx-auto px-4">
              In collaboration with
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20"
          >
            <div className="text-center space-y-6 sm:space-y-7 md:space-y-8">
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold px-4">
                SRM Institute of Science & Technology
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-slate-400 font-mono px-4">
                Kattankulathur, Tamil Nadu, Chengalpattu, 603203, India
              </p>

              <div className="pt-4 sm:pt-6 md:pt-8">
                <Marquee speed={40} gradient={false} pauseOnHover={true}>
                  {["IEEE Computer Society", "SYP Activities", "School of Computing", "CTECH"].map((partner) => (
                    <motion.div
                      key={partner}
                      whileHover={{ scale: 1.05 }}
                      className="mx-4 sm:mx-6 md:mx-8 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg md:rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 backdrop-blur-sm border border-orange-500/30"
                    >
                      <p className="font-bold text-base sm:text-lg md:text-xl whitespace-nowrap">{partner}</p>
                    </motion.div>
                  ))}
                </Marquee>
              </div>
            </div>

            <motion.div
              className="absolute -inset-[1px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-3xl opacity-20 blur-2xl -z-10"
            />
          </motion.div>
        </div>
      </section>

      <section
        ref={(el) => { sectionsRef.current[4] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              PREVIOUS EVENTS
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl mx-auto px-4">
              Discover details about our past HIZE events and achievements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20"
          >
            <div className="text-center space-y-6 sm:space-y-7 md:space-y-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center shadow-lg mx-auto">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
              </div>

              <div className="px-4">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                  Previous HIZE Event Details
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-slate-400 font-serif max-w-3xl mx-auto leading-relaxed">
                  Get comprehensive insights into our previous HIZE event, including event highlights, 
                  participant achievements, keynote sessions, and memorable moments that made it a success.
                </p>
              </div>

              {/* Live Website Preview */}
              <div className="relative w-full mt-8">
                <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden bg-black/40 border border-orange-500/30 shadow-2xl">
                  <iframe
                    src="https://www.ieeecshize.com/events"
                    className="w-full h-full absolute inset-0"
                    title="Previous HIZE Events Website Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-black/20" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <motion.a
                    href="https://www.ieeecshize.com/events"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 font-bold text-base sm:text-lg text-black shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300"
                  >
                    Open in New Tab
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </motion.a>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-sm text-slate-500 font-mono">
                  Previous Event Information
                </p>
              </div>
            </div>

            <motion.div
              className="absolute -inset-[1px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-3xl opacity-20 blur-2xl -z-10"
            />
          </motion.div>
        </div>
      </section>
      
      <section
        ref={(el) => { sectionsRef.current[5] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-24"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10 sm:mb-12 md:mb-14"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              MEET THE STUDENT TEAM
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 font-serif max-w-2xl mx-auto mb-0 px-4">
              Our core student organizing team driving HIZE.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {students.map((student) => (
              <div key={student.name + student.role} className="relative p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 flex flex-col items-center text-center shadow-lg">
                <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-orange-500/30 mb-4 sm:mb-5 md:mb-6">
                  <Image
                    src={student.image}
                    alt={student.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, (max-width: 1024px) 88px, 96px"
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{student.name}</h3>
                <p className="text-orange-400 font-extrabold text-base sm:text-lg">{student.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section
        ref={(el) => { sectionsRef.current[6] = el }}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              CONTACT
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-orange-200/80 font-serif max-w-2xl mx-auto px-4">
              Reach our faculty coordinators for HIZE 2026
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {facultyContacts.map((coordinator, index) => (
              <motion.div
                key={coordinator.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="relative p-6 sm:p-7 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 space-y-5 sm:space-y-6"
              >
                <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                  <div className="relative w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-orange-500/30">
                    <Image
                      src={coordinator.image}
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
                    href={`mailto:${coordinator.email}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-mono break-all">{coordinator.email}</span>
                  </motion.a>

                  <motion.a
                    href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg md:rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-xs sm:text-sm font-mono">{coordinator.phone}</span>
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 py-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-slate-400">
                © 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology
              </p>
            </div>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center shadow-lg hover:shadow-orange-500/50 transition-shadow"
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/8 via-orange-500/5 to-transparent pointer-events-none" />
      </footer>

      {/* Lightbox for speaker images */}
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
                  loading="eager"
                  decoding="async"
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
    </div>
  )
}