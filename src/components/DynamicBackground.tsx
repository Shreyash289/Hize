"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { getAnimationManager, createVisibilityObserver } from "@/lib/animationManager"

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animationManager = getAnimationManager()
    let animationFrameId: number
    let time = 0
    let isVisible = true
    let isIntersecting = true

    // iOS Safari performance optimization
    const devicePixelRatio = window.devicePixelRatio || 1
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    const resizeCanvas = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // iOS Safari optimization
      if (isIOS) {
        canvas.width = width
        canvas.height = height
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
      } else {
        canvas.width = width * devicePixelRatio
        canvas.height = height * devicePixelRatio
        canvas.style.width = width + 'px'
        canvas.style.height = height + 'px'
        ctx.scale(devicePixelRatio, devicePixelRatio)
      }
    }

    const drawGradientMesh = () => {
      if (!isVisible) return
      
      try {
      const width = isIOS ? canvas.width : canvas.width / devicePixelRatio
      const height = isIOS ? canvas.height : canvas.height / devicePixelRatio

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // iOS Safari performance: reduce animation speed on mobile
      time += isIOS ? 0.001 : 0.002

      // Optimize: Reuse gradient calculations
      const g1x = width * (0.3 + Math.sin(time) * 0.15)
      const g1y = height * (0.3 + Math.cos(time * 0.7) * 0.15)
      const gradient1 = ctx.createRadialGradient(g1x, g1y, 0, g1x, g1y, width * 0.65)
      gradient1.addColorStop(0, "rgba(255, 107, 26, 0.7)")
      gradient1.addColorStop(0.5, "rgba(255, 85, 0, 0.4)")
      gradient1.addColorStop(1, "rgba(0, 0, 0, 0)")

      const g2x = width * (0.7 + Math.cos(time * 1.1) * 0.12)
      const g2y = height * (0.6 + Math.sin(time * 0.95) * 0.12)
      const gradient2 = ctx.createRadialGradient(g2x, g2y, 0, g2x, g2y, width * 0.6)
      gradient2.addColorStop(0, "rgba(255, 140, 66, 0.6)")
      gradient2.addColorStop(0.5, "rgba(255, 107, 26, 0.3)")
      gradient2.addColorStop(1, "rgba(0, 0, 0, 0)")

      const g3x = width * (0.5 + Math.sin(time * 1.3) * 0.18)
      const g3y = height * (0.8 + Math.cos(time * 1.05) * 0.12)
      const gradient3 = ctx.createRadialGradient(g3x, g3y, 0, g3x, g3y, width * 0.58)
      gradient3.addColorStop(0, "rgba(255, 85, 0, 0.5)")
      gradient3.addColorStop(0.5, "rgba(204, 68, 0, 0.3)")
      gradient3.addColorStop(1, "rgba(0, 0, 0, 0)")

      const g4x = width * (0.2 + Math.cos(time * 0.85) * 0.1)
      const g4y = height * (0.4 + Math.sin(time * 1.25) * 0.1)
      const gradient4 = ctx.createRadialGradient(g4x, g4y, 0, g4x, g4y, width * 0.5)
      gradient4.addColorStop(0, "rgba(255, 107, 26, 0.45)")
      gradient4.addColorStop(0.5, "rgba(153, 51, 0, 0.3)")
      gradient4.addColorStop(1, "rgba(0, 0, 0, 0)")

      const g5x = width * (0.85 + Math.sin(time * 0.75) * 0.08)
      const g5y = height * (0.3 + Math.cos(time * 1.15) * 0.08)
      const gradient5 = ctx.createRadialGradient(g5x, g5y, 0, g5x, g5y, width * 0.45)
      gradient5.addColorStop(0, "rgba(255, 140, 66, 0.4)")
      gradient5.addColorStop(0.5, "rgba(204, 68, 0, 0.2)")
      gradient5.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.globalCompositeOperation = "screen"

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient4
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient5
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = "source-over"
      } catch (error) {
        // Silently fail on canvas errors to prevent crashes
        console.warn('Canvas rendering error (non-critical):', error)
      }

      // Use throttled RAF for 30 FPS background animation
      animationFrameId = animationManager.requestThrottledAnimationFrame(drawGradientMesh)
    }

    // Animation controller for pause/resume
    const controller = {
      isPaused: false,
      pause: () => {
        if (animationFrameId) {
          animationManager.cancelThrottledAnimationFrame(animationFrameId)
          animationFrameId = 0
        }
        controller.isPaused = true
      },
      resume: () => {
        if (controller.isPaused) {
          controller.isPaused = false
          drawGradientMesh()
        }
      },
    }

    animationManager.register(controller)

    resizeCanvas()
    drawGradientMesh()

    // IntersectionObserver to pause when off-screen
    const visibilityObserver = containerRef.current
      ? createVisibilityObserver((visible) => {
          isIntersecting = visible
          if (!visible && !controller.isPaused) {
            controller.pause()
          } else if (visible && controller.isPaused && animationManager.isVisible()) {
            controller.resume()
          }
        })
      : null

    if (visibilityObserver && containerRef.current) {
      visibilityObserver.observe(containerRef.current)
    }

    // Throttle resize to prevent Safari reload loops
    let resizeTimeout: NodeJS.Timeout | null = null
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
      resizeCanvas()
      }, 150) // Throttle to 150ms
    }

    // iOS Safari visibility handling
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (!isVisible && !controller.isPaused) {
        controller.pause()
      } else if (isVisible && isIntersecting && controller.isPaused) {
        controller.resume()
      }
    }

    window.addEventListener("resize", handleResize, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (animationFrameId) {
        animationManager.cancelThrottledAnimationFrame(animationFrameId)
      }
      if (visibilityObserver && containerRef.current) {
        visibilityObserver.unobserve(containerRef.current)
      }
      animationManager.unregister(controller)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ filter: "blur(90px)" }}
      />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMTA3LDI2LDAuMDQpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50" />

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black opacity-80" />

      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-20 bg-gradient-to-b from-transparent via-orange-500/40 to-transparent"
          style={{
            left: `${(i * 100) / 15}%`,
            top: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
            height: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
