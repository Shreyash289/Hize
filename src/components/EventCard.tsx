"use client"

import { motion } from "framer-motion"
import React from "react"

export interface EventItem {
  icon?: string
  title: string
  tags: string[]
  description: string
  gradient?: string
}

export default function EventCard({
  event,
  index,
  Icon,
}: {
  event: EventItem
  index?: number
  Icon?: React.ElementType
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index ?? 0) * 0.12, duration: 0.6 }}
      className={`clay-card no-hover-glow p-8 bg-gradient-to-br ${event.gradient ?? ""} group cursor-pointer h-full flex flex-col`}
    >
      <div className="flex flex-col flex-grow space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center clay-button">
          {Icon ? <Icon className="w-8 h-8" /> : <div className="w-6 h-6 bg-white/20 rounded" />}
        </div>

        <div className="flex-grow">
          <h3 className="text-3xl font-bold mb-3">{event.title}</h3>
          <div className="flex gap-2 flex-wrap mb-4">
            {event.tags?.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground font-serif leading-relaxed">{event.description}</p>
        </div>

        <button className="w-full clay-button no-hover-glow bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
          View details
        </button>
      </div>
    </motion.div>
  )
}