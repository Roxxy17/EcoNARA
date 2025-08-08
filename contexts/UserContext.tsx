// Nama file: src/components/providers/UserProvider.tsx

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClientComponentClient, User } from "@supabase/auth-helpers-nextjs";

// Definisikan interface untuk profil pengguna yang lebih lengkap
interface UserProfile {
  id: string;
  name: string; 
  email: string;
  role?: string;
  is_role_confirmed?: boolean; // <-- TAMBAHKAN INI
}

// Definisikan interface untuk nilai konteks
interface UserContextType {
  userProfile: UserProfile | null;
  loadingUser: boolean;
  refreshUserProfile: () => Promise<void>; // <-- TAMBAHKAN INI
}

// Buat konteks
const UserContext = createContext<UserContextType | undefined>(undefined);

// Buat provider
export function UserProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const supabase = createClientComponentClient();

  // Gunakan useCallback agar fungsi ini tidak dibuat ulang di setiap render
  const fetchUserProfile = useCallback(async () => {
    setLoadingUser(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData, error } = await supabase
          .from('users') 
          // --- PERUBAHAN UTAMA DI SINI ---
          .select('*, is_role_confirmed') // <-- UBAH BARIS INI
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user profile:", error.message);
          setUserProfile(null);
        } else if (profileData) {
          setUserProfile({
            id: profileData.id,
            name: profileData.nama, 
            email: profileData.email,
            role: profileData.role,
            is_role_confirmed: profileData.is_role_confirmed, // <-- TAMBAHKAN INI
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
  }, [supabase]);

  useEffect(() => {
    fetchUserProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Panggil fetchUserProfile saat login atau logout untuk menyinkronkan data
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          fetchUserProfile();
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserProfile, supabase]);

  return (
    // Sediakan `refreshUserProfile` ke dalam value provider
    <UserContext.Provider value={{ userProfile, loadingUser, refreshUserProfile: fetchUserProfile }}>
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