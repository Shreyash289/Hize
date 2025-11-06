"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function MeshGradientBackground() {
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

      time += 0.003

      const gradient1 = ctx.createRadialGradient(
        width * (0.3 + Math.sin(time) * 0.1),
        height * (0.3 + Math.cos(time * 0.8) * 0.1),
        0,
        width * (0.3 + Math.sin(time) * 0.1),
        height * (0.3 + Math.cos(time * 0.8) * 0.1),
        width * 0.6
      )
      gradient1.addColorStop(0, "rgba(249, 115, 22, 0.4)")
      gradient1.addColorStop(1, "rgba(249, 115, 22, 0)")

      const gradient2 = ctx.createRadialGradient(
        width * (0.7 + Math.cos(time * 1.2) * 0.1),
        height * (0.6 + Math.sin(time * 0.9) * 0.1),
        0,
        width * (0.7 + Math.cos(time * 1.2) * 0.1),
        height * (0.6 + Math.sin(time * 0.9) * 0.1),
        width * 0.5
      )
      gradient2.addColorStop(0, "rgba(234, 179, 8, 0.4)")
      gradient2.addColorStop(1, "rgba(234, 179, 8, 0)")

      const gradient3 = ctx.createRadialGradient(
        width * (0.5 + Math.sin(time * 1.5) * 0.15),
        height * (0.8 + Math.cos(time * 1.1) * 0.1),
        0,
        width * (0.5 + Math.sin(time * 1.5) * 0.15),
        height * (0.8 + Math.cos(time * 1.1) * 0.1),
        width * 0.55
      )
      gradient3.addColorStop(0, "rgba(251, 146, 60, 0.35)")
      gradient3.addColorStop(1, "rgba(251, 146, 60, 0)")

      const gradient4 = ctx.createRadialGradient(
        width * (0.2 + Math.cos(time * 0.7) * 0.1),
        height * (0.7 + Math.sin(time * 1.3) * 0.1),
        0,
        width * (0.2 + Math.cos(time * 0.7) * 0.1),
        height * (0.7 + Math.sin(time * 1.3) * 0.1),
        width * 0.45
      )
      gradient4.addColorStop(0, "rgba(255, 255, 255, 0.1)")
      gradient4.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.globalCompositeOperation = "screen"

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, width, height)

      ctx.fillStyle = gradient4
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
        style={{ filter: "blur(80px)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
    </div>
  )
}
