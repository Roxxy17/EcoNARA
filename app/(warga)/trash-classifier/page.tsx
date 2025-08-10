"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Camera, Upload, Recycle, Leaf, AlertCircle, CheckCircle, Info, Trash2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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
  const [isSaving, setIsSaving] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)
  const supabase = createClientComponentClient();

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

  const saveResult = async () => {
    if (!selectedImage || !result) {
        alert("Tidak ada hasil untuk disimpan.");
        return;
    }
    setIsSaving(true);

    try {
        // Ambil sesi pengguna dan token
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
            throw new Error("Pengguna tidak terautentikasi.");
        }

        console.log("User ID dari sesi:", user.id);
        console.log("Data yang akan di-INSERT:", {
            user_id: user.id,
            classified_as: result.category,
        });

        // Ubah format data URL menjadi File agar bisa diupload ke Storage
        const fetchRes = await fetch(selectedImage);
        const blob = await fetchRes.blob();
        const file = new File([blob], `trash-${Date.now()}.png`, { type: "image/png" });
        
        // Upload gambar ke Supabase Storage
        const filePath = `${user.id}/${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from("trash-photos")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`Gagal mengunggah foto: ${uploadError.message}`);
        }

        // Dapatkan URL gambar yang sudah diunggah
        const { data: publicUrlData } = supabase.storage
            .from("trash-photos")
            .getPublicUrl(filePath);
        
        const photo_url = publicUrlData.publicUrl;

        // Simpan data ke tabel trash_records
        const { error: insertError } = await supabase
            .from("trash_records")
            .insert({
                user_id: user.id,
                photo_url,
                classified_as: result.category,
            });
        
        if (insertError) {
            throw new Error(`Gagal menyimpan data: ${insertError.message}`);
        }

        alert("Hasil analisis berhasil disimpan!");
    } catch (e) {
        console.error("Gagal menyimpan hasil:", e);
        alert(`Gagal menyimpan hasil: ${e.message}`);
    } finally {
        setIsSaving(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null)
    setResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      {/* Background Effects - konsisten dengan page lain */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />

      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/25">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                  Trash Classifier AI
                </h1>
                <p className="text-sm text-cyan-700/80 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Klasifikasi sampah dengan computer vision dan dapatkan panduan pengelolaan
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
              <CheckCircle className="w-3 h-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-cyan-900">
                  <Camera className="w-5 h-5 text-green-600" />
                  <span>Upload Foto Sampah</span>
                </CardTitle>
                <CardDescription className="text-cyan-700">
                  Ambil foto atau upload gambar sampah untuk dianalisis dengan AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-cyan-300 rounded-xl p-8 text-center bg-gradient-to-br from-cyan-50/50 to-blue-50/50 hover:from-cyan-50 hover:to-blue-50 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-cyan-900 mb-2">Upload Foto Sampah</h3>
                    <p className="text-cyan-700 mb-4">Drag & drop foto atau klik untuk memilih file</p>
                    <div className="flex space-x-2 justify-center">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Pilih File
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-cyan-400 text-cyan-700 hover:bg-cyan-50"
                      >
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
                        className="w-full h-64 object-cover rounded-xl shadow-lg"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetAnalysis}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <Button
                      onClick={analyzeImage}
                      disabled={isAnalyzing}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Menganalisis...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analisis dengan AI
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guide Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50/90 to-cyan-50/90 backdrop-blur-sm border border-green-200/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <Info className="w-5 h-5 text-green-600" />
                  <span>Tips Foto yang Baik</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-green-700 space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p>Pastikan sampah terlihat jelas dan tidak buram</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p>Gunakan pencahayaan yang cukup</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p>Fokuskan pada satu jenis sampah utama</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <p>Hindari background yang mengganggu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {result ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-cyan-900">Hasil Analisis AI</CardTitle>
                      <Badge className="bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-cyan-50/50 rounded-xl border border-cyan-100/50">
                      <div
                        className={`w-14 h-14 ${result.recommendations.color} rounded-2xl flex items-center justify-center shadow-lg`}
                      >
                        <result.recommendations.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-cyan-900">{result.recommendations.name}</h3>
                        <p className="text-sm text-cyan-700">{result.recommendations.description}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-cyan-800">Tingkat Kepercayaan AI</span>
                        <span className="text-sm font-bold text-green-600">{result.confidence}%</span>
                      </div>
                      <Progress value={result.confidence} className="h-3 bg-gray-100" />
                      <p className="text-xs text-cyan-600">Semakin tinggi persentase, semakin akurat prediksi AI</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-cyan-900 flex items-center">
                        <Recycle className="w-4 h-4 mr-2 text-green-600" />
                        Cara Pengelolaan:
                      </h4>
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500 shadow-inner">
                        <p className="text-sm text-blue-800 font-medium">{result.recommendations.disposal}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-cyan-900">Contoh Sampah Sejenis:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.recommendations.examples.map((example, index) => (
                          <Badge key={index} className="bg-cyan-100 text-cyan-800 border border-cyan-200">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-cyan-100">
                      <Button
                        onClick={saveResult}
                        disabled={isSaving}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                      >
                        {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Menyimpan...
                            </>
                        ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Simpan Hasil
                            </>
                        )}
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Bagikan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-cyan-900 mb-3">AI Siap Menganalisis</h3>
                  <p className="text-cyan-700 mb-6">
                    Upload foto sampah dan dapatkan klasifikasi otomatis dengan panduan pengelolaan yang tepat
                  </p>
                  <div className="inline-flex items-center space-x-2 text-sm font-medium text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200">
                    <Camera className="w-4 h-4" />
                    <span>Powered by Computer Vision AI</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories Overview */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
              <CardHeader>
                <CardTitle className="text-lg text-cyan-900">Kategori Sampah</CardTitle>
                <CardDescription className="text-cyan-700">
                  Jenis sampah yang dapat dideteksi sistem AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(wasteCategories).map(([key, category], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-cyan-50/50 rounded-xl border border-cyan-100/50 hover:from-cyan-50/50 hover:to-blue-50/50 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-cyan-900">{category.name}</h4>
                      <p className="text-sm text-cyan-700">{category.description}</p>
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