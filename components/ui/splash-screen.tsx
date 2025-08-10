"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Sparkles, Leaf, Droplets, Wind } from "lucide-react";
import { useTheme } from "next-themes"; // gunakan useTheme, BUKAN ThemeProvider

interface SplashScreenProps {
  forceTheme?: "ocean" | string;
  // ...props lain jika ada...
}

export default function SplashScreen({ forceTheme }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showElements, setShowElements] = useState(false);
  const { theme = "default" } = useTheme(); // ini akan mengikuti global theme
  const activeTheme = forceTheme || theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    // Show elements after initial delay
    const timer = setTimeout(() => {
      setShowElements(true);
    }, 300);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  if (!mounted) return null;

  // Floating particles animation variants
  const particleVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const floatingIconVariants = {
    animate: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Ganti semua gradasi utama dengan variable sesuai theme
  const themeGradient =
    activeTheme === "ocean"
      ? "from-cyan-400 via-emerald-400 to-blue-500"
      : activeTheme === "aurora"
      ? "from-green-400 via-blue-400 to-emerald-400"
      : activeTheme === "night"
      ? "from-blue-600 via-indigo-400 to-cyan-400"
      : activeTheme === "geometric"
      ? "from-red-400 via-orange-400 to-yellow-400"
      : activeTheme === "nebula"
      ? "from-purple-400 via-pink-400 to-violet-400"
      : "from-blue-400 via-cyan-400 to-teal-400";

  const themeBg =
    activeTheme === "aurora"
      ? "from-slate-900 via-green-900 to-blue-900"
      : activeTheme === "night"
      ? "from-slate-900 via-blue-900 to-cyan-900"
      : activeTheme === "geometric"
      ? "from-slate-900 via-red-900 to-yellow-900"
      : activeTheme === "nebula"
      ? "from-slate-900 via-purple-900 to-pink-900"
      : "from-slate-900 via-blue-900 to-cyan-900";

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Dynamic Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${themeBg}`} />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-800/30 to-emerald-800/20" />
      <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/20 via-transparent to-teal-900/30" />

      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Floating Particles */}
      <AnimatePresence>
        {showElements && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${15 + i * 8}%`,
                }}
                variants={particleVariants}
                animate="animate"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  delay: i * 0.2,
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full shadow-lg" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Floating Icons */}
      <AnimatePresence>
        {showElements && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/6 text-green-400/30"
              variants={floatingIconVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
            >
              <Leaf className="w-8 h-8" />
            </motion.div>

            <motion.div
              className="absolute top-1/3 right-1/6 text-blue-400/30"
              variants={floatingIconVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
            >
              <Droplets className="w-6 h-6" />
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 left-1/5 text-cyan-400/30"
              variants={floatingIconVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6, type: "spring", stiffness: 100 }}
            >
              <Wind className="w-7 h-7" />
            </motion.div>

            <motion.div
              className="absolute bottom-1/4 right-1/5 text-emerald-400/30"
              variants={floatingIconVariants}
              animate="animate"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.0, type: "spring", stiffness: 100 }}
            >
              <Sparkles className="w-6 h-6" />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: 0.2,
        }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Logo Container with Enhanced Effects */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 12,
            delay: 0.4,
          }}
          className="mb-12 relative"
        >
          {/* Glow Effect Behind Logo */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-cyan-400/30 to-teal-400/20 rounded-full blur-2xl scale-150"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1.4, 1.6, 1.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Logo with Floating Animation */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotateY: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative z-10"
          >
            <div className="relative">
              <Image
                src="/logo-2.png"
                alt="EcoNARA Logo"
                width={200}
                height={200}
                className="drop-shadow-2xl rounded-3xl bg-white/10 backdrop-blur-sm p-6 border border-white/20"
                priority
              />

              {/* Sparkle Effects Around Logo */}
              <motion.div
                className="absolute -top-2 -right-2 text-yellow-400"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1,
                }}
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>

              <motion.div
                className="absolute -bottom-2 -left-2 text-blue-400"
                animate={{
                  scale: [0, 1, 0],
                  rotate: [360, 180, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: 1.5,
                }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <motion.h1
            className={`text-6xl md:text-8xl font-black bg-gradient-to-r ${themeGradient} bg-clip-text text-transparent mb-4 drop-shadow-2xl`}
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            EcoNARA
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="relative"
          >
            <p className="text-xl md:text-3xl text-slate-200 font-semibold tracking-wide mb-2">
              Menuju Komunitas Berkelanjutan
            </p>
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 1.5, duration: 1 }}
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Loading Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="flex flex-col items-center space-y-6"
        >
          {/* Loading Progress Text */}
          <motion.div
            className="text-slate-300 font-medium text-lg"
            key={Math.floor(loadingProgress)}
            initial={{ opacity: 0.7 }}
            animate={{ opacity: 1 }}
          >
            <span className={`font-medium bg-gradient-to-r ${themeGradient} bg-clip-text text-transparent`}>
              Memuat... {Math.floor(loadingProgress)}%
            </span>
          </motion.div>

          {/* Enhanced Progress Bar */}
          <div className="relative w-80 h-3 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/50">
            {/* Background Glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 rounded-full"
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Progress Fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-full shadow-lg relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          {/* Loading Dots */}
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Decorative Elements */}
      <motion.div
        className="absolute bottom-8 left-0 w-full flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <div className="flex items-center space-x-4 text-slate-400 text-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Leaf className="w-4 h-4" />
          </motion.div>
          <span>Membangun masa depan yang berkelanjutan</span>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
