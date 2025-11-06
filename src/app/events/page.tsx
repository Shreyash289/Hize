"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import { Code2, Lightbulb, Mic2 } from "lucide-react"

const events = [
  {
    icon: Code2,
    title: "Hackathon",
    tags: ["48 hrs", "Team"],
    description: "Build innovative solutions in an intense 48-hour coding marathon. Collaborate with talented developers and bring your ideas to life.",
    gradient: "from-card via-secondary to-accent"
  },
  {
    icon: Lightbulb,
    title: "AI Workshop",
    tags: ["Intermediate", "Hands-on"],
    description: "Dive deep into artificial intelligence and machine learning with hands-on projects and expert guidance.",
    gradient: "from-accent via-card to-secondary"
  },
  {
    icon: Mic2,
    title: "Keynote Series",
    tags: ["Leaders", "Trends"],
    description: "Hear from industry leaders about the latest trends, innovations, and future directions in technology.",
    gradient: "from-secondary via-accent to-card"
  }
]

export default function EventsPage() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className={`clay-card p-8 bg-gradient-to-br ${event.gradient} group cursor-pointer`}
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center clay-button">
                  <event.icon className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="text-3xl font-bold mb-3">{event.title}</h3>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground font-serif leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <button className="w-full clay-button bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                  View details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2026 IEEE CS SRM | In collaboration with SRM Institute of Science & Technology</p>
        </div>
      </footer>
    </div>
  )
}