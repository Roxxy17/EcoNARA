"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShoppingCart,
  Plus,
  Search,
  MapPin,
  Clock,
  Star,
  Heart,
  Users,
  Package,
  TrendingUp,
  Eye,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard"

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
    image: "https://grunteman.com/wp-content/uploads/2020/04/jual-sayur-organik-online-2.jpg", // Placeholder URL
    rating: 4.8,
    reviews: 12,
    timePosted: "2 jam lalu",
    type: "sell",
    tags: ["Organik", "Segar", "Lokal"],
    isNew: true,
  },
  {
    id: 2,
    title: "Buku Pelajaran SD Bekas",
    description: "Koleksi buku pelajaran lengkap, kondisi 85%. Cocok untuk yang membutuhkan.",
    price: "Gratis",
    seller: "Pak Budi",
    location: "RT 05, 0.2 km",
    category: "books",
    image: "https://www.shutterstock.com/image-photo/yogyakarta-indonesia-agust-28-2019-600nw-1490490578.jpg", // Placeholder URL
    rating: 4.9,
    reviews: 8,
    timePosted: "5 jam lalu",
    type: "donate",
    tags: ["Pendidikan", "Anak", "Gratis"],
    isUrgent: true,
  },
  {
    id: 3,
    title: "Tas Cantik Daur Ulang",
    description: "Tas cantik hasil daur ulang plastik bekas. Kuat, tahan air, dan ramah lingkungan.",
    price: "Rp 35,000",
    seller: "Ibu Rina",
    location: "RT 02, 0.8 km",
    category: "handicrafts",
    image: "https://yosakurga.com/assets/images/produk/tas_daur_ulang_17323_20210701171141.jpg", // Placeholder URL
    rating: 4.7,
    reviews: 15,
    timePosted: "1 hari lalu",
    type: "sell",
    tags: ["Daur Ulang", "Handmade", "Eco-friendly"],
    isFeatured: true,
  },
  {
    id: 4,
    title: "Buah Mangga Manis",
    description: "Mangga gedong gincu dari pohon sendiri. Manis, segar, dan tanpa pestisida.",
    price: "Rp 20,000/kg",
    seller: "Pak Joko",
    location: "RT 06, 1.0 km",
    category: "fruits",
    image: "https://sasi.sch.id/wp-content/uploads/2024/07/Pohon-Mangga-1170x568.jpg", // Placeholder URL
    rating: 4.9,
    reviews: 20,
    timePosted: "4 jam lalu",
    type: "sell",
    tags: ["Segar", "Manis", "Organik"],
    isPopular: true,
  },
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
        {/* Ocean Background Effects */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>
        
        <Navbar />

        <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">Pasar Komunitas</h1>
                            <p className="text-sm text-cyan-700/80">Jual, beli, dan donasi dengan tetangga Anda</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" className="rounded-lg border-cyan-300 text-cyan-700 hover:bg-cyan-50/80 hover:text-cyan-800">
                            <Heart className="w-4 h-4 mr-2" />
                            Wishlist
                        </Button>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30 rounded-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Jual / Donasi
                        </Button>
                    </div>
                </div>
            </div>
        </header>

        <main className="container mx-auto px-4 py-8 relative z-10">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6"><Package className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" /><div className="text-3xl font-bold drop-shadow-sm">1,247</div><div className="text-sm opacity-90 font-medium">Total Produk</div></CardContent>
                    </Card>
                </motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6"><TrendingUp className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" /><div className="text-3xl font-bold drop-shadow-sm">89</div><div className="text-sm opacity-90 font-medium">Transaksi Bulan Ini</div></CardContent>
                    </Card>
                </motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6"><Users className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" /><div className="text-3xl font-bold drop-shadow-sm">156</div><div className="text-sm opacity-90 font-medium">Penjual Aktif</div></CardContent>
                    </Card>
                </motion.div>
                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                    <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <CardContent className="p-6"><Star className="w-10 h-10 mx-auto mb-3 drop-shadow-lg fill-yellow-300 text-yellow-300" /><div className="text-3xl font-bold drop-shadow-sm">4.8</div><div className="text-sm opacity-90 font-medium">Rating Rata-rata</div></CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Filters */}
                <aside className="lg:col-span-1 space-y-6">
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50 rounded-2xl">
                        <CardHeader><CardTitle className="text-cyan-900">Filter & Cari</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative"><Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" /><Input placeholder="Cari produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 bg-blue-50 border-blue-200 placeholder:text-blue-600 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg"/></div>
                            <div className="space-y-4 pt-2">
                                <div><label className="text-sm font-medium text-cyan-800 mb-2 block">Jenis</label><Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg"><SelectValue /></SelectTrigger><SelectContent className="bg-white/80 backdrop-blur-md border-cyan-100"><SelectItem value="all">Semua</SelectItem><SelectItem value="sell">Dijual</SelectItem><SelectItem value="donate">Donasi</SelectItem></SelectContent></Select></div>
                                <div><label className="text-sm font-medium text-cyan-800 mb-2 block">Urutkan</label><Select value={sortBy} onValueChange={setSortBy}><SelectTrigger className="bg-blue-50 border-blue-200 text-blue-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg"><SelectValue /></SelectTrigger><SelectContent className="bg-white/80 backdrop-blur-md border-cyan-100"><SelectItem value="newest">Terbaru</SelectItem><SelectItem value="price-low">Harga Terendah</SelectItem><SelectItem value="rating">Rating Tertinggi</SelectItem></SelectContent></Select></div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50 rounded-2xl">
                        <CardHeader><CardTitle className="text-cyan-900">Kategori</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`w-full text-left p-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${selectedCategory === category.id ? "bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-900 border border-cyan-200 shadow-sm font-bold" : "hover:bg-cyan-50/50 text-cyan-800"}`}>
                                        <span className="text-lg">{category.icon}</span><span>{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </aside>

                {/* Main Content */}
                <section className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.map((item, index) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index }} whileHover={{ y: -5 }} className="group">
                                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col h-full">
                                    <div className="relative">
                                        <img src={item.image} alt={item.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                                            {item.isNew && <Badge className="bg-gradient-to-r from-green-400 to-teal-400 text-white border-0 shadow-md">Baru</Badge>}
                                            {item.isUrgent && <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-md">Urgent</Badge>}
                                            {item.isFeatured && <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-md">Featured</Badge>}
                                            {item.isPopular && <Badge className="bg-gradient-to-r from-orange-400 to-amber-400 text-white border-0 shadow-md">Populer</Badge>}
                                        </div>
                                        <div className="absolute top-3 right-3"><Badge className={`text-white border-0 shadow-md ${item.type === "donate" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}`}>{item.type === "donate" ? "Donasi" : "Dijual"}</Badge></div>
                                    </div>
                                    <CardContent className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-bold text-lg text-cyan-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                        <p className="text-sm text-cyan-700/90 line-clamp-2 mt-1 flex-grow">{item.description}</p>
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {item.tags.map((tag, i) => (<Badge key={i} variant="outline" className="text-xs bg-cyan-50 text-cyan-800 border-cyan-200">{tag}</Badge>))}
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div>
                                                <div className="flex items-baseline space-x-2">
                                                    <span className="text-xl font-bold text-blue-600">{item.price}</span>
                                                    {item.originalPrice && <span className="text-sm text-gray-500 line-through">{item.originalPrice}</span>}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 text-sm text-gray-500"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /><span>{item.rating}</span><span className="text-xs">({item.reviews})</span></div>
                                        </div>
                                        <div className="border-t border-cyan-100/80 my-3"></div>
                                        <div className="flex items-center justify-between text-sm text-cyan-800">
                                            <div className="flex items-center space-x-1.5"><Users className="w-4 h-4" /><span>{item.seller}</span></div>
                                            <div className="flex items-center space-x-1.5"><MapPin className="w-4 h-4" /><span>{item.location}</span></div>
                                        </div>
                                        <div className="flex space-x-2 pt-4 mt-auto">
                                            <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30 rounded-lg">
                                                {item.type === "donate" ? "Ambil Gratis" : "Beli Sekarang"}
                                            </Button>
                                            <Button variant="outline" size="icon" className="rounded-lg border-cyan-300 text-cyan-700 hover:bg-cyan-50/80 hover:text-cyan-800">
                                                <MessageCircle className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-16 bg-cyan-50/50 rounded-2xl col-span-full">
                            <div className="w-24 h-24 bg-white shadow-md rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingCart className="w-12 h-12 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-cyan-800 mb-2">Oops, tidak ada produk ditemukan!</h3>
                            <p className="text-cyan-600 mb-4 max-w-md mx-auto">Coba ubah filter pencarian atau kategori untuk menemukan produk yang Anda cari.</p>
                            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-blue-500/30 rounded-lg">
                                <Plus className="w-4 h-4 mr-2" />
                                Jadi Penjual Pertama
                            </Button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    </div>
  )
}