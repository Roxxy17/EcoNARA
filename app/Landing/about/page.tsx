"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Eye, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useDevicePerformance } from "@/hooks/use-device-performance";
import { AdaptiveBackground } from "@/components/background/adaptive-background";
import { PerformanceIndicator } from "@/components/ui/performance-indicator";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/sections/footer";
import { useTheme } from "next-themes";

const values = [
  {
    icon: "🌱",
    title: "Keberlanjutan",
    description:
      "Membangun solusi yang ramah lingkungan dan berkelanjutan untuk generasi mendatang.",
  },
  {
    icon: "🤝",
    title: "Kolaborasi",
    description:
      "Mengutamakan kerjasama dan gotong royong dalam setiap aspek pengembangan komunitas.",
  },
  {
    icon: "💡",
    title: "Inovasi",
    description:
      "Menggunakan teknologi terdepan untuk menciptakan solusi yang efektif dan mudah digunakan.",
  },
  {
    icon: "🎯",
    title: "Dampak Nyata",
    description:
      "Fokus pada hasil yang terukur dan memberikan manfaat langsung bagi komunitas.",
  },
];

const team = [
  {
    name: "Dr. Sari Wijaya",
    role: "CEO & Co-Founder",
    bio: "Ahli keberlanjutan dengan 15+ tahun pengalaman dalam pengembangan komunitas berkelanjutan.",
    avatar: "👩‍💼",
    expertise: ["Sustainability", "Community Development", "Policy Making"],
  },
  {
    name: "Budi Santoso",
    role: "CTO & Co-Founder",
    bio: "Engineer berpengalaman dalam AI dan machine learning untuk aplikasi sosial dan lingkungan.",
    avatar: "👨‍💻",
    expertise: ["AI/ML", "Software Architecture", "Data Science"],
  },
  {
    name: "Maya Putri",
    role: "Head of Community",
    bio: "Spesialis engagement komunitas dengan track record membangun jaringan komunitas di 100+ desa.",
    avatar: "👩‍🌾",
    expertise: ["Community Building", "Rural Development", "Social Impact"],
  },
  {
    name: "Andi Rahman",
    role: "Head of Product",
    bio: "Product manager dengan fokus pada user experience dan accessibility untuk komunitas Indonesia.",
    avatar: "👨‍🎨",
    expertise: ["Product Strategy", "UX Design", "Accessibility"],
  },
];

const milestones = [
  {
    year: "2022",
    title: "Ide Awal",
    description:
      "ECONARA dimulai dari riset tentang food waste di komunitas urban Jakarta.",
    icon: "💡",
  },
  {
    year: "2023",
    title: "Pilot Program",
    description:
      "Meluncurkan program pilot di 5 RT di Jakarta dengan 200+ keluarga peserta.",
    icon: "🚀",
  },
  {
    year: "2024",
    title: "Ekspansi Nasional",
    description:
      "Berkembang ke 340+ desa di seluruh Indonesia dengan 156K+ keluarga terbantu.",
    icon: "🌍",
  },
  {
    year: "2025",
    title: "Visi Masa Depan",
    description:
      "Target mencapai 1M+ keluarga dan menjadi platform keberlanjutan terbesar di Asia Tenggara.",
    icon: "🎯",
  },
];

