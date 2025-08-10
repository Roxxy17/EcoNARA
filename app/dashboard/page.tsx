"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { RoleSelectionModal } from "@/components/modals/RoleSelectionModal";
import { Navbar } from "@/components/navigation/nav-dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import SplashScreen from "@/components/ui/splash-screen";

const quickActions = [
  {
    icon: ShoppingCart,
    title: "Food Rescue",
    description: "Donasikan atau ambil makanan berlebih di sekitar Anda",
    href: "/food-rescue",
    gradient: "from-blue-800 via-cyan-600 to-teal-400",
    points: "+20 poin",
    glow: "shadow-blue-500/25",
  },
  {
    icon: Recycle,
    title: "Circular Market",
    description: "Jual/beli produk hasil daur ulang pangan",
    href: "/circular-market",
    gradient: "from-blue-800 via-cyan-600 to-teal-400",
    points: "+15 poin",
    glow: "shadow-blue-500/25",
  },
  {
    icon: Users,
    title: "Community Share",
    description: "Kolaborasi distribusi pangan bersama komunitas",
    href: "/community-share",
    gradient: "from-blue-800 via-cyan-600 to-teal-400",
    points: "+10 poin",
    glow: "shadow-blue-500/25",
  },
  {
    icon: BookOpen,
    title: "Eco Edu",
    description: "Belajar mengurangi food waste & ekonomi sirkular",
    href: "/education",
    gradient: "from-blue-800 via-cyan-600 to-teal-400",
    points: "+5 poin",
    glow: "shadow-blue-500/25",
  },
  {
    icon: Camera,
    title: "AI Food Scan",
    description: "Scan makanan sisa & dapatkan rekomendasi AI",
    href: "/ai-scan",
    gradient: "from-blue-800 via-cyan-600 to-teal-400",
    points: "+10 poin",
    glow: "shadow-blue-500/25",
  },
  {
    icon: Heart,
    title: "Food Donation",
    description: "Donasi makanan ke yang membutuhkan",
    href: "/donations",
    gradient: "from-blue-800 via-cyan-600 to-teal-400",
    points: "+25 poin",
    glow: "shadow-blue-500/25",
  },
];

const habitData = [
  {
    name: "Kurangi Sisa Makanan",
    progress: 80,
    points: 110,
    target: 150,
    icon: "🍽️",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Donasi Pangan",
    progress: 65,
    points: 90,
    target: 130,
    icon: "🥗",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Daur Ulang Organik",
    progress: 55,
    points: 70,
    target: 120,
    icon: "♻️",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Belanja Sirkular",
    progress: 75,
    points: 120,
    target: 160,
    icon: "🛒",
    color: "from-blue-500 to-cyan-400",
  },
  {
    name: "Edukasi Pangan",
    progress: 50,
    points: 60,
    target: 100,
    icon: "📚",
    color: "from-blue-500 to-cyan-400",
  },
];

const communityStats = [
  {
    label: "Kg Makanan Diselamatkan",
    value: "2,350",
    change: "+120",
    icon: ShoppingCart,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    label: "Penerima Manfaat",
    value: "1,800",
    change: "+75",
    icon: Users,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    label: "Transaksi Sirkular",
    value: "950",
    change: "+40",
    icon: Recycle,
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    label: "Komunitas Aktif",
    value: "320",
    change: "+15",
    icon: Users,
    gradient: "from-blue-500 to-cyan-400",
  },
];

const recentActivities = [
  {
    action: "Donasi makanan berlebih",
    time: "2 jam lalu",
    points: "+20",
    type: "donation",
    icon: "🥗",
  },
  {
    action: "Ambil makanan dari food rescue",
    time: "1 hari lalu",
    points: "+15",
    type: "rescue",
    icon: "🍞",
  },
  {
    action: "Jual produk daur ulang",
    time: "2 hari lalu",
    points: "+25",
    type: "circular",
    icon: "♻️",
  },
  {
    action: "Edukasi pangan di sekolah",
    time: "3 hari lalu",
    points: "+10",
    type: "education",
    icon: "📚",
  },
  {
    action: "Scan makanan sisa",
    time: "4 hari lalu",
    points: "+10",
    type: "ai",
    icon: "🤖",
  },
];

