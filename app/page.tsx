import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Lock, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="py-12 space-y-20">
      {/* Hero Section */}
      <section className="py-12 text-center md:py-20">
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">
          Forge Your Digital Shield:
          <span className="block mt-2 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Quantum-Resistant Passphrases
          </span>
        </h1>
        <p className="max-w-2xl mx-auto mb-8 text-xl text-muted-foreground">
          Generate long, random, memorable passphrases to resist current and quantum attacks, all done client-side for
          complete privacy.
        </p>
        <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
          <Link href="/generator">
            Create My Secure Passphrase
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="mb-12 text-3xl font-bold text-center">Why Choose QuantumGuard?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div className="p-6 transition-all border rounded-lg shadow-sm bg-card/50 hover:bg-card hover:shadow-md">
            <div className="p-3 mb-4 rounded-full w-fit bg-blue-500/10">
              <Shield className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Quantum-Resistant</h3>
            <p className="text-muted-foreground">
              Built to withstand both classical and quantum computing attacks through massive entropy.
            </p>
            <Link
              href="/why"
              className="inline-flex items-center mt-4 text-sm font-medium text-blue-500 hover:underline"
            >
              Learn more <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="p-6 transition-all border rounded-lg shadow-sm bg-card/50 hover:bg-card hover:shadow-md">
            <div className="p-3 mb-4 rounded-full w-fit bg-teal-500/10">
              <Zap className="w-6 h-6 text-teal-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Memorable</h3>
            <p className="text-muted-foreground">
              Uses real words in random combinations that are easier to remember than complex character strings.
            </p>
            <Link
              href="/tips"
              className="inline-flex items-center mt-4 text-sm font-medium text-teal-500 hover:underline"
            >
              View memorization tips <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="p-6 transition-all border rounded-lg shadow-sm bg-card/50 hover:bg-card hover:shadow-md">
            <div className="p-3 mb-4 rounded-full w-fit bg-blue-500/10">
              <Lock className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Privacy First</h3>
            <p className="text-muted-foreground">
              All generation happens in your browser. Your passphrases are never transmitted or stored.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center mt-4 text-sm font-medium text-blue-500 hover:underline"
            >
              Read our FAQ <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="p-8 overflow-hidden border rounded-lg shadow-lg bg-gradient-to-br from-blue-900/20 to-teal-900/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready to secure your digital life?</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Create your first quantum-resistant passphrase and take a step toward future-proof security.
            </p>
            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-center">
              <Button asChild size="lg" className="w-full md:w-auto bg-teal-500 hover:bg-teal-600">
                <Link href="/generator">Generate Passphrase</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
                <Link href="/why">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
