"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Camera, Clock, Users, Leaf, ChefHat, ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

const sampleRecipes = [
  {
    title: "Tumis Sayur Campur",
    ingredients: ["Wortel sisa", "Kubis layu", "Bawang bombay"],
    cookTime: "15 menit",
    difficulty: "Mudah",
    nutrition: "Tinggi Serat",
    description: "Resep sederhana untuk mengolah sayuran sisa menjadi hidangan lezat dan bergizi.",
    steps: [
      "Cuci bersih semua sayuran",
      "Potong sayuran sesuai selera",
      "Tumis bawang bombay hingga harum",
      "Masukkan sayuran keras terlebih dahulu",
      "Tambahkan bumbu dan sayuran lunak",
      "Masak hingga matang dan sajikan",
    ],
  },
  {
    title: "Smoothie Buah Rescue",
    ingredients: ["Pisang matang", "Apel sedikit layu", "Yogurt"],
    cookTime: "5 menit",
    difficulty: "Sangat Mudah",
    nutrition: "Tinggi Vitamin",
    description: "Manfaatkan buah yang sudah matang untuk smoothie segar dan sehat.",
    steps: [
      "Kupas dan potong buah-buahan",
      "Masukkan semua bahan ke blender",
      "Blend hingga halus",
      "Tambahkan es jika diinginkan",
      "Sajikan segera",
    ],
  },
]

export default function FoodRescuePage() {
  const [ingredients, setIngredients] = useState([""])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState(null)

  const addIngredient = () => {
    setIngredients([...ingredients, ""])
  }

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const generateRecipe = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setGeneratedRecipe(sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)])
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Food Rescue AI</h1>
                <p className="text-sm text-gray-600">Ubah bahan sisa jadi hidangan lezat</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ChefHat className="w-5 h-5 text-blue-500" />
                  <span>Input Bahan Makanan</span>
                </CardTitle>
                <CardDescription>Masukkan bahan makanan yang tersisa di rumah Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        placeholder="Contoh: Wortel setengah layu, Nasi sisa kemarin..."
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        className="flex-1"
                      />
                      {ingredients.length > 1 && (
                        <Button variant="outline" size="sm" onClick={() => removeIngredient(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <Button variant="outline" onClick={addIngredient} className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Bahan
                </Button>

                <div className="flex space-x-2">
                  <Button
                    onClick={generateRecipe}
                    disabled={isGenerating || !ingredients.some((i) => i.trim())}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Resep AI
                      </>
                    )}
                  </Button>
                  <Button variant="outline">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <Leaf className="w-5 h-5" />
                  <span>Tips Food Rescue</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Sayuran layu masih bisa diolah menjadi sup atau tumisan</p>
                  <p>• Buah terlalu matang cocok untuk smoothie atau cake</p>
                  <p>• Nasi sisa bisa dijadikan nasi goreng atau bubur</p>
                  <p>• Roti keras bisa dibuat breadcrumb atau french toast</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Result Section */}
          <div className="space-y-6">
            {generatedRecipe ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-gray-800">{generatedRecipe.title}</CardTitle>
                      <Badge className="bg-green-100 text-green-800">AI Generated</Badge>
                    </div>
                    <CardDescription>{generatedRecipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-blue-800">{generatedRecipe.cookTime}</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-green-800">{generatedRecipe.difficulty}</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <Leaf className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                        <div className="text-sm font-medium text-yellow-800">{generatedRecipe.nutrition}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Bahan yang Digunakan:</h4>
                      <div className="flex flex-wrap gap-2">
                        {generatedRecipe.ingredients.map((ingredient, index) => (
                          <Badge key={index} variant="secondary">
                            {ingredient}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Langkah Memasak:</h4>
                      <div className="space-y-2">
                        {generatedRecipe.steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-gray-700 text-sm">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1 bg-transparent" variant="outline">
                        Simpan Resep
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
                    <ChefHat className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Resep AI Siap Dibuat</h3>
                  <p className="text-gray-600 mb-4">
                    Masukkan bahan makanan yang tersisa, dan AI akan memberikan resep kreatif untuk mengurangi food
                    waste
                  </p>
                  <div className="text-sm text-gray-500">
                    💡 Tip: Semakin detail bahan yang dimasukkan, semakin akurat resep yang dihasilkan
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sample Recipes */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Resep Populer</CardTitle>
                <CardDescription>Inspirasi dari komunitas ECONARA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {sampleRecipes.map((recipe, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setGeneratedRecipe(recipe)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-800">{recipe.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {recipe.cookTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
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
