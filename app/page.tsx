"use client";

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
import { ThemeSelector } from "@/components/ui/theme-selector";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import SplashScreen  from "@/components/ui/splash-screen";

export default function HomePage() {
  const { performanceLevel, capabilities, isLoading } = useDevicePerformance();
  const { theme = "default" } = useTheme();
  const backgroundVariant = theme as "default" | "aurora" | "geometric" | "nebula" | "night";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {

    const timer = setTimeout(() => setMounted(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <SplashScreen />;

  const animationSettings = {
    duration:
      performanceLevel === "high"
        ? 0.6
        : performanceLevel === "medium"
        ? 0.8
        : 1.0,
    ease: performanceLevel === "high" ? [0.25, 0.1, 0.25, 1] : "easeOut",
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
