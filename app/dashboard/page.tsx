"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"
import { RoleSelectionModal } from "@/components/modals/RoleSelectionModal"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
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
  Waves,
  Fish,
  Droplets,
} from "lucide-react"
import SplashScreen from "@/components/ui/splash-screen"

const quickActions = [
  {
    icon: ShoppingCart,
    title: "Food Rescue",
    description: "Donasikan atau ambil makanan berlebih di sekitar Anda",
    href: "/food-rescue",
    gradient: "from-green-400 via-lime-500 to-emerald-500",
    points: "+20 poin",
    glow: "shadow-green-500/25",
  },
  {
    icon: Recycle,
    title: "Circular Market",
    description: "Jual/beli produk hasil daur ulang pangan",
    href: "/circular-market",
    gradient: "from-emerald-400 via-green-500 to-lime-500",
    points: "+15 poin",
    glow: "shadow-emerald-500/25",
  },
  {
    icon: Users,
    title: "Community Share",
    description: "Kolaborasi distribusi pangan bersama komunitas",
    href: "/community-share",
    gradient: "from-lime-400 via-green-400 to-emerald-400",
    points: "+10 poin",
    glow: "shadow-lime-400/25",
  },
  {
    icon: BookOpen,
    title: "Eco Edu",
    description: "Belajar mengurangi food waste & ekonomi sirkular",
    href: "/education",
    gradient: "from-green-400 via-emerald-500 to-lime-500",
    points: "+5 poin",
    glow: "shadow-green-400/25",
  },
  {
    icon: Camera,
    title: "AI Food Scan",
    description: "Scan makanan sisa & dapatkan rekomendasi AI",
    href: "/ai-scan",
    gradient: "from-lime-500 via-green-400 to-emerald-500",
    points: "+10 poin",
    glow: "shadow-lime-500/25",
  },
  {
    icon: Heart,
    title: "Food Donation",
    description: "Donasi makanan ke yang membutuhkan",
    href: "/donations",
    gradient: "from-emerald-400 via-green-500 to-lime-500",
    points: "+25 poin",
    glow: "shadow-emerald-400/25",
  },
]

const habitData = [
  { name: "Kurangi Sisa Makanan", progress: 80, points: 110, target: 150, icon: "🍽️", color: "from-green-400 to-lime-500" },
  { name: "Donasi Pangan", progress: 65, points: 90, target: 130, icon: "🥗", color: "from-emerald-400 to-green-500" },
  { name: "Daur Ulang Organik", progress: 55, points: 70, target: 120, icon: "♻️", color: "from-lime-400 to-green-500" },
  { name: "Belanja Sirkular", progress: 75, points: 120, target: 160, icon: "🛒", color: "from-green-500 to-emerald-400" },
  { name: "Edukasi Pangan", progress: 50, points: 60, target: 100, icon: "📚", color: "from-emerald-500 to-lime-400" },
]

const recentActivities = [
  { action: "Donasi makanan berlebih", time: "2 jam lalu", points: "+20", type: "donation", icon: "🥗" },
  { action: "Ambil makanan dari food rescue", time: "1 hari lalu", points: "+15", type: "rescue", icon: "🍞" },
  { action: "Jual produk daur ulang", time: "2 hari lalu", points: "+25", type: "circular", icon: "♻️" },
  { action: "Ikut edukasi food waste", time: "3 hari lalu", points: "+10", type: "education", icon: "📚" },
  { action: "Kolaborasi distribusi pangan", time: "1 minggu lalu", points: "+18", type: "community", icon: "🤝" },
]

const communityStats = [
  { label: "Kg Makanan Diselamatkan", value: "2,350", change: "+120", icon: ShoppingCart, gradient: "from-green-400 to-lime-500" },
  { label: "Penerima Manfaat", value: "1,800", change: "+75", icon: Users, gradient: "from-emerald-400 to-green-500" },
  { label: "Transaksi Sirkular", value: "950", change: "+40", icon: Recycle, gradient: "from-lime-400 to-green-500" },
  { label: "Komunitas Aktif", value: "320", change: "+15", icon: Users, gradient: "from-green-500 to-emerald-400" },
]

