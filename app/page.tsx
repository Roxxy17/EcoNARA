"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Shuffle, Settings, Volume2, VolumeX } from "lucide-react";

import { useDevicePerformance } from "@/hooks/use-device-performance";
import { AdaptiveBackground } from "@/components/background/adaptive-background";
import { Navbar } from "@/components/navigation/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { ImpactSection } from "@/components/sections/stats-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { CTASection } from "@/components/sections/cta-section";
import { Footer } from "@/components/sections/footer";
import { PerformanceIndicator } from "@/components/ui/performance-indicator";

const backgroundVariants = [
  {
    name: "Ocean (default)",
    value: "default",
    description: "Flowing blue & teal waves",
    emoji: "🌊",
  },
  {
    name: "Aurora",
    value: "aurora",
    description: "Northern lights inspired",
    emoji: "🌅",
  },
  {
    name: "Geometric",
    value: "geometric",
    description: "Sharp orange & red patterns",
    emoji: "🔶",
  },
  {
    name: "Nebula",
    value: "nebula",
    description: "Deep space purple & pink",
    emoji: "🌠",
  },
  {
    name: "Night",
    value: "night",
    description: "Blue & cyan night theme",
    emoji: "🌙",
  },
];

// Sound effects (using Web Audio API)
const playSound = (frequency: number, duration = 100) => {
  if (typeof window === "undefined") return;

  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    // Silently fail if Web Audio API is not supported
  }
};

export default function HomePage() {
  const { performanceLevel, capabilities, isLoading } = useDevicePerformance();
  const themeBgMap: Record<string, string> = {
    default:
      "bg-gradient-to-br from-blue-900/80 via-cyan-900/80 to-teal-900/80",
    aurora:
      "bg-gradient-to-br from-green-900/80 via-blue-900/80 to-emerald-900/80",
    geometric:
      "bg-gradient-to-br from-red-900/80 via-orange-900/80 to-yellow-900/80",
    nebula:
      "bg-gradient-to-br from-purple-900/80 via-pink-900/80 to-violet-900/80",
    night: "bg-gradient-to-br from-blue-900/80 via-cyan-900/80 to-blue-950/80",
  };
  const themeTextColorMap: Record<string, string> = {
    default: "text-cyan-400",
    aurora: "text-green-300",
    geometric: "text-orange-400",
    nebula: "text-pink-400",
    night: "text-blue-300",
  };

  const themeIconColorMap: Record<string, string> = {
    default: "text-cyan-400",
    aurora: "text-green-300",
    geometric: "text-orange-400",
    nebula: "text-pink-400",
    night: "text-blue-300",
  };

  const [backgroundVariant, setBackgroundVariant] = useState<
    "default" | "aurora" | "geometric" | "nebula" | "night"
  >("default");
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    // Hapus semua class theme-* yang mungkin sudah ada
    document.body.classList.remove(
      "theme-default",
      "theme-aurora",
      "theme-geometric",
      "theme-nebula",
      "theme-night"
    );
    // Tambahkan class sesuai backgroundVariant aktif
    document.body.classList.add(`theme-${backgroundVariant}`);
  }, [backgroundVariant]);

  const animationSettings = {
    duration:
      performanceLevel === "high"
        ? 0.6
        : performanceLevel === "medium"
        ? 0.8
        : 1.0,
    ease: performanceLevel === "high" ? [0.25, 0.1, 0.25, 1] : "easeOut",
  };

  const handleThemeChange = (variant: any) => {
    if (soundEnabled) playSound(440, 150);
    setBackgroundVariant(variant);
    setShowVariantSelector(false);
  };

  const handleRandomTheme = () => {
    if (soundEnabled) playSound(660, 200);
    const randomVariant =
      backgroundVariants[Math.floor(Math.random() * backgroundVariants.length)];
    setBackgroundVariant(randomVariant.value as any);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="homepage"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen relative overflow-hidden"
      >
        {/* Adaptive Background */}
        <AdaptiveBackground
          performanceLevel={performanceLevel}
          variant={backgroundVariant}
        />

        {/* Performance Indicator - Moved to top left */}
        <PerformanceIndicator
          performanceLevel={performanceLevel}
          capabilities={capabilities}
          isLoading={isLoading}
        />

        {/* Theme Controls - Bottom right */}
        <div className="fixed bottom-6 right-6 z-50 space-y-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (soundEnabled) playSound(330, 100);
                setShowVariantSelector(!showVariantSelector);
              }}
              className={`bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg ${themeTextColorMap[backgroundVariant]}`}
            >
              <Palette
                className={`w-4 h-4 ${themeIconColorMap[backgroundVariant]}`}
              />
            </Button>

            <AnimatePresence>
              {showVariantSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute bottom-full right-0 mb-2 w-72"
                >
                  <Card
                    className={`${themeBgMap[backgroundVariant]} backdrop-blur-xl border border-slate-700/50 shadow-2xl`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3
                          className={`font-semibold flex items-center ${themeTextColorMap[backgroundVariant]}`}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Animation Themes
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowVariantSelector(false)}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-purple-400"
                        >
                          ×
                        </Button>
                      </div>

                      <div className="space-y-2">
                        {backgroundVariants.map((variant, index) => (
                          <motion.button
                            key={variant.value}
                            onClick={() => handleThemeChange(variant.value)}
                            className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                              backgroundVariant === variant.value
                                ? "bg-purple-500/20 border border-purple-500/30 shadow-lg"
                                : "bg-slate-800/30 hover:bg-slate-700/50 border border-transparent"
                            }`}
                            whileHover={{ scale: 1.02, x: 2 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{variant.emoji}</span>
                                <div>
                                  <div
                                    className={`font-medium text-sm ${themeTextColorMap[backgroundVariant]}`}
                                  >
                                    {variant.name}
                                  </div>
                                  <div
                                    className={`text-xs ${themeTextColorMap[backgroundVariant]}/70`}
                                  >
                                    {variant.description}
                                  </div>
                                </div>
                              </div>
                              {backgroundVariant === variant.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                >
                                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                    Active
                                  </Badge>
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        ))}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/50 space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRandomTheme}
                          className="w-full text-pink-400 hover:text-purple-400 transition-all duration-300"
                        >
                          <Shuffle className="w-4 h-4 mr-2" />
                          Random Theme
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSoundEnabled(!soundEnabled);
                            if (!soundEnabled) playSound(880, 100);
                          }}
                          className={`w-full transition-all duration-300 ${themeTextColorMap[backgroundVariant]} hover:brightness-125`}
                        >
                          {soundEnabled ? (
                            <Volume2 className="w-4 h-4 mr-2" />
                          ) : (
                            <VolumeX className="w-4 h-4 mr-2" />
                          )}
                          Sound {soundEnabled ? "On" : "Off"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Main Content with enhanced page transitions */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Navbar
            performanceLevel={performanceLevel}
            animationSettings={animationSettings}
          />
          <HeroSection
            performanceLevel={performanceLevel}
            animationSettings={animationSettings}
            variant={backgroundVariant}
          />
          <FeaturesSection
            performanceLevel={performanceLevel}
            variant={backgroundVariant}
          />
          <ImpactSection
            performanceLevel={performanceLevel}
            variant={backgroundVariant}
          />
          <TestimonialsSection
            performanceLevel={performanceLevel}
            variant={backgroundVariant}
          />
          <CTASection
            performanceLevel={performanceLevel}
            variant={backgroundVariant}
          />
          <Footer />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
