"use client"

import { useState, useEffect } from "react"
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
  ArrowLeft, User, Bell, Shield, Award, TrendingUp, Heart, Leaf, Camera, 
  Edit3, Save, X, Star, Trophy, Calendar, MapPin, Globe, Loader2, Sparkles
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"
import { Navbar } from "@/components/navigation/nav-dashboard"

const achievements = [
    { id: 1, title: "Eco Warrior", description: "Menyelamatkan 100kg makanan", icon: "🌱", earned: true, date: "2024-01-15" },
    { id: 2, title: "Community Hero", description: "Membantu 50 keluarga", icon: "🦸", earned: true, date: "2024-02-20" },
    { id: 3, title: "Recycling Master", description: "Mendaur ulang 200kg sampah", icon: "♻️", earned: true, date: "2024-03-10" },
    { id: 4, title: "AI Pioneer", description: "Menggunakan semua fitur AI", icon: "🤖", earned: false, progress: 75 },
    { id: 5, title: "Sustainability Champion", description: "1 tahun aktif di platform", icon: "🏆", earned: false, progress: 60 },
]

const activities = [
    { id: 1, action: "Mendonasikan 5kg beras", points: 50, date: "2 jam lalu", type: "donation" },
    { id: 2, action: "Menggunakan Food Rescue AI", points: 25, date: "5 jam lalu", type: "ai" },
    { id: 3, action: "Mengklasifikasi 10 sampah", points: 30, date: "1 hari lalu", type: "classification" },
    { id: 4, action: "Bergabung dengan event komunitas", points: 40, date: "2 hari lalu", type: "community" },
    { id: 5, action: "Menyelesaikan challenge mingguan", points: 100, date: "3 hari lalu", type: "challenge" },
]

