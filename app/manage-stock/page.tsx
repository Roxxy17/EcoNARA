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
import { CalendarIcon, Package, PlusCircle, Trash2, Loader2 } from 'lucide-react'
import { format } from "date-fns"
import { id as idLocale } from "date-fns/locale"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/UserContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Import komponen AlertDialog untuk konfirmasi
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

// Interface untuk struktur data stok
interface StockItem {
  id: string
  name: string
  category: string | null
  added_date: string // Tetap string untuk konsistensi dengan API
  quantity: number | null
  unit: string | null
  created_at: string
  user_id: string
  user_name?: string
  status?: 'tersedia' | 'menipis' | 'habis'
}

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  // State untuk dialog konfirmasi hapus
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [itemToDeleteId, setItemToDeleteId] = useState<string | null>(null);

  // Gunakan client khusus komponen
  const supabase = createClientComponentClient();

  // Helper to determine stock status based on quantity
  const getStockStatus = (quantity: number | null): StockItem['status'] => {
    if (quantity === null || quantity <= 0) return 'habis';
    if (quantity <= 20) return 'menipis';
    return 'tersedia';
  };

  // Fungsi untuk mengambil data dari API
  const fetchStockItems = async () => {
    setLoading(true);
    setError(null);
    setMessage(null); // Clear previous messages
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
        let errorData = { message: "Gagal mengambil item stok." };
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
      const itemsWithStatus = data.map(item => ({
        ...item,
        status: getStockStatus(item.quantity)
      }));
      setStockItems(itemsWithStatus);
    } catch (e: any) {
      console.error("Error fetching stock items:", e);
      setError(e.message);
      setMessage({ type: 'error', text: `Gagal memuat data: ${e.message}` });
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
      setMessage({ type: 'error', text: "Pengguna tidak terautentikasi. Mohon login." });
    }
  }, [userProfile, loadingUser]);

  // Handler untuk input form penambahan stok baru
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setNewItem((prev) => ({ ...prev, category: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewItem((prev) => ({ ...prev, added_date: date }))
    }
  }

  // Handler untuk input form edit stok
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement> | string, field: keyof StockItem) => {
    setEditingItem(prev => {
      if (!prev) return null;
      let value: any;
      if (typeof e === 'string') { // Untuk komponen Select
        value = e;
      } else { // Untuk komponen Input
        value = e.target.value;
      }

      if (field === 'quantity') {
        value = parseFloat(value);
        if (isNaN(value)) value = null; // Tangani input angka kosong atau tidak valid
      }
      return { ...prev, [field]: value };
    });
  };

  const handleEditDateChange = (date: Date | undefined) => {
    setEditingItem(prev => {
      if (!prev) return null;
      // Pastikan added_date tetap string dalam format ISO (YYYY-MM-DD)
      return { ...prev, added_date: date ? format(date, "yyyy-MM-dd") : prev.added_date };
    });
  };

  // Fungsi untuk menambah stok baru
  const handleAddStock = async () => {
    if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit) {
      setMessage({ type: 'error', text: "Mohon lengkapi semua kolom untuk menambahkan stok." });
      return;
    }
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

      const res = await fetch("/api/stock", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          quantity: parseFloat(newItem.quantity),
          unit: newItem.unit,
          added_date: format(newItem.added_date, "yyyy-MM-dd"), // Format tanggal ke YYYY-MM-DD
        }),
      });

      if (!res.ok) {
        let errorData = { message: "Gagal menambah stok." };
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
      setNewItem({ name: "", category: "", quantity: "", unit: "", added_date: new Date() });
      setMessage({ type: 'success', text: "Stok berhasil ditambahkan!" });
    } catch (e: any) {
      console.error("Error adding stock:", e);
      setMessage({ type: 'error', text: `Gagal menambah stok: ${e.message}` });
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
    if (!editingItem.name || !editingItem.category || editingItem.quantity === null || !editingItem.unit || !editingItem.added_date) {
      setMessage({ type: 'error', text: "Mohon lengkapi semua kolom untuk memperbarui stok." });
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

      const res = await fetch(`/api/stock/${editingItem.id}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
        let errorData = { message: "Gagal memperbarui stok." };
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
      setMessage({ type: 'success', text: "Stok berhasil diperbarui!" });
    } catch (e: any) {
      console.error("Error saving stock:", e);
      setMessage({ type: 'error', text: `Gagal memperbarui stok: ${e.message}` });
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

    console.log("Client: Attempting to delete stock item with ID:", itemToDeleteId); // Added log

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error("Tidak ada token otorisasi ditemukan.");

      const res = await fetch(`/api/stock/${itemToDeleteId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        let errorData = { message: "Gagal menghapus stok." };
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
      setStockItems((prev) => prev.filter((item) => item.id !== itemToDeleteId));
      setMessage({ type: 'success', text: "Stok berhasil dihapus!" });
    } catch (e: any) {
      console.error("Error deleting stock:", e);
      setMessage({ type: 'error', text: `Gagal menghapus stok: ${e.message}` });
    } finally {
      setShowConfirmDeleteDialog(false);
      setItemToDeleteId(null);
    }
  };

  const filteredStockItems = useMemo(() => {
    let filtered = stockItems;
    if (filterCategory !== "all") {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.category?.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.unit?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    return filtered;
  }, [stockItems, filterCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8 relative">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-6 h-6 text-green-600" />
                <span>Kelola Stok Pribadi</span>
              </CardTitle>
              <CardDescription>Tambah, lihat, dan kelola stok barang yang Anda miliki.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Loading Overlay */}
              {(loading || loadingUser) && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                  <span className="ml-2 text-gray-700">Memuat data stok...</span>
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
                      setTimeout(() => setMessage(null), 5000); // Sembunyikan pesan setelah 5 detik
                    }
                  }}
                >
                  {message.text}
                </motion.div>
              )}

              {error && !loading && ( // Tampilkan error hanya jika loading sudah selesai dan ada error
                <div className="text-red-600 text-center py-8">Gagal memuat data: {error}</div>
              )}

              {!error && !loading && ( // Tampilkan konten utama hanya jika tidak ada error dan loading selesai
                <>
                  {/* Form Tambah Stok Baru */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">Nama Barang</Label>
                      <Input id="name" name="name" value={newItem.name} onChange={handleInputChange} placeholder="Contoh: Beras, Pakaian" className="rounded-md" />
                    </div>
                    <div>
                      <Label htmlFor="category" className="mb-1 block text-sm font-medium text-gray-700">Kategori</Label>
                      <Select onValueChange={(value) => handleSelectChange(value)} value={newItem.category}>
                        <SelectTrigger className="w-full rounded-md">
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bahan Pokok">Bahan Pokok</SelectItem>
                          <SelectItem value="Makanan Instan">Makanan Instan</SelectItem>
                          <SelectItem value="Donasi">Donasi</SelectItem>
                          <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">Jumlah</Label>
                      <Input id="quantity" name="quantity" type="number" value={newItem.quantity} onChange={handleInputChange} placeholder="Contoh: 50" className="rounded-md" />
                    </div>
                    <div>
                      <Label htmlFor="unit" className="mb-1 block text-sm font-medium text-gray-700">Satuan</Label>
                      <Input id="unit" name="unit" value={newItem.unit} onChange={handleInputChange} placeholder="Contoh: kg, liter, pcs" className="rounded-md" />
                    </div>
                    <div>
                      <Label htmlFor="added_date" className="mb-1 block text-sm font-medium text-gray-700">Tanggal Ditambahkan</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal rounded-md", !newItem.added_date && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {newItem.added_date ? (format(newItem.added_date, "PPP", { locale: idLocale })) : (<span>Pilih tanggal</span>)}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={newItem.added_date} onSelect={handleDateChange} initialFocus locale={idLocale} />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="md:col-span-2 lg:col-span-1 flex items-end">
                      <Button onClick={handleAddStock} className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Stok
                      </Button>
                    </div>
                  </div>

                  {/* Search and Filter Section */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                    <div className="flex-1">
                      <Label htmlFor="search" className="mb-1 block text-sm font-medium text-gray-700">Cari Barang</Label>
                      <Input
                        id="search"
                        type="text"
                        placeholder="Cari nama, kategori, atau satuan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="filterCategory" className="mb-1 block text-sm font-medium text-gray-700">Filter Kategori</Label>
                      <Select onValueChange={setFilterCategory} value={filterCategory}>
                        <SelectTrigger className="w-full md:w-[180px] rounded-md">
                          <SelectValue placeholder="Semua Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          <SelectItem value="Bahan Pokok">Bahan Pokok</SelectItem>
                          <SelectItem value="Makanan Instan">Makanan Instan</SelectItem>
                          <SelectItem value="Donasi">Donasi</SelectItem>
                          <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={fetchStockItems} variant="outline" className="w-full md:w-auto rounded-md shadow-sm">
                        <Loader2 className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
                        Refresh Data
                      </Button>
                    </div>
                  </div>

                  {/* Tabel Stok yang Ada */}
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                    Daftar Stok Saat Ini
                  </h3>
                  {filteredStockItems.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">Tidak ada stok yang cocok dengan kriteria Anda.</p>
                  ) : (
                    <div className="overflow-x-auto rounded-lg border">
                      <Table className="min-w-full bg-white">
                        <TableHeader className="bg-gray-100">
                          <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Satuan</TableHead>
                            <TableHead>Tanggal Ditambahkan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStockItems.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <Input
                                    value={editingItem.name}
                                    onChange={(e) => handleEditInputChange(e, 'name')}
                                    className="rounded-md"
                                  />
                                ) : (
                                  item.name
                                )}
                              </TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <Select
                                    onValueChange={(value) => handleEditInputChange(value, 'category')}
                                    value={editingItem.category || ""}
                                  >
                                    <SelectTrigger className="w-full rounded-md">
                                      <SelectValue placeholder="Pilih Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Bahan Pokok">Bahan Pokok</SelectItem>
                                      <SelectItem value="Makanan Instan">Makanan Instan</SelectItem>
                                      <SelectItem value="Donasi">Donasi</SelectItem>
                                      <SelectItem value="Lain-lain">Lain-lain</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  item.category
                                )}
                              </TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <Input
                                    type="number"
                                    value={editingItem.quantity !== null ? editingItem.quantity.toString() : ""}
                                    onChange={(e) => handleEditInputChange(e, 'quantity')}
                                    className="rounded-md"
                                  />
                                ) : (
                                  item.quantity
                                )}
                              </TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <Input
                                    value={editingItem.unit || ""}
                                    onChange={(e) => handleEditInputChange(e, 'unit')}
                                    className="rounded-md"
                                  />
                                ) : (
                                  item.unit
                                )}
                              </TableCell>
                              <TableCell>
                                {editingItem?.id === item.id ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full justify-start text-left font-normal rounded-md",
                                          !editingItem.added_date && "text-muted-foreground"
                                        )}
                                      >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {editingItem.added_date ? (format(new Date(editingItem.added_date), "PPP", { locale: idLocale })) : (<span>Pilih tanggal</span>)}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                      <Calendar
                                        mode="single"
                                        selected={new Date(editingItem.added_date)}
                                        onSelect={handleEditDateChange}
                                        initialFocus
                                        locale={idLocale}
                                      />
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  format(new Date(item.added_date), "dd MMMM yyyy", { locale: idLocale })
                                )}
                              </TableCell>
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
                              <TableCell className="text-right">
                                {editingItem?.id === item.id ? (
                                  <div className="flex space-x-2 justify-end">
                                    <Button
                                      variant="default"
                                      size="sm"
                                      onClick={handleSaveEdit}
                                      className="rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                      Simpan
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={handleCancelEdit}
                                      className="rounded-md"
                                    >
                                      Batal
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex space-x-2 justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditClick(item)}
                                      className="rounded-md"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteStock(item.id)}
                                      className="rounded-md"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* AlertDialog for Delete Confirmation */}
      <AlertDialog open={showConfirmDeleteDialog} onOpenChange={setShowConfirmDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus item stok ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDeleteDialog(false)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
