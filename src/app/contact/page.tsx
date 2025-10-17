"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"
import { Mail, Phone } from "lucide-react"

const coordinators = [
  {
    name: "Dr. Priya Sharma",
    role: "Faculty Coordinator, Computer Science",
    email: "priya.sharma@example.edu",
    phone: "+91 12345 67890"
  },
  {
    name: "Prof. Arjun Mehta",
    role: "Events Lead, Information Technology",
    email: "arjun.mehta@example.edu",
    phone: "+91 98765 43210"
  },
  {
    name: "Dr. Neha Kapoor",
    role: "Workshops & Outreach",
    email: "neha.kapoor@example.edu",
    phone: "+91 11122 23334"
  }
]

export default function ContactPage() {
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
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">CONTACT</h1>
          <p className="text-xl text-muted-foreground font-serif max-w-2xl">
            Reach our faculty coordinators for HIZE 2026.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coordinators.map((coordinator, index) => (
            <motion.div
              key={coordinator.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="clay-card p-8 space-y-6 bg-gradient-to-br from-card via-secondary to-accent"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">{coordinator.name}</h3>
                <p className="text-muted-foreground font-serif">{coordinator.role}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <motion.a
                  href={`mailto:${coordinator.email}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono break-all">{coordinator.email}</span>
                </motion.a>

                <motion.a
                  href={`tel:${coordinator.phone.replace(/\s/g, '')}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono">{coordinator.phone}</span>
                </motion.a>
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