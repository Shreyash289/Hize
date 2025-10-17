"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function DynamicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawGradientMesh = () => {
      const width = canvas.width
      const height = canvas.height

      ctx.clearRect(0, 0, width, height)

      time += 0.002

      const gradient1 = ctx.createRadialGradient(
        width * (0.3 + Math.sin(time) * 0.15),
        height * (0.3 + Math.cos(time * 0.7) * 0.15),
        0,
        width * (0.3 + Math.sin(time) * 0.15),
        height * (0.3 + Math.cos(time * 0.7) * 0.15),
        width * 0.65
      )
      gradient1.addColorStop(0, "rgba(255, 107, 26, 0.7)")
      gradient1.addColorStop(0.5, "rgba(255, 85, 0, 0.4)")
      gradient1.addColorStop(1, "rgba(0, 0, 0, 0)")

      const gradient2 = ctx.createRadialGradient(
        width * (0.7 + Math.cos(time * 1.1) * 0.12),
        height * (0.6 + Math.sin(time * 0.95) * 0.12),
        0,
        width * (0.7 + Math.cos(time * 1.1) * 0.12),
        height * (0.6 + Math.sin(time * 0.95) * 0.12),
        width * 0.6
      )
      gradient2.addColorStop(0, "rgba(255, 140, 66, 0.6)")
      gradient2.addColorStop(0.5, "rgba(255, 107, 26, 0.3)")
      gradient2.addColorStop(1, "rgba(0, 0, 0, 0)")

      const gradient3 = ctx.createRadialGradient(
        width * (0.5 + Math.sin(time * 1.3) * 0.18),
        height * (0.8 + Math.cos(time * 1.05) * 0.12),
        0,
        width * (0.5 + Math.sin(time * 1.3) * 0.18),
        height * (0.8 + Math.cos(time * 1.05) * 0.12),
        width * 0.58
      )
      gradient3.addColorStop(0, "rgba(255, 85, 0, 0.5)")
      gradient3.addColorStop(0.5, "rgba(204, 68, 0, 0.3)")
      gradient3.addColorStop(1, "rgba(0, 0, 0, 0)")

      const gradient4 = ctx.createRadialGradient(
        width * (0.2 + Math.cos(time * 0.85) * 0.1),
        height * (0.4 + Math.sin(time * 1.25) * 0.1),
        0,
        width * (0.2 + Math.cos(time * 0.85) * 0.1),
        height * (0.4 + Math.sin(time * 1.25) * 0.1),
        width * 0.5
      )
      gradient4.addColorStop(0, "rgba(255, 107, 26, 0.45)")
      gradient4.addColorStop(0.5, "rgba(153, 51, 0, 0.3)")
      gradient4.addColorStop(1, "rgba(0, 0, 0, 0)")

      const gradient5 = ctx.createRadialGradient(
        width * (0.85 + Math.sin(time * 0.75) * 0.08),
        height * (0.3 + Math.cos(time * 1.15) * 0.08),
        0,
        width * (0.85 + Math.sin(time * 0.75) * 0.08),
        height * (0.3 + Math.cos(time * 1.15) * 0.08),
        width * 0.45
      )
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

      animationFrameId = requestAnimationFrame(drawGradientMesh)
    }

    resizeCanvas()
    drawGradientMesh()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
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
