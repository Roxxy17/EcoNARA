// File: src/app/login/page.jsx (asumsi ini lokasi file Anda)

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AdaptiveBackground } from "@/components/background/adaptive-background"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { useTheme } from "next-themes"

const themeColorMap: Record<string, { 
  logo: string; 
  text: string; 
  button: React.CSSProperties;
  buttonHover: React.CSSProperties;
  register: React.CSSProperties;
  registerHover: React.CSSProperties;
}> = {
  default: {
    logo: "from-blue-500 to-cyan-500",
    text: "from-blue-400 to-cyan-400",
    button: {
      backgroundImage: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
      color: 'white'
    },
    buttonHover: {
      backgroundImage: 'linear-gradient(90deg, #2563eb, #0891b2)',
      color: 'white'
    },
    register: {
      backgroundImage: 'linear-gradient(90deg, #06b6d4, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    registerHover: {
      backgroundImage: 'linear-gradient(90deg, #0891b2, #2563eb)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  },
  aurora: {
    logo: "from-green-500 to-blue-500",
    text: "from-green-400 to-blue-400",
    button: {
      backgroundImage: 'linear-gradient(90deg, #22c55e, #3b82f6)',
      color: 'white'
    },
    buttonHover: {
      backgroundImage: 'linear-gradient(90deg, #16a34a, #2563eb)',
      color: 'white'
    },
    register: {
      backgroundImage: 'linear-gradient(90deg, #3b82f6, #22c55e)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    registerHover: {
      backgroundImage: 'linear-gradient(90deg, #2563eb, #16a34a)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  },
  geometric: {
    logo: "from-red-500 to-orange-500",
    text: "from-red-400 to-orange-400",
    button: {
      backgroundImage: 'linear-gradient(90deg, #ef4444, #f97316)',
      color: 'white'
    },
    buttonHover: {
      backgroundImage: 'linear-gradient(90deg, #dc2626, #ea580c)',
      color: 'white'
    },
    register: {
      backgroundImage: 'linear-gradient(90deg, #f97316, #ef4444)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    registerHover: {
      backgroundImage: 'linear-gradient(90deg, #ea580c, #dc2626)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  },
  nebula: {
    logo: "from-purple-500 to-pink-500",
    text: "from-purple-400 to-pink-400",
    button: {
      backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899)',
      color: 'white'
    },
    buttonHover: {
      backgroundImage: 'linear-gradient(90deg, #9333ea, #db2777)',
      color: 'white'
    },
    register: {
      backgroundImage: 'linear-gradient(90deg, #ec4899, #a855f7)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    registerHover: {
      backgroundImage: 'linear-gradient(90deg, #db2777, #9333ea)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  },
  night: {
    logo: "from-blue-900 to-indigo-900",
    text: "from-blue-400 to-indigo-400",
    button: {
      backgroundImage: 'linear-gradient(90deg, #1e3a8a, #312e81)',
      color: 'white'
    },
    buttonHover: {
      backgroundImage: 'linear-gradient(90deg, #1e40af, #3730a3)',
      color: 'white'
    },
    register: {
      backgroundImage: 'linear-gradient(90deg, #312e81, #1e3a8a)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    registerHover: {
      backgroundImage: 'linear-gradient(90deg, #3730a3, #1e40af)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  },
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isRegisterHovering, setIsRegisterHovering] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { theme = "default" } = useTheme()
  const [mounted, setMounted] = useState(false)

  const themeColor = themeColorMap[theme] || themeColorMap["default"]

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cek user login, dan redirect jika sudah login
  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
      if (data?.user) {
        const userRole = data.user.user_metadata?.role
        if (userRole === "admin") {
          router.replace("/admin")
        } else {
          router.replace("/dashboard")
        }
      }
    }
    getUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    // Redirect langsung setelah login berhasil
    const user = data?.user
    setUser(user)
    const userRole = user?.user_metadata?.role

    if (userRole === "admin") {
      router.replace("/admin")
    } else {
      router.replace("/dashboard")
    }

    setIsLoading(false)
  }

  // Jangan render sebelum mounted agar theme konsisten (hindari hydration error)
  if (!mounted) return null

  // Jika user sudah login, jangan render apapun (atau bisa tampilkan loading)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-slate-400">Mengalihkan ke dashboard...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background dinamis */}
      <AdaptiveBackground performanceLevel="high" variant={theme as any} />

      {/* Theme Selector pojok kanan atas */}
      <div className="fixed top-4 right-4 z-20">
        <ThemeSelector />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-4 text-base">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`w-14 h-14 bg-gradient-to-r ${themeColor.logo} rounded-xl flex items-center justify-center`}>
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className={`text-4xl font-extrabold bg-gradient-to-r ${themeColor.text} bg-clip-text text-transparent`}>
              ECONARA
            </span>
          </div>
          <p className="text-muted-foreground text-lg">
            Masuk ke akun Anda
          </p>
        </div>

        {/* Card dengan background transparan menggunakan inline styles */}
        <Card 
          className="border-0 shadow-2xl backdrop-blur-lg"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Masuk</CardTitle>
            <CardDescription className="text-base">
              Masukkan email dan password Anda untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="text-base py-3"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="text-base py-3 pr-12"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                className="w-full py-3 text-base font-semibold transition-all duration-200 rounded-lg border-0"
                type="submit"
                disabled={isLoading}
                style={isHovering ? themeColor.buttonHover : themeColor.button}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-base text-muted-foreground">
                Belum punya akun?{" "}
                <Link
                  href="/register"
                  className="font-semibold hover:underline transition-all duration-200"
                  style={isRegisterHovering ? themeColor.registerHover : themeColor.register}
                  onMouseEnter={() => setIsRegisterHovering(true)}
                  onMouseLeave={() => setIsRegisterHovering(false)}
                >
                  Daftar di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

// Pastikan untuk mengimpor semua komponen yang diperlukan dari library yang sesuai