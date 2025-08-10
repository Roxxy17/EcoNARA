"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Leaf,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useDevicePerformance } from "@/hooks/use-device-performance";
import { AdaptiveBackground } from "@/components/background/adaptive-background";
import { PerformanceIndicator } from "@/components/ui/performance-indicator";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/sections/footer";
import { useTheme } from "next-themes";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Kirim email dan kami akan merespons dalam 24 jam",
    contact: "hello@econara.id",
    action: "Kirim Email",
  },
  {
    icon: Phone,
    title: "Telepon",
    description: "Hubungi tim support kami langsung",
    contact: "+62 21 1234 5678",
    action: "Telepon Sekarang",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Chat langsung via WhatsApp untuk respon cepat",
    contact: "+62 812 3456 7890",
    action: "Chat WhatsApp",
  },
  {
    icon: Headphones,
    title: "Live Chat",
    description: "Support online 24/7 untuk bantuan instan",
    contact: "Available 24/7",
    action: "Mulai Chat",
  },
];

const offices = [
  {
    city: "Jakarta",
    address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    phone: "+62 21 1234 5678",
    email: "jakarta@econara.id",
    hours: "Senin - Jumat: 09:00 - 18:00",
    type: "Kantor Pusat",
  },
  {
    city: "Bandung",
    address: "Jl. Braga No. 45, Bandung 40111",
    phone: "+62 22 8765 4321",
    email: "bandung@econara.id",
    hours: "Senin - Jumat: 09:00 - 17:00",
    type: "Kantor Regional",
  },
  {
    city: "Surabaya",
    address: "Jl. Pemuda No. 67, Surabaya 60271",
    phone: "+62 31 9876 5432",
    email: "surabaya@econara.id",
    hours: "Senin - Jumat: 09:00 - 17:00",
    type: "Kantor Regional",
  },
];

const faqs = [
  {
    question: "Bagaimana cara mendaftar di ECONARA?",
    answer:
      "Anda dapat mendaftar melalui website atau aplikasi mobile kami. Proses pendaftaran sangat mudah dan gratis untuk semua komunitas.",
  },
  {
    question: "Apakah ECONARA benar-benar gratis?",
    answer:
      "Ya, ECONARA 100% gratis untuk komunitas. Kami percaya bahwa akses ke teknologi berkelanjutan harus tersedia untuk semua.",
  },
  {
    question: "Bagaimana cara kerja AI Food Rescue?",
    answer:
      "AI kami menganalisis bahan makanan yang Anda input dan memberikan rekomendasi resep yang optimal, hemat energi, dan bergizi seimbang.",
  },
  {
    question: "Apakah data komunitas kami aman?",
    answer:
      "Keamanan data adalah prioritas utama kami. Semua data dienkripsi dan disimpan sesuai standar keamanan internasional.",
  },
];

