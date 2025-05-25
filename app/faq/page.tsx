import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="py-12 space-y-16 max-w-4xl mx-auto">
      <section className="text-center">
        <h1 className="mb-6 text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">Learn more about QuantumGuard and quantum-resistant passphrases</p>
      </section>

      <section>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Is this really more secure than a password like <code>Xy!7#pQ@Z</code>?
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                Yes, significantly so. While <code>Xy!7#pQ@Z</code> looks complex, it only has about 53 bits of entropy.
              </p>
              <p className="mb-3">
                A 6-word passphrase from our system has approximately 77 bits of entropy, and an 8-word passphrase has
                about 103 bits—nearly 2^50 (a quadrillion) times stronger than the complex password example.
              </p>
              <p>
                The key factors are length and true randomness. Short passwords, even with special characters, simply
                don't have enough possible combinations to resist advanced cracking methods, especially with quantum
                computing on the horizon.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>How can common words be secure?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                The security comes from the randomness of selection and the length of the sequence, not the complexity
                of individual words.
              </p>
              <p className="mb-3">
                Think of it like a combination lock: using a 4-digit lock with digits 0-9 gives you 10,000 possible
                combinations. But a 6-digit lock gives you 1,000,000 combinations—100 times more secure, even though
                you're still just using simple digits.
              </p>
              <p>
                Similarly, randomly selecting 6-8 words from a large wordlist creates an enormous number of possible
                combinations that are computationally infeasible to brute-force, even with advanced technology.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What is "entropy" and why does it matter?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                Entropy is a measure of unpredictability or randomness in your password. It's typically measured in
                bits, where each bit doubles the number of possible combinations.
              </p>
              <p className="mb-3">For example:</p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>40 bits of entropy = 2^40 (about 1 trillion) possible combinations</li>
                <li>80 bits of entropy = 2^80 (about 1 septillion) possible combinations</li>
                <li>100 bits of entropy = 2^100 (about 1 nonillion) possible combinations</li>
              </ul>
              <p>
                The higher the entropy, the more combinations an attacker would need to try to guess your password.
                QuantumGuard passphrases typically have 77-128+ bits of entropy, making them extremely resistant to
                brute force attacks.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Will this protect me from all hacking?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                No, strong passphrases are just one part of your overall security posture. While QuantumGuard creates
                very strong passwords, your overall security also depends on:
              </p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>Using multi-factor authentication (MFA) whenever possible</li>
                <li>Being aware of phishing attempts</li>
                <li>Keeping your software and devices updated</li>
                <li>Using unique passphrases for each account</li>
                <li>Practicing good digital hygiene in general</li>
              </ul>
              <p>
                A strong passphrase is like a good lock on your front door—essential, but not the only security measure
                you should have.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Why are quantum computers a threat to passwords?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                Quantum computers leverage quantum mechanics to solve certain problems exponentially faster than
                classical computers. For password security, the main concern is Grover's algorithm.
              </p>
              <p className="mb-3">
                Grover's algorithm can theoretically search an unsorted database of N items in approximately √N steps,
                compared to N/2 steps on average for classical computers. This effectively cuts your password entropy in
                half.
              </p>
              <p>
                This means a password with 128 bits of entropy (extremely strong by today's standards) would effectively
                have only 64 bits of entropy against a quantum computer—still strong, but a dramatic reduction.
                QuantumGuard passphrases are designed with enough entropy to remain secure even after this quantum
                reduction.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger>Do I need to do anything special for the "quantum" part?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                No, the tool automatically generates passphrases with enough inherent strength to resist quantum
                attacks. The "quantum-resistant" aspect comes from:
              </p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>Starting with very high entropy (typically 77-128+ bits)</li>
                <li>
                  Ensuring that even after the quantum "penalty" (halving the effective entropy), the passphrase remains
                  strong enough
                </li>
                <li>Using true randomness in the selection process</li>
              </ul>
              <p>
                You just need to select a sufficient number of words (we recommend at least 6, preferably 8 for critical
                accounts) and use the passphrase as generated.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger>Is it safe to generate my passphrase in a web browser?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                Yes, QuantumGuard uses your browser's built-in cryptographically secure random number generator (via the{" "}
                <code>crypto.getRandomValues()</code> API), which is designed specifically for security-critical
                applications.
              </p>
              <p className="mb-3">
                All generation happens entirely client-side (in your browser), with no server requests made during the
                generation process. This means:
              </p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>Your passphrases are never transmitted over the internet</li>
                <li>They're not stored in our databases or logs</li>
                <li>Even we can't see what passphrases you've generated</li>
              </ul>
              <p>This approach provides both strong security and complete privacy.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger>Can QuantumGuard see or save my passphrases?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                <strong>Absolutely not.</strong> QuantumGuard is designed with a "zero knowledge" approach:
              </p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>All passphrase generation happens entirely in your browser</li>
                <li>No server requests are made during generation</li>
                <li>Your passphrases are never transmitted over the internet</li>
                <li>We don't use cookies or local storage to save your passphrases</li>
                <li>No analytics or tracking of generated passphrases</li>
              </ul>
              <p>We can't see, store, or access your passphrases because they never leave your device.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger>What wordlist do you use?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                QuantumGuard uses a carefully curated wordlist based on the EFF's Dice-Generated Passphrase wordlist,
                which was specifically designed for creating secure, memorable passphrases.
              </p>
              <p className="mb-3">Our wordlist features:</p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>Common, easily-spelled English words</li>
                <li>No offensive or easily-confused words</li>
                <li>Sufficient size (thousands of words) to ensure high entropy</li>
                <li>Words chosen for memorability and distinctiveness</li>
              </ul>
              <p>
                Using the EFF's standard, public wordlist is actually a security feature—the security comes from the
                randomness of selection and length, not from keeping the wordlist secret.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger>How is this different from a password manager's generator?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">
                While password managers often include password generators, QuantumGuard differs in several key ways:
              </p>
              <ul className="mb-3 ml-6 space-y-1 list-disc">
                <li>
                  <strong>Memorability Focus:</strong> Specifically designed to create passphrases you can actually
                  remember, unlike most password managers that generate complex strings
                </li>
                <li>
                  <strong>Quantum Resistance:</strong> Explicitly accounts for quantum computing threats in the entropy
                  calculations
                </li>
                <li>
                  <strong>Educational Component:</strong> Provides detailed information about entropy and security to
                  help you understand why your passphrase is secure
                </li>
                <li>
                  <strong>EFF Dice-Generated Method:</strong> Uses the proven EFF methodology optimized for creating a
                  few high-security master passphrases, rather than numerous disposable passwords
                </li>
              </ul>
              <p>
                That said, we strongly recommend using a password manager to store most of your passwords. QuantumGuard
                is ideal for creating memorable master passphrases for your password manager, disk encryption, or other
                critical accounts.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section className="text-center">
        <h2 className="mb-6 text-2xl font-bold">Ready to Create Your Secure Passphrase?</h2>
        <Button asChild size="lg" className="bg-teal-500 hover:bg-teal-600">
          <Link href="/generator">
            Go to Generator
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </section>
    </div>
  )
}
