"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Copy, Check, RefreshCw, Shield, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { effWordList, ENTROPY_PER_WORD } from "@/lib/eff-wordlist"

export default function PassphraseGenerator() {
  const [numWords, setNumWords] = useState<number>(15)
  const [separator, setSeparator] = useState<string>("-")
  const [passphrase, setPassphrase] = useState<string>("")
  const [entropy, setEntropy] = useState<number>(0)
  const [quantumEntropy, setQuantumEntropy] = useState<number>(0)
  const [copied, setCopied] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // Calculate entropy when passphrase changes
  useEffect(() => {
    if (passphrase) {
      // Entropy calculation: log2(wordlist size) * number of words
      const calculatedEntropy = ENTROPY_PER_WORD * numWords
      setEntropy(calculatedEntropy)

      // Quantum entropy is roughly half of classical entropy due to Grover's algorithm
      setQuantumEntropy(calculatedEntropy / 2)
    }
  }, [passphrase, numWords])

  const generatePassphrase = () => {
    setIsGenerating(true)

    // Small delay to show the loading state
    setTimeout(() => {
      try {
        const selectedWords: string[] = []

        // Select random words from the EFF wordlist
        for (let i = 0; i < numWords; i++) {
          const randomIndex = Math.floor(
            (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * effWordList.length,
          )
          selectedWords.push(effWordList[randomIndex])
        }

        // Join words with the selected separator
        const newPassphrase = selectedWords.join(separator)
        setPassphrase(newPassphrase)
      } catch (error) {
        console.error("Error generating passphrase:", error)
      } finally {
        setIsGenerating(false)
      }
    }, 500)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(passphrase)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getEntropyDescription = (bits: number) => {
    if (bits < 50) return "Weak"
    if (bits < 80) return "Moderate"
    if (bits < 100) return "Strong"
    if (bits < 128) return "Very Strong"
    if (bits < 150) return "Excellent"
    return "Maximum Security"
  }

  const getEntropyColor = (bits: number) => {
    if (bits < 50) return "text-red-500"
    if (bits < 80) return "text-yellow-500"
    if (bits < 100) return "text-green-500"
    if (bits < 128) return "text-blue-500"
    if (bits < 150) return "text-teal-400"
    return "text-purple-400"
  }

  const getQuantumResistanceLabel = (bits: number) => {
    if (bits < 40) return "Quantum Vulnerable"
    if (bits < 64) return "Quantum Moderate"
    if (bits < 80) return "Quantum Robust"
    if (bits < 100) return "Quantum Excellent"
    return "Quantum Maximum"
  }

  const getSecurityGuidance = (words: number) => {
    if (words < 10) return "Basic Security - Consider more words for better protection"
    if (words < 15) return "Good Security - Suitable for most accounts"
    if (words < 20) return "Strong Security - Quantum Moderate (~96 bits)"
    if (words < 25) return "Very Strong Security - Quantum Robust (~129 bits)"
    return "Maximum Security - Quantum Excellent (>150 bits)"
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="num-words">Number of Words: {numWords}</Label>
              <span className="text-sm text-muted-foreground">{getSecurityGuidance(numWords)}</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="num-words"
                min={4}
                max={30}
                step={1}
                value={[numWords]}
                onValueChange={(value) => setNumWords(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={4}
                max={30}
                value={numWords}
                onChange={(e) => setNumWords(Number(e.target.value))}
                className="w-16"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="separator">Word Separator</Label>
            <Select value={separator} onValueChange={setSeparator}>
              <SelectTrigger id="separator">
                <SelectValue placeholder="Select a separator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">Hyphen (-)</SelectItem>
                <SelectItem value=" ">Space ( )</SelectItem>
                <SelectItem value="_">Underscore (_)</SelectItem>
                <SelectItem value=".">Period (.)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generatePassphrase} className="w-full bg-teal-500 hover:bg-teal-600" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Passphrase"
            )}
          </Button>
        </div>

        {passphrase && (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30">
              <Label htmlFor="passphrase" className="mb-2 block text-sm font-medium">
                Your Generated Passphrase
              </Label>
              <div className="flex">
                <Input id="passphrase" value={passphrase} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" className="ml-2" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-blue-900/20">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium">Classical Entropy</h3>
                </div>
                <p className="text-2xl font-bold">
                  <span className={getEntropyColor(entropy)}>{entropy.toFixed(1)} bits</span>
                </p>
                <p className="text-sm text-muted-foreground">{getEntropyDescription(entropy)}</p>
              </div>

              <div className="p-4 border rounded-lg bg-teal-900/20">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-teal-500" />
                  <h3 className="text-sm font-medium">Quantum Resistance</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3 h-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Strength estimate against potential future attacks from quantum computers using Grover's
                        Algorithm. Higher is better.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold">
                  <span className={getEntropyColor(quantumEntropy)}>{quantumEntropy.toFixed(1)} bits</span>
                </p>
                <p className="text-sm text-muted-foreground">{getQuantumResistanceLabel(quantumEntropy)}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-card">
              <h3 className="mb-2 text-sm font-medium">EFF Wordlist Information</h3>
              <p className="text-sm text-muted-foreground">
                Using the official EFF Long Wordlist with {effWordList.length.toLocaleString()} words (
                {ENTROPY_PER_WORD.toFixed(2)} bits per word). This is the gold standard for dice-generated passphrases.
              </p>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-900/10 to-teal-900/10">
              <h3 className="mb-4 text-lg font-medium">🎯 Now What? Your Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <p className="text-sm">Copy your new unique passphrase using the button above</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <p className="text-sm">Open your password manager (Bitwarden, 1Password, KeePass, etc.)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <p className="text-sm">Create a new entry for the specific website/service this passphrase is for</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <p className="text-sm">Paste this passphrase into the password field and save</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <p className="text-sm">Generate a different unique passphrase for your next account</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  🔑 Golden Rule: Use a UNIQUE passphrase for EVERY account to prevent credential stuffing attacks!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <a href="/tips">Memorization Tips</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/why">Why This Works</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/faq">FAQ</a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
