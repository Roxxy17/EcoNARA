"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  HelpCircle,
  Search,
  Book,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Video,
  Headphones,
  ExternalLink,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import Link from "next/link"

const faqCategories = [
  {
    id: "getting-started",
    title: "Memulai",
    icon: "🚀",
    faqs: [
      {
        question: "Bagaimana cara mendaftar di ECONARA?",
        answer:
          "Anda dapat mendaftar dengan mengklik tombol 'Daftar' di halaman utama, lalu mengisi formulir dengan informasi dasar seperti nama, email, dan lokasi RT/RW Anda. Proses pendaftaran gratis dan hanya membutuhkan waktu 2 menit.",
        helpful: 45,
        notHelpful: 2,
      },
      {
        question: "Apakah ECONARA benar-benar gratis?",
        answer:
          "Ya, ECONARA 100% gratis untuk semua pengguna. Kami percaya bahwa akses ke teknologi berkelanjutan harus tersedia untuk semua komunitas tanpa biaya apapun.",
        helpful: 52,
        notHelpful: 1,
      },
      {
        question: "Bagaimana cara bergabung dengan komunitas RT saya?",
        answer:
          "Setelah mendaftar, masukkan kode RT Anda atau pilih dari daftar RT yang tersedia. Jika RT Anda belum terdaftar, Anda dapat mengajukan pendaftaran RT baru melalui menu 'Komunitas'.",
        helpful: 38,
        notHelpful: 3,
      },
    ],
  },
  {
    id: "features",
    title: "Fitur Utama",
    icon: "⚡",
    faqs: [
      {
        question: "Bagaimana cara kerja Food Rescue AI?",
        answer:
          "Food Rescue AI menganalisis foto makanan yang Anda upload, mengidentifikasi jenis dan kondisi makanan, lalu memberikan rekomendasi resep yang optimal, tips penyimpanan, atau saran untuk donasi jika makanan berlebih.",
        helpful: 67,
        notHelpful: 4,
      },
      {
        question: "Seberapa akurat Trash Classifier?",
        answer:
          "Trash Classifier kami memiliki tingkat akurasi 96% dalam mengklasifikasi berbagai jenis sampah. AI terus belajar dari data baru untuk meningkatkan akurasi dan menambah jenis sampah yang dapat dikenali.",
        helpful: 41,
        notHelpful: 2,
      },
      {
        question: "Bagaimana sistem poin dan reward bekerja?",
        answer:
          "Anda mendapatkan poin dari berbagai aktivitas: menyelamatkan makanan (25 poin), donasi (50 poin), daur ulang (30 poin), dan partisipasi komunitas (40 poin). Poin dapat ditukar dengan reward atau digunakan untuk naik level.",
        helpful: 55,
        notHelpful: 1,
      },
    ],
  },
  {
    id: "community",
    title: "Komunitas",
    icon: "🤝",
    faqs: [
      {
        question: "Bagaimana cara membuat event komunitas?",
        answer:
          "Masuk ke menu 'Komunitas', klik 'Buat Event', isi detail event seperti judul, deskripsi, tanggal, dan lokasi. Event akan direview oleh admin RT sebelum dipublikasikan.",
        helpful: 29,
        notHelpful: 1,
      },
      {
        question: "Bagaimana cara mendonasikan makanan?",
        answer:
          "Buka menu 'Donasi', klik 'Buat Permintaan Donasi' atau pilih dari permintaan yang ada. Upload foto makanan, isi deskripsi, dan sistem akan mencarikan penerima yang tepat di sekitar Anda.",
        helpful: 43,
        notHelpful: 2,
      },
    ],
  },
  {
    id: "technical",
    title: "Teknis",
    icon: "🔧",
    faqs: [
      {
        question: "Aplikasi tidak bisa dibuka, apa yang harus dilakukan?",
        answer:
          "Coba restart aplikasi, pastikan koneksi internet stabil, dan update ke versi terbaru. Jika masih bermasalah, hapus cache aplikasi atau hubungi support kami.",
        helpful: 34,
        notHelpful: 5,
      },
      {
        question: "Bagaimana cara backup data saya?",
        answer:
          "Data Anda otomatis tersimpan di cloud. Untuk backup manual, masuk ke Pengaturan > Backup Data. Anda juga bisa export data dalam format CSV melalui menu Analytics.",
        helpful: 28,
        notHelpful: 3,
      },
    ],
  },
]

const tutorials = [
  {
    id: 1,
    title: "Panduan Lengkap Food Rescue AI",
    description: "Pelajari cara menggunakan AI untuk menyelamatkan makanan dan mendapatkan resep optimal",
    type: "video",
    duration: "8 menit",
    difficulty: "Pemula",
    views: 1245,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Cara Efektif Menggunakan Trash Classifier",
    description: "Tutorial step-by-step mengklasifikasi sampah dan mendapatkan panduan daur ulang",
    type: "article",
    duration: "5 menit baca",
    difficulty: "Pemula",
    views: 892,
    rating: 4.6,
  },
  {
    id: 3,
    title: "Membangun Komunitas Berkelanjutan",
    description: "Tips dan strategi untuk mengaktifkan partisipasi warga dalam program keberlanjutan",
    type: "podcast",
    duration: "15 menit",
    difficulty: "Menengah",
    views: 567,
    rating: 4.9,
  },
]

