"use client";

import React from "react";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Package,
  PlusCircle,
  Trash2,
  Loader2,
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Waves,
  Fish,
  Droplets,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Navbar } from "@/components/navigation/nav-dashboard";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Interface untuk struktur data stok
interface StockItem {
  id: string;
  name: string;
  category: string | null;
  added_date: string;
  quantity: number | null;
  unit: string | null;
  created_at: string;
  user_id: string;
  user_name?: string;
  status?: "tersedia" | "menipis" | "habis";
}

const categoryIcons = {
  "Bahan Pokok": "🌾",
  "Makanan Instan": "🍜",
  Donasi: "❤️",
  "Lain-lain": "📦",
};

const statusConfig = {
  tersedia: {
    icon: CheckCircle,
    color: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-800",
    borderColor: "border-emerald-200",
  },
  menipis: {
    icon: AlertTriangle,
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    textColor: "text-amber-800",
    borderColor: "border-amber-200",
  },
  habis: {
    icon: X,
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50",
    textColor: "text-red-800",
    borderColor: "border-red-200",
  },
};

export default function ManageStockPage() {
  const { userProfile, loadingUser } = useUser();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // State untuk form penambahan stok baru
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    quantity: "",
    unit: "",
    added_date: new Date(),
  });

  // State untuk fungsionalitas edit
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // State untuk pesan feedback kepada pengguna
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // State untuk dialog konfirmasi hapus
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  // Gunakan client khusus komponen
  const supabase = createClientComponentClient();

  // Helper to determine stock status based on quantity
  const getStockStatus = (quantity: number | null): StockItem["status"] => {
    if (quantity === null || quantity <= 0) return "habis";
    if (quantity <= 20) return "menipis";
    return "tersedia";
  };

  // Fungsi untuk mengambil data dari API
  const fetchStockItems = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("Tidak ada token otorisasi ditemukan.");
      }

      const res = await fetch("/api/stock", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = { message: "Gagal mengambil item stok." };
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const parsedData = await res.json();
            errorData.message = parsedData.message || res.statusText;
          } else {
            errorData.message = res.statusText || "Respons server tidak valid.";
          }
        } catch (e) {
          console.error("Error parsing error response in fetchStockItems:", e);
          errorData.message = "Terjadi kesalahan saat memproses respons error.";
        }
        throw new Error(errorData.message);
      }

      const data: StockItem[] = await res.json();
      const itemsWithStatus = data.map((item) => ({
        ...item,
        status: getStockStatus(item.quantity),
      }));
      setStockItems(itemsWithStatus);
    } catch (e: any) {
      console.error("Error fetching stock items:", e);
      setError(e.message);
      setMessage({ type: "error", text: `Gagal memuat data: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk memuat data
  useEffect(() => {
    if (!loadingUser && userProfile) {
      fetchStockItems();
    } else if (!loadingUser && !userProfile) {
      setLoading(false);
      setError("Pengguna tidak terautentikasi.");
      setMessage({
        type: "error",
        text: "Pengguna tidak terautentikasi. Mohon login.",
      });
    }
  }, [userProfile, loadingUser]);

  // Handler untuk input form penambahan stok baru
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setNewItem((prev) => ({ ...prev, category: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewItem((prev) => ({ ...prev, added_date: date }));
    }
  };

  // Handler untuk input form edit stok
  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | string,
    field: keyof StockItem
  ) => {
    setEditingItem((prev) => {
      if (!prev) return null;
      let value: any;
      if (typeof e === "string") {
        // Untuk komponen Select
        value = e;
      } else {
        // Untuk komponen Input
        value = e.target.value;
      }

      if (field === "quantity") {
        value = Number.parseFloat(value);
        if (isNaN(value)) value = null; // Tangani input angka kosong atau tidak valid
      }
      return { ...prev, [field]: value };
    });
  };

  const handleEditDateChange = (date: Date | undefined) => {
    setEditingItem((prev) => {
      if (!prev) return null;
      // Pastikan added_date tetap string dalam format ISO (YYYY-MM-DD)
      return {
        ...prev,
        added_date: date ? format(date, "yyyy-MM-dd") : prev.added_date,
      };
    });
  };

  // Fungsi untuk menambah stok baru
  const handleAddStock = async () => {
    if (
      !newItem.name ||
      !newItem.category ||
      !newItem.quantity ||
      !newItem.unit
    ) {
      setMessage({
        type: "error",
        text: "Mohon lengkapi semua kolom untuk menambahkan stok.",
      });
      return;
    }
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

      const res = await fetch("/api/stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          quantity: Number.parseFloat(newItem.quantity),
          unit: newItem.unit,
          added_date: format(newItem.added_date, "yyyy-MM-dd"), // Format tanggal ke YYYY-MM-DD
        }),
      });

      if (!res.ok) {
        const errorData = { message: "Gagal menambah stok." };
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const parsedData = await res.json();
            errorData.message = parsedData.message || res.statusText;
          } else {
            errorData.message = res.statusText || "Respons server tidak valid.";
          }
        } catch (e) {
          console.error("Error parsing error response in handleAddStock:", e);
          errorData.message = "Terjadi kesalahan saat memproses respons error.";
        }
        throw new Error(errorData.message);
      }

      await fetchStockItems();
      setNewItem({
        name: "",
        category: "",
        quantity: "",
        unit: "",
        added_date: new Date(),
      });
      setMessage({ type: "success", text: "Stok berhasil ditambahkan!" });
    } catch (e: any) {
      console.error("Error adding stock:", e);
      setMessage({ type: "error", text: `Gagal menambah stok: ${e.message}` });
    }
  };

  // Fungsi untuk mengaktifkan mode edit
  const handleEditClick = (item: StockItem) => {
    setEditingItem({ ...item }); // Buat salinan objek agar tidak langsung memodifikasi state asli
  };

  // Fungsi untuk menyimpan perubahan setelah edit
  const handleSaveEdit = async () => {
    if (!editingItem) return;

    // Validasi data sebelum menyimpan
    if (
      !editingItem.name ||
      !editingItem.category ||
      editingItem.quantity === null ||
      !editingItem.unit ||
      !editingItem.added_date
    ) {
      setMessage({
        type: "error",
        text: "Mohon lengkapi semua kolom untuk memperbarui stok.",
      });
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

      const res = await fetch(`/api/stock/${editingItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingItem.name,
          category: editingItem.category,
          quantity: editingItem.quantity,
          unit: editingItem.unit,
          added_date: format(new Date(editingItem.added_date), "yyyy-MM-dd"), // Pastikan format tanggal sesuai API
        }),
      });

      if (!res.ok) {
        const errorData = { message: "Gagal memperbarui stok." };
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const parsedData = await res.json();
            errorData.message = parsedData.message || res.statusText;
          } else {
            errorData.message = res.statusText || "Respons server tidak valid.";
          }
        } catch (e) {
          console.error("Error parsing error response in handleSaveEdit:", e);
          errorData.message = "Terjadi kesalahan saat memproses respons error.";
        }
        throw new Error(errorData.message);
      }

      await fetchStockItems(); // Muat ulang data setelah berhasil diperbarui
      setEditingItem(null); // Keluar dari mode edit
      setMessage({ type: "success", text: "Stok berhasil diperbarui!" });
    } catch (e: any) {
      console.error("Error saving stock:", e);
      setMessage({
        type: "error",
        text: `Gagal memperbarui stok: ${e.message}`,
      });
    }
  };

  // Fungsi untuk membatalkan mode edit
  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  // Fungsi untuk menghapus stok (menggunakan dialog konfirmasi)
  const handleDeleteStock = (id: string) => {
    setItemToDeleteId(id);
    setShowConfirmDeleteDialog(true);
  };

  // Fungsi yang dipanggil setelah konfirmasi hapus
  const confirmDelete = async () => {
    if (!itemToDeleteId) {
      console.warn("Attempted to confirm delete without an itemToDeleteId.");
      return;
    }

    console.log(
      "Client: Attempting to delete stock item with ID:",
      itemToDeleteId
    ); // Added log

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

      const res = await fetch(`/api/stock/${itemToDeleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = { message: "Gagal menghapus stok." };
        try {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const parsedData = await res.json();
            errorData.message = parsedData.message || res.statusText;
          } else {
            errorData.message = res.statusText || "Respons server tidak valid.";
          }
        } catch (e) {
          console.error("Error parsing error response in confirmDelete:", e);
          errorData.message = "Terjadi kesalahan saat memproses respons error.";
        }
        throw new Error(errorData.message);
      }
      setStockItems((prev) =>
        prev.filter((item) => item.id !== itemToDeleteId)
      );
      setMessage({ type: "success", text: "Stok berhasil dihapus!" });
    } catch (e: any) {
      console.error("Error deleting stock:", e);
      setMessage({ type: "error", text: `Gagal menghapus stok: ${e.message}` });
    } finally {
      setShowConfirmDeleteDialog(false);
      setItemToDeleteId(null);
    }
  };

  const filteredStockItems = useMemo(() => {
    let filtered = stockItems;
    if (filterCategory !== "all") {
      filtered = filtered.filter((item) => item.category === filterCategory);
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.category?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.unit?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return filtered;
  }, [stockItems, filterCategory, searchTerm]);

  // Calculate stock statistics
  const stockStats = useMemo(() => {
    const total = stockItems.length;
    const tersedia = stockItems.filter(
      (item) => item.status === "tersedia"
    ).length;
    const menipis = stockItems.filter(
      (item) => item.status === "menipis"
    ).length;
    const habis = stockItems.filter((item) => item.status === "habis").length;
    const totalQuantity = stockItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    return { total, tersedia, menipis, habis, totalQuantity };
  }, [stockItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
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
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/25">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
                  Ocean Stock Manager
                </h1>
                <p className="text-sm text-cyan-700/80 flex items-center">
                  <Waves className="w-4 h-4 mr-1" />
                  Kelola inventaris dengan sistem yang berkelanjutan
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg">
                <Package className="w-3 h-3 mr-1" />
                {stockStats.total} Items
              </Badge>
              <Badge className="bg-cyan-100/80 text-cyan-800 backdrop-blur-sm">
                {stockStats.totalQuantity} Total Qty
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 text-white border-0 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.tersedia}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Stok Tersedia
                </div>
                <div className="text-xs opacity-75 mt-2 bg-white/20 rounded-full px-2 py-1">
                  Kondisi Baik
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="text-center bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 text-white border-0 shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.menipis}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Stok Menipis
                </div>
                <div className="text-xs opacity-75 mt-2 bg-white/20 rounded-full px-2 py-1">
                  Perlu Perhatian
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="text-center bg-gradient-to-br from-red-400 via-pink-500 to-rose-500 text-white border-0 shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <X className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.habis}
                </div>
                <div className="text-sm opacity-90 font-medium">Stok Habis</div>
                <div className="text-xs opacity-75 mt-2 bg-white/20 rounded-full px-2 py-1">
                  Segera Isi Ulang
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="text-center bg-gradient-to-br from-cyan-300 via-blue-200 to-teal-200 text-cyan-900 border-0 shadow-xl shadow-cyan-300/25 hover:shadow-2xl hover:shadow-cyan-300/30 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <Package className="w-10 h-10 mx-auto mb-3 text-cyan-700 drop-shadow-sm" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.total}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Total Items
                </div>
                <div className="text-xs opacity-75 mt-2 bg-cyan-500/20 rounded-full px-2 py-1">
                  Semua Kategori
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50 mb-8 relative overflow-hidden">
            {/* Loading Overlay */}
            {(loading || loadingUser) && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center animate-pulse">
                    <Waves className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
                    <span className="text-cyan-700 font-medium">
                      Memuat data ocean stock...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3 text-cyan-900">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <Fish className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">
                  Ocean Stock Management
                </span>
              </CardTitle>
              <CardDescription className="text-cyan-700">
                Kelola inventaris Anda dengan sistem yang terintegrasi dan
                berkelanjutan
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Message Display */}
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "p-4 rounded-2xl text-sm font-medium border backdrop-blur-sm",
                    message.type === "success"
                      ? "bg-gradient-to-r from-emerald-50/80 to-teal-50/80 text-emerald-800 border-emerald-200"
                      : "bg-gradient-to-r from-red-50/80 to-pink-50/80 text-red-800 border-red-200"
                  )}
                  onAnimationComplete={() => {
                    if (message) {
                      setTimeout(() => setMessage(null), 5000);
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {message.type === "success" ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5" />
                    )}
                    <span>{message.text}</span>
                  </div>
                </motion.div>
              )}

              {error && !loading && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-red-600 font-medium mb-2">
                    Gagal memuat data
                  </div>
                  <div className="text-red-500 text-sm">{error}</div>
                </div>
              )}

              {!error && !loading && (
                <>
                  {/* Form Tambah Stok Baru */}
                  <Card className="border-0 bg-gradient-to-br from-cyan-50/80 to-blue-50/80 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-cyan-900">
                        <PlusCircle className="w-5 h-5 text-cyan-600" />
                        <span>Tambah Stok Baru</span>
                      </CardTitle>
                      <CardDescription className="text-cyan-700">
                        Masukkan detail item baru ke dalam inventaris ocean
                        stock
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label
                            htmlFor="name"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Nama Barang
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={newItem.name}
                            onChange={handleInputChange}
                            placeholder="Contoh: Beras Premium, Ikan Segar"
                            className="rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="category"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Kategori
                          </Label>
                          <Select
                            onValueChange={(value) => handleSelectChange(value)}
                            value={newItem.category}
                          >
                            <SelectTrigger className="w-full rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm">
                              <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white/95 backdrop-blur-xl">
                              <SelectItem value="Bahan Pokok">
                                🌾 Bahan Pokok
                              </SelectItem>
                              <SelectItem value="Makanan Instan">
                                🍜 Makanan Instan
                              </SelectItem>
                              <SelectItem value="Donasi">❤️ Donasi</SelectItem>
                              <SelectItem value="Lain-lain">
                                📦 Lain-lain
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="quantity"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Jumlah
                          </Label>
                          <Input
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={newItem.quantity}
                            onChange={handleInputChange}
                            placeholder="Contoh: 50"
                            className="rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="unit"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Satuan
                          </Label>
                          <Input
                            id="unit"
                            name="unit"
                            value={newItem.unit}
                            onChange={handleInputChange}
                            placeholder="Contoh: kg, liter, pcs"
                            className="rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="added_date"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Tanggal Ditambahkan
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm",
                                  !newItem.added_date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newItem.added_date ? (
                                  format(newItem.added_date, "PPP", {
                                    locale: idLocale,
                                  })
                                ) : (
                                  <span>Pilih tanggal</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl bg-white/95 backdrop-blur-xl">
                              <Calendar
                                mode="single"
                                selected={newItem.added_date}
                                onSelect={handleDateChange}
                                initialFocus
                                locale={idLocale}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="md:col-span-2 lg:col-span-1 flex items-end">
                          <Button
                            onClick={handleAddStock}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Tambah ke Ocean Stock
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Search and Filter Section */}
                  <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-teal-50/80 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-cyan-900">
                        <Search className="w-5 h-5 text-cyan-600" />
                        <span>Pencarian & Filter</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <Label
                            htmlFor="search"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Cari Barang
                          </Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-500" />
                            <Input
                              id="search"
                              type="text"
                              placeholder="Cari nama, kategori, atau satuan..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="filterCategory"
                            className="text-sm font-semibold text-cyan-700"
                          >
                            Filter Kategori
                          </Label>
                          <Select
                            onValueChange={setFilterCategory}
                            value={filterCategory}
                          >
                            <SelectTrigger className="w-full md:w-[200px] rounded-xl border-cyan-200 focus:border-cyan-400 bg-white/80 backdrop-blur-sm">
                              <Filter className="w-4 h-4 mr-2 text-cyan-500" />
                              <SelectValue placeholder="Semua Kategori" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl bg-white/95 backdrop-blur-xl">
                              <SelectItem value="all">
                                🌊 Semua Kategori
                              </SelectItem>
                              <SelectItem value="Bahan Pokok">
                                🌾 Bahan Pokok
                              </SelectItem>
                              <SelectItem value="Makanan Instan">
                                🍜 Makanan Instan
                              </SelectItem>
                              <SelectItem value="Donasi">❤️ Donasi</SelectItem>
                              <SelectItem value="Lain-lain">
                                📦 Lain-lain
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            onClick={fetchStockItems}
                            variant="outline"
                            className="w-full md:w-auto rounded-xl border-cyan-200 hover:bg-cyan-50 text-cyan-700 shadow-sm hover:shadow-md transition-all duration-300 bg-transparent"
                          >
                            <RefreshCw
                              className={cn(
                                "mr-2 h-4 w-4",
                                loading && "animate-spin"
                              )}
                            />
                            Refresh Ocean Data
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabel Stok yang Ada */}
                  <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-cyan-100/50">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3 text-cyan-900">
                        <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">
                          Ocean Stock Inventory
                        </span>
                      </CardTitle>
                      <CardDescription className="text-cyan-700">
                        Daftar lengkap inventaris dengan status real-time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredStockItems.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-white" />
                          </div>
                          <div className="text-cyan-700 font-medium mb-2">
                            Tidak ada stok yang ditemukan
                          </div>
                          <div className="text-cyan-600 text-sm">
                            Coba ubah kriteria pencarian atau tambahkan item
                            baru
                          </div>
                        </div>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-cyan-100/50 shadow-lg">
                          <Table className="min-w-full">
                            <TableHeader className="bg-gradient-to-r from-cyan-50 to-blue-50">
                              <TableRow className="border-cyan-100">
                                <TableHead className="font-semibold text-cyan-800">
                                  Nama Barang
                                </TableHead>
                                <TableHead className="font-semibold text-cyan-800">
                                  Kategori
                                </TableHead>
                                <TableHead className="font-semibold text-cyan-800">
                                  Jumlah
                                </TableHead>
                                <TableHead className="font-semibold text-cyan-800">
                                  Satuan
                                </TableHead>
                                <TableHead className="font-semibold text-cyan-800">
                                  Tanggal
                                </TableHead>
                                <TableHead className="font-semibold text-cyan-800">
                                  Status
                                </TableHead>
                                <TableHead className="text-right font-semibold text-cyan-800">
                                  Aksi
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredStockItems.map((item, index) => (
                                <tr
                                  key={item.id}
                                  className="border-cyan-100/50 hover:bg-gradient-to-r hover:from-cyan-50/50 hover:to-blue-50/50 transition-all duration-300"
                                >
                                  <TableCell className="font-medium">
                                    {editingItem?.id === item.id ? (
                                      <Input
                                        value={editingItem.name}
                                        onChange={(e) =>
                                          handleEditInputChange(e, "name")
                                        }
                                        className="rounded-lg border-cyan-200 focus:border-cyan-400"
                                      />
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <span className="text-lg">
                                          {categoryIcons[
                                            item.category as keyof typeof categoryIcons
                                          ] || "📦"}
                                        </span>
                                        <span className="text-cyan-900">
                                          {item.name}
                                        </span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingItem?.id === item.id ? (
                                      <Select
                                        onValueChange={(value) =>
                                          handleEditInputChange(
                                            value,
                                            "category"
                                          )
                                        }
                                        value={editingItem.category || ""}
                                      >
                                        <SelectTrigger className="w-full rounded-lg border-cyan-200 focus:border-cyan-400">
                                          <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl bg-white/95 backdrop-blur-xl">
                                          <SelectItem value="Bahan Pokok">
                                            🌾 Bahan Pokok
                                          </SelectItem>
                                          <SelectItem value="Makanan Instan">
                                            🍜 Makanan Instan
                                          </SelectItem>
                                          <SelectItem value="Donasi">
                                            ❤️ Donasi
                                          </SelectItem>
                                          <SelectItem value="Lain-lain">
                                            📦 Lain-lain
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    ) : (
                                      <Badge
                                        variant="secondary"
                                        className="bg-cyan-100/80 text-cyan-800 border-0 rounded-full"
                                      >
                                        {item.category}
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingItem?.id === item.id ? (
                                      <Input
                                        type="number"
                                        value={
                                          editingItem.quantity !== null
                                            ? editingItem.quantity.toString()
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handleEditInputChange(e, "quantity")
                                        }
                                        className="rounded-lg border-cyan-200 focus:border-cyan-400"
                                      />
                                    ) : (
                                      <span className="font-semibold text-cyan-900">
                                        {item.quantity}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingItem?.id === item.id ? (
                                      <Input
                                        value={editingItem.unit || ""}
                                        onChange={(e) =>
                                          handleEditInputChange(e, "unit")
                                        }
                                        className="rounded-lg border-cyan-200 focus:border-cyan-400"
                                      />
                                    ) : (
                                      <span className="text-cyan-700">
                                        {item.unit}
                                      </span>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingItem?.id === item.id ? (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button
                                            variant={"outline"}
                                            className={cn(
                                              "w-full justify-start text-left font-normal rounded-lg border-cyan-200 focus:border-cyan-400",
                                              !editingItem.added_date &&
                                                "text-muted-foreground"
                                            )}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {editingItem.added_date ? (
                                              format(
                                                new Date(
                                                  editingItem.added_date
                                                ),
                                                "PPP",
                                                { locale: idLocale }
                                              )
                                            ) : (
                                              <span>Pilih tanggal</span>
                                            )}
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 rounded-xl bg-white/95 backdrop-blur-xl">
                                          <Calendar
                                            mode="single"
                                            selected={
                                              new Date(editingItem.added_date)
                                            }
                                            onSelect={handleEditDateChange}
                                            initialFocus
                                            locale={idLocale}
                                          />
                                        </PopoverContent>
                                      </Popover>
                                    ) : (
                                      <div className="flex items-center space-x-2">
                                        <Clock className="w-4 h-4 text-cyan-500" />
                                        <span className="text-cyan-700 text-sm">
                                          {format(
                                            new Date(item.added_date),
                                            "dd MMM yyyy",
                                            { locale: idLocale }
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {item.status && (
                                      <div
                                        className={cn(
                                          "inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border",
                                          statusConfig[item.status].bgColor,
                                          statusConfig[item.status].textColor,
                                          statusConfig[item.status].borderColor
                                        )}
                                      >
                                        {statusConfig[item.status].icon &&
                                          React.createElement(
                                            statusConfig[item.status].icon,
                                            { className: "w-3 h-3" }
                                          )}
                                        <span>
                                          {item.status.charAt(0).toUpperCase() +
                                            item.status.slice(1)}
                                        </span>
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell className="text-right">
                                    {editingItem?.id === item.id ? (
                                      <div className="flex space-x-2 justify-end">
                                        <Button
                                          variant="default"
                                          size="sm"
                                          onClick={handleSaveEdit}
                                          className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                          <Save className="w-4 h-4 mr-1" />
                                          Simpan
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={handleCancelEdit}
                                          className="rounded-lg border-cyan-200 hover:bg-cyan-50 text-cyan-700 bg-transparent"
                                        >
                                          <X className="w-4 h-4 mr-1" />
                                          Batal
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex space-x-2 justify-end">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleEditClick(item)}
                                          className="rounded-lg border-cyan-200 hover:bg-cyan-50 text-cyan-700 hover:shadow-md transition-all duration-300"
                                        >
                                          <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            handleDeleteStock(item.id)
                                          }
                                          className="rounded-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </TableCell>
                                </tr>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AlertDialog for Delete Confirmation */}
      <AlertDialog
        open={showConfirmDeleteDialog}
        onOpenChange={setShowConfirmDeleteDialog}
      >
        <AlertDialogContent className="rounded-2xl bg-white/95 backdrop-blur-xl border border-cyan-100/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-cyan-900">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Konfirmasi Penghapusan</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-cyan-700">
              Apakah Anda yakin ingin menghapus item stok ini dari ocean
              inventory? Tindakan ini tidak dapat dibatalkan dan akan menghapus
              semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowConfirmDeleteDialog(false)}
              className="rounded-xl border-cyan-200 hover:bg-cyan-50 text-cyan-700"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
            >
              Hapus dari Ocean Stock
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
