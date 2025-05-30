import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ProProvider } from "@/lib/pro-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "QuantumGuard - Quantum-Resistant Memorable Passphrases",
  description: "Generate highly secure, quantum-resistant passphrases that are designed to be memorable.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <ProProvider>
            <div className="relative min-h-screen bg-background">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="blob-1"></div>
                <div className="blob-2"></div>
                <div className="blob-3"></div>
              </div>
              <Header />
              <main className="container relative z-10 px-4 mx-auto">{children}</main>
              <Footer />
              <Analytics />
            </div>
          </ProProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
