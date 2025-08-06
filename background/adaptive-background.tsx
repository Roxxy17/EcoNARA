"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion"
import { FloatingParticle } from "./floating-particle"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface AdaptiveBackgroundProps {
  performanceLevel: PerformanceLevel
  variant?: "default" | "aurora" | "waves" | "geometric" | "nebula"
}

export const AdaptiveBackground = ({ performanceLevel, variant = "default" }: AdaptiveBackgroundProps) => {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 30, damping: 15 })
  const springY = useSpring(mouseY, { stiffness: 30, damping: 15 })
  const [currentTime, setCurrentTime] = useState(0)

  useEffect(() => {
    if (performanceLevel === "high" && !shouldReduceMotion) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX / window.innerWidth)
        mouseY.set(e.clientY / window.innerHeight)
      }
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [performanceLevel, shouldReduceMotion, mouseX, mouseY])

  useEffect(() => {
    if (performanceLevel === "high") {
      const interval = setInterval(() => {
        setCurrentTime(Date.now())
      }, 100)
      return () => clearInterval(interval)
    }
  }, [performanceLevel])

  if (shouldReduceMotion || performanceLevel === "low") {
    return (
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"></div>
        <div className="absolute inset-0 opacity-15 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10"></div>
      </div>
    )
  }

  const getBackgroundVariant = () => {
    switch (variant) {
      case "aurora":
        return (
          <>
            {/* Aurora Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-slate-900"></div>

            {performanceLevel === "high" && (
              <>
                {/* Aurora Waves */}
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `
                      linear-gradient(120deg, 
                        rgba(34, 197, 94, 0.3) 0%, 
                        rgba(59, 130, 246, 0.4) 25%,
                        rgba(139, 92, 246, 0.3) 50%,
                        rgba(236, 72, 153, 0.4) 75%,
                        rgba(34, 197, 94, 0.3) 100%)
                    `,
                    willChange: "transform",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Aurora Shimmer */}
                <motion.div
                  className="absolute inset-0 opacity-25"
                  style={{
                    background: `linear-gradient(90deg, 
                      transparent, 
                      rgba(34, 197, 94, 0.2), 
                      rgba(59, 130, 246, 0.3),
                      rgba(34, 197, 94, 0.2), 
                      transparent)`,
                    willChange: "transform",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}

            {performanceLevel === "medium" && (
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(45deg, 
                    rgba(34, 197, 94, 0.2) 0%, 
                    rgba(59, 130, 246, 0.3) 50%, 
                    rgba(139, 92, 246, 0.2) 100%)`,
                  willChange: "transform",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{
                  duration: 25,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}
          </>
        )

      case "waves":
        return (
          <>
            {/* Wave Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-900"></div>

            {performanceLevel === "high" && (
              <>
                {/* Wave Layers */}
                <motion.div
                  className="absolute inset-0 opacity-35"
                  style={{
                    background: `
                      radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%),
                      radial-gradient(ellipse at 80% 70%, rgba(16, 185, 129, 0.3) 0%, transparent 60%),
                      radial-gradient(ellipse at 50% 90%, rgba(139, 92, 246, 0.25) 0%, transparent 60%)
                    `,
                    willChange: "transform",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Wave Motion */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `repeating-linear-gradient(
                      90deg,
                      transparent,
                      rgba(59, 130, 246, 0.1) 50px,
                      transparent 100px
                    )`,
                    willChange: "transform",
                  }}
                  animate={{
                    x: [0, 100],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </>
            )}
          </>
        )

      case "geometric":
        return (
          <>
            {/* Geometric Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-900"></div>

            {performanceLevel === "high" && (
              <>
                {/* Geometric Patterns */}
                <motion.div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `
                      conic-gradient(from 0deg at 30% 30%, 
                        rgba(245, 101, 101, 0.3) 0deg, 
                        rgba(251, 191, 36, 0.2) 90deg,
                        rgba(139, 92, 246, 0.3) 180deg,
                        rgba(245, 101, 101, 0.3) 270deg,
                        rgba(245, 101, 101, 0.3) 360deg),
                      conic-gradient(from 180deg at 70% 70%, 
                        rgba(251, 191, 36, 0.3) 0deg, 
                        rgba(139, 92, 246, 0.2) 90deg,
                        rgba(245, 101, 101, 0.3) 180deg,
                        rgba(251, 191, 36, 0.3) 270deg,
                        rgba(251, 191, 36, 0.3) 360deg)
                    `,
                    willChange: "transform",
                  }}
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />

                {/* Geometric Grid */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, rgba(245, 101, 101, 0.2) 1px, transparent 1px),
                      linear-gradient(-45deg, rgba(251, 191, 36, 0.2) 1px, transparent 1px)
                    `,
                    backgroundSize: "30px 30px",
                  }}
                />
              </>
            )}
          </>
        )

      case "nebula":
        return (
          <>
            {/* Nebula Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900"></div>

            {performanceLevel === "high" && (
              <>
                {/* Nebula Clouds */}
                <motion.div
                  className="absolute inset-0 opacity-50"
                  style={{
                    background: `
                      radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.3) 0%, transparent 40%),
                      radial-gradient(circle at 10% 90%, rgba(16, 185, 129, 0.2) 0%, transparent 40%),
                      radial-gradient(circle at 90% 50%, rgba(245, 101, 101, 0.2) 0%, transparent 40%)
                    `,
                    willChange: "transform",
                  }}
                  animate={{
                    scale: [1, 1.2, 1.1, 1],
                    rotate: [0, 1, -0.5, 0],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Nebula Dust */}
                <motion.div
                  className="absolute inset-0 opacity-15"
                  style={{
                    background: `
                      radial-gradient(ellipse 800px 400px at 30% 60%, rgba(139, 92, 246, 0.2) 0%, transparent 70%),
                      radial-gradient(ellipse 600px 300px at 70% 40%, rgba(236, 72, 153, 0.15) 0%, transparent 70%)
                    `,
                    willChange: "transform",
                  }}
                  animate={{
                    x: [0, 50, -25, 0],
                    y: [0, -30, 15, 0],
                  }}
                  transition={{
                    duration: 35,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}
          </>
        )

      default:
        return (
          <>
            {/* Default Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-900"></div>

            {performanceLevel === "high" && (
              <>
                <motion.div
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `
                      radial-gradient(circle at 25% 35%, rgba(139, 92, 246, 0.4) 0%, transparent 60%),
                      radial-gradient(circle at 75% 65%, rgba(236, 72, 153, 0.3) 0%, transparent 60%),
                      radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.25) 0%, transparent 60%)
                    `,
                    willChange: "transform",
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}
          </>
        )
    }
  }

  const getParticleVariant = () => {
    switch (variant) {
      case "aurora":
        return "wave"
      case "waves":
        return "wave"
      case "geometric":
        return "geometric"
      case "nebula":
        return "spiral"
      default:
        return "default"
    }
  }

  return (
    <div className="fixed inset-0 z-0">
      {getBackgroundVariant()}

      {/* Mouse-interactive layer for high-end devices */}
      {performanceLevel === "high" && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(400px circle at ${springX}px ${springY}px, 
              rgba(139, 92, 246, 0.3) 0%, 
              rgba(236, 72, 153, 0.2) 40%, 
              transparent 70%)`,
            willChange: "background",
          }}
        />
      )}

      {/* Particle system with variant */}
      {Array.from({ length: performanceLevel === "high" ? 10 : performanceLevel === "medium" ? 6 : 3 }).map((_, i) => (
        <FloatingParticle
          key={i}
          delay={i * 0.8}
          index={i}
          performanceLevel={performanceLevel}
          variant={getParticleVariant()}
        />
      ))}

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: performanceLevel === "high" ? "50px 50px" : "60px 60px",
        }}
      />
    </div>
  )
}
