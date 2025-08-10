"use client"

import { useTheme } from "next-themes"
import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Loader2, ArrowRight, Sparkles, Leaf, Droplets, Wind, CheckCircle, Clock, Zap, Globe } from "lucide-react"

interface TransitionPageProps {
  type?: "loading" | "navigating" | "processing" | "success" | "custom"
  title?: string
  subtitle?: string
  duration?: number
  onComplete?: () => void
  showProgress?: boolean
  customIcon?: React.ReactNode
  theme?: "aurora" | "night" | "geometric" | "nebula" | "default"
}

export default function TransitionPage({
  type = "loading",
  title,
  subtitle,
  duration = 3000,
  onComplete,
  showProgress = true,
  customIcon,
}: TransitionPageProps) {
  const { theme: currentTheme = "default" } = useTheme()
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Different messages for different transition types
  const messages = {
    loading: [
      { title: "Memuat Halaman", subtitle: "Menyiapkan konten untuk Anda..." },
      { title: "Mengambil Data", subtitle: "Memuat informasi terbaru..." },
      { title: "Hampir Selesai", subtitle: "Tinggal beberapa detik lagi..." },
    ],
    navigating: [
      { title: "Berpindah Halaman", subtitle: "Menuju destinasi Anda..." },
      { title: "Menyiapkan Konten", subtitle: "Memuat halaman baru..." },
      { title: "Hampir Sampai", subtitle: "Sebentar lagi..." },
    ],
    processing: [
      { title: "Memproses Data", subtitle: "Sedang mengolah informasi..." },
      { title: "Menyimpan Perubahan", subtitle: "Menyimpan data Anda..." },
      { title: "Menyelesaikan", subtitle: "Hampir selesai..." },
    ],
    success: [
      { title: "Berhasil!", subtitle: "Operasi telah selesai" },
      { title: "Sukses", subtitle: "Semua berjalan lancar" },
      { title: "Selesai", subtitle: "Terima kasih!" },
    ],
    custom: [{ title: title || "Memuat", subtitle: subtitle || "Mohon tunggu..." }],
  }

  // Theme configurations
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "aurora":
        return {
          gradient: "from-green-400 via-blue-400 to-emerald-400",
          bgGradient: "from-slate-900 via-green-900 to-blue-900",
          accent: "text-green-400",
          accentBg: "bg-green-500/10",
          progressGradient: "from-green-400 via-blue-400 to-emerald-400",
        }
      case "night":
        return {
          gradient: "from-blue-600 via-indigo-400 to-cyan-400",
          bgGradient: "from-slate-900 via-blue-900 to-indigo-900",
          accent: "text-blue-400",
          accentBg: "bg-blue-500/10",
          progressGradient: "from-blue-600 via-indigo-400 to-cyan-400",
        }
      case "geometric":
        return {
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          bgGradient: "from-slate-900 via-red-900 to-orange-900",
          accent: "text-red-400",
          accentBg: "bg-red-500/10",
          progressGradient: "from-red-400 via-orange-400 to-yellow-400",
        }
      case "nebula":
        return {
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          bgGradient: "from-slate-900 via-purple-900 to-pink-900",
          accent: "text-purple-400",
          accentBg: "bg-purple-500/10",
          progressGradient: "from-purple-400 via-pink-400 to-violet-400",
        }
      default:
        return {
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          bgGradient: "from-slate-900 via-blue-900 to-cyan-900",
          accent: "text-blue-400",
          accentBg: "bg-blue-500/10",
          progressGradient: "from-blue-400 via-cyan-400 to-teal-400",
        }
    }
  }

  const themeColors = getThemeColors(currentTheme)

  // Get icon based on type
  const getIcon = () => {
    if (customIcon) return customIcon

    switch (type) {
      case "loading":
        return <Loader2 className="w-12 h-12 animate-spin" />
      case "navigating":
        return <ArrowRight className="w-12 h-12" />
      case "processing":
        return <Zap className="w-12 h-12" />
      case "success":
        return <CheckCircle className="w-12 h-12" />
      default:
        return <Clock className="w-12 h-12" />
    }
  }

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsComplete(true)
          clearInterval(progressInterval)
          if (onComplete) {
            setTimeout(onComplete, 500)
          }
          return 100
        }
        return prev + 100 / (duration / 100)
      })
    }, 100)

    // Change messages periodically
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages[type].length)
    }, duration / messages[type].length)

    return () => {
      clearInterval(progressInterval)
      clearInterval(messageInterval)
    }
  }, [duration, onComplete, type])

  const currentMsg = messages[type][currentMessage] || messages[type][0]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeColors.bgGradient}`} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

      {/* Animated Background Elements */}
      <motion.div
        className={`absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r ${themeColors.gradient} opacity-10 rounded-full blur-3xl`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l ${themeColors.gradient} opacity-10 rounded-full blur-3xl`}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.15, 0.25, 0.15],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating Environmental Icons */}
      <AnimatePresence>
        {[
          { Icon: Leaf, position: "top-1/4 left-1/6", delay: 0.5 },
          { Icon: Droplets, position: "top-1/3 right-1/6", delay: 1 },
          { Icon: Wind, position: "bottom-1/3 left-1/5", delay: 1.5 },
          { Icon: Globe, position: "bottom-1/4 right-1/5", delay: 2 },
        ].map(({ Icon, position, delay }, index) => (
          <motion.div
            key={index}
            className={`absolute ${position} ${themeColors.accent} opacity-20`}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{
              opacity: 0.2,
              scale: 1,
              rotate: 0,
              y: [0, -10, 0],
              x: [0, 5, -5, 0],
            }}
            transition={{
              delay,
              duration: 0.8,
              y: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              x: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
            }}
          >
            <Icon className="w-6 h-6" />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
        className="flex flex-col items-center relative z-10 max-w-md mx-auto px-6"
      >
        {/* Icon Container */}
        <motion.div
          className={`mb-8 p-6 rounded-full ${themeColors.accentBg} backdrop-blur-sm border border-white/10 relative`}
          animate={{
            scale: type === "loading" ? [1, 1.1, 1] : 1,
            rotate: type === "navigating" ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: type === "loading" ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
          }}
        >
          {/* Glow Effect */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient} opacity-20 rounded-full blur-xl`}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <div className={`relative z-10 ${themeColors.accent}`}>{getIcon()}</div>
        </motion.div>

        {/* Text Content with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <motion.h2
              className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent mb-3`}
            >
              {currentMsg.title}
            </motion.h2>
            <motion.p className="text-slate-300 text-lg font-medium">{currentMsg.subtitle}</motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Section */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-sm"
          >
            {/* Progress Percentage */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400 text-sm font-medium">Progress</span>
              <motion.span
                key={Math.floor(progress)}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={`text-sm font-bold ${themeColors.accent}`}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>

            {/* Progress Bar */}
            <div className="relative w-full h-2 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/30">
              {/* Background Glow */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient} opacity-20 rounded-full`}
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Progress Fill */}
              <motion.div
                className={`h-full bg-gradient-to-r ${themeColors.progressGradient} rounded-full shadow-lg relative overflow-hidden`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex space-x-2 mt-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 bg-gradient-to-r ${themeColors.gradient} rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Success State */}
      <AnimatePresence>
        {isComplete && type === "success" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              className={`text-6xl ${themeColors.accent}`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <CheckCircle className="w-24 h-24" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Decorative Text */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="flex items-center space-x-3 text-slate-400 text-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <span>EcoNARA - Membangun masa depan berkelanjutan</span>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Leaf className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
