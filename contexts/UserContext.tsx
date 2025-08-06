"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase'; // Asumsi Supabase client sudah diinisialisasi di sini

// Definisikan interface untuk profil pengguna
interface UserProfile {
  id: string;
  name: string; // Menggunakan 'name' di interface untuk konsistensi di komponen React
  email: string;
  role?: string; // Tambahkan role jika ingin digunakan di UI
  // Tambahkan properti lain dari tabel public.users jika diperlukan
}

// Definisikan interface untuk nilai konteks
interface UserContextType {
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loadingUser: boolean;
}

// Buat konteks dengan nilai default
const UserContext = createContext<UserContextType | undefined>(undefined);

// Buat provider untuk konteks
export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      setLoadingUser(true);
      try {
        // Ambil data profil dari tabel public.users
        // Perhatikan bahwa kita memilih kolom 'nama' dan 'email'
        const { data, error } = await supabase
          .from('users') // Nama tabel Anda adalah 'users'
          .select('id, nama, email, role') // Pilih kolom 'id', 'nama', 'email', dan 'role'
          .eq('id', userId)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
        } else if (data) {
          // Petakan 'nama' dari Supabase ke 'name' di interface UserProfile
          setUserProfile({
            id: data.id,
            name: data.nama, // Memetakan kolom 'nama' dari DB ke 'name' di UserProfile
            email: data.email,
            role: data.role,
          });
        } else {
          setUserProfile(null);
        }
      } catch (err) {
        console.error("Unexpected error fetching user profile:", err);
        setUserProfile(null);
      } finally {
        setLoadingUser(false);
      }
    };

    // Listener untuk perubahan status autentikasi Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Jika ada sesi dan pengguna, ambil profilnya
          await fetchUserProfile(session.user.id);
        } else {
          // Jika tidak ada sesi atau pengguna logout
          setUserProfile(null);
          setLoadingUser(false);
        }
      }
    );

    // Ambil sesi awal saat komponen dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoadingUser(false);
      }
    });

    // Cleanup listener saat komponen di-unmount
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, setUserProfile, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook kustom untuk menggunakan konteks pengguna
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
