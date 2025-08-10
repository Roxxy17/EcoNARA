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
        { 
            name: "Hemat Air", 
            points: 10, 
            icon: Droplet, 
            color: {
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
                hoverBackground: 'linear-gradient(135deg, #2563eb, #0891b2)'
            }
        },
        { 
            name: "Kurangi Plastik", 
            points: 15, 
            icon: Ban, 
            color: {
                background: 'linear-gradient(135deg, #ef4444, #ec4899)',
                hoverBackground: 'linear-gradient(135deg, #dc2626, #db2777)'
            }
        },
        { 
            name: "Kompos Organik", 
            points: 12, 
            icon: Sprout, 
            color: {
                background: 'linear-gradient(135deg, #22c55e, #10b981)',
                hoverBackground: 'linear-gradient(135deg, #16a34a, #059669)'
            }
        },
        { 
            name: "Hemat Listrik", 
            points: 8, 
            icon: Zap, 
            color: {
                background: 'linear-gradient(135deg, #eab308, #f97316)',
                hoverBackground: 'linear-gradient(135deg, #ca8a04, #ea580c)'
            }
        },
        { 
            name: "Transport Hijau", 
            points: 20, 
            icon: Bike, 
            color: {
                background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                hoverBackground: 'linear-gradient(135deg, #9333ea, #4f46e5)'
            }
        },
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
        <div 
            className="min-h-screen relative overflow-hidden"
            style={{
                background: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 25%, #f0fdfa 75%, #ecfeff 100%)'
            }}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div 
                    className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
                    style={{
                        background: 'linear-gradient(135deg, rgba(165, 243, 252, 0.6), rgba(59, 130, 246, 0.4))'
                    }}
                />
                <div 
                    className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse"
                    style={{
                        background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.6))',
                        animationDelay: '1s'
                    }}
                />
                <div 
                    className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse"
                    style={{
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4))',
                        animationDelay: '2s'
                    }}
                />
            </div>

            <Navbar />

            {/* Header */}
            <header 
                className="backdrop-blur-xl border-b sticky top-[72px] z-40 shadow-lg"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderColor: 'rgba(6, 182, 212, 0.2)'
                }}
            >
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div 
                                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                                style={{
                                    background: 'linear-gradient(135deg, #22c55e, #10b981, #06b6d4)',
                                    boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.25), 0 10px 10px -5px rgba(34, 197, 94, 0.04)'
                                }}
                            >
                                <Leaf className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 
                                    className="text-2xl font-bold"
                                    style={{
                                        backgroundImage: 'linear-gradient(90deg, #16a34a, #10b981, #06b6d4)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}
                                >
                                    Platform AI-powered Komunitas Eco Habit
                                </h1>
                                <p className="text-sm flex items-center" style={{ color: '#0e7490' }}>
                                    Lacak kebiasaan ramah lingkungan untuk mengatasi food waste dan membangun ekonomi sirkular
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge 
                                className="text-white shadow-lg border-0"
                                style={{
                                    background: 'linear-gradient(90deg, #22c55e, #10b981)'
                                }}
                            >
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
                    {/* Main Card */}
                    <Card 
                        className="border-0 shadow-xl backdrop-blur-sm mb-8"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: 'rgba(6, 182, 212, 0.2)'
                        }}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2" style={{ color: '#164e63' }}>
                                <Leaf className="w-6 h-6" style={{ color: '#16a34a' }} />
                                <span>Catat Eco Habit Harian</span>
                            </CardTitle>
                            <CardDescription style={{ color: '#0e7490' }}>
                                Pilih kebiasaan yang sudah Anda lakukan hari ini untuk mendapatkan poin eco.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Total Points Display */}
                            <div 
                                className="flex items-center justify-between mb-6 p-6 rounded-xl border shadow-inner"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
                                    borderColor: 'rgba(34, 197, 94, 0.3)'
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <Award className="w-8 h-8" style={{ color: '#16a34a' }} />
                                    <span className="text-xl font-semibold" style={{ color: '#14532d' }}>
                                        Total Poin Eco Anda:
                                    </span>
                                </div>
                                <Badge 
                                    className="text-white text-2xl font-bold py-3 px-6 rounded-full shadow-lg border-0"
                                    style={{
                                        background: 'linear-gradient(90deg, #22c55e, #10b981)'
                                    }}
                                >
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
                                            className="w-full h-auto py-6 flex flex-col items-center justify-center space-y-3 text-white rounded-2xl shadow-lg border-0 transition-all duration-300 hover:shadow-xl"
                                            style={{
                                                background: habit.color.background
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = habit.color.hoverBackground;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = habit.color.background;
                                            }}
                                        >
                                            <habit.icon className="w-10 h-10" />
                                            <span className="font-semibold text-lg">{habit.name}</span>
                                            <Badge 
                                                className="text-white text-sm border-0"
                                                style={{
                                                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                                                }}
                                            >
                                                +{habit.points} Poin
                                            </Badge>
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Custom Habit Form */}
                            <Card 
                                className="border-0 shadow-lg backdrop-blur-sm"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(245, 158, 11, 0.1))',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: 'rgba(251, 146, 60, 0.3)'
                                }}
                            >
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2" style={{ color: '#9a3412' }}>
                                        <Activity className="w-6 h-6" style={{ color: '#ea580c' }} />
                                        <span>Catat Kebiasaan Eco Kustom</span>
                                    </CardTitle>
                                    <CardDescription style={{ color: '#c2410c' }}>
                                        Tambahkan kebiasaan eco yang Anda lakukan dengan detail lebih lanjut.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div 
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-6 border rounded-xl"
                                        style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                            borderColor: 'rgba(251, 146, 60, 0.3)'
                                        }}
                                    >
                                        <div>
                                            <Label htmlFor="new-habit-name" className="mb-2 block text-sm font-medium" style={{ color: '#374151' }}>
                                                Kebiasaan
                                            </Label>
                                            <Input
                                                id="new-habit-name"
                                                name="newHabitName"
                                                value={newHabitName}
                                                onChange={(e) => setNewHabitName(e.target.value)}
                                                placeholder="Contoh: Menggunakan tas belanja sendiri"
                                                className="rounded-xl text-blue-900 placeholder-blue-400"
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: '#3b82f6'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-habit-proof" className="mb-2 block text-sm font-medium" style={{ color: '#374151' }}>
                                                Bukti (Opsional)
                                            </Label>
                                            <Input
                                                id="new-habit-proof"
                                                name="newHabitProofUrl"
                                                value={newHabitProofUrl}
                                                onChange={(e) => setNewHabitProofUrl(e.target.value)}
                                                placeholder="URL Foto atau Deskripsi Singkat"
                                                className="rounded-xl text-blue-900 placeholder-blue-400"
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: '#3b82f6'
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label htmlFor="new-habit-meter" className="mb-2 block text-sm font-medium" style={{ color: '#374151' }}>
                                                Meter (Nilai Kuantitatif)
                                            </Label>
                                            <Input
                                                id="new-habit-meter"
                                                name="newHabitMeterInput"
                                                type="number"
                                                value={newHabitMeterInput}
                                                onChange={(e) => setNewHabitMeterInput(e.target.value)}
                                                placeholder="Contoh: 10 (misal: 10 liter air dihemat)"
                                                className="rounded-xl text-blue-900 placeholder-blue-400"
                                                style={{
                                                    backgroundColor: 'white',
                                                    borderColor: '#3b82f6'
                                                }}
                                            />
                                            <p className="text-xs mt-2" style={{ color: '#6b7280' }}>
                                                *Poin akan dihitung berdasarkan nilai meter ini (misal: Meter x 5 Poin).
                                            </p>
                                        </div>
                                        <div className="md:col-span-2 flex justify-end">
                                            <Button 
                                                onClick={handleLogCustomEcoHabit} 
                                                className="text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                                                style={{
                                                    background: 'linear-gradient(90deg, #ea580c, #dc2626)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = 'linear-gradient(90deg, #c2410c, #b91c1c)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = 'linear-gradient(90deg, #ea580c, #dc2626)';
                                                }}
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
                                <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2" style={{ color: '#164e63' }}>
                                    <Sparkles className="w-6 h-6" style={{ color: '#16a34a' }} />
                                    <span>Riwayat Eco Habit Terbaru</span>
                                </h3>
                                
                                {loadingLogs ? (
                                    <div 
                                        className="text-center py-12 rounded-xl border"
                                        style={{
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            borderColor: 'rgba(59, 130, 246, 0.3)'
                                        }}
                                    >
                                        <Loader2 className="h-10 w-10 mx-auto animate-spin mb-4" style={{ color: '#16a34a' }} />
                                        <p className="text-lg" style={{ color: '#1e40af' }}>Memuat riwayat...</p>
                                    </div>
                                ) : error ? (
                                    <div 
                                        className="text-center py-12 rounded-xl border"
                                        style={{
                                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                            borderColor: 'rgba(239, 68, 68, 0.3)'
                                        }}
                                    >
                                        <p className="text-lg" style={{ color: '#dc2626' }}>Gagal memuat data: {error}</p>
                                    </div>
                                ) : ecoHabitLogs.length === 0 ? (
                                    <div 
                                        className="text-center py-12 rounded-xl border"
                                        style={{
                                            backgroundColor: 'rgba(107, 114, 128, 0.1)',
                                            borderColor: 'rgba(107, 114, 128, 0.3)'
                                        }}
                                    >
                                        <Leaf className="w-16 h-16 mx-auto mb-4" style={{ color: '#9ca3af' }} />
                                        <p className="text-lg mb-2" style={{ color: '#374151' }}>Belum ada riwayat eco habit</p>
                                        <p style={{ color: '#6b7280' }}>Mulai dengan melakukan aktivitas di atas untuk mendapatkan poin</p>
                                    </div>
                                ) : (
                                    <div 
                                        className="overflow-x-auto rounded-xl border shadow-lg"
                                        style={{
                                            borderColor: 'rgba(6, 182, 212, 0.3)'
                                        }}
                                    >
                                        <Table className="min-w-full">
                                            <TableHeader 
                                                style={{
                                                    background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.1), rgba(59, 130, 246, 0.1))'
                                                }}
                                            >
                                                <TableRow style={{ borderColor: '#06b6d4' }}>
                                                    <TableHead className="font-semibold" style={{ color: '#164e63' }}>ID</TableHead>
                                                    <TableHead className="font-semibold" style={{ color: '#164e63' }}>Kebiasaan</TableHead>
                                                    <TableHead className="font-semibold" style={{ color: '#164e63' }}>Poin</TableHead>
                                                    <TableHead className="font-semibold" style={{ color: '#164e63' }}>Penghematan?</TableHead>
                                                    <TableHead className="font-semibold" style={{ color: '#164e63' }}>Waktu Dicatat</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                                                {ecoHabitLogs.map((log) => (
                                                    <TableRow 
                                                        key={log.id} 
                                                        className="transition-all duration-300 hover:bg-gradient-to-r"
                                                        style={{ 
                                                            borderColor: 'rgba(6, 182, 212, 0.2)',
                                                            '--tw-gradient-from': 'rgba(6, 182, 212, 0.05)',
                                                            '--tw-gradient-to': 'rgba(59, 130, 246, 0.05)'
                                                        } as React.CSSProperties}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'linear-gradient(90deg, rgba(6, 182, 212, 0.05), rgba(59, 130, 246, 0.05))';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = '';
                                                        }}
                                                    >
                                                        <TableCell className="font-medium" style={{ color: '#0e7490' }}>{log.id}</TableCell>
                                                        <TableCell style={{ color: '#164e63' }}>{log.activity_type}</TableCell>
                                                        <TableCell>
                                                            <Badge 
                                                                className="text-white border-0"
                                                                style={{
                                                                    background: 'linear-gradient(90deg, #22c55e, #10b981)'
                                                                }}
                                                            >
                                                                +{log.points}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {log.isSaving ? (
                                                                <Badge 
                                                                    className="border"
                                                                    style={{
                                                                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                                                                        color: '#166534',
                                                                        borderColor: 'rgba(34, 197, 94, 0.3)'
                                                                    }}
                                                                >
                                                                    <CheckCircle className="w-3 h-3 mr-1" /> Ya
                                                                </Badge>
                                                            ) : (
                                                                <Badge 
                                                                    className="border"
                                                                    style={{
                                                                        backgroundColor: 'rgba(107, 114, 128, 0.1)',
                                                                        color: '#4b5563',
                                                                        borderColor: 'rgba(107, 114, 128, 0.3)'
                                                                    }}
                                                                >
                                                                    <XCircle className="w-3 h-3 mr-1" /> Tidak
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell style={{ color: '#0e7490' }}>
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