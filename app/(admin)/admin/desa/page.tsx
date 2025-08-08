// File: src/app/admin/desa/page.tsx

"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
// Pastikan path untuk Navbar ini benar
import { Navbar } from "@/components/navigation/nav-dashboard";

// Import komponen UI dari shadcn/ui
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// Komponen utama untuk halaman Tambah Desa
export default function TambahDesaPage() {
  const { userProfile, loadingUser } = useUser();
  const router = useRouter();

  // State untuk menampung data dari form
  const [formData, setFormData] = useState({
    nama_desa: '',
    kecamatan: '',
    provinsi: '',
  });

  // State untuk menangani proses loading, error, dan sukses
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fungsi untuk menangani perubahan pada input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Validasi sederhana
    if (!formData.nama_desa) {
      setError("Nama Desa tidak boleh kosong.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/desa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Terjadi kesalahan saat menambahkan desa.');
      }

      setSuccess('Desa berhasil ditambahkan!');
      setFormData({ nama_desa: '', kecamatan: '', provinsi: '' }); // Reset form
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilkan loading spinner saat data user masih dimuat
  if (loadingUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Proteksi Halaman: Jika bukan admin, tampilkan pesan akses ditolak
  if (userProfile?.role !== 'admin') {
    return (
      <div>
        <Navbar />
        <main className="container mx-auto py-10">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Akses Ditolak</AlertTitle>
            <AlertDescription>
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  // Tampilan utama halaman jika pengguna adalah admin
  return (
    <div>
      <Navbar />
      <main className="container mx-auto py-10">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Tambah Desa Baru</CardTitle>
            <CardDescription>
              Isi formulir di bawah ini untuk menambahkan data desa baru ke dalam sistem.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nama_desa">Nama Desa <span className="text-red-500">*</span></Label>
                <Input
                  id="nama_desa"
                  name="nama_desa"
                  value={formData.nama_desa}
                  onChange={handleChange}
                  placeholder="Contoh: Caturtunggal"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kecamatan">Kecamatan</Label>
                <Input
                  id="kecamatan"
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  placeholder="Contoh: Depok"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="provinsi">Provinsi</Label>
                <Input
                  id="provinsi"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  placeholder="Contoh: DI Yogyakarta"
                  disabled={isLoading}
                />
              </div>

              {/* Tampilkan pesan Error jika ada */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Tampilkan pesan Sukses jika ada */}
              {success && (
                <Alert variant="default" className="bg-green-50 border-green-200">
                   <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Sukses</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Desa'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}