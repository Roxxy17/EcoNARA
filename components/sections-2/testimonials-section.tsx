"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

const testimonials = [
  {
    name: "Sari Wijaya",
    role: "Ketua RT 05",
    location: "Jakarta Selatan",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "EcoNara benar-benar mengubah cara komunitas kami mengelola makanan berlebih. Dalam 3 bulan, kami berhasil mengurangi food waste hingga 75% dan membantu 50+ keluarga kurang mampu.",
    highlight: "75% pengurangan food waste",
    category: "Community Leader",
  },
  {
    name: "Ahmad Fauzi",
    role: "Pengelola Bank Sampah",
    location: "Bandung",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Fitur Trash Classifier sangat membantu edukasi warga tentang pemilahan sampah. Akurasinya mencapai 99% dan membuat proses daur ulang jadi lebih efisien.",
    highlight: "99% akurasi klasifikasi",
    category: "Waste Management",
  },
  {
    name: "Maya Putri",
    role: "Ibu Rumah Tangga",
    location: "Surabaya",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Sebagai ibu, saya senang bisa berkontribusi untuk lingkungan sambil membantu tetangga. Aplikasinya mudah digunakan dan anak-anak juga ikut belajar tentang sustainability.",
    highlight: "Mudah digunakan untuk keluarga",
    category: "Family User",
  },
  {
    name: "Dr. Budi Santoso",
    role: "Peneliti Lingkungan",
    location: "Yogyakarta",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Data analytics yang disediakan EcoNara sangat komprehensif. Kami bisa melacak dampak lingkungan secara real-time dan membuat kebijakan berbasis data yang akurat.",
    highlight: "Analytics komprehensif",
    category: "Researcher",
  },
  {
    name: "Rina Kusuma",
    role: "Pengusaha UMKM",
    location: "Medan",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Eco Marketplace membuka peluang bisnis baru untuk produk daur ulang kami. Penjualan meningkat 200% dan kami bisa menjangkau lebih banyak customer yang peduli lingkungan.",
    highlight: "200% peningkatan penjualan",
    category: "Business Owner",
  },
  {
    name: "Pak Joko",
    role: "Pensiunan",
    location: "Solo",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "Di usia saya yang sudah 65 tahun, saya masih bisa berkontribusi untuk komunitas melalui EcoNara. Interface-nya sederhana dan customer support-nya sangat membantu.",
    highlight: "User-friendly untuk semua usia",
    category: "Senior User",
  },
]

interface TestimonialsSectionProps {
  performanceLevel: PerformanceLevel
}

export const TestimonialsSection = ({ performanceLevel }: TestimonialsSectionProps) => {
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
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-4">
            <Quote className="w-4 h-4 mr-2" />
            Testimoni Pengguna
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Cerita Sukses
            <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Komunitas Kami
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Dengarkan langsung dari pengguna yang telah merasakan dampak positif EcoNara dalam kehidupan sehari-hari
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={performanceLevel !== "low" ? { y: -5, scale: 1.02 } : {}}
            >
              <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 h-full relative overflow-hidden group">
                {performanceLevel === "high" && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                )}

                <CardContent className="p-6 relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                        <AvatarFallback>
                          {testimonial.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <p className="text-sm text-slate-400">{testimonial.role}</p>
                        <p className="text-xs text-slate-500">{testimonial.location}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.category}
                    </Badge>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-slate-300 mb-4 leading-relaxed">"{testimonial.content}"</blockquote>

                  {/* Highlight */}
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3 border border-green-500/20">
                    <p className="text-sm font-medium text-green-300">✨ {testimonial.highlight}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-slate-300">Rating Rata-rata</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">12,000+</div>
                <div className="text-slate-300">Review Positif</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <div className="text-slate-300">Tingkat Rekomendasi</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
