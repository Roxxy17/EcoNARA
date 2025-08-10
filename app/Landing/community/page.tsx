"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  MessageCircle,
  Award,
  Search,
  MapPin,
  Share2,
  Heart,
  ThumbsUp,
  Trophy,
  Sparkles,
  TrendingUp,
  Star,
  ArrowRight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import Link from "next/link";
import { useDevicePerformance } from "@/hooks/use-device-performance";
import { AdaptiveBackground } from "@/components/background/adaptive-background";
import { PerformanceIndicator } from "@/components/ui/performance-indicator";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Navbar } from "@/components/navigation/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import { Footer } from "@/components/sections/footer";

const communityEvents = [
  {
    id: 1,
    title: "Workshop Kompos Rumahan",
    description:
      "Belajar membuat kompos dari sampah organik rumah tangga bersama ahli pertanian.",
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
    description:
      "Pameran dan penjualan produk hasil daur ulang karya warga komunitas.",
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
    description:
      "Kegiatan bersih-bersih lingkungan dan pemilahan sampah di area komunitas.",
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
];

const discussions = [
  {
    id: 1,
    title: "Tips Mengurangi Food Waste di Rumah",
    author: "Ibu Maya",
    avatar: "/placeholder.svg?height=40&width=40&text=IM",
    content:
      "Sharing tips praktis untuk mengurangi pemborosan makanan di rumah tangga...",
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
    content:
      "Alhamdulillah panen sayuran hidroponik bulan ini sangat memuaskan. Ada yang mau belajar?",
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
    content:
      "Berbagi ide kreatif mengubah botol plastik bekas menjadi barang berguna...",
    likes: 31,
    replies: 15,
    timeAgo: "1 hari lalu",
    category: "diy",
    tags: ["DIY", "Plastik", "Kreatif"],
  },
];

const statsGraphData = [
  { name: "Jan", Event: 8, Diskusi: 15, Anggota: 10 },
  { name: "Feb", Event: 12, Diskusi: 20, Anggota: 18 },
  { name: "Mar", Event: 15, Diskusi: 25, Anggota: 22 },
  { name: "Apr", Event: 10, Diskusi: 18, Anggota: 14 },
  { name: "Mei", Event: 18, Diskusi: 30, Anggota: 20 },
  { name: "Jun", Event: 14, Diskusi: 22, Anggota: 16 },
];

const activityGraphData = [
  { name: "Jan", Aksi: 120, Donasi: 30 },
  { name: "Feb", Aksi: 150, Donasi: 45 },
  { name: "Mar", Aksi: 180, Donasi: 60 },
  { name: "Apr", Aksi: 140, Donasi: 38 },
  { name: "Mei", Aksi: 200, Donasi: 70 },
  { name: "Jun", Aksi: 170, Donasi: 55 },
];

// Data untuk grafik analisis sampah
const wasteAnalysisData = [
  { name: "Jan", Analisis: 20 },
  { name: "Feb", Analisis: 35 },
  { name: "Mar", Analisis: 50 },
  { name: "Apr", Analisis: 45 },
  { name: "Mei", Analisis: 70 },
  { name: "Jun", Analisis: 90 },
];

export default function CommunityPage() {
  const { performanceLevel, capabilities, isLoading } = useDevicePerformance();
  const { theme, setTheme } = useTheme();

  // Semua state dan effect di atas
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("events");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  // Setelah semua hooks, baru cek mounted
  if (!mounted) return null;

  const animationSettings = {
    duration:
      performanceLevel === "high"
        ? 0.6
        : performanceLevel === "medium"
        ? 0.8
        : 1.0,
    ease: performanceLevel === "high" ? [0.25, 0.1, 0.25, 1] : "easeOut",
  };

  const getThemeColors = (theme) => {
    switch (theme) {
      case "aurora":
        return {
          gradient: "from-green-400 via-blue-400 to-emerald-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
          buttonGradient:
            "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
          statColors: [
            "from-green-500 to-green-600",
            "from-blue-500 to-blue-600",
            "from-emerald-500 to-emerald-600",
            "from-teal-500 to-teal-600",
          ],
          accent: "text-green-400",
          accentBg: "bg-green-500/10",
        };
      case "night":
        return {
          gradient: "from-blue-600 via-indigo-400 to-cyan-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient:
            "from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600",
          statColors: [
            "from-blue-600 to-blue-700",
            "from-indigo-500 to-indigo-600",
            "from-cyan-500 to-cyan-600",
            "from-blue-500 to-blue-600",
          ],
          accent: "text-blue-400",
          accentBg: "bg-blue-500/10",
        };
      case "geometric":
        return {
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          buttonGradient:
            "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
          statColors: [
            "from-red-500 to-red-600",
            "from-orange-500 to-orange-600",
            "from-yellow-500 to-yellow-600",
            "from-pink-500 to-pink-600",
          ],
          accent: "text-red-400",
          accentBg: "bg-red-500/10",
        };
      case "nebula":
        return {
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          buttonGradient:
            "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
          statColors: [
            "from-purple-500 to-purple-600",
            "from-pink-500 to-pink-600",
            "from-violet-500 to-violet-600",
            "from-indigo-500 to-indigo-600",
          ],
          accent: "text-purple-400",
          accentBg: "bg-purple-500/10",
        };
      default:
        return {
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient:
            "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
          statColors: [
            "from-blue-500 to-blue-600",
            "from-cyan-500 to-cyan-600",
            "from-teal-500 to-teal-600",
            "from-green-500 to-green-600",
          ],
          accent: "text-blue-400",
          accentBg: "bg-blue-500/10",
        };
    }
  };

  const themeColors = getThemeColors(theme);

  const filteredEvents = communityEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ThemeProvider>
      <AnimatePresence mode="wait">
        <motion.div
          key="community-page"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen relative overflow-hidden"
        >
          <AdaptiveBackground
            performanceLevel={performanceLevel}
            variant={theme}
          />
          <PerformanceIndicator
            performanceLevel={performanceLevel}
            capabilities={capabilities}
            isLoading={isLoading}
          />
          <ThemeSelector
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
          />

          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Navbar
              performanceLevel="high"
              animationSettings={{ duration: 0.5, ease: "easeInOut" }}
              theme={theme}
            />

            {/* Enhanced Hero Section */}
            <section className="container mx-auto px-4 pt-20 pb-12 text-center">
              <motion.div
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <motion.div
                    className={`p-3 rounded-full ${themeColors.accentBg} border border-slate-700/50`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Sparkles className={`w-8 h-8 ${themeColors.accent}`} />
                  </motion.div>
                  <h1
                    className={`text-5xl md:text-6xl font-black bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    EcoNARA
                  </h1>
                </div>

                <motion.h2
                  className="text-2xl md:text-3xl font-bold text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Komunitas Peduli Lingkungan
                </motion.h2>

                <motion.p
                  className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Bergabunglah bersama{" "}
                  <span className={`font-semibold ${themeColors.accent}`}>
                    156+ anggota aktif
                  </span>{" "}
                  untuk berbagi, belajar, dan beraksi demi lingkungan yang lebih
                  baik. Temukan event, diskusi, dan pencapaian komunitas kami!
                </motion.p>

                <motion.div
                  className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>95% Partisipasi Aktif</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>Komunitas Terbaik 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>1000+ Aksi Positif</span>
                  </div>
                </motion.div>
              </motion.div>
            </section>

            {/* Enhanced Statistics Section */}
            <div className="container mx-auto px-4 pb-12">
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {[
                  {
                    icon: Users,
                    value: "156",
                    label: "Anggota Aktif",
                    color: themeColors.statColors[0],
                    trend: "+12%",
                  },
                  {
                    icon: Calendar,
                    value: "24",
                    label: "Event Bulan Ini",
                    color: themeColors.statColors[1],
                    trend: "+8%",
                  },
                  {
                    icon: MessageCircle,
                    value: "89",
                    label: "Diskusi Aktif",
                    color: themeColors.statColors[2],
                    trend: "+15%",
                  },
                  {
                    icon: Award,
                    value: "95%",
                    label: "Partisipasi",
                    color: themeColors.statColors[3],
                    trend: "+3%",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group"
                  >
                    <Card
                      className={`relative overflow-hidden bg-gradient-to-br ${stat.color} text-white border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl`}
                    >
                      <CardContent className="p-6 text-center relative">
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                        <div className="relative z-10">
                          <stat.icon className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                          <div className="text-3xl md:text-4xl font-black mb-1 tracking-tight">
                            {stat.value}
                          </div>
                          <div className="text-sm opacity-90 font-medium mb-2">
                            {stat.label}
                          </div>
                          <div className="text-xs bg-white/20 rounded-full px-2 py-1 inline-flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {stat.trend}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Charts Section */}
              <div className="mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Grafik Statistik Komunitas */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${themeColors.accentBg}`}
                          >
                            <Trophy
                              className={`w-6 h-6 ${themeColors.accent}`}
                            />
                          </div>
                          <span className="text-white font-bold text-xl md:text-2xl">
                            Statistik Komunitas
                          </span>
                          <div className="flex-1" />
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-base px-4 py-1 rounded-full">
                            6 Bulan Terakhir
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart
                            data={statsGraphData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="name"
                              stroke="#94a3b8"
                              fontSize={12}
                            />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                background: "rgba(15, 23, 42, 0.95)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                color: "#fff",
                                backdropFilter: "blur(12px)",
                              }}
                              labelStyle={{ color: "#fff", fontWeight: "600" }}
                            />
                            <Bar
                              dataKey="Event"
                              fill="#38bdf8"
                              radius={[8, 8, 0, 0]}
                            />
                            <Bar
                              dataKey="Diskusi"
                              fill="#a78bfa"
                              radius={[8, 8, 0, 0]}
                            />
                            <Bar
                              dataKey="Anggota"
                              fill="#34d399"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Grafik Aktivitas & Donasi */}
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${themeColors.accentBg}`}
                          >
                            <Heart
                              className={`w-6 h-6 ${themeColors.accent}`}
                            />
                          </div>
                          <span className="text-white font-bold text-xl md:text-2xl">
                            Aktivitas & Donasi
                          </span>
                          <div className="flex-1" />
                          <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 text-base px-4 py-1 rounded-full">
                            Trending
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <ResponsiveContainer width="100%" height={280}>
                          <BarChart
                            data={activityGraphData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          >
                            <XAxis
                              dataKey="name"
                              stroke="#94a3b8"
                              fontSize={12}
                            />
                            <YAxis stroke="#94a3b8" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                background: "rgba(15, 23, 42, 0.95)",
                                border: "1px solid rgba(71, 85, 105, 0.3)",
                                borderRadius: "12px",
                                color: "#fff",
                                backdropFilter: "blur(12px)",
                              }}
                              labelStyle={{ color: "#fff", fontWeight: "600" }}
                            />
                            <Bar
                              dataKey="Aksi"
                              fill="#f472b6"
                              radius={[8, 8, 0, 0]}
                            />
                            <Bar
                              dataKey="Donasi"
                              fill="#facc15"
                              radius={[8, 8, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Grafik Analisis Sampah (full width, sama dengan gabungan 2 kolom di atas) */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 w-full rounded-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${themeColors.accentBg}`}
                        >
                          <Sparkles
                            className={`w-6 h-6 ${themeColors.accent}`}
                          />
                        </div>
                        <span className="text-white font-bold text-xl md:text-2xl">
                          Analisis Sampah oleh Anggota
                        </span>
                        <div className="flex-1" />
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-base px-4 py-1 rounded-full">
                          Fitur Populer
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart
                          data={wasteAnalysisData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            stroke="#334155"
                            strokeDasharray="4 4"
                          />
                          <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                          />
                          <YAxis stroke="#94a3b8" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(15, 23, 42, 0.95)",
                              border: "1px solid rgba(71, 85, 105, 0.3)",
                              borderRadius: "12px",
                              color: "#fff",
                              backdropFilter: "blur(12px)",
                            }}
                            labelStyle={{ color: "#fff", fontWeight: "600" }}
                          />
                          <Line
                            type="monotone"
                            dataKey="Analisis"
                            stroke="#38bdf8"
                            strokeWidth={3}
                            dot={{
                              r: 6,
                              fill: "#fff",
                              stroke: "#38bdf8",
                              strokeWidth: 2,
                            }}
                            activeDot={{
                              r: 8,
                              fill: "#38bdf8",
                              stroke: "#fff",
                              strokeWidth: 2,
                            }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="text-slate-300 text-center mt-4 text-sm">
                        Total{" "}
                        <span className="font-bold text-blue-400">
                          {
                            wasteAnalysisData[wasteAnalysisData.length - 1]
                              .Analisis
                          }
                        </span>{" "}
                        anggota telah melakukan analisis sampah bulan ini.
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Enhanced Tabs Section */}
              <div className="container mx-auto px-4 pb-20">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-full flex justify-center mb-8">
                      <TabsList
                        className="
                          w-full max-w-4xl
                          flex
                          bg-slate-900/80
                          backdrop-blur-xl
                          border border-slate-700/50
                          shadow-xl
                          rounded-2xl
                          p-2
                          gap-4
                          "
                        style={{ minHeight: 64 }}
                      >
                        <TabsTrigger
                          value="events"
                          className="
                            flex-1
                            flex items-center justify-center
                            text-slate-300
                            data-[state=active]:text-white
                            data-[state=active]:bg-slate-800/80
                            rounded-xl
                            font-semibold
                            text-lg
                            h-12
                            transition-all
                            duration-300
                          "
                        >
                          <Calendar className="w-5 h-5 mr-2" />
                          Event & Kegiatan
                        </TabsTrigger>
                        <TabsTrigger
                          value="discussions"
                          className="
                            flex-1
                            flex items-center justify-center
                            text-slate-300
                            data-[state=active]:text-white
                            data-[state=active]:bg-slate-800/80
                            rounded-xl
                            font-semibold
                            text-lg
                            h-12
                            transition-all
                            duration-300
                          "
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Diskusi
                        </TabsTrigger>
                        <TabsTrigger
                          value="achievements"
                          className="
                            flex-1
                            flex items-center justify-center
                            text-slate-300
                            data-[state=active]:text-white
                            data-[state=active]:bg-slate-800/80
                            rounded-xl
                            font-semibold
                            text-lg
                            h-12
                            transition-all
                            duration-300
                          "
                        >
                          <Trophy className="w-5 h-5 mr-2" />
                          Pencapaian
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </motion.div>

                  <TabsContent value="events" className="space-y-8">
                    {/* Enhanced Search and Filter */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-xl rounded-2xl">
                        <CardContent className="p-8">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="relative flex-1">
                              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                              <Input
                                placeholder="Cari event atau kegiatan..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 rounded-xl text-lg focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                              />
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {[
                                { key: "all", label: "Semua" },
                                { key: "workshop", label: "Workshop" },
                                { key: "event", label: "Event" },
                                { key: "community", label: "Komunitas" },
                              ].map((category) => (
                                <Button
                                  key={category.key}
                                  variant={
                                    selectedCategory === category.key
                                      ? "default"
                                      : "outline"
                                  }
                                  size="lg"
                                  onClick={() =>
                                    setSelectedCategory(category.key)
                                  }
                                  className={
                                    selectedCategory === category.key
                                      ? `bg-gradient-to-r ${themeColors.buttonGradient} shadow-lg font-semibold rounded-2xl`
                                      : "border-slate-600 text-slate-300 hover:bg-slate-800/50 hover:text-white font-semibold transition-all duration-300 rounded-2xl"
                                  }
                                >
                                  {category.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Enhanced Events Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <AnimatePresence>
                        {filteredEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={
                              performanceLevel !== "low"
                                ? { y: -8, scale: 1.03 }
                                : {}
                            }
                            className="group"
                          >
                            <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/90 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden rounded-2xl">
                              <div className="relative overflow-hidden">
                                <img
                                  src={event.image || "/placeholder.svg"}
                                  alt={event.title}
                                  className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                  <Badge
                                    className={
                                      event.status === "upcoming"
                                        ? "bg-green-500/90 text-white shadow-lg"
                                        : event.status === "ongoing"
                                        ? "bg-blue-500/90 text-white shadow-lg"
                                        : "bg-gray-500/90 text-white shadow-lg"
                                    }
                                  >
                                    {event.status === "upcoming"
                                      ? "Akan Datang"
                                      : event.status === "ongoing"
                                      ? "Berlangsung"
                                      : "Selesai"}
                                  </Badge>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <Badge className="bg-slate-900/90 text-white shadow-lg">
                                    <Users className="w-3 h-3 mr-1" />
                                    {event.participants}/{event.maxParticipants}
                                  </Badge>
                                </div>
                              </div>
                              <CardContent className="p-8">
                                <div className="space-y-5">
                                  <h3 className="font-bold text-white text-xl mb-2 group-hover:text-blue-300 transition-colors duration-300">
                                    {event.title}
                                  </h3>
                                  <p className="text-slate-300 text-base leading-relaxed line-clamp-2">
                                    {event.description}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {event.tags.map((tag, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs border-slate-600 text-slate-300 hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-slate-300">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                                      <Calendar className="w-4 h-4 text-blue-400" />
                                      <span className="font-medium">
                                        {event.date} • {event.time}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                                      <MapPin className="w-4 h-4 text-green-400" />
                                      <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-800/40">
                                      <Users className="w-4 h-4 text-purple-400" />
                                      <span>Oleh {event.organizer}</span>
                                    </div>
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
                    <div className="space-y-6">
                      {discussions.map((discussion, index) => (
                        <motion.div
                          key={discussion.id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={
                            performanceLevel !== "low"
                              ? { x: 8, scale: 1.02 }
                              : {}
                          }
                          className="group"
                        >
                          <Card className="bg-gradient-to-br from-slate-900/80 to-slate-800/90 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 rounded-2xl">
                            <CardContent className="p-8">
                              <div className="flex space-x-6">
                                <Avatar className="w-16 h-16 ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-300">
                                  <AvatarImage
                                    src={
                                      discussion.avatar || "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback className="bg-slate-800 text-white font-bold text-lg">
                                    {discussion.author
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-bold text-white text-lg mb-2 group-hover:text-blue-300 transition-colors duration-300">
                                        {discussion.title}
                                      </h3>
                                      <p className="text-sm text-slate-400 flex items-center gap-2">
                                        <span className="font-medium">
                                          oleh {discussion.author}
                                        </span>
                                        <span>•</span>
                                        <span>{discussion.timeAgo}</span>
                                      </p>
                                    </div>
                                    <Badge
                                      className={
                                        discussion.category === "tips"
                                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                                          : discussion.category === "sharing"
                                          ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                          : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                      }
                                    >
                                      {discussion.category}
                                    </Badge>
                                  </div>

                                  <p className="text-slate-300 text-base leading-relaxed">
                                    {discussion.content}
                                  </p>

                                  <div className="flex flex-wrap gap-2">
                                    {discussion.tags.map((tag, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs border-slate-600 text-slate-300 hover:border-blue-500/50 hover:text-blue-300 transition-all duration-300"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex items-center space-x-6 text-sm text-slate-400 pt-2">
                                    <button className="flex items-center space-x-2 hover:text-red-400 transition-colors duration-300 p-2 rounded-lg hover:bg-red-500/10">
                                      <ThumbsUp className="w-4 h-4" />
                                      <span className="font-medium">
                                        {discussion.likes}
                                      </span>
                                    </button>
                                    <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-blue-500/10">
                                      <MessageCircle className="w-4 h-4" />
                                      <span className="font-medium">
                                        {discussion.replies} balasan
                                      </span>
                                    </button>
                                    <button className="flex items-center space-x-2 hover:text-green-400 transition-colors duration-300 p-2 rounded-lg hover:bg-green-500/10">
                                      <Share2 className="w-4 h-4" />
                                      <span className="font-medium">
                                        Bagikan
                                      </span>
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

                  <TabsContent value="achievements" className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card className="bg-slate-900/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-white text-2xl font-bold flex items-center gap-3">
                            <div
                              className={`p-3 rounded-xl ${themeColors.accentBg}`}
                            >
                              <Trophy
                                className={`w-8 h-8 ${themeColors.accent}`}
                              />
                            </div>
                            Pencapaian Komunitas
                            <Badge className="ml-auto bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                              Hall of Fame
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[
                              {
                                emoji: "🏆",
                                title: "Komunitas Terbaik",
                                desc: "Penghargaan dari Kelurahan",
                                gradient: "from-yellow-500/30 to-orange-500/20",
                                border: "border-yellow-500/30",
                              },
                              {
                                emoji: "🌱",
                                title: "Zero Waste Champion",
                                desc: "3 bulan berturut-turut",
                                gradient: "from-green-500/30 to-emerald-500/20",
                                border: "border-green-500/30",
                              },
                              {
                                emoji: "🤝",
                                title: "Solidaritas Tinggi",
                                desc: "95% partisipasi warga",
                                gradient: "from-blue-500/30 to-cyan-500/20",
                                border: "border-blue-500/30",
                              },
                              {
                                emoji: "💡",
                                title: "Inovasi Lingkungan",
                                desc: "10+ proyek kreatif berjalan",
                                gradient: "from-pink-500/30 to-purple-500/20",
                                border: "border-pink-500/30",
                              },
                              {
                                emoji: "📦",
                                title: "Donasi Pangan",
                                desc: "1 ton makanan tersalurkan",
                                gradient: "from-orange-500/30 to-yellow-500/20",
                                border: "border-orange-500/30",
                              },
                              {
                                emoji: "🌍",
                                title: "Aksi Bersih Desa",
                                desc: "Rutin tiap bulan",
                                gradient: "from-cyan-500/30 to-teal-500/20",
                                border: "border-cyan-500/30",
                              },
                            ].map((achievement, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8, scale: 1.07 }}
                                className="group"
                              >
                                <div
                                  className={`text-center p-10 bg-gradient-to-br ${achievement.gradient} rounded-2xl border-2 ${achievement.border} hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                                >
                                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <div className="relative z-10">
                                    <div className="text-7xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                                      {achievement.emoji}
                                    </div>
                                    <h3 className="font-bold text-white mb-3 text-2xl">
                                      {achievement.title}
                                    </h3>
                                    <p className="text-base text-slate-200 leading-relaxed">
                                      {achievement.desc}
                                    </p>
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
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-20 bg-slate-900/30 backdrop-blur-sm relative z-10">
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={animationSettings}
            className="text-white"
          >
            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
              Jadilah Bagian dari
              <span
                className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
              >
                Komunitas EcoNARA!
              </span>
            </h2>
            <p className="text-xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ayo bergabung dan berkontribusi bersama ratusan anggota aktif
              lainnya. Ikuti event, diskusi, dan aksi nyata untuk lingkungan
              yang lebih baik. Mulai perjalananmu bersama EcoNARA sekarang!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className={`bg-gradient-to-r ${themeColors.buttonGradient} text-white px-10 py-4 text-lg font-bold shadow-2xl transition-all duration-300 rounded-2xl border-0`}
              >
                Gabung Komunitas
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 bg-slate-900/20 backdrop-blur-sm px-10 py-4 text-lg font-bold rounded-2xl hover:border-slate-500"
              >
                Lihat Event Terdekat
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </ThemeProvider>
  );
}
