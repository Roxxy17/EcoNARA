"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView, useReducedMotion, useMotionValue, useSpring } from "framer-motion"
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

// Enhanced device performance detection hook
const useDevicePerformance = () => {
  const [performanceLevel, setPerformanceLevel] = useState<"high" | "medium" | "low">("high")
  const [deviceInfo, setDeviceInfo] = useState({
    cores: 4,
    memory: 4,
    isMobile: false,
    hasWebGL: true,
    connectionSpeed: "4g",
  })

  useEffect(() => {
    const checkPerformance = () => {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")

      // Enhanced device detection
      const cores = navigator.hardwareConcurrency || 2
      const memory = (navigator as any).deviceMemory || 4
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const connection = (navigator as any).connection
      const connectionSpeed = connection?.effectiveType || "4g"

      // Check for high refresh rate displays
      const isHighRefreshRate = window.screen && (window.screen as any).refreshRate > 60

      // Performance scoring with more factors
      let score = 0
      if (cores >= 8) score += 4
      else if (cores >= 6) score += 3
      else if (cores >= 4) score += 2
      else score += 1

      if (memory >= 8) score += 4
      else if (memory >= 6) score += 3
      else if (memory >= 4) score += 2
      else score += 1

      if (gl) score += 3
      if (!isMobile) score += 2
      if (isHighRefreshRate) score += 1
      if (connectionSpeed === "4g") score += 1

      setDeviceInfo({
        cores,
        memory,
        isMobile,
        hasWebGL: !!gl,
        connectionSpeed,
      })

      // Enhanced performance levels
      if (score >= 10) setPerformanceLevel("high")
      else if (score >= 6) setPerformanceLevel("medium")
      else setPerformanceLevel("low")
    }

    checkPerformance()
  }, [])

  return { performanceLevel, deviceInfo }
}

// Enhanced Floating Particle Component with physics
const FloatingParticle = ({
  delay = 0,
  index = 0,
  performanceLevel,
}: {
  delay?: number
  index?: number
  performanceLevel: "high" | "medium" | "low"
}) => {
  const particleCount = performanceLevel === "high" ? 15 : performanceLevel === "medium" ? 8 : 4
  if (index >= particleCount) return null

  const size = performanceLevel === "high" ? "w-2 h-2" : performanceLevel === "medium" ? "w-1.5 h-1.5" : "w-1 h-1"
  const baseX = 10 + ((index * 13) % 80)
  const baseY = 10 + ((index * 17) % 80)

  // Enhanced particle properties for high-end devices
  const particleVariants = {
    high: {
      y: [-30, -60, -30],
      x: [-10, 10, -10],
      opacity: [0, 1, 0],
      scale: [0.5, 1.5, 0.5],
      rotate: [0, 180, 360],
    },
    medium: {
      y: [-20, -40, -20],
      opacity: [0, 0.7, 0],
      scale: [0.8, 1.2, 0.8],
    },
    low: {
      y: [-15, -25, -15],
      opacity: [0, 0.5, 0],
    },
  }

  return (
    <motion.div
      className={`absolute ${size} rounded-full`}
      style={{
        background:
          performanceLevel === "high"
            ? `radial-gradient(circle, 
                rgba(139, 92, 246, 0.9) 0%, 
                rgba(236, 72, 153, 0.7) 50%, 
                rgba(59, 130, 246, 0.5) 100%)`
            : performanceLevel === "medium"
              ? `radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(236, 72, 153, 0.4) 100%)`
              : "rgba(139, 92, 246, 0.6)",
        left: `${baseX}%`,
        top: `${baseY}%`,
        willChange: "transform, opacity",
        filter: performanceLevel === "high" ? "blur(0.5px)" : "none",
        boxShadow:
          performanceLevel === "high" ? "0 0 20px rgba(139, 92, 246, 0.4), 0 0 40px rgba(236, 72, 153, 0.2)" : "none",
      }}
      animate={particleVariants[performanceLevel]}
      transition={{
        duration: performanceLevel === "high" ? 6 + Math.random() * 2 : performanceLevel === "medium" ? 7 : 8,
        repeat: Number.POSITIVE_INFINITY,
        delay: delay + Math.random() * 2,
        ease: "easeInOut",
      }}
    />
  )
}

