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
              className="clay-card overflow-hidden group"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-br from-secondary via-accent to-muted">
                <Image
                  src={coordinator.image}
                  alt={coordinator.name}
                  fill
                  className="object-cover transition-transform duration-400 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                  priority={index < 3}
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold">{coordinator.name}</h3>
                  <p className="text-muted-foreground font-serif">{coordinator.designation}</p>
                  <p className="text-sm text-muted-foreground/80">{coordinator.role}</p>
                </div>
                
                <div className="space-y-3 pt-3 border-t border-border">
                  <motion.a
                    href={`mailto:${coordinator.email}`}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-mono break-all">{coordinator.email}</span>
                  </motion.a>

                  <motion.a
                    href={`tel:+91${coordinator.phone.replace(/\s/g, '')}`}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-mono">+91 {coordinator.phone}</span>
                  </motion.a>
                </div>
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