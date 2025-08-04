"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Wheat,
  Users,
  Recycle,
  Leaf,
  Heart,
  ArrowRight,
  Sparkles,
  Menu,
  X,
  Play,
  Star,
  ArrowUpRight,
  Shield,
  Zap,
  Globe,
  Award,
  CheckCircle,
  TrendingUp,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

const navigationItems = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/about" },
  { name: "Fitur", href: "/features" },
  { name: "Komunitas", href: "/community" },
  { name: "Kontak", href: "/contact" },
]

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: "AI-Powered Analytics",
    description: "Analisis cerdas untuk optimasi distribusi pangan dan pengelolaan sampah komunitas",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Community Network",
    description: "Jaringan komunitas terintegrasi untuk kolaborasi dan berbagi sumber daya",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Secure Platform",
    description: "Keamanan data tingkat enterprise dengan enkripsi end-to-end",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Impact Tracking",
    description: "Pelacakan dampak real-time untuk mengukur kontribusi komunitas",
    color: "from-purple-500 to-pink-500",
  },
]

const stats = [
  {
    number: "2.4M",
    label: "Kg Makanan Diselamatkan",
    description: "Dari food waste menjadi makanan berguna",
    icon: <Wheat className="w-8 h-8" />,
    color: "from-emerald-500 to-teal-500",
  },
  {
    number: "156K",
    label: "Keluarga Terbantu",
    description: "Mendapat akses pangan yang lebih baik",
    icon: <Users className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    number: "89%",
    label: "Pengurangan Sampah",
    description: "Melalui program daur ulang komunitas",
    icon: <Recycle className="w-8 h-8" />,
    color: "from-purple-500 to-violet-500",
  },
  {
    number: "340+",
    label: "Desa Terhubung",
    description: "Jaringan komunitas berkelanjutan",
    icon: <Target className="w-8 h-8" />,
    color: "from-pink-500 to-rose-500",
  },
]

const testimonials = [
  {
    name: "Siti Nurhaliza",
    role: "Ketua RT 05, Bandung",
    content:
      "ECONARA mengubah cara kami mengelola komunitas. Sekarang tidak ada lagi makanan terbuang dan semua warga saling membantu.",
    avatar: "SN",
    rating: 5,
  },
  {
    name: "Budi Santoso",
    role: "Kepala Desa Sukamaju",
    content:
      "Platform ini membantu kami memetakan kebutuhan warga dengan akurat. Distribusi bantuan jadi lebih tepat sasaran.",
    avatar: "BS",
    rating: 5,
  },
  {
    name: "Maya Sari",
    role: "Ibu Rumah Tangga, Jakarta",
    content: "Fitur Food Rescue AI sangat membantu! Saya bisa masak makanan lezat dari bahan sisa tanpa boros.",
    avatar: "MS",
    rating: 5,
  },
]

const benefits = [
  "Mengurangi food waste hingga 80%",
  "Meningkatkan ketahanan pangan komunitas",
  "Mengoptimalkan pengelolaan sampah",
  "Membangun ekonomi sirkular lokal",
  "Memberdayakan masyarakat",
  "Teknologi AI yang mudah digunakan",
]

