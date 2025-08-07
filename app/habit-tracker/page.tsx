"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// Popover dan Calendar dipertahankan jika ada kebutuhan lain di masa depan, meskipun tidak langsung digunakan di sini
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  CalendarIcon, // Dipertahankan jika ada kebutuhan lain di masa depan
  Leaf, // Untuk eco habit
  PlusCircle,
  Trash2, // Dipertahankan jika ada kebutuhan lain di masa depan
  Award,
  Activity, // Ikon umum untuk aktivitas
  Droplet, // Ikon untuk Hemat Air
  Ban, // Ikon untuk Kurangi Plastik
  Sprout, // Ikon untuk Kompos Organik
  Zap, // Ikon untuk Hemat Listrik
  Bike, // Ikon untuk Transport Hijau
  Sparkles, // Ikon umum untuk poin
  CheckCircle, // Untuk indikator penghematan
  XCircle, // Untuk indikator bukan penghematan
} from "lucide-react"
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale" // Dipertahankan jika ada kebutuhan lain di masa depan
import { Navbar } from "@/components/navigation/nav-dashboard"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

// Interface untuk data pencatatan eco habit
interface EcoHabitLog {
  id: string
  habitName: string
  pointsEarned: number
  loggedAt: Date
  isSaving?: boolean // Ditambahkan untuk analisis penghematan
  proofUrl?: string | null // Ditambahkan untuk bukti opsional
}

export default function HabitTrackerPage() {
  const { toast } = useToast()

  // State untuk total poin dari eco habit
  const [totalEcoPoints, setTotalEcoPoints] = useState(0)

  // State untuk log eco habit
  const [ecoHabitLogs, setEcoHabitLogs] = useState<EcoHabitLog[]>([
    { id: "eh-1", habitName: "Hemat Air", pointsEarned: 10, loggedAt: new Date("2024-07-30T08:00:00Z"), isSaving: true },
    { id: "eh-2", habitName: "Kurangi Plastik", pointsEarned: 15, loggedAt: new Date("2024-07-29T12:00:00Z"), isSaving: false },
    { id: "eh-3", habitName: "Hemat Listrik", pointsEarned: 8, loggedAt: new Date("2024-07-28T10:00:00Z"), isSaving: true },
  ])

  // State untuk form pencatatan eco habit baru (bukan lagi "kustom")
  const [newHabitName, setNewHabitName] = useState("")
  const [newHabitProofUrl, setNewHabitProofUrl] = useState("")
  const [newHabitMeterInput, setNewHabitMeterInput] = useState("")

  // Definisi eco habits dengan poin default
  const ecoHabitDefinitions = [
    { name: "Hemat Air", points: 10, icon: Droplet },
    { name: "Kurangi Plastik", points: 15, icon: Ban },
    { name: "Kompos Organik", points: 12, icon: Sprout },
    { name: "Hemat Listrik", points: 8, icon: Zap },
    { name: "Transport Hijau", points: 20, icon: Bike },
  ]

  // Helper untuk menentukan apakah kebiasaan adalah penghematan (mock)
  const isHabitASaving = (habitName: string): boolean => {
    const lowerCaseHabitName = habitName.toLowerCase();
    return lowerCaseHabitName.includes("hemat air") || lowerCaseHabitName.includes("hemat listrik") || lowerCaseHabitName.includes("penghematan");
  };

  // Fungsi untuk mencatat eco habit yang sudah terdefinisi
  const handleLogPredefinedEcoHabit = (habitName: string, points: number) => {
    const newLog: EcoHabitLog = {
      id: `eh-${ecoHabitLogs.length + 1}`,
      habitName,
      pointsEarned: points,
      loggedAt: new Date(),
      isSaving: isHabitASaving(habitName),
    }
    setEcoHabitLogs((prev) => [...prev, newLog])
    setTotalEcoPoints((prev) => prev + points)
    toast({
      title: "Eco Habit Tercatat!",
      description: `Anda mendapatkan ${points} poin untuk "${habitName}"! ${newLog.isSaving ? "Ini adalah penghematan!" : ""}`,
      variant: "default",
    })
  }

  // Fungsi untuk mencatat eco habit (sekarang umum, bukan lagi "kustom")
  const handleLogEcoHabit = () => {
    const parsedMeter = parseFloat(newHabitMeterInput);
    const pointsEarned = isNaN(parsedMeter) || parsedMeter <= 0 ? 0 : Math.round(parsedMeter * 5); // Contoh: 1 meter = 5 poin

    if (!newHabitName.trim() || isNaN(parsedMeter) || parsedMeter <= 0) {
      toast({
        title: "Input Tidak Lengkap/Valid",
        description: "Mohon lengkapi nama kebiasaan dan masukkan nilai meter yang valid (angka positif).",
        variant: "destructive",
      })
      return
    }

    const newLog: EcoHabitLog = {
      id: `eh-${ecoHabitLogs.length + 1}`,
      habitName: newHabitName.trim(),
      pointsEarned: pointsEarned,
      loggedAt: new Date(),
      isSaving: isHabitASaving(newHabitName),
      proofUrl: newHabitProofUrl.trim() || null, // Simpan URL bukti jika ada
    }
    setEcoHabitLogs((prev) => [...prev, newLog])
    setTotalEcoPoints((prev) => prev + pointsEarned)
    setNewHabitName("")
    setNewHabitProofUrl("")
    setNewHabitMeterInput("")
    toast({
      title: "Eco Habit Tercatat!",
      description: `Anda mendapatkan ${pointsEarned} poin untuk "${newLog.habitName}"! ${newLog.isSaving ? "Ini adalah penghematan!" : ""}`,
      variant: "default",
    })
  }

  // Efek untuk menghitung total poin saat ecoHabitLogs berubah
  useEffect(() => {
    const calculatedTotal = ecoHabitLogs.reduce((sum, log) => sum + log.pointsEarned, 0);
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
                  {totalEcoPoints} Poin
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

              {/* Card untuk Catat Kebiasaan Eco (umum) */}
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
                      <Button onClick={handleLogEcoHabit} className="bg-orange-500 hover:bg-orange-600 text-white rounded-md shadow-md">
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
              {ecoHabitLogs.length === 0 ? (
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
                          <TableCell className="font-medium">{log.id.split('-')[1]}</TableCell>
                          <TableCell>{log.habitName}</TableCell>
                          <TableCell className="text-green-600 font-semibold">+{log.pointsEarned}</TableCell>
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
                          <TableCell>{format(log.loggedAt, "dd MMM yyyy, HH:mm", { locale: idLocale })}</TableCell>
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
