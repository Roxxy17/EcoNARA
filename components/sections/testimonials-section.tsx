"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from 'lucide-react'
import type { PerformanceLevel } from "@/hooks/use-device-performance"

interface TestimonialsSectionProps {
  performanceLevel: PerformanceLevel
  variant?: "default" | "aurora" | "geometric" | "nebula" | "night"
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "/diverse-woman-portrait.png",
    content: "The adaptive performance feature is incredible. It automatically optimizes for my device!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Developer",
    company: "StartupXYZ",
    avatar: "/thoughtful-man.png",
    content: "Beautiful animations and smooth performance. This platform sets a new standard.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Designer",
    company: "Creative Studio",
    avatar: "/woman-designer.png",
    content: "The theme system is amazing. I love how everything adapts seamlessly.",
    rating: 5,
  },
]

export const TestimonialsSection = ({ performanceLevel, variant = "default" }: TestimonialsSectionProps) => {
  const animationDelay = performanceLevel === "high" ? 0.1 : performanceLevel === "medium" ? 0.15 : 0.2

  // Get theme-based colors
  const getThemeColors = () => {
    switch (variant) {
      case "aurora":
        return {
          badgeBg: "bg-green-500/20",
          badgeText: "text-green-300",
          badgeBorder: "border-green-500/30",
        }
      case "geometric":
        return {
          badgeBg: "bg-red-500/20",
          badgeText: "text-red-300",
          badgeBorder: "border-red-500/30",
        }
      case "nebula":
        return {
          badgeBg: "bg-purple-500/20",
          badgeText: "text-purple-300",
          badgeBorder: "border-purple-500/30",
        }
      case "night":
        return {
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
        }
      default:
        // Default sekarang adalah warna biru/teal (waves lama)
        return {
          badgeBg: "bg-blue-500/20",
          badgeText: "text-blue-300",
          badgeBorder: "border-blue-500/30",
        }
    }
  }

  const themeColors = getThemeColors()

  return (
    <section className="py-20 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className={`mb-4 ${themeColors.badgeBg} ${themeColors.badgeText} ${themeColors.badgeBorder}`}>
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            What Users Say
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Hear from our satisfied users about their experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * animationDelay }}
            >
              <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center">
                    <Avatar className="w-10 h-10 mr-3">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-white font-medium text-sm">{testimonial.name}</div>
                      <div className="text-slate-400 text-xs">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
