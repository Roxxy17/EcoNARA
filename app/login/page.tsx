// File: src/app/login/page.jsx (asumsi ini lokasi file Anda)

"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { AdaptiveBackground } from "@/components/background/adaptive-background"
import { ThemeSelector } from "@/components/ui/theme-selector"
import { useTheme } from "next-themes"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { theme = "default" } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e) => {
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

    router.refresh()
    const user = data?.user
    const userRole = user?.user_metadata?.role

    if (userRole === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }

    setIsLoading(false)
  }

  // Jangan render sebelum mounted agar theme konsisten (hindari hydration error)
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
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              ECONARA
            </span>
          </div>
          <p className="text-muted-foreground">Masuk ke akun Anda</p>
        </div>

        <Card className="border-0 shadow-xl bg-background/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Masuk</CardTitle>
            <CardDescription>Masukkan email dan password Anda untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transition-colors duration-200"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Belum punya akun?{" "}
                <Link href="/register" className="text-green-400 hover:underline">
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