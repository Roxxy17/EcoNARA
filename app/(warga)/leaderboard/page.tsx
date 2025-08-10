"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Leaf,
  Heart,
  Recycle,
  Zap,
  Target,
  Award,
  Calendar,
  MapPin,
  Sparkles,
  Flame,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard"

const individualLeaderboard = [
  {
    rank: 1,
    name: "Sari Wijaya",
    avatar: "/placeholder.svg?height=40&width=40&text=SW",
    points: 2450,
    change: "+12",
    location: "RT 05",
    badges: ["🏆", "🌱", "❤️"],
    stats: { foodSaved: 45, donations: 12, recycled: 23 },
    streak: 15,
  },
  {
    rank: 2,
    name: "Joko Santoso",
    avatar: "/placeholder.svg?height=40&width=40&text=JS",
    points: 2380,
    change: "+8",
    location: "RT 03",
    badges: ["🥈", "♻️", "🤝"],
    stats: { foodSaved: 42, donations: 10, recycled: 28 },
    streak: 12,
  },
  {
    rank: 3,
    name: "Maya Putri",
    avatar: "/placeholder.svg?height=40&width=40&text=MP",
    points: 2250,
    change: "+15",
    location: "RT 02",
    badges: ["🥉", "🌟", "💚"],
    stats: { foodSaved: 38, donations: 15, recycled: 20 },
    streak: 18,
  },
  {
    rank: 4,
    name: "Andi Rahman",
    avatar: "/placeholder.svg?height=40&width=40&text=AR",
    points: 2100,
    change: "+5",
    location: "RT 01",
    badges: ["🎯", "🔥"],
    stats: { foodSaved: 35, donations: 8, recycled: 25 },
    streak: 8,
  },
  {
    rank: 5,
    name: "Rina Sari",
    avatar: "/placeholder.svg?height=40&width=40&text=RS",
    points: 1980,
    change: "+9",
    location: "RT 04",
    badges: ["⭐", "🌿"],
    stats: { foodSaved: 32, donations: 11, recycled: 18 },
    streak: 10,
  },
]

const communityLeaderboard = [
  {
    rank: 1,
    name: "RT 05 Kelurahan Maju",
    members: 89,
    points: 15420,
    change: "+245",
    avgPoints: 173,
    achievements: ["Zero Waste Champion", "Community Hero", "Sustainability Leader"],
    stats: { totalFood: 245, totalDonations: 89, totalRecycled: 156 },
  },
  {
    rank: 2,
    name: "RT 03 Kelurahan Sejahtera",
    members: 76,
    points: 14680,
    change: "+189",
    avgPoints: 193,
    achievements: ["Eco Warriors", "Donation Champions"],
    stats: { totalFood: 220, totalDonations: 76, totalRecycled: 142 },
  },
  {
    rank: 3,
    name: "RT 07 Kelurahan Harmoni",
    members: 82,
    points: 13950,
    change: "+312",
    avgPoints: 170,
    achievements: ["Rising Stars", "Green Initiative"],
    stats: { totalFood: 198, totalDonations: 82, totalRecycled: 134 },
  },
]

