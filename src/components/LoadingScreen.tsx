"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const duration = 1500
    const steps = 30
    const stepDuration = duration / steps
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      const easeProgress = 1 - Math.pow(1 - currentStep / steps, 2)
      setProgress(Math.min(Math.floor(easeProgress * 100), 100))

      if (currentStep >= steps) {
        clearInterval(interval)
        setTimeout(() => {
          setIsComplete(true)
          setTimeout(onLoadingComplete, 600)
        }, 200)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center gap-8 max-w-md mx-auto px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500 bg-clip-text text-transparent">
                HIZE
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full space-y-4"
            >
              <div className="relative h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-400 to-orange-600 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                />
              </div>

              <motion.p
                className="text-center text-orange-300/60 text-sm tracking-wider"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Loading...
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
