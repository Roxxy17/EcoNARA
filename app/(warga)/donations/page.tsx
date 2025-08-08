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
    high: "bg-red-100 text-red-800",
    low: "bg-green-100 text-green-800",
}

const categoryIcons = {
    food: "🍚",
    clothes: "👕",
    education: "📚",
    health: "🏥",
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
            toast({ title: "Gagal memuat permintaan bantuan.", description: error.message, variant: "destructive" });
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
            toast({ title: "Gagal memuat donasi.", description: error.message, variant: "destructive" });
        } finally {
            setLoadingMyDonations(false);
        }
    };

    const handleCreateNeedRequest = async () => {
        if (!newRequestItemName.trim() || !newRequestDescription.trim() || !newRequestCategory || !newRequestUrgency) {
            toast({ title: "Input tidak lengkap", description: "Mohon lengkapi semua kolom.", variant: "destructive" });
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

            toast({ title: "Permintaan bantuan berhasil dibuat!", variant: "default" });
            setNewRequestItemName("");
            setNewRequestDescription("");
            setNewRequestCategory("others");
            setNewRequestUrgency("low");
            setNewRequestNeeded("");
            setActiveTab("browse");
            fetchNeedsRequests();
        } catch (error: any) {
            console.error("Gagal membuat permintaan bantuan:", error);
            toast({ title: "Gagal membuat permintaan", description: error.message, variant: "destructive" });
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
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
            <Navbar />
          
            <div className="container mx-auto px-4 py-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Card className="text-center bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0 shadow-lg">
                            <CardContent className="p-4">
                                <HandHeart className="w-8 h-8 mx-auto mb-2" />
                                <div className="text-2xl font-bold">156</div>
                                <div className="text-sm opacity-90">Total Donasi</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                        <Card className="text-center bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
                            <CardContent className="p-4">
                                <Users className="w-8 h-8 mx-auto mb-2" />
                                <div className="text-2xl font-bold">89</div>
                                <div className="text-sm opacity-90">Keluarga Terbantu</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <Card className="text-center bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                            <CardContent className="p-4">
                                <Zap className="w-8 h-8 mx-auto mb-2" />
                                <div className="text-2xl font-bold">24</div>
                                <div className="text-sm opacity-90">Permintaan Aktif</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <Card className="text-center bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
                            <CardContent className="p-4">
                                <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                                <div className="text-2xl font-bold">94%</div>
                                <div className="text-sm opacity-90">Tingkat Keberhasilan</div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="browse">Cari Bantuan</TabsTrigger>
                        <TabsTrigger value="my-donations">Donasi Saya</TabsTrigger>
                        <TabsTrigger value="create">Buat Permintaan</TabsTrigger>
                    </TabsList>
                    <TabsContent value="browse" className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="relative md:col-span-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                        <Input
                                            placeholder="Cari permintaan bantuan..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select value={selectedUrgency} onValueChange={setSelectedUrgency} >
                                        <SelectTrigger className="md:col-span-1">
                                            <SelectValue placeholder="Tingkat Urgensi" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Urgensi</SelectItem>
                                            <SelectItem value="high">Sangat Urgent</SelectItem>
                                            <SelectItem value="low">Tidak Urgent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button variant="outline" className="md:col-span-1">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Terdekat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        {loadingNeedsRequests ? (
                            <div className="text-center py-8">
                                <Loader2 className="h-8 w-8 mx-auto animate-spin text-purple-600" />
                                <p className="mt-2 text-gray-600">Memuat permintaan bantuan...</p>
                            </div>
                        ) : needsRequests.length === 0 ? (
                            <p className="text-gray-600 text-center py-8">Tidak ada permintaan bantuan saat ini.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredNeedsRequests.map((request, index) => (
                                    <motion.div
                                        key={request.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm h-full">
                                            <CardHeader>
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-2xl">📦</span>
                                                        <Badge className={request.is_urgent ? urgencyColors.high : urgencyColors.low}>
                                                            {request.is_urgent ? "Sangat Urgent" : "Tidak Urgent"}
                                                        </Badge>
                                                    </div>
                                                    {request.is_verified && (
                                                        <Badge className="bg-blue-100 text-blue-800">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            Terverifikasi
                                                        </Badge>
                                                    )}
                                                </div>
                                                <CardTitle className="text-lg leading-tight">{request.item_name}</CardTitle>
                                                <CardDescription className="text-gray-600 leading-relaxed">{request.description}</CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    {request.needed && request.needed.length > 0 && (
                                                        <>
                                                            <div className="text-sm font-medium text-gray-700">Yang Dibutuhkan:</div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {request.needed.map((item, i) => (
                                                                    <Badge key={i} variant="outline" className="text-xs">
                                                                        {item}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-1">
                                                        <Users className="w-4 h-4" />
                                                        <span>Oleh {request.users.nama}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{new Date(request.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="text-sm text-gray-600">
                                                        Donasi belum terkumpul
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                                        >
                                                            <Heart className="w-4 h-4 mr-2" />
                                                            Bantu
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="my-donations" className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Riwayat Donasi Saya</CardTitle>
                                <CardDescription>Lacak semua kontribusi Anda untuk komunitas</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingMyDonations ? (
                                    <div className="text-center py-8">
                                        <Loader2 className="h-8 w-8 mx-auto animate-spin text-purple-600" />
                                        <p className="mt-2 text-gray-600">Memuat riwayat donasi...</p>
                                    </div>
                                ) : myDonations.length === 0 ? (
                                    <p className="text-gray-600 text-center py-8">Anda belum memiliki riwayat donasi.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {myDonations.map((donation: Donation, index) => (
                                            <motion.div
                                                key={donation.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-green-600`}>
                                                        <CheckCircle className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-800">{donation.item_name}</h4>
                                                        <p className="text-sm text-gray-600">{donation.description}</p>
                                                        <p className="text-sm text-gray-500">
                                                            Dicatat pada: {new Date(donation.created_at).toLocaleDateString("id-ID")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className="bg-green-100 text-green-800">Terkirim</Badge>
                                                    <div className="text-sm text-gray-600 mt-1">Donasi Anda</div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="create" className="space-y-6">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle>Buat Permintaan Bantuan</CardTitle>
                                <CardDescription>Sampaikan kebutuhan Anda kepada komunitas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Judul Permintaan</label>
                                            <Input
                                                placeholder="Contoh: Bantuan Makanan untuk Keluarga Kurang Mampu"
                                                value={newRequestItemName}
                                                onChange={(e) => setNewRequestItemName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Deskripsi Detail Kebutuhan</label>
                                            <Textarea
                                                placeholder="Jelaskan kebutuhan Anda secara detail, seperti jumlah, ukuran, atau kondisi spesifik..."
                                                className="h-32"
                                                value={newRequestDescription}
                                                onChange={(e) => setNewRequestDescription(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Kategori</label>
                                            <Select value={newRequestCategory} onValueChange={setNewRequestCategory}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih kategori" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="food">Makanan</SelectItem>
                                                    <SelectItem value="clothes">Pakaian</SelectItem>
                                                    <SelectItem value="education">Pendidikan</SelectItem>
                                                    <SelectItem value="health">Kesehatan</SelectItem>
                                                    <SelectItem value="electronics">Elektronik</SelectItem>
                                                    <SelectItem value="others">Lainnya</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Tingkat Urgensi</label>
                                            <Select value={newRequestUrgency} onValueChange={setNewRequestUrgency}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih tingkat urgensi" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="high">Sangat Urgent</SelectItem>
                                                    <SelectItem value="low">Tidak Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 block">Barang yang Dibutuhkan</label>
                                            <Textarea 
                                                placeholder="Contoh: Beras 10kg, Minyak goreng 2L, Gula 1kg..." 
                                                className="h-20"
                                                value={newRequestNeeded}
                                                onChange={(e) => setNewRequestNeeded(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <AlertCircle className="w-5 h-5 text-blue-600" />
                                    <div className="text-sm text-blue-800">
                                        <strong>Catatan:</strong> Permintaan akan diverifikasi oleh admin RT sebelum dipublikasikan.
                                    </div>
                                </div>
                                <div className="flex space-x-4">
                                    <Button
                                        onClick={handleCreateNeedRequest}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Mengirim...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" /> Kirim Permintaan
                                            </>
                                        )}
                                    </Button>
                                    <Button variant="outline">Simpan Draft</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}