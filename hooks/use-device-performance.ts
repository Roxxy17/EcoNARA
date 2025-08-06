"use client"

import { useState, useEffect } from "react"

export type PerformanceLevel = "low" | "medium" | "high"

export interface DeviceCapabilities {
  cores: number
  memory: number
  connection: string
  gpu: string | null
  pixelRatio: number
  screenSize: { width: number; height: number }
}

export const useDevicePerformance = () => {
  const [performanceLevel, setPerformanceLevel] = useState<PerformanceLevel>("medium")
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    cores: 4,
    memory: 4,
    connection: "4g",
    gpu: null,
    pixelRatio: 1,
    screenSize: { width: 1920, height: 1080 },
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const detectCapabilities = async () => {
      try {
        // Detect CPU cores
        const cores = navigator.hardwareConcurrency || 4

        // Detect memory (if available)
        const memory = (navigator as any).deviceMemory || 4

        // Detect connection
        const connection = (navigator as any).connection?.effectiveType || "4g"

        // Detect GPU (if available)
        let gpu = null
        try {
          const canvas = document.createElement("canvas")
          const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
          if (gl) {
            const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
            if (debugInfo) {
              gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
            }
          }
        } catch (e) {
          // GPU detection failed
        }

        // Detect pixel ratio and screen size
        const pixelRatio = window.devicePixelRatio || 1
        const screenSize = {
          width: window.screen.width,
          height: window.screen.height,
        }

        const detectedCapabilities: DeviceCapabilities = {
          cores,
          memory,
          connection,
          gpu,
          pixelRatio,
          screenSize,
        }

        setCapabilities(detectedCapabilities)

        // Calculate performance level
        let score = 0

        // CPU score (0-30 points)
        if (cores >= 8) score += 30
        else if (cores >= 4) score += 20
        else if (cores >= 2) score += 10

        // Memory score (0-25 points)
        if (memory >= 8) score += 25
        else if (memory >= 4) score += 15
        else if (memory >= 2) score += 8

        // Connection score (0-20 points)
        if (connection === "4g" || connection === "5g") score += 20
        else if (connection === "3g") score += 10
        else score += 5

        // GPU score (0-15 points)
        if (gpu) {
          const gpuLower = gpu.toLowerCase()
          if (gpuLower.includes("nvidia") || gpuLower.includes("amd") || gpuLower.includes("intel iris")) {
            score += 15
          } else if (gpuLower.includes("intel")) {
            score += 8
          } else {
            score += 5
          }
        }

        // Screen score (0-10 points)
        const totalPixels = screenSize.width * screenSize.height * pixelRatio
        if (totalPixels >= 2073600) score += 10 // 1920x1080 or higher
        else if (totalPixels >= 921600) score += 6 // 1280x720 or higher
        else score += 3

        // Determine performance level
        if (score >= 70) {
          setPerformanceLevel("high")
        } else if (score >= 40) {
          setPerformanceLevel("medium")
        } else {
          setPerformanceLevel("low")
        }
      } catch (error) {
        console.warn("Device capability detection failed:", error)
        setPerformanceLevel("medium") // Fallback to medium
      } finally {
        setIsLoading(false)
      }
    }

    detectCapabilities()
  }, [])

  return {
    performanceLevel,
    capabilities,
    isLoading,
  }
}
