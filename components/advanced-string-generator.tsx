import { useState } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyRound, Settings } from "lucide-react"

const CHARACTER_SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similar: "il1Lo0O", // Characters that look similar
  ambiguous: "{}[]()/\\'\"`~,;:.<>", // Characters that might be ambiguous
}

const PATTERNS = {
  "CVCVCV": "Consonant-Vowel Pattern",
  "CVCNumCVC": "Mixed with Numbers",
  "CVC-Sym-CVC": "With Symbols",
  "custom": "Custom Pattern",
}

export function AdvancedStringGenerator() {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Advanced Random Strings")
  const [length, setLength] = useState(16)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [customChars, setCustomChars] = useState("")
  const [selectedPattern, setSelectedPattern] = useState("")
  const [customPattern, setCustomPattern] = useState("")
  const [generatedString, setGeneratedString] = useState("")

  const getCharacterSet = () => {
    let chars = ""
    if (useLowercase) chars += CHARACTER_SETS.lowercase
    if (useUppercase) chars += CHARACTER_SETS.uppercase
    if (useNumbers) chars += CHARACTER_SETS.numbers
    if (useSymbols) chars += CHARACTER_SETS.symbols

    if (excludeSimilar) {
      CHARACTER_SETS.similar.split("").forEach(char => {
        chars = chars.replace(char, "")
      })
    }

    if (excludeAmbiguous) {
      CHARACTER_SETS.ambiguous.split("").forEach(char => {
        chars = chars.replace(char, "")
      })
    }

    if (customChars) {
      chars = customChars
    }

    return chars
  }

  const generateRandomString = () => {
    const chars = getCharacterSet()
    if (!chars) return

    let result = ""
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }

    setGeneratedString(result)
  }

  const generateFromPattern = (pattern: string) => {
    const consonants = "bcdfghjklmnpqrstvwxyz"
    const vowels = "aeiou"
    const numbers = "0123456789"
    const symbols = "!@#$%^&*"

    let result = ""
    for (let i = 0; i < pattern.length; i++) {
      const char = pattern[i]
      switch (char) {
        case "C":
          result += consonants[Math.floor(Math.random() * consonants.length)]
          break
        case "V":
          result += vowels[Math.floor(Math.random() * vowels.length)]
          break
        case "N":
          result += numbers[Math.floor(Math.random() * numbers.length)]
          break
        case "S":
          result += symbols[Math.floor(Math.random() * symbols.length)]
          break
        default:
          result += char
      }
    }
    return result
  }

  const handlePatternSelect = (value: string) => {
    setSelectedPattern(value)
    if (value === "custom") {
      setGeneratedString("")
    } else {
      const result = generateFromPattern(value)
      setGeneratedString(result)
    }
  }

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-orange-500" />
            <CardTitle>Advanced String Generator</CardTitle>
          </div>
          <CardDescription>
            Generate random strings with advanced customization options
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Length: {length}</Label>
              </div>
              <Slider
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="lowercase"
                  checked={useLowercase}
                  onCheckedChange={setUseLowercase}
                />
                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="uppercase"
                  checked={useUppercase}
                  onCheckedChange={setUseUppercase}
                />
                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="numbers"
                  checked={useNumbers}
                  onCheckedChange={setUseNumbers}
                />
                <Label htmlFor="numbers">Numbers (0-9)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="symbols"
                  checked={useSymbols}
                  onCheckedChange={setUseSymbols}
                />
                <Label htmlFor="symbols">Symbols (!@#$)</Label>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="exclude-similar"
                  checked={excludeSimilar}
                  onCheckedChange={setExcludeSimilar}
                />
                <Label htmlFor="exclude-similar">Exclude Similar (i,l,1,L,o,0,O)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="exclude-ambiguous"
                  checked={excludeAmbiguous}
                  onCheckedChange={setExcludeAmbiguous}
                />
                <Label htmlFor="exclude-ambiguous">Exclude Ambiguous ({`{}[]()/\\'"\`~,;:.<>`})</Label>
              </div>
            </div>

            {isProActive && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Custom Character Set</Label>
                  <Input
                    placeholder="Enter custom characters to use"
                    value={customChars}
                    onChange={(e) => setCustomChars(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pattern-Based Generation</Label>
                  <Select value={selectedPattern} onValueChange={handlePatternSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PATTERNS).map(([key, name]) => (
                        <SelectItem key={key} value={key}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedPattern === "custom" && (
                    <div className="space-y-2">
                      <Input
                        placeholder="e.g., CVCVCV (C=Consonant, V=Vowel)"
                        value={customPattern}
                        onChange={(e) => setCustomPattern(e.target.value)}
                      />
                      <Button
                        onClick={() => setGeneratedString(generateFromPattern(customPattern))}
                        className="w-full"
                      >
                        Generate from Pattern
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Button onClick={generateRandomString} className="w-full">
              Generate Random String
            </Button>

            {generatedString && (
              <div className="space-y-2">
                <Label>Generated String</Label>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-mono text-sm break-all">{generatedString}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </ProFeatureGuard>
  )
} 