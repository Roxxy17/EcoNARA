"use client"

import { motion } from "framer-motion"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface FloatingParticleProps {
  delay?: number
  index?: number
  performanceLevel: PerformanceLevel
  variant?: "default" | "pulse" | "wave" | "geometric" | "spiral"
}

export const FloatingParticle = ({
  delay = 0,
  index = 0,
  performanceLevel,
  variant = "default",
}: FloatingParticleProps) => {
  const particleCount = performanceLevel === "high" ? 10 : performanceLevel === "medium" ? 6 : 3
  if (index >= particleCount) return null

  const baseX = 15 + ((index * 11) % 70)
  const baseY = 15 + ((index * 13) % 70)

  // Different animation variants
  const getAnimationVariant = () => {
    switch (variant) {
      case "pulse":
        return {
          high: {
            scale: [0.8, 1.4, 0.8],
            opacity: [0.3, 0.9, 0.3],
          },
          medium: {
            scale: [0.9, 1.2, 0.9],
            opacity: [0.4, 0.7, 0.4],
          },
          low: {
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          },
        }

      case "wave":
        return {
          high: {
            y: [-25, -50, -25],
            x: [Math.sin(index) * 10, Math.sin(index + Math.PI) * 10, Math.sin(index) * 10],
            opacity: [0, 0.8, 0],
          },
          medium: {
            y: [-20, -35, -20],
            x: [Math.sin(index) * 5, Math.sin(index + Math.PI) * 5, Math.sin(index) * 5],
            opacity: [0, 0.6, 0],
          },
          low: {
            y: [-15, -25, -15],
            opacity: [0, 0.4, 0],
          },
        }

      case "geometric":
        return {
          high: {
            rotate: [0, 180, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.4, 0.8, 0.4],
          },
          medium: {
            rotate: [0, 90, 180],
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.6, 0.3],
          },
          low: {
            rotate: [0, 45, 90],
            opacity: [0.2, 0.4, 0.2],
          },
        }

      case "spiral":
        return {
          high: {
            x: [0, Math.cos(index * 0.5) * 20, 0],
            y: [0, Math.sin(index * 0.5) * 20, 0],
            rotate: [0, 360, 720],
            opacity: [0.3, 0.8, 0.3],
          },
          medium: {
            x: [0, Math.cos(index * 0.5) * 10, 0],
            y: [0, Math.sin(index * 0.5) * 10, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.6, 0.2],
          },
          low: {
            rotate: [0, 90, 180],
            opacity: [0.2, 0.4, 0.2],
          },
        }

      default:
        return {
          high: {
            y: [-20, -40, -20],
            x: [-5, 5, -5],
            opacity: [0, 0.8, 0],
            scale: [0.8, 1.2, 0.8],
          },
          medium: {
            y: [-15, -30, -15],
            opacity: [0, 0.6, 0],
            scale: [0.9, 1.1, 0.9],
          },
          low: {
            y: [-10, -20, -10],
            opacity: [0, 0.4, 0],
          },
        }
    }
  }

  const particleVariants = getAnimationVariant()

  // Different shapes based on variant
  const getParticleShape = () => {
    const baseSize = performanceLevel === "high" ? "w-2 h-2" : performanceLevel === "medium" ? "w-1.5 h-1.5" : "w-1 h-1"

    switch (variant) {
      case "geometric":
        return `${baseSize} rotate-45`
      case "spiral":
        return `${baseSize} rounded-none`
      default:
        return `${baseSize} rounded-full`
    }
  }

  // Different colors based on variant
  const getParticleColor = () => {
    const colors = {
      default:
        performanceLevel === "high"
          ? `radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.4) 100%)`
          : `radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(236, 72, 153, 0.3) 100%)`,
      pulse:
        performanceLevel === "high"
          ? `radial-gradient(circle, rgba(34, 197, 94, 0.8) 0%, rgba(59, 130, 246, 0.4) 100%)`
          : `radial-gradient(circle, rgba(34, 197, 94, 0.6) 0%, rgba(59, 130, 246, 0.3) 100%)`,
      wave:
        performanceLevel === "high"
          ? `radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(16, 185, 129, 0.4) 100%)`
          : `radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, rgba(16, 185, 129, 0.3) 100%)`,
      geometric:
        performanceLevel === "high"
          ? `linear-gradient(45deg, rgba(245, 101, 101, 0.8) 0%, rgba(251, 191, 36, 0.4) 100%)`
          : `linear-gradient(45deg, rgba(245, 101, 101, 0.6) 0%, rgba(251, 191, 36, 0.3) 100%)`,
      spiral:
        performanceLevel === "high"
          ? `conic-gradient(from 0deg, rgba(139, 92, 246, 0.8), rgba(236, 72, 153, 0.6), rgba(59, 130, 246, 0.4))`
          : `conic-gradient(from 0deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.4), rgba(59, 130, 246, 0.3))`,
    }
    return colors[variant] || colors.default
  }

  return (
    <motion.div
      className={`absolute ${getParticleShape()}`}
      style={{
        background: getParticleColor(),
        left: `${baseX}%`,
        top: `${baseY}%`,
        willChange: "transform, opacity",
      }}
      animate={particleVariants[performanceLevel]}
      transition={{
        duration: performanceLevel === "high" ? 4 + Math.random() * 2 : performanceLevel === "medium" ? 5 : 6,
        repeat: Number.POSITIVE_INFINITY,
        delay: delay + Math.random() * 1.5,
        ease: variant === "geometric" ? "linear" : "easeInOut",
      }}
    />
  )
}
