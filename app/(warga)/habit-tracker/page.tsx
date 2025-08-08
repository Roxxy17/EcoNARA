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
        { name: "Hemat Air", points: 10, icon: Droplet },
        { name: "Kurangi Plastik", points: 15, icon: Ban },
        { name: "Kompos Organik", points: 12, icon: Sprout },
        { name: "Hemat Listrik", points: 8, icon: Zap },
        { name: "Transport Hijau", points: 20, icon: Bike },
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

    // --- Perubahan utama ada di sini ---
    // Efek untuk memuat data riwayat eco habit dari API saat halaman dimuat
    useEffect(() => {
        if (!loadingUser && userProfile) {
            fetchEcoHabits();
        } else if (!loadingUser && !userProfile) {
            setLoadingLogs(false);
            setError("Pengguna tidak terautentikasi.");
        }
    }, [userProfile, loadingUser]);

    // Efek untuk menghitung total poin dari state ecoHabitLogs
    useEffect(() => {
        const calculatedTotal = ecoHabitLogs.reduce((sum, log) => sum + log.points, 0);
        setTotalEcoPoints(calculatedTotal);
    }, [ecoHabitLogs]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Card untuk Catat Eco Habit yang Sudah Terdefinisi */}
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Leaf className="w-6 h-6 text-green-600" />
                                <span>Catat Eco Habit Harian</span>
                            </CardTitle>
                            <CardDescription>Pilih kebiasaan yang sudah Anda lakukan hari ini untuk mendapatkan poin.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-gradient-to-r from-green-100 to-blue-100 shadow-inner">
                                <div className="flex items-center space-x-2">
                                    <Award className="w-6 h-6 text-green-700" />
                                    <span className="text-lg font-semibold text-gray-800">Total Poin Eco Anda:</span>
                                </div>
                                <Badge className="bg-green-600 text-white text-xl font-bold p-2 px-4 rounded-full shadow-lg">
                                    {loadingLogs ? <Loader2 className="h-5 w-5 animate-spin" /> : `${totalEcoPoints} Poin`}
                                </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                                            className="w-full h-auto py-4 flex flex-col items-center justify-center space-y-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-md"
                                        >
                                            <habit.icon className="w-8 h-8" />
                                            <span className="font-semibold text-base">{habit.name}</span>
                                            <Badge variant="secondary" className="bg-white/30 text-white text-xs">
                                                +{habit.points} Poin
                                            </Badge>
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mt-8">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Activity className="w-6 h-6 text-orange-600" />
                                        <span>Catat Kebiasaan Eco</span>
                                    </CardTitle>
                                    <CardDescription>Tambahkan kebiasaan eco yang Anda lakukan dengan detail lebih lanjut.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
                                        <div>
                                            <Label htmlFor="new-habit-name" className="mb-1 block text-sm font-medium text-gray-700">Kebiasaan</Label>
                                            <Input
                                                id="new-habit-name"
                                                name="newHabitName"
                                                value={newHabitName}
                                                onChange={(e) => setNewHabitName(e.target.value)}
                                                placeholder="Contoh: Menggunakan tas belanja sendiri"
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-habit-proof" className="mb-1 block text-sm font-medium text-gray-700">Bukti (Opsional)</Label>
                                            <Input
                                                id="new-habit-proof"
                                                name="newHabitProofUrl"
                                                value={newHabitProofUrl}
                                                onChange={(e) => setNewHabitProofUrl(e.target.value)}
                                                placeholder="URL Foto atau Deskripsi Singkat"
                                                className="rounded-md"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="new-habit-meter" className="mb-1 block text-sm font-medium text-gray-700">Meter (Nilai Kuantitatif)</Label>
                                            <Input
                                                id="new-habit-meter"
                                                name="newHabitMeterInput"
                                                type="number"
                                                value={newHabitMeterInput}
                                                onChange={(e) => setNewHabitMeterInput(e.target.value)}
                                                placeholder="Contoh: 10 (misal: 10 liter air dihemat)"
                                                className="rounded-md"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                *Poin akan dihitung berdasarkan nilai meter ini (misal: Meter x 5 Poin).
                                            </p>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <Button onClick={handleLogCustomEcoHabit} className="bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md">
                                                <PlusCircle className="mr-2 h-4 w-4" />
                                                Catat Kebiasaan
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2 mt-8">
                                Riwayat Eco Habit Terbaru
                            </h3>
                            {loadingLogs ? (
                                <div className="text-center py-8">
                                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-green-600" />
                                    <p className="mt-2 text-gray-600">Memuat riwayat...</p>
                                </div>
                            ) : error ? (
                                <p className="text-red-600 text-center py-8">Gagal memuat data: {error}</p>
                            ) : ecoHabitLogs.length === 0 ? (
                                <p className="text-gray-600 text-center py-8">Belum ada riwayat eco habit.</p>
                            ) : (
                                <div className="overflow-x-auto rounded-lg border">
                                    <Table className="min-w-full bg-white">
                                        <TableHeader className="bg-gray-100">
                                            <TableRow>
                                                <TableHead className="w-[80px]">ID</TableHead>
                                                <TableHead>Kebiasaan</TableHead>
                                                <TableHead>Poin</TableHead>
                                                <TableHead>Penghematan?</TableHead>
                                                <TableHead>Waktu Dicatat</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {ecoHabitLogs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="font-medium">{log.id}</TableCell>
                                                    <TableCell>{log.activity_type}</TableCell>
                                                    <TableCell className="text-green-600 font-semibold">+{log.points}</TableCell>
                                                    <TableCell>
                                                        {log.isSaving ? (
                                                            <Badge className="bg-green-100 text-green-800">
                                                                <CheckCircle className="w-3 h-3 mr-1" /> Ya
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                                                <XCircle className="w-3 h-3 mr-1" /> Tidak
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>{format(new Date(log.created_at), "dd MMM yyyy, HH:mm", { locale: idLocale })}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}