"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Sparkles,
  Camera,
  MapPin,
  Users,
  ShoppingCart,
  BookOpen,
  Heart,
  Leaf,
  Target,
  Zap,
  Globe,
  Shield,
  Wifi,
  BarChart3,
  Bell,
  Smartphone,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const featureCategories = [
  {
    title: "AI & Machine Learning",
    description: "Teknologi kecerdasan buatan untuk optimasi sumber daya",
    icon: "🤖",
    color: "from-blue-400 to-cyan-600",
    features: [
      {
        icon: Sparkles,
        title: "Food Rescue AI",
        description: "AI memberikan resep hemat energi dan bergizi dari bahan makanan sisa",
        benefits: ["Kurangi food waste hingga 80%", "Resep optimal berbasis nutrisi", "Hemat biaya belanja"],
        demo: "Coba sekarang",
      },
      {
        icon: Camera,
        title: "Trash Classifier",
        description: "Computer Vision mengklasifikasi sampah dan memberikan panduan penanganan",
        benefits: ["Akurasi 95% klasifikasi", "Panduan daur ulang", "Edukasi pengelolaan sampah"],
        demo: "Upload foto",
      },
      {
        icon: BarChart3,
        title: "Prediksi Krisis Pangan",
        description: "ML prediksi surplus/kelangkaan berdasar tren panen, musim, konsumsi lokal",
        benefits: ["Prediksi akurat 90%", "Early warning system", "Optimasi distribusi"],
        demo: "Lihat prediksi",
      },
    ],
  },
  {
    title: "Komunitas & Sosial",
    description: "Fitur untuk membangun dan memperkuat jaringan komunitas",
    icon: "🤝",
    color: "from-purple-400 to-indigo-600",
    features: [
      {
        icon: Heart,
        title: "Smart Donation Matching",
        description: "AI cocokkan barang sisa/bekas dengan penerima komunitas terdekat",
        benefits: ["Matching otomatis", "Distribusi efisien", "Transparansi penuh"],
        demo: "Mulai donasi",
      },
      {
        icon: Users,
        title: "Poin Gotong Royong",
        description: "Sistem gamifikasi untuk aksi nyata dengan poin, badge, dan leaderboard",
        benefits: ["Motivasi berkelanjutan", "Kompetisi sehat", "Reward nyata"],
        demo: "Lihat leaderboard",
      },
      {
        icon: MapPin,
        title: "Peta Bantuan & Relawan",
        description: "Lokasi logistik, jadwal ronda pangan, rute distribusi real-time",
        benefits: ["Koordinasi efektif", "Real-time tracking", "Optimasi rute"],
        demo: "Buka peta",
      },
    ],
  },
  {
    title: "Ekonomi & Marketplace",
    description: "Platform ekonomi sirkular untuk komunitas berkelanjutan",
    icon: "💰",
    color: "from-pink-400 to-rose-600",
    features: [
      {
        icon: ShoppingCart,
        title: "Pasar Komunitas",
        description: "Marketplace tukar/sumbang hasil panen dan barang bekas layak pakai",
        benefits: ["Ekonomi lokal", "Zero waste", "Harga terjangkau"],
        demo: "Jelajahi pasar",
      },
      {
        icon: Target,
        title: "Peta Stok Pangan",
        description: "Dashboard zona pangan dengan monitoring stok live dari RT/keluarga/koperasi",
        benefits: ["Monitoring real-time", "Distribusi optimal", "Transparansi stok"],
        demo: "Lihat dashboard",
      },
      {
        icon: BarChart3,
        title: "Analytics & Insights",
        description: "Data analytics untuk optimasi sumber daya dan dampak komunitas",
        benefits: ["Insight mendalam", "Laporan otomatis", "Trend analysis"],
        demo: "Lihat analytics",
      },
    ],
  },
  {
    title: "Edukasi & Awareness",
    description: "Platform pembelajaran untuk gaya hidup berkelanjutan",
    icon: "📚",
    color: "from-indigo-400 to-purple-600",
    features: [
      {
        icon: BookOpen,
        title: "Edukasi Interaktif",
        description: "Audio/infografis: simpan makanan, DIY kompos, ekonomi sirkular",
        benefits: ["Konten berkualitas", "Interactive learning", "Sertifikasi"],
        demo: "Mulai belajar",
      },
      {
        icon: Leaf,
        title: "Eco Habit Tracker",
        description: "Lacak aktivitas ramah lingkungan, dapatkan skor dan tips berkelanjutan",
        benefits: ["Habit building", "Progress tracking", "Personal insights"],
        demo: "Track habits",
      },
      {
        icon: Bell,
        title: "Awareness Campaigns",
        description: "Kampanye kesadaran lingkungan dan sustainability untuk komunitas",
        benefits: ["Engagement tinggi", "Viral campaigns", "Behavioral change"],
        demo: "Join campaign",
      },
    ],
  },
]

const technicalFeatures = [
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Optimized untuk smartphone dengan UX yang intuitif",
  },
  {
    icon: Wifi,
    title: "Offline Capability",
    description: "Fitur utama tetap berfungsi tanpa koneksi internet",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Enkripsi end-to-end dan compliance dengan standar keamanan",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Dukungan bahasa Indonesia dan bahasa daerah",
  },
  {
    icon: Zap,
    title: "Real-time Sync",
    description: "Sinkronisasi data real-time antar perangkat",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Dashboard analytics dengan insights mendalam",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Iridescent Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-blue-400/10 animate-gradient-x"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black text-white">ECONARA</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              ⚡ Fitur Lengkap
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Teknologi
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Terdepan
              </span>
              <span className="block">untuk Komunitas</span>
            </h1>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Jelajahi semua fitur canggih ECONARA yang dirancang khusus untuk membantu komunitas Indonesia membangun
              ekosistem berkelanjutan dengan teknologi AI dan machine learning.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Categories */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          {featureCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
              className="mb-20"
            >
              {/* Category Header */}
              <div className="text-center mb-16">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center shadow-2xl`}
                  >
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div className="text-left">
                    <h2 className="text-3xl font-black text-white">{category.title}</h2>
                    <p className="text-white/70">{category.description}</p>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: featureIndex * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/20 h-full">
                      <CardContent className="p-8">
                        <div className="flex items-center space-x-4 mb-6">
                          <div
                            className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center shadow-2xl`}
                          >
                            <feature.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                        </div>

                        <p className="text-white/70 leading-relaxed mb-6">{feature.description}</p>

                        <div className="space-y-3 mb-6">
                          <h4 className="font-semibold text-white text-sm">Manfaat Utama:</h4>
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center space-x-2 text-sm text-white/70">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${category.color} hover:shadow-lg transition-all duration-300 text-white rounded-xl border-0`}
                        >
                          {feature.demo}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technical Features */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              🔧 Fitur Teknis
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Infrastruktur
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Berkelas Enterprise
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Dibangun dengan teknologi terdepan untuk memastikan performa, keamanan, dan skalabilitas tingkat
              enterprise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/20 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 backdrop-blur-sm relative z-10">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
              Siap Merasakan
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Semua Fitur Ini?
              </span>
            </h2>
            <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Bergabunglah dengan ribuan komunitas yang sudah merasakan manfaat teknologi ECONARA. Mulai gratis hari ini
              dan rasakan perbedaannya.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl border-0"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-10 py-4 text-lg font-bold rounded-2xl hover:border-white/50"
              >
                Jadwalkan Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
