"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Leaf, Menu, X } from 'lucide-react'
import Link from "next/link"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

const navigationItems = [
  { name: "Beranda", href: "/" },
  { name: "Fitur", href: "/features" },
  { name: "Komunitas", href: "/community" },
  { name: "Tentang", href: "/about" },
  { name: "Kontak", href: "/contact" },
]

interface NavbarProps {
  performanceLevel: PerformanceLevel
  animationSettings: {
    duration: number
    ease: string | number[]
  }
}

export const Navbar = ({ performanceLevel, animationSettings }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={animationSettings}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}
          >
            <div className="relative">
              {performanceLevel === "high" && (
                <>
                  <motion.div
                    className="absolute -inset-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl opacity-20 blur-md"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 15,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-30 blur-sm"
                    animate={{ rotate: [360, 0] }}
                    transition={{
                      duration: 10,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                </>
              )}
              <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">ECONARA</span>
              <div className="text-xs text-slate-400 font-medium">Sustainable Platform</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div key={index} whileHover={performanceLevel !== "low" ? { y: -2 } : {}}>
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

          {/* Enhanced Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold relative overflow-hidden group"
                asChild
              >
                <Link href="/register">
                  <span className="relative z-10">Bergabung</span>
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      style={{
                        backgroundSize: "200% 200%",
                      }}
                    />
                  )}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-slate-300 hover:text-white">
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
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500" asChild>
                <Link href="/register">Bergabung</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}
