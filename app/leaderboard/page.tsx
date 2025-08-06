"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard" // Import Navbar

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
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
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
        return "bg-gradient-to-r from-blue-400 to-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Navbar /> {/* Tambahkan Navbar di sini */}
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b sticky top-[56px] z-40 shadow-sm"> {/* Sesuaikan top */}
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
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Leaderboard</h1>
                  <p className="text-sm text-gray-600">Kompetisi dan pencapaian komunitas</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                  <SelectItem value="yearly">Tahunan</SelectItem>
                  <SelectItem value="alltime">Sepanjang Masa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="food">Food Rescue</SelectItem>
                  <SelectItem value="donation">Donasi</SelectItem>
                  <SelectItem value="recycle">Daur Ulang</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Weekly Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-5 h-5" />
                    <Badge className="bg-white/20 text-white border-0">Challenge Aktif</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{weeklyChallenge.title}</h2>
                  <p className="text-purple-100 mb-4">{weeklyChallenge.description}</p>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{weeklyChallenge.participants} peserta</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{weeklyChallenge.timeLeft}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4" />
                      <span>{weeklyChallenge.prize}</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-3">Top Peserta</h3>
                  <div className="space-y-2">
                    {weeklyChallenge.topParticipants.map((participant, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{participant.name}</span>
                        <Badge className="bg-white/20 text-white text-xs">{participant.progress}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual">Individu</TabsTrigger>
            <TabsTrigger value="community">Komunitas</TabsTrigger>
          </TabsList>

          <TabsContent value="individual" className="space-y-6">
            {/* Top 3 Podium */}
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
                <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200 pt-8">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-gray-400">
                        <AvatarImage src={individualLeaderboard[1].avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg font-bold">
                          {individualLeaderboard[1].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{individualLeaderboard[1].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{individualLeaderboard[1].location}</p>
                    <p className="text-2xl font-bold text-gray-700">{individualLeaderboard[1].points}</p>
                    <div className="flex justify-center space-x-1 mt-2">
                      {individualLeaderboard[1].badges.map((badge, i) => (
                        <span key={i} className="text-lg">
                          {badge}
                        </span>
                      ))}
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
                <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-200 to-orange-300 pt-6 transform scale-105">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar className="w-24 h-24 mx-auto border-4 border-yellow-500">
                        <AvatarImage src={individualLeaderboard[0].avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xl font-bold">
                          {individualLeaderboard[0].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1 text-lg">{individualLeaderboard[0].name}</h3>
                    <p className="text-sm text-gray-700 mb-2">{individualLeaderboard[0].location}</p>
                    <p className="text-3xl font-bold text-yellow-700">{individualLeaderboard[0].points}</p>
                    <div className="flex justify-center space-x-1 mt-2">
                      {individualLeaderboard[0].badges.map((badge, i) => (
                        <span key={i} className="text-xl">
                          {badge}
                        </span>
                      ))}
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
                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-100 to-amber-200 pt-8">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-amber-500">
                        <AvatarImage src={individualLeaderboard[2].avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-lg font-bold">
                          {individualLeaderboard[2].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-1">{individualLeaderboard[2].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{individualLeaderboard[2].location}</p>
                    <p className="text-2xl font-bold text-amber-700">{individualLeaderboard[2].points}</p>
                    <div className="flex justify-center space-x-1 mt-2">
                      {individualLeaderboard[2].badges.map((badge, i) => (
                        <span key={i} className="text-lg">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Full Leaderboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Peringkat Lengkap</span>
                  </CardTitle>
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
                        className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                          user.rank <= 3
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                            : "bg-gray-50 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 ${getRankBg(user.rank)} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}
                          >
                            {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                          </div>
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-gray-800">{user.name}</h3>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span>{user.location}</span>
                                <div className="flex items-center space-x-1">
                                  <Target className="w-3 h-3" />
                                  <span>{user.streak} hari berturut-turut</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-800">{user.points}</p>
                              <div className="flex items-center space-x-1">
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
                            <div className="flex space-x-4 text-xs text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Leaf className="w-3 h-3 text-green-500" />
                                <span>{user.stats.foodSaved}kg</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3 text-red-500" />
                                <span>{user.stats.donations}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Recycle className="w-3 h-3 text-blue-500" />
                                <span>{user.stats.recycled}kg</span>
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
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Peringkat Komunitas</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {communityLeaderboard.map((community, index) => (
                      <motion.div
                        key={community.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        className={`p-6 rounded-lg transition-all ${
                          community.rank === 1
                            ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300"
                            : community.rank === 2
                              ? "bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300"
                              : community.rank === 3
                                ? "bg-gradient-to-r from-amber-50 to-amber-100 border-2 border-amber-300"
                                : "bg-gray-50 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-16 h-16 ${getRankBg(community.rank)} rounded-full flex items-center justify-center text-white shadow-lg`}
                            >
                              {getRankIcon(community.rank)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">{community.name}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{community.members} anggota</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4" />
                                  <span>Rata-rata {community.avgPoints} poin/orang</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-gray-800">{community.points.toLocaleString()}</p>
                            <div className="flex items-center space-x-1 justify-end">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-600">{community.change}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-white/50 rounded-lg">
                            <Leaf className="w-6 h-6 text-green-500 mx-auto mb-1" />
                            <p className="text-lg font-bold text-gray-800">{community.stats.totalFood}kg</p>
                            <p className="text-xs text-gray-600">Makanan Diselamatkan</p>
                          </div>
                          <div className="text-center p-3 bg-white/50 rounded-lg">
                            <Heart className="w-6 h-6 text-red-500 mx-auto mb-1" />
                            <p className="text-lg font-bold text-gray-800">{community.stats.totalDonations}</p>
                            <p className="text-xs text-gray-600">Total Donasi</p>
                          </div>
                          <div className="text-center p-3 bg-white/50 rounded-lg">
                            <Recycle className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                            <p className="text-lg font-bold text-gray-800">{community.stats.totalRecycled}kg</p>
                            <p className="text-xs text-gray-600">Sampah Didaur Ulang</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Pencapaian:</h4>
                          <div className="flex flex-wrap gap-2">
                            {community.achievements.map((achievement, i) => (
                              <Badge key={i} className="bg-blue-100 text-blue-800">
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
