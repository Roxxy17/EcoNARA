"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowRight,
  Heart,
} from "lucide-react"
import Link from "next/link"

const footerLinks = {
  product: [
    { name: "Food Rescue AI", href: "/food-rescue" },
    { name: "Trash Classifier", href: "/trash-classifier" },
    { name: "Eco Marketplace", href: "/marketplace" },
    { name: "Community Hub", href: "/community" },
    { name: "Analytics Dashboard", href: "/analytics" },
  ],
  company: [
    { name: "Tentang Kami", href: "/about" },
    { name: "Tim", href: "/team" },
    { name: "Karir", href: "/careers" },
    { name: "Press Kit", href: "/press" },
    { name: "Blog", href: "/blog" },
  ],
  resources: [
    { name: "Dokumentasi", href: "/docs" },
    { name: "API Reference", href: "/api" },
    { name: "Community Forum", href: "/forum" },
    { name: "Webinar", href: "/webinar" },
    { name: "Case Studies", href: "/case-studies" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Contact Support", href: "/support" },
    { name: "Status Page", href: "/status" },
    { name: "Training", href: "/training" },
    { name: "Consulting", href: "/consulting" },
  ],
}

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-400" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-400" },
  { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-400" },
  { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-500" },
  { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-400" },
]

export const Footer = () => {
  return (
    <footer className="relative z-10 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-16 border-b border-slate-800/50"
        >
          <div className="text-center max-w-2xl mx-auto">
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-4">
              <Mail className="w-4 h-4 mr-2" />
              Newsletter
            </Badge>
            <h3 className="text-3xl font-bold text-white mb-4">
              Tetap Update dengan
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Perkembangan Terbaru
              </span>
            </h3>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Dapatkan tips sustainability, update fitur terbaru, dan success stories dari komunitas EcoNara
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              />
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-6">
                Subscribe
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">EcoNara</h2>
                  <p className="text-sm text-slate-400">Sustainable Community Platform</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Membangun masa depan berkelanjutan melalui teknologi AI dan kekuatan komunitas. Bersama-sama kita
                ciptakan dampak positif untuk lingkungan dan masyarakat.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3 text-slate-300">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">Jakarta, Indonesia</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">+62 21 1234 5678</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm">hello@econara.id</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-slate-800/50 rounded-lg flex items-center justify-center text-slate-400 transition-colors ${social.color}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links], index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h4 className="text-white font-semibold mb-4 capitalize">
                  {category === "product"
                    ? "Produk"
                    : category === "company"
                      ? "Perusahaan"
                      : category === "resources"
                        ? "Resources"
                        : "Support"}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-800/50" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <span>© 2024 EcoNara. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>in Indonesia</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
