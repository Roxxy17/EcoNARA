"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles } from 'lucide-react'
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface CTASectionProps {
  performanceLevel: PerformanceLevel
}

export const CTASection = ({ performanceLevel }: CTASectionProps) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
            <Sparkles className="w-3 h-3 mr-1" />
            Ready to Start?
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Join the Future of
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}Digital Experience
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Experience the next generation of web applications with adaptive performance, 
            beautiful animations, and intuitive design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white">
              Get Started Now
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="border-slate-600 text-purple-400 hover:bg-slate-800/50">
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
