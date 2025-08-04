import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "ECONARA - Sustainable Community Platform",
  description:
    "Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi pangan, dan membangun ekonomi sirkular yang berkelanjutan.",
  keywords: ["sustainability", "community", "food rescue", "AI", "Indonesia", "waste management", "circular economy"],
  authors: [{ name: "ECONARA Team" }],
  creator: "ECONARA",
  publisher: "ECONARA",
  metadataBase: new URL("https://econara.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://econara.com",
    title: "ECONARA - Sustainable Community Platform",
    description:
      "Membangun komunitas berkelanjutan melalui teknologi AI dan kolaborasi untuk ketahanan pangan serta pengelolaan sampah yang cerdas.",
    siteName: "ECONARA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ECONARA - Sustainable Community Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECONARA - Sustainable Community Platform",
    description:
      "Membangun komunitas berkelanjutan melalui teknologi AI dan kolaborasi untuk ketahanan pangan serta pengelolaan sampah yang cerdas.",
    creator: "@econara",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
