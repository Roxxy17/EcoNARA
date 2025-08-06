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
import { supabase } from '@/lib/supabase';

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
user_name?: string
status?: 'tersedia' | 'menipis' | 'habis'
}

export default function ManageStockPage() {
const { userProfile, loadingUser } = useUser();
const [stockItems, setStockItems] = useState<StockItem[]>([]);
const [loading, setLoading] = useState(true); // Keep true initially for first fetch
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

// Helper to determine stock status based on quantity
const getStockStatus = (quantity: number | null): StockItem['status'] => {
  if (quantity === null || quantity <= 0) return 'habis';
  if (quantity <= 20) return 'menipis'; // Example threshold: quantity 1-20 is 'menipis'
  return 'tersedia';
};

// Fungsi untuk mengambil data dari API
const fetchStockItems = async () => {
  if (!userProfile) {
    setLoading(false);
    return;
  }
  setLoading(true);
  setError(null);
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) throw new Error("No authorization token found.");

    const res = await fetch("/api/stock", {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch stock items.");
    }
    const data: StockItem[] = await res.json();
    // Add status to each item based on quantity
    const itemsWithStatus = data.map(item => ({
      ...item,
      status: getStockStatus(item.quantity)
    }));
    setStockItems(itemsWithStatus);
  } catch (e: any) {
    console.error("Error fetching stock items:", e);
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

// Efek untuk memuat data saat komponen pertama kali render atau userProfile berubah
useEffect(() => {
  if (userProfile) {
    fetchStockItems();
  } else {
    setLoading(false); // If no user profile, stop loading
  }
}, [userProfile]); // Only depend on userProfile. This will fetch on initial load and if userProfile changes.

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

const handleAddStock = async () => {
  if (!newItem.name || !newItem.category || !newItem.quantity || !newItem.unit) {
    alert("Mohon lengkapi semua kolom untuk menambahkan stok.");
    return;
  }
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) throw new Error("No authorization token found.");

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
        added_date: newItem.added_date.toISOString().split('T')[0],
      }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to add new stock item.");
    }

    await fetchStockItems(); // Muat ulang data setelah berhasil menambah stok
    setNewItem({ name: "", category: "", quantity: "", unit: "", added_date: new Date() }); // Reset form
  } catch (e: any) {
    alert(`Gagal menambah stok: ${e.message}`);
  }
};

const handleDeleteStock = async (id: string) => {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) throw new Error("No authorization token found.");
    const res = await fetch(`/api/stock/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to delete stock item.");
    }
    setStockItems((prev) => prev.filter((item) => item.id !== id)); // Perbarui state lokal setelah berhasil menghapus
  } catch (e: any) {
    alert(`Gagal menghapus stok: ${e.message}`);
  }
};

// Filtered and searched stock items
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
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2 text-gray-700">Memuat data stok...</span>
              </div>
            )}

            {error ? (
              <div className="text-red-600 text-center py-8">Gagal memuat data: {error}</div>
            ) : (
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
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{format(new Date(item.added_date), "dd MMMM yyyy", { locale: idLocale })}</TableCell>
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
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteStock(item.id)}
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
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
)
}
