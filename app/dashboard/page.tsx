"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Leaf,
  Wheat,
  Recycle,
  Heart,
  MapPin,
  TrendingUp,
  Award,
  Camera,
  Sparkles,
  Users,
  Target,
  ShoppingCart,
  BookOpen,
  Calendar,
  Activity,
  Globe,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard" // Mengimpor komponen Navbar

const quickActions = [
  {
    icon: Camera,
    title: "Scan Sampah",
    description: "Klasifikasi sampah dengan AI",
    href: "/trash-classifier",
    color: "bg-purple-500",
    points: "+15 poin",
  },
  {
    icon: Sparkles,
    title: "Food Rescue",
    description: "Resep dari bahan sisa",
    href: "/food-rescue",
    color: "bg-blue-500",
    points: "+25 poin",
  },
  {
    icon: Heart,
    title: "Smart Donation",
    description: "Donasi atau cari bantuan",
    href: "/donations",
    color: "bg-pink-500",
    points: "+30 poin",
  },
  {
    icon: MapPin,
    title: "Peta Bantuan",
    description: "Lokasi drop-off terdekat",
    href: "/map",
    color: "bg-red-500",
    points: "+10 poin",
  },
  {
    icon: ShoppingCart,
    title: "Pasar Komunitas",
    description: "Jual/beli hasil panen",
    href: "/marketplace",
    color: "bg-green-500",
    points: "+20 poin",
  },
  {
    icon: BookOpen,
    title: "Edukasi",
    description: "Konten pembelajaran",
    href: "/education",
    color: "bg-yellow-500",
    points: "+5 poin",
  },
]

const habitData = [
  { name: "Hemat Air", progress: 85, points: 120, target: 150, icon: "💧" },
  { name: "Kurangi Plastik", progress: 70, points: 95, target: 130, icon: "🚫" },
  { name: "Kompos Organik", progress: 60, points: 80, target: 120, icon: "🌱" },
  { name: "Hemat Listrik", progress: 90, points: 150, target: 160, icon: "⚡" },
  { name: "Transport Hijau", progress: 45, points: 60, target: 100, icon: "🚲" },
]

const recentActivities = [
  { action: "Scan sampah plastik", time: "2 jam lalu", points: "+15", type: "recycle" },
  { action: "Resep dari bahan sisa", time: "1 hari lalu", points: "+25", type: "food" },
  { action: "Donasi pakaian bekas", time: "2 hari lalu", points: "+30", type: "donation" },
  { action: "Beli sayur di pasar komunitas", time: "3 hari lalu", points: "+20", type: "marketplace" },
  { action: "Selesai modul edukasi kompos", time: "1 minggu lalu", points: "+10", type: "education" },
]

const communityStats = [
  { label: "RT Aktif", value: "127", change: "+12", icon: MapPin },
  { label: "Keluarga Terdaftar", value: "2,450", change: "+89", icon: Users },
  { label: "Kg Sampah Didaur Ulang", value: "8,500", change: "+340", icon: Recycle },
  { label: "Kg Makanan Diselamatkan", value: "1,250", change: "+67", icon: Wheat },
]

