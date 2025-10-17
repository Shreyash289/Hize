"use client"

import { motion } from "framer-motion"
import Navigation from "@/components/Navigation"

const speakers = [
  {
    name: "Speaker Name",
    title: "Title, Company",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
  },
  {
    name: "Speaker Name",
    title: "Title, Company",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    name: "Speaker Name",
    title: "Title, Company",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop"
  }
]

export default function GuestsPage() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((speaker, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="clay-card overflow-hidden group cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-secondary via-accent to-muted relative overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url(${speaker.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "grayscale(100%)"
                  }}
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-2xl font-bold">{speaker.name}</h3>
                <p className="text-muted-foreground font-serif">{speaker.title}</p>
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