"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Leaf,
  Recycle,
  Heart,
  Calendar,
  Download,
  RefreshCw,
  Target,
  Award,
  Zap,
  Globe,
} from "lucide-react"
import Link from "next/link"

// Mock data for charts
const monthlyData = [
  { month: "Jan", foodSaved: 120, wasteRecycled: 85, donations: 45, users: 150 },
  { month: "Feb", foodSaved: 135, wasteRecycled: 92, donations: 52, users: 168 },
  { month: "Mar", foodSaved: 148, wasteRecycled: 98, donations: 58, users: 185 },
  { month: "Apr", foodSaved: 162, wasteRecycled: 105, donations: 64, users: 203 },
  { month: "May", foodSaved: 178, wasteRecycled: 112, donations: 71, users: 221 },
  { month: "Jun", foodSaved: 195, wasteRecycled: 125, donations: 78, users: 240 },
]

const impactMetrics = [
  {
    title: "Total Makanan Diselamatkan",
    value: "1,248 kg",
    change: "+12.5%",
    trend: "up",
    icon: Leaf,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Bulan ini vs bulan lalu",
  },
  {
    title: "Sampah Didaur Ulang",
    value: "856 kg",
    change: "+8.3%",
    trend: "up",
    icon: Recycle,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Bulan ini vs bulan lalu",
  },
  {
    title: "Keluarga Terbantu",
    value: "234",
    change: "+15.2%",
    trend: "up",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
    description: "Bulan ini vs bulan lalu",
  },
  {
    title: "Pengguna Aktif",
    value: "1,456",
    change: "+6.7%",
    trend: "up",
    icon: Users,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    description: "Bulan ini vs bulan lalu",
  },
]

const topCommunities = [
  { name: "RT 05 Kelurahan Maju", score: 2450, members: 89, growth: "+12%" },
  { name: "RT 03 Kelurahan Sejahtera", score: 2380, members: 76, growth: "+8%" },
  { name: "RT 07 Kelurahan Harmoni", score: 2250, members: 82, growth: "+15%" },
  { name: "RT 02 Kelurahan Damai", score: 2100, members: 65, growth: "+5%" },
  { name: "RT 04 Kelurahan Indah", score: 1980, members: 71, growth: "+9%" },
]

