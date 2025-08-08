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
  Edit3, Save, X, Star, Trophy, Calendar, MapPin, Globe, Loader2
} from "lucide-react"
import Link from "next/link"
import { useUser } from "@/contexts/UserContext"

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
    <div className="min-h-screen bg-gray-50 p-4 animate-pulse">
        <header className="bg-white/90 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm"><div className="container mx-auto px-4 py-4"><div className="flex items-center justify-between"><div className="flex items-center space-x-4"><div className="w-24 h-8 bg-gray-200 rounded-md"></div><div className="flex items-center space-x-2"><div className="w-8 h-8 bg-gray-200 rounded-lg"></div><div><div className="w-32 h-6 bg-gray-200 rounded-md"></div><div className="w-48 h-4 mt-1 bg-gray-200 rounded-md"></div></div></div></div><div className="w-28 h-10 bg-gray-200 rounded-md"></div></div></div></header>
        <div className="container mx-auto px-4 py-8"><div className="grid grid-cols-1 lg:grid-cols-4 gap-8"><div className="lg-col-span-1"><Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"><CardContent className="p-6 text-center"><div className="w-24 h-24 mx-auto rounded-full bg-gray-200 mb-4"></div><div className="w-3/4 h-6 mx-auto bg-gray-200 rounded-md mb-2"></div><div className="w-1/2 h-4 mx-auto bg-gray-200 rounded-md mb-4"></div><div className="space-y-2"><div className="w-2/3 h-4 mx-auto bg-gray-200 rounded-md"></div><div className="w-2/3 h-4 mx-auto bg-gray-200 rounded-md"></div></div><Separator className="my-4 bg-gray-200" /><div className="grid grid-cols-2 gap-4">{[...Array(4)].map((_, i) => (<div key={i} className="text-center space-y-1"><div className="w-8 h-8 mx-auto bg-gray-200 rounded-full"></div><div className="w-full h-4 bg-gray-200 rounded-md"></div><div className="w-3/4 h-3 mx-auto bg-gray-200 rounded-md"></div></div>))}</div></CardContent></Card></div><div className="lg:col-span-3 space-y-6"><div className="grid w-full grid-cols-4 gap-2">{[...Array(4)].map((_, i) => (<div key={i} className="w-full h-10 bg-gray-200 rounded-md"></div>))}</div><Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm"><CardHeader><div className="w-1/2 h-6 bg-gray-200 rounded-md"></div></CardHeader><CardContent className="space-y-4">{[...Array(2)].map((_, i) => (<div key={i} className="grid grid-cols-2 gap-4"><div className="space-y-2"><div className="w-1/3 h-4 bg-gray-200 rounded-md"></div><div className="w-full h-10 bg-gray-200 rounded-md"></div></div><div className="space-y-2"><div className="w-1/3 h-4 bg-gray-200 rounded-md"></div><div className="w-full h-10 bg-gray-200 rounded-md"></div></div></div>))}<div className="w-full h-24 bg-gray-200 rounded-md"></div><div className="flex space-x-3"><div className="w-32 h-10 bg-gray-200 rounded-md"></div><div className="w-24 h-10 bg-gray-200 rounded-md"></div></div></CardContent></Card></div></div></div>
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
      { label: "Total Poin", value: displayProfile.totalPoints.toLocaleString(), icon: Star, color: "text-yellow-500" },
      { label: "Makanan Diselamatkan", value: "156kg", icon: Leaf, color: "text-green-500" },
      { label: "Keluarga Terbantu", value: "23", icon: Heart, color: "text-red-500" },
      { label: "Sampah Didaur Ulang", value: "89kg", icon: Trophy, color: "text-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <header className="bg-white/90 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Kembali</Button></Link>
              <div className="flex items-center space-x-2"><div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center"><User className="w-5 h-5 text-white" /></div><div><h1 className="text-xl font-bold text-gray-800">Profil Saya</h1><p className="text-sm text-gray-600">Kelola informasi dan pengaturan akun</p></div></div>
            </div>
            {isEditing ? (<Button onClick={handleCancelEdit} className="bg-red-500 hover:bg-red-600" disabled={isSaving}><X className="w-4 h-4 mr-2" /> Batal</Button>) : (<Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600"><Edit3 className="w-4 h-4 mr-2" /> Edit Profil</Button>)}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <Avatar className="w-24 h-24 mx-auto"><AvatarImage src={userProfile?.avatar_url || ""} /><AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-white">{userInitial}</AvatarFallback></Avatar>
                    {isEditing && (<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2 bg-blue-500 text-white p-2 rounded-full shadow-lg"><Camera className="w-4 h-4" /></motion.button>)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{formState.name || "Nama Belum Diisi"}</h2>
                  <Badge className="bg-green-100 text-green-800 mb-3">{displayProfile.level}</Badge>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center space-x-2"><MapPin className="w-4 h-4" /><span>{displayProfile.location}</span></div>
                    <div className="flex items-center justify-center space-x-2"><Calendar className="w-4 h-4" /><span>Bergabung {displayProfile.joinDate}</span></div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (<motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="text-center"><stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-1`} /><div className="font-bold text-gray-800">{stat.value}</div><div className="text-xs text-gray-600">{stat.label}</div></motion.div>))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="achievements">Pencapaian</TabsTrigger><TabsTrigger value="activity">Aktivitas</TabsTrigger><TabsTrigger value="settings">Pengaturan</TabsTrigger></TabsList>
              <TabsContent value="overview">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader><CardTitle className="flex items-center space-x-2"><User className="w-5 h-5" /><span>Informasi Pribadi</span></CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="text-sm font-medium text-gray-700 mb-2 block">Nama Lengkap</label><Input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} disabled={!isEditing || isSaving} className={!isEditing ? "bg-gray-50" : ""} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-2 block">Email</label><Input value={displayProfile.email} disabled className={"bg-gray-50"} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-2 block">Nomor Telepon</label><Input value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} disabled={!isEditing || isSaving} className={!isEditing ? "bg-gray-50" : ""} /></div>
                      <div><label className="text-sm font-medium text-gray-700 mb-2 block">Lokasi</label><Input value={displayProfile.location} disabled className={"bg-gray-50"} /></div>
                    </div>
                    <div><label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label><textarea value={formState.bio} onChange={(e) => setFormState({ ...formState, bio: e.target.value })} disabled={!isEditing || isSaving} className={`w-full p-3 border rounded-lg resize-none h-24 ${!isEditing ? "bg-gray-50 text-gray-500" : ""}`} /></div>
                    {isEditing && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex space-x-3"><Button onClick={handleSaveProfile} className="bg-green-500 hover:bg-green-600" disabled={isSaving}>{isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}{isSaving ? "Menyimpan..." : "Simpan Perubahan"}</Button><Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>Batal</Button></motion.div>)}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="achievements">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader><CardTitle className="flex items-center space-x-2"><Award className="w-5 h-5" /><span>Pencapaian & Badge</span></CardTitle></CardHeader>
                  <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{achievements.map((a, i) => (<motion.div key={a.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} className={`p-4 rounded-lg border-2 ${a.earned ? "bg-green-50 border-green-200" : "bg-gray-50"}`}><div className="flex items-start space-x-3"><div className={`text-3xl ${a.earned ? "" : "grayscale opacity-50"}`}>{a.icon}</div><div className="flex-1"><h3 className={`font-semibold ${a.earned ? "text-green-800" : "text-gray-600"}`}>{a.title}</h3><p className="text-sm text-gray-600 mb-2">{a.description}</p>{a.earned ? <Badge className="bg-green-100 text-green-800">Diraih {a.date}</Badge> : <div><div className="flex justify-between text-sm"><span>Progress</span><span>{a.progress}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><motion.div className="bg-blue-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${a.progress}%` }} /></div></div>}</div></div></motion.div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="activity">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader><CardTitle className="flex items-center space-x-2"><TrendingUp className="w-5 h-5" /><span>Aktivitas Terbaru</span></CardTitle></CardHeader>
                  <CardContent><div className="space-y-4">{activities.map((act, i) => (<motion.div key={act.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"><div className="flex items-center space-x-3"><div className={`w-3 h-3 rounded-full ${act.type === "donation" ? "bg-green-500" : "bg-blue-500"}`} /><div><p className="font-medium">{act.action}</p><p className="text-sm text-gray-500">{act.date}</p></div></div><Badge className="bg-blue-100 text-blue-800">+{act.points} poin</Badge></motion.div>))}</div></CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader><CardTitle className="flex items-center space-x-2"><Bell className="w-5 h-5" /><span>Notifikasi</span></CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between"><div><h4 className="font-medium">Notifikasi Donasi</h4><p className="text-sm text-gray-600">Terima notifikasi tentang permintaan donasi baru</p></div><Switch checked={notifications.donations} onCheckedChange={(c) => setNotifications(p => ({ ...p, donations: c }))} /></div>
                      <div className="flex items-center justify-between"><div><h4 className="font-medium">Aktivitas Komunitas</h4><p className="text-sm text-gray-600">Update tentang kegiatan komunitas sekitar</p></div><Switch checked={notifications.community} onCheckedChange={(c) => setNotifications(p => ({ ...p, community: c }))} /></div>
                      <div className="flex items-center justify-between"><div><h4 className="font-medium">Pencapaian Baru</h4><p className="text-sm text-gray-600">Notifikasi saat meraih badge atau pencapaian</p></div><Switch checked={notifications.achievements} onCheckedChange={(c) => setNotifications(p => ({ ...p, achievements: c }))} /></div>
                      <div className="flex items-center justify-between"><div><h4 className="font-medium">Email Marketing</h4><p className="text-sm text-gray-600">Tips dan informasi tentang keberlanjutan</p></div><Switch checked={notifications.marketing} onCheckedChange={(c) => setNotifications(p => ({ ...p, marketing: c }))} /></div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader><CardTitle className="flex items-center space-x-2"><Shield className="w-5 h-5" /><span>Keamanan & Privasi</span></CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start bg-transparent"><Shield className="w-4 h-4 mr-2" />Ubah Password</Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent"><Globe className="w-4 h-4 mr-2" />Pengaturan Privasi</Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 bg-transparent"><X className="w-4 h-4 mr-2" />Hapus Akun</Button>
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