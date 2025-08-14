// FoodRescuePage.js
"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Camera, Clock, Users, Leaf, ChefHat, Plus, Trash2, CheckCircle, Utensils, BookOpen, Heart, Bookmark, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/navigation/nav-dashboard"

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
];

export default function FoodRescuePage() {
  const [ingredients, setIngredients] = useState([""])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState(null)
  const [error, setError] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  const [myRecipes, setMyRecipes] = useState([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  
  // State untuk melacak resep mana yang sedang dibuka
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const fetchMyRecipes = async () => {
    setIsLoadingRecipes(true);
    try {
      const response = await fetch('/api/my-recipes');
      const data = await response.json();
      if (response.ok) {
        setMyRecipes(data);
      } else {
        console.error("Gagal mengambil resep:", data.error);
        setMyRecipes([]);
      }
    } catch (error) {
      console.error("Terjadi kesalahan saat fetch resep:", error);
      setMyRecipes([]);
    } finally {
      setIsLoadingRecipes(false);
    }
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  // Fungsi untuk handle klik buka/tutup resep
  const handleToggleRecipe = (recipeId) => {
    setExpandedRecipeId(prevId => (prevId === recipeId ? null : recipeId));
  };

  const addIngredient = () => setIngredients([...ingredients, ""])
  const removeIngredient = (index) => setIngredients(ingredients.filter((_, i) => i !== index))
  const updateIngredient = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  }

  const generateRecipe = async () => {
    setIsGenerating(true)
    setGeneratedRecipe(null)
    setError(null)

    const validIngredients = ingredients.filter((i) => i.trim() !== "")
    if (validIngredients.length === 0) {
      setError("Silakan masukkan setidaknya satu bahan makanan.");
      setIsGenerating(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: validIngredients }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Gagal membuat resep.')
      }
      const recipe = await response.json()
      setGeneratedRecipe(recipe)
    } catch (err) {
      console.error(err)
      setError(err.message)
      setGeneratedRecipe(sampleRecipes[Math.floor(Math.random() * sampleRecipes.length)])
    } finally {
      setIsGenerating(false)
    }
  }
  
  const handleSaveRecipe = async () => {
    if (!generatedRecipe) return;

    setIsSaving(true);
    setSaveStatus("");

    try {
      const response = await fetch('/api/save-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(generatedRecipe),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal menyimpan resep.');
      }

      setSaveStatus("Resep berhasil disimpan! ✅");
      await fetchMyRecipes(); 
    } catch (error) {
      console.error("Gagal menyimpan resep:", error.message);
      setSaveStatus(error.message || "Gagal menyimpan resep. ❌");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(""), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-cyan-200/40 to-blue-300/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-br from-teal-200/40 to-cyan-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-emerald-300/40 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Navbar />

      <header className="bg-white/80 backdrop-blur-xl border-b border-cyan-100/50 sticky top-[72px] z-40 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 via-yellow-500 to-green-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/25">
                <ChefHat className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">Food Rescue AI</h1>
                <p className="text-sm text-cyan-700/80 flex items-center"><Sparkles className="w-4 h-4 mr-1" /> Ubah bahan sisa jadi hidangan lezat dengan AI</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-lg"><Utensils className="w-3 h-3 mr-1" /> AI Chef</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}><Card className="text-center bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"><CardContent className="p-6"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><ChefHat className="w-7 h-7" /></div><div className="text-3xl font-bold mb-1">248</div><div className="text-sm opacity-90">Resep Generated</div></CardContent></Card></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}><Card className="text-center bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"><CardContent className="p-6"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><Leaf className="w-7 h-7" /></div><div className="text-3xl font-bold mb-1">85%</div><div className="text-sm opacity-90">Food Waste Reduced</div></CardContent></Card></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}><Card className="text-center bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"><CardContent className="p-6"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><Users className="w-7 h-7" /></div><div className="text-3xl font-bold mb-1">1.2K</div><div className="text-sm opacity-90">Keluarga Terbantu</div></CardContent></Card></motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}><Card className="text-center bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"><CardContent className="p-6"><div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"><Heart className="w-7 h-7" /></div><div className="text-3xl font-bold mb-1">4.8</div><div className="text-sm opacity-90">Rating Rata-rata</div></CardContent></Card></motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
              <CardHeader><CardTitle className="flex items-center space-x-2 text-cyan-900"><ChefHat className="w-5 h-5 text-orange-600" /><span>Input Bahan Makanan</span></CardTitle><CardDescription className="text-cyan-700">Masukkan bahan makanan yang tersisa di rumah Anda</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">{ingredients.map((ingredient, index) => (<motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center space-x-2"><Input placeholder="Contoh: Wortel setengah layu, Nasi sisa kemarin..." value={ingredient} onChange={(e) => updateIngredient(index, e.target.value)} className="flex-1 border-cyan-400 focus:border-cyan-600 bg-white text-cyan-900"/>{ingredients.length > 1 && (<Button variant="outline" size="sm" onClick={() => removeIngredient(index)} className="border-red-300 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>)}</motion.div>))}</div>
                {error && !isGenerating && (<motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</motion.div>)}
                <Button variant="outline" onClick={addIngredient} className="w-full border-cyan-400 text-cyan-700 hover:bg-cyan-50"><Plus className="w-4 h-4 mr-2" />Tambah Bahan</Button>
                <div className="flex space-x-2">
                  <Button onClick={generateRecipe} disabled={isGenerating || !ingredients.some((i) => i.trim())} className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700 text-white shadow-lg">{isGenerating ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Generating...</>) : (<><Sparkles className="w-4 h-4 mr-2" />Generate Resep AI</>)}</Button>
                  <Button variant="outline" className="border-cyan-400 text-cyan-700 hover:bg-cyan-50"><Camera className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-cyan-900">
                  <Bookmark className="w-5 h-5 text-green-600" />
                  <span>Resep Tersimpan Anda</span>
                </CardTitle>
                <CardDescription className="text-cyan-700">
                  Klik untuk melihat detail resep yang sudah Anda simpan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingRecipes ? (
                  <div className="text-center text-cyan-700 p-4">Memuat resep...</div>
                ) : myRecipes.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    <AnimatePresence>
                      {myRecipes.map((recipe) => (
                        <motion.div 
                          key={recipe.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-3 bg-gray-50 rounded-xl border border-gray-200/80"
                        >
                          <div 
                            className="flex justify-between items-center cursor-pointer"
                            onClick={() => handleToggleRecipe(recipe.id)}
                          >
                            <div className="flex-1 pr-4">
                              <h4 className="font-medium text-cyan-900">{recipe.title}</h4>
                              <p className="text-sm text-cyan-700 truncate">{recipe.description}</p>
                            </div>
                            <ChevronDown className={`w-5 h-5 text-cyan-600 transition-transform duration-300 ${expandedRecipeId === recipe.id ? "rotate-180" : ""}`} />
                          </div>

                          {expandedRecipeId === recipe.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="space-y-4 border-t border-gray-200 pt-4"
                            >
                              <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100"><Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" /><div className="font-medium text-blue-800">{recipe.cook_time || 'N/A'}</div></div>
                                <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100"><Users className="w-4 h-4 text-green-600 mx-auto mb-1" /><div className="font-medium text-green-800">{recipe.difficulty || 'N/A'}</div></div>
                                <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-100"><Leaf className="w-4 h-4 text-yellow-600 mx-auto mb-1" /><div className="font-medium text-yellow-800">{recipe.nutrition || 'N/A'}</div></div>
                              </div>
                              
                              {recipe.ingredients && recipe.ingredients.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-cyan-900 text-sm mb-2">Bahan:</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {recipe.ingredients.map((ing, i) => (<Badge key={i} className="bg-cyan-100 text-cyan-800 border border-cyan-200">{ing}</Badge>))}
                                  </div>
                                </div>
                              )}

                              {recipe.cara_pembuatan && recipe.cara_pembuatan.length > 0 && (
                                <div>
                                  <h5 className="font-semibold text-cyan-900 text-sm mb-2">Langkah:</h5>
                                  <div className="space-y-2">
                                    {recipe.cara_pembuatan.map((step, index) => (
                                      <div key={index} className="flex items-start space-x-2">
                                        <div className="w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{index + 1}</div>
                                        <p className="text-cyan-800 text-sm">{step}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p>Anda belum menyimpan resep apapun.</p>
                    <p className="text-xs mt-1">Simpan resep hasil AI untuk melihatnya di sini.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {generatedRecipe ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                  <CardHeader>
                    <div className="flex items-center justify-between"><CardTitle className="text-xl text-cyan-900">{generatedRecipe.title}</CardTitle><Badge className="bg-orange-100 text-orange-800 border border-orange-200"><Sparkles className="w-3 h-3 mr-1" />AI Generated</Badge></div>
                    <CardDescription className="text-cyan-700">{generatedRecipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50"><Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" /><div className="text-sm font-medium text-blue-800">{generatedRecipe.cookTime}</div></div>
                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50"><Users className="w-5 h-5 text-green-600 mx-auto mb-1" /><div className="text-sm font-medium text-green-800">{generatedRecipe.difficulty}</div></div>
                      <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200/50"><Leaf className="w-5 h-5 text-yellow-600 mx-auto mb-1" /><div className="text-sm font-medium text-yellow-800">{generatedRecipe.nutrition}</div></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-900 mb-3 flex items-center"><Utensils className="w-4 h-4 mr-2 text-orange-600" />Bahan yang Digunakan:</h4>
                      <div className="flex flex-wrap gap-2">{generatedRecipe.ingredients.map((ingredient, index) => (<Badge key={index} className="bg-cyan-100 text-cyan-800 border border-cyan-200">{ingredient}</Badge>))}</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-cyan-900 mb-3 flex items-center"><BookOpen className="w-4 h-4 mr-2 text-orange-600" />Langkah Memasak:</h4>
                      <div className="space-y-3">{generatedRecipe.steps.map((step, index) => (<div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-gray-50 to-cyan-50/50 rounded-lg border border-cyan-100/50"><div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{index + 1}</div><p className="text-cyan-800 text-sm leading-relaxed">{step}</p></div>))}</div>
                    </div>
                    <div className="flex flex-col space-y-2 pt-4 border-t border-cyan-100">
                      <div className="flex space-x-3">
                        <Button onClick={handleSaveRecipe} disabled={isSaving || !generatedRecipe} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg">{isSaving ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Menyimpan...</>) : (<><CheckCircle className="w-4 h-4 mr-2" />Simpan Resep</>)}</Button>
                        <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg"><Heart className="w-4 h-4 mr-2" />Bagikan</Button>
                      </div>
                      {saveStatus && (<p className="text-center text-sm text-gray-600 pt-2">{saveStatus}</p>)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"><ChefHat className="w-10 h-10 text-orange-600" /></div>
                  <h3 className="text-xl font-bold text-cyan-900 mb-3">Resep AI Siap Dibuat</h3>
                  <p className="text-cyan-700 mb-6">Masukkan bahan makanan yang tersisa, dan AI akan memberikan resep kreatif untuk mengurangi food waste</p>
                  <div className="inline-flex items-center space-x-2 text-sm font-medium text-orange-600 bg-orange-50 px-4 py-2 rounded-full border border-orange-200"><Sparkles className="w-4 h-4" /><span>💡 Tip: Semakin detail bahan yang dimasukkan, semakin akurat resep yang dihasilkan</span></div>
                </CardContent>
              </Card>
            )}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm border border-cyan-100/50">
              <CardHeader><CardTitle className="text-lg text-cyan-900 flex items-center"><BookOpen className="w-5 h-5 mr-2 text-orange-600" />Resep Populer</CardTitle><CardDescription className="text-cyan-700">Inspirasi dari komunitas ECONARA</CardDescription></CardHeader>
              <CardContent className="space-y-3">{sampleRecipes.map((recipe, index) => (<motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }} className="p-4 bg-gradient-to-r from-gray-50 to-cyan-50/50 rounded-xl cursor-pointer hover:from-cyan-50 hover:to-blue-50/50 transition-all duration-300 border border-cyan-100/50 hover:shadow-lg" onClick={() => setGeneratedRecipe(recipe)}><div className="flex justify-between items-start mb-2"><h4 className="font-medium text-cyan-900">{recipe.title}</h4><Badge className="bg-green-100 text-green-800 border border-green-200 text-xs"><Clock className="w-3 h-3 mr-1" />{recipe.cookTime}</Badge></div><p className="text-sm text-cyan-700 mb-3">{recipe.description}</p><div className="flex flex-wrap gap-1">{recipe.ingredients.slice(0, 3).map((ingredient, i) => (<Badge key={i} variant="outline" className="text-xs border-cyan-300 text-cyan-600">{ingredient}</Badge>))}{recipe.ingredients.length > 3 && (<Badge variant="outline" className="text-xs border-cyan-300 text-cyan-600">+{recipe.ingredients.length - 3} lagi</Badge>)}</div></motion.div>))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}