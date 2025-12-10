"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import { Code2, Lightbulb, Mic2 } from "lucide-react"
import EventCard, { EventItem } from "@/components/EventCard"
import Timeline from "@/components/Timeline";


const ICON_MAP: Record<string, any> = {
  Code2,
  Lightbulb,
  Mic2,
}

// fallback defaults shown while events.json isn't available
const DEFAULT_EVENTS: EventItem[] = []

export default function EventsPage() {
  const [eventsData, setEventsData] = useState<EventItem[]>(DEFAULT_EVENTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch("/data/events.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch events.json")
        return res.json()
      })
      .then((data) => {
        if (!mounted) return
        if (Array.isArray(data) && data.length > 0) {
          setEventsData(data as EventItem[])
        } else {
          // keep defaults if the file is empty or malformed
          setEventsData(DEFAULT_EVENTS)
        }
      })
      .catch(() => {
        // on error, keep DEFAULT_EVENTS
        if (mounted) setEventsData(DEFAULT_EVENTS)
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
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">EVENTS</h1>
          <p className="text-xl text-muted-foreground font-serif max-w-2xl">
            Explore our lineup of competitions, workshops and keynotes.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-24 text-center text-muted-foreground">Loading events…</div>
        ) : eventsData.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">No events available.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsData.map((event, index) => {
              const Icon = ICON_MAP[event.icon ?? ""] ?? undefined
              return (
                <EventCard
                  key={`${event.title ?? "event"}-${index}`}
                  event={event}
                  index={index}
                  Icon={Icon}
                />
              )
            })}
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>
    </div>
  )
}