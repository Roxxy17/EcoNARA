"use client"

import { motion } from "framer-motion"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface FloatingParticleProps {
  delay?: number
  index?: number
  performanceLevel: PerformanceLevel
}

export const FloatingParticle = ({
  delay = 0,
  index = 0,
  performanceLevel = "low", // ✅ default value
}: FloatingParticleProps) => {
  const particleCount =
    performanceLevel === "high"
      ? 15
      : performanceLevel === "medium"
      ? 8
      : 4

  if (index >= particleCount) return null

  const sizeVariants = {
    high: ["w-1", "w-1.5", "w-2", "w-2.5", "w-3"],
    medium: ["w-1", "w-1.5", "w-2"],
    low: ["w-1", "w-1.5"],
  }

  const sizes = sizeVariants[performanceLevel] ?? sizeVariants.low
  const sizeClass = sizes[index % sizes.length]

  const baseX = 5 + ((index * 11) % 90)
  const baseY = 5 + ((index * 13) % 90)

  const getParticleVariants = () => {
    const baseVariant = {
      high: {
        y: [
          -40 - (index % 3) * 10,
          -80 - (index % 4) * 15,
          -40 - (index % 3) * 10,
        ],
        x: [-15 + (index % 5) * 6, 15 - (index % 5) * 6, -15 + (index % 5) * 6],
        opacity: [0, 0.8 + (index % 3) * 0.1, 0],
        scale: [
          0.3 + (index % 3) * 0.2,
          1.2 + (index % 4) * 0.3,
          0.3 + (index % 3) * 0.2,
        ],
        rotate: [0, 180 + (index % 6) * 30, 360],
      },
      medium: {
        y: [
          -25 - (index % 3) * 8,
          -50 - (index % 3) * 10,
          -25 - (index % 3) * 8,
        ],
        x: [-8 + (index % 3) * 4, 8 - (index % 3) * 4, -8 + (index % 3) * 4],
        opacity: [0, 0.6 + (index % 2) * 0.1, 0],
        scale: [
          0.5 + (index % 2) * 0.2,
          1.1 + (index % 3) * 0.2,
          0.5 + (index % 2) * 0.2,
        ],
        rotate: [0, 90 + (index % 4) * 45, 180],
      },
      low: {
        y: [
          -20 - (index % 2) * 5,
          -35 - (index % 2) * 8,
          -20 - (index % 2) * 5,
        ],
        x: [-5 + (index % 2) * 3, 5 - (index % 2) * 3, -5 + (index % 2) * 3],
        opacity: [0, 0.4 + (index % 2) * 0.1, 0],
        scale: [0.7, 1.0 + (index % 2) * 0.1, 0.7],
      },
    }

    return baseVariant[performanceLevel] ?? baseVariant.low
  }

  const getParticleBackground = () => {
    const gradients = {
      high: [
        `radial-gradient(circle, rgba(139, 92, 246, 0.9) 0%, rgba(236, 72, 153, 0.7) 50%, rgba(59, 130, 246, 0.5) 100%)`,
        `radial-gradient(circle, rgba(236, 72, 153, 0.9) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(139, 92, 246, 0.5) 100%)`,
        `radial-gradient(circle, rgba(59, 130, 246, 0.9) 0%, rgba(139, 92, 246, 0.7) 50%, rgba(236, 72, 153, 0.5) 100%)`,
        `radial-gradient(circle, rgba(16, 185, 129, 0.9) 0%, rgba(59, 130, 246, 0.7) 50%, rgba(139, 92, 246, 0.5) 100%)`,
        `radial-gradient(circle, rgba(245, 101, 101, 0.9) 0%, rgba(251, 146, 60, 0.7) 50%, rgba(251, 191, 36, 0.5) 100%)`,
      ],
      medium: [
        `radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(236, 72, 153, 0.5) 100%)`,
        `radial-gradient(circle, rgba(236, 72, 153, 0.7) 0%, rgba(59, 130, 246, 0.5) 100%)`,
        `radial-gradient(circle, rgba(59, 130, 246, 0.7) 0%, rgba(139, 92, 246, 0.5) 100%)`,
      ],
      low: [
        "rgba(139, 92, 246, 0.6)",
        "rgba(236, 72, 153, 0.6)",
        "rgba(59, 130, 246, 0.6)",
      ],
    }

    const gradientSet = gradients[performanceLevel] ?? gradients.low
    return gradientSet[index % gradientSet.length]
  }

  const getParticleShadow = () => {
    if (performanceLevel === "high") {
      const shadows = [
        "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)",
        "0 0 20px rgba(236, 72, 153, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)",
        "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2)",
        "0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(59, 130, 246, 0.2)",
        "0 0 20px rgba(245, 101, 101, 0.4), 0 0 40px rgba(251, 146, 60, 0.2)",
      ]
      return shadows[index % shadows.length]
    }
    return "none"
  }

  return (
    <motion.div
      className={`absolute ${sizeClass} ${sizeClass.replace(
        "w-",
        "h-"
      )} rounded-full`}
      style={{
        background: getParticleBackground(),
        left: `${baseX}%`,
        top: `${baseY}%`,
        willChange: "transform, opacity",
        filter:
          performanceLevel === "high"
            ? `blur(${0.3 + (index % 3) * 0.2}px)`
            : "none",
        boxShadow: getParticleShadow(),
      }}
      animate={getParticleVariants()}
      transition={{
        duration:
          performanceLevel === "high"
            ? 5 + (index % 4) * 1.5 + Math.random() * 2
            : performanceLevel === "medium"
            ? 6 + (index % 3) * 2 + Math.random() * 1.5
            : 7 + (index % 2) * 1 + Math.random(),
        repeat: Infinity,
        delay: delay + (index % 5) * 0.4 + Math.random() * 1.5,
        ease: "easeInOut",
        repeatType: "reverse",
      }}
    />
  )
}
