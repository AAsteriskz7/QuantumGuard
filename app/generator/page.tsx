"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PassphraseGenerator from "@/components/passphrase-generator"
import PasswordGenerator from "@/components/password-generator"

export default function GeneratorPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold">Generate Your Secure Credentials</h1>
        <p className="text-muted-foreground">
          Choose between memorable passphrases or high-density passwords for maximum security
        </p>
      </section>

      <Tabs defaultValue="passphrase" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="passphrase">Memorable Passphrases</TabsTrigger>
          <TabsTrigger value="password">Random Passwords</TabsTrigger>
        </TabsList>

        <TabsContent value="passphrase" className="space-y-8">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="mb-4 text-xl font-semibold">EFF Dice-Generated Passphrases</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">How It Works - Step-by-Step</h3>
              <ol className="ml-6 space-y-3 list-decimal text-sm">
                <li>
                  <strong>You Choose:</strong> Select the number of words and your preferred separator.
                </li>
                <li>
                  <strong>We Randomly Select:</strong> Our system uses your browser's secure random number generator to
                  pick words from the official EFF Long Wordlist (7,776 words).
                </li>
                <li>
                  <strong>Your Passphrase is Forged:</strong> The random words are combined with your chosen separator
                  to create your unique, high-entropy passphrase.
                </li>
                <li>
                  <strong>Instantly Assessed:</strong> We show you its strength against both classical and quantum
                  attacks.
                </li>
              </ol>
              <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                  🎯 Best for: Master passwords, memorable credentials, and accounts where you need to type the password
                  manually
                </p>
              </div>
            </div>
          </div>
          <PassphraseGenerator />
        </TabsContent>

        <TabsContent value="password" className="space-y-8">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="mb-4 text-xl font-semibold">Random Character Passwords</h2>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Maximum Entropy Density</h3>
              <p className="text-sm text-muted-foreground">
                Generate truly random character strings with maximum entropy per character. Perfect for password
                managers where human memorability is not a concern.
              </p>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  🎯 Best for: Password manager entries, API keys, and accounts where copy-paste is the primary method
                </p>
              </div>
            </div>
          </div>
          <PasswordGenerator />
        </TabsContent>
      </Tabs>
    </div>
  )
}
