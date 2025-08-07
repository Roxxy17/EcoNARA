"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Recycle, Leaf, AlertCircle, CheckCircle, Info, Trash2 } from "lucide-react" // ArrowLeft dihilangkan
import Link from "next/link" // Tetap dipertahankan jika ada Link lain yang digunakan, jika tidak bisa dihapus
import { Navbar } from "@/components/navigation/nav-dashboard" // Import Navbar

const wasteCategories = {
  organic: {
    name: "Organik",
    color: "bg-green-500",
    icon: Leaf,
    description: "Sampah yang dapat terurai secara alami",
    disposal: "Dapat dijadikan kompos atau pupuk organik",
    examples: ["Sisa makanan", "Daun kering", "Kulit buah"],
  },
  plastic: {
    name: "Plastik",
    color: "bg-blue-500",
    icon: Recycle,
    description: "Sampah plastik yang dapat didaur ulang",
    disposal: "Kumpulkan dan serahkan ke bank sampah",
    examples: ["Botol plastik", "Kantong plastik", "Wadah makanan"],
  },
  paper: {
    name: "Kertas",
    color: "bg-yellow-500",
    icon: Upload,
    description: "Sampah kertas dan kardus",
    disposal: "Dapat didaur ulang menjadi kertas baru",
    examples: ["Koran bekas", "Kardus", "Kertas HVS"],
  },
  electronic: {
    name: "Elektronik",
    color: "bg-purple-500",
    icon: AlertCircle,
    description: "Sampah elektronik berbahaya",
    disposal: "Serahkan ke pusat daur ulang khusus",
    examples: ["Baterai", "HP rusak", "Kabel"],
  },
  hazardous: {
    name: "Berbahaya",
    color: "bg-red-500",
    icon: AlertCircle,
    description: "Sampah yang memerlukan penanganan khusus",
    disposal: "Serahkan ke fasilitas pengelolaan limbah B3",
    examples: ["Obat kadaluarsa", "Cat", "Pestisida"],
  },
}

export default function TrashClassifierPage() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock result
    const categories = Object.keys(wasteCategories)
    const randomCategory = categories[Math.floor(Math.random() * categories.length)]
    const confidence = Math.floor(Math.random() * 30) + 70 // 70-100%

    setResult({
      category: randomCategory,
      confidence: confidence,
      recommendations: wasteCategories[randomCategory],
    })
    setIsAnalyzing(false)
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50">
      <Navbar /> {/* Tambahkan Navbar di sini */}
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-[56px] z-40"> {/* Sesuaikan top */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            {/* Bagian "Kembali" telah dihapus */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Trash Classifier AI</h1>
                <p className="text-sm text-gray-600">Klasifikasi sampah dengan computer vision</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-purple-500" />
                  <span>Upload Foto Sampah</span>
                </CardTitle>
                <CardDescription>Ambil foto atau upload gambar sampah untuk dianalisis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Foto Sampah</h3>
                    <p className="text-gray-600 mb-4">Drag & drop foto atau klik untuk memilih file</p>
                    <div className="flex space-x-2 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File
                      </Button>
                      <Button variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Ambil Foto
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={selectedImage || "/placeholder.svg"}
                        alt="Uploaded waste"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetAnalysis}
                        className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4 h-4 mr-2" />
                          Analisis Sampah
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guide Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <Info className="w-5 h-5" />
                  <span>Tips Foto yang Baik</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Pastikan sampah terlihat jelas dan tidak buram</p>
                  <p>• Gunakan pencahayaan yang cukup</p>
                  <p>• Fokuskan pada satu jenis sampah utama</p>
                  <p>• Hindari background yang mengganggu</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {result ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-800">Hasil Analisis</CardTitle>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div
                        className={`w-12 h-12 ${result.recommendations.color} rounded-xl flex items-center justify-center`}
                      >
                        <result.recommendations.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{result.recommendations.name}</h3>
                        <p className="text-sm text-gray-600">{result.recommendations.description}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Tingkat Kepercayaan</span>
                        <span className="text-sm font-semibold text-gray-800">{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-2" />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Cara Pengelolaan:</h4>
                      <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm text-blue-800">{result.recommendations.disposal}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Contoh Sampah Sejenis:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendations.examples.map((example, index) => (
                          <Badge key={index} variant="secondary">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1 bg-transparent" variant="outline">
                        Simpan Hasil
                      </Button>
                      <Button className="flex-1 bg-transparent" variant="outline">
                        Bagikan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Siap Menganalisis</h3>
                  <p className="text-gray-600 mb-4">
                    Upload foto sampah dan dapatkan klasifikasi otomatis dengan panduan pengelolaan yang tepat
                  </p>
                  <div className="text-sm text-gray-500">🤖 Powered by Computer Vision AI</div>
                </CardContent>
              </Card>
            )}

            {/* Categories Overview */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Kategori Sampah</CardTitle>
                <CardDescription>Jenis sampah yang dapat dideteksi sistem</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(wasteCategories).map(([key, category], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{category.name}</h4>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
