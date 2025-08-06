// app/logout/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { motion } from "framer-motion";
import { LogOut } from 'lucide-react';
import Link from "next/link";
export default function LogoutPage() {
  const router = useRouter();
  const { setUserProfile } = useUser();

  useEffect(() => {
    const performLogout = async () => {
      // Tunggu Supabase selesai sign out
      await supabase.auth.signOut();
      
      // Bersihkan profil pengguna di context
      setUserProfile(null);
      
      // Redirect ke halaman login setelah 1-2 detik
      const timeoutId = setTimeout(() => {
        router.push("/login");
      }, 1500); // Tunda sebentar untuk efek visual

      return () => clearTimeout(timeoutId);
    };

    performLogout();
  }, [router, setUserProfile]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-red-100 to-orange-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center p-8 bg-white/90 backdrop-blur-lg rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <LogOut className="w-12 h-12 text-red-600 animate-pulse" />
          <h1 className="text-3xl font-bold text-red-800">Sampai Jumpa!</h1>
        </div>
        <p className="text-lg text-gray-700 mt-2">
          Anda sedang keluar dari akun.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Jika Anda tidak dialihkan secara otomatis, silakan klik <Link href="/login" className="underline text-blue-500">di sini</Link>.
        </p>
      </motion.div>
    </div>
  );
}