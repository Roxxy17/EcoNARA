"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Star,
  Heart,
  ArrowLeft,
  Users,
  Package,
  TrendingUp,
  Eye,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"

const categories = [
  { id: "all", name: "Semua", icon: "🏪" },
  { id: "vegetables", name: "Sayuran", icon: "🥬" },
  { id: "fruits", name: "Buah-buahan", icon: "🍎" },
  { id: "grains", name: "Biji-bijian", icon: "🌾" },
  { id: "handicrafts", name: "Kerajinan", icon: "🎨" },
  { id: "clothes", name: "Pakaian", icon: "👕" },
  { id: "electronics", name: "Elektronik", icon: "📱" },
  { id: "books", name: "Buku", icon: "📚" },
  { id: "others", name: "Lainnya", icon: "📦" },
]

const marketplaceItems = [
  {
    id: 1,
    title: "Sayuran Organik Segar",
    description: "Hasil panen langsung dari kebun rumah. Kangkung, bayam, dan sawi hijau.",
    price: "Rp 15,000",
    originalPrice: "Rp 25,000",
    seller: "Bu Sari",
    location: "RT 03, 0.5 km",
    category: "vegetables",
    image: "/placeholder.svg?height=200&width=300&text=Sayuran+Organik",
    rating: 4.8,
    reviews: 12,
    timePosted: "2 jam lalu",
    type: "sell",
    tags: ["Organik", "Segar", "Lokal"],
    isNew: true,
  },
  {
    id: 2,
    title: "Buku Pelajaran SD Kelas 4-6",
    description: "Koleksi buku pelajaran lengkap, kondisi 85%. Cocok untuk adik-adik yang membutuhkan.",
    price: "Gratis",
    seller: "Pak Budi",
    location: "RT 05, 0.2 km",
    category: "books",
    image: "/placeholder.svg?height=200&width=300&text=Buku+Pelajaran",
    rating: 4.9,
    reviews: 8,
    timePosted: "5 jam lalu",
    type: "donate",
    tags: ["Pendidikan", "Anak", "Gratis"],
    isUrgent: true,
  },
  {
    id: 3,
    title: "Kerajinan Tas dari Plastik Daur Ulang",
    description: "Tas cantik hasil daur ulang plastik bekas. Kuat, tahan air, dan ramah lingkungan.",
    price: "Rp 35,000",
    seller: "Ibu Rina",
    location: "RT 02, 0.8 km",
    category: "handicrafts",
    image: "/placeholder.svg?height=200&width=300&text=Tas+Daur+Ulang",
    rating: 4.7,
    reviews: 15,
    timePosted: "1 hari lalu",
    type: "sell",
    tags: ["Daur Ulang", "Handmade", "Eco-friendly"],
    isFeatured: true,
  },
  {
    id: 4,
    title: "Smartphone Bekas Kondisi Baik",
    description: "iPhone 12 bekas pakai 2 tahun, kondisi 90%, lengkap dengan charger dan case.",
    price: "Rp 4,500,000",
    originalPrice: "Rp 6,000,000",
    seller: "Andi",
    location: "RT 01, 1.2 km",
    category: "electronics",
    image: "/placeholder.svg?height=200&width=300&text=iPhone+12",
    rating: 4.6,
    reviews: 3,
    timePosted: "3 hari lalu",
    type: "sell",
    tags: ["Bekas", "Berkualitas", "Murah"],
  },
  {
    id: 5,
    title: "Pakaian Anak Usia 5-8 Tahun",
    description: "Koleksi pakaian anak yang sudah tidak terpakai, kondisi masih bagus dan bersih.",
    price: "Gratis",
    seller: "Bu Maya",
    location: "RT 04, 0.6 km",
    category: "clothes",
    image: "/placeholder.svg?height=200&width=300&text=Pakaian+Anak",
    rating: 4.8,
    reviews: 6,
    timePosted: "1 minggu lalu",
    type: "donate",
    tags: ["Anak", "Bersih", "Gratis"],
  },
  {
    id: 6,
    title: "Buah Mangga Manis",
    description: "Mangga gedong gincu dari pohon sendiri. Manis, segar, dan tanpa pestisida.",
    price: "Rp 20,000/kg",
    seller: "Pak Joko",
    location: "RT 06, 1.0 km",
    category: "fruits",
    image: "/placeholder.svg?height=200&width=300&text=Mangga+Manis",
    rating: 4.9,
    reviews: 20,
    timePosted: "4 jam lalu",
    type: "sell",
    tags: ["Segar", "Manis", "Organik"],
    isPopular: true,
  },
]

const stats = [
  { label: "Total Produk", value: "1,247", icon: Package, color: "text-blue-600" },
  { label: "Transaksi Bulan Ini", value: "89", icon: TrendingUp, color: "text-green-600" },
  { label: "Penjual Aktif", value: "156", icon: Users, color: "text-purple-600" },
  { label: "Rating Rata-rata", value: "4.8", icon: Star, color: "text-yellow-600" },
]

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterType, setFilterType] = useState("all")

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || item.type === filterType
    return matchesCategory && matchesSearch && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Pasar Komunitas</h1>
                  <p className="text-sm text-gray-600">Jual, beli, dan donasi dengan tetangga</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Jual/Donasi
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="text-center border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Pencarian</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Jenis</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua</SelectItem>
                        <SelectItem value="sell">Dijual</SelectItem>
                        <SelectItem value="donate">Donasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Urutkan</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Terbaru</SelectItem>
                        <SelectItem value="oldest">Terlama</SelectItem>
                        <SelectItem value="price-low">Harga Terendah</SelectItem>
                        <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                        <SelectItem value="rating">Rating Tertinggi</SelectItem>
                        <SelectItem value="distance">Terdekat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        selectedCategory === category.id
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === "all"
                    ? "Semua Produk"
                    : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600">{filteredItems.length} produk ditemukan</p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col space-y-2">
                        {item.isNew && <Badge className="bg-green-500 text-white">Baru</Badge>}
                        {item.isUrgent && <Badge className="bg-red-500 text-white">Urgent</Badge>}
                        {item.isFeatured && <Badge className="bg-purple-500 text-white">Featured</Badge>}
                        {item.isPopular && <Badge className="bg-orange-500 text-white">Populer</Badge>}
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-3 right-3">
                        <Badge
                          className={item.type === "donate" ? "bg-blue-500 text-white" : "bg-green-500 text-white"}
                        >
                          {item.type === "donate" ? "Donasi" : "Dijual"}
                        </Badge>
                      </div>

                      {/* Quick Actions */}
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="secondary" className="bg-white/90 backdrop-blur-sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-green-600">{item.price}</span>
                              {item.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{item.rating}</span>
                            <span>({item.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{item.seller}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{item.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.timePosted}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                            {item.type === "donate" ? "Ambil" : "Beli"}
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {filteredItems.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Muat Lebih Banyak
                </Button>
              </div>
            )}

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tidak ada produk ditemukan</h3>
                <p className="text-gray-600 mb-4">
                  Coba ubah filter pencarian atau kategori untuk menemukan produk yang Anda cari
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Jadi yang Pertama Jual/Donasi
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