export default function DashboardPage() {
  const { userProfile, loadingUser } = useUser();
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loadingUser) {
      if (userProfile && userProfile.is_role_confirmed === false) {
        setShowRoleModal(true);
      } else {
        setShowRoleModal(false);
      }
    }
  }, [userProfile, loadingUser]);

  const [userStats, setUserStats] = useState({
    totalPoints: 445,
    rank: 12,
    foodSaved: 320,
    wasteReduced: 8.2,
    level: "Eco Champion",
    nextLevelPoints: 555,
    streak: 7,
  });

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Distribusi pangan sukses di RW 02",
      type: "info",
      time: "5 menit lalu",
      icon: "🥗",
    },
    {
      id: 2,
      message: "Target food rescue mingguan hampir tercapai!",
      type: "success",
      time: "1 jam lalu",
      icon: "🎯",
    },
    {
      id: 3,
      message: "Stok donasi pangan menipis, ayo kontribusi!",
      type: "warning",
      time: "3 jam lalu",
      icon: "⚠️",
    },
  ]);

  if (!mounted) {
    return <SplashScreen forceTheme="ocean" />;
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ecfeff 0%, #eff6ff 50%, #f0fdfa 100%)",
        color: "#164e63",
      }}
    >
      {/* Ocean Background Effects - dengan inline styles */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(59, 130, 246, 0.4))",
          }}
        />
        <div
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "linear-gradient(135deg, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.4))",
            animationDelay: "1s",
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4))",
            animationDelay: "2s",
          }}
        />
      </div>

      <Navbar />
      <RoleSelectionModal isOpen={showRoleModal} />

      {/* Enhanced Header - dengan inline styles */}
      <header
        className="backdrop-blur-xl border-b sticky top-[72px] z-40 shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderColor: "rgba(59, 130, 246, 0.1)",
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #3b82f6, #06b6d4, #14b8a6)",
                }}
              >
                <Recycle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1
                  className="text-2xl font-bold bg-clip-text text-transparent"
                  style={{
                    background:
                      "linear-gradient(90deg, #2563eb, #06b6d4, #14b8a6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Selamat datang, {userProfile?.nama || "Eco Hero"}!
                </h1>
                <p
                  className="text-sm flex items-center"
                  style={{ color: "rgba(59, 130, 246, 0.8)" }}
                >
                  <MapPin className="w-4 h-4 mr-1" />
                  Komunitas Pangan Berkelanjutan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge
                className="text-white shadow-lg"
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                }}
              >
                <Award className="w-3 h-3 mr-1" />
                {userStats.level}
              </Badge>
              <Badge
                className="backdrop-blur-sm border-0"
                style={{
                  backgroundColor: "rgba(165, 243, 252, 0.8)",
                  color: "#164e63",
                }}
              >
                Rank #{userStats.rank}
              </Badge>
              <Badge
                className="backdrop-blur-sm border-0"
                style={{
                  backgroundColor: "rgba(219, 234, 254, 0.8)",
                  color: "#1e40af",
                }}
              >
                ♻️ {userStats.streak} hari
              </Badge>
            </div>
          </div>

          {/* Enhanced Progress Bar */}
          <div
            className="mt-6 backdrop-blur-sm rounded-2xl p-4 border shadow-lg"
            style={{
              background:
                "linear-gradient(90deg, rgba(165, 243, 252, 0.8), rgba(219, 234, 254, 0.8))",
              borderColor: "rgba(6, 182, 212, 0.1)",
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <span
                className="text-sm font-semibold flex items-center"
                style={{ color: "#0e7490" }}
              >
                <Target className="w-4 h-4 mr-2" />
                Progress ke Level EcoNARA Expert
              </span>
              <span
                className="text-sm font-medium"
                style={{ color: "#0891b2" }}
              >
                {userStats.totalPoints}/{userStats.nextLevelPoints} poin
              </span>
            </div>
            <div className="relative">
              <Progress
                value={(userStats.totalPoints / userStats.nextLevelPoints) * 100
                }
                className="h-3 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(6, 182, 212, 0.2)" }}
              />
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(6, 182, 212, 0.2), rgba(59, 130, 246, 0.2))",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards - dengan inline styles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1e40af, #06b6d4, #14b8a6)",
              }}
            >
              <CardContent className="p-6">
                <ShoppingCart className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {userStats.foodSaved}kg
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Pangan Diselamatkan
                </div>
                <div
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  +10kg minggu ini
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1e40af, #06b6d4, #14b8a6)",
              }}
            >
              <CardContent className="p-6">
                <Recycle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {userStats.wasteReduced}kg
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Sampah Organik Didaur Ulang
                </div>
                <div
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  +1.5kg minggu ini
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1e40af, #06b6d4, #14b8a6)",
              }}
            >
              <CardContent className="p-6">
                <Target className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {userStats.totalPoints}
                </div>
                <div className="text-sm opacity-90 font-medium">Eco Points</div>
                <div
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  +45 poin minggu ini
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #1d4ed8, #0891b2, #0d9488)",
              }}
            >
              <CardContent className="p-6">
                <Users className="w-10 h-10 mx-auto mb-3 drop-shadow-sm" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  #{userStats.rank}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Peringkat Komunitas
                </div>
                <div
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  Naik 2 posisi
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Quick Actions */}
            <Card
              className="border-0 shadow-xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle
                  className="flex items-center space-x-3"
                  style={{ color: "#164e63" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Aksi Cegah Food Waste</span>
                </CardTitle>
                <CardDescription style={{ color: "#0e7490" }}>
                  Aksi cepat untuk mengurangi food waste & membangun ekonomi
                  sirkular
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
                          className="cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 h-full group overflow-hidden relative rounded-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${action.gradient.includes(
                              "blue-800"
                            )
                              ? "#1e40af"
                              : "#3b82f6"}, #06b6d4, #14b8a6)`,
                          }}
                        >
                          <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent)",
                            }}
                          />
                          <CardContent className="p-5 text-center relative z-10">
                            <div
                              className="w-14 h-14 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              }}
                            >
                              <action.icon className="w-7 h-7 text-white drop-shadow-sm" />
                            </div>
                            <h3 className="font-bold text-white mb-2 text-sm drop-shadow-sm">
                              {action.title}
                            </h3>
                            <p className="text-xs text-white/90 mb-3 drop-shadow-sm">
                              {action.description}
                            </p>
                            <Badge
                              variant="secondary"
                              className="text-xs text-white backdrop-blur-sm border-0"
                              style={{
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                              }}
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
            <Card
              className="border-0 shadow-xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center space-x-3"
                  style={{ color: "#164e63" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                    }}
                  >
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Habit Tracker Pangan</span>
                </CardTitle>
                <CardDescription style={{ color: "#0e7490" }}>
                  Pantau kebiasaan baik Anda dalam mengurangi food waste &
                  berbagi pangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weekly" className="space-y-6">
                  <TabsList
                    className="grid w-full grid-cols-3 rounded-xl border"
                    style={{
                      backgroundColor: "rgba(165, 243, 252, 0.8)",
                      borderColor: "rgba(6, 182, 212, 0.2)",
                    }}
                  >
                    <TabsTrigger
                      value="weekly"
                      className="rounded-2xl data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
                      style={{ color: "#0e7490" }}
                    >
                      Mingguan
                    </TabsTrigger>
                    <TabsTrigger
                      value="monthly"
                      className="rounded-2xl data-[state=active]:bg-cyan-500 data-[state=active]:text-white transition-colors"
                      style={{ color: "#0e7490" }}
                    >
                      Bulanan
                    </TabsTrigger>
                    <TabsTrigger
                      value="yearly"
                      className="rounded-2xl data-[state=active]:bg-teal-500 data-[state=active]:text-white transition-colors"
                      style={{ color: "#0e7490" }}
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
                        className="space-y-4 p-5 rounded-2xl border hover:shadow-lg transition-all duration-300"
                        style={{
                          backgroundColor: "#ecfeff",
                          borderColor: "rgba(6, 182, 212, 0.1)",
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl bg-white rounded-xl p-2 shadow-sm">
                              {habit.icon}
                            </div>
                            <span
                              className="font-semibold"
                              style={{ color: "#164e63" }}
                            >
                              {habit.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge
                              variant="secondary"
                              className="border-0"
                              style={{
                                backgroundColor: "rgba(165, 243, 252, 1)",
                                color: "#164e63",
                              }}
                            >
                              +{habit.points} poin
                            </Badge>
                            <span
                              className="text-sm font-medium"
                              style={{ color: "#0e7490" }}
                            >
                              {habit.points}/{habit.target}
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <Progress
                            value={habit.progress}
                            className="h-4 rounded-full overflow-hidden"
                            style={{ backgroundColor: "rgba(6, 182, 212, 0.2)" }}
                          />
                          <div
                            className="absolute inset-0 rounded-full animate-pulse"
                            style={{
                              background: `linear-gradient(90deg, ${
                                habit.color.includes("blue-500")
                                  ? "#3b82f6"
                                  : "#06b6d4"
                              }, #06b6d4)`,
                              opacity: 0.2,
                            }}
                          />
                        </div>
                        <div
                          className="flex justify-between text-sm"
                          style={{ color: "#0e7490" }}
                        >
                          <span className="font-medium">
                            {habit.progress}% tercapai
                          </span>
                          <span>
                            {habit.target - habit.points} poin lagi ke target
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Enhanced Community Impact */}
            <Card
              className="border-0 shadow-xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center space-x-3"
                  style={{ color: "#164e63" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                    }}
                  >
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">Dampak Komunitas</span>
                </CardTitle>
                <CardDescription style={{ color: "#0e7490" }}>
                  Dampak kolektif komunitas dalam distribusi pangan & ekonomi
                  sirkular
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
                      className="text-center p-6 backdrop-blur-sm rounded-2xl border hover:shadow-lg transition-all duration-300 group"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(165, 243, 252, 0.8), rgba(219, 234, 254, 0.8))",
                        borderColor: "rgba(6, 182, 212, 0.1)",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${
                            stat.gradient.includes("blue-500")
                              ? "#3b82f6"
                              : "#06b6d4"
                          }, #06b6d4)`,
                        }}
                      >
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div
                        className="text-3xl font-bold mb-1"
                        style={{ color: "#164e63" }}
                      >
                        {stat.value}
                      </div>
                      <div
                        className="text-sm mb-2 font-medium"
                        style={{ color: "#0e7490" }}
                      >
                        {stat.label}
                      </div>
                      <Badge
                        className="text-xs border-0"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(165, 243, 252, 1), rgba(219, 234, 254, 1))",
                          color: "#164e63",
                        }}
                      >
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
            <Card
              className="border-0 shadow-xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center space-x-3"
                  style={{ color: "#164e63" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    }}
                  >
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
                    className={`p-4 rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md`}
                    style={{
                      background:
                        notification.type === "success"
                          ? "linear-gradient(90deg, rgba(165, 243, 252, 0.8), rgba(219, 234, 254, 0.8))"
                          : notification.type === "warning"
                          ? "linear-gradient(90deg, rgba(240, 253, 250, 0.8), rgba(165, 243, 252, 0.8))"
                          : "linear-gradient(90deg, rgba(219, 234, 254, 0.8), rgba(165, 243, 252, 0.8))",
                      borderLeftColor:
                        notification.type === "success"
                          ? "#06b6d4"
                          : notification.type === "warning"
                          ? "#14b8a6"
                          : "#3b82f6",
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{notification.icon}</span>
                      <div className="flex-1">
                        <div
                          className="text-sm font-semibold"
                          style={{ color: "#164e63" }}
                        >
                          {notification.message}
                        </div>
                        <div
                          className="text-xs mt-1"
                          style={{ color: "#0e7490" }}
                        >
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(165, 243, 252, 1), rgba(219, 234, 254, 1))",
                    color: "#164e63",
                    borderColor: "rgba(6, 182, 212, 0.2)",
                  }}
                >
                  Lihat Semua Update
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Leaderboard */}
            <Card
              className="border-0 shadow-xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center space-x-3"
                  style={{ color: "#164e63" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #14b8a6, #06b6d4)",
                    }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold">
                    Leaderboard Eco Champions
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    name: "Marina Sari",
                    points: 520,
                    rank: 1,
                    avatar: "🥗",
                    badge: "Eco Master",
                  },
                  {
                    name: "Pak Bahari",
                    points: 485,
                    rank: 2,
                    avatar: "♻️",
                    badge: "Circular Hero",
                  },
                  {
                    name: "Bu Coral",
                    points: 460,
                    rank: 3,
                    avatar: "🍽️",
                    badge: "Food Saver",
                  },
                  {
                    name: "Anda",
                    points: 445,
                    rank: 4,
                    avatar: "🛒",
                    badge: "Eco Champion",
                  },
                  {
                    name: "Pak Tani",
                    points: 420,
                    rank: 5,
                    avatar: "🌾",
                    badge: "Green Contributor",
                  },
                ].map((user, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 hover:shadow-md ${
                      user.name.includes("Anda") ? "border shadow-md" : ""
                    }`}
                    style={{
                      background: user.name.includes("Anda")
                        ? "linear-gradient(90deg, rgba(219, 234, 254, 0.8), rgba(165, 243, 252, 0.8))"
                        : "linear-gradient(90deg, rgba(165, 243, 252, 0.6), rgba(219, 234, 254, 0.6))",
                      borderColor: user.name.includes("Anda")
                        ? "rgba(59, 130, 246, 0.2)"
                        : "transparent",
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg text-white`}
                        style={{
                          background:
                            user.rank === 1
                              ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                              : user.rank === 2
                              ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                              : user.rank === 3
                              ? "linear-gradient(135deg, #fbbf24, #f97316)"
                              : "linear-gradient(135deg, #3b82f6, #06b6d4)",
                        }}
                      >
                        {user.rank}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{user.avatar}</span>
                        <div>
                          <span className="font-semibold" style={{ color: "#164e63" }}>
                            {user.name}
                          </span>
                          <div className="text-xs" style={{ color: "#0e7490" }}>
                            {user.badge}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: "#164e63" }}>
                        {user.points}
                      </div>
                      <div className="text-xs" style={{ color: "#0e7490" }}>
                        eco points
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Enhanced Recent Activities */}
            <Card
              className="border-0 shadow-xl backdrop-blur-xl"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderColor: "rgba(6, 182, 212, 0.1)",
              }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center space-x-3"
                  style={{ color: "#164e63" }}
                >
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #14b8a6)",
                    }}
                  >
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
                    className="flex justify-between items-center p-4 rounded-2xl transition-all duration-300 hover:shadow-md group"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(165, 243, 252, 0.6), rgba(219, 234, 254, 0.6))",
                    }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl bg-white/80 rounded-xl p-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                        {activity.icon}
                      </div>
                      <div>
                        <div
                          className="font-semibold text-sm"
                          style={{ color: "#164e63" }}
                        >
                          {activity.action}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "#0e7490" }}
                        >
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <Badge
                      className="text-xs border-0 shadow-sm"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(219, 234, 254, 1), rgba(165, 243, 252, 1))",
                        color: "#164e63",
                      }}
                    >
                      {activity.points}
                    </Badge>
                  </motion.div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full rounded-xl"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(219, 234, 254, 1), rgba(165, 243, 252, 1))",
                    color: "#1e40af",
                    borderColor: "rgba(59, 130, 246, 0.2)",
                  }}
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
  );
}
