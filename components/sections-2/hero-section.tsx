"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wheat, Users, Recycle, Heart, Sparkles, Play, ArrowUpRight, CheckCircle, TrendingUp } from "lucide-react"
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
  variant?: "default" | "aurora" | "waves" | "geometric" | "nebula"
}

export const HeroSection = ({ performanceLevel, animationSettings, variant = "default" }: HeroSectionProps) => {
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const shouldReduceMotion = useReducedMotion()

  const heroY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : -50])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, shouldReduceMotion ? 1 : 0])

  // Get variant-specific colors and animations
  const getVariantStyles = () => {
    switch (variant) {
      case "aurora":
        return {
          badgeColors: "bg-green-500/20 text-green-300 border-green-500/30",
          titleGradient: "from-green-400 via-blue-400 to-purple-400",
          buttonGradient: "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
          floatingColors: {
            primary: "from-green-400 to-blue-500",
            secondary: "from-blue-400 to-purple-500",
          },
        }
      case "waves":
        return {
          badgeColors: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          titleGradient: "from-blue-400 via-cyan-400 to-teal-400",
          buttonGradient: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
          floatingColors: {
            primary: "from-blue-400 to-cyan-500",
            secondary: "from-cyan-400 to-teal-500",
          },
        }
      case "geometric":
        return {
          badgeColors: "bg-orange-500/20 text-orange-300 border-orange-500/30",
          titleGradient: "from-orange-400 via-red-400 to-pink-400",
          buttonGradient: "from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
          floatingColors: {
            primary: "from-orange-400 to-red-500",
            secondary: "from-red-400 to-pink-500",
          },
        }
      case "nebula":
        return {
          badgeColors: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          titleGradient: "from-purple-400 via-pink-400 to-indigo-400",
          buttonGradient: "from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600",
          floatingColors: {
            primary: "from-purple-400 to-pink-500",
            secondary: "from-pink-400 to-indigo-500",
          },
        }
      default:
        return {
          badgeColors: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          titleGradient: "from-purple-400 via-pink-400 to-blue-400",
          buttonGradient: "from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600",
          floatingColors: {
            primary: "from-orange-400 to-pink-500",
            secondary: "from-purple-400 to-indigo-500",
          },
        }
    }
  }

  const variantStyles = getVariantStyles()

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
              <Badge
                className={`${variantStyles.badgeColors} px-4 py-2 text-sm font-medium backdrop-blur-sm relative overflow-hidden`}
              >
                {performanceLevel === "high" && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${variantStyles.floatingColors.primary}/20`}
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
                className={`block bg-gradient-to-r ${variantStyles.titleGradient} bg-clip-text text-transparent`}
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
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                style={{
                  backgroundSize: "200% 200%",
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
              <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}} whileTap={{ scale: 0.98 }}>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${variantStyles.buttonGradient} text-white font-semibold px-8 py-4 relative overflow-hidden group`}
                >
                  <span className="relative z-10 flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Sekarang
                  </span>
                  {performanceLevel === "high" && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-r ${variantStyles.floatingColors.secondary}/50 opacity-0 group-hover:opacity-100`}
                      transition={{ duration: 0.3 }}
                    />
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

            {/* Benefits List */}
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
                  whileHover={performanceLevel !== "low" ? { x: 3 } : {}}
                >
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...animationSettings, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <motion.div whileHover={performanceLevel !== "low" ? { y: -3, scale: 1.01 } : {}}>
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 overflow-hidden shadow-2xl relative">
                  <div
                    className={`bg-gradient-to-r ${variantStyles.buttonGradient.split(" ")[0]} p-6 relative overflow-hidden`}
                  >
                    {performanceLevel === "high" && (
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-r ${variantStyles.floatingColors.primary}/20`}
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 4,
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
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                        <motion.div
                          className="w-2 h-2 bg-green-400 rounded-full mr-2"
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                        Live
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 relative overflow-hidden"
                        whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Wheat className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium text-slate-300">Makanan Diselamatkan</span>
                        </div>
                        <div className="text-2xl font-bold text-white">24.5kg</div>
                        <div className="text-xs text-green-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% minggu ini
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 relative overflow-hidden"
                        whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Recycle className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-slate-300">Sampah Didaur Ulang</span>
                        </div>
                        <div className="text-2xl font-bold text-white">18.2kg</div>
                        <div className="text-xs text-blue-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8% minggu ini
                        </div>
                      </motion.div>
                    </div>

                    {/* Activity Feed */}
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
                            className="flex items-center space-x-3 p-3 bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/20"
                            whileHover={performanceLevel !== "low" ? { x: 3 } : {}}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <motion.div
                              className={`w-2 h-2 rounded-full ${activity.color} shadow-lg`}
                              animate={performanceLevel === "high" ? { scale: [1, 1.2, 1] } : {}}
                              transition={
                                performanceLevel === "high"
                                  ? { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }
                                  : {}
                              }
                            />
                            <div className="flex-1">
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

              {/* Variant-specific Floating Elements */}
              <motion.div
                animate={
                  performanceLevel !== "low"
                    ? variant === "geometric"
                      ? { rotate: [0, 360], scale: [1, 1.1, 1] }
                      : { y: [0, -15, 0], scale: [1, 1.05, 1] }
                    : {}
                }
                transition={
                  performanceLevel !== "low"
                    ? {
                        duration: variant === "geometric" ? 8 : 4,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: variant === "geometric" ? "linear" : "easeInOut",
                      }
                    : {}
                }
                className={`absolute -top-4 -right-4 bg-gradient-to-r ${variantStyles.floatingColors.primary} p-3 rounded-xl shadow-lg`}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </motion.div>

              <motion.div
                animate={
                  performanceLevel !== "low"
                    ? variant === "waves"
                      ? {
                          y: [0, 15, 0],
                          x: [0, Math.sin(Date.now() * 0.001) * 5, 0],
                          scale: [1, 1.05, 1],
                        }
                      : { y: [0, 15, 0], scale: [1, 1.05, 1] }
                    : {}
                }
                transition={
                  performanceLevel !== "low"
                    ? {
                        duration: 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                className={`absolute -bottom-4 -left-4 bg-gradient-to-r ${variantStyles.floatingColors.secondary} p-3 rounded-xl shadow-lg`}
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