const weeklyChallenge = {
  title: "Challenge Minggu Ini: Zero Food Waste",
  description: "Tantangan untuk mengurangi food waste hingga 0% selama seminggu",
  participants: 156,
  timeLeft: "3 hari 12 jam",
  prize: "Badge eksklusif + 500 poin bonus",
  topParticipants: [
    { name: "Bu Sari", progress: 95, avatar: "/placeholder.svg?height=32&width=32&text=BS" },
    { name: "Pak Joko", progress: 88, avatar: "/placeholder.svg?height=32&width=32&text=PJ" },
    { name: "Ibu Maya", progress: 82, avatar: "/placeholder.svg?height=32&width=32&text=IM" },
  ],
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("individual")
  const [timeRange, setTimeRange] = useState("monthly")
  const [category, setCategory] = useState("all")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-white" />
      case 2:
        return <Medal className="w-6 h-6 text-white" />
      case 3:
        return <Medal className="w-6 h-6 text-white" />
      default:
        return <span className="text-lg font-bold text-white">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-orange-500"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600"
      default:
        return "bg-gradient-to-r from-cyan-500 to-blue-600"
    }
  }

  const getRankCardBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 border-yellow-300"
      case 2:
        return "bg-gradient-to-br from-gray-300/20 via-slate-400/20 to-gray-500/20 border-gray-300"
      case 3:
        return "bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-yellow-400/20 border-amber-300"
      default:
        return "bg-white/90 border-cyan-100"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Background Effects - konsisten dengan page lain */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/25">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Leaderboard Komunitas
                </h1>
                <p className="text-sm text-cyan-700/80 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Kompetisi ramah lingkungan untuk komunitas yang lebih hijau
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg">
              <Crown className="w-3 h-3 mr-1" />
              Champions
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">156</div>
                <div className="text-sm opacity-90">Peserta Aktif</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">1.2K</div>
                <div className="text-sm opacity-90">Kg Waste Reduced</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="text-center bg-gradient-to-br from-pink-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">89</div>
                <div className="text-sm opacity-90">Donasi Berhasil</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="text-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">24</div>
                <div className="text-sm opacity-90">Challenge Aktif</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Enhanced Weekly Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white overflow-hidden backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <Badge className="bg-white/20 text-white border-0 shadow-lg">
                      <Flame className="w-3 h-3 mr-1" />
                      Challenge Aktif
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{weeklyChallenge.title}</h2>
                  <p className="text-purple-100 mb-4 leading-relaxed">{weeklyChallenge.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                      <Users className="w-4 h-4" />
                      <span>{weeklyChallenge.participants} peserta</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                      <Calendar className="w-4 h-4" />
                      <span>{weeklyChallenge.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-3">
                      <Award className="w-4 h-4" />
                      <span className="truncate">{weeklyChallenge.prize}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block ml-8">
                  <div className="text-center">
                    <h3 className="font-semibold mb-4 flex items-center justify-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Top Peserta
                    </h3>
                    <div className="space-y-3">
                      {weeklyChallenge.topParticipants.map((participant, index) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center space-x-3 bg-white/20 rounded-xl p-3 backdrop-blur-sm border border-white/10"
                        >
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs bg-white/20">
                                {participant.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
                              {index + 1}
                            </div>
                          </div>
                          <div className="flex-1 text-left">
                            <div className="text-sm font-medium">{participant.name}</div>
                            <div className="flex items-center space-x-1">
                              <ChevronUp className="w-3 h-3 text-green-300" />
                              <span className="text-xs text-green-200">{participant.progress}%</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Card className="flex-1 border-0 shadow-lg bg-white/90 backdrop-blur-sm border border-cyan-100/50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-800">Periode:</span>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-cyan-200">
                    <SelectItem value="daily" className="text-cyan-900">Harian</SelectItem>
                    <SelectItem value="weekly" className="text-cyan-900">Mingguan</SelectItem>
                    <SelectItem value="monthly" className="text-cyan-900">Bulanan</SelectItem>
                    <SelectItem value="yearly" className="text-cyan-900">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm font-medium text-cyan-800">Kategori:</span>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-cyan-200">
                    <SelectItem value="all" className="text-cyan-900">Semua Kategori</SelectItem>
                    <SelectItem value="food" className="text-cyan-900">Food Rescue</SelectItem>
                    <SelectItem value="donation" className="text-cyan-900">Donasi</SelectItem>
                    <SelectItem value="recycle" className="text-cyan-900">Daur Ulang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/90 backdrop-blur-sm border border-cyan-100/50 shadow-lg rounded-xl p-1">
            <TabsTrigger value="individual" className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg">
              <Trophy className="w-4 h-4 mr-2" />
              Individu
            </TabsTrigger>
            <TabsTrigger value="community" className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white rounded-lg">
              <Users className="w-4 h-4 mr-2" />
              Komunitas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            {/* Enhanced Top 3 Podium */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              {/* 2nd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <Card className={`border-0 shadow-xl ${getRankCardBg(2)} pt-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-gray-400 shadow-lg">
                        <AvatarImage src={individualLeaderboard[1].avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-gray-200 to-gray-300">
                          {individualLeaderboard[1].name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-cyan-900 mb-1">{individualLeaderboard[1].name}</h3>
                    <p className="text-sm text-cyan-700 mb-2 flex items-center justify-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {individualLeaderboard[1].location}
                    </p>
                    <p className="text-2xl font-bold text-gray-700 mb-2">{individualLeaderboard[1].points.toLocaleString()}</p>
                    <div className="flex justify-center space-x-1 mb-2">
                      {individualLeaderboard[1].badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-cyan-700">{individualLeaderboard[1].streak} hari</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <Card className={`border-0 shadow-2xl ${getRankCardBg(1)} pt-6 backdrop-blur-sm transform scale-105 hover:scale-110 transition-all duration-300`}>
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <Avatar className="w-24 h-24 mx-auto border-4 border-yellow-500 shadow-xl">
                        <AvatarImage src={individualLeaderboard[0].avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-yellow-200 to-orange-300">
                          {individualLeaderboard[0].name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-bold text-cyan-900 mb-1 text-lg">{individualLeaderboard[0].name}</h3>
                    <p className="text-sm text-cyan-700 mb-2 flex items-center justify-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {individualLeaderboard[0].location}
                    </p>
                    <p className="text-3xl font-bold text-yellow-700 mb-2">{individualLeaderboard[0].points.toLocaleString()}</p>
                    <div className="flex justify-center space-x-1 mb-2">
                      {individualLeaderboard[0].badges.map((badge, i) => (
                        <span key={i} className="text-xl">{badge}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-cyan-700 font-semibold">{individualLeaderboard[0].streak} hari</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 3rd Place */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <Card className={`border-0 shadow-xl ${getRankCardBg(3)} pt-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-amber-500 shadow-lg">
                        <AvatarImage src={individualLeaderboard[2].avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-amber-200 to-yellow-300">
                          {individualLeaderboard[2].name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-cyan-900 mb-1">{individualLeaderboard[2].name}</h3>
                    <p className="text-sm text-cyan-700 mb-2 flex items-center justify-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {individualLeaderboard[2].location}
                    </p>
                    <p className="text-2xl font-bold text-amber-700 mb-2">{individualLeaderboard[2].points.toLocaleString()}</p>
                    <div className="flex justify-center space-x-1 mb-2">
                      {individualLeaderboard[2].badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="text-cyan-700">{individualLeaderboard[2].streak} hari</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Enhanced Full Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-cyan-900">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Peringkat Lengkap</span>
                  </CardTitle>
                  <CardDescription className="text-cyan-700">
                    Kompetisi point bulanan untuk komunitas yang lebih hijau
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {individualLeaderboard.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5, scale: 1.01 }}
                        className={`flex items-center space-x-4 p-5 rounded-xl transition-all duration-300 border backdrop-blur-sm ${
                          user.rank <= 3
                            ? `${getRankCardBg(user.rank)} shadow-lg hover:shadow-xl`
                            : "bg-white/80 hover:bg-white/90 border-cyan-100 hover:border-cyan-200 shadow-md hover:shadow-lg"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 ${getRankBg(user.rank)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                          >
                            {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                          </div>
                          <Avatar className="w-12 h-12 shadow-md">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-gradient-to-br from-cyan-100 to-blue-200">
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-cyan-900 text-lg">{user.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-cyan-600">
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{user.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Flame className="w-3 h-3 text-orange-500" />
                                  <span>{user.streak} hari berturut-turut</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-cyan-900">{user.points.toLocaleString()}</p>
                              <div className="flex items-center space-x-1 justify-end">
                                {Number.parseInt(user.change) > 0 ? (
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    Number.parseInt(user.change) > 0 ? "text-green-600" : "text-red-600"
                                  }`}
                                >
                                  {user.change}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex space-x-1">
                              {user.badges.map((badge, i) => (
                                <span key={i} className="text-lg">
                                  {badge}
                                </span>
                              ))}
                            </div>
                            <div className="flex space-x-4 text-xs">
                              <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full">
                                <Leaf className="w-3 h-3 text-green-500" />
                                <span className="text-green-700 font-medium">{user.stats.foodSaved}kg</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-pink-50 px-2 py-1 rounded-full">
                                <Heart className="w-3 h-3 text-pink-500" />
                                <span className="text-pink-700 font-medium">{user.stats.donations}</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full">
                                <Recycle className="w-3 h-3 text-blue-500" />
                                <span className="text-blue-700 font-medium">{user.stats.recycled}kg</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-cyan-900">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Peringkat Komunitas</span>
                  </CardTitle>
                  <CardDescription className="text-cyan-700">
                    Kompetisi antar RT dalam program sustainability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {communityLeaderboard.map((community, index) => (
                      <motion.div
                        key={community.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className={`p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border backdrop-blur-sm ${
                          community.rank === 1
                            ? getRankCardBg(1)
                            : community.rank === 2
                              ? getRankCardBg(2)
                              : community.rank === 3
                                ? getRankCardBg(3)
                                : "bg-white/90 border-cyan-100 hover:border-cyan-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-16 h-16 ${getRankBg(community.rank)} rounded-xl flex items-center justify-center text-white shadow-lg`}
                            >
                              {getRankIcon(community.rank)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-cyan-900">{community.name}</h3>
                              <div className="flex items-center space-x-6 text-sm text-cyan-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{community.members} anggota</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span>Rata-rata {community.avgPoints} poin/orang</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-cyan-900">{community.points.toLocaleString()}</p>
                            <div className="flex items-center space-x-1 justify-end">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-600">{community.change}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center p-4 bg-green-50/80 rounded-xl border border-green-200/50 backdrop-blur-sm">
                            <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-lg font-bold text-green-800">{community.stats.totalFood}kg</p>
                            <p className="text-xs text-green-600 font-medium">Makanan Diselamatkan</p>
                          </div>
                          <div className="text-center p-4 bg-pink-50/80 rounded-xl border border-pink-200/50 backdrop-blur-sm">
                            <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                            <p className="text-lg font-bold text-pink-800">{community.stats.totalDonations}</p>
                            <p className="text-xs text-pink-600 font-medium">Total Donasi</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50/80 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                            <Recycle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-lg font-bold text-blue-800">{community.stats.totalRecycled}kg</p>
                            <p className="text-xs text-blue-600 font-medium">Sampah Didaur Ulang</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-cyan-800 mb-3 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-yellow-500" />
                            Pencapaian:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {community.achievements.map((achievement, i) => (
                              <Badge key={i} className="bg-cyan-100 text-cyan-800 border border-cyan-200">
                                <Sparkles className="w-3 h-3 mr-1" />
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
