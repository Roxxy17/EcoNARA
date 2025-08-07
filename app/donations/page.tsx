"use client"

import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Plus,
  Search,
  MapPin,
  Clock,
  Users,
  // ArrowLeft dihilangkan
  Package,
  AlertCircle,
  CheckCircle,
  Truck,
  HandHeart,
  Target,
  Zap,
  Calendar,
  Phone,
} from "lucide-react"
import Link from "next/link" // Link dipertahankan jika ada Link lain yang digunakan di masa depan
import { Navbar } from "@/components/navigation/nav-dashboard" // Import Navbar

const donationRequests = [
  {
    id: 1,
    title: "Bantuan Makanan untuk Keluarga Kurang Mampu",
    description: "Membutuhkan beras, minyak goreng, dan kebutuhan pokok lainnya untuk 5 keluarga di RT 04",
    requester: "Ketua RT 04",
    location: "RT 04, Kelurahan Maju",
    urgency: "high",
    category: "food",
    needed: ["Beras 25kg", "Minyak goreng 5L", "Gula 2kg", "Telur 2kg"],
    timePosted: "2 jam lalu",
    deadline: "3 hari lagi",
    fulfilled: 60,
    target: 100,
    donors: 8,
    verified: true,
  },
  {
    id: 2,
    title: "Pakaian Hangat untuk Musim Hujan",
    description: "Mencari jaket, sweater, dan pakaian hangat untuk anak-anak usia 5-12 tahun",
    requester: "Bu Sari",
    location: "RT 02, Kelurahan Maju",
    urgency: "medium",
    category: "clothes",
    needed: ["Jaket anak", "Sweater", "Celana panjang", "Sepatu"],
    timePosted: "5 jam lalu",
    deadline: "1 minggu lagi",
    fulfilled: 30,
    target: 100,
    donors: 3,
    verified: true,
  },
  {
    id: 3,
    title: "Alat Tulis untuk Sekolah",
    description: "Bantuan alat tulis dan buku untuk 20 siswa SD yang membutuhkan",
    requester: "Pak Budi - Guru SD",
    location: "RT 01, Kelurahan Maju",
    urgency: "low",
    category: "education",
    needed: ["Buku tulis", "Pensil", "Penghapus", "Penggaris"],
    timePosted: "1 hari lalu",
    deadline: "2 minggu lagi",
    fulfilled: 80,
    target: 100,
    donors: 12,
    verified: true,
  },
  {
    id: 4,
    title: "Obat-obatan untuk Lansia",
    description: "Membutuhkan obat hipertensi dan diabetes untuk 3 lansia yang tidak mampu",
    requester: "Posyandu RT 03",
    location: "RT 03, Kelurahan Maju",
    urgency: "high",
    category: "health",
    needed: ["Obat hipertensi", "Obat diabetes", "Vitamin", "Alat cek gula darah"],
    timePosted: "30 menit lalu",
    deadline: "1 hari lagi",
    fulfilled: 20,
    target: 100,
    donors: 2,
    verified: true,
  },
]

const myDonations = [
  {
    id: 1,
    title: "Donasi Beras 10kg",
    recipient: "Keluarga Pak Andi",
    amount: "10kg beras",
    status: "delivered",
    date: "2 hari lalu",
    points: 50,
  },
  {
    id: 2,
    title: "Pakaian Anak",
    recipient: "Bu Sari",
    amount: "5 set pakaian",
    status: "in-transit",
    date: "1 hari lalu",
    points: 30,
  },
  {
    id: 3,
    title: "Buku Pelajaran",
    recipient: "SD Maju Bersama",
    amount: "20 buku",
    status: "confirmed",
    date: "3 jam lalu",
    points: 25,
  },
]

const urgencyColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200",
}

const categoryIcons = {
  food: "🍚",
  clothes: "👕",
  education: "📚",
  health: "🏥",
  electronics: "📱",
  others: "📦",
}

const statusIcons = {
  delivered: CheckCircle,
  "in-transit": Truck,
  confirmed: Package,
}

const statusColors = {
  delivered: "text-green-600",
  "in-transit": "text-blue-600",
  confirmed: "text-orange-600",
}

