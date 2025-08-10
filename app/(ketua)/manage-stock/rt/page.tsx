"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
    Loader2,
    Package,
    Users,
    Home,
    AlertTriangle,
    CheckCircle,
    X,
    RefreshCw
} from 'lucide-react'
import { Navbar } from "@/components/navigation/nav-dashboard"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/UserContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Interface untuk struktur data stok
interface StockItem {
    id: string
    name: string
    category: string | null
    added_date: string
    quantity: number | null
    unit: string | null
    created_at: string
    user_id: string
    user_name?: string
    status?: 'tersedia' | 'menipis' | 'habis'
}

// Interface untuk total stok per kategori
interface TotalStockByCategory {
    category: string;
    totalQuantity: number;
}

// Interface untuk status keluarga
interface FamilyStatus {
    id: string;
    name: string;
    hasShortage: boolean;
}

// Konfigurasi visual untuk setiap status
const statusConfig = {
    tersedia: {
        icon: CheckCircle,
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-800",
        borderColor: "border-emerald-200",
    },
    menipis: {
        icon: AlertTriangle,
        bgColor: "bg-amber-50",
        textColor: "text-amber-800",
        borderColor: "border-amber-200",
    },
    habis: {
        icon: X,
        bgColor: "bg-red-50",
        textColor: "text-red-800",
        borderColor: "border-red-200",
    },
};


