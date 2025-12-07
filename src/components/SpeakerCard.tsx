"use client"

import { motion } from "framer-motion"

export interface Speaker {
  name: string
  title?: string
  image?: string
  bio?: string
}

export default function SpeakerCard({
  speaker,
  index,
  onClick,
}: {
  speaker: Speaker
  index?: number
  onClick?: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: (index ?? 0) * 0.2, duration: 0.8 }}
      whileHover={{ y: -10 }}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-black/60 to-zinc-900/60 backdrop-blur-xl border border-orange-500/20 cursor-pointer"
      onClick={onClick}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:from-orange-900/70 group-hover:via-orange-950/30 group-hover:to-transparent transition-all duration-700" />
      </div>

      <div className="p-6 space-y-2">
        <h3 className="text-2xl font-bold">{speaker.name}</h3>
        <p className="text-slate-400 font-serif">{speaker.title}</p>
      </div>

      <motion.div
        className="absolute -inset-[1px] bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10"
      />
    </motion.div>
  )
}