"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wheat, Users, Recycle, MapPin } from 'lucide-react'
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface ImpactSectionProps {
  performanceLevel: PerformanceLevel
  variant?: "default" | "aurora" | "geometric" | "nebula" | "night"
}

const impacts = [
  {
    icon: Wheat,
    value: "2.4M",
    unit: "Kg Makanan Diselamatkan",
    description: "Dari food waste menjadi makanan berguna",
    iconColor: "from-green-400 to-emerald-500",
  },
  {
    icon: Users,
    value: "156K",
    unit: "Keluarga Terbantu",
    description: "Mendapat akses pangan yang lebih baik",
    iconColor: "from-blue-400 to-cyan-500",
  },
  {
    icon: Recycle,
    value: "89%",
    unit: "Pengurangan Sampah",
    description: "Melalui program daur ulang komunitas",
    iconColor: "from-purple-400 to-pink-500",
  },
  {
    icon: MapPin,
    value: "340+",
    unit: "Desa Terhubung",
    description: "Jaringan komunitas berkelanjutan",
    iconColor: "from-red-400 to-orange-500",
  },
]

export const ImpactSection = ({ performanceLevel, variant = "default" }: ImpactSectionProps) => {
  const animationDelay = performanceLevel === "high" ? 0.1 : performanceLevel === "medium" ? 0.15 : 0.2

  // Get theme-based colors
  const getThemeColors = () => {
    switch (variant) {
      case "aurora":
        return {
          gradient: "from-green-400 to-blue-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
          cardBorder: "hover:border-green-400/50",
        }
      case "geometric":
        return {
          gradient: "from-red-400 to-orange-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          cardBorder: "hover:border-red-400/50",
        }
      case "nebula":
        return {
          gradient: "from-purple-400 to-pink-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          cardBorder: "hover:border-purple-400/50",
        }
      case "night":
        return {
          gradient: "from-blue-400 to-cyan-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          cardBorder: "hover:border-blue-400/50",
        }
      default:
        // Default sekarang adalah warna biru/teal (waves lama)
        return {
          gradient: "from-blue-400 to-cyan-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          cardBorder: "hover:border-blue-400/50",
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className={`mb-6 ${themeColors.badgeBg} ${themeColors.badgeText} ${themeColors.badgeBorder} px-4 py-2`}>
            📊 Dampak Nyata
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Mengubah Komunitas,
            <br />
            <span className={`bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}>
              Satu Langkah di Waktu
            </span>
          </h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Data real-time menunjukkan bagaimana ECONARA membantu komunitas di 
            seluruh Indonesia membangun ekosistem yang lebih berkelanjutan.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.unit}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * animationDelay }}
            >
              <Card className={`bg-slate-900/50 backdrop-blur-sm border-slate-700/50 ${themeColors.cardBorder} transition-all duration-300 h-full`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${impact.iconColor} flex items-center justify-center`}>
                    <impact.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{impact.value}</div>
                  <div className="text-lg font-semibold text-white mb-3">{impact.unit}</div>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {impact.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