const aiUsageStats = [
  { feature: "Food Rescue AI", usage: 1245, accuracy: "94%", trend: "+18%" },
  { feature: "Trash Classifier", usage: 892, accuracy: "96%", trend: "+22%" },
  { feature: "Donation Matching", usage: 567, accuracy: "91%", trend: "+14%" },
  { feature: "Community Insights", usage: 423, accuracy: "89%", trend: "+25%" },
]

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("6months")
  const [isLoading, setIsLoading] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({
    foodSaved: 0,
    wasteRecycled: 0,
    donations: 0,
    users: 0,
  })

  // Animate numbers on load
  useEffect(() => {
    const targets = {
      foodSaved: 1248,
      wasteRecycled: 856,
      donations: 234,
      users: 1456,
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedValues({
        foodSaved: Math.floor(targets.foodSaved * progress),
        wasteRecycled: Math.floor(targets.wasteRecycled * progress),
        donations: Math.floor(targets.donations * progress),
        users: Math.floor(targets.users * progress),
      })

      if (currentStep >= steps) {
        clearInterval(interval)
        setAnimatedValues(targets)
      }
    }, stepDuration)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Analytics & Insights</h1>
                  <p className="text-sm text-gray-600">Data dan analisis dampak komunitas</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Bulan</SelectItem>
                  <SelectItem value="3months">3 Bulan</SelectItem>
                  <SelectItem value="6months">6 Bulan</SelectItem>
                  <SelectItem value="1year">1 Tahun</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                      <metric.icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <Badge
                      className={`${metric.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-800">
                      {index === 0
                        ? `${animatedValues.foodSaved} kg`
                        : index === 1
                          ? `${animatedValues.wasteRecycled} kg`
                          : index === 2
                            ? animatedValues.donations
                            : animatedValues.users.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="communities">Komunitas</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="impact">Dampak Lingkungan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends Chart */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span>Tren Bulanan</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {monthlyData.map((data, index) => (
                        <motion.div
                          key={data.month}
                          className="flex-1 flex flex-col items-center space-y-2"
                          initial={{ height: 0 }}
                          animate={{ height: "auto" }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="w-full space-y-1">
                            <motion.div
                              className="bg-green-500 rounded-t"
                              initial={{ height: 0 }}
                              animate={{ height: `${(data.foodSaved / 200) * 100}px` }}
                              transition={{ delay: index * 0.1 + 0.2 }}
                            />
                            <motion.div
                              className="bg-blue-500"
                              initial={{ height: 0 }}
                              animate={{ height: `${(data.wasteRecycled / 200) * 80}px` }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            />
                            <motion.div
                              className="bg-red-500"
                              initial={{ height: 0 }}
                              animate={{ height: `${(data.donations / 200) * 60}px` }}
                              transition={{ delay: index * 0.1 + 0.4 }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600">{data.month}</span>
                        </motion.div>
                      ))}
                    </div>
                    <div className="flex justify-center space-x-6 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-xs text-gray-600">Makanan Diselamatkan</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-xs text-gray-600">Sampah Didaur Ulang</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-xs text-gray-600">Donasi</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Heatmap */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <span>Aktivitas Harian</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {Array.from({ length: 49 }, (_, i) => (
                        <motion.div
                          key={i}
                          className={`aspect-square rounded ${
                            Math.random() > 0.7
                              ? "bg-green-500"
                              : Math.random() > 0.5
                                ? "bg-green-300"
                                : Math.random() > 0.3
                                  ? "bg-green-100"
                                  : "bg-gray-100"
                          }`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.01 }}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>7 minggu lalu</span>
                      <div className="flex items-center space-x-1">
                        <span>Kurang</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-100 rounded"></div>
                          <div className="w-2 h-2 bg-green-100 rounded"></div>
                          <div className="w-2 h-2 bg-green-300 rounded"></div>
                          <div className="w-2 h-2 bg-green-500 rounded"></div>
                        </div>
                        <span>Lebih</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="communities" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>Top Performing Communities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCommunities.map((community, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-full text-sm">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{community.name}</h3>
                            <p className="text-sm text-gray-600">{community.members} anggota aktif</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{community.score} poin</p>
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {community.growth}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    <span>AI Feature Usage & Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {aiUsageStats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-800">{stat.feature}</h3>
                          <Badge className="bg-blue-100 text-blue-800">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {stat.trend}
                          </Badge>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Penggunaan</span>
                            <span className="font-bold text-gray-800">{stat.usage.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Akurasi</span>
                            <span className="font-bold text-green-600">{stat.accuracy}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: stat.accuracy }}
                              transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-green-500" />
                    <span>Environmental Impact</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-4xl mb-4">🌱</div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">2.4 Ton</h3>
                      <p className="text-sm text-gray-600 mb-2">CO₂ Dikurangi</p>
                      <p className="text-xs text-gray-500">Setara dengan 520 pohon</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                      <div className="text-4xl mb-4">💧</div>
                      <h3 className="text-2xl font-bold text-blue-600 mb-2">15,600 L</h3>
                      <p className="text-sm text-gray-600 mb-2">Air Dihemat</p>
                      <p className="text-xs text-gray-500">Dari pengurangan food waste</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <div className="text-4xl mb-4">⚡</div>
                      <h3 className="text-2xl font-bold text-purple-600 mb-2">890 kWh</h3>
                      <p className="text-sm text-gray-600 mb-2">Energi Dihemat</p>
                      <p className="text-xs text-gray-500">Dari daur ulang sampah</p>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-green-600" />
                      Target SDGs yang Tercapai
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl mb-2">🍽️</div>
                        <p className="text-xs font-medium">Zero Hunger</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏘️</div>
                        <p className="text-xs font-medium">Sustainable Cities</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🌍</div>
                        <p className="text-xs font-medium">Climate Action</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl mb-2">🤝</div>
                        <p className="text-xs font-medium">Partnerships</p>
                      </div>
                    </div>
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