// Enhanced Adaptive Background Component
const AdaptiveBackground = ({ performanceLevel }: { performanceLevel: "high" | "medium" | "low" }) => {
  const shouldReduceMotion = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    if (performanceLevel === "high" && !shouldReduceMotion) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX / window.innerWidth)
        mouseY.set(e.clientY / window.innerHeight)
      }
      window.addEventListener("mousemove", handleMouseMove, { passive: true })
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [performanceLevel, shouldReduceMotion, mouseX, mouseY])

  if (shouldReduceMotion || performanceLevel === "low") {
    return (
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"></div>
        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-0">
      {/* Enhanced base gradient with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900"></div>

      {/* Mouse-interactive layer for high-end devices */}
      {performanceLevel === "high" && (
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${springX}px ${springY}px, 
              rgba(139, 92, 246, 0.4) 0%, 
              rgba(236, 72, 153, 0.3) 25%, 
              rgba(59, 130, 246, 0.2) 50%, 
              transparent 70%)`,
            willChange: "background",
          }}
        />
      )}

      {/* Enhanced animated layers based on performance */}
      {performanceLevel === "high" && (
        <>
          {/* Primary iridescent layer */}
          <motion.div
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.5) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 40% 90%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 90% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 10% 80%, rgba(245, 101, 101, 0.3) 0%, transparent 50%)
              `,
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.1, 1.05, 1],
              rotate: [0, 2, -1, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Secondary color-shifting layer */}
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                conic-gradient(from 0deg at 50% 50%, 
                  rgba(139, 92, 246, 0.4) 0deg, 
                  rgba(236, 72, 153, 0.3) 60deg,
                  rgba(59, 130, 246, 0.3) 120deg,
                  rgba(16, 185, 129, 0.3) 180deg,
                  rgba(245, 101, 101, 0.3) 240deg,
                  rgba(139, 92, 246, 0.4) 300deg,
                  rgba(139, 92, 246, 0.4) 360deg)
              `,
              willChange: "transform",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 45,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Enhanced floating orbs with better physics */}
          <motion.div
            className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
            style={{
              background: `radial-gradient(circle, 
                rgba(139, 92, 246, 0.8) 0%, 
                rgba(236, 72, 153, 0.4) 40%, 
                transparent 70%)`,
              top: "0%",
              left: "0%",
              willChange: "transform",
            }}
            animate={{
              x: [0, 150, 75, 0],
              y: [0, -120, -60, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-25"
            style={{
              background: `radial-gradient(circle, 
                rgba(59, 130, 246, 0.8) 0%, 
                rgba(16, 185, 129, 0.4) 40%, 
                transparent 70%)`,
              bottom: "5%",
              right: "5%",
              willChange: "transform",
            }}
            animate={{
              x: [0, -100, -50, 0],
              y: [0, 100, 50, 0],
              scale: [1, 0.8, 1.1, 1],
            }}
            transition={{
              duration: 35,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 5,
            }}
          />

          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full blur-2xl opacity-35"
            style={{
              background: `radial-gradient(circle, 
                rgba(236, 72, 153, 0.8) 0%, 
                rgba(245, 101, 101, 0.4) 40%, 
                transparent 70%)`,
              top: "40%",
              left: "40%",
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.4, 0.8, 1],
              rotate: [0, 180, 360],
              x: [0, 50, -25, 0],
              y: [0, -25, 25, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 10,
            }}
          />

          {/* Enhanced multi-layer shimmer effects */}
          <motion.div
            className="absolute inset-0 opacity-15"
            style={{
              background: `linear-gradient(90deg, 
                transparent, 
                rgba(255, 255, 255, 0.2), 
                rgba(139, 92, 246, 0.1),
                rgba(255, 255, 255, 0.2), 
                transparent)`,
              willChange: "transform",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: `linear-gradient(45deg, 
                transparent, 
                rgba(236, 72, 153, 0.15), 
                transparent)`,
              willChange: "transform",
            }}
            animate={{
              x: ["-100%", "100%"],
              y: ["-50%", "50%"],
            }}
            transition={{
              duration: 18,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </>
      )}

      {performanceLevel === "medium" && (
        <>
          {/* Medium-end: Enhanced balanced experience */}
          <motion.div
            className="absolute inset-0 opacity-45"
            style={{
              background: `
                radial-gradient(circle at 25% 35%, rgba(139, 92, 246, 0.4) 0%, transparent 60%),
                radial-gradient(circle at 75% 65%, rgba(236, 72, 153, 0.3) 0%, transparent 60%),
                radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.25) 0%, transparent 60%)
              `,
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.08, 1],
              rotate: [0, 1, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `conic-gradient(from 0deg at 50% 50%, 
                rgba(139, 92, 246, 0.3) 0deg, 
                rgba(236, 72, 153, 0.2) 120deg, 
                rgba(59, 130, 246, 0.2) 240deg, 
                rgba(139, 92, 246, 0.3) 360deg)`,
              willChange: "transform",
            }}
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 60,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />

          {/* Enhanced floating orbs for medium */}
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.7) 0%, rgba(236, 72, 153, 0.3) 60%, transparent 80%)",
              top: "8%",
              left: "8%",
              willChange: "transform",
            }}
            animate={{
              x: [0, 80, 0],
              y: [0, -80, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 35,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute w-64 h-64 rounded-full blur-2xl opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.7) 0%, rgba(16, 185, 129, 0.3) 60%, transparent 80%)",
              bottom: "12%",
              right: "12%",
              willChange: "transform",
            }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 8,
            }}
          />

          {/* Medium shimmer effect */}
          <motion.div
            className="absolute inset-0 opacity-12"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)",
              willChange: "transform",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </>
      )}

      {/* Enhanced particle system with adaptive count */}
      {Array.from({ length: performanceLevel === "high" ? 15 : performanceLevel === "medium" ? 8 : 4 }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 0.6} index={i} performanceLevel={performanceLevel} />
      ))}

      {/* Enhanced grid pattern with depth */}
      <div
        className="absolute inset-0 opacity-8"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.15) 1px, transparent 1px),
            linear-gradient(rgba(236, 72, 153, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(236, 72, 153, 0.08) 1px, transparent 1px)
          `,
          backgroundSize:
            performanceLevel === "high"
              ? "40px 40px, 40px 40px, 120px 120px, 120px 120px"
              : performanceLevel === "medium"
                ? "50px 50px, 50px 50px, 100px 100px, 100px 100px"
                : "60px 60px",
        }}
      />

      {/* Depth layers for high-end devices */}
      {performanceLevel === "high" && (
        <>
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.2) 0%, transparent 50%),
                          radial-gradient(circle at 70% 30%, rgba(236, 72, 153, 0.15) 0%, transparent 50%)`,
            }}
          />
          <motion.div
            className="absolute inset-0 opacity-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)",
              willChange: "transform",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            }}
            transition={{
              duration: 40,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </>
      )}
    </div>
  )
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()
  const { performanceLevel, deviceInfo } = useDevicePerformance()
  const shouldReduceMotion = useReducedMotion()

  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const statsRef = useRef(null)
  const testimonialsRef = useRef(null)

  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" })
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" })

  const heroY = useTransform(scrollY, [0, 500], [0, shouldReduceMotion ? 0 : -100])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, shouldReduceMotion ? 1 : 0])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Enhanced adaptive animation settings
  const getAnimationSettings = () => {
    if (shouldReduceMotion) return { duration: 0.1, ease: "linear" }

    switch (performanceLevel) {
      case "high":
        return { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
      case "medium":
        return { duration: 0.7, ease: "easeOut" }
      case "low":
        return { duration: 0.4, ease: "linear" }
      default:
        return { duration: 0.7, ease: "easeOut" }
    }
  }

  const animationSettings = getAnimationSettings()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Adaptive Background */}
      <AdaptiveBackground performanceLevel={performanceLevel} />

      {/* Navigation */}
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
              transition={animationSettings}
              style={{ y: heroY, opacity: heroOpacity }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...animationSettings, delay: 0.2 }}
              >
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm font-medium backdrop-blur-sm relative overflow-hidden">
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Platform Keberlanjutan Terdepan
                  </span>
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...animationSettings, delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold text-white leading-tight"
              >
                Membangun
                <motion.span
                  className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
                  animate={
                    performanceLevel === "high"
                      ? {
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }
                      : {}
                  }
                  transition={
                    performanceLevel === "high"
                      ? {
                          duration: 8,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                  style={{
                    backgroundSize: "300% 300%",
                  }}
                >
                  Komunitas
                </motion.span>
                Berkelanjutan
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...animationSettings, delay: 0.4 }}
                className="text-xl text-slate-300 leading-relaxed max-w-lg"
              >
                Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi
                pangan, dan membangun ekonomi sirkular.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...animationSettings, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      <Play className="w-5 h-5 mr-2" />
                      Mulai Sekarang
                    </span>
                    {performanceLevel === "high" && (
                      <>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-50"
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          style={{
                            backgroundSize: "200% 200%",
                          }}
                        />
                      </>
                    )}
                  </Button>
                </motion.div>
                <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 bg-transparent backdrop-blur-sm"
                  >
                    Lihat Demo
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Enhanced Benefits List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...animationSettings, delay: 0.6 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-8"
              >
                {benefits.slice(0, 4).map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    whileHover={performanceLevel !== "low" ? { x: 5 } : {}}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Enhanced Right Content - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...animationSettings, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Enhanced Main Dashboard Card */}
                <motion.div
                  whileHover={performanceLevel !== "low" ? { y: -5, rotateY: 5 } : {}}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 overflow-hidden shadow-2xl relative">
                    {performanceLevel === "high" && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100"
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                        style={{
                          backgroundSize: "200% 200%",
                        }}
                      />
                    )}
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 relative overflow-hidden">
                      {performanceLevel === "high" && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20"
                          animate={{
                            x: ["-100%", "100%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                      <div className="flex items-center justify-between relative z-10">
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
                          animate={performanceLevel === "high" ? { scale: [1, 1.1, 1] } : {}}
                          transition={
                            performanceLevel === "high" ? { duration: 2, repeat: Number.POSITIVE_INFINITY } : {}
                          }
                        >
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            <motion.div
                              className="w-2 h-2 bg-green-400 rounded-full mr-2"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                            />
                            Live
                          </Badge>
                        </motion.div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                      {/* Enhanced Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 relative overflow-hidden"
                          whileHover={performanceLevel !== "low" ? { scale: 1.02, y: -2 } : {}}
                        >
                          {performanceLevel === "high" && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10 opacity-0 hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <div className="flex items-center space-x-2 mb-2 relative z-10">
                            <Wheat className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium text-slate-300">Makanan Diselamatkan</span>
                          </div>
                          <div className="text-2xl font-bold text-white relative z-10">24.5kg</div>
                          <div className="text-xs text-green-400 flex items-center relative z-10">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +12% minggu ini
                          </div>
                        </motion.div>

                        <motion.div
                          className="bg-slate-800/60 backdrop-blur-sm p-4 rounded-lg border border-slate-700/30 relative overflow-hidden"
                          whileHover={performanceLevel !== "low" ? { scale: 1.02, y: -2 } : {}}
                        >
                          {performanceLevel === "high" && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 opacity-0 hover:opacity-100"
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          <div className="flex items-center space-x-2 mb-2 relative z-10">
                            <Recycle className="w-5 h-5 text-blue-400" />
                            <span className="text-sm font-medium text-slate-300">Sampah Didaur Ulang</span>
                          </div>
                          <div className="text-2xl font-bold text-white relative z-10">18.2kg</div>
                          <div className="text-xs text-blue-400 flex items-center relative z-10">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +8% minggu ini
                          </div>
                        </motion.div>
                      </div>

                      {/* Enhanced Activity Feed */}
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
                              className="flex items-center space-x-3 p-3 bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/20 relative overflow-hidden"
                              whileHover={performanceLevel !== "low" ? { x: 5, scale: 1.01 } : {}}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              {performanceLevel === "high" && (
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-slate-700/20 to-transparent opacity-0 hover:opacity-100"
                                  transition={{ duration: 0.3 }}
                                />
                              )}
                              <motion.div
                                className={`w-2 h-2 rounded-full ${activity.color} shadow-lg relative z-10`}
                                animate={performanceLevel === "high" ? { scale: [1, 1.2, 1] } : {}}
                                transition={
                                  performanceLevel === "high"
                                    ? { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: i * 0.5 }
                                    : {}
                                }
                              />
                              <div className="flex-1 relative z-10">
                                <p className="text-sm font-medium text-white">{activity.action}</p>
                                <p className="text-xs text-slate-400">{activity.time}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Enhanced Floating Elements */}
                <motion.div
                  animate={
                    performanceLevel !== "low"
                      ? {
                          y: [0, -20, 0],
                          rotate: [0, 10, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={
                    performanceLevel !== "low"
                      ? {
                          duration: 6,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-400 to-pink-500 p-3 rounded-xl shadow-lg relative overflow-hidden"
                >
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-red-400/30"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  )}
                  <Sparkles className="w-6 h-6 text-white relative z-10" />
                </motion.div>

                <motion.div
                  animate={
                    performanceLevel !== "low"
                      ? {
                          y: [0, 20, 0],
                          rotate: [0, -10, 0],
                          scale: [1, 1.1, 1],
                        }
                      : {}
                  }
                  transition={
                    performanceLevel !== "low"
                      ? {
                          duration: 7,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }
                      : {}
                  }
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-400 to-indigo-500 p-3 rounded-xl shadow-lg relative overflow-hidden"
                >
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-blue-400/30"
                      animate={{
                        rotate: [360, 0],
                      }}
                      transition={{
                        duration: 10,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  )}
                  <Heart className="w-6 h-6 text-white relative z-10" />
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
            transition={animationSettings}
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
                transition={{ ...animationSettings, delay: index * 0.1 }}
                whileHover={performanceLevel !== "low" ? { y: -8, scale: 1.02 } : {}}
                className="group"
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full shadow-xl relative overflow-hidden">
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden`}
                      whileHover={performanceLevel === "high" ? { rotate: [0, 5, -5, 0] } : {}}
                    >
                      {performanceLevel === "high" && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      )}
                      <span className="relative z-10">{feature.icon}</span>
                    </motion.div>
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
            transition={animationSettings}
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
                transition={{ ...animationSettings, delay: index * 0.1 }}
                whileHover={performanceLevel !== "low" ? { y: -8, scale: 1.02 } : {}}
                className="group"
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full shadow-xl relative overflow-hidden">
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-slate-800/20 via-transparent to-slate-700/20 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div
                      className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg relative overflow-hidden`}
                      whileHover={performanceLevel === "high" ? { rotate: [0, -5, 5, 0] } : {}}
                    >
                      {performanceLevel === "high" && (
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                      <span className="relative z-10">{stat.icon}</span>
                    </motion.div>
                    <motion.div
                      className="text-4xl font-bold text-white mb-2"
                      animate={performanceLevel === "high" && isStatsInView ? { scale: [1, 1.1, 1] } : {}}
                      transition={
                        performanceLevel === "high"
                          ? { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }
                          : {}
                      }
                    >
                      {stat.number}
                    </motion.div>
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
            transition={animationSettings}
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
                transition={{ ...animationSettings, delay: index * 0.1 }}
                whileHover={performanceLevel !== "low" ? { y: -8, scale: 1.02 } : {}}
              >
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full shadow-xl relative overflow-hidden">
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={performanceLevel === "high" ? { scale: [1, 1.2, 1] } : {}}
                          transition={
                            performanceLevel === "high"
                              ? { duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: i * 0.1 }
                              : {}
                          }
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold shadow-lg relative overflow-hidden"
                        whileHover={performanceLevel !== "low" ? { scale: 1.1 } : {}}
                      >
                        {performanceLevel === "high" && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-blue-400/30"
                            animate={{
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "linear",
                            }}
                          />
                        )}
                        <span className="relative z-10">{testimonial.avatar}</span>
                      </motion.div>
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
      <section className="py-20 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm relative z-10 overflow-hidden">
        {performanceLevel === "high" && (
          <motion.div
            className="absolute inset-0 opacity-20"
            style={{
              background: `
                radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.4) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)
              `,
            }}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 2, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={animationSettings}>
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8">
              Siap Membangun
              <motion.span
                className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"
                animate={
                  performanceLevel === "high"
                    ? {
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }
                    : {}
                }
                transition={
                  performanceLevel === "high"
                    ? {
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }
                    : {}
                }
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                Komunitas Berkelanjutan?
              </motion.span>
            </h2>
            <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
              Bergabunglah dengan ribuan komunitas di Indonesia yang sudah merasakan dampak positif ECONARA. Mulai
              perjalanan menuju masa depan yang lebih berkelanjutan hari ini.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-10 py-4 text-lg relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center">
                    Mulai Gratis Sekarang
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                  {performanceLevel === "high" && (
                    <>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        }}
                      />
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={performanceLevel !== "low" ? { scale: 1.02 } : {}}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800/50 px-10 py-4 text-lg bg-transparent backdrop-blur-sm"
                >
                  Jadwalkan Demo
                </Button>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { value: "100%", label: "Gratis untuk Komunitas" },
                { value: "24/7", label: "Dukungan Teknis" },
                { value: "∞", label: "Potensi Dampak Positif" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  whileHover={performanceLevel !== "low" ? { y: -5 } : {}}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="text-3xl font-bold mb-2"
                    animate={performanceLevel === "high" ? { scale: [1, 1.1, 1] } : {}}
                    transition={
                      performanceLevel === "high"
                        ? { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }
                        : {}
                    }
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-slate-400">{item.label}</div>
                </motion.div>
              ))}
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
                <motion.div
                  className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                  whileHover={performanceLevel !== "low" ? { scale: 1.05, rotate: 5 } : {}}
                >
                  {performanceLevel === "high" && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-blue-400/30"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    />
                  )}
                  <Leaf className="w-7 h-7 text-white relative z-10" />
                </motion.div>
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
                    className="w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-colors cursor-pointer relative overflow-hidden"
                    whileHover={performanceLevel !== "low" ? { scale: 1.1, y: -2 } : {}}
                  >
                    {performanceLevel === "high" && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 hover:opacity-100"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="relative z-10">{icon}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                {[
                  { name: "Fitur Utama", href: "/features" },
                  { name: "Harga", href: "/pricing" },
                  { name: "API", href: "/api" },
                  { name: "Integrasi", href: "/integrations" },
                ].map((item, index) => (
                  <motion.li key={index} whileHover={performanceLevel !== "low" ? { x: 5 } : {}}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6">Perusahaan</h3>
              <ul className="space-y-3 text-slate-400">
                {[
                  { name: "Tentang Kami", href: "/about" },
                  { name: "Blog", href: "/blog" },
                  { name: "Karir", href: "/careers" },
                  { name: "Kontak", href: "/contact" },
                ].map((item, index) => (
                  <motion.li key={index} whileHover={performanceLevel !== "low" ? { x: 5 } : {}}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-400 mb-4 md:mb-0">
              © 2024 ECONARA. Membangun komunitas berkelanjutan untuk masa depan yang lebih baik.
            </div>
            <div className="flex space-x-8 text-slate-400">
              {[
                { name: "Kebijakan Privasi", href: "/privacy" },
                { name: "Syarat & Ketentuan", href: "/terms" },
                { name: "Cookies", href: "/cookies" },
              ].map((item, index) => (
                <motion.div key={index} whileHover={performanceLevel !== "low" ? { y: -2 } : {}}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Performance Indicator (Development only) */}
      {process.env.NODE_ENV === "development" && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 bg-slate-800/90 backdrop-blur-sm text-white px-4 py-3 rounded-lg text-xs border border-slate-700/50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  performanceLevel === "high"
                    ? "bg-green-400"
                    : performanceLevel === "medium"
                      ? "bg-yellow-400"
                      : "bg-red-400"
                }`}
              />
              <span className="font-semibold">Performance: {performanceLevel.toUpperCase()}</span>
            </div>
            <div className="text-xs text-slate-400">
              Cores: {deviceInfo.cores} | Memory: {deviceInfo.memory}GB | Mobile: {deviceInfo.isMobile ? "Yes" : "No"}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
