import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Brain, Lock, Lightbulb } from "lucide-react"

export default function TipsPage() {
  return (
    <div className="py-12 space-y-16 max-w-4xl mx-auto">
      <section className="text-center">
        <h1 className="mb-6 text-4xl font-bold">Usage & Memorization Tips</h1>
        <p className="text-xl text-muted-foreground">
          Practical advice for remembering and using your quantum-resistant passphrases
        </p>
      </section>

      <section className="space-y-12">
        {/* Memorization Tips */}
        <div className="info-box">
          <div className="flex items-center mb-6 gap-3">
            <Brain className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold">Memorization Techniques</h2>
          </div>

          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Create a Visual Story</h3>
              <p className="text-muted-foreground">
                Connect the words in your passphrase by visualizing them in a bizarre, memorable story.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Example:</strong> For "correct-horse-battery-staple-ocean-piano"
                </p>
                <p className="text-sm mt-2">
                  Imagine a <em>correct</em> answer being written by a <em>horse</em> using a <em>battery</em>
                  to power a <em>stapler</em> while floating in the <em>ocean</em> on top of a <em>piano</em>.
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Chunking Method</h3>
              <p className="text-muted-foreground">
                Group words into meaningful chunks of 2-3 words each, which are easier to remember than individual
                words.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Example:</strong> "correct-horse | battery-staple | ocean-piano"
                </p>
                <p className="text-sm mt-2">Remember three chunks instead of six individual words.</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Spaced Repetition</h3>
              <p className="text-muted-foreground">
                Practice recalling your passphrase at increasing intervals: after 1 hour, then 1 day, then 3 days, etc.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Tip:</strong> Set calendar reminders to practice your passphrase at these intervals.
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Write It Down (Temporarily)</h3>
              <p className="text-muted-foreground">
                It's better to write down a strong passphrase temporarily than to use a weak, memorable one permanently.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Safety:</strong> Keep the written copy in a secure location, separate from the device or
                  account it protects, and destroy it once memorized.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Tips */}
        <div className="info-box">
          <div className="flex items-center mb-6 gap-3">
            <Lock className="w-6 h-6 text-teal-500" />
            <h2 className="text-2xl font-bold">Secure Usage Practices</h2>
          </div>

          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Password Manager Integration</h3>
              <p className="text-muted-foreground mb-3">
                Use a reputable password manager to store your QuantumGuard passphrases for most accounts.
              </p>
              <p className="text-sm">
                <strong>Best Practice:</strong> Memorize one or two master passphrases (for your password manager and
                encryption), and let your password manager handle the rest.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Prioritize High-Value Accounts</h3>
              <p className="text-muted-foreground mb-3">
                Reserve your strongest, memorized passphrases for your most critical accounts.
              </p>
              <ul className="ml-5 space-y-1 text-sm list-disc">
                <li>Primary email accounts</li>
                <li>Financial accounts and banking</li>
                <li>Password manager master password</li>
                <li>Disk encryption</li>
                <li>Cryptocurrency wallets</li>
              </ul>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Multi-Factor Authentication (MFA)</h3>
              <p className="text-muted-foreground mb-3">
                Always enable MFA when available, even with strong passphrases.
              </p>
              <p className="text-sm">
                <strong>Recommendation:</strong> Use hardware security keys or authenticator apps rather than SMS-based
                verification when possible.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-3 text-lg font-medium">Passphrase Variants</h3>
              <p className="text-muted-foreground mb-3">
                If a service has restrictions on passphrase length or character types, create a variant while
                maintaining security.
              </p>
              <div className="mt-3 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Example:</strong> If "correct-horse-battery-staple-ocean-piano" is too long, use the first 4
                  words and add numbers/symbols: "Correct-Horse-Battery-Staple!42"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="info-box">
          <div className="flex items-center mb-6 gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Additional Security Tips</h2>
          </div>

          <div className="space-y-4">
            <p>Even the strongest passphrase is just one part of your overall security posture. Remember to:</p>
            <ul className="ml-6 space-y-3 list-disc">
              <li>
                <strong>Use unique passphrases</strong> for each important account to prevent credential stuffing
                attacks
              </li>
              <li>
                <strong>Keep your devices updated</strong> with the latest security patches
              </li>
              <li>
                <strong>Be vigilant against phishing</strong> - no passphrase can protect you if you give it away to
                attackers
              </li>
              <li>
                <strong>Regularly audit your accounts</strong> and remove those you no longer use
              </li>
              <li>
                <strong>Consider your physical security</strong> - protect against shoulder surfing when entering
                passphrases in public
              </li>
            </ul>
          </div>
        </div>
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
