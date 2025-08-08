"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Shuffle, Settings, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";

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

// Sound effects
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

export const ThemeSelector = () => {
  const [showVariantSelector, setShowVariantSelector] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const { theme = "default", setTheme } = useTheme();

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

  const handleThemeChange = (variant: string) => {
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

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) playSound(880, 100);
  };

  const currentVariant =
    theme as "default" | "aurora" | "geometric" | "nebula" | "night";

  return (
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
          className={`bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300 shadow-lg ${themeTextColorMap[currentVariant]}`}
        >
          <Palette className={`w-4 h-4 ${themeTextColorMap[currentVariant]}`} />
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
                className={`${themeBgMap[currentVariant]} backdrop-blur-xl border border-slate-700/50 shadow-2xl`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`font-semibold flex items-center ${themeTextColorMap[currentVariant]}`}
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
                          currentVariant === variant.value
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
                                className={`font-medium text-sm ${themeTextColorMap[currentVariant]}`}
                              >
                                {variant.name}
                              </div>
                              <div
                                className={`text-xs ${themeTextColorMap[currentVariant]}/70`}
                              >
                                {variant.description}
                              </div>
                            </div>
                          </div>
                          {currentVariant === variant.value && (
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
                      onClick={toggleSound}
                      className={`w-full transition-all duration-300 ${themeTextColorMap[currentVariant]} hover:brightness-125`}
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
  );
};
