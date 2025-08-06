"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Leaf, Recycle, Heart, Award } from "lucide-react"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

const stats = [
  {
    icon: Users,
    value: 15000,
    suffix: "+",
    label: "Pengguna Aktif",
    description: "Komunitas yang tergabung",
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Leaf,
    value: 2500,
    suffix: "kg",
    label: "Makanan Diselamatkan",
    description: "Setiap bulannya",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Recycle,
    value: 1800,
    suffix: "kg",
    label: "Sampah Didaur Ulang",
    description: "Berkontribusi untuk lingkungan",
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Heart,
    value: 95,
    suffix: "%",
    label: "Tingkat Kepuasan",
    description: "Feedback pengguna positif",
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-500/10",
  },
]

interface StatsSectionProps {
  performanceLevel: PerformanceLevel
}

const AnimatedCounter = ({
  value,
  duration = 2000,
  performanceLevel,
}: {
  value: number
  duration?: number
  performanceLevel: PerformanceLevel
}) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView && !isVisible) {
      setIsVisible(true)

      if (performanceLevel === "low") {
        setCount(value)
        return
      }

      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * value))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [inView, value, duration, isVisible, performanceLevel])

  return <span ref={ref}>{count.toLocaleString()}</span>
}

export const StatsSection = ({ performanceLevel }: StatsSectionProps) => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <Award className="w-8 h-8 text-yellow-400 mr-3" />
            <span className="text-yellow-400 font-semibold">Dampak Nyata</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Angka yang
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Berbicara Sendiri
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Pencapaian komunitas kami dalam membangun masa depan yang lebih berkelanjutan
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={performanceLevel !== "low" ? { y: -5, scale: 1.02 } : {}}
            >
              <Card
                className={`${stat.bgColor} backdrop-blur-xl border border-slate-700/50 relative overflow-hidden group`}
              >
                {performanceLevel === "high" && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10`}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <CardContent className="p-6 text-center relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    whileHover={performanceLevel !== "low" ? { scale: 1.1, rotate: 5 } : {}}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Value */}
                  <div className="mb-2">
                    <span className="text-4xl lg:text-5xl font-bold text-white">
                      <AnimatedCounter value={stat.value} performanceLevel={performanceLevel} />
                    </span>
                    <span className="text-2xl font-bold text-slate-400 ml-1">{stat.suffix}</span>
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-2">{stat.label}</h3>
                  <p className="text-sm text-slate-400">{stat.description}</p>

                  {/* Trend Indicator */}
                  <motion.div
                    className="flex items-center justify-center mt-4 text-green-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-xs font-medium">+12% bulan ini</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Achievement Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "🏆 Best Sustainability App 2024",
              "🌱 Green Tech Innovation Award",
              "👥 Community Choice Winner",
              "⭐ 4.9/5 User Rating",
            ].map((achievement, index) => (
              <motion.div
                key={index}
                className="bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/50"
                whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="text-sm text-slate-300 font-medium">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
