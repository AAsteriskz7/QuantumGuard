import Link from "next/link"
import { Coffee, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative z-10 py-6 mt-20 border-t bg-background/80 backdrop-blur-sm">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">QuantumGuard</h3>
            <p className="text-sm text-muted-foreground">
              Generating highly secure, quantum-resistant passphrases that are designed to be memorable.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/why" className="transition-colors hover:text-primary">
                  Why QuantumGuard?
                </Link>
              </li>
              <li>
                <Link href="/generator" className="transition-colors hover:text-primary">
                  Generator
                </Link>
              </li>
              <li>
                <Link href="/tips" className="transition-colors hover:text-primary">
                  Usage Tips
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition-colors hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">About</h3>
            <p className="mb-2 text-sm text-muted-foreground">
              Based on EFF Dice-Generated Passphrase methodology for maximum security and memorability.
            </p>
            <p className="text-sm font-medium text-teal-400">
              <Link href="https://chromewebstore.google.com/detail/quantumguard-password-gen/dfienhkgfmommaacngnkifnndcbllmlj" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                Chrome Extension
              </Link>
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Support</h3>
            <p className="mb-3 text-sm text-muted-foreground">Enjoy using QuantumGuard? Support the development!</p>
            <a
              href="https://www.buymeacoffee.com/aasteriskz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg hover:from-yellow-600 hover:to-orange-600 hover:shadow-lg hover:scale-105"
            >
              <Coffee className="w-4 h-4" />
              Buy me a coffee
            </a>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between pt-8 mt-8 text-sm border-t md:flex-row text-muted-foreground">
          <p>© {new Date().getFullYear()} QuantumGuard. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-2 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>by Adarsh Setty</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