export default function DashboardPage() {
  const { userProfile, loadingUser } = useUser()
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loadingUser) {
      if (userProfile && userProfile.is_role_confirmed === false) {
        setShowRoleModal(true)
      } else {
        setShowRoleModal(false)
      }
    }
  }, [userProfile, loadingUser])

  const [userStats, setUserStats] = useState({
    totalPoints: 445,
    rank: 12,
    foodSaved: 320,
    wasteReduced: 8.2,
    level: "Eco Champion",
    nextLevelPoints: 555,
    streak: 7,
  })

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Distribusi pangan sukses di RW 02", type: "info", time: "5 menit lalu", icon: "🥗" },
    { id: 2, message: "Target food rescue mingguan hampir tercapai!", type: "success", time: "1 jam lalu", icon: "🎯" },
    { id: 3, message: "Stok donasi pangan menipis, ayo kontribusi!", type: "warning", time: "3 jam lalu", icon: "⚠️" },
  ])

  if (!mounted) {
    return <SplashScreen forceTheme="ocean" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Ocean Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />
      <RoleSelectionModal isOpen={showRoleModal} />

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-green-100/50 sticky top-[72px] z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-lime-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25">
                <Recycle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-lime-600 to-emerald-600 bg-clip-text text-transparent">
                  Selamat datang, {userProfile?.nama || "Eco Hero"}!
                </h1>
                <p className="text-sm text-green-700/80 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Komunitas Pangan Berkelanjutan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-green-400 to-lime-500 text-white shadow-lg">
                <Award className="w-3 h-3 mr-1" />
                {userStats.level}
              </Badge>
              <Badge className="bg-lime-100/80 text-lime-800 backdrop-blur-sm">Rank #{userStats.rank}</Badge>
              <Badge className="bg-green-100/80 text-green-800 backdrop-blur-sm">♻️ {userStats.streak} hari</Badge>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div className="mt-6 bg-gradient-to-r from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-4 border border-cyan-100/50 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-cyan-700 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Progress ke Level EcoNARA Expert
              </span>
              <span className="text-sm text-cyan-600 font-medium">
                {userStats.totalPoints}/{userStats.nextLevelPoints} poin
              </span>
            </div>
            <div className="relative">
              <Progress
                value={(userStats.totalPoints / userStats.nextLevelPoints) * 100}
                className="h-3 bg-cyan-200/50 rounded-full overflow-hidden"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center bg-gradient-to-br from-green-400 via-lime-500 to-emerald-500 text-white border-0 shadow-xl shadow-green-500/25 hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <ShoppingCart className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">{userStats.foodSaved}kg</div>
                <div className="text-sm opacity-90 font-medium">Pangan Diselamatkan</div>
                <div className="text-xs opacity-75 mt-2 bg-white/20 rounded-full px-2 py-1">+10kg minggu ini</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center bg-gradient-to-br from-blue-500 via-teal-500 to-cyan-500 text-white border-0 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Recycle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">{userStats.wasteReduced}kg</div>
                <div className="text-sm opacity-90 font-medium">Sampah Organik Didaur Ulang</div>
                <div className="text-xs opacity-75 mt-2 bg-white/20 rounded-full px-2 py-1">+1.5kg minggu ini</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="text-center bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 text-white border-0 shadow-xl shadow-teal-500/25 hover:shadow-2xl hover:shadow-teal-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Target className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">{userStats.totalPoints}</div>
                <div className="text-sm opacity-90 font-medium">Eco Points</div>
                <div className="text-xs opacity-75 mt-2 bg-white/20 rounded-full px-2 py-1">+45 poin minggu ini</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="text-center bg-gradient-to-br from-cyan-300 via-blue-200 to-teal-200 text-cyan-900 border-0 shadow-xl shadow-cyan-300/25 hover:shadow-2xl hover:shadow-cyan-300/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Users className="w-10 h-10 mx-auto mb-3 text-cyan-700 drop-shadow-sm" />
                <div className="text-3xl font-bold drop-shadow-sm">#{userStats.rank}</div>
                <div className="text-sm opacity-90 font-medium">Peringkat Komunitas</div>
                <div className="text-xs opacity-75 mt-2 bg-cyan-500/20 rounded-full px-2 py-1">Naik 2 posisi</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Aksi Cegah Food Waste</span>
                </CardTitle>
                <CardDescription className="text-cyan-700">
                  Aksi cepat untuk mengurangi food waste & membangun ekonomi sirkular
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href={action.href}>
                        <Card
                          className={`cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${action.gradient} h-full group overflow-hidden relative rounded-2xl`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <CardContent className="p-5 text-center relative z-10">
                            <div
                              className={`w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${action.glow} group-hover:shadow-2xl transition-all duration-300`}
                            >
                              <action.icon className="w-7 h-7 text-white drop-shadow-sm" />
                            </div>
                            <h3 className="font-bold text-white mb-2 text-sm drop-shadow-sm">{action.title}</h3>
                            <p className="text-xs text-white/90 mb-3 drop-shadow-sm">{action.description}</p>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-white/20 text-white backdrop-blur-sm border-0"
                            >
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
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Habit Tracker Pangan</span>
                </CardTitle>
                <CardDescription className="text-cyan-700">
                  Pantau kebiasaan baik Anda dalam mengurangi food waste & berbagi pangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-cyan-100/80 rounded-xl border border-cyan-200">
                    <TabsTrigger
                      value="weekly"
                      className="rounded-2xl data-[state=active]:bg-green-500 data-[state=active]:text-white text-cyan-700 transition-colors "
                    >
                      Mingguan
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      className="rounded-2xl data-[state=active]:bg-lime-500 data-[state=active]:text-white text-cyan-700 transition-colors"
                    >
                      Bulanan
                    </TabsTrigger>
                    <TabsTrigger
                      value="yearly"
                      className="rounded-2xl data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-cyan-700 transition-colors"
                    >
                      Tahunan
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="weekly" className="space-y-4">
                    {habitData.map((habit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="space-y-4 p-5 bg-cyan-50 rounded-2xl border border-cyan-100 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl bg-white rounded-xl p-2 shadow-sm">{habit.icon}</div>
                            <span className="font-semibold text-cyan-900">{habit.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant="secondary"
                              className="bg-cyan-100 text-cyan-800 border-0"
                            >
                              +{habit.points} poin
                            </Badge>
                            <span className="text-sm text-cyan-700 font-medium">
                              {habit.points}/{habit.target}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress
                            value={habit.progress}
                            className="h-4 bg-cyan-200 rounded-full overflow-hidden"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${habit.color} opacity-20 rounded-full animate-pulse`}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-cyan-700">
                          <span className="font-medium">{habit.progress}% tercapai</span>
                          <span>{habit.target - habit.points} poin lagi ke target</span>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Enhanced Community Impact */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Dampak Komunitas</span>
                </CardTitle>
                <CardDescription className="text-cyan-700">
                  Dampak kolektif komunitas dalam distribusi pangan & ekonomi sirkular
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  {communityStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-center p-6 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl border border-cyan-100/50 hover:shadow-lg transition-all duration-300 group"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-cyan-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-cyan-700 mb-2 font-medium">{stat.label}</div>
                      <Badge className="bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-800 text-xs border-0">
                        {stat.change} bulan ini
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Notifications */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    <Droplets className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">Info & Notifikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md ${
                      notification.type === "success"
                        ? "bg-gradient-to-r from-cyan-50/80 to-blue-50/80 border-cyan-400"
                        : notification.type === "warning"
                          ? "bg-gradient-to-r from-teal-50/80 to-cyan-50/80 border-teal-400"
                          : "bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-400"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{notification.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-cyan-900">{notification.message}</div>
                        <div className="text-xs text-cyan-700 mt-1">{notification.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900 border-cyan-200 hover:from-cyan-100 hover:to-blue-100 rounded-xl"
                >
                  Lihat Semua Update
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Leaderboard */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">Leaderboard Eco Champions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Marina Sari", points: 520, rank: 1, avatar: "🥗", badge: "Eco Master" },
                  { name: "Pak Bahari", points: 485, rank: 2, avatar: "♻️", badge: "Circular Hero" },
                  { name: "Bu Coral", points: 460, rank: 3, avatar: "🍽️", badge: "Food Saver" },
                  { name: "Anda", points: 445, rank: 4, avatar: "🛒", badge: "Eco Champion" },
                  { name: "Pak Tani", points: 420, rank: 5, avatar: "🌾", badge: "Green Contributor" },
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:shadow-md ${
                      user.name.includes("Anda")
                        ? "bg-gradient-to-r from-green-100/80 to-lime-100/80 border border-green-200 shadow-md"
                        : "bg-gradient-to-r from-cyan-50/60 to-blue-50/60 hover:from-cyan-50/80 hover:to-blue-50/80"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg ${
                          user.rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-orange-400 text-white"
                            : user.rank === 2
                              ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                              : user.rank === 3
                                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                : "bg-gradient-to-br from-green-400 to-lime-500 text-white"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <span className="font-semibold text-cyan-900">{user.name}</span>
                          <div className="text-xs text-cyan-700">{user.badge}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-cyan-900">{user.points}</div>
                      <div className="text-xs text-cyan-700">eco points</div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Recent Activities */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">Aktivitas Terbaru</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-cyan-50/60 to-blue-50/60 hover:from-cyan-50/80 hover:to-blue-50/80 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl bg-white/80 rounded-xl p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                        {activity.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-cyan-900">{activity.action}</div>
                        <div className="text-xs text-cyan-700">{activity.time}</div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-green-100 to-lime-100 text-cyan-800 text-xs border-0 shadow-sm">
                      {activity.points}
                    </Badge>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-50 to-lime-50 text-green-900 border-green-200 hover:from-green-100 hover:to-lime-100 rounded-xl"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Lihat Riwayat Eco Tracker
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
