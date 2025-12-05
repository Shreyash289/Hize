"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from 'next/link'
import { Code2, Lightbulb, Mic2, Mail, Phone, ArrowDown, ChevronUp, X, FileText, Download } from "lucide-react"
import facultyContacts from "@/lib/facultyContacts"
import LoadingScreen from "@/components/LoadingScreen"
import DynamicBackground from "@/components/DynamicBackground"
import ScrollProgress from "@/components/ScrollProgress"
import EnhancedCountdown from "@/components/EnhancedCountdown"
import MagneticCursor from "@/components/MagneticCursor"
import Marquee from "react-fast-marquee"

const events = [
  {
    icon: Code2,
    title: "Hackathon",
    tags: ["48 hrs", "Team"],
    description: "Build innovative solutions in an intense 48-hour coding marathon. Collaborate with talented developers and bring your ideas to life.",
    color: "from-orange-600 to-orange-400"
  },
  {
    icon: Lightbulb,
    title: "AI Workshop",
    tags: ["Intermediate", "Hands-on"],
    description: "Dive deep into artificial intelligence and machine learning with hands-on projects and expert guidance.",
    color: "from-orange-500 to-orange-300"
  },
  {
    icon: Mic2,
    title: "Keynote Series",
    tags: ["Leaders", "Trends"],
    description: "Hear from industry leaders about the latest trends, innovations, and future directions in technology.",
    color: "from-orange-700 to-orange-500"
  }
]

const speakers = [
  {
    name: "Speaker Name",
    title: "Title, Company",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200&fit=crop"
  },
  {
    name: "Speaker Name",
    title: "Title, Company",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&fit=crop"
  },
  {
    name: "Speaker Name",
    title: "Title, Company",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1200&fit=crop"
  }
]

