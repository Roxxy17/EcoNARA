"use client"

import { useState, useEffect } from "react"

export type PerformanceLevel = "high" | "medium" | "low"

interface DeviceCapabilities {
  cores: number
  memory: number
  connection: string
  gpu: string
  isMobile: boolean
}

export const useDevicePerformance = () => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>("medium")
  const [capabilities, setCapabilities] = useState<DeviceCapabilities | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectPerformance = async () => {
      try {
        // Basic device detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        const cores = navigator.hardwareConcurrency || 4

        // Memory detection (if available)
        const memory = (navigator as any).deviceMemory || 4

        // Connection detection
        const connection = (navigator as any).connection?.effectiveType || "4g"

        // GPU detection (basic)
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        const gpu = gl ? (gl as any).getParameter((gl as any).UNMASKED_RENDERER_WEBGL) || "unknown" : "unknown"

        const deviceCapabilities: DeviceCapabilities = {
          cores,
          memory,
          connection,
          gpu,
          isMobile,
        }

        setCapabilities(deviceCapabilities)

        // Performance scoring algorithm
        let score = 0

        // CPU cores (0-30 points)
        score += Math.min(cores * 5, 30)

        // Memory (0-25 points)
        score += Math.min(memory * 3, 25)

        // Connection (0-20 points)
        const connectionScores: Record<string, number> = {
          "slow-2g": 2,
          "2g": 5,
          "3g": 10,
          "4g": 20,
          "5g": 20,
        }
        score += connectionScores[connection] || 15

        // Mobile penalty (-15 points)
        if (isMobile) score -= 15

        // GPU bonus (0-15 points)
        if (gpu.toLowerCase().includes("nvidia") || gpu.toLowerCase().includes("amd")) {
          score += 15
        } else if (gpu.toLowerCase().includes("intel")) {
          score += 8
        }

        // Performance level determination
        if (score >= 60) {
          setPerformanceLevel("high")
        } else if (score >= 35) {
          setPerformanceLevel("medium")
        } else {
          setPerformanceLevel("low")
        }

        // Frame rate test for final validation
        let frameCount = 0
        const startTime = performance.now()

        const frameTest = () => {
          frameCount++
          if (frameCount < 60) {
            requestAnimationFrame(frameTest)
          } else {
            const endTime = performance.now()
            const fps = 60000 / (endTime - startTime)

            // Adjust based on actual FPS
            if (fps < 30 && performanceLevel === "high") {
              setPerformanceLevel("medium")
            } else if (fps < 20 && performanceLevel === "medium") {
              setPerformanceLevel("low")
            }

            setIsLoading(false)
          }
        }

        requestAnimationFrame(frameTest)
      } catch (error) {
        console.warn("Performance detection failed, using medium settings:", error)
        setPerformanceLevel("medium")
        setIsLoading(false)
      }
    }

    detectPerformance()
  }, [])

  return {
    performanceLevel,
    capabilities,
    isLoading,
  }
}
