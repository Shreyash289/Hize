"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface Particle {
  x: number
  y: number
  width: number
  height: number
  speedX: number
  speedY: number
  opacity: number
  rotation: number
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      particles = []
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          width: Math.random() * 80 + 40,
          height: Math.random() * 3 + 1,
          speedX: Math.random() * 0.5 + 0.2,
          speedY: Math.random() * 0.3 - 0.15,
          opacity: Math.random() * 0.5 + 0.3,
          rotation: Math.random() * 45 - 22.5,
        })
      }
    }

    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate((particle.rotation * Math.PI) / 180)
      
      const gradient = ctx.createLinearGradient(-particle.width / 2, 0, particle.width / 2, 0)
      gradient.addColorStop(0, `rgba(255, 165, 0, 0)`)
      gradient.addColorStop(0.5, `rgba(255, 165, 0, ${particle.opacity})`)
      gradient.addColorStop(1, `rgba(255, 165, 0, 0)`)
      
      ctx.fillStyle = gradient
      ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height)
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > canvas.width + 100) {
          particle.x = -100
        }
        if (particle.y > canvas.height + 50) {
          particle.y = -50
        } else if (particle.y < -50) {
          particle.y = canvas.height + 50
        }

        drawParticle(particle)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.8 }}
    />
  )
}