export default function ManageStockKetuaPage() {
    const { userProfile, loadingUser } = useUser();
    const [allDesaStockItems, setAllDesaStockItems] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);
    const supabase = createClientComponentClient();

    const getStockStatus = (quantity: number | null): StockItem['status'] => {
        if (quantity === null || quantity <= 0) return 'habis';
        if (quantity <= 20) return 'menipis';
        return 'tersedia';
    };

    const fetchAllDesaStockItems = async () => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

            const res = await fetch("/api/stock", {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                let errorData = { message: "Gagal mengambil item stok desa." };
                try {
                    const parsedData = await res.json();
                    errorData.message = parsedData.message || res.statusText;
                } catch {
                    errorData.message = res.statusText || "Respons server tidak valid.";
                }
                throw new Error(errorData.message);
            }

            const data: StockItem[] = await res.json();
            const itemsWithStatus = data.map(item => ({
                ...item,
                status: getStockStatus(item.quantity)
            }));
            setAllDesaStockItems(itemsWithStatus);
        } catch (e: any) {
            console.error("Error fetching all desa stock items:", e);
            setError(e.message);
            setMessage({ type: 'error', text: `Gagal memuat data stok desa: ${e.message}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!loadingUser && userProfile) {
            if (userProfile.role === 'ketua' || userProfile.role === 'admin') {
                fetchAllDesaStockItems();
            } else {
                setError("Akses Ditolak: Anda tidak memiliki izin untuk melihat halaman ini.");
                setLoading(false);
            }
        } else if (!loadingUser && !userProfile) {
            setLoading(false);
            setError("Pengguna tidak terautentikasi. Mohon login.");
        }
    }, [userProfile, loadingUser]);

    const totalStockByCategory: TotalStockByCategory[] = useMemo(() => {
        const totals: { [key: string]: number } = {};
        allDesaStockItems.forEach(item => {
            if (item.category && item.quantity !== null) {
                totals[item.category] = (totals[item.category] || 0) + item.quantity;
            }
        });
        return Object.entries(totals).map(([category, totalQuantity]) => ({
            category,
            totalQuantity,
        })).sort((a, b) => a.category.localeCompare(b.category));
    }, [allDesaStockItems]);

    const familiesWithShortageStatus: FamilyStatus[] = useMemo(() => {
        const familyStatus = new Map<string, { name: string, hasShortage: boolean }>();
        allDesaStockItems.forEach(item => {
            if (item.user_id && item.user_name) {
                if (!familyStatus.has(item.user_id)) {
                    familyStatus.set(item.user_id, { name: item.user_name, hasShortage: false });
                }
                if (item.status === 'menipis' || item.status === 'habis') {
                    const currentFamily = familyStatus.get(item.user_id);
                    if (currentFamily) {
                        currentFamily.hasShortage = true;
                    }
                }
            }
        });
        return Array.from(familyStatus.entries()).map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => (b.hasShortage ? 1 : 0) - (a.hasShortage ? 1 : 0) || a.name.localeCompare(b.name));
    }, [allDesaStockItems]);

    const familiesInNeed = useMemo(() => {
        return familiesWithShortageStatus.filter(family => family.hasShortage);
    }, [familiesWithShortageStatus]);

    // Menghitung statistik keseluruhan desa untuk kartu di bagian atas
    const desaStockStats = useMemo(() => {
        const total = allDesaStockItems.length;
        const tersedia = allDesaStockItems.filter(item => item.status === 'tersedia').length;
        const menipis = allDesaStockItems.filter(item => item.status === 'menipis').length;
        const habis = allDesaStockItems.filter(item => item.status === 'habis').length;
        return { total, tersedia, menipis, habis };
    }, [allDesaStockItems]);


    const filteredFamilyStock = useMemo(() => {
        if (!selectedFamilyId) return [];
        return allDesaStockItems.filter(item => item.user_id === selectedFamilyId);
    }, [allDesaStockItems, selectedFamilyId]);


    if (loading || loadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
                <span className="ml-4 text-lg text-gray-700">Memuat data desa...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center">
                <Navbar />
                <div className="text-center p-8">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <h2 className="mt-4 text-2xl font-bold text-red-800">Terjadi Kesalahan</h2>
                    <p className="mt-2 text-red-600">{error}</p>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
            {/* Animated Blobs */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <Navbar />

            {/* Enhanced Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25">
                                <Home className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                                    Dashboard Ketua Desa {userProfile?.desa_id ? `(${userProfile.desa_id})` : ''}
                                </h1>
                                <p className="text-sm text-blue-700/80">Ringkasan kondisi pangan seluruh warga.</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge className="bg-gradient-to-r from-blue-400 to-teal-500 text-white shadow-lg">
                                <Users className="w-3 h-3 mr-1.5" />
                                {familiesWithShortageStatus.length} Total Keluarga
                            </Badge>
                            <Badge className="bg-amber-100/80 text-amber-800 backdrop-blur-sm border border-amber-300">
                                <AlertTriangle className="w-3 h-3 mr-1.5" />
                                {familiesInNeed.length} Keluarga Perlu Perhatian
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 relative z-10">

                {/* Stats Cards - Ringkasan Status Stok Desa */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={CheckCircle} value={desaStockStats.tersedia} label="Item Tersedia" color="from-emerald-400 via-teal-400 to-cyan-400" shadowColor="shadow-emerald-500/25" />
                    <StatCard icon={AlertTriangle} value={desaStockStats.menipis} label="Item Menipis" color="from-amber-400 via-orange-400 to-yellow-400" shadowColor="shadow-amber-500/25" />
                    <StatCard icon={X} value={desaStockStats.habis} label="Item Habis" color="from-red-400 via-pink-400 to-rose-400" shadowColor="shadow-red-500/25" />
                    <StatCard icon={Package} value={desaStockStats.total} label="Total Jenis Item" color="from-blue-400 via-indigo-400 to-purple-400" shadowColor="shadow-blue-500/25" />
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Kolom Kiri: Agregat dan Daftar Keluarga Kritis */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Agregat Stok Pangan Desa */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-green-100/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-blue-900">
                                        <Package className="w-6 h-6 text-blue-600" />
                                        <span>Agregat Stok Pangan Desa</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {totalStockByCategory.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="border-blue-100">
                                                    <TableHead className="font-semibold text-blue-800">Kategori</TableHead>
                                                    <TableHead className="text-right font-semibold text-blue-800">Total Qty</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {totalStockByCategory.map((data) => (
                                                    <TableRow key={data.category} className="border-blue-50">
                                                        <TableCell className="font-medium text-gray-800">{data.category}</TableCell>
                                                        <TableCell className="text-right font-bold text-gray-900">{data.totalQuantity}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : <p className="text-gray-500 text-center py-4">Data agregat kosong.</p>}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Warga Perlu Perhatian */}
                        {familiesInNeed.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="border-0 shadow-xl bg-amber-50/90 backdrop-blur-xl border-amber-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2 text-amber-900">
                                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                                            <span>Warga Perlu Perhatian</span>
                                        </CardTitle>
                                        <CardDescription className="text-amber-800">Keluarga dengan stok menipis atau habis. Klik untuk melihat rincian.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {familiesInNeed.map(family => (
                                                <Button
                                                    key={family.id}
                                                    variant="outline"
                                                    size="sm"
                                                    className="bg-white hover:bg-amber-100/50 border-amber-400 text-amber-900 shadow-sm transition-all hover:shadow-md"
                                                    onClick={() => setSelectedFamilyId(family.id)}
                                                >
                                                    {family.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>


                    {/* Kolom Kanan: Rincian per Keluarga */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-green-100/50 min-h-[400px]">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-blue-900">
                                        <Users className="w-6 h-6 text-blue-600" />
                                        <span>Rincian Stok per Keluarga</span>
                                    </CardTitle>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
                                        <CardDescription className="text-blue-800">Pilih keluarga untuk melihat inventaris pangan mereka.</CardDescription>
                                        <Select onValueChange={setSelectedFamilyId} value={selectedFamilyId || ""}>
                                            <SelectTrigger className="w-full sm:w-[280px] rounded-xl border-blue-400 focus:border-blue-600 bg-white text-blue-900 shadow-sm">
                                                <SelectValue placeholder="Pilih Keluarga dari Daftar" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl bg-white/95 backdrop-blur-xl">
                                                {familiesWithShortageStatus.map(family => (
                                                    <SelectItem key={family.id} value={family.id}>
                                                        {family.hasShortage && <span className="mr-2">⚠️</span>} {family.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {selectedFamilyId ? (
                                        filteredFamilyStock.length > 0 ? (
                                            <div className="overflow-x-auto rounded-2xl border border-blue-100/50 shadow-inner bg-blue-50/20">
                                                <Table className="min-w-full">
                                                    <TableHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                                                        <TableRow className="border-blue-100">
                                                            <TableHead className="font-semibold text-blue-800">Nama Barang</TableHead>
                                                            <TableHead className="font-semibold text-blue-800">Kategori</TableHead>
                                                            <TableHead className="font-semibold text-blue-800">Jumlah</TableHead>
                                                            <TableHead className="font-semibold text-blue-800">Tanggal</TableHead>
                                                            <TableHead className="font-semibold text-blue-800">Status</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {filteredFamilyStock.map((item) => (
                                                            <TableRow key={item.id} className="border-blue-100/50 hover:bg-blue-100/40">
                                                                <TableCell className="font-medium text-gray-800">{item.name}</TableCell>
                                                                <TableCell><Badge variant="secondary" className="bg-blue-100 text-blue-800 border-0">{item.category}</Badge></TableCell>
                                                                <TableCell className="font-semibold text-gray-900">{item.quantity} {item.unit}</TableCell>
                                                                <TableCell className="text-sm text-gray-600">{new Date(item.added_date).toLocaleDateString("id-ID")}</TableCell>
                                                                <TableCell>
                                                                    {item.status && (
                                                                        <div className={cn(
                                                                            "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border",
                                                                            statusConfig[item.status].bgColor,
                                                                            statusConfig[item.status].textColor,
                                                                            statusConfig[item.status].borderColor
                                                                        )}>
                                                                            {React.createElement(statusConfig[item.status].icon, { className: "w-3 h-3" })}
                                                                            <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                                                                        </div>
                                                                    )}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-gray-500">
                                                <Package className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                                <p>Tidak ada data stok untuk keluarga yang dipilih.</p>
                                            </div>
                                        )
                                    ) : (
                                        <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center h-full">
                                            <Users className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                            <p className="font-medium">Pilih Keluarga</p>
                                            <p className="text-sm">Pilih keluarga dari daftar untuk melihat rincian stok mereka.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

            </div>
        </div>
    )
}

// Komponen helper untuk kartu statistik agar lebih rapi
const StatCard = ({ icon, value, label, color, shadowColor }: { icon: React.ElementType, value: number, label: string, color: string, shadowColor: string }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * value }} // Just for varied animation
    >
        <Card className={cn("text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105", `bg-gradient-to-br ${color}`, shadowColor)}>
            <CardContent className="p-4 sm:p-6">
                {React.createElement(icon, { className: "w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 drop-shadow-lg" })}
                <div className="text-2xl sm:text-3xl font-bold drop-shadow-sm">{value}</div>
                <div className="text-xs sm:text-sm opacity-90 font-medium">{label}</div>
            </CardContent>
        </Card>
    </motion.div>
);