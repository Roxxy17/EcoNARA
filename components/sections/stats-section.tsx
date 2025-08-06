"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface StatsSectionProps {
  performanceLevel: PerformanceLevel
}

const stats = [
  { value: "99.9%", label: "Uptime", suffix: "" },
  { value: "50", label: "Countries", suffix: "+" },
  { value: "1M", label: "Active Users", suffix: "+" },
  { value: "24/7", label: "Support", suffix: "" },
]

export const StatsSection = ({ performanceLevel }: StatsSectionProps) => {
  const animationDelay = performanceLevel === "high" ? 0.1 : performanceLevel === "medium" ? 0.15 : 0.2

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            Statistics
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Millions
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join a growing community of users who trust our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * animationDelay }}
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
