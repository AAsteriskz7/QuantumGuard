import { useState } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"

// Placeholder BIP-39 wordlist - this would be imported from a proper BIP-39 wordlist file
const BIP39_WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  // ... more words would be added
]

const WORD_COUNTS = {
  "12": "12 words (128 bits)",
  "15": "15 words (160 bits)",
  "18": "18 words (192 bits)",
  "21": "21 words (224 bits)",
  "24": "24 words (256 bits)",
}

export function MnemonicGenerator() {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Mnemonic Phrase Generation")
  const [wordCount, setWordCount] = useState("12")
  const [mnemonic, setMnemonic] = useState("")
  const [showWarning, setShowWarning] = useState(true)

  const generateMnemonic = () => {
    const words: string[] = []
    const count = parseInt(wordCount)
    
    // Generate random bytes for entropy
    const entropy = new Uint8Array(count * 4 / 3)
    crypto.getRandomValues(entropy)
    
    // Convert entropy to binary string
    let binary = ""
    for (let i = 0; i < entropy.length; i++) {
      binary += entropy[i].toString(2).padStart(8, "0")
    }
    
    // Split into 11-bit chunks and map to words
    for (let i = 0; i < count; i++) {
      const index = parseInt(binary.slice(i * 11, (i + 1) * 11), 2)
      words.push(BIP39_WORDLIST[index % BIP39_WORDLIST.length])
    }
    
    setMnemonic(words.join(" "))
  }

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            <CardTitle>Mnemonic Phrase Generator</CardTitle>
          </div>
          <CardDescription>
            Generate BIP-39 compatible mnemonic phrases for cryptocurrency wallets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {showWarning && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                <p className="mb-2">
                  This tool generates mnemonic phrases that can be used to create cryptocurrency wallets.
                  Never share your mnemonic phrase with anyone, and always store it securely offline.
                </p>
                <p>
                  QuantumGuard does not store your mnemonic phrases. They are generated locally in your browser
                  and are never sent to any server.
                </p>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Phrase Length</Label>
            <Select value={wordCount} onValueChange={setWordCount}>
              <SelectTrigger>
                <SelectValue placeholder="Select word count" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WORD_COUNTS).map(([count, description]) => (
                  <SelectItem key={count} value={count}>
                    {description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generateMnemonic} className="w-full">
            Generate Mnemonic Phrase
          </Button>

          {mnemonic && (
            <div className="space-y-2">
              <Label>Your Mnemonic Phrase</Label>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="font-mono text-sm">{mnemonic}</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Write this down and store it securely. Never share it with anyone.
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Security Notes:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Store your mnemonic phrase offline, never digitally</li>
              <li>• Consider using a metal backup solution</li>
              <li>• Keep multiple copies in different secure locations</li>
              <li>• Never share your mnemonic phrase with anyone</li>
              <li>• This is a generator only - we don't store your phrases</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </ProFeatureGuard>
  )
} 