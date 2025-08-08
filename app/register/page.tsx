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
import { useToast } from "@/components/ui/use-toast"
import { AdaptiveBackground } from "@/components/background/adaptive-background"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { useTheme } from "next-themes"

const themeColorMap: Record<string, { logo: string; text: string; button: string; buttonHover: string; register: string; registerHover: string }> = {
  default: {
    logo: "from-blue-500 to-cyan-500",
    text: "from-blue-400 to-cyan-400",
    button: "from-blue-500 to-cyan-500",
    buttonHover: "hover:from-blue-600 hover:to-cyan-600",
    register: "from-cyan-500 to-blue-500",
    registerHover: "hover:from-cyan-600 hover:to-blue-600",
  },
  aurora: {
    logo: "from-green-500 to-blue-500",
    text: "from-green-400 to-blue-400",
    button: "from-green-500 to-blue-500",
    buttonHover: "hover:from-green-600 hover:to-blue-600",
    register: "from-blue-500 to-green-500",
    registerHover: "hover:from-blue-600 hover:to-green-600",
  },
  geometric: {
    logo: "from-red-500 to-orange-500",
    text: "from-red-400 to-orange-400",
    button: "from-red-500 to-orange-500",
    buttonHover: "hover:from-red-600 hover:to-orange-600",
    register: "from-orange-500 to-red-500",
    registerHover: "hover:from-orange-600 hover:to-red-600",
  },
  nebula: {
    logo: "from-purple-500 to-pink-500",
    text: "from-purple-400 to-pink-400",
    button: "from-purple-500 to-pink-500",
    buttonHover: "hover:from-purple-600 hover:to-pink-600",
    register: "from-pink-500 to-purple-500",
    registerHover: "hover:from-pink-600 hover:to-purple-600",
  },
  night: {
    logo: "from-blue-900 to-indigo-900",
    text: "from-blue-400 to-indigo-400",
    button: "from-blue-900 to-indigo-900",
    buttonHover: "hover:from-blue-800 hover:to-indigo-800",
    register: "from-indigo-900 to-blue-900",
    registerHover: "hover:from-indigo-800 hover:to-blue-800",
  },
};

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const { theme = "default" } = useTheme()
  const themeColor = themeColorMap[theme] || themeColorMap["default"]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Password tidak cocok.")
      setIsLoading(false)
      return
    }

    // Integrasi dengan Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setIsLoading(false)
      toast({
        title: "Pendaftaran Gagal",
        description: signUpError.message,
        variant: "destructive",
      })
      return
    }

    if (data.user) {
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Akun Anda telah dibuat. Silakan cek email untuk verifikasi.",
        variant: "default",
      })
      router.push("/login")
    }

    setIsLoading(false)
  }

  if (!mounted) return null

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
          <Link href="/login" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-4 text-base">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>

          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`w-14 h-14 bg-gradient-to-r ${themeColor.logo} rounded-xl flex items-center justify-center`}>
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <span className={`text-4xl font-extrabold bg-gradient-to-r ${themeColor.text} bg-clip-text text-transparent`}>
              ECONARA
            </span>
          </div>
          <p className="text-muted-foreground text-lg">Daftar akun baru Anda</p>
        </div>

        <Card className="border-0 shadow-2xl ring-1 ring-white/10 bg-background/80 backdrop-blur-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Daftar</CardTitle>
            <CardDescription className="text-base">
              Buat akun untuk memulai perjalanan keberlanjutan Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="text-base py-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-base py-3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-base py-3 pr-12"
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
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Ulangi Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="text-base py-3 pr-12"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                className={`w-full bg-gradient-to-r ${themeColor.button} ${themeColor.buttonHover} py-3 text-base font-semibold transition-colors duration-200 rounded-lg`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-base text-muted-foreground">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className={`bg-gradient-to-r ${themeColor.register} ${themeColor.registerHover} bg-clip-text text-transparent font-semibold hover:underline transition-colors`}
                >
                  Masuk di sini
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
