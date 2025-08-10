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
import { Search, Clock, Users, Package, AlertCircle, CheckCircle, Truck, Target, Zap, Phone, Loader2, HandHeart, Eye, Shield } from 'lucide-react'
import { Navbar } from "@/components/navigation/nav-dashboard"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Interfaces and dummy data remain the same
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

const categoryIcons = {
  food: "🍚",
  clothes: "👕",
  education: "📚",
  health: "🏥",
  electronics: "💻",
  others: "📦",
}

// Main Component
export default function AdminDonationManagementPage() {
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

  // All fetch and handler functions (fetchAllNeedsRequests, fetchAllDonations, handleVerifyRequest, etc.) remain the same.
  // ... (Keep all your existing data fetching and logic functions here)
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
        variant: "destructive",
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Ocean Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />
//
      <main className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50 mb-10 rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-3xl font-bold text-cyan-900">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span>Manajemen Komunitas</span>
              </CardTitle>
              <CardDescription className="text-cyan-700 text-lg mt-2">
                Kelola, verifikasi, dan cocokkan permintaan bantuan dengan donasi yang tersedia.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-2 bg-cyan-100/80 rounded-xl border border-cyan-200 p-1">
                  <TabsTrigger value="needs" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-cyan-800 transition-colors">
                    <HandHeart className="w-4 h-4 mr-2"/> Permintaan Bantuan
                  </TabsTrigger>
                  <TabsTrigger value="donations" className="rounded-lg data-[state=active]:bg-blue-500 data-[state=active]:text-white text-cyan-800 transition-colors">
                    <Package className="w-4 h-4 mr-2"/> Donasi Tersedia
                  </TabsTrigger>
                </TabsList>

                {/* Tab Konten: Semua Permintaan */}
                <TabsContent value="needs" className="space-y-6">
                  {/* Filter and Search Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <Input
                        placeholder="Cari permintaan (nama barang, peminta)..."
                        value={searchQueryNeeds}
                        onChange={(e) => setSearchQueryNeeds(e.target.value)}
                        className="pl-12 bg-blue-50 border-blue-200 placeholder:text-blue-600 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg"
                      />
                    </div>
                    <Select value={filterNeedsStatus} onValueChange={setFilterNeedsStatus}>
                      <SelectTrigger className="md:col-span-1 bg-blue-50 border-blue-200 text-blue-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 backdrop-blur-md border-cyan-100">
                        <SelectItem value="all" className="focus:bg-cyan-100/50 text-cyan-900">Semua Status</SelectItem>
                        <SelectItem value="unverified" className="focus:bg-cyan-100/50 text-cyan-900">Belum Diverifikasi</SelectItem>
                        <SelectItem value="verified" className="focus:bg-cyan-100/50 text-cyan-900">Diverifikasi (Aktif)</SelectItem>
                        <SelectItem value="fulfilled" className="focus:bg-cyan-100/50 text-cyan-900">Sudah Terpenuhi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Loading and Empty State */}
                  {loadingNeeds ? (
                    <div className="text-center col-span-full py-12 flex flex-col items-center justify-center">
                      <Loader2 className="h-12 w-12 text-cyan-600 animate-spin" />
                      <p className="mt-4 text-lg text-cyan-800">Memuat permintaan bantuan...</p>
                    </div>
                  ) : filteredNeedsRequests.length === 0 ? (
                    <div className="text-center col-span-full py-12 bg-cyan-50/50 rounded-2xl">
                      <CheckCircle className="h-16 w-16 mx-auto text-teal-500 mb-4" />
                      <p className="text-xl text-cyan-800 font-semibold">Tidak Ada Permintaan</p>
                      <p className="text-cyan-600 mt-2">Coba sesuaikan filter atau pencarian Anda.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                            className="h-full"
                          >
                            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-xl border-cyan-100/50 rounded-xl flex flex-col h-full">
                               <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-3">
                                    <Badge className={cn("text-white border-0 shadow-md", {
                                        "bg-gradient-to-r from-red-500 to-orange-500": request.is_urgent,
                                        "bg-gradient-to-r from-green-400 to-teal-400": !request.is_urgent,
                                    })}>
                                        <Zap className="w-3 h-3 mr-1"/>{request.is_urgent ? "Sangat Urgent" : "Biasa"}
                                    </Badge>
                                    <Badge className={cn("text-white border-0 shadow-md", {
                                        "bg-gradient-to-r from-blue-400 to-cyan-500": isVerified,
                                        "bg-gradient-to-r from-yellow-400 to-amber-500": !isVerified,
                                    })}>
                                        <CheckCircle className="w-3 h-3 mr-1"/>{isVerified ? "Terverifikasi" : "Belum Verifikasi"}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl font-semibold text-cyan-900 leading-snug">
                                  {categoryIcons[request.category as keyof typeof categoryIcons] || categoryIcons.others}{" "}
                                  {request.item_name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="flex flex-col justify-between flex-grow pt-2">
                                <div className="space-y-2 text-sm text-cyan-800 mb-4">
                                  <p className="text-cyan-700 line-clamp-2">{request.description}</p>
                                  <div className="flex items-center space-x-2 pt-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span>Oleh <span className="font-medium">{request.users?.nama || "Anonim"}</span></span>
                                  </div>
                                </div>
                                
                                <div className="flex flex-col space-y-2 mt-auto">
                                {!isFulfilled && !isVerified && (
                                    <Button onClick={() => handleVerifyRequest(request.id)} className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold shadow-md hover:shadow-lg transition-all">
                                        <CheckCircle className="w-5 h-5 mr-2" /> Verifikasi Permintaan
                                    </Button>
                                )}
                                 <Button variant="outline" onClick={() => handleContact(request.users?.nama || "Anonim", request.users?.phone_number || request.users?.email)} className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50/80">
                                    <Phone className="w-4 h-4 mr-2" /> Hubungi Peminta
                                </Button>
                                {/* Add Match button or other actions here if needed */}
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
                  {/* Filter and Search Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative md:col-span-2">
                      <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-cyan-500 w-5 h-5" />
                      <Input
                        placeholder="Cari donasi (nama barang, donatur)..."
                        value={searchQueryDonations}
                        onChange={(e) => setSearchQueryDonations(e.target.value)}
                        className="pl-12 bg-blue-50 border-blue-200 placeholder:text-blue-600 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg"
                      />
                    </div>
                    <Select value={filterDonationStatus} onValueChange={setFilterDonationStatus}>
                      <SelectTrigger className="md:col-span-1 bg-blue-50 border-blue-200 text-blue-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-lg">
                        <SelectValue placeholder="Filter Status Donasi" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/80 backdrop-blur-md border-cyan-100">
                        <SelectItem value="all" className="focus:bg-cyan-100/50 text-cyan-900">Semua Status</SelectItem>
                        <SelectItem value="available" className="focus:bg-cyan-100/50 text-cyan-900">Tersedia</SelectItem>
                        <SelectItem value="matched" className="focus:bg-cyan-100/50 text-cyan-900">Sudah Dicocokkan</SelectItem>
                        <SelectItem value="delivered" className="focus:bg-cyan-100/50 text-cyan-900">Sudah Disalurkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {loadingDonations ? (
                     <div className="text-center col-span-full py-12 flex flex-col items-center justify-center">
                      <Loader2 className="h-12 w-12 text-cyan-600 animate-spin" />
                      <p className="mt-4 text-lg text-cyan-800">Memuat data donasi...</p>
                    </div>
                  ) : filteredDonations.length === 0 ? (
                    <div className="text-center col-span-full py-12 bg-cyan-50/50 rounded-2xl">
                        <Package className="h-16 w-16 mx-auto text-teal-500 mb-4" />
                        <p className="text-xl text-cyan-800 font-semibold">Tidak Ada Donasi</p>
                        <p className="text-cyan-600 mt-2">Belum ada donasi yang cocok dengan filter Anda.</p>
                    </div>
                  ) : (
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-xl border-cyan-100/50 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader className="bg-cyan-50/70">
                            <TableRow>
                              <TableHead className="py-3 px-4 text-cyan-900">Donasi</TableHead>
                              <TableHead className="py-3 px-4 text-cyan-900">Donatur</TableHead>
                              <TableHead className="py-3 px-4 text-cyan-900">Tanggal</TableHead>
                              <TableHead className="py-3 px-4 text-cyan-900">Status</TableHead>
                              <TableHead className="py-3 px-4 text-cyan-900 text-right">Aksi</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDonations.map((donation) => (
                              <TableRow key={donation.id} className="hover:bg-cyan-50/40 transition-colors border-b-cyan-100/50">
                                <TableCell className="font-medium py-3 px-4 text-cyan-900">{donation.item_name}</TableCell>
                                <TableCell className="py-3 px-4 text-cyan-800">{donation.users?.nama || "Anonim"}</TableCell>
                                <TableCell className="text-sm text-cyan-700 py-3 px-4">
                                  {new Date(donation.created_at).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                                </TableCell>
                                <TableCell className="py-3 px-4">
                                  <Select value={donation.status} onValueChange={(newStatus) => handleUpdateDonationStatus(donation.id, newStatus as Donation['status'])}>
                                    <SelectTrigger className="w-[140px] h-9 text-sm bg-blue-50 border-blue-200 text-blue-700 focus:border-cyan-500 focus:ring-cyan-500 rounded-md">
                                      <SelectValue placeholder="Pilih Status" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white/80 backdrop-blur-md border-cyan-100">
                                      <SelectItem value="available" className="focus:bg-cyan-100/50 text-cyan-900">Tersedia</SelectItem>
                                      <SelectItem value="matched" className="focus:bg-cyan-100/50 text-cyan-900">Dicocokkan</SelectItem>
                                      <SelectItem value="delivered" className="focus:bg-cyan-100/50 text-cyan-900">Disalurkan</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell className="py-3 px-4 text-right">
                                  <Button variant="outline" size="sm" onClick={() => handleContact(donation.users?.nama || "Anonim", donation.users?.phone_number || donation.users?.email)} className="border-cyan-300 text-cyan-700 hover:bg-cyan-50/80">
                                    <Phone className="w-3 h-3 mr-2" /> Hubungi
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}