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
  Search,
  Filter,
  RefreshCw,
  Edit3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight
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
    color: "linear-gradient(135deg, #10b981, #14b8a6)",
    bgColor: '#f0fdf4',
    textColor: '#166534',
    borderColor: '#bbf7d0',
  },
  menipis: {
    icon: AlertTriangle,
    color: "linear-gradient(135deg, #f59e0b, #f97316)",
    bgColor: '#fffbeb',
    textColor: '#92400e',
    borderColor: '#fed7aa',
  },
  habis: {
    icon: X,
    color: "linear-gradient(135deg, #ef4444, #ec4899)",
    bgColor: '#fef2f2',
    textColor: '#991b1b',
    borderColor: '#fecaca',
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
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 25%, #a7f3d0 75%, #cffafe 100%)'
      }}
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.4), rgba(6, 182, 212, 0.4))'
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4), rgba(14, 165, 233, 0.4))',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.4), rgba(16, 185, 129, 0.4))',
            animationDelay: '2s'
          }}
        />
      </div>

      <Navbar />

      {/* Enhanced Header */}
      <header 
        className="backdrop-blur-xl border-b sticky top-[72px] z-40 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(14, 165, 233, 0.5)'
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #3b82f6, #eab308)',
                  boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.25), 0 10px 10px -5px rgba(34, 197, 94, 0.04)'
                }}
              >
                <Package className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #16a34a, #3b82f6, #eab308)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Platform AI-powered Komunitas Pangan
                </h1>
                <p className="text-sm flex items-center" style={{ color: '#16a34a' }}>
                  Menghubungkan komunitas untuk mengatasi food waste,
                  mengoptimalkan distribusi pangan, dan membangun ekonomi
                  sirkular.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge 
                className="text-white shadow-lg border-0"
                style={{
                  background: 'linear-gradient(90deg, #22c55e, #3b82f6)'
                }}
              >
                <Package className="w-3 h-3 mr-1" />
                {stockStats.total} Item
              </Badge>
              <Badge 
                className="shadow-lg border-0"
                style={{
                  backgroundColor: 'rgba(34, 197, 94, 0.1)',
                  color: '#166534',
                  backdropFilter: 'blur(4px)'
                }}
              >
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
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #3b82f6, #eab308)',
                boxShadow: '0 20px 25px -5px rgba(34, 197, 94, 0.25), 0 10px 10px -5px rgba(34, 197, 94, 0.04)'
              }}
            >
              <CardContent className="p-6">
                <CheckCircle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.tersedia}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Pangan Tersedia
                </div>
                <div 
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Siap Didistribusikan
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316, #eab308)',
                boxShadow: '0 20px 25px -5px rgba(245, 158, 11, 0.25), 0 10px 10px -5px rgba(245, 158, 11, 0.04)'
              }}
            >
              <CardContent className="p-6">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.menipis}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Pangan Menipis
                </div>
                <div 
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Segera Optimalkan Distribusi
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="text-center text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #ec4899, #f43f5e)',
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.25), 0 10px 10px -5px rgba(239, 68, 68, 0.04)'
              }}
            >
              <CardContent className="p-6">
                <X className="w-10 h-10 mx-auto mb-3 drop-shadow-lg" />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.habis}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Pangan Habis
                </div>
                <div 
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  Perlu Donasi Segera
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #bfdbfe, #a7f3d0, #fef3c7)',
                color: '#1e40af',
                boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.25), 0 10px 10px -5px rgba(59, 130, 246, 0.04)'
              }}
            >
              <CardContent className="p-6">
                <Package className="w-10 h-10 mx-auto mb-3 drop-shadow-sm" style={{ color: '#1d4ed8' }} />
                <div className="text-3xl font-bold drop-shadow-sm">
                  {stockStats.total}
                </div>
                <div className="text-sm opacity-90 font-medium">
                  Total Item Pangan
                </div>
                <div 
                  className="text-xs opacity-75 mt-2 rounded-full px-2 py-1"
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)'
                  }}
                >
                  Semua Kategori
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Form Tambah Stok Baru */}
        <Card 
          className="border-0 backdrop-blur-sm shadow-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.8), rgba(219, 234, 254, 0.8))',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(34, 197, 94, 0.2)'
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ color: '#14532d' }}>
              <PlusCircle className="w-5 h-5" style={{ color: '#16a34a' }} />
              <span>Tambah Item Pangan</span>
            </CardTitle>
            <CardDescription style={{ color: '#15803d' }}>
              Masukkan detail item baru untuk distribusi pangan komunitas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold"
                  style={{ color: '#15803d' }}
                >
                  Nama Pangan
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  placeholder="Contoh: Beras Premium, Ikan Segar"
                  className="rounded-xl"
                  style={{
                    borderColor: '#60a5fa',
                    backgroundColor: '#ffffff',
                    color: '#1e40af'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm font-semibold"
                  style={{ color: '#15803d' }}
                >
                  Kategori
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange(value)}
                  value={newItem.category}
                >
                  <SelectTrigger className="w-full rounded-xl" style={{ borderColor: '#60a5fa' }}>
                    <SelectValue placeholder="Pilih Kategori" className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white border border-gray-200">
                    <SelectItem value="Bahan Pokok" className="text-black">🌾 Bahan Pokok</SelectItem>
                    <SelectItem value="Makanan Instan" className="text-black">
                      🍜 Makanan Instan
                    </SelectItem>
                    <SelectItem value="Donasi" className="text-black">❤️ Donasi</SelectItem>
                    <SelectItem value="Lain-lain" className="text-black">📦 Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="text-sm font-semibold"
                  style={{ color: '#15803d' }}
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
                  className="rounded-xl"
                  style={{
                    borderColor: '#60a5fa',
                    backgroundColor: '#ffffff',
                    color: '#1e40af'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="unit"
                  className="text-sm font-semibold"
                  style={{ color: '#15803d' }}
                >
                  Satuan
                </Label>
                <Input
                  id="unit"
                  name="unit"
                  value={newItem.unit}
                  onChange={handleInputChange}
                  placeholder="Contoh: kg, liter, pcs"
                  className="rounded-xl"
                  style={{
                    borderColor: '#60a5fa',
                    backgroundColor: '#ffffff',
                    color: '#1e40af'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="added_date"
                  className="text-sm font-semibold"
                  style={{ color: '#15803d' }}
                >
                  Tanggal Ditambahkan
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl border-blue-400 focus:border-blue-600 bg-white text-black",
                        !newItem.added_date && "text-gray-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                      {newItem.added_date ? (
                        <span className="text-black">
                          {format(newItem.added_date, "PPP", {
                            locale: idLocale,
                          })}
                        </span>
                      ) : (
                        <span className="text-gray-500">Pilih tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-4 rounded-xl bg-white border border-gray-300 shadow-xl">
                    <div className="space-y-4">
                      {/* Header dengan dropdown */}
                      <div className="flex items-center justify-between">
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
                          value={newItem.added_date.getMonth()}
                          onChange={(e) => {
                            const newDate = new Date(newItem.added_date);
                            newDate.setMonth(parseInt(e.target.value));
                            setNewItem(prev => ({ ...prev, added_date: newDate }));
                          }}
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i} className="text-black">
                              {format(new Date(2023, i), "MMMM", { locale: idLocale })}
                            </option>
                          ))}
                        </select>
                        <select 
                          className="px-3 py-2 border border-gray-300 rounded-md text-black bg-white ml-2"
                          value={newItem.added_date.getFullYear()}
                          onChange={(e) => {
                            const newDate = new Date(newItem.added_date);
                            newDate.setFullYear(parseInt(e.target.value));
                            setNewItem(prev => ({ ...prev, added_date: newDate }));
                          }}
                        >
                          {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                            <option key={year} value={year} className="text-black">
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Calendar Grid */}
                      <Calendar
                        mode="single"
                        selected={newItem.added_date}
                        onSelect={handleDateChange}
                        locale={idLocale}
                        className="rounded-xl bg-white p-0"
                        style={{
                          '--rdp-cell-size': '40px',
                          '--rdp-accent-color': '#3b82f6',
                          '--rdp-background-color': '#3b82f6',
                          '--rdp-accent-color-dark': '#1e40af',
                          color: 'black',
                          backgroundColor: 'white'
                        } as any}
                        modifiersClassNames={{
                          today: 'rdp-day_today',
                          selected: 'rdp-day_selected',
                          outside: 'rdp-day_outside',
                          disabled: 'rdp-day_disabled'
                        }}
                        classNames={{
                          months: "flex flex-col space-y-4",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center text-black font-semibold text-base mb-4",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex mb-2",
                          head_cell: "text-gray-600 rounded-md w-10 font-medium text-sm text-center",
                          row: "flex w-full mt-2",
                          cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                          day: "h-10 w-10 p-0 font-medium text-black bg-transparent hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 aria-selected:bg-blue-500 aria-selected:text-white",
                          day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
                          day_today: "bg-gray-100 text-black font-bold",
                          day_outside: "text-gray-400 opacity-50",
                          day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="md:col-span-2 lg:col-span-1 flex items-end">
                <Button
                  onClick={handleAddStock}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tambah ke Komunitas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter Section */}
        <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-green-50/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <Search className="w-5 h-5 text-green-600" />
              <span>Pencarian & Filter</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label
                  htmlFor="search"
                  className="text-sm font-semibold text-green-700"
                >
                  Cari Item Pangan
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Cari nama, kategori, atau satuan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-blue-400 focus:border-blue-600 bg-white text-blue-900 placeholder-blue-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="filterCategory"
                  className="text-sm font-semibold text-green-700"
                >
                  Filter Kategori
                </Label>
                <Select
                  onValueChange={setFilterCategory}
                  value={filterCategory}
                >
                  <SelectTrigger className="w-full md:w-[200px] rounded-xl border-blue-400 focus:border-blue-600 bg-white text-black">
                    <Filter className="w-4 h-4 mr-2 text-green-500" />
                    <SelectValue placeholder="Semua Kategori" className="text-black" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white border border-gray-200">
                    <SelectItem value="all" className="text-black">♻️ Semua Kategori</SelectItem>
                    <SelectItem value="Bahan Pokok" className="text-black">🌾 Bahan Pokok</SelectItem>
                    <SelectItem value="Makanan Instan" className="text-black">
                      🍜 Makanan Instan
                    </SelectItem>
                    <SelectItem value="Donasi" className="text-black">❤️ Donasi</SelectItem>
                    <SelectItem value="Lain-lain" className="text-black">📦 Lain-lain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={fetchStockItems}
                  variant="outline"
                  className="w-full md:w-auto rounded-xl border-blue-400 hover:bg-green-50 text-green-700 shadow-sm hover:shadow-md transition-all duration-300 bg-transparent"
                >
                  <RefreshCw
                    className={cn("mr-2 h-4 w-4", loading && "animate-spin")}
                  />
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Stok yang Ada */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl border-green-100/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-green-900">
              <Package className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold">
                Inventaris Pangan Komunitas
              </span>
            </CardTitle>
            <CardDescription className="text-green-700">
              Daftar lengkap item pangan komunitas dengan status real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStockItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <div className="text-green-700 font-medium mb-2">
                  Tidak ada item pangan ditemukan
                </div>
                <div className="text-green-600 text-sm">
                  Coba ubah kriteria pencarian atau tambahkan item baru
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-green-100/50 shadow-lg">
                <Table className="min-w-full">
                  <TableHeader className="bg-gradient-to-r from-green-50 to-blue-50">
                    <TableRow className="border-green-100">
                      <TableHead className="font-semibold text-green-800">
                        Nama Pangan
                      </TableHead>
                      <TableHead className="font-semibold text-green-800">
                        Kategori
                      </TableHead>
                      <TableHead className="font-semibold text-green-800">
                        Jumlah
                      </TableHead>
                      <TableHead className="font-semibold text-green-800">
                        Satuan
                      </TableHead>
                      <TableHead className="font-semibold text-green-800">
                        Tanggal
                      </TableHead>
                      <TableHead className="font-semibold text-green-800">
                        Status
                      </TableHead>
                      <TableHead className="text-right font-semibold text-green-800">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStockItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-green-100/50 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-blue-50/50 transition-all duration-300"
                      >
                        <TableCell className="font-medium">
                          {editingItem?.id === item.id ? (
                            <Input
                              value={editingItem.name}
                              onChange={(e) => handleEditInputChange(e, "name")}
                              className="rounded-lg border-blue-400 focus:border-blue-600 text-black"
                            />
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">
                                {categoryIcons[
                                  item.category as keyof typeof categoryIcons
                                ] || "📦"}
                              </span>
                              <span className="text-green-900">
                                {item.name}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingItem?.id === item.id ? (
                            <Select
                              onValueChange={(value) =>
                                handleEditInputChange(value, "category")
                              }
                              value={editingItem.category || ""}
                            >
                              <SelectTrigger className="w-full rounded-lg border-blue-400 focus:border-blue-600 bg-white text-black">
                                <SelectValue placeholder="Pilih Kategori" className="text-black" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl bg-white border border-gray-200">
                                <SelectItem value="Bahan Pokok" className="text-black">
                                  🌾 Bahan Pokok
                                </SelectItem>
                                <SelectItem value="Makanan Instan" className="text-black">
                                  🍜 Makanan Instan
                                </SelectItem>
                                <SelectItem value="Donasi" className="text-black">
                                  ❤️ Donasi
                                </SelectItem>
                                <SelectItem value="Lain-lain" className="text-black">
                                  📦 Lain-lain
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="bg-green-100/80 text-green-800 border-0 rounded-full"
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
                              className="rounded-lg border-blue-400 focus:border-blue-600 text-black"
                            />
                          ) : (
                            <span className="font-semibold text-green-900">
                              {item.quantity}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingItem?.id === item.id ? (
                            <Input
                              value={editingItem.unit || ""}
                              onChange={(e) => handleEditInputChange(e, "unit")}
                              className="rounded-lg border-blue-400 focus:border-blue-600 text-black"
                            />
                          ) : (
                            <span className="text-green-700">{item.unit}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {editingItem?.id === item.id ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal rounded-lg border-blue-400 focus:border-blue-600 bg-white text-black",
                                    !editingItem.added_date &&
                                      "text-gray-500"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4 text-black" />
                                  {editingItem.added_date ? (
                                    <span className="text-black">
                                      {format(
                                        new Date(editingItem.added_date),
                                        "PPP",
                                        { locale: idLocale }
                                      )}
                                    </span>
                                  ) : (
                                    <span className="text-gray-500">Pilih tanggal</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-4 rounded-xl bg-white border border-gray-300 shadow-xl">
                                <div className="space-y-4">
                                  {/* Header dengan dropdown */}
                                  <div className="flex items-center justify-between">
                                    <select 
                                      className="px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
                                      value={new Date(editingItem.added_date).getMonth()}
                                      onChange={(e) => {
                                        const currentDate = new Date(editingItem.added_date);
                                        currentDate.setMonth(parseInt(e.target.value));
                                        handleEditDateChange(currentDate);
                                      }}
                                    >
                                      {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={i} className="text-black">
                                          {format(new Date(2023, i), "MMMM", { locale: idLocale })}
                                        </option>
                                      ))}
                                    </select>
                                    <select 
                                      className="px-3 py-2 border border-gray-300 rounded-md text-black bg-white ml-2"
                                      value={new Date(editingItem.added_date).getFullYear()}
                                      onChange={(e) => {
                                        const currentDate = new Date(editingItem.added_date);
                                        currentDate.setFullYear(parseInt(e.target.value));
                                        handleEditDateChange(currentDate);
                                      }}
                                    >
                                      {Array.from({ length: 11 }, (_, i) => 2020 + i).map(year => (
                                        <option key={year} value={year} className="text-black">
                                          {year}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  {/* Calendar Grid */}
                                  <Calendar
                                    mode="single"
                                    selected={new Date(editingItem.added_date)}
                                    onSelect={handleEditDateChange}
                                    locale={idLocale}
                                    className="rounded-xl bg-white p-0"
                                    style={{
                                      '--rdp-cell-size': '40px',
                                      '--rdp-accent-color': '#3b82f6',
                                      '--rdp-background-color': '#3b82f6',
                                      '--rdp-accent-color-dark': '#1e40af',
                                      color: 'black',
                                      backgroundColor: 'white'
                                    } as any}
                                    modifiersClassNames={{
                                      today: 'rdp-day_today',
                                      selected: 'rdp-day_selected',
                                      outside: 'rdp-day_outside',
                                      disabled: 'rdp-day_disabled'
                                    }}
                                    classNames={{
                                      months: "flex flex-col space-y-4",
                                      month: "space-y-4",
                                      caption: "flex justify-center pt-1 relative items-center text-black font-semibold text-base mb-4",
                                      table: "w-full border-collapse space-y-1",
                                      head_row: "flex mb-2",
                                      head_cell: "text-gray-600 rounded-md w-10 font-medium text-sm text-center",
                                      row: "flex w-full mt-2",
                                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                                      day: "h-10 w-10 p-0 font-medium text-black bg-transparent hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 aria-selected:bg-blue-500 aria-selected:text-white",
                                      day_selected: "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
                                      day_today: "bg-gray-100 text-black font-bold",
                                      day_outside: "text-gray-400 opacity-50",
                                      day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
                                      day_hidden: "invisible",
                                    }}
                                  />
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-green-500" />
                              <span className="text-green-700 text-sm">
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
                                className="rounded-lg bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Simpan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                                className="rounded-lg border-blue-400 hover:bg-green-50 text-green-700 bg-transparent"
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
                                className="rounded-lg border-blue-400 hover:bg-green-50 text-green-700 hover:shadow-md transition-all duration-300"
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteStock(item.id)}
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
      </div>

      {/* AlertDialog for Delete Confirmation */}
      <AlertDialog
        open={showConfirmDeleteDialog}
        onOpenChange={setShowConfirmDeleteDialog}
      >
        <AlertDialogContent className="rounded-2xl bg-white/95 backdrop-blur-xl border border-green-100/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-green-900">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Konfirmasi Penghapusan</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-green-700">
              Apakah Anda yakin ingin menghapus item pangan ini? Tindakan ini
              tidak dapat dibatalkan dan akan menghapus semua data terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowConfirmDeleteDialog(false)}
              className="rounded-xl border-blue-400 hover:bg-green-50 text-green-700"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
            >
              Hapus Data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}