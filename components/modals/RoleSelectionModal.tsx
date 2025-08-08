// File: src/components/modals/RoleSelectionModal.tsx

"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, User, Shield, Check, ChevronsUpDown } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Impor komponen baru untuk Combobox
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';

interface RoleSelectionModalProps {
  isOpen: boolean;
}

// Definisikan tipe untuk objek desa
type Desa = {
  id: number;
  nama_desa: string;
};

export function RoleSelectionModal({ isOpen }: RoleSelectionModalProps) {
  const { refreshUserProfile } = useUser();
  const supabase = createClientComponentClient();

  const [desas, setDesas] = useState<Desa[]>([]);
  const [selectedDesa, setSelectedDesa] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Efek untuk mengambil daftar desa dari database saat komponen dimuat
  useEffect(() => {
    const fetchDesas = async () => {
      const { data, error } = await supabase.from('desa').select('id, nama_desa');
      if (data) {
        setDesas(data);
      } else {
        console.error("Gagal mengambil data desa:", error);
      }
    };
    fetchDesas();
  }, [supabase]);

  const handleRoleSelect = async (role: 'Ketua' | 'Warga') => {
    // Validasi: pastikan desa sudah dipilih
    if (!selectedDesa) {
      setError("Silakan pilih desa Anda terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, desa_id: selectedDesa }), // Kirim juga desa_id
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengatur peran.');
      }

      await refreshUserProfile();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Selamat Datang!</DialogTitle>
          <DialogDescription>
            Untuk melanjutkan, lengkapi profil Anda dengan memilih desa dan peran.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Combobox untuk Pilihan Desa */}
          <div>
            <label className="text-sm font-medium mb-2 block">Pilih Desa Anda</label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  {selectedDesa
                    ? desas.find((desa) => desa.id === selectedDesa)?.nama_desa
                    : "Pilih desa..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[375px] p-0">
                <Command>
                  <CommandInput placeholder="Cari desa..." />
                  <CommandEmpty>Desa tidak ditemukan.</CommandEmpty>
                  <CommandGroup>
                    {desas.map((desa) => (
                      <CommandItem
                        key={desa.id}
                        onSelect={() => {
                          setSelectedDesa(desa.id);
                          setPopoverOpen(false);
                          setError(null); // Hapus error jika ada
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDesa === desa.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {desa.nama_desa}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="text-center text-sm text-gray-500">Pilih Peran Anda</div>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleRoleSelect('Ketua')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
            Saya adalah Kepala Desa
          </Button>

          <Button
            size="lg"
            onClick={() => handleRoleSelect('Warga')}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <User className="mr-2 h-4 w-4" />}
            Saya adalah Warga
          </Button>
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      </DialogContent>
    </Dialog>
  );
}