export default function AboutPage() {
  const { performanceLevel, capabilities, isLoading } = useDevicePerformance();
  const { theme = "default" } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
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
        };
      case "night":
        return {
          gradient: "from-blue-600 via-indigo-400 to-cyan-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient:
            "from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600",
        };
      case "geometric":
        return {
          gradient: "from-red-400 via-orange-400 to-yellow-400",
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
          buttonGradient:
            "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
        };
      case "nebula":
        return {
          gradient: "from-purple-400 via-pink-400 to-violet-400",
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
          buttonGradient:
            "from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
        };
      default:
        return {
          gradient: "from-blue-400 via-cyan-400 to-teal-400",
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
          buttonGradient:
            "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
        };
    }
  };

  const themeColors = getThemeColors();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="about-page"
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
                  🏢 Tentang Kami
                </Badge>
                <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
                  Membangun
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Masa Depan
                  </span>
                  <span className="block">Berkelanjutan</span>
                </h1>
                <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  ECONARA lahir dari visi sederhana: bagaimana jika teknologi
                  dapat membantu setiap komunitas di Indonesia membangun
                  ekosistem yang berkelanjutan, mengurangi waste, dan
                  meningkatkan kesejahteraan bersama?
                </p>
              </motion.div>
            </div>
          </section>

          {/* Mission & Vision */}
          <section className="py-20 relative z-10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={animationSettings}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-white overflow-hidden h-full">
                    <CardContent className="p-12">
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black">Misi Kami</h2>
                      </div>
                      <p className="text-xl leading-relaxed text-slate-300">
                        Memberdayakan komunitas Indonesia dengan teknologi AI
                        untuk menciptakan ekosistem berkelanjutan yang
                        mengurangi food waste, mengoptimalkan distribusi
                        sumber daya, dan membangun ekonomi sirkular yang
                        inklusif dan berdampak positif.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={animationSettings}
                >
                  <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50 text-white overflow-hidden h-full">
                    <CardContent className="p-12">
                      <div className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 bg-slate-800/60 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                          <Eye className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-black">Visi Kami</h2>
                      </div>
                      <p className="text-xl leading-relaxed text-slate-300">
                        Menjadi platform keberlanjutan komunitas terdepan di
                        Asia Tenggara yang menghubungkan jutaan keluarga dalam
                        jaringan ekonomi sirkular, menciptakan Indonesia yang
                        zero waste dan food secure pada tahun 2030.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Values */}
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
                  💎 Nilai-Nilai Kami
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                  Prinsip yang
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Memandu Kami
                  </span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
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
                        <div className="text-4xl mb-6">{value.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-4">
                          {value.title}
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                          {value.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Timeline */}
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
                  📅 Perjalanan Kami
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                  Milestone
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Penting
                  </span>
                </h2>
              </motion.div>

              <div className="relative">
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b ${themeColors.gradient
                    .replace("from-", "from-")
                    .replace(" via-", " to-")} rounded-full`}
                ></div>

                <div className="space-y-16">
                  {milestones.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: animationSettings.duration,
                        delay: index * 0.1,
                      }}
                      className={`flex items-center ${
                        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`w-1/2 ${
                          index % 2 === 0
                            ? "pr-8 text-right"
                            : "pl-8 text-left"
                        }`}
                      >
                        <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
                          <CardContent className="p-8">
                            <div className="text-3xl mb-4">
                              {milestone.icon}
                            </div>
                            <div
                              className={`text-2xl font-bold ${themeColors.badgeText} mb-2`}
                            >
                              {milestone.year}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">
                              {milestone.title}
                            </h3>
                            <p className="text-slate-300 leading-relaxed">
                              {milestone.description}
                            </p>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="relative z-10">
                        <div
                          className={`w-6 h-6 bg-gradient-to-r ${themeColors.gradient
                            .replace("from-", "from-")
                            .replace(
                              " via-",
                              " to-"
                            )} rounded-full border-4 border-slate-800/50 shadow-2xl`}
                        ></div>
                      </div>

                      <div className="w-1/2"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Team */}
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
                  👥 Tim Kami
                </Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                  Orang-Orang
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Di Balik ECONARA
                  </span>
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
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
                          className={`w-20 h-20 bg-gradient-to-r ${themeColors.gradient
                            .replace("from-", "from-")
                            .replace(
                              " via-",
                              " to-"
                            )} rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-2xl`}
                        >
                          {member.avatar}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {member.name}
                        </h3>
                        <div
                          className={`${themeColors.badgeText} font-semibold mb-4`}
                        >
                          {member.role}
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">
                          {member.bio}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {member.expertise.map((skill, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs border-slate-600 text-slate-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 bg-slate-900/30 backdrop-blur-sm relative z-10">
            <div className="relative max-w-7xl mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={animationSettings}
                className="text-white"
              >
                <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                  Bergabunglah dengan
                  <span
                    className={`block bg-gradient-to-r ${themeColors.gradient} bg-clip-text text-transparent`}
                  >
                    Misi Kami
                  </span>
                </h2>
                <p className="text-xl mb-12 text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  Bersama-sama kita dapat membangun Indonesia yang lebih
                  berkelanjutan. Mulai perjalanan Anda dengan ECONARA hari
                  ini.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Button
                    size="lg"
                    className={`bg-gradient-to-r ${themeColors.buttonGradient} text-white px-10 py-4 text-lg font-bold shadow-2xl transition-all duration-300 rounded-2xl border-0`}
                  >
                    Bergabung Sekarang
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-slate-600 text-slate-300 hover:bg-slate-800/50 bg-slate-900/20 backdrop-blur-sm px-10 py-4 text-lg font-bold rounded-2xl hover:border-slate-500"
                  >
                    Hubungi Kami
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </motion.div>

        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}
