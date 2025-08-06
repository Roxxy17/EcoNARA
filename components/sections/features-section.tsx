"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface FeaturesSectionProps {
  performanceLevel: PerformanceLevel
  variant?: "default" | "aurora" | "geometric" | "nebula" | "night"
}

const features = [
  {
    icon: "🌾",
    title: "PanganPeta",
    subtitle: "Stok Pangan RT/Desa",
    description: "Dashboard zona pangan (hijau–merah) dengan input stok per keluarga atau koperasi",
    category: "Pangan"
  },
  {
    icon: "🤖",
    title: "Food Rescue AI",
    subtitle: "Resep Anti-Sisa",
    description: "Masukkan bahan pangan sisa → AI (GPT/NLP) kasih resep sederhana, hemat energi, gizi seimbang",
    category: "Pangan"
  },
  {
    icon: "📊",
    title: "Prediksi Krisis Pangan",
    subtitle: "ML Forecasting",
    description: "ML ringan prediksi kelebihan/kekurangan pangan berdasarkan tren panen dan konsumsi lokal",
    category: "Pangan"
  },
  {
    icon: "🤝",
    title: "Smart Donation Matching",
    subtitle: "AI Pencocokan Donasi",
    description: "Barang bekas? AI cocokkan dengan penerima sesuai lokasi dan kebutuhan",
    category: "Sosial"
  },
  {
    icon: "♻️",
    title: "Trash Classifier",
    subtitle: "Computer Vision",
    description: "Upload foto sampah → AI klasifikasikan jenisnya (organik, plastik, elektronik) + cara pengelolaan",
    category: "Daur Ulang"
  },
  {
    icon: "🌱",
    title: "Eco Habit Tracker",
    subtitle: "Pelacak Kebiasaan Hijau",
    description: "Catat: hemat air/listrik, pakai tas kain, dll → AI kasih skor + poin komunitas",
    category: "Ekologi"
  },
  {
    icon: "🔗",
    title: "Poin Gotong Royong",
    subtitle: "Gamifikasi Komunitas",
    description: "Aksi nyata (sumbang, daur ulang, memasak anti-sisa) → dapat poin, badge, leaderboard RT",
    category: "Komunitas"
  },
  {
    icon: "📡",
    title: "Offline Sync System",
    subtitle: "Bekerja Tanpa Internet",
    description: "Fitur lokal yang tetap bekerja tanpa internet dan otomatis sinkron saat terhubung",
    category: "Offline"
  },
  {
    icon: "🧭",
    title: "Peta Bantuan & Relawan",
    subtitle: "Navigasi Komunitas",
    description: "Lokasi drop-off logistik, jadwal ronda pangan, rute pengantar barang",
    category: "Lokasi"
  },
  {
    icon: "📚",
    title: "Mini Edukasi Interaktif",
    subtitle: "Pembelajaran Berkelanjutan",
    description: "Audio/infografis: cara menyimpan makanan, DIY kompos, ekonomi sirkular, dsb",
    category: "Edukasi"
  }
]

export const FeaturesSection = ({ performanceLevel, variant = "default" }: FeaturesSectionProps) => {
  const animationDelay = performanceLevel === "high" ? 0.1 : performanceLevel === "medium" ? 0.15 : 0.2

  // Get theme-based colors
  const getThemeColors = () => {
    switch (variant) {
      case "aurora":
        return {
          primary: "text-green-400",
          gradient: "from-green-400 via-blue-400 to-emerald-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
          categoryBg: "bg-green-100",
          categoryText: "text-green-700",
          cardBorder: "hover:border-green-400/50",
          subtitleColor: "text-green-600",
        }
      case "geometric":
        return {
          primary: "text-red-400",
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          categoryBg: "bg-red-100",
          categoryText: "text-red-700",
          cardBorder: "hover:border-red-400/50",
          subtitleColor: "text-red-600",
        }
      case "nebula":
        return {
          primary: "text-purple-400",
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          categoryBg: "bg-purple-100",
          categoryText: "text-purple-700",
          cardBorder: "hover:border-purple-400/50",
          subtitleColor: "text-purple-600",
        }
      case "night":
        return {
          primary: "text-blue-400",
          gradient: "from-blue-400 via-cyan-400 to-blue-900",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          categoryBg: "bg-blue-100",
          categoryText: "text-blue-700",
          cardBorder: "hover:border-blue-400/50",
          subtitleColor: "text-blue-600",
        }
      default:
        // Default sekarang adalah warna biru/teal (waves lama)
        return {
          primary: "text-blue-400",
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          categoryBg: "bg-blue-100",
          categoryText: "text-blue-700",
          cardBorder: "hover:border-blue-400/50",
          subtitleColor: "text-blue-600",
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className={`mb-6 ${themeColors.badgeBg} ${themeColors.badgeText} ${themeColors.badgeBorder} px-4 py-2`}>
            🚀 Fitur Unggulan
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Teknologi Canggih untuk
            <br />
            <span className={`bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}>
              Komunitas Berkelanjutan
            </span>
          </h2>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Solusi terintegrasi yang menggabungkan kecerdasan buatan, analitik data, dan 
            platform komunitas untuk menciptakan dampak positif yang terukur.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * animationDelay }}
            >
              <Card className={`bg-slate-900/50 backdrop-blur-sm border-slate-700/50 ${themeColors.cardBorder} transition-all duration-300 h-full shadow-sm hover:shadow-md`}>
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <div className="mb-2">
                    <span className={`text-xs ${themeColors.categoryBg} ${themeColors.categoryText} px-2 py-1 rounded-full font-medium`}>
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-1">{feature.title}</h3>
                  <p className={`${themeColors.subtitleColor} text-sm font-medium mb-3`}>{feature.subtitle}</p>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {feature.description}
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
