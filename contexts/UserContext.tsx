// Nama file: src/components/providers/UserProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs";

// Definisikan interface agar 100% cocok dengan skema tabel 'users' Anda
interface UserProfile {
  id: string;
  nama: string; // <-- Gunakan 'nama' agar konsisten dengan DB
  email: string;
  role?: string;
  desa_id?: number;
  poin_komunitas?: number;
  created_at?: string;
  updated_at?: string;
  phone_number?: string;
  is_role_confirmed?: boolean;
  bio?: string;
  desa?: { nama_desa: string };
  avatar_url?: string;
}

interface UserContextType {
  userProfile: UserProfile | null;
  loadingUser: boolean;
  refreshUserProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const supabase = createClientComponentClient();

  const fetchUserProfile = useCallback(async () => {
    setLoadingUser(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error } = await supabase
          .from('users')
          .select('*, desa:desa_id(nama_desa)')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error.message);
          setUserProfile(null);
        } else {
          // --- PERUBAHAN UTAMA DI SINI ---
          // Langsung simpan objek dari Supabase. Tidak perlu mapping manual.
          setUserProfile(profileData);
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
  }, [supabase]);

  useEffect(() => {
    fetchUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserProfile();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile, supabase]);

  return (
    <UserContext.Provider value={{ userProfile, loadingUser, refreshUserProfile: fetchUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}