export default function ContactPage() {
  const { performanceLevel, capabilities, isLoading } = useDevicePerformance();
  const { theme = "default" } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Semua hooks di atas, baru pengecekan mounted di bawah
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  if (!mounted) return null;

  const animationSettings = {
    duration:
      performanceLevel === "high"
        ? 0.6
        : performanceLevel === "medium"
        ? 0.8
        : 1.0,
    ease: performanceLevel === "high" ? [0.25, 0.1, 0.25, 1] : "easeOut",
  };

  // Get theme-based colors
  const getThemeColors = () => {
    switch (theme) {
      case "aurora":
        return {
          gradient: "from-green-400 via-blue-400 to-emerald-400",
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
          buttonGradient:
            "from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600",
          cardGradients: [
            "from-green-400 to-blue-600",
            "from-blue-400 to-emerald-600",
            "from-emerald-400 to-teal-600",
            "from-teal-400 to-cyan-600",
          ],
        };
      case "night":
        return {
          gradient: "from-blue-600 via-indigo-400 to-cyan-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient:
            "from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600",
          cardGradients: [
            "from-blue-600 to-indigo-600",
            "from-indigo-400 to-cyan-600",
            "from-cyan-400 to-blue-600",
            "from-blue-500 to-indigo-500",
          ],
        };
      case "geometric":
        return {
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          buttonGradient:
            "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
          cardGradients: [
            "from-red-400 to-orange-600",
            "from-orange-400 to-yellow-600",
            "from-yellow-400 to-red-600",
            "from-pink-400 to-red-600",
          ],
        };
      case "nebula":
        return {
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          buttonGradient:
            "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
          cardGradients: [
            "from-purple-400 to-pink-600",
            "from-pink-400 to-violet-600",
            "from-violet-400 to-purple-600",
            "from-indigo-400 to-purple-600",
          ],
        };
      default:
        return {
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient:
            "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
          cardGradients: [
            "from-blue-400 to-cyan-600",
            "from-cyan-400 to-teal-600",
            "from-teal-400 to-blue-600",
            "from-indigo-400 to-blue-600",
          ],
        };
    }
  };

  const themeColors = getThemeColors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="contact-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen relative overflow-hidden"
      >
        <AdaptiveBackground
          performanceLevel={performanceLevel}
          variant={theme as "default" | "aurora" | "geometric" | "nebula" | "night"}
        />

        <PerformanceIndicator
          performanceLevel={performanceLevel}
          capabilities={capabilities}
          isLoading={isLoading}
        />

        {/* ThemeSelector hanya di halaman ini */}
        <ThemeSelector />

        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Navbar
            performanceLevel={performanceLevel}
            animationSettings={animationSettings}
            theme={theme as "default" | "aurora" | "geometric" | "nebula" | "night"}
          />

          {/* Hero Section */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={animationSettings}
              >
                <Badge
                  className={`${themeColors.badgeBg} ${themeColors.badgeText} px-4 py-2 rounded-full mb-6 ${themeColors.badgeBorder} backdrop-blur-sm`}
                >
                  📞 Hubungi Kami
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
                  Mari
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Terhubung
                  </span>
                </h1>
                <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  Kami siap membantu Anda memulai perjalanan menuju komunitas
                  yang lebih berkelanjutan. Tim ahli kami tersedia untuk
                  menjawab pertanyaan dan memberikan dukungan yang Anda
                  butuhkan.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={animationSettings}
                className="text-center mb-16"
              >
                <Badge
                  className={`${themeColors.badgeBg} ${themeColors.badgeText} px-4 py-2 rounded-full mb-6 ${themeColors.badgeBorder} backdrop-blur-sm`}
                >
                  💬 Cara Menghubungi
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                  Pilih Cara
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Terbaik untuk Anda
                  </span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: animationSettings.duration,
                      delay: index * 0.1,
                    }}
                    whileHover={performanceLevel !== "low" ? { y: -5 } : {}}
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 h-full">
                      <CardContent className="p-8 text-center">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${themeColors.cardGradients[index]} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                        >
                          <method.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">
                          {method.title}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {method.description}
                        </p>
                        <div
                          className={`${themeColors.badgeText} font-semibold mb-6`}
                        >
                          {method.contact}
                        </div>
                        <Button
                          className={`w-full bg-gradient-to-r ${themeColors.cardGradients[index]} hover:shadow-lg transition-all duration-300 text-white rounded-xl border-0`}
                        >
                          {method.action}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form & Offices */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={animationSettings}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-2xl font-black text-white flex items-center space-x-3">
                        <Send
                          className={`w-6 h-6 ${themeColors.badgeText}`}
                        />
                        <span>Kirim Pesan</span>
                      </CardTitle>
                      <p className="text-slate-300">
                        Isi form di bawah ini dan tim kami akan menghubungi
                        Anda dalam 24 jam.
                      </p>
                    </CardHeader>
                    <CardContent>
                      {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Nama Lengkap
                              </label>
                              <Input
                                placeholder="Masukkan nama lengkap"
                                value={formData.name}
                                onChange={(e) =>
                                  handleInputChange("name", e.target.value)
                                }
                                required
                                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 backdrop-blur-sm"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Email
                              </label>
                              <Input
                                type="email"
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                required
                                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 backdrop-blur-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Nomor Telepon
                              </label>
                              <Input
                                placeholder="+62 812 3456 7890"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 backdrop-blur-sm"
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-slate-300 mb-2 block">
                                Kategori
                              </label>
                              <Select
                                value={formData.category}
                                onValueChange={(value) =>
                                  handleInputChange("category", value)
                                }
                              >
                                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white backdrop-blur-sm">
                                  <SelectValue placeholder="Pilih kategori" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-600 text-white">
                                  <SelectItem value="general">
                                    Pertanyaan Umum
                                  </SelectItem>
                                  <SelectItem value="technical">
                                    Dukungan Teknis
                                  </SelectItem>
                                  <SelectItem value="partnership">
                                    Kemitraan
                                  </SelectItem>
                                  <SelectItem value="media">
                                    Media & Press
                                  </SelectItem>
                                  <SelectItem value="feedback">
                                    Feedback
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                              Subjek
                            </label>
                            <Input
                              placeholder="Subjek pesan Anda"
                              value={formData.subject}
                              onChange={(e) =>
                                handleInputChange("subject", e.target.value)
                              }
                              required
                              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 backdrop-blur-sm"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-slate-300 mb-2 block">
                              Pesan
                            </label>
                            <Textarea
                              placeholder="Tulis pesan Anda di sini..."
                              className="h-32 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 backdrop-blur-sm"
                              value={formData.message}
                              onChange={(e) =>
                                handleInputChange("message", e.target.value)
                              }
                              required
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r ${themeColors.buttonGradient} text-white py-3 rounded-xl font-semibold border-0 shadow-2xl`}
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Mengirim...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Kirim Pesan
                              </>
                            )}
                          </Button>
                        </form>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-4">
                            Pesan Terkirim!
                          </h3>
                          <p className="text-slate-300 mb-6">
                            Terima kasih telah menghubungi kami. Tim ECONARA
                            akan merespons dalam 24 jam.
                          </p>
                          <Button
                            onClick={() => setIsSubmitted(false)}
                            variant="outline"
                            className={`border-slate-600 ${themeColors.badgeText} hover:bg-slate-800/50 bg-slate-900/20 backdrop-blur-sm`}
                          >
                            Kirim Pesan Lain
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Offices */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={animationSettings}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-black text-white mb-6">
                      Kantor Kami
                    </h2>
                    <p className="text-slate-300 leading-relaxed">
                      Kunjungi kantor kami di berbagai kota untuk bertemu
                      langsung dengan tim ECONARA.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {offices.map((office, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: animationSettings.duration,
                          delay: index * 0.1,
                        }}
                      >
                        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-white">
                                  {office.city}
                                </h3>
                                <Badge
                                  className={`${themeColors.badgeBg} ${themeColors.badgeText} mt-1 ${themeColors.badgeBorder}`}
                                >
                                  {office.type}
                                </Badge>
                              </div>
                              <MapPin
                                className={`w-5 h-5 ${themeColors.badgeText}`}
                              />
                            </div>

                            <div className="space-y-3 text-sm text-slate-300">
                              <div className="flex items-start space-x-3">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                                <span>{office.address}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span>{office.phone}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-slate-400" />
                                <span>{office.email}</span>
                              </div>
                              <div className="flex items-center space-x-3">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>{office.hours}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-20 relative z-10">
            <div className="max-w-4xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={animationSettings}
                className="text-center mb-16"
              >
                <Badge
                  className={`${themeColors.badgeBg} ${themeColors.badgeText} px-4 py-2 rounded-full mb-6 ${themeColors.badgeBorder} backdrop-blur-sm`}
                >
                  ❓ FAQ
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                  Pertanyaan
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    yang Sering Diajukan
                  </span>
                </h2>
              </motion.div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: animationSettings.duration,
                      delay: index * 0.1,
                    }}
                  >
                    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                      <CardContent className="p-8">
                        <h3 className="text-lg font-bold text-white mb-4">
                          {faq.question}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <p className="text-slate-300 mb-6">
                  Tidak menemukan jawaban yang Anda cari?
                </p>
                <Button
                  className={`bg-gradient-to-r ${themeColors.buttonGradient} text-white px-8 py-3 rounded-xl font-semibold border-0 shadow-2xl`}
                >
                  Hubungi Tim Support
                </Button>
              </div>
            </div>
          </section>
        </motion.div>

        {/* Tambahkan Footer di bawah */}
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}
