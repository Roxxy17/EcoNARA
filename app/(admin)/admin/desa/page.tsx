// File: src/app/admin/desa/page.tsx

"use client";

import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Navbar } from "@/components/navigation/nav-dashboard";
import { useUser } from '@/contexts/UserContext';

// Import komponen UI dari shadcn/ui dan ikon
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2, PlusCircle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

// Komponen utama untuk halaman Tambah Desa
export default function TambahDesaPage() {
    const { userProfile, loadingUser } = useUser();

    const [formData, setFormData] = useState({
        nama_desa: '',
        kecamatan: '',
        provinsi: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (!formData.nama_desa) {
            setError("Nama Desa tidak boleh kosong.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/desa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Terjadi kesalahan saat menambahkan desa.');
            }

            setSuccess('Desa berhasil ditambahkan! Anda akan segera melihatnya di daftar.');
            setFormData({ nama_desa: '', kecamatan: '', provinsi: '' });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Tampilan Loading Awal saat memeriksa data pengguna
    if (loadingUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    // Tampilan Akses Ditolak
    if (userProfile?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
                <Navbar />
                <main className="container mx-auto py-20 text-center">
                    <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
                    <h1 className="mt-4 text-3xl font-bold text-red-800">Akses Ditolak</h1>
                    <p className="mt-2 text-red-600 text-lg">Hanya administrator yang dapat mengakses halaman ini.</p>
                </main>
            </div>
        );
    }
    
    // Tampilan utama halaman
    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
             {/* Animated Blobs */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <Navbar />

            {/* Enhanced Header */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/25">
                            <PlusCircle className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                                Manajemen Desa
                            </h1>
                            <p className="text-sm text-teal-700/80">Tambahkan entitas desa baru ke dalam platform.</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <Card className="max-w-2xl mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-xl rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-blue-500" />
                                Formulir Tambah Desa Baru
                            </CardTitle>
                            <CardDescription className="text-gray-600 pt-1">
                                Isi detail desa. Kolom dengan tanda <span className="text-red-500">*</span> wajib diisi.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nama_desa" className="font-semibold text-gray-700">Nama Desa <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="nama_desa"
                                        name="nama_desa"
                                        value={formData.nama_desa}
                                        onChange={handleChange}
                                        placeholder="Contoh: Pejagoan"
                                        required
                                        disabled={isLoading}
                                        className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kecamatan" className="font-semibold text-gray-700">Kecamatan</Label>
                                    <Input
                                        id="kecamatan"
                                        name="kecamatan"
                                        value={formData.kecamatan}
                                        onChange={handleChange}
                                        placeholder="Contoh: Pejagoan"
                                        disabled={isLoading}
                                        className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="provinsi" className="font-semibold text-gray-700">Provinsi</Label>
                                    <Input
                                        id="provinsi"
                                        name="provinsi"
                                        value={formData.provinsi}
                                        onChange={handleChange}
                                        placeholder="Contoh: Jawa Tengah"
                                        disabled={isLoading}
                                        className="rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Pesan Error dan Sukses dengan Animasi */}
                                <motion.div
                                    initial={false}
                                    animate={error || success ? "open" : "closed"}
                                    variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: -10 } }}
                                >
                                {error && (
                                    <Alert variant="destructive" className="bg-red-50 border-red-200 rounded-lg">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Gagal Menyimpan</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                {success && (
                                    <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 rounded-lg">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        <AlertTitle>Sukses!</AlertTitle>
                                        <AlertDescription className="text-green-700">{success}</AlertDescription>
                                    </Alert>
                                )}
                                </motion.div>

                                <Button type="submit" className="w-full text-base font-bold py-3 rounded-xl bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" disabled={isLoading}>
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...</>
                                    ) : (
                                        'Simpan Desa'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </main>
        </div>
    );
}