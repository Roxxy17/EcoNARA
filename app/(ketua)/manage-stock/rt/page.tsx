"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Package, Users, Home, AlertTriangle } from 'lucide-react'
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
  user_name?: string // Ditambahkan dari join dengan tabel users
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


export default function ManageStockKetuaPage() {
  const { userProfile, loadingUser } = useUser();
  const [allDesaStockItems, setAllDesaStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [selectedFamilyId, setSelectedFamilyId] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  // Helper untuk menentukan status stok berdasarkan kuantitas
  const getStockStatus = (quantity: number | null): StockItem['status'] => {
    if (quantity === null || quantity <= 0) return 'habis';
    if (quantity <= 20) return 'menipis'; // Ambang batas "menipis"
    return 'tersedia';
  };

  // Fungsi untuk mengambil data stok seluruh desa (yang bisa diakses ketua)
  const fetchAllDesaStockItems = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("Tidak ada token otorisasi ditemukan.");
      }

      const res = await fetch("/api/stock", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorData = { message: "Gagal mengambil item stok desa." };
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const parsedData = await res.json();
            errorData.message = parsedData.message || res.statusText;
          } else {
            errorData.message = res.statusText || "Respons server tidak valid.";
          }
        } catch (e) {
          console.error("Error parsing error response in fetchAllDesaStockItems:", e);
          errorData.message = "Terjadi kesalahan saat memproses respons error.";
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

  // Efek untuk memuat data saat komponen dimuat atau userProfile berubah
  useEffect(() => {
    if (!loadingUser && userProfile) {
      // Hanya izinkan ketua/admin melihat halaman ini
      if (userProfile.role === 'ketua' || userProfile.role === 'admin') {
        fetchAllDesaStockItems();
      } else {
        setError("Akses Ditolak: Anda tidak memiliki izin untuk melihat halaman ini.");
        setMessage({ type: 'error', text: "Akses Ditolak: Hanya Ketua atau Admin yang dapat melihat halaman ini." });
        setLoading(false);
      }
    } else if (!loadingUser && !userProfile) {
      setLoading(false);
      setError("Pengguna tidak terautentikasi.");
      setMessage({ type: 'error', text: "Pengguna tidak terautentikasi. Mohon login." });
    }
  }, [userProfile, loadingUser]);

  // UseMemo untuk menghitung total stok per kategori di desa
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
    })).sort((a, b) => a.category.localeCompare(b.category)); // Urutkan berdasarkan kategori
  }, [allDesaStockItems]);

  // UseMemo untuk mengidentifikasi keluarga yang butuh perhatian
    const familiesWithShortageStatus: FamilyStatus[] = useMemo(() => {
        const familyStatus = new Map<string, { name: string, hasShortage: boolean }>();

        allDesaStockItems.forEach(item => {
            if (item.user_id && item.user_name && !familyStatus.has(item.user_id)) {
                familyStatus.set(item.user_id, { name: item.user_name, hasShortage: false });
            }

            if (item.user_id && (item.status === 'menipis' || item.status === 'habis')) {
                const currentFamily = familyStatus.get(item.user_id);
                if (currentFamily) {
                    currentFamily.hasShortage = true;
                }
            }
        });

        return Array.from(familyStatus.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            hasShortage: data.hasShortage
        })).sort((a, b) => (b.hasShortage ? 1 : 0) - (a.hasShortage ? 1 : 0) || a.name.localeCompare(b.name));
    }, [allDesaStockItems]);

    // Memo untuk memfilter daftar keluarga yang benar-benar kekurangan
    const familiesInNeed = useMemo(() => {
        return familiesWithShortageStatus.filter(family => family.hasShortage);
    }, [familiesWithShortageStatus]);


  // UseMemo untuk memfilter stok berdasarkan keluarga yang dipilih
  const filteredFamilyStock = useMemo(() => {
    if (!selectedFamilyId) {
      return [];
    }
    return allDesaStockItems.filter(item => item.user_id === selectedFamilyId);
  }, [allDesaStockItems, selectedFamilyId]);

  const getFamilyNameById = (id: string | null) => {
    if (!id) return "Pilih Keluarga";
    const family = familiesWithShortageStatus.find(f => f.id === id);
    return family ? family.name : "Keluarga Tidak Dikenal";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8 relative">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="w-6 h-6 text-blue-600" />
                <span>Dashboard Ketua Desa</span>
              </CardTitle>
              <CardDescription>Ringkasan stok pangan desa dan rincian per keluarga.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loading Overlay */}
              {(loading || loadingUser) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-700">Memuat data desa...</span>
                </div>
              )}

              {/* Message Display */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "p-3 rounded-md mb-4 text-sm font-medium",
                    message.type === 'success' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}
                  onAnimationComplete={() => {
                    if (message) {
                      setTimeout(() => setMessage(null), 5000);
                    }
                  }}
                >
                  {message.text}
                </motion.div>
              )}

              {error && !loading && (
                <div className="text-red-600 text-center py-8">{error}</div>
              )}

              {!error && !loading && userProfile && (userProfile.role === 'ketua' || userProfile.role === 'admin') ? (
                <>
                  {/* Total Pangan Desa */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    <Package className="w-5 h-5 text-green-600" />
                    <span>Total Stok Pangan Desa {userProfile.desa_id ? `(${userProfile.desa_id})` : ''}</span>
                  </h3>
                  {totalStockByCategory.length === 0 ? (
                    <p className="text-gray-600 text-center py-4">Tidak ada data stok pangan di desa ini.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border mb-8">
                      <Table className="min-w-full bg-white">
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead>Kategori</TableHead>
                            <TableHead className="text-right">Total Jumlah</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {totalStockByCategory.map((data, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{data.category}</TableCell>
                              <TableCell className="text-right">{data.totalQuantity}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {/* Kartu Analisis Warga yang Kekurangan */}
                  {familiesInNeed.length > 0 && (
                      <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                              <span>Warga Perlu Perhatian (Stok Kritis)</span>
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                              Berikut adalah keluarga dengan stok menipis atau habis. Klik nama untuk melihat rincian.
                          </p>
                          <div className="flex flex-wrap gap-2">
                              {familiesInNeed.map(family => (
                                  <Button
                                      key={family.id}
                                      variant="outline"
                                      size="sm"
                                      className="bg-white hover:bg-gray-100"
                                      onClick={() => setSelectedFamilyId(family.id)}
                                  >
                                      {family.name}
                                  </Button>
                              ))}
                          </div>
                      </div>
                  )}

                  {/* Rincian Stok Tiap Keluarga */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2 pt-8">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span>Rincian Stok Tiap Keluarga</span>
                  </h3>
                  <div className="mb-4">
                    <Label htmlFor="family-select" className="mb-1 block text-sm font-medium text-gray-700">Pilih Keluarga</Label>
                    <Select onValueChange={setSelectedFamilyId} value={selectedFamilyId || ""}>
                      <SelectTrigger className="w-full md:w-[250px] rounded-md">
                        <SelectValue placeholder="Pilih Keluarga" />
                      </SelectTrigger>
                      <SelectContent>
                        {familiesWithShortageStatus.length === 0 ? (
                          <SelectItem value="no-families" disabled>Tidak ada keluarga di desa ini</SelectItem>
                        ) : (
                          familiesWithShortageStatus.map(family => (
                            <SelectItem key={family.id} value={family.id}>
                              {family.hasShortage && <span className="mr-2">⚠️</span>} {family.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedFamilyId && filteredFamilyStock.length > 0 ? (
                    <div className="overflow-x-auto rounded-lg border">
                      <Table className="min-w-full bg-white">
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Satuan</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredFamilyStock.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell>{item.category}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>{new Date(item.added_date).toLocaleDateString("id-ID")}</TableCell>
                              <TableCell>
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  item.status === 'tersedia' && "bg-green-100 text-green-800",
                                  item.status === 'menipis' && "bg-yellow-100 text-yellow-800",
                                  item.status === 'habis' && "bg-red-100 text-red-800"
                                )}>
                                  {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : selectedFamilyId && filteredFamilyStock.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Tidak ada stok yang tercatat untuk {getFamilyNameById(selectedFamilyId)}.</p>
                  ) : (
                    <p className="text-gray-600 text-center py-8">Pilih keluarga dari daftar di atas untuk melihat rincian stok mereka.</p>
                  )}
                </>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}