"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Bell,
  Check,
  X,
  Heart,
  Users,
  Gift,
  Zap,
  MessageCircle,
  Award,
  Trash2,
  Settings,
} from "lucide-react"
import Link from "next/link"

const notifications = [
  {
    id: 1,
    type: "donation",
    title: "Permintaan Donasi Baru",
    message: "Bu Sari membutuhkan bantuan beras 10kg untuk keluarga kurang mampu di RT 04",
    time: "5 menit lalu",
    read: false,
    priority: "high",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: 2,
    type: "community",
    title: "Event Workshop Kompos",
    message: "Workshop membuat kompos rumahan akan dimulai besok pagi jam 09:00",
    time: "1 jam lalu",
    read: false,
    priority: "medium",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: 3,
    type: "achievement",
    title: "Badge Baru Diraih!",
    message: "Selamat! Anda telah meraih badge 'Eco Warrior' karena menyelamatkan 100kg makanan",
    time: "2 jam lalu",
    read: true,
    priority: "low",
    icon: Award,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: 4,
    type: "ai",
    title: "Rekomendasi AI Baru",
    message: "Food Rescue AI menemukan 3 resep baru dari bahan makanan yang Anda miliki",
    time: "3 jam lalu",
    read: true,
    priority: "medium",
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: 5,
    type: "message",
    title: "Pesan dari Pak Joko",
    message: "Terima kasih sudah membantu dengan donasi kemarin. Keluarga kami sangat terbantu",
    time: "5 jam lalu",
    read: true,
    priority: "low",
    icon: MessageCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: 6,
    type: "system",
    title: "Update Aplikasi",
    message: "Versi baru ECONARA telah tersedia dengan fitur AI yang lebih canggih",
    time: "1 hari lalu",
    read: false,
    priority: "medium",
    icon: Gift,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
  },
]

const notificationSettings = {
  donations: { enabled: true, sound: true, push: true },
  community: { enabled: true, sound: false, push: true },
  achievements: { enabled: true, sound: true, push: false },
  ai: { enabled: true, sound: false, push: true },
  messages: { enabled: true, sound: true, push: true },
  system: { enabled: true, sound: false, push: false },
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifs, setNotifs] = useState(notifications)
  const [settings, setSettings] = useState(notificationSettings)
  const [selectedNotifs, setSelectedNotifs] = useState<number[]>([])

  const unreadCount = notifs.filter((n) => !n.read).length

  const filteredNotifications = notifs.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notif.read
    return notif.type === activeTab
  })

  const markAsRead = (id: number) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id))
  }

  const toggleSelect = (id: number) => {
    setSelectedNotifs((prev) => (prev.includes(id) ? prev.filter((nId) => nId !== id) : [...prev, id]))
  }

  const deleteSelected = () => {
    setNotifs((prev) => prev.filter((n) => !selectedNotifs.includes(n.id)))
    setSelectedNotifs([])
  }

  const updateSetting = (type: string, setting: string, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      [type]: { ...prev[type], [setting]: value },
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center relative">
                  <Bell className="w-5 h-5 text-white" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Notifikasi</h1>
                  <p className="text-sm text-gray-600">{unreadCount} notifikasi belum dibaca</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {selectedNotifs.length > 0 && (
                <Button variant="outline" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus ({selectedNotifs.length})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="w-4 h-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="unread">Belum Dibaca</TabsTrigger>
            <TabsTrigger value="donation">Donasi</TabsTrigger>
            <TabsTrigger value="community">Komunitas</TabsTrigger>
            <TabsTrigger value="achievement">Pencapaian</TabsTrigger>
            <TabsTrigger value="ai">AI</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Pengaturan Notifikasi</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(settings).map(([type, setting]) => (
                    <div key={type} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800 capitalize">
                          {type === "donations"
                            ? "Donasi"
                            : type === "community"
                              ? "Komunitas"
                              : type === "achievements"
                                ? "Pencapaian"
                                : type === "ai"
                                  ? "AI"
                                  : type === "messages"
                                    ? "Pesan"
                                    : "Sistem"}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Aktif</span>
                          <Switch
                            checked={setting.enabled}
                            onCheckedChange={(checked) => updateSetting(type, "enabled", checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Suara</span>
                          <Switch
                            checked={setting.sound}
                            onCheckedChange={(checked) => updateSetting(type, "sound", checked)}
                            disabled={!setting.enabled}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Push</span>
                          <Switch
                            checked={setting.push}
                            onCheckedChange={(checked) => updateSetting(type, "push", checked)}
                            disabled={!setting.enabled}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Other tabs content */}
          {["all", "unread", "donation", "community", "achievement", "ai"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Tidak ada notifikasi</h3>
                    <p className="text-gray-500">Semua notifikasi sudah dibaca atau tidak ada yang sesuai filter</p>
                  </motion.div>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                    >
                      <Card
                        className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm ${
                          !notification.read ? "ring-2 ring-blue-200" : ""
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={selectedNotifs.includes(notification.id)}
                                onChange={() => toggleSelect(notification.id)}
                                className="rounded border-gray-300"
                              />
                              <div
                                className={`w-12 h-12 ${notification.bgColor} rounded-xl flex items-center justify-center`}
                              >
                                <notification.icon className={`w-6 h-6 ${notification.color}`} />
                              </div>
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3
                                    className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}
                                  >
                                    {notification.title}
                                  </h3>
                                  <p className={`text-sm ${!notification.read ? "text-gray-700" : "text-gray-600"}`}>
                                    {notification.message}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    className={
                                      notification.priority === "high"
                                        ? "bg-red-100 text-red-800"
                                        : notification.priority === "medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {notification.priority === "high"
                                      ? "Penting"
                                      : notification.priority === "medium"
                                        ? "Sedang"
                                        : "Rendah"}
                                  </Badge>
                                  {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{notification.time}</span>
                                <div className="flex space-x-2">
                                  {!notification.read && (
                                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                      <Check className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
