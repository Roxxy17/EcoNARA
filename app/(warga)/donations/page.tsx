"use client"
import React, { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
    Heart,
    Plus,
    Search,
    MapPin,
    Clock,
    Users,
    Package,
    AlertCircle,
    CheckCircle,
    Truck,
    HandHeart,
    Target,
    Zap,
    Calendar,
    Phone,
    Loader2,
    Sparkles,
    Gift,
    HelpingHand,
} from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Donation {
    id: number
    user_id: string
    item_name: string
    description: string
    created_at: string
}

interface NeedRequest {
    id: number;
    user_id: string;
    item_name: string;
    description: string;
    is_urgent: boolean;
    latitude?: number;
    longitude?: number;
    created_at: string;
    category?: string | null;
    needed?: string[] | null;
    is_verified?: boolean;
    users: {
        nama: string;
    };
}

const urgencyColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    low: "bg-green-100 text-green-800 border-green-200",
}

const categoryIcons = {
    food: "🍚",
    clothes: "👕",
    education: "📚",
    health: "🏥",
    electronics: "💻",
    others: "📦",
}

export default function DonationsPage() {
    const [activeTab, setActiveTab] = useState("browse");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUrgency, setSelectedUrgency] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const [needsRequests, setNeedsRequests] = useState<NeedRequest[]>([]);
    const [loadingNeedsRequests, setLoadingNeedsRequests] = useState(true);

    const [myDonations, setMyDonations] = useState<Donation[]>([]);
    const [loadingMyDonations, setLoadingMyDonations] = useState(true);

    const { toast } = useToast();
    const supabase = createClientComponentClient();

    const [newRequestItemName, setNewRequestItemName] = useState("");
    const [newRequestDescription, setNewRequestDescription] = useState("");
    const [newRequestCategory, setNewRequestCategory] = useState("food");
    const [newRequestUrgency, setNewRequestUrgency] = useState("low");
    const [newRequestNeeded, setNewRequestNeeded] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchNeedsRequests = async () => {
        setLoadingNeedsRequests(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) {
                throw new Error("Tidak ada token otorisasi ditemukan.");
            }

            const res = await fetch("/api/needs", {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || res.statusText);
            }

            const data: NeedRequest[] = await res.json();
            setNeedsRequests(data);
        } catch (error: any) {
            console.error("Gagal mengambil permintaan kebutuhan:", error);
            toast({ 
                title: "Gagal memuat permintaan bantuan.", 
                description: error.message, 
                variant: "destructive",
                className: "bg-red-50 border-red-200 text-red-900"
            });
        } finally {
            setLoadingNeedsRequests(false);
        }
    };

    const fetchMyDonations = async () => {
        setLoadingMyDonations(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) {
                throw new Error("Tidak ada token otorisasi.");
            }

            const res = await fetch("/api/donations", {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || res.statusText);
            }

            const data: Donation[] = await res.json();
            setMyDonations(data);
        } catch (error: any) {
            console.error("Gagal mengambil donasi saya:", error);
            toast({ 
                title: "Gagal memuat donasi.", 
                description: error.message, 
                variant: "destructive",
                className: "bg-red-50 border-red-200 text-red-900"
            });
        } finally {
            setLoadingMyDonations(false);
        }
    };

    const handleCreateNeedRequest = async () => {
        if (!newRequestItemName.trim() || !newRequestDescription.trim() || !newRequestCategory || !newRequestUrgency) {
            toast({ 
                title: "Input tidak lengkap", 
                description: "Mohon lengkapi semua kolom.", 
                variant: "destructive",
                className: "bg-red-50 border-red-200 text-red-900"
            });
            return;
        }
        setIsSubmitting(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("Tidak ada token otorisasi.");

            const res = await fetch("/api/needs", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    item_name: newRequestItemName.trim(),
                    description: newRequestDescription.trim(),
                    is_urgent: newRequestUrgency === "high",
                    category: newRequestCategory,
                    needed: newRequestNeeded.split(',').map(item => item.trim()),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || res.statusText);
            }

            toast({ 
                title: "Permintaan bantuan berhasil dibuat!", 
                variant: "default",
                className: "bg-green-50 border-green-200 text-green-900"
            });
            setNewRequestItemName("");
            setNewRequestDescription("");
            setNewRequestCategory("others");
            setNewRequestUrgency("low");
            setNewRequestNeeded("");
            setActiveTab("browse");
            fetchNeedsRequests();
        } catch (error: any) {
            console.error("Gagal membuat permintaan bantuan:", error);
            toast({ 
                title: "Gagal membuat permintaan", 
                description: error.message, 
                variant: "destructive",
                className: "bg-red-50 border-red-200 text-red-900"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (activeTab === "my-donations") {
            fetchMyDonations();
        } else if (activeTab === "browse") {
            fetchNeedsRequests();
        }
    }, [activeTab]);

    const filteredNeedsRequests = needsRequests.filter((request) => {
        const matchesSearch =
            request.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "all" || request.category === selectedCategory;
        const matchesUrgency = selectedUrgency === "all" || (selectedUrgency === "high" && request.is_urgent) || (selectedUrgency === "low" && !request.is_urgent);
        return matchesSearch && matchesCategory && matchesUrgency;
    });

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
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl shadow-pink-500/25">
                                <HandHeart className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    Platform Donasi Komunitas
                                </h1>
                                <p className="text-sm text-cyan-700/80 flex items-center">
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    Berbagi kebaikan dan membantu sesama dalam komunitas
                                </p>
                            </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg">
                            <Heart className="w-3 h-3 mr-1" />
                            Donasi Aktif
                        </Badge>
                    </div>
                </div>
            </header>
          
            <div className="container mx-auto px-4 py-8 relative z-10">
                {/* Enhanced Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="text-center bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <HandHeart className="w-7 h-7" />
                                </div>
                                <div className="text-3xl font-bold mb-1">156</div>
                                <div className="text-sm opacity-90">Total Donasi</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div className="text-3xl font-bold mb-1">89</div>
                                <div className="text-sm opacity-90">Keluarga Terbantu</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="text-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <div className="text-3xl font-bold mb-1">24</div>
                                <div className="text-sm opacity-90">Permintaan Aktif</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-7 h-7" />
                                </div>
                                <div className="text-3xl font-bold mb-1">94%</div>
                                <div className="text-sm opacity-90">Tingkat Keberhasilan</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 bg-white/90 backdrop-blur-sm border border-cyan-100/50 shadow-lg rounded-xl p-1">
                        <TabsTrigger value="browse" className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg">
                            <Search className="w-4 h-4 mr-2" />
                            Cari Bantuan
                        </TabsTrigger>
                        <TabsTrigger value="my-donations" className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg">
                            <Gift className="w-4 h-4 mr-2" />
                            Donasi Saya
                        </TabsTrigger>
                        <TabsTrigger value="create" className="text-cyan-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-lg">
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Permintaan
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="browse" className="space-y-6">
                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-cyan-900">
                                    <Search className="w-5 h-5 text-pink-600" />
                                    <span>Pencarian & Filter</span>
                                </CardTitle>
                                <CardDescription className="text-cyan-700">
                                    Temukan permintaan bantuan yang sesuai dengan kemampuan Anda
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative md:col-span-2">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-600 w-4 h-4" />
                                        <Input
                                            placeholder="Cari permintaan bantuan..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"
                                        />
                                    </div>
                                    <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
                                        <SelectTrigger className="border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900">
                                            <SelectValue placeholder="Tingkat Urgensi" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white border border-cyan-200">
                                            <SelectItem value="all" className="text-cyan-900">Semua Urgensi</SelectItem>
                                            <SelectItem value="high" className="text-cyan-900">Sangat Urgent</SelectItem>
                                            <SelectItem value="low" className="text-cyan-900">Tidak Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" className="border-cyan-400 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-600">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Terdekat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {loadingNeedsRequests ? (
                            <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-cyan-100/50 shadow-lg">
                                <Loader2 className="h-10 w-10 mx-auto animate-spin text-pink-600 mb-4" />
                                <p className="text-cyan-700 text-lg">Memuat permintaan bantuan...</p>
                            </div>
                        ) : needsRequests.length === 0 ? (
                            <div className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl border border-cyan-100/50 shadow-lg">
                                <HelpingHand className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                <p className="text-cyan-700 text-lg mb-2">Tidak ada permintaan bantuan saat ini</p>
                                <p className="text-cyan-600">Terima kasih atas kebaikan hati Anda</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredNeedsRequests.map((request, index) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                    >
                                        <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full border border-cyan-100/50">
                                            <CardHeader>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                            <span className="text-2xl">{categoryIcons[request.category as keyof typeof categoryIcons] || "📦"}</span>
                                                        </div>
                                                        <Badge className={cn("border", request.is_urgent ? urgencyColors.high : urgencyColors.low)}>
                                                            {request.is_urgent ? "Sangat Urgent" : "Tidak Urgent"}
                                                        </Badge>
                                                    </div>
                                                    {request.is_verified && (
                                                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Terverifikasi
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="text-xl leading-tight text-cyan-900">{request.item_name}</CardTitle>
                                                <CardDescription className="text-cyan-700 leading-relaxed">{request.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-3">
                                                    {request.needed && request.needed.length > 0 && (
                                                        <>
                                                            <div className="text-sm font-semibold text-cyan-800">Yang Dibutuhkan:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {request.needed.map((item, i) => (
                                                                    <Badge key={i} variant="outline" className="text-xs border-cyan-300 text-cyan-700 bg-cyan-50">
                                                                        {item}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-cyan-600 bg-cyan-50/50 p-3 rounded-lg">
                                                    <div className="flex items-center space-x-2">
                                                        <Users className="w-4 h-4 text-purple-500" />
                                                        <span>Oleh {request.users.nama}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4 text-purple-500" />
                                                        <span>{new Date(request.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-cyan-100">
                                                    <div className="text-sm text-cyan-600 flex items-center space-x-1">
                                                        <AlertCircle className="w-4 h-4" />
                                                        <span>Donasi belum terkumpul</span>
                                                    </div>
                                                    <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                                        <Heart className="w-4 h-4 mr-2" />
                                                        Bantu
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="my-donations" className="space-y-6">
                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-cyan-900">
                                    <Gift className="w-5 h-5 text-pink-600" />
                                    <span>Riwayat Donasi Saya</span>
                                </CardTitle>
                                <CardDescription className="text-cyan-700">
                                    Lacak semua kontribusi Anda untuk komunitas
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingMyDonations ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="h-10 w-10 mx-auto animate-spin text-pink-600 mb-4" />
                                        <p className="text-cyan-700 text-lg">Memuat riwayat donasi...</p>
                                    </div>
                                ) : myDonations.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Gift className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                                        <p className="text-cyan-700 text-lg mb-2">Anda belum memiliki riwayat donasi</p>
                                        <p className="text-cyan-600">Mulai berbagi kebaikan dengan komunitas</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myDonations.map((donation: Donation, index) => (
                                            <motion.div
                                                key={donation.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-cyan-50 rounded-xl hover:from-green-100 hover:to-cyan-100 transition-all duration-300 border border-green-200/50 shadow-lg"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                                        <CheckCircle className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-cyan-900 text-lg">{donation.item_name}</h4>
                                                        <p className="text-sm text-cyan-700 mb-1">{donation.description}</p>
                                                        <p className="text-sm text-cyan-600 flex items-center">
                                                            <Clock className="w-3 h-3 mr-1" />
                                                            Dicatat pada: {new Date(donation.created_at).toLocaleDateString("id-ID")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className="bg-green-100 text-green-800 border border-green-200 mb-2">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Terkirim
                                                    </Badge>
                                                    <div className="text-sm text-cyan-600 font-medium">Donasi Anda</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="create" className="space-y-6">
                        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-cyan-900">
                                    <Plus className="w-5 h-5 text-pink-600" />
                                    <span>Buat Permintaan Bantuan</span>
                                </CardTitle>
                                <CardDescription className="text-cyan-700">
                                    Sampaikan kebutuhan Anda kepada komunitas dengan detail yang jelas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div>
                                            <Label htmlFor="title" className="text-sm font-semibold text-cyan-800 mb-2 block">
                                                Judul Permintaan
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="Contoh: Bantuan Makanan untuk Keluarga Kurang Mampu"
                                                value={newRequestItemName}
                                                onChange={(e) => setNewRequestItemName(e.target.value)}
                                                className="border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="description" className="text-sm font-semibold text-cyan-800 mb-2 block">
                                                Deskripsi Detail Kebutuhan
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Jelaskan kebutuhan Anda secara detail, seperti jumlah, ukuran, atau kondisi spesifik..."
                                                className="h-32 border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"
                                                value={newRequestDescription}
                                                onChange={(e) => setNewRequestDescription(e.target.value)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="category" className="text-sm font-semibold text-cyan-800 mb-2 block">
                                                    Kategori
                                                </Label>
                                                <Select value={newRequestCategory} onValueChange={setNewRequestCategory}>
                                                    <SelectTrigger className="border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900">
                                                        <SelectValue placeholder="Pilih kategori" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border border-cyan-200">
                                                        <SelectItem value="food" className="text-cyan-900">🍚 Makanan</SelectItem>
                                                        <SelectItem value="clothes" className="text-cyan-900">👕 Pakaian</SelectItem>
                                                        <SelectItem value="education" className="text-cyan-900">📚 Pendidikan</SelectItem>
                                                        <SelectItem value="health" className="text-cyan-900">🏥 Kesehatan</SelectItem>
                                                        <SelectItem value="electronics" className="text-cyan-900">💻 Elektronik</SelectItem>
                                                        <SelectItem value="others" className="text-cyan-900">📦 Lainnya</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="urgency" className="text-sm font-semibold text-cyan-800 mb-2 block">
                                                    Tingkat Urgensi
                                                </Label>
                                                <Select value={newRequestUrgency} onValueChange={setNewRequestUrgency}>
                                                    <SelectTrigger className="border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900">
                                                        <SelectValue placeholder="Pilih tingkat urgensi" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white border border-cyan-200">
                                                        <SelectItem value="high" className="text-cyan-900">🚨 Sangat Urgent</SelectItem>
                                                        <SelectItem value="low" className="text-cyan-900">⏰ Tidak Urgent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="needed" className="text-sm font-semibold text-cyan-800 mb-2 block">
                                                Barang yang Dibutuhkan
                                            </Label>
                                            <Textarea 
                                                id="needed"
                                                placeholder="Contoh: Beras 10kg, Minyak goreng 2L, Gula 1kg..." 
                                                className="h-20 border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"
                                                value={newRequestNeeded}
                                                onChange={(e) => setNewRequestNeeded(e.target.value)}
                                            />
                                            <p className="text-xs text-cyan-600 mt-1">Pisahkan dengan koma (,) untuk setiap item</p>
                                        </div>
                                    </div>

                                    {/* Preview Card */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-cyan-900 flex items-center">
                                            <Sparkles className="w-5 h-5 mr-2 text-pink-500" />
                                            Preview Permintaan
                                        </h3>
                                        <Card className="border-2 border-dashed border-cyan-300 bg-gradient-to-br from-cyan-50/50 to-blue-50/50">
                                            <CardHeader>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-lg">{categoryIcons[newRequestCategory as keyof typeof categoryIcons] || "📦"}</span>
                                                    </div>
                                                    <Badge className={cn("border", newRequestUrgency === "high" ? urgencyColors.high : urgencyColors.low)}>
                                                        {newRequestUrgency === "high" ? "Sangat Urgent" : "Tidak Urgent"}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg text-cyan-900">
                                                    {newRequestItemName || "Judul permintaan akan muncul di sini"}
                                                </CardTitle>
                                                <CardDescription className="text-cyan-700">
                                                    {newRequestDescription || "Deskripsi detail akan muncul di sini"}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                {newRequestNeeded && (
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium text-cyan-800">Yang Dibutuhkan:</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {newRequestNeeded.split(',').map((item, i) => (
                                                                <Badge key={i} variant="outline" className="text-xs border-cyan-300 text-cyan-700 bg-cyan-50">
                                                                    {item.trim()}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                    <div className="text-sm text-blue-800">
                                        <strong>Catatan:</strong> Permintaan akan diverifikasi oleh admin RT sebelum dipublikasikan untuk memastikan kebutuhan yang valid.
                                    </div>
                                </div>

                                <div className="flex space-x-4 pt-4 border-t border-cyan-100">
                                    <Button
                                        onClick={handleCreateNeedRequest}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                                                Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" /> 
                                                Kirim Permintaan
                                            </>
                                        )}
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="border-cyan-400 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-600"
                                    >
                                        <Package className="w-4 h-4 mr-2" />
                                        Simpan Draft
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}