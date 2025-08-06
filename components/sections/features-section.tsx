"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Smartphone, Palette, BarChart3, Users } from 'lucide-react'
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface FeaturesSectionProps {
  performanceLevel: PerformanceLevel
}

const features = [
  {
    icon: Zap,
    title: "Performance Adaptive",
    description: "Automatically adjusts animations and effects based on your device capabilities",
    badge: "Smart",
  },
  {
    icon: Palette,
    title: "Dynamic Themes",
    description: "Multiple visual themes with smooth transitions and customizable colors",
    badge: "Visual",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Perfect experience across all devices from mobile to desktop",
    badge: "Mobile",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Built with security and privacy as core principles",
    badge: "Security",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Comprehensive insights and performance metrics",
    badge: "Data",
  },
  {
    icon: Users,
    title: "Community Features",
    description: "Connect and collaborate with other users",
    badge: "Social",
  },
]

export const FeaturesSection = ({ performanceLevel }: FeaturesSectionProps) => {
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
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Discover the powerful features that make our platform unique and efficient
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * animationDelay }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 h-full">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <feature.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <Badge variant="outline" className="text-xs bg-slate-800/50 text-slate-300 border-slate-600">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
