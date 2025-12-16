"use client"

import { memo } from "react"
import { motion } from "framer-motion"
import { FaLinkedin } from 'react-icons/fa'

export interface Speaker {
  name: string
  title?: string
  image?: string
  bio?: string
  featured?: boolean
  social?: { linkedin?: string; x?: string }
}

function SpeakerCard({
  speaker,
  onClick,
}: {
  speaker: Speaker
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Enhanced glow effect with multiple layers */}
      <div className="absolute -inset-4 -z-10 pointer-events-none">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/0 via-orange-500/50 to-amber-500/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-2 rounded-3xl bg-orange-400/40 blur-2xl opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
        <div className="absolute inset-4 rounded-3xl bg-amber-300/30 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
      </div>
      
      {/* Card base with enhanced glassmorphism */}
      <div className="relative flex-1 flex flex-col backdrop-blur-2xl bg-gradient-to-br from-white/[0.15] to-white/[0.05] border border-white/20 group-hover:border-orange-400/40 rounded-xl sm:rounded-2xl shadow-2xl group-hover:shadow-orange-500/20 h-full transition-all duration-500 z-10">
        {/* Speaker Image with enhanced overlay */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-t-lg sm:rounded-t-xl md:rounded-t-2xl">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {speaker.image ? (
            <img
              src={speaker.image}
              alt={`${speaker.name}${speaker.title ? ' - ' + speaker.title : ''}`}
              className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-700 group-hover:text-orange-400/50 transition-colors duration-500">
                {speaker.name.charAt(0)}
              </div>
            </div>
          )}
        </div>
        {/* Speaker Info with enhanced styling */}
        <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-end relative">
          {/* Subtle top border glow */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-start gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-white group-hover:text-orange-100 transition-colors duration-300 leading-tight">
                {speaker.name}
              </h3>
            </div>
            {speaker.social?.linkedin && (
              <a 
                href={speaker.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-110 mt-0.5" 
                aria-label={`LinkedIn profile of ${speaker.name}`} 
                onClick={e => e.stopPropagation()}
              >
                <FaLinkedin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 drop-shadow-lg" />
              </a>
            )}
          </div>
          {speaker.title && (
            <p className="text-xs sm:text-sm md:text-base text-gray-300 group-hover:text-gray-200 mb-1 font-medium transition-colors duration-300 leading-tight">
              {speaker.title}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default memo(SpeakerCard)