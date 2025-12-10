"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { FaLinkedin } from 'react-icons/fa'

export interface Speaker {
  name: string
  title?: string
  image?: string
  bio?: string
  featured?: boolean // NEW
  social?: { linkedin?: string; x?: string }
}

function SpeakerCard({
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
      className="group relative rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`View details for ${speaker.name}${speaker.title ? ", " + speaker.title : ''}`}
      style={{ willChange: "transform" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Orange halo effect behind the card on hover */}
      <div className="absolute -inset-6 -z-10 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-2 rounded-3xl bg-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Card base with glassmorphism */}
      <div className="relative flex-1 flex flex-col backdrop-blur-xl bg-white/10 border border-neutral-800 rounded-xl sm:rounded-2xl shadow-lg h-full transition-all duration-300 z-10">
        {/* Speaker Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-800 rounded-t-xl sm:rounded-t-2xl">
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={`${speaker.name}${speaker.title ? ' - ' + speaker.title : ''}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <div className="text-4xl sm:text-5xl font-bold text-gray-700">
                {speaker.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
        {/* Speaker Info */}
        <div className="flex-1 p-4 sm:p-5 md:p-6 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
              {speaker.name}
            </h3>
            {speaker.social?.linkedin && (
              <a href={speaker.social.linkedin} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full flex-shrink-0" aria-label={`LinkedIn profile of ${speaker.name}`} onClick={e => e.stopPropagation()}>
                <FaLinkedin className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
            )}
          </div>
          {speaker.title && (
            <p className="text-sm sm:text-base text-gray-300 mb-1 font-medium">
              {speaker.title}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default memo(SpeakerCard)