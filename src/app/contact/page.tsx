"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Navigation from "@/components/Navigation"
import { Mail, Phone } from "lucide-react"
import facultyContacts from "@/lib/facultyContacts"

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
          {facultyContacts.map((coordinator, index) => (
            <motion.div
              key={coordinator.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="clay-card no-hover-glow p-8 space-y-6 bg-gradient-to-br from-card via-secondary to-accent"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
                  <Image
                    src={coordinator.image}
                    alt={coordinator.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{coordinator.name}</h3>
                  <p className="text-muted-foreground font-serif">{coordinator.designation}</p>
                  <p className="text-sm text-muted-foreground/80 mt-1">{coordinator.role}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <motion.a
                  href={`mailto:${coordinator.email}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button no-hover-glow bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono break-all">{coordinator.email}</span>
                </motion.a>

                <motion.a
                  href={`tel:+91${coordinator.phone.replace(/\s/g, '')}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 clay-button no-hover-glow bg-secondary hover:bg-accent p-4 rounded-xl group transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-mono">+91 {coordinator.phone}</span>
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