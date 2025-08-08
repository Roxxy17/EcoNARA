"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Users,
  Wheat,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Package,
  Bell,
  BarChart3,
  Settings,
  Download,
  Plus,
} from "lucide-react"

const rtStats = [
  { name: "RT 01", families: 45, foodStock: 85, wasteReduced: 120, status: "good" },
  { name: "RT 02", families: 38, foodStock: 65, wasteReduced: 95, status: "warning" },
  { name: "RT 03", families: 52, foodStock: 90, wasteReduced: 140, status: "good" },
  { name: "RT 04", families: 41, foodStock: 45, wasteReduced: 80, status: "critical" },
  { name: "RT 05", families: 47, foodStock: 75, wasteReduced: 110, status: "good" },
]

const alerts = [
  { type: "critical", message: "Stok beras RT 04 menipis (< 50%)", time: "10 menit lalu" },
  { type: "warning", message: "Permintaan bantuan dari 3 keluarga RT 02", time: "1 jam lalu" },
  { type: "info", message: "Donasi 50kg sayuran dari Koperasi Maju", time: "2 jam lalu" },
]

export default function AdminDashboard() {
  const [selectedRT, setSelectedRT] = useState("all")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Kelurahan Maju Bersama</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Plus className="w-4 h-4 mr-2" />
                Tambah RT
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Keluarga</p>
                    <p className="text-3xl font-bold">223</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Rata-rata Stok Pangan</p>
                    <p className="text-3xl font-bold">72%</p>
                  </div>
                  <Wheat className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Sampah Didaur Ulang</p>
                    <p className="text-3xl font-bold">545kg</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Alert Aktif</p>
                    <p className="text-3xl font-bold">3</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="food">Pangan</TabsTrigger>
                <TabsTrigger value="waste">Sampah</TabsTrigger>
                <TabsTrigger value="community">Komunitas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-500" />
                      <span>Status RT/Desa</span>
                    </CardTitle>
                    <CardDescription>Monitoring kondisi setiap RT dalam wilayah</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {rtStats.map((rt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-4 rounded-lg border bg-white"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-gray-800">{rt.name}</h3>
                              <Badge
                                className={
                                  rt.status === "good"
                                    ? "bg-green-100 text-green-800"
                                    : rt.status === "warning"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {rt.status === "good" ? "Baik" : rt.status === "warning" ? "Perhatian" : "Kritis"}
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-600">{rt.families} keluarga</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Stok Pangan</span>
                                <span>{rt.foodStock}%</span>
                              </div>
                              <Progress value={rt.foodStock} className="h-2" />
                            </div>
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span>Sampah Didaur Ulang</span>
                                <span>{rt.wasteReduced}kg</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{ width: `${Math.min(rt.wasteReduced / 2, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="food" className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Manajemen Stok Pangan</CardTitle>
                    <CardDescription>Kelola distribusi dan monitoring stok pangan per RT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4 text-center">
                            <Wheat className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-green-800">1,250kg</div>
                            <div className="text-sm text-green-600">Beras Tersedia</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4 text-center">
                            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-blue-800">850kg</div>
                            <div className="text-sm text-blue-600">Sayuran Segar</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-orange-50 border-orange-200">
                          <CardContent className="p-4 text-center">
                            <AlertTriangle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-orange-800">2</div>
                            <div className="text-sm text-orange-600">RT Butuh Bantuan</div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="waste" className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Statistik Pengelolaan Sampah</CardTitle>
                    <CardDescription>Data daur ulang dan klasifikasi sampah per RT</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Jenis Sampah Terkumpul</h4>
                        {[
                          { type: "Plastik", amount: 245, color: "bg-blue-500" },
                          { type: "Organik", amount: 180, color: "bg-green-500" },
                          { type: "Kertas", amount: 120, color: "bg-yellow-500" },
                        ].map((waste, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className={`w-4 h-4 ${waste.color} rounded`}></div>
                            <span className="flex-1">{waste.type}</span>
                            <span className="font-semibold">{waste.amount}kg</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-800">Target Bulanan</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Daur Ulang</span>
                              <span>545/800 kg</span>
                            </div>
                            <Progress value={68} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Kompos</span>
                              <span>180/300 kg</span>
                            </div>
                            <Progress value={60} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="community" className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Aktivitas Komunitas</CardTitle>
                    <CardDescription>Partisipasi warga dan program komunitas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Top Contributors</h4>
                        <div className="space-y-3">
                          {[
                            { name: "Siti Aminah (RT 01)", points: 520, badge: "🏆" },
                            { name: "Pak Joko (RT 03)", points: 485, badge: "🥈" },
                            { name: "Bu Rina (RT 02)", points: 460, badge: "🥉" },
                          ].map((user, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{user.badge}</span>
                                <span className="font-medium">{user.name}</span>
                              </div>
                              <Badge>{user.points} poin</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4">Program Aktif</h4>
                        <div className="space-y-3">
                          {[
                            { program: "Food Rescue Challenge", participants: 45 },
                            { program: "Zero Waste Week", participants: 38 },
                            { program: "Community Garden", participants: 52 },
                          ].map((program, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="font-medium text-gray-800">{program.program}</div>
                              <div className="text-sm text-gray-600">{program.participants} peserta</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alerts */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-red-500" />
                  <span>Alert & Notifikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.type === "critical"
                        ? "bg-red-50 border-red-500"
                        : alert.type === "warning"
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-blue-50 border-blue-500"
                    }`}
                  >
                    <div className="text-sm font-medium text-gray-800">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{alert.time}</div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Lihat Peta Distribusi
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Laporan
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan Sistem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
