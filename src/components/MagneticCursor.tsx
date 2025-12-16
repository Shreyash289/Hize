"use client"

import { useEffect, useRef, useState } from "react"
import { LazyMotion, domAnimation, m } from "framer-motion"

export default function MagneticCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorVariant, setCursorVariant] = useState("default")
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch devices (iOS, Android, etc.)
    const checkTouchDevice = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
    
    setIsTouchDevice(checkTouchDevice())
    
    // Don't initialize cursor on touch devices
    if (checkTouchDevice()) return
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        setCursorVariant("hover")
      }
    }

    const handleMouseLeave = () => {
      setCursorVariant("default")
    }

    window.addEventListener("mousemove", handleMouseMove)
    document.querySelectorAll("button, a").forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.querySelectorAll("button, a").forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      scale: 1,
    },
    hover: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      scale: 2,
    },
  }

  if (!isVisible || isTouchDevice) return null

  return (
    <LazyMotion features={domAnimation} strict>
    <>
      <m.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-orange-500 pointer-events-none z-[9998] mix-blend-difference hidden lg:block"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />
      <m.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-400 pointer-events-none z-[9999] hidden lg:block"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          stiffness: 1000,
          damping: 50,
          mass: 0.1,
        }}
      />
    </>\n    </LazyMotion>
  )
}
