  "use client"

  import { useState } from "react"
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
    Camera, // Untuk scan sampah
    Leaf, // Untuk eco habit
    PlusCircle,
    Trash2,
    Award,
    Activity,
    Droplet, // Ikon untuk Hemat Air
    Ban, // Ikon untuk Kurangi Plastik
    Sprout, // Ikon untuk Kompos Organik
    Zap, // Ikon untuk Hemat Listrik
    Bike, // Ikon untuk Transport Hijau
    Sparkles, // Ikon umum untuk poin
  } from "lucide-react"
  import { format } from "date-fns"
  import { id as idLocale } from "date-fns/locale"
  import { Navbar } from "@/components/navigation/nav-dashboard"
  import { cn } from "@/lib/utils"
  import { useToast } from "@/components/ui/use-toast" // Import useToast
  import { Badge } from "@/components/ui/badge" // Import Badge

  // Interface untuk data scan sampah
  interface TrashRecord {
    id: string
    user_id: string
    photo_url: string
    classified_as: string
    created_at: Date
  }

  // Interface untuk data pencatatan eco habit
  interface EcoHabitLog {
    id: string
    habitName: string
    pointsEarned: number
    loggedAt: Date
  }

  export default function HabitTrackerPage() {
    const { toast } = useToast() // Inisialisasi useToast

    // State untuk data scan sampah (mock)
    const [trashRecords, setTrashRecords] = useState<TrashRecord[]>([
      {
        id: "tr-1",
        user_id: "user-123",
        photo_url: "https://placehold.co/100x100/A855F7/FFFFFF?text=Plastik",
        classified_as: "Plastik",
        created_at: new Date("2024-07-30T10:00:00Z"),
      },
      {
        id: "tr-2",
        user_id: "user-123",
        photo_url: "https://placehold.co/100x100/22C55E/FFFFFF?text=Organik",
        classified_as: "Organik",
        created_at: new Date("2024-07-29T14:30:00Z"),
      },
    ])

    // State untuk form scan sampah baru
    const [newScan, setNewScan] = useState({
      photo_url: "",
      classified_as: "",
    })

    // State untuk total poin dari eco habit
    const [totalEcoPoints, setTotalEcoPoints] = useState(0)

    // State untuk log eco habit
    const [ecoHabitLogs, setEcoHabitLogs] = useState<EcoHabitLog[]>([
      { id: "eh-1", habitName: "Hemat Air", pointsEarned: 10, loggedAt: new Date("2024-07-30T08:00:00Z") },
      { id: "eh-2", habitName: "Kurangi Plastik", pointsEarned: 15, loggedAt: new Date("2024-07-29T12:00:00Z") },
    ])

    // Definisi eco habits dengan poin
    const ecoHabitDefinitions = [
      { name: "Hemat Air", points: 10, icon: Droplet },
      { name: "Kurangi Plastik", points: 15, icon: Ban },
      { name: "Kompos Organik", points: 12, icon: Sprout },
      { name: "Hemat Listrik", points: 8, icon: Zap },
      { name: "Transport Hijau", points: 20, icon: Bike },
    ]

    // Fungsi untuk menangani input form scan sampah
    const handleScanInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setNewScan((prev) => ({ ...prev, [name]: value }))
    }

    // Fungsi untuk menangani select input scan sampah
    const handleScanSelectChange = (value: string) => {
      setNewScan((prev) => ({ ...prev, classified_as: value }))
    }

    // Fungsi untuk menambahkan record scan sampah
    const handleAddScan = () => {
      if (newScan.photo_url && newScan.classified_as) {
        const newTrashRecord: TrashRecord = {
          id: `tr-${trashRecords.length + 1}`,
          user_id: "user-123", // User ID mock
          photo_url: newScan.photo_url,
          classified_as: newScan.classified_as,
          created_at: new Date(),
        }
        setTrashRecords((prev) => [...prev, newTrashRecord])
        setNewScan({ photo_url: "", classified_as: "" }) // Reset form
        toast({
          title: "Scan Sampah Berhasil!",
          description: `Sampah ${newTrashRecord.classified_as} berhasil dicatat.`,
          variant: "default", // Atau "success" jika ada
        })
      } else {
        toast({
          title: "Input Tidak Lengkap",
          description: "Mohon lengkapi URL foto dan klasifikasi sampah.",
          variant: "destructive",
        })
      }
    }

    // Fungsi untuk menghapus record scan sampah
    const handleDeleteScan = (id: string) => {
      setTrashRecords((prev) => prev.filter((record) => record.id !== id))
      toast({
        title: "Riwayat Dihapus",
        description: "Data scan sampah berhasil dihapus.",
        variant: "default",
      })
    }

    // Fungsi untuk mencatat eco habit
    const handleLogEcoHabit = (habitName: string, points: number) => {
      const newLog: EcoHabitLog = {
        id: `eh-${ecoHabitLogs.length + 1}`,
        habitName,
        pointsEarned: points,
        loggedAt: new Date(),
      }
      setEcoHabitLogs((prev) => [...prev, newLog])
      setTotalEcoPoints((prev) => prev + points)
      toast({
        title: "Eco Habit Tercatat!",
        description: `Anda mendapatkan ${points} poin untuk ${habitName}! Total poin eco: ${totalEcoPoints + points} Poin.`,
        variant: "default", // Atau "success"
      })
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <Navbar />

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Card untuk Scan Sampah */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-6 h-6 text-purple-600" />
                  <span>Scan Sampah & Klasifikasi</span>
                </CardTitle>
                <CardDescription>Klasifikasikan sampah Anda dan dapatkan poin.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                  <div>
                    <Label htmlFor="photo_url" className="mb-1 block text-sm font-medium text-gray-700">URL Foto Sampah (Mock)</Label>
                    <Input
                      id="photo_url"
                      name="photo_url"
                      value={newScan.photo_url}
                      onChange={handleScanInputChange}
                      placeholder="Contoh: https://gambar-sampah.jpg"
                      className="rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      *Di aplikasi nyata, ini akan menjadi fitur unggah/scan gambar.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="classified_as" className="mb-1 block text-sm font-medium text-gray-700">Klasifikasi Sampah</Label>
                    <Select onValueChange={handleScanSelectChange} value={newScan.classified_as}>
                      <SelectTrigger className="w-full rounded-md">
                        <SelectValue placeholder="Pilih Jenis Sampah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Organik">Organik</SelectItem>
                        <SelectItem value="Plastik">Plastik</SelectItem>
                        <SelectItem value="Kertas">Kertas</SelectItem>
                        <SelectItem value="Logam">Logam</SelectItem>
                        <SelectItem value="Kaca">Kaca</SelectItem>
                        <SelectItem value="Elektronik">Elektronik</SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button onClick={handleAddScan} className="bg-purple-500 hover:bg-purple-600 text-white rounded-md shadow-md">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Catat Scan Sampah
                    </Button>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                  Riwayat Scan Sampah
                </h3>
                {trashRecords.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">Belum ada riwayat scan sampah.</p>
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <Table className="min-w-full bg-white">
                      <TableHeader className="bg-gray-100">
                        <TableRow>
                          <TableHead className="w-[80px]">ID</TableHead>
                          <TableHead>Foto (Mock)</TableHead>
                          <TableHead>Klasifikasi</TableHead>
                          <TableHead>Waktu</TableHead>
                          <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trashRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.id.split('-')[1]}</TableCell>
                            <TableCell>
                              <img src={record.photo_url} alt={record.classified_as} className="w-12 h-12 rounded-md object-cover" />
                            </TableCell>
                            <TableCell>{record.classified_as}</TableCell>
                            <TableCell>{format(record.created_at, "dd MMM yyyy, HH:mm", { locale: idLocale })}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteScan(record.id)}
                                className="rounded-md"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card untuk Catat Eco Habit */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
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
                        onClick={() => handleLogEcoHabit(habit.name, habit.points)}
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

                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
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
                          <TableHead>Waktu Dicatat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ecoHabitLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-medium">{log.id.split('-')[1]}</TableCell>
                            <TableCell>{log.habitName}</TableCell>
                            <TableCell className="text-green-600 font-semibold">+{log.pointsEarned}</TableCell>
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
