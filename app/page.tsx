"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Shuffle, Settings, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";

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
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeSelector } from "@/components/ui/theme-selector";

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
  const { theme = "default", setTheme } = useTheme();
  const backgroundVariant = theme as "default" | "aurora" | "geometric" | "nebula" | "night";
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

  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

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
    setTheme(variant);
    setShowVariantSelector(false);
  };

  const handleRandomTheme = () => {
    if (soundEnabled) playSound(660, 200);
    const randomVariant =
      backgroundVariants[Math.floor(Math.random() * backgroundVariants.length)];
    setTheme(randomVariant.value);
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

        {/* Performance Indicator */}
        <PerformanceIndicator
          performanceLevel={performanceLevel}
          capabilities={capabilities}
          isLoading={isLoading}
        />

        {/* Theme Controls */}
        <ThemeSelector />

        {/* Main Content */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Navbar
            performanceLevel="high"
            animationSettings={{ duration: 0.5, ease: "easeInOut" }}
            theme={backgroundVariant}
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
