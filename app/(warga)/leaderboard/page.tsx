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

  const getRankBgStyle = (rank: number): React.CSSProperties => {
    switch (rank) {
      case 1:
        return {
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ea580c)'
        }
      case 2:
        return {
          background: 'linear-gradient(135deg, #d1d5db, #9ca3af, #6b7280)'
        }
      case 3:
        return {
          background: 'linear-gradient(135deg, #f59e0b, #d97706, #ea580c)'
        }
      default:
        return {
          background: 'linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)'
        }
    }
  }

  const getRankCardStyle = (rank: number): React.CSSProperties => {
    switch (rank) {
      case 1:
        return {
          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))',
          borderColor: '#fbbf24',
          borderWidth: '2px',
          borderStyle: 'solid',
          boxShadow: '0 25px 50px -12px rgba(251, 191, 36, 0.25)'
        }
      case 2:
        return {
          background: 'linear-gradient(135deg, rgba(209, 213, 219, 0.15), rgba(156, 163, 175, 0.15), rgba(107, 114, 128, 0.15))',
          borderColor: '#d1d5db',
          borderWidth: '2px',
          borderStyle: 'solid',
          boxShadow: '0 25px 50px -12px rgba(156, 163, 175, 0.25)'
        }
      case 3:
        return {
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15), rgba(234, 88, 12, 0.15))',
          borderColor: '#f59e0b',
          borderWidth: '2px',
          borderStyle: 'solid',
          boxShadow: '0 25px 50px -12px rgba(245, 158, 11, 0.25)'
        }
      default:
        return {
          background: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(6, 182, 212, 0.2)',
          borderWidth: '1px',
          borderStyle: 'solid',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
        }
    }
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 25%, #f0fdfa 75%, #ecfeff 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(165, 243, 252, 0.6), rgba(59, 130, 246, 0.4))'
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.6))',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4))',
            animationDelay: '2s'
          }}
        />
      </div>

      <Navbar />

      {/* Header */}
      <header 
        className="backdrop-blur-xl border-b sticky top-[72px] z-40 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(6, 182, 212, 0.2)'
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ea580c)'
                }}
              >
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{ color: '#d97706' }}
                >
                  Leaderboard Komunitas
                </h1>
                <p className="text-sm flex items-center" style={{ color: '#0e7490' }}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Kompetisi ramah lingkungan untuk komunitas yang lebih hijau
                </p>
              </div>
            </div>
            <Badge 
              className="text-white shadow-lg border-0"
              style={{
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)'
              }}
            >
              <Crown className="w-3 h-3 mr-1" />
              Champions
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ea580c)'
              }}
            >
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Trophy className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">156</div>
                <div className="text-sm opacity-90">Peserta Aktif</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a, #15803d)'
              }}
            >
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Leaf className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">1.2K</div>
                <div className="text-sm opacity-90">Kg Waste Reduced</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ec4899, #db2777, #be185d)'
              }}
            >
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Heart className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">89</div>
                <div className="text-sm opacity-90">Donasi Berhasil</div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2, #0e7490)'
              }}
            >
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Zap className="w-7 h-7" />
                </div>
                <div className="text-3xl font-bold mb-1">24</div>
                <div className="text-sm opacity-90">Challenge Aktif</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Weekly Challenge Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card 
            className="border-0 shadow-xl text-white overflow-hidden backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b)'
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                    >
                      <Zap className="w-5 h-5" />
                    </div>
                    <Badge 
                      className="text-white border-0 shadow-lg"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
                    >
                      <Flame className="w-3 h-3 mr-1" />
                      Challenge Aktif
                    </Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{weeklyChallenge.title}</h2>
                  <p className="opacity-90 mb-4 leading-relaxed">{weeklyChallenge.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div 
                      className="flex items-center space-x-2 rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    >
                      <Users className="w-4 h-4" />
                      <span>{weeklyChallenge.participants} peserta</span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{weeklyChallenge.timeLeft}</span>
                    </div>
                    <div 
                      className="flex items-center space-x-2 rounded-lg p-3"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                    >
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
                          className="flex items-center space-x-3 rounded-xl p-3 backdrop-blur-sm"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.25)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                          }}
                        >
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={participant.avatar || "/placeholder.svg"} />
                              <AvatarFallback 
                                className="text-xs"
                                style={{ 
                                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                  color: '#1f2937'
                                }}
                              >
                                {participant.name.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div 
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ 
                                backgroundColor: '#fbbf24',
                                color: '#1f2937'
                              }}
                            >
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

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Card 
            className="flex-1 border shadow-lg backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'rgba(6, 182, 212, 0.2)'
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" style={{ color: '#0891b2' }} />
                  <span className="text-sm font-medium" style={{ color: '#164e63' }}>Periode:</span>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger 
                    className="bg-white"
                    style={{
                      borderColor: '#06b6d4',
                      color: '#164e63'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-white"
                    style={{ borderColor: 'rgba(6, 182, 212, 0.2)' }}
                  >
                    <SelectItem value="daily" style={{ color: '#164e63' }}>Harian</SelectItem>
                    <SelectItem value="weekly" style={{ color: '#164e63' }}>Mingguan</SelectItem>
                    <SelectItem value="monthly" style={{ color: '#164e63' }}>Bulanan</SelectItem>
                    <SelectItem value="yearly" style={{ color: '#164e63' }}>Tahunan</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" style={{ color: '#0891b2' }} />
                  <span className="text-sm font-medium" style={{ color: '#164e63' }}>Kategori:</span>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger 
                    className="bg-white"
                    style={{
                      borderColor: '#06b6d4',
                      color: '#164e63'
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent 
                    className="bg-white"
                    style={{ borderColor: 'rgba(6, 182, 212, 0.2)' }}
                  >
                    <SelectItem value="all" style={{ color: '#164e63' }}>Semua Kategori</SelectItem>
                    <SelectItem value="food" style={{ color: '#164e63' }}>Food Rescue</SelectItem>
                    <SelectItem value="donation" style={{ color: '#164e63' }}>Donasi</SelectItem>
                    <SelectItem value="recycle" style={{ color: '#164e63' }}>Daur Ulang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList 
            className="grid w-full grid-cols-2 backdrop-blur-sm shadow-lg rounded-xl p-1"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: 'rgba(6, 182, 212, 0.2)',
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <TabsTrigger 
              value="individual" 
              className="rounded-lg text-cyan-700 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-300 data-[state=active]:to-amber-500"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Individu
            </TabsTrigger>
            <TabsTrigger 
              value="community" 
              className="rounded-lg text-cyan-700 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-300 data-[state=active]:to-amber-500"
            >
              <Users className="w-4 h-4 mr-2" />
              Komunitas
            </TabsTrigger>
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
                <Card 
                  className="border shadow-xl pt-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  style={getRankCardStyle(2)}
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar 
                        className="w-20 h-20 mx-auto shadow-lg"
                        style={{ border: '4px solid #d1d5db' }}
                      >
                        <AvatarImage src={individualLeaderboard[1].avatar || "/placeholder.svg"} />
                        <AvatarFallback 
                          className="text-lg font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                            color: '#374151'
                          }}
                        >
                          {individualLeaderboard[1].name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                        style={getRankBgStyle(2)}
                      >
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold mb-1" style={{ color: '#164e63' }}>{individualLeaderboard[1].name}</h3>
                    <p className="text-sm mb-2 flex items-center justify-center" style={{ color: '#0e7490' }}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {individualLeaderboard[1].location}
                    </p>
                    <p className="text-2xl font-bold mb-2" style={{ color: '#6b7280' }}>{individualLeaderboard[1].points.toLocaleString()}</p>
                    <div className="flex justify-center space-x-1 mb-2">
                      {individualLeaderboard[1].badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span style={{ color: '#0e7490' }}>{individualLeaderboard[1].streak} hari</span>
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
                <Card 
                  className="border shadow-2xl pt-6 backdrop-blur-sm transform scale-105 hover:scale-110 transition-all duration-300"
                  style={getRankCardStyle(1)}
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center shadow-xl animate-pulse"
                          style={{
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                          }}
                        >
                          <Crown className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <Avatar 
                        className="w-24 h-24 mx-auto shadow-xl"
                        style={{ border: '4px solid #fbbf24' }}
                      >
                        <AvatarImage src={individualLeaderboard[0].avatar || "/placeholder.svg"} />
                        <AvatarFallback 
                          className="text-xl font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                            color: '#92400e'
                          }}
                        >
                          {individualLeaderboard[0].name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <h3 className="font-bold mb-1 text-lg" style={{ color: '#164e63' }}>{individualLeaderboard[0].name}</h3>
                    <p className="text-sm mb-2 flex items-center justify-center" style={{ color: '#0e7490' }}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {individualLeaderboard[0].location}
                    </p>
                    <p className="text-3xl font-bold mb-2" style={{ color: '#d97706' }}>{individualLeaderboard[0].points.toLocaleString()}</p>
                    <div className="flex justify-center space-x-1 mb-2">
                      {individualLeaderboard[0].badges.map((badge, i) => (
                        <span key={i} className="text-xl">{badge}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span className="font-semibold" style={{ color: '#0e7490' }}>{individualLeaderboard[0].streak} hari</span>
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
                <Card 
                  className="border shadow-xl pt-8 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  style={getRankCardStyle(3)}
                >
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <Avatar 
                        className="w-20 h-20 mx-auto shadow-lg"
                        style={{ border: '4px solid #f59e0b' }}
                      >
                        <AvatarImage src={individualLeaderboard[2].avatar || "/placeholder.svg"} />
                        <AvatarFallback 
                          className="text-lg font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                            color: '#92400e'
                          }}
                        >
                          {individualLeaderboard[2].name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                        style={getRankBgStyle(3)}
                      >
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold mb-1" style={{ color: '#164e63' }}>{individualLeaderboard[2].name}</h3>
                    <p className="text-sm mb-2 flex items-center justify-center" style={{ color: '#0e7490' }}>
                      <MapPin className="w-3 h-3 mr-1" />
                      {individualLeaderboard[2].location}
                    </p>
                    <p className="text-2xl font-bold mb-2" style={{ color: '#d97706' }}>{individualLeaderboard[2].points.toLocaleString()}</p>
                    <div className="flex justify-center space-x-1 mb-2">
                      {individualLeaderboard[2].badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span style={{ color: '#0e7490' }}>{individualLeaderboard[2].streak} hari</span>
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
              <Card 
                className="border shadow-xl backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: 'rgba(6, 182, 212, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: '#164e63' }}>
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    <span>Peringkat Lengkap</span>
                  </CardTitle>
                  <CardDescription style={{ color: '#0e7490' }}>
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
                        className="flex items-center space-x-4 p-5 rounded-xl transition-all duration-300 border backdrop-blur-sm shadow-md hover:shadow-lg"
                        style={user.rank <= 3 ? getRankCardStyle(user.rank) : {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderColor: 'rgba(6, 182, 212, 0.15)'
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                            style={getRankBgStyle(user.rank)}
                          >
                            {user.rank <= 3 ? getRankIcon(user.rank) : `#${user.rank}`}
                          </div>
                          <Avatar className="w-12 h-12 shadow-md">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback 
                              style={{
                                background: 'linear-gradient(135deg, #ecfeff, #cffafe)',
                                color: '#164e63'
                              }}
                            >
                              {user.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg" style={{ color: '#164e63' }}>{user.name}</h3>
                              <div className="flex items-center space-x-4 text-sm" style={{ color: '#0891b2' }}>
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
                              <p className="text-2xl font-bold" style={{ color: '#164e63' }}>{user.points.toLocaleString()}</p>
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
                              <div 
                                className="flex items-center space-x-1 px-2 py-1 rounded-full"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}
                              >
                                <Leaf className="w-3 h-3 text-green-500" />
                                <span className="text-green-700 font-medium">{user.stats.foodSaved}kg</span>
                              </div>
                              <div 
                                className="flex items-center space-x-1 px-2 py-1 rounded-full"
                                style={{ backgroundColor: 'rgba(236, 72, 153, 0.15)' }}
                              >
                                <Heart className="w-3 h-3 text-pink-500" />
                                <span className="text-pink-700 font-medium">{user.stats.donations}</span>
                              </div>
                              <div 
                                className="flex items-center space-x-1 px-2 py-1 rounded-full"
                                style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}
                              >
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
              <Card 
                className="border shadow-xl backdrop-blur-sm"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderColor: 'rgba(6, 182, 212, 0.2)'
                }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2" style={{ color: '#164e63' }}>
                    <Users className="w-5 h-5 text-blue-500" />
                    <span>Peringkat Komunitas</span>
                  </CardTitle>
                  <CardDescription style={{ color: '#0e7490' }}>
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
                        className="p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border backdrop-blur-sm"
                        style={community.rank <= 3 ? getRankCardStyle(community.rank) : {
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderColor: 'rgba(6, 182, 212, 0.2)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg"
                              style={getRankBgStyle(community.rank)}
                            >
                              {getRankIcon(community.rank)}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold" style={{ color: '#164e63' }}>{community.name}</h3>
                              <div className="flex items-center space-x-6 text-sm mt-1" style={{ color: '#0891b2' }}>
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
                            <p className="text-3xl font-bold" style={{ color: '#164e63' }}>{community.points.toLocaleString()}</p>
                            <div className="flex items-center space-x-1 justify-end">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium text-green-600">{community.change}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div 
                            className="text-center p-4 rounded-xl backdrop-blur-sm"
                            style={{
                              backgroundColor: 'rgba(34, 197, 94, 0.15)',
                              border: '1px solid rgba(34, 197, 94, 0.25)'
                            }}
                          >
                            <Leaf className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <p className="text-lg font-bold text-green-800">{community.stats.totalFood}kg</p>
                            <p className="text-xs text-green-600 font-medium">Makanan Diselamatkan</p>
                          </div>
                          <div 
                            className="text-center p-4 rounded-xl backdrop-blur-sm"
                            style={{
                              backgroundColor: 'rgba(236, 72, 153, 0.15)',
                              border: '1px solid rgba(236, 72, 153, 0.25)'
                            }}
                          >
                            <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                            <p className="text-lg font-bold text-pink-800">{community.stats.totalDonations}</p>
                            <p className="text-xs text-pink-600 font-medium">Total Donasi</p>
                          </div>
                          <div 
                            className="text-center p-4 rounded-xl backdrop-blur-sm"
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.15)',
                              border: '1px solid rgba(59, 130, 246, 0.25)'
                            }}
                          >
                            <Recycle className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-lg font-bold text-blue-800">{community.stats.totalRecycled}kg</p>
                            <p className="text-xs text-blue-600 font-medium">Sampah Didaur Ulang</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#164e63' }}>
                            <Award className="w-4 h-4 mr-2 text-yellow-500" />
                            Pencapaian:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {community.achievements.map((achievement, i) => (
                              <Badge 
                                key={i} 
                                className="border"
                                style={{
                                  backgroundColor: 'rgba(165, 243, 252, 1)',
                                  color: '#164e63',
                                  borderColor: 'rgba(6, 182, 212, 0.25)'
                                }}
                              >
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
