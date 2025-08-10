// app/logout/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { LogOut, Home, ArrowRight, Leaf } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const supabaseClient = createClientComponentClient();

  useEffect(() => {
    const performLogout = async () => {
      // Panggil signOut, auth-helpers akan menghapus cookies.
      await supabaseClient.auth.signOut();
      
      // Set status selesai logout setelah jeda singkat
      setTimeout(() => {
        setIsLoggingOut(false);
      }, 2000);
    };

    performLogout();
  }, [supabaseClient]);

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4"
        style={{
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 25%, #fed7d7 75%, #fecaca 100%)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Card 
            className="border-0 shadow-2xl backdrop-blur-lg"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <LogOut className="w-12 h-12 text-red-600 animate-pulse" />
                <h1 className="text-3xl font-bold text-red-800">Keluar...</h1>
              </div>
              <p className="text-lg text-gray-700">
                Sedang mengeluarkan Anda dari sistem
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 25%, #f0fdfa 75%, #ecfeff 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo dan Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #06b6d4)'
              }}
            >
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span 
              className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              ECONARA
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            Sampai jumpa lagi!
          </p>
        </div>

        {/* Success Card */}
        <Card 
          className="border-0 shadow-2xl backdrop-blur-lg mb-6"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(6, 182, 212, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="mx-auto mb-4"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)'
                }}
              >
                <LogOut className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <CardTitle className="text-2xl text-gray-800">
              Logout Berhasil
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Anda telah berhasil keluar dari akun. Terima kasih telah menggunakan EcoNARA!
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-4">
              {/* Login Button */}
              <Button 
                className="w-full py-3 text-base font-semibold transition-all duration-200 rounded-lg border-0"
                onClick={() => router.push('/login')}
                style={{
                  backgroundImage: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(90deg, #2563eb, #0891b2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundImage = 'linear-gradient(90deg, #3b82f6, #06b6d4)';
                }}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Login Lagi
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {/* Home Button */}
              <Button 
                className="w-full py-3 text-base font-semibold transition-all duration-200 rounded-lg border-2"
                variant="outline"
                onClick={() => router.push('/')}
                style={{
                  backgroundColor: 'transparent',
                  borderColor: '#06b6d4',
                  color: '#0891b2'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(6, 182, 212, 0.1)';
                  e.currentTarget.style.borderColor = '#0891b2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.borderColor = '#06b6d4';
                }}
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Atau{" "}
            <Link 
              href="/" 
              className="font-semibold hover:underline transition-all duration-200"
              style={{
                backgroundImage: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              jelajahi fitur lainnya
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}