import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "ECONARA - Sustainable Community Platform",
  description:
    "Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi pangan, dan membangun ekonomi sirkular yang berkelanjutan.",
  keywords: "sustainability, community, AI, food waste, circular economy, Indonesia",
  authors: [{ name: "ECONARA Team" }],
  creator: "ECONARA",
  publisher: "ECONARA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://econara.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ECONARA - Sustainable Community Platform",
    description:
      "Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi pangan, dan membangun ekonomi sirkular yang berkelanjutan.",
    url: "https://econara.com",
    siteName: "ECONARA",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ECONARA - Sustainable Community Platform",
    description:
      "Platform AI-powered yang menghubungkan komunitas untuk mengatasi food waste, mengoptimalkan distribusi pangan, dan membangun ekonomi sirkular yang berkelanjutan.",
    creator: "@econara",
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
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f172a" />
        <meta name="color-scheme" content="dark light" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
