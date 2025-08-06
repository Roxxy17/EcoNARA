"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package } from 'lucide-react'
import { Navbar } from "@/components/navigation/nav-dashboard" // Mengimpor komponen Navbar
// Interface for original stock item structure
interface StockItem {
  id: string
  name: string
  category: string
  added_date: Date
  quantity: number
  unit: string
  created_at: Date
  user_id: string // Mock user_id, in a real app this would be from auth
}

// Interface for aggregated stock data
interface AggregatedStockItem {
  name: string
  category: string
  totalQuantity: number
  unit: string
}

export default function VillageStockSummaryPage() {
  // Mock data for individual stock items (as if from various residents)
  const [rawStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Beras Premium",
      category: "Bahan Pokok",
      added_date: new Date("2024-07-20"),
      quantity: 50,
      unit: "kg",
      created_at: new Date("2024-07-20T10:00:00Z"),
      user_id: "user-123",
    },
    {
      id: "2",
      name: "Minyak Goreng",
      category: "Bahan Pokok",
      added_date: new Date("2024-07-22"),
      quantity: 10,
      unit: "liter",
      created_at: new Date("2024-07-22T11:30:00Z"),
      user_id: "user-123",
    },
    {
      id: "3",
      name: "Mie Instan",
      category: "Makanan Instan",
      added_date: new Date("2024-07-25"),
      quantity: 100,
      unit: "bungkus",
      created_at: new Date("2024-07-25T14:00:00Z"),
      user_id: "user-123",
    },
    {
      id: "4",
      name: "Pakaian Layak Pakai",
      category: "Donasi",
      added_date: new Date("2024-07-28"),
      quantity: 20,
      unit: "pcs",
      created_at: new Date("2024-07-28T09:15:00Z"),
      user_id: "user-123",
    },
    {
      id: "5",
      name: "Beras Premium", // Another entry for Beras Premium from a different "resident"
      category: "Bahan Pokok",
      added_date: new Date("2024-07-29"),
      quantity: 30,
      unit: "kg",
      created_at: new Date("2024-07-29T10:00:00Z"),
      user_id: "user-456",
    },
    {
      id: "6",
      name: "Mie Instan", // Another entry for Mie Instan
      category: "Makanan Instan",
      added_date: new Date("2024-07-30"),
      quantity: 50,
      unit: "bungkus",
      created_at: new Date("2024-07-30T12:00:00Z"),
      user_id: "user-789",
    },
  ]);

  const [aggregatedStock, setAggregatedStock] = useState<AggregatedStockItem[]>([]);

  useEffect(() => {
    const aggregateData = (items: StockItem[]): AggregatedStockItem[] => {
      const aggregatedMap = new Map<string, AggregatedStockItem>();

      items.forEach(item => {
        const key = `${item.name}_${item.unit}`; // Unique key for aggregation
        if (aggregatedMap.has(key)) {
          const existing = aggregatedMap.get(key)!;
          existing.totalQuantity += item.quantity;
        } else {
          aggregatedMap.set(key, {
            name: item.name,
            category: item.category, // Taking the category from the first encountered item
            totalQuantity: item.quantity,
            unit: item.unit,
          });
        }
      });
      return Array.from(aggregatedMap.values());
    };

    setAggregatedStock(aggregateData(rawStockItems));
  }, [rawStockItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-6 h-6 text-green-600" />
                <span>Ringkasan Stok Barang Warga Desa</span>
              </CardTitle>
              <CardDescription>Lihat total jumlah barang yang tersedia dari seluruh warga desa.</CardDescription>
            </CardHeader>
            <CardContent>
              {aggregatedStock.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Belum ada stok barang yang tercatat.</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table className="min-w-full bg-white">
                    <TableHeader className="bg-gray-100">
                      <TableRow>
                        <TableHead>Nama Barang</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Total Jumlah</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aggregatedStock.map((item) => (
                        <TableRow key={`${item.name}-${item.unit}`}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.totalQuantity} {item.unit}</TableCell>
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
