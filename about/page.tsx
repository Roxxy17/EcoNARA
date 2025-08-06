"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Eye, Leaf, ArrowRight } from "lucide-react"
import Link from "next/link"

const values = [
  {
    icon: "🌱",
    title: "Keberlanjutan",
    description: "Membangun solusi yang ramah lingkungan dan berkelanjutan untuk generasi mendatang.",
    color: "from-purple-400 to-indigo-600",
  },
  {
    icon: "🤝",
    title: "Kolaborasi",
    description: "Mengutamakan kerjasama dan gotong royong dalam setiap aspek pengembangan komunitas.",
    color: "from-blue-400 to-cyan-600",
  },
  {
    icon: "💡",
    title: "Inovasi",
    description: "Menggunakan teknologi terdepan untuk menciptakan solusi yang efektif dan mudah digunakan.",
    color: "from-pink-400 to-rose-600",
  },
  {
    icon: "🎯",
    title: "Dampak Nyata",
    description: "Fokus pada hasil yang terukur dan memberikan manfaat langsung bagi komunitas.",
    color: "from-indigo-400 to-purple-600",
  },
]

const team = [
  {
    name: "Dr. Sari Wijaya",
    role: "CEO & Co-Founder",
    bio: "Ahli keberlanjutan dengan 15+ tahun pengalaman dalam pengembangan komunitas berkelanjutan.",
    avatar: "👩‍💼",
    expertise: ["Sustainability", "Community Development", "Policy Making"],
  },
  {
    name: "Budi Santoso",
    role: "CTO & Co-Founder",
    bio: "Engineer berpengalaman dalam AI dan machine learning untuk aplikasi sosial dan lingkungan.",
    avatar: "👨‍💻",
    expertise: ["AI/ML", "Software Architecture", "Data Science"],
  },
  {
    name: "Maya Putri",
    role: "Head of Community",
    bio: "Spesialis engagement komunitas dengan track record membangun jaringan komunitas di 100+ desa.",
    avatar: "👩‍🌾",
    expertise: ["Community Building", "Rural Development", "Social Impact"],
  },
  {
    name: "Andi Rahman",
    role: "Head of Product",
    bio: "Product manager dengan fokus pada user experience dan accessibility untuk komunitas Indonesia.",
    avatar: "👨‍🎨",
    expertise: ["Product Strategy", "UX Design", "Accessibility"],
  },
]

const milestones = [
  {
    year: "2022",
    title: "Ide Awal",
    description: "ECONARA dimulai dari riset tentang food waste di komunitas urban Jakarta.",
    icon: "💡",
  },
  {
    year: "2023",
    title: "Pilot Program",
    description: "Meluncurkan program pilot di 5 RT di Jakarta dengan 200+ keluarga peserta.",
    icon: "🚀",
  },
  {
    year: "2024",
    title: "Ekspansi Nasional",
    description: "Berkembang ke 340+ desa di seluruh Indonesia dengan 156K+ keluarga terbantu.",
    icon: "🌍",
  },
  {
    year: "2025",
    title: "Visi Masa Depan",
    description: "Target mencapai 1M+ keluarga dan menjadi platform keberlanjutan terbesar di Asia Tenggara.",
    icon: "🎯",
  },
]

export default function AboutPage() {
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
                <Leaf className="w-6 h-6 text-white" />
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
              🏢 Tentang Kami
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Membangun
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Masa Depan
              </span>
              <span className="block">Berkelanjutan</span>
            </h1>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              ECONARA lahir dari visi sederhana: bagaimana jika teknologi dapat membantu setiap komunitas di Indonesia
              membangun ekosistem yang berkelanjutan, mengurangi waste, dan meningkatkan kesejahteraan bersama?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 backdrop-blur-xl border border-white/20 text-white overflow-hidden h-full">
                <CardContent className="p-12">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black">Misi Kami</h2>
                  </div>
                  <p className="text-xl leading-relaxed text-white/90">
                    Memberdayakan komunitas Indonesia dengan teknologi AI untuk menciptakan ekosistem berkelanjutan yang
                    mengurangi food waste, mengoptimalkan distribusi sumber daya, dan membangun ekonomi sirkular yang
                    inklusif dan berdampak positif.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-xl border border-white/20 text-white overflow-hidden h-full">
                <CardContent className="p-12">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Eye className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black">Visi Kami</h2>
                  </div>
                  <p className="text-xl leading-relaxed text-white/90">
                    Menjadi platform keberlanjutan komunitas terdepan di Asia Tenggara yang menghubungkan jutaan
                    keluarga dalam jaringan ekonomi sirkular, menciptakan Indonesia yang zero waste dan food secure pada
                    tahun 2030.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              💎 Nilai-Nilai Kami
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Prinsip yang
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Memandu Kami
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/20 h-full">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                    >
                      <span className="text-2xl">{value.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              📅 Perjalanan Kami
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Milestone
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Penting
              </span>
            </h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>

            <div className="space-y-16">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                      <CardContent className="p-8">
                        <div className="text-3xl mb-4">{milestone.icon}</div>
                        <div className="text-2xl font-bold text-purple-300 mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-white mb-4">{milestone.title}</h3>
                        <p className="text-white/70 leading-relaxed">{milestone.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="relative z-10">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full border-4 border-white/20 shadow-2xl"></div>
                  </div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              👥 Tim Kami
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Orang-Orang
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Di Balik ECONARA
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 bg-white/10 backdrop-blur-xl border border-white/20 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl">
                      {member.avatar}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                    <div className="text-purple-300 font-semibold mb-4">{member.role}</div>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">{member.bio}</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {member.expertise.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-white/30 text-white/70">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
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
              Bergabunglah dengan
              <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                Misi Kami
              </span>
            </h2>
            <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto leading-relaxed">
              Bersama-sama kita dapat membangun Indonesia yang lebih berkelanjutan. Mulai perjalanan Anda dengan ECONARA
              hari ini.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-10 py-4 text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl border-0"
              >
                Bergabung Sekarang
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm px-10 py-4 text-lg font-bold rounded-2xl hover:border-white/50"
              >
                Hubungi Kami
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