// removed local placeholder coordinators — using canonical facultyContacts

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionsRef = useRef<HTMLElement[]>([])

  const sections = ["Hero", "Events", "Guests", "Partners", "Previous Events", "Contact"]

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

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + window.innerHeight / 2

          sectionsRef.current.forEach((section, index) => {
            if (section) {
              const { offsetTop, offsetHeight } = section
              if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                setActiveSection(index)
              }
            }
          })
          ticking = false
        })
        ticking = true
      }
    }

    // iOS Safari scroll optimization
    const scrollOptions = isIOS ? { passive: true } : false
    window.addEventListener("scroll", handleScroll, scrollOptions)
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [loadingComplete, isIOS])

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!loadingComplete) {
    return <LoadingScreen onLoadingComplete={() => setLoadingComplete(true)} />
  }

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-x-hidden">
      <DynamicBackground />
      <MagneticCursor />
      <ScrollProgress
        sections={sections}
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      <section
        ref={(el) => el && (sectionsRef.current[0] = el)}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-0 right-0 opacity-30">
            <Marquee speed={80} gradient={false}>
              <span className="text-[120px] font-black text-orange-600/25 mx-8">INNOVATE</span>
              <span className="text-[120px] font-black text-orange-500/25 mx-8">CREATE</span>
              <span className="text-[120px] font-black text-orange-700/25 mx-8">INSPIRE</span>
              <span className="text-[120px] font-black text-orange-400/25 mx-8">CONNECT</span>
            </Marquee>
          </div>
          <div className="absolute bottom-[15%] left-0 right-0 opacity-30">
            <Marquee speed={60} gradient={false} direction="right">
              <span className="text-[120px] font-black text-orange-500/25 mx-8">LEARN</span>
              <span className="text-[120px] font-black text-orange-600/25 mx-8">BUILD</span>
              <span className="text-[120px] font-black text-orange-700/25 mx-8">COMPETE</span>
              <span className="text-[120px] font-black text-orange-400/25 mx-8">EXCEL</span>
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
            <h1 className="text-8xl md:text-[14rem] font-black tracking-tighter relative">
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
              className="text-7xl md:text-8xl font-black bg-gradient-to-r from-orange-600 via-orange-400 to-orange-500 bg-clip-text text-transparent tracking-wider mt-4"
            >
              2026
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="px-12 py-6 rounded-3xl bg-gradient-to-r from-orange-600/15 via-orange-500/15 to-orange-600/15 backdrop-blur-xl border border-orange-500/30">
              <h2 className="text-3xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 bg-clip-text text-transparent">
                HIGH IMPACT ZONAL EVENTS
              </h2>
            </div>
            <div className="absolute -inset-3 bg-gradient-to-r from-orange-600/30 via-orange-500/30 to-orange-600/30 rounded-3xl blur-xl -z-10" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-3xl text-orange-100/90 font-serif max-w-5xl mx-auto leading-relaxed"
          >
            A flagship IEEE Computer Society initiative bringing together <span className="text-orange-500 font-bold">innovation</span>, <span className="text-orange-400 font-bold">technology</span>, and <span className="text-orange-300 font-bold">academic excellence</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 max-w-6xl mx-auto"
          >
            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-black/40 to-zinc-900/40 backdrop-blur-xl border border-orange-500/20">
              <div className="space-y-6 text-orange-100/90 font-serif leading-relaxed">
                <p className="text-lg md:text-xl">
                  At the IEEE High Impact Zonal Events (HIZE), we don't just showcase the future — we create it. The stage is now set for our high-impact Zonal Events 2.0, led by <span className="text-orange-400 font-semibold">Abhinav Gambhir, Associate Director at Oracle</span>. This marks the culmination of an inspiring journey that has brought together some of the most creative and driven tech minds from across the country.
                </p>
                
                <p className="text-lg md:text-xl">
                  Every edition of HIZE is built on a foundation of <span className="text-orange-500 font-semibold">excellence</span>, <span className="text-orange-400 font-semibold">inclusivity</span>, and <span className="text-orange-300 font-semibold">innovation</span>. From expert-led workshops and panel discussions to dynamic hackathons and startup showcases, the series cultivates a rich environment for skill development and networking. Participants not only gain technical mastery but also experience the collaborative energy that defines the IEEE ecosystem.
                </p>
                
                <p className="text-lg md:text-xl">
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
            <Link href="/register" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 font-black text-xl text-black shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all"
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
        ref={(el) => el && (sectionsRef.current[1] = el)}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              EVENTS
            </h2>
            <p className="text-xl text-orange-200/80 font-serif max-w-2xl mx-auto">
              Explore our lineup of competitions, workshops and keynotes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="group relative h-full flex flex-col"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 overflow-hidden h-full flex flex-col">

                  <div className="relative z-10 flex flex-col flex-grow space-y-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}>
                      <event.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-grow">
                      <h3 className="text-3xl font-bold mb-3">{event.title}</h3>
                      <div className="flex gap-2 flex-wrap mb-4">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-slate-400 font-serif leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <button className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={(el) => el && (sectionsRef.current[2] = el)}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              GUESTS
            </h2>
            <p className="text-xl text-orange-200/80 font-serif max-w-2xl mx-auto">
              Meet our distinguished speakers and industry experts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {speakers.map((speaker, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10 }}
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 cursor-pointer"
                onClick={() => setLightboxImage(speaker.image)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <div className="w-full h-full overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-125"
                      style={{
                        backgroundImage: `url(${speaker.image})`,
                        filter: "grayscale(100%)",
                      }}
                    />
                  </div>
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-orange-900/70 group-hover:via-orange-950/30 group-hover:to-transparent transition-all duration-700"
                  />
                </div>

                <div className="p-6 space-y-2">
                  <h3 className="text-2xl font-bold">{speaker.name}</h3>
                  <p className="text-slate-400 font-serif">{speaker.title}</p>
                </div>

                <motion.div
                  className="absolute -inset-[1px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={(el) => el && (sectionsRef.current[3] = el)}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              PARTNERS
            </h2>
            <p className="text-xl text-orange-200/80 font-serif max-w-2xl mx-auto">
              In collaboration with
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20"
          >
            <div className="text-center space-y-8">
              <h3 className="text-4xl md:text-5xl font-bold">
                SRM Institute of Science & Technology
              </h3>
              <p className="text-lg text-slate-400 font-mono">
                Kattankulathur, Tamil Nadu, Chengalpattu, 603203, India
              </p>

              <div className="pt-8">
                <Marquee speed={40} gradient={false} pauseOnHover={true}>
                  {["IEEE Computer Society", "SYP Activities", "School of Computing", "CTECH"].map((partner, index) => (
                    <motion.div
                      key={partner}
                      whileHover={{ scale: 1.05 }}
                      className="mx-8 px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-400/20 backdrop-blur-sm border border-orange-500/30"
                    >
                      <p className="font-bold text-xl whitespace-nowrap">{partner}</p>
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
        ref={(el) => el && (sectionsRef.current[4] = el)}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              PREVIOUS EVENTS
            </h2>
            <p className="text-xl text-orange-200/80 font-serif max-w-2xl mx-auto">
              Discover details about our past HIZE events and achievements
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20"
          >
            <div className="text-center space-y-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center shadow-lg mx-auto">
                <FileText className="w-12 h-12 text-white" />
              </div>

              <div>
                <h3 className="text-4xl md:text-5xl font-bold mb-4">
                  Previous HIZE Event Details
                </h3>
                <p className="text-lg text-slate-400 font-serif max-w-3xl mx-auto leading-relaxed">
                  Get comprehensive insights into our previous HIZE event, including event highlights, 
                  participant achievements, keynote sessions, and memorable moments that made it a success.
                </p>
              </div>

              <motion.a
                href="https://www.ieeecshize.com/events"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-orange-400 font-bold text-lg text-black shadow-2xl shadow-orange-500/50 hover:shadow-orange-500/70 transition-all duration-300"
              >
                View our previous events
              </motion.a>

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
        ref={(el) => el && (sectionsRef.current[5] = el)}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20"
      >
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 bg-clip-text text-transparent">
              CONTACT
            </h2>
            <p className="text-xl text-orange-200/80 font-serif max-w-2xl mx-auto">
              Reach our faculty coordinators for HIZE 2026
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {facultyContacts.map((coordinator, index) => (
              <motion.div
                key={coordinator.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="relative p-8 rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 space-y-6"
              >
                <div>
                  <h3 className="text-2xl font-bold mb-2">{coordinator.name}</h3>
                  <p className="text-slate-400 font-serif">{coordinator.designation || coordinator.role}</p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <motion.a
                    href={`mailto:${coordinator.email}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-600 to-orange-400 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-mono break-all">{coordinator.email}</span>
                  </motion.a>

                  <motion.a
                    href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-mono">{coordinator.phone}</span>
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