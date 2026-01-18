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
    let isVisible = true

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

    const createParticles = () => {
      particles = []
      const width = isIOS ? canvas.width : canvas.width / devicePixelRatio
      const height = isIOS ? canvas.height : canvas.height / devicePixelRatio
      
      // Reduce particle count on iOS for better performance
      const particleCount = isIOS 
        ? Math.floor((width * height) / 25000) 
        : Math.floor((width * height) / 15000)
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
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
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }
      
      const width = isIOS ? canvas.width : canvas.width / devicePixelRatio
      const height = isIOS ? canvas.height : canvas.height / devicePixelRatio
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x > width + 100) {
          particle.x = -100
        }
        if (particle.y > height + 50) {
          particle.y = -50
        } else if (particle.y < -50) {
          particle.y = height + 50
        }

        drawParticle(particle)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    createParticles()
    animate()

    // Throttle resize to prevent Safari reload loops
    let resizeTimeout: NodeJS.Timeout | null = null
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
      resizeCanvas()
      createParticles()
      }, 150) // Throttle to 150ms
    }

    // iOS Safari visibility handling
    const handleVisibilityChange = () => {
      isVisible = !document.hidden
    }

    window.addEventListener("resize", handleResize, { passive: true })
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      window.removeEventListener("resize", handleResize)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
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