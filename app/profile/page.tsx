"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Award,
  TrendingUp,
  Heart,
  Leaf,
  Camera,
  Edit3,
  Save,
  X,
  Star,
  Trophy,
  Calendar,
  MapPin,
  Globe,
} from "lucide-react"
import Link from "next/link"

const achievements = [
  {
    id: 1,
    title: "Eco Warrior",
    description: "Menyelamatkan 100kg makanan",
    icon: "🌱",
    earned: true,
    date: "2024-01-15",
  },
  { id: 2, title: "Community Hero", description: "Membantu 50 keluarga", icon: "🦸", earned: true, date: "2024-02-20" },
  {
    id: 3,
    title: "Recycling Master",
    description: "Mendaur ulang 200kg sampah",
    icon: "♻️",
    earned: true,
    date: "2024-03-10",
  },
  { id: 4, title: "AI Pioneer", description: "Menggunakan semua fitur AI", icon: "🤖", earned: false, progress: 75 },
  {
    id: 5,
    title: "Sustainability Champion",
    description: "1 tahun aktif di platform",
    icon: "🏆",
    earned: false,
    progress: 60,
  },
]

const activities = [
  { id: 1, action: "Mendonasikan 5kg beras", points: 50, date: "2 jam lalu", type: "donation" },
  { id: 2, action: "Menggunakan Food Rescue AI", points: 25, date: "5 jam lalu", type: "ai" },
  { id: 3, action: "Mengklasifikasi 10 sampah", points: 30, date: "1 hari lalu", type: "classification" },
  { id: 4, action: "Bergabung dengan event komunitas", points: 40, date: "2 hari lalu", type: "community" },
  { id: 5, action: "Menyelesaikan challenge mingguan", points: 100, date: "3 hari lalu", type: "challenge" },
]

const stats = [
  { label: "Total Poin", value: "2,450", icon: Star, color: "text-yellow-500" },
  { label: "Makanan Diselamatkan", value: "156kg", icon: Leaf, color: "text-green-500" },
  { label: "Keluarga Terbantu", value: "23", icon: Heart, color: "text-red-500" },
  { label: "Sampah Didaur Ulang", value: "89kg", icon: Trophy, color: "text-blue-500" },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [profile, setProfile] = useState({
    name: "Sari Wijaya",
    email: "sari.wijaya@email.com",
    phone: "+62 812 3456 7890",
    location: "RT 05, Kelurahan Maju, Jakarta",
    bio: "Ibu rumah tangga yang peduli lingkungan dan aktif dalam kegiatan komunitas berkelanjutan.",
    joinDate: "Januari 2024",
    level: "Eco Champion",
    totalPoints: 2450,
    rank: 15,
  })

  const [notifications, setNotifications] = useState({
    donations: true,
    community: true,
    achievements: true,
    marketing: false,
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Profil Saya</h1>
                  <p className="text-sm text-gray-600">Kelola informasi dan pengaturan akun</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsEditing(!isEditing)}
              className={isEditing ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {isEditing ? "Batal" : "Edit Profil"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src="/placeholder.svg?height=96&width=96&text=SW" />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-white">
                        SW
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-800 mb-1">{profile.name}</h2>
                  <Badge className="bg-green-100 text-green-800 mb-3">{profile.level}</Badge>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>Rank #{profile.rank}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Bergabung {profile.joinDate}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
                        <div className="font-bold text-gray-800">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="achievements">Pencapaian</TabsTrigger>
                <TabsTrigger value="activity">Aktivitas</TabsTrigger>
                <TabsTrigger value="settings">Pengaturan</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Informasi Pribadi</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Lengkap</label>
                          <Input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                          <Input
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Nomor Telepon</label>
                          <Input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Lokasi</label>
                          <Input
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            disabled={!isEditing}
                            className={!isEditing ? "bg-gray-50" : ""}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                        <textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          disabled={!isEditing}
                          className={`w-full p-3 border rounded-lg resize-none h-24 ${!isEditing ? "bg-gray-50" : ""}`}
                        />
                      </div>

                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex space-x-3"
                        >
                          <Button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-600">
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Perubahan
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Batal
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>Pencapaian & Badge</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {achievements.map((achievement, index) => (
                          <motion.div
                            key={achievement.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              achievement.earned
                                ? "bg-green-50 border-green-200 shadow-lg"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`text-3xl ${achievement.earned ? "" : "grayscale opacity-50"}`}>
                                {achievement.icon}
                              </div>
                              <div className="flex-1">
                                <h3
                                  className={`font-semibold ${achievement.earned ? "text-green-800" : "text-gray-600"}`}
                                >
                                  {achievement.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

                                {achievement.earned ? (
                                  <Badge className="bg-green-100 text-green-800">Diraih {achievement.date}</Badge>
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Progress</span>
                                      <span className="font-medium">{achievement.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                      <motion.div
                                        className="bg-blue-500 h-2 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${achievement.progress}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5" />
                        <span>Aktivitas Terbaru</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activities.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  activity.type === "donation"
                                    ? "bg-green-500"
                                    : activity.type === "ai"
                                      ? "bg-blue-500"
                                      : activity.type === "classification"
                                        ? "bg-purple-500"
                                        : activity.type === "community"
                                          ? "bg-orange-500"
                                          : "bg-yellow-500"
                                }`}
                              />
                              <div>
                                <p className="font-medium text-gray-800">{activity.action}</p>
                                <p className="text-sm text-gray-600">{activity.date}</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">+{activity.points} poin</Badge>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <span>Notifikasi</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">Notifikasi Donasi</h4>
                          <p className="text-sm text-gray-600">Terima notifikasi tentang permintaan donasi baru</p>
                        </div>
                        <Switch
                          checked={notifications.donations}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, donations: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">Aktivitas Komunitas</h4>
                          <p className="text-sm text-gray-600">Update tentang kegiatan komunitas sekitar</p>
                        </div>
                        <Switch
                          checked={notifications.community}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, community: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">Pencapaian Baru</h4>
                          <p className="text-sm text-gray-600">Notifikasi saat meraih badge atau pencapaian</p>
                        </div>
                        <Switch
                          checked={notifications.achievements}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-800">Email Marketing</h4>
                          <p className="text-sm text-gray-600">Tips dan informasi tentang keberlanjutan</p>
                        </div>
                        <Switch
                          checked={notifications.marketing}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Shield className="w-5 h-5" />
                        <span>Keamanan & Privasi</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Shield className="w-4 h-4 mr-2" />
                        Ubah Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Globe className="w-4 h-4 mr-2" />
                        Pengaturan Privasi
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hapus Akun
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
