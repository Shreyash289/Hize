"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ScrollProgressProps {
  sections: string[]
  activeSection: number
  onSectionClick: (index: number) => void
}

export default function ScrollProgress({ sections, activeSection, onSectionClick }: ScrollProgressProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 50, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-6"
        >
          {sections.map((section, index) => (
            <button
              key={index}
              onClick={() => onSectionClick(index)}
              className="group relative flex items-center justify-end"
            >
              <motion.div
                initial={false}
                animate={{
                  width: activeSection === index ? 80 : 0,
                  opacity: activeSection === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute right-10 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap overflow-hidden"
              >
                {section}
              </motion.div>

              <motion.div
                className="relative flex items-center justify-center"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: activeSection === index ? 1 : 0.6,
                    opacity: activeSection === index ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-4 h-4 rounded-full ${
                    activeSection === index
                      ? "bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600"
                      : "bg-slate-400"
                  }`}
                />

                {activeSection === index && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 opacity-30 blur-md"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>
            </button>
          ))}

          <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500/20 via-orange-400/20 to-orange-500/20" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
