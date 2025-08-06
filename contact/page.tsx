"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageCircle, Headphones, Leaf, CheckCircle } from "lucide-react"
import Link from "next/link"

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Kirim email dan kami akan merespons dalam 24 jam",
    contact: "hello@econara.id",
    action: "Kirim Email",
    color: "from-blue-400 to-cyan-600",
  },
  {
    icon: Phone,
    title: "Telepon",
    description: "Hubungi tim support kami langsung",
    contact: "+62 21 1234 5678",
    action: "Telepon Sekarang",
    color: "from-purple-400 to-indigo-600",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Chat langsung via WhatsApp untuk respon cepat",
    contact: "+62 812 3456 7890",
    action: "Chat WhatsApp",
    color: "from-pink-400 to-rose-600",
  },
  {
    icon: Headphones,
    title: "Live Chat",
    description: "Support online 24/7 untuk bantuan instan",
    contact: "Available 24/7",
    action: "Mulai Chat",
    color: "from-indigo-400 to-purple-600",
  },
]

const offices = [
  {
    city: "Jakarta",
    address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    phone: "+62 21 1234 5678",
    email: "jakarta@econara.id",
    hours: "Senin - Jumat: 09:00 - 18:00",
    type: "Kantor Pusat",
  },
  {
    city: "Bandung",
    address: "Jl. Braga No. 45, Bandung 40111",
    phone: "+62 22 8765 4321",
    email: "bandung@econara.id",
    hours: "Senin - Jumat: 09:00 - 17:00",
    type: "Kantor Regional",
  },
  {
    city: "Surabaya",
    address: "Jl. Pemuda No. 67, Surabaya 60271",
    phone: "+62 31 9876 5432",
    email: "surabaya@econara.id",
    hours: "Senin - Jumat: 09:00 - 17:00",
    type: "Kantor Regional",
  },
]

const faqs = [
  {
    question: "Bagaimana cara mendaftar di ECONARA?",
    answer:
      "Anda dapat mendaftar melalui website atau aplikasi mobile kami. Proses pendaftaran sangat mudah dan gratis untuk semua komunitas.",
  },
  {
    question: "Apakah ECONARA benar-benar gratis?",
    answer:
      "Ya, ECONARA 100% gratis untuk komunitas. Kami percaya bahwa akses ke teknologi berkelanjutan harus tersedia untuk semua.",
  },
  {
    question: "Bagaimana cara kerja AI Food Rescue?",
    answer:
      "AI kami menganalisis bahan makanan yang Anda input dan memberikan rekomendasi resep yang optimal, hemat energi, dan bergizi seimbang.",
  },
  {
    question: "Apakah data komunitas kami aman?",
    answer:
      "Keamanan data adalah prioritas utama kami. Semua data dienkripsi dan disimpan sesuai standar keamanan internasional.",
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
              📞 Hubungi Kami
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Mari
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Terhubung
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Kami siap membantu Anda memulai perjalanan menuju komunitas yang lebih berkelanjutan. Tim ahli kami
              tersedia untuk menjawab pertanyaan dan memberikan dukungan yang Anda butuhkan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              💬 Cara Menghubungi
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Pilih Cara
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Terbaik untuk Anda
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
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
                      className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                    >
                      <method.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{method.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed mb-4">{method.description}</p>
                    <div className="text-purple-300 font-semibold mb-6">{method.contact}</div>
                    <Button
                      className={`w-full bg-gradient-to-r ${method.color} hover:shadow-lg transition-all duration-300 text-white rounded-xl border-0`}
                    >
                      {method.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Offices */}
      <section className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-white flex items-center space-x-3">
                    <Send className="w-6 h-6 text-purple-300" />
                    <span>Kirim Pesan</span>
                  </CardTitle>
                  <p className="text-white/70">
                    Isi form di bawah ini dan tim kami akan menghubungi Anda dalam 24 jam.
                  </p>
                </CardHeader>
                <CardContent>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">Nama Lengkap</label>
                          <Input
                            placeholder="Masukkan nama lengkap"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">Email</label>
                          <Input
                            type="email"
                            placeholder="nama@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">Nomor Telepon</label>
                          <Input
                            placeholder="+62 812 3456 7890"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-white/80 mb-2 block">Kategori</label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange("category", value)}
                          >
                            <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm">
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/20 text-white">
                              <SelectItem value="general">Pertanyaan Umum</SelectItem>
                              <SelectItem value="technical">Dukungan Teknis</SelectItem>
                              <SelectItem value="partnership">Kemitraan</SelectItem>
                              <SelectItem value="media">Media & Press</SelectItem>
                              <SelectItem value="feedback">Feedback</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-white/80 mb-2 block">Subjek</label>
                        <Input
                          placeholder="Subjek pesan Anda"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-white/80 mb-2 block">Pesan</label>
                        <Textarea
                          placeholder="Tulis pesan Anda di sini..."
                          className="h-32 bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white py-3 rounded-xl font-semibold border-0 shadow-2xl"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Kirim Pesan
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-4">Pesan Terkirim!</h3>
                      <p className="text-white/70 mb-6">
                        Terima kasih telah menghubungi kami. Tim ECONARA akan merespons dalam 24 jam.
                      </p>
                      <Button
                        onClick={() => setIsSubmitted(false)}
                        variant="outline"
                        className="border-purple-400/50 text-purple-300 hover:bg-purple-500/20 bg-white/5 backdrop-blur-sm"
                      >
                        Kirim Pesan Lain
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Offices */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-black text-white mb-6">Kantor Kami</h2>
                <p className="text-white/70 leading-relaxed">
                  Kunjungi kantor kami di berbagai kota untuk bertemu langsung dengan tim ECONARA.
                </p>
              </div>

              <div className="space-y-6">
                {offices.map((office, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white">{office.city}</h3>
                            <Badge className="bg-purple-500/20 text-purple-300 mt-1 border-purple-400/30">
                              {office.type}
                            </Badge>
                          </div>
                          <MapPin className="w-5 h-5 text-purple-300" />
                        </div>

                        <div className="space-y-3 text-sm text-white/70">
                          <div className="flex items-start space-x-3">
                            <MapPin className="w-4 h-4 text-white/50 mt-0.5" />
                            <span>{office.address}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Phone className="w-4 h-4 text-white/50" />
                            <span>{office.phone}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Mail className="w-4 h-4 text-white/50" />
                            <span>{office.email}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-white/50" />
                            <span>{office.hours}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/10 text-white px-4 py-2 rounded-full mb-6 border border-white/20 backdrop-blur-sm">
              ❓ FAQ
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Pertanyaan
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                yang Sering Diajukan
              </span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <CardContent className="p-8">
                    <h3 className="text-lg font-bold text-white mb-4">{faq.question}</h3>
                    <p className="text-white/70 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-white/70 mb-6">Tidak menemukan jawaban yang Anda cari?</p>
            <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold border-0 shadow-2xl">
              Hubungi Tim Support
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
