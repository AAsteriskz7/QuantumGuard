import { useState } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2 } from "lucide-react"

// Placeholder wordlists for different word types
const WORDLISTS = {
  adjectives: ["quick", "brave", "calm", "eager", "fierce", "gentle", "happy", "kind", "lively", "mighty"],
  nouns: ["bear", "cloud", "dragon", "eagle", "fox", "ghost", "heart", "ice", "jewel", "knight"],
  verbs: ["run", "jump", "fly", "swim", "dance", "sing", "paint", "write", "build", "create"],
  numbers: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  symbols: ["!", "@", "#", "$", "%", "&", "*", "+", "=", "?"],
}

const PATTERNS = {
  "adj-noun-verb": "Adjective-Noun-Verb",
  "noun-verb-noun": "Noun-Verb-Noun",
  "adj-noun-num": "Adjective-Noun-Number",
  "noun-symbol-noun": "Noun-Symbol-Noun",
  "adj-noun-verb-num": "Adjective-Noun-Verb-Number",
  "noun-verb-adj-noun": "Noun-Verb-Adjective-Noun",
  "custom": "Custom Pattern",
}

export function PatternGenerator({ onGenerate }: { onGenerate: (pattern: string) => void }) {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Pattern-Based Generation")
  const [selectedPattern, setSelectedPattern] = useState("adj-noun-verb")
  const [customPattern, setCustomPattern] = useState("")
  const [generatedPattern, setGeneratedPattern] = useState("")

  const generateFromPattern = (pattern: string) => {
    const parts = pattern.split("-")
    const result = parts.map(part => {
      const wordlist = WORDLISTS[part as keyof typeof WORDLISTS]
      if (!wordlist) return part
      const randomIndex = Math.floor(Math.random() * wordlist.length)
      return wordlist[randomIndex]
    })
    return result.join(" ")
  }

  const handlePatternSelect = (value: string) => {
    setSelectedPattern(value)
    if (value === "custom") {
      setGeneratedPattern("")
    } else {
      const pattern = PATTERNS[value as keyof typeof PATTERNS]
      const result = generateFromPattern(value)
      setGeneratedPattern(result)
      onGenerate(result)
    }
  }

  const handleCustomPattern = () => {
    if (!customPattern) return
    const result = generateFromPattern(customPattern)
    setGeneratedPattern(result)
    onGenerate(result)
  }

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-purple-500" />
            <CardTitle>Pattern Generator</CardTitle>
          </div>
          <CardDescription>
            Generate passphrases based on grammatical patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Pattern</Label>
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
          </div>

          {selectedPattern === "custom" && (
            <div className="space-y-2">
              <Label>Custom Pattern</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., adj-noun-verb-num"
                  value={customPattern}
                  onChange={(e) => setCustomPattern(e.target.value)}
                />
                <Button onClick={handleCustomPattern}>
                  Generate
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Available parts: adj, noun, verb, num, symbol
              </p>
            </div>
          )}

          {generatedPattern && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-mono">{generatedPattern}</p>
            </div>
          )}

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Pattern Examples:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• brave-dragon-fly</li>
              <li>• cloud-jump-bear</li>
              <li>• fierce-eagle-7</li>
              <li>• ghost-?-heart</li>
              <li>• happy-fox-dance-3</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </ProFeatureGuard>
  )
} 