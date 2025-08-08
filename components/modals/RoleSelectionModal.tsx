// File: src/components/modals/RoleSelectionModal.tsx

"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, User, Shield } from 'lucide-react';
import { useUser } from '@/contexts/UserContext'; // Pastikan path ini benar

interface RoleSelectionModalProps {
  isOpen: boolean;
}

export function RoleSelectionModal({ isOpen }: RoleSelectionModalProps) {
  const { refreshUserProfile } = useUser(); // Fungsi untuk memuat ulang data user
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (role: 'Kepala Desa' | 'Warga') => {
    setIsLoading(role);
    setError(null);

    try {
      const response = await fetch('/api/user/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengatur peran.');
      }

      // Jika berhasil, muat ulang data pengguna dari context
      // Ini akan otomatis menutup modal karena userProfile akan diperbarui
      await refreshUserProfile();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Selamat Datang!</DialogTitle>
          <DialogDescription>
            Untuk melanjutkan, silakan pilih peran Anda di dalam sistem.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleRoleSelect('Ketua')}
            disabled={!!isLoading}
          >
            {isLoading === 'Kepala Desa' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Shield className="mr-2 h-4 w-4" />
            )}
            Saya adalah Kepala Desa
          </Button>
          <Button
            size="lg"
            onClick={() => handleRoleSelect('Warga')}
            disabled={!!isLoading}
          >
            {isLoading === 'Warga' ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <User className="mr-2 h-4 w-4" />
            )}
            Saya adalah Warga
          </Button>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}