"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Globe,
  Activity,
  Droplets,
} from "lucide-react";
import { Navbar } from "@/components/navigation/nav-dashboard";

// Data dummy (sama seperti sebelumnya)
const rtStats = [
  { name: "RT 01", families: 45, foodStock: 85, wasteReduced: 120, status: "good" },
  { name: "RT 02", families: 38, foodStock: 65, wasteReduced: 95, status: "warning" },
  { name: "RT 03", families: 52, foodStock: 90, wasteReduced: 140, status: "good" },
  { name: "RT 04", families: 41, foodStock: 45, wasteReduced: 80, status: "critical" },
  { name: "RT 05", families: 47, foodStock: 75, wasteReduced: 110, status: "good" },
];

const alerts = [
  { type: "critical", message: "Stok beras RT 04 menipis (< 50%)", time: "10 menit lalu", icon: "🔥" },
  { type: "warning", message: "Permintaan bantuan dari 3 keluarga RT 02", time: "1 jam lalu", icon: "⚠️" },
  { type: "info", message: "Donasi 50kg sayuran dari Koperasi Maju", time: "2 jam lalu", icon: "📦" },
];

const topContributors = [
    { name: "Siti Aminah (RT 01)", points: 520, badge: "🏆" },
    { name: "Pak Joko (RT 03)", points: 485, badge: "🥈" },
    { name: "Bu Rina (RT 02)", points: 460, badge: "🥉" },
];

const activePrograms = [
    { program: "Food Rescue Challenge", participants: 45 },
    { program: "Zero Waste Week", participants: 38 },
    { program: "Community Garden", participants: 52 },
];


// Komponen Utama
export default function AdminDashboard() {
  const [selectedRT, setSelectedRT] = useState("all");

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Ocean Background Effects from User Dashboard */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />

      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Overview Stats - Refactored to match User Dashboard Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Users className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">223</div>
                <div className="text-sm opacity-90 font-medium">Total Keluarga</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Wheat className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">72%</div>
                <div className="text-sm opacity-90 font-medium">Rata-rata Stok</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="text-center bg-gradient-to-br from-blue-800 via-cyan-600 to-teal-400 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Package className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">545kg</div>
                <div className="text-sm opacity-90 font-medium">Sampah Didaur Ulang</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="text-center bg-gradient-to-br from-orange-600 via-red-500 to-rose-500 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">3</div>
                <div className="text-sm opacity-90 font-medium">Alert Aktif</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              {/* Refactored TabsList */}
              <TabsList className="grid w-full grid-cols-4 bg-cyan-100/80 rounded-xl border border-cyan-200 p-1">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-cyan-800 transition-colors">Overview</TabsTrigger>
                <TabsTrigger value="food" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-cyan-800 transition-colors">Pangan</TabsTrigger>
                <TabsTrigger value="waste" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-cyan-800 transition-colors">Sampah</TabsTrigger>
                <TabsTrigger value="community" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-cyan-800 transition-colors">Komunitas</TabsTrigger>
              </TabsList>

              {/* Overview Tab Content */}
              <TabsContent value="overview" className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-cyan-900">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center"><BarChart3 className="w-5 h-5 text-white" /></div>
                      <span className="text-xl font-bold">Status RT/Desa</span>
                    </CardTitle>
                    <CardDescription className="text-cyan-700">Monitoring kondisi setiap RT dalam wilayah Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {rtStats.map((rt, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-5 bg-cyan-50/80 rounded-2xl border border-cyan-100 hover:shadow-lg transition-all duration-300 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-cyan-900">{rt.name}</h3>
                            <Badge className={`text-white border-0 shadow-md ${
                                rt.status === "good" ? "bg-gradient-to-r from-green-400 to-teal-400" :
                                rt.status === "warning" ? "bg-gradient-to-r from-yellow-400 to-amber-400" :
                                "bg-gradient-to-r from-red-500 to-orange-500"
                              }`}>{rt.status === "good" ? "Baik" : rt.status === "warning" ? "Perhatian" : "Kritis"}
                            </Badge>
                          </div>
                          <span className="text-sm text-cyan-700 font-medium">{rt.families} keluarga</span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="flex justify-between text-sm mb-2 text-cyan-800"><span>Stok Pangan</span><span className="font-semibold">{rt.foodStock}%</span></div>
                            <Progress value={rt.foodStock} className="h-2 bg-cyan-200/50" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-2 text-cyan-800"><span>Sampah Didaur Ulang</span><span className="font-semibold">{rt.wasteReduced}kg</span></div>
                            <Progress value={Math.min(rt.wasteReduced / 1.5, 100)} className="h-2 bg-blue-200/50" indicatorClassName="bg-gradient-to-r from-blue-400 to-purple-400" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add other TabsContent sections here, styled similarly */}
              
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Alerts Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center"><Bell className="w-5 h-5 text-white" /></div>
                  <span className="text-lg font-bold">Alert & Notifikasi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-2xl border-l-4 backdrop-blur-sm transition-all duration-300 hover:shadow-md ${
                      alert.type === "critical" ? "bg-gradient-to-r from-red-50/80 to-orange-50/80 border-red-400" :
                      alert.type === "warning" ? "bg-gradient-to-r from-yellow-50/80 to-amber-50/80 border-yellow-400" :
                      "bg-gradient-to-r from-blue-50/80 to-cyan-50/80 border-blue-400"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-lg">{alert.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">{alert.message}</div>
                        <div className="text-xs text-gray-600 mt-1">{alert.time}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-cyan-900">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div>
                    <span className="text-lg font-bold">Aksi Cepat</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900 border-cyan-200 hover:from-cyan-100 hover:to-blue-100 rounded-xl">
                  <MapPin className="w-4 h-4 mr-2" />
                  Lihat Peta Distribusi
                </Button>
                <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900 border-cyan-200 hover:from-cyan-100 hover:to-blue-100 rounded-xl">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Laporan
                </Button>
                <Button variant="outline" className="w-full justify-start bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-900 border-cyan-200 hover:from-cyan-100 hover:to-blue-100 rounded-xl">
                  <Settings className="w-4 h-4 mr-2" />
                  Pengaturan Sistem
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}