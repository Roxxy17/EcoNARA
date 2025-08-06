"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Cpu,
  Monitor,
  Smartphone,
  Zap,
  Gauge,
  HardDrive,
  Wifi,
  X,
} from "lucide-react";
import type { PerformanceLevel } from "@/hooks/use-device-performance";
import { useState } from "react";

interface PerformanceIndicatorProps {
  performanceLevel: PerformanceLevel;
  capabilities: {
    cores: number;
    memory: number;
    connection: string;
    gpu: string;
    isMobile: boolean;
  } | null;
  isLoading: boolean;
}

export const PerformanceIndicator = ({
  performanceLevel,
  capabilities,
  isLoading,
}: PerformanceIndicatorProps) => {
  const [expanded, setExpanded] = useState(false);

  const getPerformanceColor = () => {
    switch (performanceLevel) {
      case "high":
        return "text-green-400 border-green-500/30 bg-green-500/20";
      case "medium":
        return "text-yellow-400 border-yellow-500/30 bg-yellow-500/20";
      case "low":
        return "text-red-400 border-red-500/30 bg-red-500/20";
      default:
        return "text-slate-400 border-slate-500/30 bg-slate-500/20";
    }
  };

  const getPerformanceIcon = () => {
    switch (performanceLevel) {
      case "high":
        return Zap;
      case "medium":
        return Gauge;
      case "low":
        return Monitor;
      default:
        return Cpu;
    }
  };

  const PerformanceIcon = getPerformanceIcon();

  // Mini icon only (collapsed)
  if (!expanded) {
    return (
      <motion.div
        className="fixed bottom-6 left-6 z-50 cursor-pointer flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.7 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        tabIndex={0}
        onClick={() => setExpanded(true)}
        onFocus={() => setExpanded(true)}
        title="Show performance details"
      >
        <div className="rounded-full bg-slate-900/80 p-2 shadow-lg border border-slate-700/50">
          <PerformanceIcon className={`w-6 h-6 ${getPerformanceColor().split(" ")[0]}`} />
        </div>
      </motion.div>
    );
  }

  // Expanded view
  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 left-6 z-50 cursor-pointer"
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.8, x: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        tabIndex={0}
        onBlur={() => setExpanded(false)}
      >
        <div onClick={() => setExpanded(false)} className="absolute inset-0 z-0" tabIndex={-1} aria-label="Close" />
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:bg-slate-900/90 transition-all duration-300 shadow-lg relative z-10">
          <CardContent className="p-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{
                    rotate: performanceLevel === "high" ? [0, 360] : 0,
                  }}
                  transition={{
                    duration: performanceLevel === "high" ? 2 : 0,
                    repeat:
                      performanceLevel === "high"
                        ? Number.POSITIVE_INFINITY
                        : 0,
                    ease: "linear",
                  }}
                >
                  <PerformanceIcon
                    className={`w-4 h-4 ${getPerformanceColor().split(" ")[0]}`}
                  />
                </motion.div>
                <Badge className={`text-xs ${getPerformanceColor()}`}>
                  {performanceLevel.toUpperCase()}
                </Badge>
              </div>

              {capabilities && (
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <div className="flex items-center space-x-1">
                    {capabilities.isMobile ? (
                      <Smartphone className="w-3 h-3" />
                    ) : (
                      <Monitor className="w-3 h-3" />
                    )}
                    <span>{capabilities.cores}c</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <HardDrive className="w-3 h-3" />
                    <span>{capabilities.memory}GB</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Wifi className="w-3 h-3" />
                    <span>{capabilities.connection.toUpperCase()}</span>
                  </div>
                </div>
              )}
            </div>
            <button
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-slate-800/70 hover:bg-slate-700/90 transition text-slate-300 hover:text-white shadow"
              onClick={() => setExpanded(false)}
              tabIndex={0}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
