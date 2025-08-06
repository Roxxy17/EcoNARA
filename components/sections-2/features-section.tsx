"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Brain,
  Camera,
  ShoppingCart,
  Heart,
  Users,
  BarChart3,
  Smartphone,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

const features = [
  {
    icon: Brain,
    title: "Food Rescue AI",
    description: "AI yang menganalisis makanan berlebih dan mencarikan penerima yang tepat di komunitas Anda.",
    benefits: ["Deteksi otomatis", "Matching algorithm", "Real-time alerts"],
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    icon: Camera,
    title: "Trash Classifier",
    description: "Klasifikasi sampah otomatis menggunakan computer vision untuk optimasi daur ulang.",
    benefits: ["99% akurasi", "Instant recognition", "Eco-friendly tips"],
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    icon: ShoppingCart,
    title: "Eco Marketplace",
    description: "Platform jual-beli produk ramah lingkungan dan hasil daur ulang komunitas.",
    benefits: ["Zero waste products", "Local community", "Fair pricing"],
    color: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    icon: Heart,
    title: "Community Donations",
    description: "Sistem donasi terintegrasi untuk mendistribusikan surplus makanan kepada yang membutuhkan.",
    benefits: ["Transparent tracking", "Impact metrics", "Easy distribution"],
    color: "from-red-400 to-orange-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/20",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Pusat koordinasi aktivitas komunitas berkelanjutan dengan sistem reward terintegrasi.",
    benefits: ["Social networking", "Achievement system", "Event coordination"],
    color: "from-indigo-400 to-purple-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  {
    icon: BarChart3,
    title: "Impact Analytics",
    description: "Dashboard analitik komprehensif untuk memantau dampak lingkungan dan sosial komunitas.",
    benefits: ["Real-time data", "Predictive insights", "Custom reports"],
    color: "from-teal-400 to-green-500",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
  },
]

interface FeaturesSectionProps {
  performanceLevel: PerformanceLevel
}

export const FeaturesSection = ({ performanceLevel }: FeaturesSectionProps) => {
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
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Fitur Unggulan
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Teknologi untuk
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Masa Depan Berkelanjutan
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Platform terintegrasi dengan AI dan machine learning untuk membangun ekosistem komunitas yang berkelanjutan
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={performanceLevel !== "low" ? { y: -5, scale: 1.02 } : {}}
            >
              <Card
                className={`${feature.bgColor} backdrop-blur-xl border ${feature.borderColor} h-full relative overflow-hidden group`}
              >
                {performanceLevel === "high" && (
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10`}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <CardContent className="p-6 relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}
                    whileHover={performanceLevel !== "low" ? { scale: 1.1, rotate: 5 } : {}}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-300 mb-4 leading-relaxed">{feature.description}</p>

                  {/* Benefits */}
                  <div className="space-y-2 mb-6">
                    {feature.benefits.map((benefit, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-sm text-slate-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50 group bg-transparent"
                  >
                    <span>Pelajari Lebih Lanjut</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-2xl mx-auto">
            <Smartphone className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">Siap Memulai Perjalanan Berkelanjutan?</h3>
            <p className="text-slate-300 mb-6">
              Bergabunglah dengan ribuan komunitas yang telah merasakan dampak positif teknologi kami
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8"
            >
              Mulai Gratis Sekarang
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
