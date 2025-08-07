// File: src/components/providers/UserProvider.jsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"; // <--- Ubah baris ini

// Definisikan interface untuk profil pengguna
interface UserProfile {
  id: string;
  name: string; 
  email: string;
  role?: string;
}

// Definisikan interface untuk nilai konteks
interface UserContextType {
  userProfile: UserProfile | null;
  // Hapus setUserProfile dari tipe konteks jika tidak diperlukan
  loadingUser: boolean;
}

// Buat konteks
const UserContext = createContext<UserContextType | undefined>(undefined);

// Buat provider
export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const supabase = createClientComponentClient(); // <--- Ubah baris ini

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoadingUser(true);
      try {
        // Ambil data sesi dari cookies.
        // `getUser()` akan membaca cookies secara otomatis.
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Ambil data profil dari tabel public.users
          const { data: profileData, error } = await supabase
            .from('users') 
            .select('id, nama, email, role') 
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Error fetching user profile:", error);
            setUserProfile(null);
          } else if (profileData) {
            setUserProfile({
              id: profileData.id,
              name: profileData.nama, 
              email: profileData.email,
              role: profileData.role,
            });
          }
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

    // Panggil fetchUserProfile saat komponen dimuat
    fetchUserProfile();

    // Tambahkan listener untuk event autentikasi (opsional, tapi bagus untuk real-time)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchUserProfile();
        }
      }
    );

    // Cleanup listener
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userProfile, loadingUser }}>
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