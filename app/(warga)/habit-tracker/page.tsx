"use client"
import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
    CalendarIcon,
    Leaf,
    PlusCircle,
    Award,
    Activity,
    Droplet,
    Ban,
    Sprout,
    Zap,
    Bike,
    Sparkles,
    CheckCircle,
    XCircle,
    Loader2,
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/contexts/UserContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Interface untuk data pencatatan eco habit dari API
interface EcoHabitLog {
    id: number
    user_id: string
    activity_type: string
    points: number
    created_at: string
    isSaving?: boolean
    proofUrl?: string | null
}

export default function HabitTrackerPage() {
    const { toast } = useToast()
    const { userProfile, loadingUser } = useUser();
    const supabase = createClientComponentClient();

    const [totalEcoPoints, setTotalEcoPoints] = useState(0)
    const [ecoHabitLogs, setEcoHabitLogs] = useState<EcoHabitLog[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [newHabitName, setNewHabitName] = useState("")
    const [newHabitProofUrl, setNewHabitProofUrl] = useState("")
    const [newHabitMeterInput, setNewHabitMeterInput] = useState("")

    const ecoHabitDefinitions = [
        { name: "Hemat Air", points: 10, icon: Droplet, color: "from-blue-500 to-cyan-600" },
        { name: "Kurangi Plastik", points: 15, icon: Ban, color: "from-red-500 to-pink-600" },
        { name: "Kompos Organik", points: 12, icon: Sprout, color: "from-green-500 to-emerald-600" },
        { name: "Hemat Listrik", points: 8, icon: Zap, color: "from-yellow-500 to-orange-600" },
        { name: "Transport Hijau", points: 20, icon: Bike, color: "from-purple-500 to-indigo-600" },
    ]

    const isHabitASaving = (habitName: string): boolean => {
        const lowerCaseHabitName = habitName.toLowerCase();
        return lowerCaseHabitName.includes("hemat air") || lowerCaseHabitName.includes("hemat listrik") || lowerCaseHabitName.includes("penghematan");
    };

    const fetchEcoHabits = async () => {
        setLoadingLogs(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

            const res = await fetch("/api/eco-habits", {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || res.statusText);
            }

            const data: EcoHabitLog[] = await res.json();
            setEcoHabitLogs(data.map(log => ({
                ...log,
                isSaving: isHabitASaving(log.activity_type),
            })));
        } catch (e: any) {
            console.error("Error fetching eco habits:", e);
            setError(e.message);
            toast({
                title: "Gagal memuat riwayat.",
                description: `Terjadi kesalahan saat memuat data: ${e.message}`,
                variant: "destructive",
            });
        } finally {
            setLoadingLogs(false);
        }
    };

    const logEcoHabit = async (activity_type: string, points: number) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");
            
            const res = await fetch("/api/eco-habits", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ activity_type, points }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || res.statusText);
            }
            
            await fetchEcoHabits();

            toast({
                title: "Eco Habit Tercatat!",
                description: `Anda mendapatkan ${points} poin untuk "${activity_type}"!`,
                variant: "default",
                className: "bg-green-50 border-green-200 text-green-900",
            });
        } catch (e: any) {
            console.error("Error logging eco habit:", e);
            toast({
                title: "Gagal Mencatat Eco Habit.",
                description: `Terjadi kesalahan: ${e.message}`,
                variant: "destructive",
            });
        }
    };

    const handleLogPredefinedEcoHabit = (habitName: string, points: number) => {
        logEcoHabit(habitName, points);
    };

    const handleLogCustomEcoHabit = () => {
        const parsedMeter = parseFloat(newHabitMeterInput);
        const pointsEarned = isNaN(parsedMeter) || parsedMeter <= 0 ? 0 : Math.round(parsedMeter * 5);
        if (!newHabitName.trim() || isNaN(parsedMeter) || parsedMeter <= 0) {
            toast({
                title: "Input Tidak Lengkap/Valid",
                description: "Mohon lengkapi nama kebiasaan dan masukkan nilai meter yang valid.",
                variant: "destructive",
            });
            return;
        }

        logEcoHabit(newHabitName.trim(), pointsEarned);

        setNewHabitName("");
        setNewHabitProofUrl("");
        setNewHabitMeterInput("");
    };

    useEffect(() => {
        if (!loadingUser && userProfile) {
            fetchEcoHabits();
        } else if (!loadingUser && !userProfile) {
            setLoadingLogs(false);
            setError("Pengguna tidak terautentikasi.");
        }
    }, [userProfile, loadingUser]);

    useEffect(() => {
        const calculatedTotal = ecoHabitLogs.reduce((sum, log) => sum + log.points, 0);
        setTotalEcoPoints(calculatedTotal);
    }, [ecoHabitLogs]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
            {/* Light Background Effects */}
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
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25">
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                                    Platform AI-powered Komunitas Eco Habit
                                </h1>
                                <p className="text-sm text-cyan-700/80 flex items-center">
                                    Lacak kebiasaan ramah lingkungan untuk mengatasi food waste dan membangun ekonomi sirkular
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                                <Award className="w-3 h-3 mr-1" />
                                {loadingLogs ? "Loading..." : `${totalEcoPoints} Poin`}
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Card untuk Catat Eco Habit yang Sudah Terdefinisi */}
                    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8 border border-cyan-100/50">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-cyan-900">
                                <Leaf className="w-6 h-6 text-green-600" />
                                <span>Catat Eco Habit Harian</span>
                            </CardTitle>
                            <CardDescription className="text-cyan-700">
                                Pilih kebiasaan yang sudah Anda lakukan hari ini untuk mendapatkan poin eco.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Total Points Display */}
                            <div className="flex items-center justify-between mb-6 p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 shadow-inner">
                                <div className="flex items-center space-x-3">
                                    <Award className="w-8 h-8 text-green-600" />
                                    <span className="text-xl font-semibold text-green-900">Total Poin Eco Anda:</span>
                                </div>
                                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-2xl font-bold py-3 px-6 rounded-full shadow-lg">
                                    {loadingLogs ? <Loader2 className="h-6 w-6 animate-spin" /> : `${totalEcoPoints} Poin`}
                                </Badge>
                            </div>

                            {/* Habit Buttons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {ecoHabitDefinitions.map((habit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.1 * index }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            onClick={() => handleLogPredefinedEcoHabit(habit.name, habit.points)}
                                            className={`w-full h-auto py-6 flex flex-col items-center justify-center space-y-3 bg-gradient-to-br ${habit.color} hover:shadow-xl transition-all duration-300 text-white rounded-2xl shadow-lg border-0`}
                                        >
                                            <habit.icon className="w-10 h-10" />
                                            <span className="font-semibold text-lg">{habit.name}</span>
                                            <Badge variant="secondary" className="bg-white/20 text-white text-sm border-0">
                                                +{habit.points} Poin
                                            </Badge>
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Custom Habit Form */}
                            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-yellow-50 backdrop-blur-sm border border-orange-200/50">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-orange-900">
                                        <Activity className="w-6 h-6 text-orange-600" />
                                        <span>Catat Kebiasaan Eco Kustom</span>
                                    </CardTitle>
                                    <CardDescription className="text-orange-700">
                                        Tambahkan kebiasaan eco yang Anda lakukan dengan detail lebih lanjut.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 border rounded-xl bg-white/50 border-orange-200/50">
                                        <div>
                                            <Label htmlFor="new-habit-name" className="mb-2 block text-sm font-medium text-gray-800">
                                                Kebiasaan
                                            </Label>
                                            <Input
                                                id="new-habit-name"
                                                name="newHabitName"
                                                value={newHabitName}
                                                onChange={(e) => setNewHabitName(e.target.value)}
                                                placeholder="Contoh: Menggunakan tas belanja sendiri"
                                                className="rounded-xl border-blue-400 focus:border-blue-600 bg-white text-blue-900 placeholder-blue-400"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-habit-proof" className="mb-2 block text-sm font-medium text-gray-800">
                                                Bukti (Opsional)
                                            </Label>
                                            <Input
                                                id="new-habit-proof"
                                                name="newHabitProofUrl"
                                                value={newHabitProofUrl}
                                                onChange={(e) => setNewHabitProofUrl(e.target.value)}
                                                placeholder="URL Foto atau Deskripsi Singkat"
                                                className="rounded-xl border-blue-400 focus:border-blue-600 bg-white text-blue-900 placeholder-blue-400"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="new-habit-meter" className="mb-2 block text-sm font-medium text-gray-800">
                                                Meter (Nilai Kuantitatif)
                                            </Label>
                                            <Input
                                                id="new-habit-meter"
                                                name="newHabitMeterInput"
                                                type="number"
                                                value={newHabitMeterInput}
                                                onChange={(e) => setNewHabitMeterInput(e.target.value)}
                                                placeholder="Contoh: 10 (misal: 10 liter air dihemat)"
                                                className="rounded-xl border-blue-400 focus:border-blue-600 bg-white text-blue-900 placeholder-blue-400"
                                            />
                                            <p className="text-xs text-gray-600 mt-2">
                                                *Poin akan dihitung berdasarkan nilai meter ini (misal: Meter x 5 Poin).
                                            </p>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <Button 
                                                onClick={handleLogCustomEcoHabit} 
                                                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                                            >
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Catat Kebiasaan
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* History Section */}
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold text-cyan-900 mb-4 flex items-center space-x-2">
                                    <Sparkles className="w-6 h-6 text-green-600" />
                                    <span>Riwayat Eco Habit Terbaru</span>
                                </h3>
                                
                                {loadingLogs ? (
                                    <div className="text-center py-12 bg-blue-50/50 rounded-xl border border-blue-200/50">
                                        <Loader2 className="h-10 w-10 mx-auto animate-spin text-green-600 mb-4" />
                                        <p className="text-blue-700 text-lg">Memuat riwayat...</p>
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                                        <p className="text-red-700 text-lg">Gagal memuat data: {error}</p>
                                    </div>
                                ) : ecoHabitLogs.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                                        <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-700 text-lg mb-2">Belum ada riwayat eco habit</p>
                                        <p className="text-gray-500">Mulai dengan melakukan aktivitas di atas untuk mendapatkan poin</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-xl border border-cyan-200/50 shadow-lg">
                                        <Table className="min-w-full">
                                            <TableHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                                                <TableRow className="border-cyan-100">
                                                    <TableHead className="text-cyan-800 font-semibold">ID</TableHead>
                                                    <TableHead className="text-cyan-800 font-semibold">Kebiasaan</TableHead>
                                                    <TableHead className="text-cyan-800 font-semibold">Poin</TableHead>
                                                    <TableHead className="text-cyan-800 font-semibold">Penghematan?</TableHead>
                                                    <TableHead className="text-cyan-800 font-semibold">Waktu Dicatat</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="bg-white/90">
                                                {ecoHabitLogs.map((log) => (
                                                    <TableRow key={log.id} className="border-cyan-100/50 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 transition-all duration-300">
                                                        <TableCell className="font-medium text-cyan-700">{log.id}</TableCell>
                                                        <TableCell className="text-cyan-900">{log.activity_type}</TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                                                                +{log.points}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {log.isSaving ? (
                                                                <Badge className="bg-green-100 text-green-800 border border-green-200">
                                                                    <CheckCircle className="w-3 h-3 mr-1" /> Ya
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-gray-100 text-gray-600 border border-gray-200">
                                                                    <XCircle className="w-3 h-3 mr-1" /> Tidak
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-cyan-700">
                                                            {format(new Date(log.created_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}