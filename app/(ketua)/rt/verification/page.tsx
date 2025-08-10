"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Users, Clock, Zap } from "lucide-react"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cn } from "@/lib/utils"

interface NeedRequest {
  id: number;
  user_id: string;
  item_name: string;
  description: string;
  is_urgent: boolean;
  created_at: string;
  users: {
    nama: string;
  };
}

// Warna untuk badge urgensi
const urgencyColors = {
  high: "bg-red-500 text-white shadow-lg shadow-red-500/30",
  low: "bg-green-500 text-white shadow-lg shadow-green-500/30",
}

export default function RTVerificationPage() {
  const [unverifiedRequests, setUnverifiedRequests] = useState<NeedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const fetchUnverifiedRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Akses ditolak. Anda harus login.");

      const res = await fetch("/api/needs?is_verified=false", {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengambil data dari server.");
      }
      const data: NeedRequest[] = await res.json();
      setUnverifiedRequests(data);
    } catch (error: any) {
      console.error("Gagal memuat permintaan:", error);
      setError(error.message);
      toast({ title: "Gagal Memuat Data", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRequest = async (id: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak diotorisasi.");
      
      const res = await fetch(`/api/needs/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ is_verified: true }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memverifikasi permintaan.");
      }

      toast({ title: "Berhasil!", description: "Permintaan telah diverifikasi.", className: "bg-green-100 text-green-800" });
      fetchUnverifiedRequests();
    } catch (error: any) {
      console.error("Gagal memverifikasi:", error);
      toast({ title: "Gagal Memverifikasi", description: error.message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchUnverifiedRequests();
  }, []);
  
  // Halaman Error
  if (error && !loading) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center">
            <Navbar />
            <div className="text-center p-8">
                <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
                <h2 className="mt-4 text-3xl font-bold text-red-800">Terjadi Kesalahan</h2>
                <p className="mt-2 text-red-600 max-w-md">{error}</p>
                 <Button onClick={fetchUnverifiedRequests} className="mt-6">Coba Lagi</Button>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative">
      {/* Loading Overlay */}
      {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <span className="ml-4 text-lg text-gray-700">Memuat permintaan...</span>
          </div>
      )}

      {/* Animated Blobs */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <Navbar />

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
          <div className="container mx-auto px-4 py-6">
              <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-red-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
                          <AlertCircle className="w-7 h-7 text-white" />
                      </div>
                      <div>
                          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                              Verifikasi Permintaan Bantuan
                          </h1>
                          <p className="text-sm text-red-700/80">Tinjau dan setujui permintaan bantuan dari warga.</p>
                      </div>
                  </div>
                  <Badge className="bg-amber-100/80 text-amber-800 backdrop-blur-sm border border-amber-300 text-sm px-3 py-1">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {unverifiedRequests.length} Permintaan Menunggu
                  </Badge>
              </div>
          </div>
      </header>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {!loading && unverifiedRequests.length === 0 ? (
          <div className="text-center py-20">
            <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-4" />
            <p className="text-2xl text-gray-800 font-bold">Kerja Bagus!</p>
            <p className="text-gray-600 mt-2 text-lg">Tidak ada permintaan yang perlu diverifikasi saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {unverifiedRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="h-full"
              >
                <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-xl flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                        <Badge className={cn("px-3 py-1 text-xs font-bold rounded-full border-0", request.is_urgent ? urgencyColors.high : urgencyColors.low)}>
                            {request.is_urgent && <Zap className="w-3 h-3 mr-1" />}
                            {request.is_urgent ? "Sangat Urgent" : "Bantuan Biasa"}
                        </Badge>
                        <span className="text-2xl transform -translate-y-1">📦</span>
                    </div>
                    <CardTitle className="text-xl font-semibold text-gray-800 leading-snug">{request.item_name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col justify-between flex-grow pt-2">
                    <div>
                        <CardDescription className="text-gray-600 text-sm mb-4 line-clamp-3">{request.description}</CardDescription>
                        <div className="space-y-2 text-sm text-gray-700 mb-4 border-t pt-3">
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span>Oleh: <span className="font-medium">{request.users.nama}</span></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span>{new Date(request.created_at).toLocaleDateString("id-ID", { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>
                    <Button
                      onClick={() => handleVerifyRequest(request.id)}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" /> Verifikasi Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}