const contactOptions = [
  {
    title: "Live Chat",
    description: "Chat langsung dengan tim support",
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    available: "24/7",
    responseTime: "< 5 menit",
  },
  {
    title: "WhatsApp",
    description: "Hubungi via WhatsApp",
    icon: Phone,
    color: "text-green-500",
    bgColor: "bg-green-50",
    available: "08:00 - 22:00",
    responseTime: "< 30 menit",
  },
  {
    title: "Email Support",
    description: "Kirim email untuk pertanyaan detail",
    icon: Mail,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    available: "24/7",
    responseTime: "< 24 jam",
  },
]

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("getting-started")

  const filteredFaqs =
    faqCategories
      .find((cat) => cat.id === selectedCategory)
      ?.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      ) || []

  const toggleFaq = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  const markHelpful = (categoryId: string, faqIndex: number, helpful: boolean) => {
    // In a real app, this would update the backend
    console.log(`Marked FAQ as ${helpful ? "helpful" : "not helpful"}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Pusat Bantuan</h1>
                  <p className="text-sm text-gray-600">FAQ, tutorial, dan dukungan</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari bantuan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorial</TabsTrigger>
            <TabsTrigger value="contact">Kontak Support</TabsTrigger>
            <TabsTrigger value="resources">Sumber Daya</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Category Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Kategori</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {faqCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                            selectedCategory === category.id
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium">{category.title}</span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Content */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span className="text-2xl">
                          {faqCategories.find((cat) => cat.id === selectedCategory)?.icon}
                        </span>
                        <span>{faqCategories.find((cat) => cat.id === selectedCategory)?.title}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <AnimatePresence>
                          {filteredFaqs.map((faq, index) => (
                            <motion.div
                              key={`${selectedCategory}-${index}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ delay: index * 0.1 }}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleFaq(`${selectedCategory}-${index}`)}
                                className="w-full p-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                              >
                                <span className="font-medium text-gray-800">{faq.question}</span>
                                {expandedFaq === `${selectedCategory}-${index}` ? (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-500" />
                                )}
                              </button>

                              <AnimatePresence>
                                {expandedFaq === `${selectedCategory}-${index}` && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="border-t border-gray-200"
                                  >
                                    <div className="p-4 bg-gray-50">
                                      <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                          <span className="text-sm text-gray-600">Apakah ini membantu?</span>
                                          <div className="flex space-x-2">
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => markHelpful(selectedCategory, index, true)}
                                              className="flex items-center space-x-1"
                                            >
                                              <ThumbsUp className="w-4 h-4" />
                                              <span>{faq.helpful}</span>
                                            </Button>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => markHelpful(selectedCategory, index, false)}
                                              className="flex items-center space-x-1"
                                            >
                                              <ThumbsDown className="w-4 h-4" />
                                              <span>{faq.notHelpful}</span>
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          ))}
                        </AnimatePresence>

                        {filteredFaqs.length === 0 && (
                          <div className="text-center py-8">
                            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada FAQ ditemukan</h3>
                            <p className="text-gray-500">Coba ubah kata kunci pencarian atau pilih kategori lain</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial, index) => (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-4">
                          {tutorial.type === "video" && <Video className="w-5 h-5 text-red-500" />}
                          {tutorial.type === "article" && <FileText className="w-5 h-5 text-blue-500" />}
                          {tutorial.type === "podcast" && <Headphones className="w-5 h-5 text-purple-500" />}
                          <Badge
                            className={
                              tutorial.difficulty === "Pemula"
                                ? "bg-green-100 text-green-800"
                                : tutorial.difficulty === "Menengah"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {tutorial.difficulty}
                          </Badge>
                        </div>

                        <h3 className="font-bold text-gray-800 mb-2">{tutorial.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tutorial.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span>{tutorial.duration}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{tutorial.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{tutorial.views} views</span>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {tutorial.type === "video" ? "Tonton" : tutorial.type === "article" ? "Baca" : "Dengar"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {contactOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                      <CardContent className="p-6 text-center">
                        <div
                          className={`w-16 h-16 ${option.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        >
                          <option.icon className={`w-8 h-8 ${option.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{option.title}</h3>
                        <p className="text-gray-600 mb-4">{option.description}</p>

                        <div className="space-y-2 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tersedia:</span>
                            <span className="font-medium">{option.available}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Respon:</span>
                            <span className="font-medium">{option.responseTime}</span>
                          </div>
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${
                            option.color === "text-blue-500"
                              ? "from-blue-500 to-blue-600"
                              : option.color === "text-green-500"
                                ? "from-green-500 to-green-600"
                                : "from-purple-500 to-purple-600"
                          } hover:shadow-lg transition-all duration-300`}
                        >
                          <option.icon className="w-4 h-4 mr-2" />
                          Hubungi Sekarang
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Book className="w-5 h-5 text-blue-500" />
                      <span>Dokumentasi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span>API Documentation</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span>User Manual</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span>Best Practices Guide</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <span>Komunitas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span>Forum Diskusi</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span>Telegram Group</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <span>Facebook Community</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
