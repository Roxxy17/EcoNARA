"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Camera,
  Upload,
  Trash2,
  Recycle,
  Leaf,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Info,
  RotateCcw,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  Award,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { Navbar } from "@/components/navigation/nav-dashboard"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

interface ClassificationResult {
  category: string
  confidence: number
  recommendations: string[]
  environmental_impact: string
  disposal_method: string
  recycling_tips?: string[]
}

const trashCategories = {
  organic: {
    name: "Sampah Organik",
    icon: Leaf,
    color: {
      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      hoverBackground: 'linear-gradient(135deg, #16a34a, #15803d)',
      light: 'rgba(34, 197, 94, 0.1)',
      border: 'rgba(34, 197, 94, 0.3)',
      text: '#166534'
    },
    description: "Dapat dikompos dan didaur ulang secara alami"
  },
  plastic: {
    name: "Sampah Plastik",
    icon: Recycle,
    color: {
      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      hoverBackground: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
      light: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
      text: '#1e40af'
    },
    description: "Perlu didaur ulang dengan cara khusus"
  },
  paper: {
    name: "Sampah Kertas",
    icon: BookOpen,
    color: {
      background: 'linear-gradient(135deg, #eab308, #ca8a04)',
      hoverBackground: 'linear-gradient(135deg, #ca8a04, #a16207)',
      light: 'rgba(234, 179, 8, 0.1)',
      border: 'rgba(234, 179, 8, 0.3)',
      text: '#a16207'
    },
    description: "Dapat didaur ulang menjadi produk kertas baru"
  },
  metal: {
    name: "Sampah Logam",
    icon: Award,
    color: {
      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
      hoverBackground: 'linear-gradient(135deg, #4b5563, #374151)',
      light: 'rgba(107, 114, 128, 0.1)',
      border: 'rgba(107, 114, 128, 0.3)',
      text: '#374151'
    },
    description: "Memiliki nilai ekonomi tinggi untuk didaur ulang"
  },
  glass: {
    name: "Sampah Kaca",
    icon: Sparkles,
    color: {
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      hoverBackground: 'linear-gradient(135deg, #0891b2, #0e7490)',
      light: 'rgba(6, 182, 212, 0.1)',
      border: 'rgba(6, 182, 212, 0.3)',
      text: '#0e7490'
    },
    description: "Dapat didaur ulang berkali-kali tanpa kehilangan kualitas"
  },
  hazardous: {
    name: "Sampah B3",
    icon: AlertTriangle,
    color: {
      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
      hoverBackground: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      light: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.3)',
      text: '#dc2626'
    },
    description: "Memerlukan penanganan khusus dan hati-hati"
  }
}