function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Navbar />

      <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-64 h-4 bg-gray-200 rounded-lg mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
              <CardContent className="p-6 text-center animate-pulse">
                <div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <div className="w-3/4 h-6 mx-auto bg-gray-200 rounded-md mb-2"></div>
                <div className="w-1/2 h-4 mx-auto bg-gray-200 rounded-md mb-4"></div>
                <div className="space-y-2">
                  <div className="w-2/3 h-4 mx-auto bg-gray-200 rounded-md"></div>
                  <div className="w-2/3 h-4 mx-auto bg-gray-200 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { userProfile, loadingUser, refreshUserProfile } = useUser();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [formState, setFormState] = useState({ name: "", phone: "", bio: "" });
  const [displayProfile, setDisplayProfile] = useState({ email: "", location: "", joinDate: "", level: "", totalPoints: 0 });
  const [notifications, setNotifications] = useState({ donations: true, community: true, achievements: true, marketing: false });

  // --- FUNGSI BARU UNTUK MENERJEMAHKAN ROLE ---
  const getDisplayRole = (role?: string) => {
    if (role === 'ketua') return 'Kepala Desa';
    if (role === 'warga') return 'Warga';
    if (role === 'admin') return 'Admin';
    return 'Peran Tidak Dikenal'; // Fallback jika peran tidak ada
  };

  useEffect(() => {
    if (!loadingUser && userProfile) {
      setFormState({
        name: userProfile.nama || "",
        phone: userProfile.phone_number || "",
        bio: userProfile.bio || "",
      });
      setDisplayProfile({
        email: userProfile.email || "",
        location: userProfile.desa?.nama_desa || "Lokasi Belum Diatur",
        joinDate: userProfile.created_at ? new Date(userProfile.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : "N/A",
        level: getDisplayRole(userProfile.role), // <-- GUNAKAN FUNGSI DI SINI
        totalPoints: userProfile.poin_komunitas || 0,
      });
    }
  }, [userProfile, loadingUser]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    if (!userProfile) return;
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formState.name,
          phone_number: formState.phone,
          bio: formState.bio,
        }),
      });
      if (!response.ok) throw new Error("Gagal menyimpan profil.");
      await refreshUserProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saat menyimpan profil:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userProfile) {
      setFormState({
        name: userProfile.nama || "",
        phone: userProfile.phone_number || "",
        bio: userProfile.bio || "",
      });
    }
  };

  if (loadingUser) {
    return <ProfilePageSkeleton />;
  }

  const userInitial = formState.name ? formState.name.charAt(0).toUpperCase() : "?";
  
  const stats = [
      { label: "Total Poin", value: displayProfile.totalPoints.toLocaleString(), icon: Star, color: "text-yellow-500", bg: "bg-yellow-50" },
      { label: "Makanan Diselamatkan", value: "156kg", icon: Leaf, color: "text-green-500", bg: "bg-green-50" },
      { label: "Keluarga Terbantu", value: "23", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
      { label: "Sampah Didaur Ulang", value: "89kg", icon: Trophy, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'donation': return 'bg-pink-500';
      case 'ai': return 'bg-purple-500';
      case 'classification': return 'bg-green-500';
      case 'community': return 'bg-blue-500';
      case 'challenge': return 'bg-orange-500';
      default: return 'bg-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Background Effects - konsisten dengan page lain */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  Profil Saya
                </h1>
                <p className="text-sm text-cyan-700/80 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Kelola informasi dan pengaturan akun Anda
                </p>
              </div>
            </div>
            {isEditing ? (
              <Button 
                onClick={handleCancelEdit} 
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg" 
                disabled={isSaving}
              >
                <X className="w-4 h-4 mr-2" /> 
                Batal
              </Button>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
              >
                <Edit3 className="w-4 h-4 mr-2" /> 
                Edit Profil
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-cyan-200 shadow-lg">
                      <AvatarImage src={userProfile?.avatar_url || ""} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <motion.button 
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.9 }} 
                        className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-cyan-900 mb-1">{formState.name || "Nama Belum Diisi"}</h2>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 mb-3">
                    {displayProfile.level}
                  </Badge>
                  <div className="space-y-2 text-sm text-cyan-700">
                    <div className="flex items-center justify-center space-x-2">
                      <MapPin className="w-4 h-4 text-cyan-600" />
                      <span>{displayProfile.location}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <Calendar className="w-4 h-4 text-cyan-600" />
                      <span>Bergabung {displayProfile.joinDate}</span>
                    </div>
                  </div>
                  <Separator className="my-4 bg-cyan-100" />
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: index * 0.1 }} 
                        className={`text-center p-3 ${stat.bg} rounded-xl border border-opacity-20`}
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} />
                        <div className="font-bold text-cyan-900">{stat.value}</div>
                        <div className="text-xs text-cyan-700">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 bg-white/90 backdrop-blur-sm border border-cyan-100/50 shadow-lg rounded-xl p-1">
                <TabsTrigger 
                  value="overview" 
                  className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="achievements" 
                  className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Pencapaian
                </TabsTrigger>
                <TabsTrigger 
                  value="activity" 
                  className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Aktivitas
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg"
                >
                  Pengaturan
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-cyan-900">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Informasi Pribadi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-cyan-800 mb-2 block">Nama Lengkap</label>
                        <Input 
                          value={formState.name} 
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })} 
                          disabled={!isEditing || isSaving} 
                          className={`${!isEditing ? "bg-cyan-50 text-cyan-700" : "border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"}`} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-cyan-800 mb-2 block">Email</label>
                        <Input 
                          value={displayProfile.email} 
                          disabled 
                          className="bg-cyan-50 text-cyan-700 border-cyan-200" 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-cyan-800 mb-2 block">Nomor Telepon</label>
                        <Input 
                          value={formState.phone} 
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })} 
                          disabled={!isEditing || isSaving} 
                          className={`${!isEditing ? "bg-cyan-50 text-cyan-700" : "border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"}`} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-cyan-800 mb-2 block">Lokasi</label>
                        <Input 
                          value={displayProfile.location} 
                          disabled 
                          className="bg-cyan-50 text-cyan-700 border-cyan-200" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-cyan-800 mb-2 block">Bio</label>
                      <textarea 
                        value={formState.bio} 
                        onChange={(e) => setFormState({ ...formState, bio: e.target.value })} 
                        disabled={!isEditing || isSaving} 
                        className={`w-full p-3 border rounded-lg resize-none h-24 ${
                          !isEditing 
                            ? "bg-cyan-50 text-cyan-700 border-cyan-200" 
                            : "border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"
                        }`} 
                        placeholder="Ceritakan sedikit tentang diri Anda..."
                      />
                    </div>
                    {isEditing && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="flex space-x-3"
                      >
                        <Button 
                          onClick={handleSaveProfile} 
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg" 
                          disabled={isSaving}
                        >
                          {isSaving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleCancelEdit} 
                          disabled={isSaving}
                          className="border-cyan-400 text-cyan-700 hover:bg-cyan-50"
                        >
                          Batal
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-cyan-900">
                      <Award className="w-5 h-5 text-yellow-500" />
                      <span>Pencapaian & Badge</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((a, i) => (
                        <motion.div 
                          key={a.id} 
                          initial={{ opacity: 0, scale: 0.9 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 ${
                            a.earned 
                              ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg" 
                              : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`text-3xl ${a.earned ? "" : "grayscale opacity-50"}`}>
                              {a.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${a.earned ? "text-green-800" : "text-cyan-800"}`}>
                                {a.title}
                              </h3>
                              <p className="text-sm text-cyan-700 mb-2">{a.description}</p>
                              {a.earned ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300">
                                  <Star className="w-3 h-3 mr-1" />
                                  Diraih {a.date}
                                </Badge>
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm text-cyan-700">
                                    <span>Progress</span>
                                    <span>{a.progress}%</span>
                                  </div>
                                  <div className="w-full bg-cyan-100 rounded-full h-2">
                                    <motion.div 
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                                      initial={{ width: 0 }} 
                                      animate={{ width: `${a.progress}%` }}
                                      transition={{ duration: 1, delay: i * 0.2 }}
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
              </TabsContent>

              <TabsContent value="activity">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-cyan-900">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span>Aktivitas Terbaru</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activities.map((act, i) => (
                        <motion.div 
                          key={act.id} 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ x: 5, scale: 1.01 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getActivityColor(act.type)}`} />
                            <div>
                              <p className="font-medium text-cyan-900">{act.action}</p>
                              <p className="text-sm text-cyan-600">{act.date}</p>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                            <Star className="w-3 h-3 mr-1" />
                            +{act.points} poin
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-cyan-900">
                        <Bell className="w-5 h-5 text-blue-500" />
                        <span>Pengaturan Notifikasi</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                        <div>
                          <h4 className="font-medium text-cyan-900">Notifikasi Donasi</h4>
                          <p className="text-sm text-cyan-700">Terima notifikasi tentang permintaan donasi baru</p>
                        </div>
                        <Switch 
                          checked={notifications.donations} 
                          onCheckedChange={(c) => setNotifications(p => ({ ...p, donations: c }))} 
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                        <div>
                          <h4 className="font-medium text-cyan-900">Aktivitas Komunitas</h4>
                          <p className="text-sm text-cyan-700">Update tentang kegiatan komunitas sekitar</p>
                        </div>
                        <Switch 
                          checked={notifications.community} 
                          onCheckedChange={(c) => setNotifications(p => ({ ...p, community: c }))} 
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                        <div>
                          <h4 className="font-medium text-cyan-900">Pencapaian Baru</h4>
                          <p className="text-sm text-cyan-700">Notifikasi saat meraih badge atau pencapaian</p>
                        </div>
                        <Switch 
                          checked={notifications.achievements} 
                          onCheckedChange={(c) => setNotifications(p => ({ ...p, achievements: c }))} 
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                        <div>
                          <h4 className="font-medium text-cyan-900">Email Marketing</h4>
                          <p className="text-sm text-cyan-700">Tips dan informasi tentang keberlanjutan</p>
                        </div>
                        <Switch 
                          checked={notifications.marketing} 
                          onCheckedChange={(c) => setNotifications(p => ({ ...p, marketing: c }))} 
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-cyan-900">
                        <Shield className="w-5 h-5 text-purple-500" />
                        <span>Keamanan & Privasi</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-cyan-400 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-600"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Ubah Password
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-cyan-400 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-600"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Pengaturan Privasi
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-600 hover:text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hapus Akun
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
