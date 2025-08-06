"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Monitor, Smartphone, Zap, Settings, Info, ChevronDown, Cpu, HardDrive, Wifi } from "lucide-react"
import { useState } from "react"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface PerformanceIndicatorProps {
  performanceLevel: PerformanceLevel
  capabilities?: {
    cores: number
    memory: number
    connection: string
    gpu: string
    isMobile: boolean
  } | null
  isLoading?: boolean
}

export const PerformanceIndicator = ({ performanceLevel, capabilities, isLoading }: PerformanceIndicatorProps) => {
  const [showDetails, setShowDetails] = useState(false)

  const getPerformanceConfig = () => {
    switch (performanceLevel) {
      case "high":
        return {
          label: "High Performance",
          color: "bg-green-500/20 text-green-300 border-green-500/30",
          icon: Zap,
          description: "Full animations & effects enabled",
          features: [
            "Advanced particle systems",
            "Complex gradient animations",
            "Mouse-interactive backgrounds",
            "High-quality blur effects",
            "60fps target animations",
          ],
        }
      case "medium":
        return {
          label: "Balanced Performance",
          color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
          icon: Monitor,
          description: "Optimized animations enabled",
          features: [
            "Essential animations only",
            "Simplified particle effects",
            "Reduced gradient complexity",
            "Optimized blur effects",
            "30fps target animations",
          ],
        }
      case "low":
        return {
          label: "Performance Mode",
          color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          icon: Smartphone,
          description: "Minimal animations for best performance",
          features: [
            "Static backgrounds",
            "Essential transitions only",
            "No particle effects",
            "Simplified gradients",
            "Battery optimized",
          ],
        }
    }
  }

  const config = getPerformanceConfig()

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Badge className="bg-slate-800/80 text-slate-300 border-slate-700/50 backdrop-blur-sm">
          <div className="w-2 h-2 bg-slate-400 rounded-full mr-2 animate-pulse" />
          Detecting Performance...
        </Badge>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Badge
          className={`${config.color} backdrop-blur-sm cursor-pointer transition-all hover:scale-105`}
          onClick={() => setShowDetails(!showDetails)}
        >
          <config.icon className="w-4 h-4 mr-2" />
          {config.label}
          <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showDetails ? "rotate-180" : ""}`} />
        </Badge>

        {/* Details Panel */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80"
          >
            <Card className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <config.icon className="w-5 h-5 text-slate-300" />
                    <span className="font-semibold text-white">{config.label}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    ×
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 mb-4">{config.description}</p>

                {/* Device Capabilities */}
                {capabilities && (
                  <div className="space-y-2 mb-4 p-3 bg-slate-800/50 rounded-lg">
                    <h4 className="text-sm font-medium text-white flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Device Info
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Cpu className="w-3 h-3" />
                        <span>{capabilities.cores} cores</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HardDrive className="w-3 h-3" />
                        <span>{capabilities.memory}GB RAM</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wifi className="w-3 h-3" />
                        <span>{capabilities.connection.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Monitor className="w-3 h-3" />
                        <span>{capabilities.isMobile ? "Mobile" : "Desktop"}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Active Features
                  </h4>
                  <ul className="space-y-1">
                    {config.features.map((feature, index) => (
                      <li key={index} className="text-xs text-slate-400 flex items-center">
                        <div className="w-1 h-1 bg-slate-500 rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Performance Tips */}
                <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
                  <p className="text-xs text-slate-400">
                    {performanceLevel === "low"
                      ? "💡 Close other apps to improve performance"
                      : performanceLevel === "medium"
                        ? "💡 Performance automatically optimized for your device"
                        : "💡 Enjoying full experience on your powerful device"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
