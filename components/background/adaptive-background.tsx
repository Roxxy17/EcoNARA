"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring } from "framer-motion"
import { FloatingParticle } from "./floating-particle"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface AdaptiveBackgroundProps {
  performanceLevel: PerformanceLevel
  variant?: "default" | "aurora" | "night" | "geometric" | "nebula"
}

export function AdaptiveBackground({ performanceLevel, variant = "default" }: AdaptiveBackgroundProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 🟢 Semua hooks tetap dipanggil setiap render!
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const getThemeColors = () => {
    switch (variant) {
      case "aurora":
        return {
          primary: "rgba(34, 197, 94, 0.4)",
          secondary: "rgba(59, 130, 246, 0.3)",
          accent: "rgba(16, 185, 129, 0.3)",
          base: "from-slate-950 via-green-950/20 to-slate-950",
          gradient: "from-green-500/10 via-transparent to-blue-500/10",
        }
      case "geometric":
        return {
          primary: "rgba(245, 101, 101, 0.4)",
          secondary: "rgba(251, 146, 60, 0.3)",
          accent: "rgba(251, 191, 36, 0.3)",
          base: "from-slate-950 via-red-950/20 to-slate-950",
          gradient: "from-red-500/10 via-transparent to-orange-500/10",
        }
      case "nebula":
        return {
          primary: "rgba(139, 92, 246, 0.4)",
          secondary: "rgba(236, 72, 153, 0.3)",
          accent: "rgba(168, 85, 247, 0.3)",
          base: "from-slate-950 via-purple-950/40 to-slate-900",
          gradient: "from-purple-500/10 via-transparent to-pink-500/10",
        }
      case "night":
        return {
          primary: "rgba(59, 130, 246, 0.35)",        // biru
          secondary: "rgba(6, 182, 212, 0.25)",       // cyan
          accent: "rgba(30, 64, 175, 0.25)",          // biru navy
          base: "from-slate-950 via-blue-950/40 to-slate-900",
          gradient: "from-blue-500/10 via-transparent to-cyan-500/10",
        }
      default:
        // Default sekarang adalah warna biru/teal (waves lama)
        return {
          primary: "rgba(59, 130, 246, 0.4)",
          secondary: "rgba(16, 185, 129, 0.3)",
          accent: "rgba(6, 182, 212, 0.3)",
          base: "from-slate-950 via-blue-950/20 to-slate-950",
          gradient: "from-blue-500/10 via-transparent to-cyan-500/10",
        }
    }
  }

  const colors = getThemeColors()

  // 🟢 Pengecekan mounted di dalam return JSX
  if (!mounted) return <div className="fixed inset-0 z-0" />;

  if (shouldReduceMotion || performanceLevel === "low") {
    return (
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.base}`}></div>
        <div className={`absolute inset-0 opacity-20 bg-gradient-to-r ${colors.gradient}`}></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0">
      {/* Enhanced base gradient with depth */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.base}`}></div>

      {/* Mouse-interactive layer for high-end devices */}
      {performanceLevel === "high" && (
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${springX}px ${springY}px, 
              ${colors.primary} 0%, 
              ${colors.secondary} 25%, 
              ${colors.accent} 50%, 
              transparent 70%)`,
            willChange: "background",
          }}
        />
      )}

      {/* Enhanced animated layers based on performance */}
      {performanceLevel === "high" && (
        <>
          {/* Primary iridescent layer */}
          <motion.div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, ${colors.primary} 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, ${colors.secondary} 0%, transparent 50%),
                radial-gradient(circle at 40% 90%, ${colors.accent} 0%, transparent 50%),
                radial-gradient(circle at 90% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 10% 80%, rgba(245, 101, 101, 0.3) 0%, transparent 50%)
              `,
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.1, 1.05, 1],
              rotate: [0, 2, -1, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Secondary color-shifting layer */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                conic-gradient(from 0deg at 50% 50%, 
                  ${colors.primary} 0deg, 
                  ${colors.secondary} 60deg,
                  ${colors.accent} 120deg,
                  rgba(16, 185, 129, 0.3) 180deg,
                  rgba(245, 101, 101, 0.3) 240deg,
                  ${colors.primary} 300deg,
                  ${colors.primary} 360deg)
              `,
              willChange: "transform",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Enhanced floating orbs with better physics */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, 
                ${colors.primary.replace('0.4', '0.8')} 0%, 
                ${colors.secondary} 40%, 
                transparent 70%)`,
              top: "0%",
              left: "0%",
              willChange: "transform",
            }}
            animate={{
              x: [0, 150, 75, 0],
              y: [0, -120, -60, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-25"
            style={{
              background: `radial-gradient(circle, 
                ${colors.accent.replace('0.3', '0.8')} 0%, 
                rgba(16, 185, 129, 0.4) 40%, 
                transparent 70%)`,
              bottom: "5%",
              right: "5%",
              willChange: "transform",
            }}
            animate={{
              x: [0, -100, -50, 0],
              y: [0, 100, 50, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{
              duration: 35,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 5,
            }}
          />

          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full blur-2xl opacity-35"
            style={{
              background: `radial-gradient(circle, 
                ${colors.secondary.replace('0.3', '0.8')} 0%, 
                rgba(245, 101, 101, 0.4) 40%, 
                transparent 70%)`,
              top: "40%",
              left: "40%",
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.4, 0.8, 1],
              rotate: [0, 180, 360],
              x: [0, 50, -25, 0],
              y: [0, -25, 25, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 10,
            }}
          />

          {/* Enhanced multi-layer shimmer effects */}
          <motion.div
            className="absolute inset-0 opacity-15"
            style={{
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.2), 
                ${colors.primary.replace('0.4', '0.1')},
                rgba(255, 255, 255, 0.2), 
                transparent)`,
              willChange: "transform",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(45deg, 
                transparent, 
                ${colors.secondary.replace('0.3', '0.15')}, 
                transparent)`,
              willChange: "transform",
            }}
            animate={{
              x: ["-100%", "100%"],
              y: ["-50%", "50%"],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </>
      )}

      {performanceLevel === "medium" && (
        <>
          {/* Medium-end: Enhanced balanced experience */}
          <motion.div
            className="absolute inset-0 opacity-45"
            style={{
              background: `
                radial-gradient(circle at 25% 35%, ${colors.primary} 0%, transparent 60%),
                radial-gradient(circle at 75% 65%, ${colors.secondary} 0%, transparent 60%),
                radial-gradient(circle at 50% 80%, ${colors.accent} 0%, transparent 60%)
              `,
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, 
                ${colors.primary} 0deg, 
                ${colors.secondary} 120deg, 
                ${colors.accent} 240deg, 
                ${colors.primary} 360deg)`,
              willChange: "transform",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Enhanced floating orbs for medium */}
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              background: `radial-gradient(circle, ${colors.primary.replace('0.4', '0.7')} 0%, ${colors.secondary} 60%, transparent 80%)`,
              top: "8%",
              left: "8%",
              willChange: "transform",
            }}
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 35,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute w-64 h-64 rounded-full blur-2xl opacity-25"
            style={{
              background: `radial-gradient(circle, ${colors.accent.replace('0.3', '0.7')} 0%, rgba(16, 185, 129, 0.3) 60%, transparent 80%)`,
              bottom: "12%",
              right: "12%",
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 8,
            }}
          />

          {/* Medium shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-12"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
              willChange: "transform",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Enhanced particle system with adaptive count */}
      {Array.from({ length: performanceLevel === "high" ? 15 : performanceLevel === "medium" ? 8 : 4 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.6} index={i} performanceLevel={performanceLevel} />
      ))}

      {/* Enhanced grid pattern with depth */}
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(${colors.primary.replace('0.4', '0.15')} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary.replace('0.4', '0.15')} 1px, transparent 1px),
            linear-gradient(${colors.secondary.replace('0.3', '0.08')} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.secondary.replace('0.3', '0.08')} 1px, transparent 1px)
          `,
          backgroundSize:
            performanceLevel === "high"
              ? "40px 40px, 40px 40px, 120px 120px, 120px 120px"
              : performanceLevel === "medium"
                ? "50px 50px, 50px 50px, 100px 100px, 100px 100px"
                : "60px 60px",
        }}
      />

      {/* Depth layers for high-end devices */}
      {performanceLevel === "high" && (
        <>
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(circle at 30% 70%, ${colors.primary.replace('0.4', '0.2')} 0%, transparent 50%),
                          radial-gradient(circle at 70% 30%, ${colors.secondary.replace('0.3', '0.15')} 0%, transparent 50%)`,
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-8"
            style={{
              background: `linear-gradient(135deg, ${colors.primary.replace('0.4', '0.1')} 0%, transparent 50%, ${colors.accent.replace('0.2', '0.1')} 100%)`,
              willChange: "transform",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  )
}
