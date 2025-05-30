import { useState } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Download, List, Copy, Trash2 } from "lucide-react"
import { effWordList } from "@/lib/eff-wordlist"

interface GeneratedItem {
  id: string
  type: "passphrase" | "password"
  value: string
  entropy: number
}

const CHARACTER_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;':\",./<>?",
}

export function BatchGenerator() {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Batch Generation")
  const [batchType, setBatchType] = useState<"passphrase" | "password">("passphrase")
  const [quantity, setQuantity] = useState(10)
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Passphrase settings
  const [numWords, setNumWords] = useState(15)
  const [separator, setSeparator] = useState("-")

  // Password settings
  const [passwordLength, setPasswordLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const generateBatch = async () => {
    if (!checkProAccess("batchGeneration")) return

    setIsGenerating(true)
    const items: GeneratedItem[] = []

    try {
      for (let i = 0; i < quantity; i++) {
        if (batchType === "passphrase") {
          const words: string[] = []
          for (let j = 0; j < numWords; j++) {
            const randomIndex = Math.floor(
              (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * effWordList.length
            )
            words.push(effWordList[randomIndex])
          }
          const passphrase = words.join(separator)
          const entropy = Math.log2(effWordList.length) * numWords

          items.push({
            id: `${Date.now()}-${i}`,
            type: "passphrase",
            value: passphrase,
            entropy,
          })
        } else {
          // Generate password
          let charset = ""
          if (includeLowercase) charset += CHARACTER_SETS.lowercase
          if (includeUppercase) charset += CHARACTER_SETS.uppercase
          if (includeNumbers) charset += CHARACTER_SETS.numbers
          if (includeSymbols) charset += CHARACTER_SETS.symbols

          if (charset.length === 0) {
            console.error("No character set selected")
            continue
          }

          let password = ""
          for (let k = 0; k < passwordLength; k++) {
            const randomIndex = Math.floor(
              (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * charset.length
            )
            password += charset[randomIndex]
          }

          const entropy = passwordLength * Math.log2(charset.length)

          items.push({
            id: `${Date.now()}-${i}`,
            type: "password",
            value: password,
            entropy,
          })
        }

        // Small delay to prevent UI blocking
        if (i % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10))
        }
      }

      setGeneratedItems(items)
    } catch (error) {
      console.error("Error generating batch:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportAsText = () => {
    const text = generatedItems.map(item => item.value).join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quantumguard-${batchType}s-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportAsCSV = () => {
    const csvContent = [
      "Type,Value,Entropy (bits)",
      ...generatedItems.map(item => `${item.type},"${item.value}",${item.entropy.toFixed(2)}`)
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quantumguard-batch-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const copyAllToClipboard = () => {
    const text = generatedItems.map(item => item.value).join("\n")
    navigator.clipboard.writeText(text)
  }

  const clearBatch = () => {
    setGeneratedItems([])
  }

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-purple-500" />
            <CardTitle>Batch Generation</CardTitle>
          </div>
          <CardDescription>
            Generate multiple passwords or passphrases at once and export them
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Generation Type</Label>
              <Select value={batchType} onValueChange={(value: "passphrase" | "password") => setBatchType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passphrase">Passphrases</SelectItem>
                  <SelectItem value="password">Passwords</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              />
            </div>
          </div>

          {batchType === "passphrase" ? (
            <div className="space-y-4">
              <h4 className="font-medium">Passphrase Settings</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Words</Label>
                  <Input
                    type="number"
                    min={4}
                    max={30}
                    value={numWords}
                    onChange={(e) => setNumWords(parseInt(e.target.value) || 15)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Separator</Label>
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Hyphen (-)</SelectItem>
                      <SelectItem value=" ">Space ( )</SelectItem>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value=".">Period (.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h4 className="font-medium">Password Settings</h4>
              <div className="space-y-2">
                <Label>Length</Label>
                <Input
                  type="number"
                  min={8}
                  max={64}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value) || 16)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="batch-uppercase"
                    checked={includeUppercase}
                    onCheckedChange={setIncludeUppercase}
                  />
                  <Label htmlFor="batch-uppercase">Uppercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="batch-lowercase"
                    checked={includeLowercase}
                    onCheckedChange={setIncludeLowercase}
                  />
                  <Label htmlFor="batch-lowercase">Lowercase</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="batch-numbers"
                    checked={includeNumbers}
                    onCheckedChange={setIncludeNumbers}
                  />
                  <Label htmlFor="batch-numbers">Numbers</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="batch-symbols"
                    checked={includeSymbols}
                    onCheckedChange={setIncludeSymbols}
                  />
                  <Label htmlFor="batch-symbols">Symbols</Label>
                </div>
              </div>
            </div>
          )}

          <Button onClick={generateBatch} className="w-full" disabled={isGenerating}>
            {isGenerating ? "Generating..." : `Generate ${quantity} ${batchType}s`}
          </Button>

          {generatedItems.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Generated {batchType}s ({generatedItems.length})</h4>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy All
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportAsText}>
                    <Download className="w-4 h-4 mr-1" />
                    TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportAsCSV}>
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearBatch}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <Textarea
                  value={generatedItems.map(item => item.value).join("\n")}
                  readOnly
                  className="font-mono text-sm"
                  rows={Math.min(10, generatedItems.length)}
                />
              </div>

              <div className="text-xs text-muted-foreground">
                Average entropy: {(generatedItems.reduce((sum, item) => sum + item.entropy, 0) / generatedItems.length).toFixed(1)} bits
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ProFeatureGuard>
  )
} 