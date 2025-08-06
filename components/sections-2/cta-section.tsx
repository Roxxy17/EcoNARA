"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Rocket, ArrowRight, CheckCircle, Globe, Users, Sparkles, Download } from "lucide-react"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

const benefits = [
  "Setup dalam 5 menit",
  "Gratis untuk komunitas",
  "Support 24/7",
  "Training lengkap",
  "Analytics real-time",
  "Integrasi mudah",
]

const platforms = [
  { name: "Android", icon: "📱", users: "10K+" },
  { name: "iOS", icon: "🍎", users: "8K+" },
  { name: "Web App", icon: "🌐", users: "15K+" },
]

interface CTASectionProps {
  performanceLevel: PerformanceLevel
}

export const CTASection = ({ performanceLevel }: CTASectionProps) => {
  return (
    <section className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-green-900/40 backdrop-blur-xl border border-slate-700/50 relative overflow-hidden">
            {performanceLevel === "high" && (
              <>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                />
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `
                      radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)
                    `,
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </>
            )}

            <CardContent className="p-12 text-center relative z-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border-purple-500/30 mb-4">
                  <Rocket className="w-4 h-4 mr-2" />
                  Mulai Sekarang
                </Badge>
                <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
                  Siap Membangun
                  <motion.span
                    className="block bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 bg-clip-text text-transparent"
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
                    Masa Depan Berkelanjutan?
                  </motion.span>
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Bergabunglah dengan ribuan komunitas di seluruh Indonesia yang telah merasakan dampak positif
                  teknologi EcoNara
                </p>
              </motion.div>

              {/* Benefits Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto"
              >
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    className="flex items-center space-x-2 text-left"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              >
                <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Daftar Gratis Sekarang
                    </span>
                    {performanceLevel === "high" && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100"
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
                    <Download className="w-5 h-5 mr-2" />
                    Download App
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Platform Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-6"
              >
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    className="flex items-center space-x-2 bg-slate-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700/30"
                    whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <span className="text-lg">{platform.icon}</span>
                    <span className="text-slate-300 font-medium">{platform.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {platform.users}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Secondary CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 h-full relative overflow-hidden group">
              {performanceLevel === "high" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              )}
              <CardContent className="p-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Untuk Komunitas</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Kelola komunitas Anda dengan tools lengkap untuk sustainability dan social impact
                </p>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                >
                  Pelajari Lebih Lanjut
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 h-full relative overflow-hidden group">
              {performanceLevel === "high" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              )}
              <CardContent className="p-8 relative z-10">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Untuk Enterprise</h3>
                <p className="text-slate-300 mb-6 leading-relaxed">
                  Solusi enterprise dengan analytics mendalam, custom integration, dan dedicated support
                </p>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800/50 bg-transparent"
                >
                  Hubungi Sales
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