// Floating Particle Component
const FloatingParticle = ({ delay = 0, size = "small" }: { delay?: number; size?: "small" | "medium" | "large" }) => {
  const sizeClasses = {
    small: "w-1 h-1",
    medium: "w-2 h-2",
    large: "w-3 h-3",
  }

  return (
    <motion.div
      className={`absolute ${sizeClasses[size]} rounded-full`}
      style={{
        background:
          "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.6) 50%, rgba(59, 130, 246, 0.4) 100%)",
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, Math.random() * 20 - 10, 0],
        opacity: [0, 1, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        repeat: Number.POSITIVE_INFINITY,
        delay: delay,
        ease: "easeInOut",
      }}
    />
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)

  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" })

  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Iridescent Background */}
      <div className="fixed inset-0 z-0">
        {/* Base dark background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950"></div>

        {/* Primary iridescent layer with stronger colors */}
        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.3) 30%, transparent 70%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, transparent 70%), radial-gradient(circle at 40% 80%, rgba(236, 72, 153, 0.4) 0%, rgba(59, 130, 246, 0.3) 30%, transparent 70%)",
              "radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.4) 0%, rgba(59, 130, 246, 0.3) 30%, transparent 70%), radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.3) 30%, transparent 70%), radial-gradient(circle at 60% 80%, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, transparent 70%)",
              "radial-gradient(circle at 40% 50%, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.3) 30%, transparent 70%), radial-gradient(circle at 60% 20%, rgba(236, 72, 153, 0.4) 0%, rgba(59, 130, 246, 0.3) 30%, transparent 70%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.4) 0%, rgba(236, 72, 153, 0.3) 30%, transparent 70%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Rotating conic gradient for iridescent effect */}
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg at 50% 50%, rgba(139, 92, 246, 0.3) 0deg, rgba(236, 72, 153, 0.3) 60deg, rgba(59, 130, 246, 0.3) 120deg, rgba(16, 185, 129, 0.3) 180deg, rgba(245, 158, 11, 0.3) 240deg, rgba(239, 68, 68, 0.3) 300deg, rgba(139, 92, 246, 0.3) 360deg)",
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Multiple floating orbs with enhanced colors */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(236, 72, 153, 0.6) 40%, rgba(59, 130, 246, 0.4) 70%, transparent 100%)",
          }}
          animate={{
            x: [0, 150, -100, 0],
            y: [0, -120, 80, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          initial={{ top: "10%", left: "10%" }}
        />

        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(16, 185, 129, 0.6) 40%, rgba(245, 158, 11, 0.4) 70%, transparent 100%)",
          }}
          animate={{
            x: [0, -120, 100, 0],
            y: [0, 100, -60, 0],
            scale: [1, 0.7, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
          initial={{ bottom: "10%", right: "10%" }}
        />

        <motion.div
          className="absolute w-64 h-64 rounded-full blur-2xl opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.8) 0%, rgba(239, 68, 68, 0.6) 40%, rgba(245, 158, 11, 0.4) 70%, transparent 100%)",
          }}
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.4, 0.6, 1],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
          initial={{ top: "50%", left: "50%" }}
        />

        {/* Additional smaller orbs for more depth */}
        <motion.div
          className="absolute w-48 h-48 rounded-full blur-xl opacity-20"
          style={{
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%)",
          }}
          animate={{
            x: [0, -60, 30, 0],
            y: [0, 60, -30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
          initial={{ top: "20%", right: "30%" }}
        />

        <motion.div
          className="absolute w-56 h-56 rounded-full blur-2xl opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, rgba(239, 68, 68, 0.6) 50%, transparent 100%)",
          }}
          animate={{
            x: [0, 70, -35, 0],
            y: [0, -70, 35, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 14,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
          initial={{ bottom: "30%", left: "20%" }}
        />

        {/* Enhanced mesh gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.2) 50%, transparent 70%),
              linear-gradient(-45deg, transparent 30%, rgba(236, 72, 153, 0.2) 50%, transparent 70%),
              linear-gradient(90deg, transparent 30%, rgba(59, 130, 246, 0.2) 50%, transparent 70%),
              linear-gradient(0deg, transparent 30%, rgba(16, 185, 129, 0.2) 50%, transparent 70%)
            `,
            backgroundSize: "400% 400%, 400% 400%, 400% 400%, 400% 400%",
          }}
          animate={{
            backgroundPosition: [
              "0% 0%, 100% 100%, 0% 100%, 100% 0%",
              "100% 100%, 0% 0%, 100% 0%, 0% 100%",
              "0% 0%, 100% 100%, 0% 100%, 100% 0%",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Particle system */}
        {Array.from({ length: 30 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} size={i % 3 === 0 ? "large" : i % 2 === 0 ? "medium" : "small"} />
        ))}

        {/* Enhanced shimmer waves */}
        <motion.div
          className="absolute inset-0 opacity-15"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
            transform: "skewX(-12deg)",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            background: "linear-gradient(45deg, transparent, rgba(139, 92, 246, 0.4), transparent)",
            transform: "skewX(12deg)",
          }}
          animate={{
            x: ["-100%", "100%"],
            y: ["-100%", "100%"],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        <motion.div
          className="absolute inset-0 opacity-12"
          style={{
            background: "linear-gradient(-45deg, transparent, rgba(236, 72, 153, 0.4), transparent)",
            transform: "skewY(-8deg)",
          }}
          animate={{
            x: ["100%", "-100%"],
            y: ["100%", "-100%"],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Grid pattern with iridescent effect */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                linear-gradient(rgba(236, 72, 153, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(236, 72, 153, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px, 50px 50px, 25px 25px, 25px 25px",
            }}
          />
        </div>

        {/* Subtle noise texture for depth */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.02 }}>
              <div className="relative">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-xl opacity-30 blur-sm"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="relative w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
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
                <Link
                  key={index}
                  href={item.href}
                  className="text-slate-300 hover:text-white font-medium transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800/50" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold relative overflow-hidden group"
                asChild
              >
                <Link href="/register">
                  <span className="relative z-10">Bergabung</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                </Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              style={{ y: heroY, opacity: heroOpacity }}
              className="space-y-8"
            >
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Platform Keberlanjutan Terdepan
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Membangun
                <motion.span
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Komunitas
                </motion.span>
                Berkelanjutan
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-slate-300 leading-relaxed max-w-lg"
              >
                Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi
                pangan, dan membangun ekonomi sirkular.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Mulai Sekarang
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 bg-transparent backdrop-blur-sm"
                >
                  Lihat Demo
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>

              {/* Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8"
              >
                {benefits.slice(0, 4).map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Dashboard Card */}
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 overflow-hidden shadow-2xl">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">Dashboard Komunitas</h3>
                          <p className="text-white/80 text-sm">RT 05, Kelurahan Maju</p>
                        </div>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                          Live
                        </Badge>
                      </motion.div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Wheat className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium text-slate-300">Makanan Diselamatkan</span>
                        </div>
                        <div className="text-2xl font-bold text-white">24.5kg</div>
                        <div className="text-xs text-green-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +12% minggu ini
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <Recycle className="w-5 h-5 text-blue-400" />
                          <span className="text-sm font-medium text-slate-300">Sampah Didaur Ulang</span>
                        </div>
                        <div className="text-2xl font-bold text-white">18.2kg</div>
                        <div className="text-xs text-blue-400 flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          +8% minggu ini
                        </div>
                      </motion.div>
                    </div>

                    {/* Activity Feed */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-white">Aktivitas Terbaru</h4>
                      <div className="space-y-2">
                        {[
                          { action: "Bu Sari mendonasikan 5kg beras", time: "2 menit lalu", color: "bg-green-500" },
                          {
                            action: "Pak Joko menggunakan Food Rescue AI",
                            time: "15 menit lalu",
                            color: "bg-blue-500",
                          },
                          { action: "RT 03 mencapai target daur ulang", time: "1 jam lalu", color: "bg-purple-500" },
                        ].map((activity, i) => (
                          <motion.div
                            key={i}
                            className="flex items-center space-x-3 p-3 bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/20"
                            whileHover={{ x: 5 }}
                          >
                            <div className={`w-2 h-2 rounded-full ${activity.color} shadow-lg`}></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{activity.action}</p>
                              <p className="text-xs text-slate-400">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Elements */}
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-400 to-pink-500 p-3 rounded-xl shadow-lg"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>

                <motion.div
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 0],
                  }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-indigo-500 p-3 rounded-xl shadow-lg"
                >
                  <Heart className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-slate-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 mb-6 backdrop-blur-sm">
              🚀 Fitur Unggulan
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Teknologi Canggih untuk
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Komunitas Berkelanjutan
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Solusi terintegrasi yang menggabungkan kecerdasan buatan, analitik data, dan platform komunitas untuk
              menciptakan dampak positif yang terukur.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2 mb-6 backdrop-blur-sm">
              📊 Dampak Nyata
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Mengubah Komunitas,
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Satu Langkah di Waktu
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Data real-time menunjukkan bagaimana ECONARA membantu komunitas di seluruh Indonesia membangun ekosistem
              yang lebih berkelanjutan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full shadow-xl">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                    <div className="text-lg font-semibold text-slate-300 mb-2">{stat.label}</div>
                    <div className="text-sm text-slate-400">{stat.description}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-slate-900/20 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2 mb-6 backdrop-blur-sm">
              💬 Testimoni
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Apa Kata
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Pengguna Kami
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{testimonial.name}</div>
                        <div className="text-sm text-slate-400">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              Siap Membangun
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Komunitas Berkelanjutan?
              </span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan komunitas di Indonesia yang sudah merasakan dampak positif ECONARA. Mulai
              perjalanan menuju masa depan yang lebih berkelanjutan hari ini.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-10 py-4 text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Mulai Gratis Sekarang
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-10 py-4 text-lg bg-transparent backdrop-blur-sm"
              >
                Jadwalkan Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-slate-400">Gratis untuk Komunitas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-slate-400">Dukungan Teknis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-slate-400">Potensi Dampak Positif</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-xl text-white py-16 relative z-10 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">ECONARA</span>
                  <div className="text-sm text-slate-400">Sustainable Platform</div>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed max-w-md mb-6">
                Membangun masa depan berkelanjutan melalui teknologi AI, pemberdayaan komunitas, dan kolaborasi untuk
                ketahanan pangan serta pengelolaan sampah yang cerdas.
              </p>
              <div className="flex space-x-4">
                {["📧", "📱", "🐦"].map((icon, i) => (
                  <motion.div
                    key={i}
                    className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.1, y: -2 }}
                  >
                    <span>{icon}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Fitur Utama
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Harga
                  </Link>
                </li>
                <li>
                  <Link href="/api" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="hover:text-white transition-colors">
                    Integrasi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Perusahaan</h3>
              <ul className="space-y-3 text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white transition-colors">
                    Karir
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">
              © 2024 ECONARA. Membangun komunitas berkelanjutan untuk masa depan yang lebih baik.
            </div>
            <div className="flex space-x-8 text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
