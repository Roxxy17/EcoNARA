"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Clock, Users, Package, AlertCircle, CheckCircle, Truck, Target, Zap, Phone, Loader2, HandHeart, Eye, LinkIcon } from 'lucide-react'
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Interface untuk data Donasi
interface Donation {
  id: number
  user_id: string
  item_name: string
  description: string
  created_at: string
  status: "available" | "matched" | "delivered"
  need_request_id?: number | null
  users: {
    nama: string
    phone_number?: string
    email?: string
  }
}

// Interface untuk data Permintaan Kebutuhan
interface NeedRequest {
  id: number
  user_id: string
  item_name: string
  description: string
  is_urgent: boolean
  latitude?: number
  longitude?: number
  created_at: string
  category?: string | null
  needed?: string[] | null
  is_verified?: boolean
  is_fulfilled?: boolean
  users: {
    nama: string
    phone_number?: string
    email?: string
  }
}

const urgencyColors = {
  high: "bg-red-500 text-white",
  low: "bg-green-500 text-white",
}

const categoryIcons = {
  food: "🍚",
  clothes: "👕",
  education: "📚",
  health: "🏥",
  electronics: "💻",
  others: "📦",
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("needs")
  const [needsRequests, setNeedsRequests] = useState<NeedRequest[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [loadingNeeds, setLoadingNeeds] = useState(true)
  const [loadingDonations, setLoadingDonations] = useState(true)
  const [searchQueryNeeds, setSearchQueryNeeds] = useState("")
  const [searchQueryDonations, setSearchQueryDonations] = useState("")
  const [filterNeedsStatus, setFilterNeedsStatus] = useState("all")
  const [filterDonationStatus, setFilterDonationStatus] = useState("all")
  const [showConnectedDonorsMap, setShowConnectedDonorsMap] = useState<Map<number, boolean>>(new Map())
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const fetchAllNeedsRequests = async () => {
    setLoadingNeeds(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki izin untuk melihat data ini.",
          variant: "destructive",
        })
        return
      }
      const res = await fetch("/api/needs", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || res.statusText)
      }
      const data: NeedRequest[] = await res.json()
      setNeedsRequests(data)
    } catch (error: any) {
      toast({
        title: "Gagal memuat permintaan.",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoadingNeeds(false)
    }
  }

  const fetchAllDonations = async () => {
    setLoadingDonations(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki izin untuk melihat data ini.",
          variant: "destructive",
        })
        return
      }
      const res = await fetch("/api/donations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || res.statusText)
      }
      const data: Donation[] = await res.json()
      setDonations(data)
    } catch (error: any) {
      toast({
        title: "Gagal memuat donasi.",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoadingDonations(false)
    }
  }

  // Fungsi untuk memverifikasi permintaan (diperbaiki agar tidak refresh)
  const handleVerifyRequest = async (id: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error("Tidak diotorisasi.")

      const res = await fetch(`/api/needs/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_verified: true }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || res.statusText)
      }

      // MEMPERBARUI STATE SECARA LANGSUNG
      setNeedsRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === id ? { ...req, is_verified: true } : req
        )
      )
      toast({
        title: "Permintaan berhasil diverifikasi!",
        description: "Status permintaan telah diperbarui.",
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Gagal memverifikasi permintaan.",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  // Fungsi untuk menandai donasi sebagai 'matched' dan permintaan sebagai 'fulfilled' (diperbaiki)
  const handleMatchDonation = async (donationId: number, needRequestId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error("Tidak diotorisasi.")
      const donationRes = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'matched', need_request_id: needRequestId }),
      })
      if (!donationRes.ok) {
        const errorData = await donationRes.json()
        throw new Error(errorData.message || donationRes.statusText)
      }
      const needRes = await fetch(`/api/needs/${needRequestId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_fulfilled: true }),
      })
      if (!needRes.ok) {
        const errorData = await needRes.json()
        throw new Error(errorData.message || needRes.statusText)
      }
      // MEMPERBARUI STATE SECARA LANGSUNG
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation.id === donationId ? { ...donation, status: 'matched', need_request_id: needRequestId } : donation
        )
      )
      setNeedsRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === needRequestId ? { ...req, is_fulfilled: true } : req
        )
      )

      toast({ title: "Donasi berhasil dicocokkan & Permintaan terpenuhi!", description: "Status telah diperbarui.", variant: "default" })
    } catch (error: any) {
      toast({ title: "Gagal mencocokkan donasi.", description: error.message, variant: "destructive" })
    }
  }

  // Fungsi untuk update status donasi langsung dari tabel (diperbaiki)
  const handleUpdateDonationStatus = async (donationId: number, newStatus: "available" | "matched" | "delivered") => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error("Tidak diotorisasi.")

      const res = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || res.statusText)
      }

      // MEMPERBARUI STATE DONASI SECARA LANGSUNG
      setDonations(prevDonations =>
        prevDonations.map(donation =>
          donation.id === donationId ? { ...donation, status: newStatus } : donation
        )
      )
      toast({
        title: "Status donasi berhasil diperbarui!",
        description: `Status donasi ID ${donationId} kini menjadi '${newStatus}'.`,
        variant: "default",
      })
    } catch (error: any) {
      toast({
        title: "Gagal memperbarui status donasi.",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchAllNeedsRequests()
    fetchAllDonations()
  }, [])

  // Filter untuk permintaan kebutuhan
  const filteredNeedsRequests = needsRequests.filter((request) => {
    const userName = request.users?.nama || ""
    const matchesSearch =
      searchQueryNeeds === "" ||
      request.item_name.toLowerCase().includes(searchQueryNeeds.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQueryNeeds.toLowerCase()) ||
      userName.toLowerCase().includes(searchQueryNeeds.toLowerCase())
    const matchesStatus =
      filterNeedsStatus === "all" ||
      (filterNeedsStatus === "unverified" && !request.is_verified) ||
      (filterNeedsStatus === "verified" && request.is_verified && !request.is_fulfilled) ||
      (filterNeedsStatus === "fulfilled" && request.is_fulfilled)
    return matchesSearch && matchesStatus
  })

  // Filter untuk donasi
  const filteredDonations = donations.filter((donation) => {
    const userName = donation.users?.nama || ""
    const matchesSearch =
      searchQueryDonations === "" ||
      donation.item_name.toLowerCase().includes(searchQueryDonations.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchQueryDonations.toLowerCase()) ||
      userName.toLowerCase().includes(searchQueryDonations.toLowerCase())
    const matchesStatus =
      filterDonationStatus === "all" || donation.status === filterDonationStatus
    return matchesSearch && matchesStatus
  })

  const findAvailableMatchingDonations = (request: NeedRequest) => {
    const matches = donations.filter(
      (donation) =>
        donation.status === "available" &&
        donation.item_name.toLowerCase().includes(request.item_name.toLowerCase())
    )
    return matches
  }

  const findConnectedDonations = (request: NeedRequest) => {
    const connected = donations.filter(
      (donation) => donation.need_request_id === request.id
    )
    return connected
  }

  const handleContact = (name: string, contactInfo?: string) => {
    if (contactInfo) {
      toast({
        title: `Menghubungi ${name}`,
        description: `Informasi kontak: ${contactInfo}.`,
        variant: "default",
      })
    } else {
      toast({
        title: `Tidak ada info kontak untuk ${name}`,
        description: "Informasi kontak tidak tersedia.",
        variant: "warning",
      })
    }
  }

  const toggleConnectedDonors = (requestId: number) => {
    setShowConnectedDonorsMap(prevMap => {
      const newMap = new Map(prevMap)
      newMap.set(requestId, !newMap.get(requestId))
      return newMap
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 font-inter">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md mb-10 rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-3xl font-bold text-gray-800">
                <Target className="w-8 h-8 text-teal-600" /> {/* Changed to teal for softer look */}
                <span>Dashboard Admin</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg mt-2">
                Kelola permintaan bantuan dan donasi di komunitas Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-2 bg-gray-100 rounded-lg p-1">
                  <TabsTrigger value="needs" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md transition-all">Semua Permintaan</TabsTrigger>
                  <TabsTrigger value="donations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 rounded-md transition-all">Semua Donasi</TabsTrigger>
                </TabsList>

                {/* Tab Konten: Semua Permintaan */}
                <TabsContent value="needs" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari permintaan (nama, deskripsi, peminta)..."
                        value={searchQueryNeeds}
                        onChange={(e) => setSearchQueryNeeds(e.target.value)}
                        className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <Select
                      value={filterNeedsStatus}
                      onValueChange={setFilterNeedsStatus}
                    >
                      <SelectTrigger className="md:col-span-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="unverified">
                          Belum Diverifikasi
                        </SelectItem>
                        <SelectItem value="verified">
                          Sudah Diverifikasi
                        </SelectItem>
                        <SelectItem value="fulfilled">
                          Sudah Terpenuhi
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {loadingNeeds ? (
                    <div className="text-center col-span-full py-12 flex flex-col items-center justify-center">
                      <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                      <p className="mt-4 text-lg text-gray-700">
                        Memuat permintaan bantuan...
                      </p>
                    </div>
                  ) : filteredNeedsRequests.length === 0 ? (
                    <div className="text-center col-span-full py-12">
                      <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                      <p className="text-xl text-gray-700 font-semibold">
                        Tidak ada permintaan yang cocok dengan filter.
                      </p>
                      <p className="text-gray-500 mt-2">
                        Coba sesuaikan filter atau pencarian Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredNeedsRequests.map((request, index) => {
                        const availableMatchingDonations = findAvailableMatchingDonations(request)
                        const connectedDonations = findConnectedDonations(request)
                        const isVerified = request.is_verified || false
                        const isFulfilled = request.is_fulfilled || false
                        const showConnectedDonors = showConnectedDonorsMap.get(request.id) || false

                        return (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.05 * index }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="h-full"
                          >
                            <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col h-full">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <Badge
                                      className={cn(
                                        "px-3 py-1 text-sm font-semibold rounded-full",
                                        request.is_urgent
                                          ? urgencyColors.high
                                          : urgencyColors.low
                                      )}
                                    >
                                      {request.is_urgent && (
                                        <Zap className="w-4 h-4 mr-1" />
                                      )}
                                      {request.is_urgent
                                        ? "Sangat Urgent"
                                        : "Tidak Urgent"}
                                    </Badge>
                                  </div>
                                  {isVerified ? (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      <CheckCircle className="w-3 h-3 mr-1" />{" "}
                                      Terverifikasi
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                      <AlertCircle className="w-3 h-3 mr-1" />{" "}
                                      Belum Verifikasi
                                    </Badge>
                                  )}
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-800 leading-snug">
                                  {categoryIcons[
                                    request.category as keyof typeof categoryIcons
                                  ] || categoryIcons.others}{" "}
                                  {request.item_name}
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-sm mt-1 line-clamp-3">
                                  {request.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="flex flex-col justify-between flex-grow pt-4">
                                <div className="space-y-2 text-sm text-gray-700 mb-4">
                                  <div className="flex items-center space-x-2">
                                    <Users className="w-4 h-4 text-purple-500" />
                                    <span>
                                      Oleh{" "}
                                      <span className="font-medium">
                                        {request.users?.nama ||
                                          "Pengguna Tidak Dikenal"}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span>
                                      {new Date(
                                        request.created_at
                                      ).toLocaleDateString("id-ID", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </span>
                                  </div>
                                  {isFulfilled && (
                                    <div className="flex items-center space-x-2 text-green-700 font-medium">
                                      <Truck className="w-4 h-4" />
                                      <span>Sudah Terpenuhi</span>
                                    </div>
                                  )}
                                  {availableMatchingDonations.length > 0 && !isFulfilled && (
                                    <div className="flex items-center space-x-2 text-pink-600 font-medium">
                                      <HandHeart className="w-4 h-4" />
                                      <span>{availableMatchingDonations.length} Donasi Siap Dicocokkan!</span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col space-y-2 mt-4">
                                  {connectedDonations.length > 0 && (
                                    <Button
                                      variant="outline"
                                      onClick={() => toggleConnectedDonors(request.id)}
                                      className="w-full border-purple-400 text-purple-600 hover:bg-purple-50"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />{" "}
                                      {showConnectedDonors ? "Sembunyikan" : "Lihat"} Donatur Terhubung ({connectedDonations.length})
                                    </Button>
                                  )}
                                  {showConnectedDonors && connectedDonations.length > 0 && (
                                    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
                                      <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center p-3 bg-gray-50 border-b">
                                        <HandHeart className="w-4 h-4 mr-2 text-purple-500"/>
                                        Donatur Terhubung
                                      </h4>
                                      <div className="overflow-x-auto"> {/* Added for responsiveness */}
                                        <Table>
                                          <TableHeader>
                                            <TableRow className="bg-gray-50">
                                              <TableHead className="py-2 px-3">Nama Donasi</TableHead>
                                              <TableHead className="py-2 px-3">Donatur</TableHead>
                                              <TableHead className="py-2 px-3">Status</TableHead>
                                              <TableHead className="py-2 px-3">Kontak</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {connectedDonations.map((donation) => (
                                              <TableRow key={donation.id} className="text-xs">
                                                <TableCell className="py-2 px-3">{donation.item_name}</TableCell>
                                                <TableCell className="py-2 px-3">{donation.users?.nama || "Pengguna Tidak Dikenal"}</TableCell>
                                                <TableCell className="py-2 px-3">
                                                  <Badge className={cn("px-2 py-1 text-xs font-semibold rounded-full", {
                                                    "bg-green-100 text-green-800": donation.status === "available",
                                                    "bg-blue-100 text-blue-800": donation.status === "matched",
                                                    "bg-purple-100 text-purple-800": donation.status === "delivered",
                                                  })}>
                                                    {donation.status === "available"
                                                      ? "Tersedia"
                                                      : donation.status === "matched"
                                                      ? "Dicocokkan"
                                                      : "Disalurkan"}
                                                  </Badge>
                                                </TableCell>
                                                <TableCell className="py-2 px-3">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      handleContact(
                                                        donation.users?.nama || "Pengguna Tidak Dikenal",
                                                        donation.users?.phone_number || donation.users?.email
                                                      )
                                                    }
                                                    className="hover:bg-gray-100"
                                                  >
                                                    <Phone className="w-3 h-3" />
                                                  </Button>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </div>
                                  )}

                                  {!isFulfilled && (
                                    <>
                                      {!isVerified && (
                                        <Button
                                          onClick={() => handleVerifyRequest(request.id)}
                                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                        >
                                          <CheckCircle className="w-5 h-5 mr-2" /> Verifikasi
                                        </Button>
                                      )}
                                    </>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() =>
                                      handleContact(
                                        request.users?.nama || "Pengguna Tidak Dikenal",
                                        request.users?.phone_number || request.users?.email
                                      )
                                    }
                                    className="w-full border-teal-400 text-teal-600 hover:bg-teal-50"
                                  >
                                    <Phone className="w-4 h-4 mr-2" /> Hubungi Peminta
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </TabsContent>

                {/* Tab Konten: Semua Donasi */}
                <TabsContent value="donations" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Cari donasi (nama, deskripsi, donatur)..."
                        value={searchQueryDonations}
                        onChange={(e) =>
                          setSearchQueryDonations(e.target.value)
                        }
                        className="pl-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />
                    </div>
                    <Select
                      value={filterDonationStatus}
                      onValueChange={setFilterDonationStatus}
                    >
                      <SelectTrigger className="md:col-span-1 border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                        <SelectValue placeholder="Filter Status Donasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Status</SelectItem>
                        <SelectItem value="available">Tersedia</SelectItem>
                        <SelectItem value="matched">
                          Sudah Dicocokkan
                        </SelectItem>
                        <SelectItem value="delivered">
                          Sudah Disalurkan
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {loadingDonations ? (
                    <div className="text-center col-span-full py-12 flex flex-col items-center justify-center">
                      <Loader2 className="h-12 w-12 text-teal-600 animate-spin" />
                      <p className="mt-4 text-lg text-gray-700">
                        Memuat donasi...
                      </p>
                    </div>
                  ) : filteredDonations.length === 0 ? (
                    <div className="text-center col-span-full py-12">
                      <Package className="h-16 w-16 mx-auto text-purple-500 mb-4" />
                      <p className="text-xl text-gray-700 font-semibold">
                        Tidak ada donasi yang cocok dengan filter.
                      </p>
                      <p className="text-gray-500 mt-2">
                        Coba sesuaikan filter atau pencarian Anda.
                      </p>
                    </div>
                  ) : (
                    <div className="col-span-full rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                      <div className="overflow-x-auto"> {/* Added for responsiveness */}
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="py-3 px-4 text-gray-700">ID Donasi</TableHead>
                              <TableHead className="py-3 px-4 text-gray-700">Donasi</TableHead>
                              <TableHead className="py-3 px-4 text-gray-700">Deskripsi</TableHead>
                              <TableHead className="py-3 px-4 text-gray-700">Donatur</TableHead>
                              <TableHead className="py-3 px-4 text-gray-700">Status</TableHead>
                              <TableHead className="py-3 px-4 text-gray-700">Tanggal Dibuat</TableHead>
                              <TableHead className="py-3 px-4 text-gray-700">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDonations.map((donation) => (
                              <TableRow key={donation.id} className="hover:bg-gray-50 transition-colors">
                                <TableCell className="font-mono text-xs py-3 px-4">{donation.id}</TableCell>
                                <TableCell className="font-medium py-3 px-4">{donation.item_name}</TableCell>
                                <TableCell className="text-sm text-gray-600 py-3 px-4">{donation.description}</TableCell>
                                <TableCell className="py-3 px-4">{donation.users?.nama || "Pengguna Tidak Dikenal"}</TableCell>
                                <TableCell className="py-3 px-4">
                                  <Select
                                    value={donation.status}
                                    onValueChange={(newStatus) => handleUpdateDonationStatus(donation.id, newStatus as Donation['status'])}
                                  >
                                    <SelectTrigger className="w-[140px] h-8 text-sm border-gray-300 focus:border-teal-500 focus:ring-teal-500">
                                      <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="available">Tersedia</SelectItem>
                                      <SelectItem value="matched">Dicocokkan</SelectItem>
                                      <SelectItem value="delivered">Disalurkan</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 py-3 px-4">
                                  {new Date(donation.created_at).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleContact(
                                        donation.users?.nama || "Pengguna Tidak Dikenal",
                                        donation.users?.phone_number || donation.users?.email
                                      )
                                    }
                                    className="hover:bg-gray-100"
                                  >
                                    <Phone className="w-3 h-3 mr-2" /> Hubungi
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