export default function DonationsPage() {
  const [activeTab, setActiveTab] = useState("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedUrgency, setSelectedUrgency] = useState("all")

  const filteredRequests = donationRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || request.category === selectedCategory
    const matchesUrgency = selectedUrgency === "all" || request.urgency === selectedUrgency
    return matchesSearch && matchesCategory && matchesUrgency
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navbar /> {/* Navbar ditambahkan di sini */}
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b shadow-sm"> {/* sticky dan top-[56px] dihilangkan */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Tombol "Kembali" telah dihapus */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Smart Donation</h1>
                  <p className="text-sm text-gray-600">Berbagi kebaikan dengan tetangga</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Riwayat
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Buat Permintaan
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <HandHeart className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm opacity-90">Total Donasi</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm opacity-90">Keluarga Terbantu</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <Zap className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm opacity-90">Permintaan Aktif</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="text-center bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm opacity-90">Tingkat Keberhasilan</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Cari Bantuan</TabsTrigger>
            <TabsTrigger value="my-donations">Donasi Saya</TabsTrigger>
            <TabsTrigger value="create">Buat Permintaan</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cari permintaan bantuan..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="food">Makanan</SelectItem>
                      <SelectItem value="clothes">Pakaian</SelectItem>
                      <SelectItem value="education">Pendidikan</SelectItem>
                      <SelectItem value="health">Kesehatan</SelectItem>
                      <SelectItem value="electronics">Elektronik</SelectItem>
                      <SelectItem value="others">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tingkat Urgensi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Urgensi</SelectItem>
                      <SelectItem value="high">Sangat Urgent</SelectItem>
                      <SelectItem value="medium">Sedang</SelectItem>
                      <SelectItem value="low">Tidak Urgent</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Terdekat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Donation Requests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRequests.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{categoryIcons[request.category]}</span>
                          <Badge className={urgencyColors[request.urgency]}>
                            {request.urgency === "high"
                              ? "Sangat Urgent"
                              : request.urgency === "medium"
                                ? "Sedang"
                                : "Tidak Urgent"}
                          </Badge>
                        </div>
                        {request.verified && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terverifikasi
                          </Badge>
                        )}
                      </div>

                      <CardTitle className="text-lg leading-tight">{request.title}</CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">{request.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">Yang Dibutuhkan:</div>
                        <div className="flex flex-wrap gap-2">
                          {request.needed.map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">{request.fulfilled}% terpenuhi</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${request.fulfilled}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{request.requester}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{request.timePosted}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{request.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{request.donors}</span> donatur
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          >
                            <Heart className="w-4 h-4 mr-2" />
                            Bantu
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-donations" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Riwayat Donasi Saya</CardTitle>
                <CardDescription>Lacak semua kontribusi Anda untuk komunitas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myDonations.map((donation, index) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${statusColors[donation.status]}`}
                        >
                          {React.createElement(statusIcons[donation.status], { className: "w-5 h-5" })}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">{donation.title}</h4>
                          <p className="text-sm text-gray-600">Untuk: {donation.recipient}</p>
                          <p className="text-sm text-gray-500">
                            {donation.amount} • {donation.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            donation.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : donation.status === "in-transit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-orange-100 text-orange-800"
                          }
                        >
                          {donation.status === "delivered"
                            ? "Terkirim"
                            : donation.status === "in-transit"
                              ? "Dalam Perjalanan"
                              : "Dikonfirmasi"}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">+{donation.points} poin</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Buat Permintaan Bantuan</CardTitle>
                <CardDescription>Sampaikan kebutuhan Anda kepada komunitas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Judul Permintaan</label>
                      <Input placeholder="Contoh: Bantuan Makanan untuk Keluarga Kurang Mampu" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Kategori</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="food">Makanan</SelectItem>
                          <SelectItem value="clothes">Pakaian</SelectItem>
                          <SelectItem value="education">Pendidikan</SelectItem>
                          <SelectItem value="health">Kesehatan</SelectItem>
                          <SelectItem value="electronics">Elektronik</SelectItem>
                          <SelectItem value="others">Lainnya</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Tingkat Urgensi</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tingkat urgensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Sangat Urgent</SelectItem>
                          <SelectItem value="medium">Sedang</SelectItem>
                          <SelectItem value="low">Tidak Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Batas Waktu</label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Deskripsi Detail</label>
                      <Textarea placeholder="Jelaskan situasi dan kebutuhan Anda secara detail..." className="h-32" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Barang yang Dibutuhkan</label>
                      <Textarea placeholder="Contoh: Beras 10kg, Minyak goreng 2L, Gula 1kg..." className="h-20" />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Kontak</label>
                      <Input placeholder="Nomor WhatsApp atau cara menghubungi" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <div className="text-sm text-blue-800">
                    <strong>Catatan:</strong> Permintaan akan diverifikasi oleh admin RT sebelum dipublikasikan untuk
                    memastikan keaslian dan kebutuhan yang mendesak.
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Kirim Permintaan
                  </Button>
                  <Button variant="outline">Simpan Draft</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