export default function DashboardPage() {
  const [userStats, setUserStats] = useState({
    totalPoints: 445,
    rank: 12,
    foodSaved: 15.5,
    wasteReduced: 8.2,
    level: "Eco Warrior",
    nextLevelPoints: 555,
    streak: 7,
  })

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Ada donasi baru di RT 05", type: "info", time: "5 menit lalu" },
    { id: 2, message: "Target mingguan hampir tercapai!", type: "success", time: "1 jam lalu" },
    { id: 3, message: "Stok beras RT 04 menipis", type: "warning", time: "3 jam lalu" },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar /> {/* Menggunakan komponen Navbar */}
      
      {/* Enhanced Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b sticky top-[56px] z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Selamat datang, Budi!</h1>
                <p className="text-sm text-gray-600">RT 05, Kelurahan Maju Bersama</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                  <Award className="w-3 h-3 mr-1" />
                  {userStats.level}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">Rank #{userStats.rank}</Badge>
                <Badge className="bg-orange-100 text-orange-800">🔥 {userStats.streak} hari</Badge>
              </div>

              {/* Tombol Bell dan Settings dipindahkan ke komponen Navbar */}
            </div>
          </div>

          {/* Progress to Next Level */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress ke Level Berikutnya</span>
              <span className="text-sm text-gray-600">
                {userStats.totalPoints}/{userStats.nextLevelPoints} poin
              </span>
            </div>
            <Progress value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} className="h-2" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <Wheat className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.foodSaved}kg</div>
                <div className="text-sm opacity-90">Makanan Diselamatkan</div>
                <div className="text-xs opacity-75 mt-1">+2.3kg minggu ini</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <Recycle className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.wasteReduced}kg</div>
                <div className="text-sm opacity-90">Sampah Didaur Ulang</div>
                <div className="text-xs opacity-75 mt-1">+1.5kg minggu ini</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <Target className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                <div className="text-sm opacity-90">Total Poin</div>
                <div className="text-xs opacity-75 mt-1">+45 poin minggu ini</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="text-center bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
              <CardContent className="p-4">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <div className="text-2xl font-bold">#{userStats.rank}</div>
                <div className="text-sm opacity-90">Peringkat RT</div>
                <div className="text-xs opacity-75 mt-1">Naik 2 posisi</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span>Aksi Cepat</span>
                </CardTitle>
                <CardDescription>Fitur yang sering digunakan untuk aktivitas harian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={action.href}>
                        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 h-full">
                          <CardContent className="p-4 text-center">
                            <div
                              className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                            >
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1 text-sm">{action.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">{action.description}</p>
                            <Badge variant="secondary" className="text-xs">
                              {action.points}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Habit Tracker */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-500" />
                  <span>Eco Habit Tracker</span>
                </CardTitle>
                <CardDescription>Progress kebiasaan ramah lingkungan minggu ini</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weekly">Mingguan</TabsTrigger>
                    <TabsTrigger value="monthly">Bulanan</TabsTrigger>
                    <TabsTrigger value="yearly">Tahunan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weekly" className="space-y-4">
                    {habitData.map((habit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="space-y-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{habit.icon}</span>
                            <span className="font-medium text-gray-700">{habit.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">+{habit.points} poin</Badge>
                            <span className="text-sm text-gray-500">
                              {habit.points}/{habit.target}
                            </span>
                          </div>
                        </div>
                        <Progress value={habit.progress} className="h-3" />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{habit.progress}% tercapai</span>
                          <span>{habit.target - habit.points} poin lagi ke target</span>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Community Impact */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <span>Dampak Komunitas</span>
                </CardTitle>
                <CardDescription>Kontribusi kolektif komunitas ECONARA</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {communityStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border"
                    >
                      <stat.icon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                      <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                      <Badge className="bg-green-100 text-green-800 text-xs">{stat.change} bulan ini</Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-orange-500" /> {/* Menggunakan ikon Globe karena Bell sudah di navbar */}
                  <span>Notifikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-3 rounded-lg border-l-4 ${
                      notification.type === "success"
                        ? "bg-green-50 border-green-500"
                        : notification.type === "warning"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">{notification.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{notification.time}</div>
                  </motion.div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  Lihat Semua Notifikasi
                </Button>
              </CardContent>
            </Card>

            {/* Community Leaderboard */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <span>Leaderboard RT</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Siti Aminah", points: 520, rank: 1, avatar: "👩" },
                  { name: "Pak Joko", points: 485, rank: 2, avatar: "👨" },
                  { name: "Bu Rina", points: 460, rank: 3, avatar: "👩" },
                  { name: "Budi (Anda)", points: 445, rank: 4, avatar: "👤" },
                  { name: "Pak Andi", points: 420, rank: 5, avatar: "👨" },
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      user.name.includes("Anda")
                        ? "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1
                            ? "bg-yellow-500 text-white"
                            : user.rank === 2
                              ? "bg-gray-400 text-white"
                              : user.rank === 3
                                ? "bg-orange-500 text-white"
                                : "bg-blue-500 text-white"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{user.avatar}</span>
                        <span className="font-medium text-gray-700">{user.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-800">{user.points}</div>
                      <div className="text-xs text-gray-500">poin</div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <span>Aktivitas Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "food"
                            ? "bg-blue-500"
                            : activity.type === "recycle"
                              ? "bg-purple-500"
                              : activity.type === "donation"
                                ? "bg-pink-500"
                                : activity.type === "marketplace"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                        }`}
                      ></div>
                      <div>
                        <div className="font-medium text-sm text-gray-700">{activity.action}</div>
                        <div className="text-xs text-gray-500">{activity.time}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">{activity.points}</Badge>
                  </motion.div>
                ))}
                <Button variant="outline" size="sm" className="w-full bg-transparent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Lihat Riwayat Lengkap
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
