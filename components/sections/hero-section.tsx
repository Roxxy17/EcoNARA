"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wheat, Users, Recycle, Heart, Sparkles, Play, ArrowUpRight, CheckCircle, TrendingUp } from 'lucide-react'
import type { PerformanceLevel } from "@/hooks/use-device-performance"

const benefits = [
  "Mengurangi food waste hingga 80%",
  "Meningkatkan ketahanan pangan komunitas",
  "Mengoptimalkan pengelolaan sampah",
  "Membangun ekonomi sirkular lokal",
  "Memberdayakan masyarakat",
  "Teknologi AI yang mudah digunakan",
]

interface HeroSectionProps {
  performanceLevel: PerformanceLevel
  animationSettings: {
    duration: number
    ease: string | number[]
  }
  variant?: "default" | "aurora" | "geometric" | "nebula" | "night"
}

export const HeroSection = ({ performanceLevel, animationSettings, variant = "default" }: HeroSectionProps) => {
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  const heroY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, shouldReduceMotion ? 1 : 0])

  // Get theme-based colors
  const getThemeColors = () => {
    switch (variant) {
      case "aurora":
        return {
          primary: "text-green-400",
          secondary: "text-blue-400",
          accent: "text-emerald-300",
          gradient: "from-green-400 via-blue-400 to-emerald-400",
        }
      case "geometric":
        return {
          primary: "text-red-400",
          secondary: "text-orange-400",
          accent: "text-yellow-300",
          gradient: "from-red-400 via-orange-400 to-yellow-400",
        }
      case "nebula":
        return {
          primary: "text-purple-400",
          secondary: "text-pink-400",
          accent: "text-violet-300",
          gradient: "from-purple-400 via-pink-400 to-violet-400",
        }
      case "night":
        return {
          primary: "text-blue-400",
          secondary: "text-cyan-400",
          accent: "text-blue-900",
          gradient: "from-blue-400 via-cyan-400 to-blue-900",
        }
      default:
        // Default sekarang adalah warna biru/teal (waves lama)
        return {
          primary: "text-blue-400",
          secondary: "text-cyan-400",
          accent: "text-teal-300",
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <section ref={heroRef} className="relative pt-32 pb-20 z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={animationSettings}
            style={{ y: heroY, opacity: heroOpacity }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...animationSettings, delay: 0.2 }}
            >
              <Badge className={`bg-${variant === 'default' ? 'purple' : variant === 'aurora' ? 'green' : variant === 'waves' ? 'blue' : variant === 'geometric' ? 'red' : 'purple'}-500/20 ${themeColors.primary} border-${variant === 'default' ? 'purple' : variant === 'aurora' ? 'green' : variant === 'waves' ? 'blue' : variant === 'geometric' ? 'red' : 'purple'}-500/30 px-4 py-2 text-sm font-medium backdrop-blur-sm relative overflow-hidden`}>
                {performanceLevel === "high" && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', '/20 via-').replace(' to-', '/20 to-')}/20`}
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Platform Keberlanjutan Terdepan
                </span>
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...animationSettings, delay: 0.3 }}
              className="text-5xl lg:text-6xl font-bold text-white leading-tight"
            >
              Membangun
              <motion.span
                className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                animate={
                  performanceLevel === "high"
                    ? {
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }
                    : {}
                }
                transition={
                  performanceLevel === "high"
                    ? {
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                style={{
                  backgroundSize: "300% 300%",
                }}
              >
                Komunitas
              </motion.span>
              Berkelanjutan
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...animationSettings, delay: 0.4 }}
              className="text-xl text-slate-300 leading-relaxed max-w-lg"
            >
              Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi
              pangan, dan membangun ekonomi sirkular.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...animationSettings, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', ' to-')} hover:opacity-90 text-white font-semibold px-8 py-4 relative overflow-hidden group`}
                >
                  <span className="relative z-10 flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Sekarang
                  </span>
                  {performanceLevel === "high" && (
                    <>
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', ' to-')}`}
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', ' to-')} opacity-0 group-hover:opacity-50`}
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        style={{
                          backgroundSize: "200% 200%",
                        }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 bg-transparent backdrop-blur-sm"
                >
                  Lihat Demo
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...animationSettings, delay: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8"
            >
              {benefits.slice(0, 4).map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  whileHover={performanceLevel !== "low" ? { x: 5 } : {}}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...animationSettings, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Enhanced Main Dashboard Card */}
              <motion.div
                whileHover={performanceLevel !== "low" ? { y: -5, rotateY: 5 } : {}}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 overflow-hidden shadow-2xl relative">
                  {performanceLevel === "high" && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', '/10 via-').replace(' to-', '/10 to-')}/10 opacity-0 group-hover:opacity-100`}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                      }}
                    />
                  )}
                  <div className={`bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', ' to-')} p-6 relative overflow-hidden`}>
                    {performanceLevel === "high" && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Dashboard Komunitas</h3>
                          <p className="text-white/80 text-sm">RT 05, Kelurahan Maju</p>
                        </div>
                      </div>
                      <motion.div
                        animate={performanceLevel === "high" ? { scale: [1, 1.1, 1] } : {}}
                        transition={
                          performanceLevel === "high" ? { duration: 2, repeat: Number.POSITIVE_INFINITY } : {}
                        }
                      >
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          <motion.div
                            className="w-2 h-2 bg-green-400 rounded-full mr-2"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          />
                          Live
                        </Badge>
                      </motion.div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 relative overflow-hidden"
                        whileHover={performanceLevel !== "low" ? { scale: 1.02, y: -2 } : {}}
                      >
                        {performanceLevel === "high" && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="flex items-center space-x-2 mb-2 relative z-10">
                          <Wheat className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium text-slate-300">Makanan Diselamatkan</span>
                        </div>
                        <div className="text-2xl font-bold text-white relative z-10">24.5kg</div>
                        <div className="text-xs text-green-400 flex items-center relative z-10">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% minggu ini
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 relative overflow-hidden"
                        whileHover={performanceLevel !== "low" ? { scale: 1.02, y: -2 } : {}}
                      >
                        {performanceLevel === "high" && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 opacity-0 hover:opacity-100"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <div className="flex items-center space-x-2 mb-2 relative z-10">
                          <Recycle className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-slate-300">Sampah Didaur Ulang</span>
                        </div>
                        <div className="text-2xl font-bold text-white relative z-10">18.2kg</div>
                        <div className="text-xs text-blue-400 flex items-center relative z-10">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8% minggu ini
                        </div>
                      </motion.div>
                    </div>

                    {/* Enhanced Activity Feed */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Aktivitas Terbaru</h4>
                      <div className="space-y-2">
                        {[
                          { action: "Bu Sari mendonasikan 5kg beras", time: "2 menit lalu", color: "bg-green-500" },
                          {
                            action: "Pak Joko menggunakan Food Rescue AI",
                            time: "15 menit lalu",
                            color: "bg-blue-500",
                          },
                          { action: "RT 03 mencapai target daur ulang", time: "1 jam lalu", color: "bg-purple-500" },
                        ].map((activity, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center space-x-3 p-3 bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/20 relative overflow-hidden"
                            whileHover={performanceLevel !== "low" ? { x: 5, scale: 1.01 } : {}}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {performanceLevel === "high" && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-transparent opacity-0 hover:opacity-100"
                                transition={{ duration: 0.3 }}
                              />
                            )}
                            <motion.div
                              className={`w-2 h-2 rounded-full ${activity.color} shadow-lg relative z-10`}
                              animate={performanceLevel === "high" ? { scale: [1, 1.2, 1] } : {}}
                              transition={
                                performanceLevel === "high"
                                  ? { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }
                                  : {}
                              }
                            />
                            <div className="flex-1 relative z-10">
                              <p className="text-sm font-medium text-white">{activity.action}</p>
                              <p className="text-xs text-slate-400">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Floating Elements */}
              <motion.div
                animate={
                  performanceLevel !== "low"
                    ? {
                        y: [0, -20, 0],
                        rotate: [0, 10, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={
                  performanceLevel !== "low"
                    ? {
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                className={`absolute -top-4 -right-4 bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', ' to-')} p-3 rounded-xl shadow-lg relative overflow-hidden`}
              >
                {performanceLevel === "high" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                )}
                <Sparkles className="w-6 h-6 text-white relative z-10" />
              </motion.div>

              <motion.div
                animate={
                  performanceLevel !== "low"
                    ? {
                        y: [0, 20, 0],
                        rotate: [0, -10, 0],
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={
                  performanceLevel !== "low"
                    ? {
                        duration: 7,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                className={`absolute -bottom-4 -left-4 bg-gradient-to-r ${themeColors.gradient.replace('text-', 'from-').replace(' via-', ' to-')} p-3 rounded-xl shadow-lg relative overflow-hidden`}
              >
                {performanceLevel === "high" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent"
                    animate={{
                      rotate: [360, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                )}
                <Heart className="w-6 h-6 text-white relative z-10" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
