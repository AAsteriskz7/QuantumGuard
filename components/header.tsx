"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="relative z-20 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            QuantumGuard
          </span>
        </Link>

        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="/why" className="text-sm font-medium transition-colors hover:text-primary">
            Why QuantumGuard?
          </Link>
          <Link href="/generator" className="text-sm font-medium transition-colors hover:text-primary">
            Generator
          </Link>
          <Link href="/tips" className="text-sm font-medium transition-colors hover:text-primary">
            Usage Tips
          </Link>
          <Link href="/faq" className="text-sm font-medium transition-colors hover:text-primary">
            FAQ
          </Link>
          <Button asChild className="bg-teal-500 hover:bg-teal-600">
            <Link href="/generator">Create Passphrase</Link>
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="absolute left-0 right-0 z-20 p-4 border-b md:hidden bg-background/95 backdrop-blur-sm">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/why"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Why QuantumGuard?
            </Link>
            <Link
              href="/generator"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Generator
            </Link>
            <Link
              href="/tips"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Usage Tips
            </Link>
            <Link
              href="/faq"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Button asChild className="w-full bg-teal-500 hover:bg-teal-600" onClick={() => setIsMenuOpen(false)}>
              <Link href="/generator">Create Passphrase</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
