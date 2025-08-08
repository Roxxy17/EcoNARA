"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Menu, X } from "lucide-react";
import Link from "next/link";
import type { PerformanceLevel } from "@/hooks/use-device-performance";
import { useTheme } from "next-themes";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// ✅ Navigasi
const navigationItems = [
  { name: "Beranda", href: "/" },
  { name: "Fitur", href: "/Landing/features" },
  { name: "Komunitas", href: "/Landing/community" },
  { name: "Tentang", href: "/Landing/about" },
  { name: "Kontak", href: "/Landing/contact" },
];

// ✅ Warna background berdasarkan tema
const themeBgMap: Record<string, string> = {
  default: "bg-slate-950/80",
  aurora: "bg-green-900/80",
  geometric: "bg-red-900/80",
  nebula: "bg-purple-900/80",
  night: "bg-blue-900/80",
};

interface NavbarProps {
  theme: "default" | "aurora" | "night" | "geometric" | "nebula";
  performanceLevel: PerformanceLevel;
  animationSettings: {
    duration: number;
    ease: string | number[];
  };
}

const themeColorMap: Record<string, { logo: string; button: string; buttonHover: string; keluar: string; keluarHover: string }> = {
  default: {
    logo: "from-blue-500 to-cyan-500",
    button: "from-blue-500 to-cyan-500",
    buttonHover: "hover:from-blue-600 hover:to-cyan-600",
    keluar: "from-cyan-500 to-blue-500",
    keluarHover: "hover:from-cyan-600 hover:to-blue-600",
  },
  aurora: {
    logo: "from-green-500 to-blue-500",
    button: "from-green-500 to-blue-500",
    buttonHover: "hover:from-green-600 hover:to-blue-600",
    keluar: "from-blue-500 to-green-500",
    keluarHover: "hover:from-blue-600 hover:to-green-600",
  },
  geometric: {
    logo: "from-red-500 to-orange-500",
    button: "from-red-500 to-orange-500",
    buttonHover: "hover:from-red-600 hover:to-orange-600",
    keluar: "from-orange-500 to-red-500",
    keluarHover: "hover:from-orange-600 hover:to-red-600",
  },
  nebula: {
    logo: "from-purple-500 to-pink-500",
    button: "from-purple-500 to-pink-500",
    buttonHover: "hover:from-purple-600 hover:to-pink-600",
    keluar: "from-pink-500 to-purple-500",
    keluarHover: "hover:from-pink-600 hover:to-purple-600",
  },
  night: {
    logo: "from-blue-900 to-indigo-900",
    button: "from-blue-900 to-indigo-900",
    buttonHover: "hover:from-blue-800 hover:to-indigo-800",
    keluar: "from-indigo-900 to-blue-900",
    keluarHover: "hover:from-indigo-800 hover:to-blue-800",
  },
};

export const Navbar = ({ theme, performanceLevel, animationSettings }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();
  const themeColor = themeColorMap[theme] || themeColorMap["default"];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user ?? null);
    }
    getUser();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={animationSettings}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? `${themeBgMap[theme]} backdrop-blur-xl border-b border-slate-800/50`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}
          >
            <div className="relative">
              <div className={`relative w-12 h-12 bg-gradient-to-br ${themeColor.logo} rounded-xl flex items-center justify-center shadow-lg`}>
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">ECONARA</span>
              <div className="text-xs text-slate-400 font-medium">
                Sustainable Platform
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={performanceLevel !== "low" ? { y: -2 } : {}}
              >
                <Link
                  href={item.href}
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-slate-200 font-semibold">{user.user_metadata?.name || user.email}</span>
                <Button
                  className={`bg-gradient-to-r ${themeColor.keluar} ${themeColor.keluarHover} text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all duration-200`}
                  onClick={handleLogout}
                >
                  Keluar
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-full"
                  asChild
                >
                  <Link href="/login">Masuk</Link>
                </Button>
                <motion.div
                  whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className={`bg-gradient-to-r ${themeColor.button} ${themeColor.buttonHover} text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all duration-200`}
                    asChild
                  >
                    <Link href="/register">
                      <span className="relative z-10">Bergabung</span>
                    </Link>
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden"
        >
          <div className="py-6 space-y-4 border-t border-slate-800/50">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="block text-slate-300 hover:text-white font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              {user ? (
                <>
                  <span className="block text-slate-200 font-semibold">{user.user_metadata?.name || user.email}</span>
                  <Button
                    className={`w-full bg-gradient-to-r ${themeColor.keluar} ${themeColor.keluarHover} text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all duration-200`}
                    onClick={handleLogout}
                  >
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="w-full justify-start rounded-full" asChild>
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button
                    className={`w-full bg-gradient-to-r ${themeColor.button} ${themeColor.buttonHover} text-white font-semibold rounded-full px-6 py-2 shadow-md transition-all duration-200`}
                    asChild
                  >
                    <Link href="/register">Bergabung</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};
