"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Users, Calendar, MapPin, MessageCircle, Heart, Share2, Plus, Search, ThumbsUp, Award, Zap, TrendingUp, Trophy } from 'lucide-react'
import Link from "next/link"
import { useDevicePerformance } from "@/hooks/use-device-performance"
import { AdaptiveBackground } from "@/components/background/adaptive-background"
import { PerformanceIndicator } from "@/components/ui/performance-indicator"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { Navbar } from "@/components/navigation/navbar"
import { useTheme } from "next-themes"

const communityEvents = [
  {
    id: 1,
    title: "Workshop Kompos Rumahan",
    description: "Belajar membuat kompos dari sampah organik rumah tangga bersama ahli pertanian.",
    date: "2024-01-20",
    time: "09:00 - 12:00",
    location: "Balai RT 05",
    organizer: "Bu Sari",
    participants: 25,
    maxParticipants: 30,
    category: "workshop",
    image: "/placeholder.svg?height=200&width=300&text=Workshop+Kompos",
    status: "upcoming",
    tags: ["Kompos", "Organik", "DIY"],
  },
  {
    id: 2,
    title: "Bazar Produk Daur Ulang",
    description: "Pameran dan penjualan produk hasil daur ulang karya warga komunitas.",
    date: "2024-01-25",
    time: "08:00 - 16:00",
    location: "Lapangan RT 03",
    organizer: "Pak Budi",
    participants: 45,
    maxParticipants: 50,
    category: "event",
    image: "/placeholder.svg?height=200&width=300&text=Bazar+Daur+Ulang",
    status: "upcoming",
    tags: ["Daur Ulang", "Bazar", "Kreatif"],
  },
  {
    id: 3,
    title: "Gotong Royong Kebersihan",
    description: "Kegiatan bersih-bersih lingkungan dan pemilahan sampah di area komunitas.",
    date: "2024-01-15",
    time: "06:00 - 09:00",
    location: "Seluruh Area RT",
    organizer: "Ketua RT",
    participants: 80,
    maxParticipants: 100,
    category: "community",
    image: "/placeholder.svg?height=200&width=300&text=Gotong+Royong",
    status: "completed",
    tags: ["Kebersihan", "Gotong Royong", "Lingkungan"],
  },
]

const discussions = [
  {
    id: 1,
    title: "Tips Mengurangi Food Waste di Rumah",
    author: "Ibu Maya",
    avatar: "/placeholder.svg?height=40&width=40&text=IM",
    content: "Sharing tips praktis untuk mengurangi pemborosan makanan di rumah tangga...",
    likes: 24,
    replies: 8,
    timeAgo: "2 jam lalu",
    category: "tips",
    tags: ["Food Waste", "Tips", "Rumah Tangga"],
  },
  {
    id: 2,
    title: "Hasil Panen Sayuran Hidroponik",
    author: "Pak Joko",
    avatar: "/placeholder.svg?height=40&width=40&text=PJ",
    content: "Alhamdulillah panen sayuran hidroponik bulan ini sangat memuaskan. Ada yang mau belajar?",
    likes: 18,
    replies: 12,
    timeAgo: "5 jam lalu",
    category: "sharing",
    tags: ["Hidroponik", "Panen", "Sayuran"],
  },
  {
    id: 3,
    title: "Ide Kreasi dari Botol Plastik Bekas",
    author: "Rina Sari",
    avatar: "/placeholder.svg?height=40&width=40&text=RS",
    content: "Berbagi ide kreatif mengubah botol plastik bekas menjadi barang berguna...",
    likes: 31,
    replies: 15,
    timeAgo: "1 hari lalu",
    category: "diy",
    tags: ["DIY", "Plastik", "Kreatif"],
  },
]

const leaderboard = [
  { rank: 1, name: "Bu Sari", points: 2450, avatar: "/placeholder.svg?height=40&width=40&text=BS", badge: "🏆" },
  { rank: 2, name: "Pak Joko", points: 2380, avatar: "/placeholder.svg?height=40&width=40&text=PJ", badge: "🥈" },
  { rank: 3, name: "Ibu Maya", points: 2250, avatar: "/placeholder.svg?height=40&width=40&text=IM", badge: "🥉" },
  { rank: 4, name: "Andi Rahman", points: 2100, avatar: "/placeholder.svg?height=40&width=40&text=AR", badge: "" },
  { rank: 5, name: "Rina Sari", points: 1980, avatar: "/placeholder.svg?height=40&width=40&text=RS", badge: "" },
]