export default function TrashClassifierPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  const [isClassifying, setIsClassifying] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setClassificationResult(null)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  })

  const handleClassify = async () => {
    if (!selectedImage) return

    setIsClassifying(true)
    
    // Simulasi AI classification (replace dengan actual API call)
    setTimeout(() => {
      const mockResults: ClassificationResult[] = [
        {
          category: "plastic",
          confidence: 0.92,
          recommendations: [
            "Bersihkan dari sisa makanan sebelum didaur ulang",
            "Pisahkan berdasarkan jenis plastik (PET, HDPE, dll)",
            "Bawa ke bank sampah atau tempat pengumpulan plastik"
          ],
          environmental_impact: "Plastik membutuhkan 450-1000 tahun untuk terurai secara alami",
          disposal_method: "Daur ulang di fasilitas khusus",
          recycling_tips: [
            "Cek kode daur ulang di bagian bawah kemasan",
            "Hindari membakar plastik karena menghasilkan racun",
            "Gunakan kembali untuk keperluan lain sebelum dibuang"
          ]
        },
        {
          category: "organic",
          confidence: 0.88,
          recommendations: [
            "Kompos di rumah untuk pupuk alami",
            "Pisahkan dari sampah non-organik",
            "Gunakan untuk biogas jika memungkinkan"
          ],
          environmental_impact: "Dapat terurai dalam 2-4 minggu dan menjadi pupuk alami",
          disposal_method: "Kompos atau pengolahan biogas",
          recycling_tips: [
            "Campurkan dengan daun kering untuk kompos seimbang",
            "Hindari daging dan produk susu dalam kompos rumah",
            "Balik kompos secara teratur untuk aerasi"
          ]
        }
      ]
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setClassificationResult(randomResult)
      setIsClassifying(false)

      toast({
        title: "Klasifikasi Berhasil!",
        description: `Sampah teridentifikasi sebagai ${trashCategories[randomResult.category as keyof typeof trashCategories].name}`,
        variant: "default",
      })
    }, 2000)
  }

  const resetClassification = () => {
    setSelectedImage(null)
    setClassificationResult(null)
  }

  const getCategoryData = (category: string) => {
    return trashCategories[category as keyof typeof trashCategories] || trashCategories.plastic
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 25%, #f0fdfa 75%, #ecfeff 100%)'
      }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(165, 243, 252, 0.6), rgba(59, 130, 246, 0.4))'
          }}
        />
        <div 
          className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.4), rgba(6, 182, 212, 0.6))',
            animationDelay: '1s'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(34, 197, 94, 0.4))',
            animationDelay: '2s'
          }}
        />
      </div>

      <Navbar />

      {/* Header */}
      <header 
        className="backdrop-blur-xl border-b sticky top-[72px] z-40 shadow-lg"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(6, 182, 212, 0.2)'
        }}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #ef4444, #f97316, #eab308)',
                  boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.25), 0 10px 10px -5px rgba(239, 68, 68, 0.04)'
                }}
              >
                <Trash2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 
                  className="text-2xl font-bold"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #ef4444, #f97316, #eab308)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  AI Trash Classifier
                </h1>
                <p className="text-sm flex items-center" style={{ color: '#0e7490' }}>
                  <Sparkles className="w-4 h-4 mr-1" />
                  Identifikasi jenis sampah dengan teknologi AI untuk pengelolaan yang tepat
                </p>
              </div>
            </div>
            <Badge 
              className="text-white shadow-lg border-0"
              style={{
                background: 'linear-gradient(90deg, #22c55e, #16a34a)'
              }}
            >
              <Recycle className="w-3 h-3 mr-1" />
              Smart Classification
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <Card 
              className="border-0 shadow-xl backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(6, 182, 212, 0.2)'
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" style={{ color: '#164e63' }}>
                  <Camera className="w-6 h-6" style={{ color: '#f97316' }} />
                  <span>Upload Gambar Sampah</span>
                </CardTitle>
                <CardDescription style={{ color: '#0e7490' }}>
                  Ambil foto atau upload gambar sampah untuk dianalisis menggunakan AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedImage ? (
                  <div
                    {...getRootProps()}
                    className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 hover:shadow-lg"
                    style={{
                      borderColor: isDragActive ? '#f97316' : 'rgba(6, 182, 212, 0.3)',
                      backgroundColor: isDragActive ? 'rgba(249, 115, 22, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                      transform: isDragActive ? 'scale(1.02)' : 'scale(1)'
                    }}
                  >
                    <input {...getInputProps()} />
                    <motion.div
                      animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Upload className="w-16 h-16 mx-auto mb-4" style={{ color: '#f97316' }} />
                      <h3 className="text-xl font-semibold mb-2" style={{ color: '#164e63' }}>
                        {isDragActive ? "Drop gambar di sini" : "Upload Gambar Sampah"}
                      </h3>
                      <p className="mb-4" style={{ color: '#0e7490' }}>
                        Drag & drop gambar atau klik untuk memilih file
                      </p>
                      <Badge 
                        className="text-white border-0"
                        style={{
                          background: 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                        }}
                      >
                        JPG, PNG, WebP hingga 10MB
                      </Badge>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div 
                      className="relative rounded-xl overflow-hidden shadow-lg"
                      style={{
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(6, 182, 212, 0.3)'
                      }}
                    >
                      <Image
                        src={selectedImage}
                        alt="Uploaded trash"
                        width={500}
                        height={300}
                        className="w-full h-64 object-cover"
                      />
                      <div 
                        className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        }}
                      >
                        <Button
                          onClick={resetClassification}
                          className="text-white border-0"
                          style={{
                            background: 'linear-gradient(90deg, #ef4444, #dc2626)'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(90deg, #dc2626, #b91c1c)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Ganti Gambar
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={handleClassify}
                        disabled={isClassifying}
                        className="flex-1 text-white rounded-xl shadow-lg border-0"
                        style={{
                          background: isClassifying ? '#9ca3af' : 'linear-gradient(90deg, #22c55e, #16a34a)'
                        }}
                        onMouseEnter={(e) => {
                          if (!isClassifying) {
                            e.currentTarget.style.background = 'linear-gradient(90deg, #16a34a, #15803d)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isClassifying) {
                            e.currentTarget.style.background = 'linear-gradient(90deg, #22c55e, #16a34a)';
                          }
                        }}
                      >
                        {isClassifying ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-5 h-5 mr-2" />
                            </motion.div>
                            Menganalisis...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5 mr-2" />
                            Klasifikasi Sampah
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={resetClassification}
                        variant="outline"
                        className="rounded-xl"
                        style={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <RotateCcw className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card 
              className="border-0 shadow-xl backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'rgba(6, 182, 212, 0.2)'
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2" style={{ color: '#164e63' }}>
                  <Lightbulb className="w-6 h-6" style={{ color: '#eab308' }} />
                  <span>Hasil Klasifikasi</span>
                </CardTitle>
                <CardDescription style={{ color: '#0e7490' }}>
                  Informasi detail tentang jenis sampah dan cara pengelolaannya
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!classificationResult ? (
                  <div 
                    className="text-center py-12 rounded-xl border-2 border-dashed"
                    style={{
                      borderColor: 'rgba(107, 114, 128, 0.3)',
                      backgroundColor: 'rgba(107, 114, 128, 0.05)'
                    }}
                  >
                    <Info className="w-16 h-16 mx-auto mb-4" style={{ color: '#9ca3af' }} />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: '#6b7280' }}>
                      Upload gambar untuk memulai
                    </h3>
                    <p style={{ color: '#9ca3af' }}>
                      Hasil klasifikasi AI akan ditampilkan di sini
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {(() => {
                      const categoryData = getCategoryData(classificationResult.category)
                      return (
                        <>
                          {/* Category Header */}
                          <div 
                            className="flex items-center justify-between p-4 rounded-xl border"
                            style={{
                              backgroundColor: categoryData.color.light,
                              borderColor: categoryData.color.border
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-12 h-12 rounded-full flex items-center justify-center"
                                style={{
                                  background: categoryData.color.background
                                }}
                              >
                                <categoryData.icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg" style={{ color: categoryData.color.text }}>
                                  {categoryData.name}
                                </h3>
                                <p className="text-sm" style={{ color: categoryData.color.text, opacity: 0.8 }}>
                                  {categoryData.description}
                                </p>
                              </div>
                            </div>
                            <Badge 
                              className="text-white border-0"
                              style={{
                                background: categoryData.color.background
                              }}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {Math.round(classificationResult.confidence * 100)}% yakin
                            </Badge>
                          </div>

                          {/* Confidence Progress */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium" style={{ color: '#164e63' }}>
                                Tingkat Kepercayaan AI
                              </span>
                              <span className="text-sm" style={{ color: categoryData.color.text }}>
                                {Math.round(classificationResult.confidence * 100)}%
                              </span>
                            </div>
                            <div 
                              className="w-full rounded-full h-3 overflow-hidden"
                              style={{
                                backgroundColor: 'rgba(107, 114, 128, 0.2)'
                              }}
                            >
                              <div 
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${classificationResult.confidence * 100}%`,
                                  background: categoryData.color.background
                                }}
                              />
                            </div>
                          </div>

                          {/* Environmental Impact */}
                          <Alert 
                            style={{
                              backgroundColor: 'rgba(59, 130, 246, 0.1)',
                              borderColor: 'rgba(59, 130, 246, 0.3)'
                            }}
                          >
                            <Info className="h-4 w-4" style={{ color: '#3b82f6' }} />
                            <AlertDescription style={{ color: '#1e40af' }}>
                              <strong>Dampak Lingkungan:</strong> {classificationResult.environmental_impact}
                            </AlertDescription>
                          </Alert>

                          {/* Disposal Method */}
                          <div 
                            className="p-4 rounded-xl border"
                            style={{
                              backgroundColor: 'rgba(34, 197, 94, 0.1)',
                              borderColor: 'rgba(34, 197, 94, 0.3)'
                            }}
                          >
                            <h4 className="font-semibold flex items-center mb-2" style={{ color: '#166534' }}>
                              <Recycle className="w-4 h-4 mr-2" />
                              Cara Pembuangan
                            </h4>
                            <p style={{ color: '#166534' }}>{classificationResult.disposal_method}</p>
                          </div>

                          {/* Recommendations */}
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#164e63' }}>
                              <Lightbulb className="w-4 h-4 mr-2" style={{ color: '#eab308' }} />
                              Rekomendasi Pengelolaan
                            </h4>
                            <ul className="space-y-2">
                              {classificationResult.recommendations.map((rec, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start space-x-3 p-3 rounded-lg border"
                                  style={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    borderColor: 'rgba(6, 182, 212, 0.2)'
                                  }}
                                >
                                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#22c55e' }} />
                                  <span style={{ color: '#164e63' }}>{rec}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          {/* Recycling Tips */}
                          {classificationResult.recycling_tips && (
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center" style={{ color: '#164e63' }}>
                                <Sparkles className="w-4 h-4 mr-2" style={{ color: '#a855f7' }} />
                                Tips Daur Ulang
                              </h4>
                              <ul className="space-y-2">
                                {classificationResult.recycling_tips.map((tip, index) => (
                                  <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.3 }}
                                    className="flex items-start space-x-3 p-3 rounded-lg border"
                                    style={{
                                      backgroundColor: 'rgba(168, 85, 247, 0.1)',
                                      borderColor: 'rgba(168, 85, 247, 0.2)'
                                    }}
                                  >
                                    <Recycle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#a855f7' }} />
                                    <span style={{ color: '#164e63' }}>{tip}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex space-x-3 pt-4">
                            <Button 
                              className="flex-1 text-white rounded-xl border-0"
                              style={{
                                background: 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #1d4ed8, #0891b2)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'linear-gradient(90deg, #3b82f6, #06b6d4)';
                              }}
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Bagikan Hasil
                            </Button>
                            <Button 
                              variant="outline" 
                              className="rounded-xl"
                              style={{
                                borderColor: '#22c55e',
                                color: '#22c55e',
                                backgroundColor: 'transparent'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Simpan
                            </Button>
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Guide */}
          <Card 
            className="mt-8 border-0 shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'rgba(6, 182, 212, 0.2)'
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2" style={{ color: '#164e63' }}>
                <BookOpen className="w-6 h-6" style={{ color: '#3b82f6' }} />
                <span>Panduan Kategori Sampah</span>
              </CardTitle>
              <CardDescription style={{ color: '#0e7490' }}>
                Pelajari berbagai jenis sampah dan cara pengelolaannya yang benar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(trashCategories).map(([key, category], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-xl border transition-all duration-300 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: category.color.light,
                      borderColor: category.color.border
                    }}
                    whileHover={{ scale: 1.02 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background: category.color.background
                        }}
                      >
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold" style={{ color: category.color.text }}>
                        {category.name}
                      </h3>
                    </div>
                    <p className="text-sm" style={{ color: category.color.text, opacity: 0.8 }}>
                      {category.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}