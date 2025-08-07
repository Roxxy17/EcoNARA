"use client"
import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle, Users, Clock, Zap } from "lucide-react" // Menambahkan ikon Zap
import { Navbar } from "@/components/navigation/nav-dashboard" // Pastikan path ini benar
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

// Warna untuk badge urgensi yang lebih menonjol
const urgencyColors = {
  high: "bg-red-500 text-white", // Merah lebih kuat untuk urgent
  low: "bg-green-500 text-white", // Hijau lebih kuat untuk tidak urgent
}

export default function RTVerificationPage() {
  const [unverifiedRequests, setUnverifiedRequests] = useState<NeedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  // Fungsi untuk mengambil permintaan yang belum diverifikasi
  const fetchUnverifiedRequests = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) {
        toast({ title: "Akses Ditolak", description: "Anda tidak memiliki izin untuk melihat halaman ini.", variant: "destructive" });
        return;
      }

      const res = await fetch("/api/needs?is_verified=false", {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || res.statusText);
      }
      const data: NeedRequest[] = await res.json();
      setUnverifiedRequests(data);
    } catch (error: any) {
      console.error("Gagal memuat permintaan yang belum diverifikasi:", error);
      toast({ title: "Gagal memuat data verifikasi.", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangani verifikasi permintaan
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
        throw new Error(errorData.message || res.statusText);
      }

      toast({ title: "Permintaan berhasil diverifikasi!", description: "Status permintaan telah diperbarui.", variant: "default" });
      fetchUnverifiedRequests(); // Muat ulang daftar setelah verifikasi
    } catch (error: any) {
      console.error("Gagal memverifikasi permintaan:", error);
      toast({ title: "Gagal memverifikasi permintaan.", description: error.message, variant: "destructive" });
    }
  };

  // Efek samping untuk memuat permintaan saat komponen dimuat
  useEffect(() => {
    fetchUnverifiedRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 font-inter"> {/* Gradien lebih lembut, font Inter */}
      <Navbar />
      <div className="container mx-auto px-4 py-12"> {/* Padding vertikal lebih besar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md mb-10 rounded-xl"> {/* Bayangan lebih dalam, sudut lebih membulat */}
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-3xl font-bold text-gray-800"> {/* Ukuran teks lebih besar */}
                <AlertCircle className="w-8 h-8 text-orange-500" /> {/* Warna ikon lebih menonjol */}
                <span>Verifikasi Permintaan Bantuan</span>
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg mt-2">Daftar permintaan yang menunggu verifikasi dari Anda.</CardDescription> {/* Ukuran teks lebih besar */}
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="text-center py-12 flex flex-col items-center justify-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin" /> {/* Ikon lebih besar, warna biru */}
                  <p className="mt-4 text-lg text-gray-700">Memuat permintaan, mohon tunggu...</p> {/* Pesan lebih informatif */}
                </div>
              ) : unverifiedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" /> {/* Ikon besar untuk kosong */}
                  <p className="text-xl text-gray-700 font-semibold">Tidak ada permintaan yang perlu diverifikasi saat ini.</p>
                  <p className="text-gray-500 mt-2">Semua permintaan sudah diverifikasi atau belum ada permintaan baru.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Grid responsif */}
                  {unverifiedRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 + request.id * 0.05 }} // Animasi stagger
                      whileHover={{ y: -8, scale: 1.02 }} // Efek hover lebih halus
                      className="h-full"
                    >
                      <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/95 backdrop-blur-sm rounded-lg flex flex-col h-full">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {/* Badge urgensi dengan ikon */}
                              <Badge className={cn("px-3 py-1 text-sm font-semibold rounded-full", request.is_urgent ? urgencyColors.high : urgencyColors.low)}>
                                {request.is_urgent && <Zap className="w-4 h-4 mr-1" />} {/* Ikon Zap untuk urgent */}
                                {request.is_urgent ? "Sangat Urgent" : "Tidak Urgent"}
                              </Badge>
                            </div>
                            <span className="text-2xl">📦</span> {/* Ikon emoji */}
                          </div>
                          <CardTitle className="text-xl font-semibold text-gray-800 leading-snug">{request.item_name}</CardTitle>
                          <CardDescription className="text-gray-600 text-sm mt-1 line-clamp-3">{request.description}</CardDescription> {/* Batasi baris deskripsi */}
                        </CardHeader>
                        <CardContent className="flex flex-col justify-between flex-grow pt-4">
                          <div className="space-y-2 text-sm text-gray-700 mb-4">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-purple-500" />
                              <span>Oleh <span className="font-medium">{request.users.nama}</span></span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{new Date(request.created_at).toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleVerifyRequest(request.id)}
                            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" /> Verifikasi
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
