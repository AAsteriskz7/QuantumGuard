import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Lock, Cpu, Shield } from "lucide-react"

export default function WhyPage() {
  return (
    <div className="py-12 space-y-16 max-w-4xl mx-auto">
      <section className="text-center">
        <h1 className="mb-6 text-4xl font-bold">Why QuantumGuard?</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the science and rationale behind quantum-resistant passphrases
        </p>
      </section>

      <section className="space-y-12">
        {/* The Quantum Threat Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🚨 The Quantum Threat Explained</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="mb-4">
                Quantum computers leverage quantum mechanics to perform certain calculations exponentially faster than
                classical computers. This poses a significant threat to current password security.
              </p>
              <p className="mb-4">
                <strong>Grover's Algorithm</strong>, a quantum algorithm, can theoretically search an unsorted database
                of N items in approximately √N steps, compared to N/2 steps on average for classical computers.
              </p>
              <p className="mb-4">
                This effectively <strong>cuts your password entropy in half</strong>, meaning a password that would take
                billions of years to crack with classical computers might only take millions of years with quantum
                computers—still a long time, but a dramatic reduction.
              </p>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  ⚠️ Bottom Line: Today's "strong" passwords may become vulnerable to quantum attacks in the future.
                </p>
              </div>
            </div>
            <div className="p-6 border rounded-lg bg-muted/50 max-w-xs">
              <Cpu className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="mb-2 text-lg font-semibold text-center">Quantum Impact</h3>
              <p className="text-sm text-center text-muted-foreground">
                A 128-bit secure password becomes only 64-bit secure against quantum attacks—a quadrillion times weaker.
              </p>
            </div>
          </div>
        </div>

        {/* Password Entropy Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🔢 What is Password Entropy?</h2>
          <p className="mb-4">
            Password entropy is a measure of a password's unpredictability or randomness, indicating how many guesses an
            attacker would need to crack it. Think of it as the "strength" of your password.
          </p>
          <p className="mb-4">Entropy is calculated using this formula:</p>
          <div className="p-4 mb-4 text-center bg-muted rounded-md">
            <p className="text-lg font-mono">Entropy (bits) = log₂(Pool Size) × Length</p>
          </div>
          <p className="mb-4">Where:</p>
          <ul className="mb-4 ml-6 space-y-2 list-disc">
            <li>
              <strong>Pool Size</strong> is the number of possible characters or words available (e.g., 26 for lowercase
              letters, 7,776 for the EFF wordlist)
            </li>
            <li>
              <strong>Length</strong> is how many characters or words are in your password/passphrase
            </li>
          </ul>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg bg-red-900/20">
              <h4 className="font-medium text-red-400">Weak (&lt; 50 bits)</h4>
              <p className="text-sm text-muted-foreground">Easily cracked by modern computers</p>
            </div>
            <div className="p-4 border rounded-lg bg-yellow-900/20">
              <h4 className="font-medium text-yellow-400">Moderate (50-80 bits)</h4>
              <p className="text-sm text-muted-foreground">Resistant to casual attacks</p>
            </div>
            <div className="p-4 border rounded-lg bg-green-900/20">
              <h4 className="font-medium text-green-400">Strong (80+ bits)</h4>
              <p className="text-sm text-muted-foreground">Quantum-resistant when doubled</p>
            </div>
          </div>
        </div>

        {/* Why Word-Based Passphrases Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🔤 Why Word-Based Passphrases?</h2>

          <div className="mb-8">
            <h3 className="mb-4 text-xl font-semibold">The EFF Long Wordlist Advantage</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-4">
                  QuantumGuard uses the Electronic Frontier Foundation's Long Wordlist, containing exactly
                  <strong> 7,776 words</strong>. This isn't arbitrary—it's precisely designed for dice-based generation.
                </p>
                <ul className="ml-6 space-y-2 list-disc text-sm">
                  <li>
                    Each word provides <strong>~12.9 bits of entropy</strong>
                  </li>
                  <li>Words are carefully chosen to avoid confusion</li>
                  <li>No offensive or easily-confused words</li>
                  <li>Optimized for memorability and distinctiveness</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg bg-teal-900/20">
                <h4 className="mb-2 font-medium text-teal-400">The Math</h4>
                <p className="text-sm text-muted-foreground mb-2">7,776 = 6⁵ (perfect for 5-dice rolls)</p>
                <p className="text-sm text-muted-foreground mb-2">log₂(7,776) ≈ 12.925 bits per word</p>
                <p className="text-sm text-muted-foreground">15 words = ~194 bits classical entropy</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-xl font-semibold">Comparing Security Approaches</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="p-4 border rounded-lg bg-red-900/20">
                <h4 className="mb-2 font-medium text-red-400">Short, Complex Passwords</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Example: <code>P@$$wOrd!%</code>
                </p>
                <p className="text-sm">
                  While complex, their shorter length is a vulnerability against brute-force attacks, especially
                  quantum-accelerated ones. ~53 bits entropy.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-yellow-900/20">
                <h4 className="mb-2 font-medium text-yellow-400">Human-Invented "Memorable" Passwords</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Example: <code>MyDog2015!</code>
                </p>
                <p className="text-sm">
                  These often have very low actual entropy despite perceived complexity, as they follow predictable
                  patterns. ~28 bits entropy.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-green-900/20">
                <h4 className="mb-2 font-medium text-green-400">QuantumGuard EFF Method</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Example: <code>correct-horse-battery-staple-ocean-piano</code>
                </p>
                <p className="text-sm">
                  Achieves superior strength through massive length and verifiable randomness, leading to extremely high
                  entropy. ~77+ bits entropy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Golden Rule Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🏆 The Golden Rule: UNIQUE Passphrases for EVERY Site!</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <p className="mb-4">
                <strong>The #1 security mistake:</strong> Reusing the same password across multiple accounts. Even the
                strongest passphrase becomes worthless if used everywhere.
              </p>
              <h3 className="mb-3 text-lg font-semibold">Why Credential Stuffing is Devastating:</h3>
              <ol className="mb-4 ml-6 space-y-2 list-decimal text-sm">
                <li>Hacker breaches one website and steals your password</li>
                <li>They try that same password on hundreds of other sites</li>
                <li>Every account using that password is now compromised</li>
                <li>Your email, banking, social media—all accessible</li>
              </ol>
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  🚨 Real Impact: Over 80% of data breaches involve credential stuffing attacks using reused passwords.
                </p>
              </div>
            </div>
            <div className="p-6 border rounded-lg bg-muted/50 max-w-xs text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="mb-2 text-lg font-semibold">One Breach = All Accounts</h3>
              <p className="text-sm text-muted-foreground">
                Reusing passwords turns a single website breach into a complete digital identity theft.
              </p>
            </div>
          </div>
        </div>

        {/* Password Manager Solution Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🔐 The Solution: Password Managers</h2>
          <div className="space-y-6">
            <p className="text-lg">
              <strong>QuantumGuard + Password Manager = Perfect Security</strong>
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-teal-400">How It Works:</h3>
                <ol className="ml-6 space-y-2 list-decimal text-sm">
                  <li>Use QuantumGuard to create ONE ultra-strong master passphrase</li>
                  <li>Use that to secure a reputable password manager</li>
                  <li>Generate unique passphrases for every other account</li>
                  <li>Let the password manager remember and auto-fill them</li>
                </ol>
              </div>
              <div>
                <h3 className="mb-3 text-lg font-semibold text-blue-400">Recommended Password Managers:</h3>
                <ul className="ml-6 space-y-1 list-disc text-sm">
                  <li>
                    <strong>Bitwarden</strong> - Open source, excellent free tier
                  </li>
                  <li>
                    <strong>1Password</strong> - User-friendly, great family plans
                  </li>
                  <li>
                    <strong>KeePass</strong> - Fully offline, maximum control
                  </li>
                  <li>
                    <strong>Dashlane</strong> - Good for beginners
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
              <h4 className="mb-2 font-medium text-teal-600 dark:text-teal-400">
                💡 Pro Tip: The One Passphrase to Rule Them All
              </h4>
              <p className="text-sm text-muted-foreground">
                Your password manager's master passphrase is the ONLY one you need to memorize. Make it count! Use 20+
                words from QuantumGuard for maximum quantum resistance.
              </p>
            </div>
          </div>
        </div>

        {/* Debunking Myths Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🚫 Debunking Security Myths</h2>

          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-yellow-900/20">
              <h3 className="mb-2 text-lg font-semibold text-yellow-400">Myth: "4 Words is Enough" (XKCD Comic)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                The famous XKCD comic suggested 4 random words provide good security. This was true in 2011, but:
              </p>
              <ul className="ml-6 space-y-1 list-disc text-sm">
                <li>Computing power has increased dramatically</li>
                <li>Quantum computers pose new threats</li>
                <li>4 words from a 7,776-word list = only ~52 bits entropy</li>
                <li>
                  <strong>Quantum resistance requires 15-20+ words</strong>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-red-900/20">
              <h3 className="mb-2 text-lg font-semibold text-red-400">Myth: "Leetspeak Makes Passwords Strong"</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Substituting 'a' with '@' or 'e' with '3' adds minimal security:
              </p>
              <ul className="ml-6 space-y-1 list-disc text-sm">
                <li>
                  <code>password</code> vs <code>p@ssw0rd</code> - barely any entropy difference
                </li>
                <li>Predictable patterns are easily cracked by modern tools</li>
                <li>Length and true randomness matter far more than complexity</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-green-900/20">
              <h3 className="mb-2 text-lg font-semibold text-green-400">Truth: Randomness + Length = Security</h3>
              <p className="text-sm text-muted-foreground">
                Security comes from unpredictability and sufficient entropy, not from making passwords "look complex" to
                humans. A truly random 15-word passphrase is exponentially stronger than any human-created "complex"
                password.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy First Section */}
        <div className="info-box">
          <h2 className="mb-6 text-2xl font-bold">🔒 Privacy First - How We Protect You</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <p className="mb-4">
                QuantumGuard takes your privacy seriously. All passphrase generation happens entirely in your browser:
              </p>
              <ul className="mb-4 ml-6 space-y-2 list-disc">
                <li>No server requests are made during passphrase generation</li>
                <li>Your passphrases are never transmitted over the internet</li>
                <li>No analytics or tracking of generated passphrases</li>
                <li>No cookies or local storage used to save your passphrases</li>
                <li>Uses your browser's cryptographically secure random number generator</li>
              </ul>
              <p>This client-side approach ensures that your secure passphrases remain known only to you.</p>
            </div>
            <div className="p-6 border rounded-lg bg-muted/50 max-w-xs text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-teal-500" />
              <h3 className="mb-2 text-lg font-semibold">Zero Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                We can't see, store, or access your passphrases because they never leave your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="mb-6 text-2xl font-bold">Ready to Create Your Quantum-Resistant Security?</h2>
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-4 md:justify-center">
          <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
            <Link href="/generator">
              Generate Passphrases
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/tips">Learn Memorization Tips</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
