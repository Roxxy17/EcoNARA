"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Leaf, User, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (role: string) => {
    setIsLoading(true)
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (role === "admin") {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              ECONARA
            </span>
          </div>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Masuk</CardTitle>
            <CardDescription>Pilih jenis akun Anda untuk melanjutkan</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Warga</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="user" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input id="user-email" type="email" placeholder="nama@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input id="user-password" type="password" />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  onClick={() => handleLogin("user")}
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk sebagai Warga"}
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email Admin</Label>
                  <Input id="admin-email" type="email" placeholder="admin@rt.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input id="admin-password" type="password" />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => handleLogin("admin")}
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Masuk sebagai Admin"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Belum punya akun?{" "}
                <Link href="/register" className="text-green-600 hover:underline">
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
