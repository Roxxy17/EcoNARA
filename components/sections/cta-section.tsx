"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Infinity } from 'lucide-react'
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface CTASectionProps {
  performanceLevel: PerformanceLevel
  variant?: "default" | "aurora" | "geometric" | "nebula" | "night"
}

export const CTASection = ({ performanceLevel, variant = "default" }: CTASectionProps) => {
  // Get theme-based colors
  const getThemeColors = () => {
    switch (variant) {
      case "aurora":
        return {
          primary: "text-green-400",
          secondary: "text-blue-400",
          accent: "text-emerald-300",
          gradient: "from-green-400 via-blue-400 to-emerald-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
          buttonGradient: "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
        }
      case "geometric":
        return {
          primary: "text-red-400",
          secondary: "text-orange-400",
          accent: "text-yellow-300",
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          buttonGradient: "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
        }
      case "nebula":
        return {
          primary: "text-purple-400",
          secondary: "text-pink-400",
          accent: "text-violet-300",
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          buttonGradient: "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
        }
      case "night":
        return {
          primary: "text-blue-400",
          secondary: "text-cyan-400",
          accent: "text-blue-900",
          gradient: "from-blue-400 via-cyan-400 to-blue-900",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
        }
      default:
        // Default sekarang adalah warna biru/teal (waves lama)
        return {
          primary: "text-blue-400",
          secondary: "text-cyan-400",
          accent: "text-teal-300",
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Siap Membangun
            <br />
            <span className={`bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}>
              Komunitas Berkelanjutan?
            </span>
          </h1>
          <p className="text-slate-300 text-lg mb-12 max-w-3xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan komunitas di Indonesia yang sudah merasakan 
            dampak positif ECONARA. Mulai perjalanan menuju masa depan yang lebih 
            berkelanjutan hari ini.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button size="lg" className={`bg-gradient-to-r ${themeColors.buttonGradient} text-white px-8 py-3`}>
              Mulai Gratis Sekarang
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-3">
              Jadwalkan Demo
            </Button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-slate-400 text-sm">Gratis untuk Komunitas</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
              <div className="text-slate-400 text-sm">Dukungan Teknis</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center">
                <Infinity className="w-12 h-12" />
              </div>
              <div className="text-slate-400 text-sm">Potensi Dampak Positif</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