export default function CommunityPage() {
  const { performanceLevel, capabilities, isLoading } = useDevicePerformance()
  const { theme = "default" } = useTheme()
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("events")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    setIsPageLoaded(true)
  }, [])

  const animationSettings = {
    duration: performanceLevel === "high" ? 0.6 : performanceLevel === "medium" ? 0.8 : 1.0,
    ease: performanceLevel === "high" ? [0.25, 0.1, 0.25, 1] : "easeOut",
  }

  // Get theme-based colors
  const getThemeColors = () => {
    switch (theme) {
      case "aurora":
        return {
          gradient: "from-green-400 via-blue-400 to-emerald-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
          buttonGradient: "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
          statColors: ["from-green-500 to-green-600", "from-blue-500 to-blue-600", "from-emerald-500 to-emerald-600", "from-teal-500 to-teal-600"]
        }
      case "night":
        return {
          gradient: "from-blue-600 via-indigo-400 to-cyan-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient: "from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600",
          statColors: ["from-blue-600 to-blue-700", "from-indigo-500 to-indigo-600", "from-cyan-500 to-cyan-600", "from-blue-500 to-blue-600"]
        }
      case "geometric":
        return {
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          buttonGradient: "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
          statColors: ["from-red-500 to-red-600", "from-orange-500 to-orange-600", "from-yellow-500 to-yellow-600", "from-pink-500 to-pink-600"]
        }
      case "nebula":
        return {
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          buttonGradient: "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
          statColors: ["from-purple-500 to-purple-600", "from-pink-500 to-pink-600", "from-violet-500 to-violet-600", "from-indigo-500 to-indigo-600"]
        }
      default:
        return {
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
          statColors: ["from-blue-500 to-blue-600", "from-cyan-500 to-cyan-600", "from-teal-500 to-teal-600", "from-green-500 to-green-600"]
        }
    }
  }

  const themeColors = getThemeColors()

  const filteredEvents = communityEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="community-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen relative overflow-hidden"
      >
        <AdaptiveBackground performanceLevel={performanceLevel} variant={theme as "default" | "aurora" | "geometric" | "nebula" | "night"} />
        
        <PerformanceIndicator
          performanceLevel={performanceLevel}
          capabilities={capabilities}
          isLoading={isLoading}
        />
        
        {/* ThemeSelector hanya di halaman ini */}
        <ThemeSelector />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Navbar */}
          <Navbar
            performanceLevel="high"
            animationSettings={{ duration: 0.5, ease: "easeInOut" }}
            theme={theme as "default" | "aurora" | "geometric" | "nebula" | "night"}
          />

          <div className="container mx-auto px-4 py-8">
            {/* Community Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className={`text-center bg-gradient-to-br ${themeColors.statColors[0]} text-white border-0 shadow-lg`}>
                  <CardContent className="p-4">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm opacity-90">Anggota Aktif</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className={`text-center bg-gradient-to-br ${themeColors.statColors[1]} text-white border-0 shadow-lg`}>
                  <CardContent className="p-4">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">24</div>
                    <div className="text-sm opacity-90">Event Bulan Ini</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className={`text-center bg-gradient-to-br ${themeColors.statColors[2]} text-white border-0 shadow-lg`}>
                  <CardContent className="p-4">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm opacity-90">Diskusi Aktif</div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className={`text-center bg-gradient-to-br ${themeColors.statColors[3]} text-white border-0 shadow-lg`}>
                  <CardContent className="p-4">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm opacity-90">Partisipasi</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                    <TabsTrigger value="events" className="text-slate-300 data-[state=active]:text-white">Event & Kegiatan</TabsTrigger>
                    <TabsTrigger value="discussions" className="text-slate-300 data-[state=active]:text-white">Diskusi</TabsTrigger>
                    <TabsTrigger value="achievements" className="text-slate-300 data-[state=active]:text-white">Pencapaian</TabsTrigger>
                  </TabsList>

                  <TabsContent value="events" className="space-y-6">
                    {/* Search and Filter */}
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <Input
                              placeholder="Cari event atau kegiatan..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={selectedCategory === "all" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory("all")}
                              className={selectedCategory === "all" ? `bg-gradient-to-r ${themeColors.buttonGradient}` : "border-slate-600 text-slate-300 hover:bg-slate-800/50"}
                            >
                              Semua
                            </Button>
                            <Button
                              variant={selectedCategory === "workshop" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory("workshop")}
                              className={selectedCategory === "workshop" ? `bg-gradient-to-r ${themeColors.buttonGradient}` : "border-slate-600 text-slate-300 hover:bg-slate-800/50"}
                            >
                              Workshop
                            </Button>
                            <Button
                              variant={selectedCategory === "event" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory("event")}
                              className={selectedCategory === "event" ? `bg-gradient-to-r ${themeColors.buttonGradient}` : "border-slate-600 text-slate-300 hover:bg-slate-800/50"}
                            >
                              Event
                            </Button>
                            <Button
                              variant={selectedCategory === "community" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedCategory("community")}
                              className={selectedCategory === "community" ? `bg-gradient-to-r ${themeColors.buttonGradient}` : "border-slate-600 text-slate-300 hover:bg-slate-800/50"}
                            >
                              Komunitas
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Events Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatePresence>
                        {filteredEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={performanceLevel !== "low" ? { y: -5 } : {}}
                          >
                            <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 overflow-hidden">
                              <div className="relative">
                                <img
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.title}
                                  className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                  <Badge
                                    className={
                                      event.status === "upcoming"
                                        ? "bg-green-500 text-white"
                                        : event.status === "ongoing"
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-500 text-white"
                                    }
                                  >
                                    {event.status === "upcoming"
                                      ? "Akan Datang"
                                      : event.status === "ongoing"
                                        ? "Berlangsung"
                                        : "Selesai"}
                                  </Badge>
                                </div>
                                <div className="absolute top-3 right-3">
                                  <Badge className="bg-slate-900/80 text-white">
                                    {event.participants}/{event.maxParticipants}
                                  </Badge>
                                </div>
                              </div>

                              <CardContent className="p-6">
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-bold text-white text-lg mb-2">{event.title}</h3>
                                    <p className="text-slate-300 text-sm line-clamp-2">{event.description}</p>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, i) => (
                                      <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="space-y-2 text-sm text-slate-300">
                                    <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {event.date} • {event.time}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4" />
                                      <span>Oleh {event.organizer}</span>
                                    </div>
                                  </div>

                                  <div className="flex space-x-2 pt-2">
                                    <Button
                                      className={`flex-1 bg-gradient-to-r ${themeColors.buttonGradient}`}
                                      disabled={event.status === "completed"}
                                    >
                                      {event.status === "completed" ? "Selesai" : "Daftar"}
                                    </Button>
                                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800/50">
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-800/50">
                                      <Heart className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </TabsContent>

                  <TabsContent value="discussions" className="space-y-6">
                    <div className="space-y-4">
                      {discussions.map((discussion, index) => (
                        <motion.div
                          key={discussion.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={performanceLevel !== "low" ? { x: 5 } : {}}
                        >
                          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="flex space-x-4">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {discussion.author
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold text-white">{discussion.title}</h3>
                                      <p className="text-sm text-slate-400">
                                        oleh {discussion.author} • {discussion.timeAgo}
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        discussion.category === "tips"
                                          ? "bg-green-500/20 text-green-300"
                                          : discussion.category === "sharing"
                                            ? "bg-blue-500/20 text-blue-300"
                                            : "bg-purple-500/20 text-purple-300"
                                      }
                                    >
                                      {discussion.category}
                                    </Badge>
                                  </div>

                                  <p className="text-slate-300">{discussion.content}</p>

                                  <div className="flex flex-wrap gap-2">
                                    {discussion.tags.map((tag, i) => (
                                      <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex items-center space-x-4 text-sm text-slate-400">
                                    <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                                      <ThumbsUp className="w-4 h-4" />
                                      <span>{discussion.likes}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                                      <MessageCircle className="w-4 h-4" />
                                      <span>{discussion.replies} balasan</span>
                                    </button>
                                    <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                                      <Share2 className="w-4 h-4" />
                                      <span>Bagikan</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="achievements" className="space-y-6">
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                      <CardHeader>
                        <CardTitle className="text-white">Pencapaian Komunitas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                            <div className="text-4xl mb-2">🏆</div>
                            <h3 className="font-bold text-white mb-2">Komunitas Terbaik</h3>
                            <p className="text-sm text-slate-300">Penghargaan dari Kelurahan</p>
                          </div>

                          <div className="text-center p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
                            <div className="text-4xl mb-2">🌱</div>
                            <h3 className="font-bold text-white mb-2">Zero Waste Champion</h3>
                            <p className="text-sm text-slate-300">3 bulan berturut-turut</p>
                          </div>

                          <div className="text-center p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/30">
                            <div className="text-4xl mb-2">🤝</div>
                            <h3 className="font-bold text-white mb-2">Solidaritas Tinggi</h3>
                            <p className="text-sm text-slate-300">95% partisipasi warga</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Leaderboard */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span>Leaderboard</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {leaderboard.map((user, index) => (
                          <motion.div
                            key={user.rank}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{user.badge || `#${user.rank}`}</span>
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-white text-sm">{user.name}</p>
                              <p className="text-xs text-slate-400">{user.points} poin</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Zap className="w-5 h-5 text-blue-400" />
                        <span>Aksi Cepat</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className={`w-full justify-start bg-gradient-to-r ${themeColors.buttonGradient} text-white`}>
                        <Plus className="w-4 h-4 mr-2" />
                        Buat Event Baru
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800/50">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Mulai Diskusi
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800/50">
                        <Users className="w-4 h-4 mr-2" />
                        Undang Teman
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Community Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span>Statistik Minggu Ini</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Event Selesai</span>
                        <span className="font-bold text-green-400">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Diskusi Baru</span>
                        <span className="font-bold text-blue-400">24</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Anggota Baru</span>
                        <span className="font-bold text-purple-400">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Partisipasi</span>
                        <span className="font-bold text-orange-400">89%</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
