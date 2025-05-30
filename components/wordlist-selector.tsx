import { useState, useEffect } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

// Placeholder wordlists - these would be imported from actual files
const WORDLISTS = {
  effLong: {
    name: "EFF Long Wordlist",
    description: "The standard EFF Long Wordlist (7776 words)",
    isPro: false,
  },
  effShort: {
    name: "EFF Short Wordlist",
    description: "The EFF Short Wordlist (1296 words)",
    isPro: true,
  },
  technical: {
    name: "Technical Terms",
    description: "Specialized technical terminology",
    isPro: true,
  },
  nature: {
    name: "Nature Words",
    description: "Words from nature and the environment",
    isPro: true,
  },
  spanish: {
    name: "Spanish Diceware",
    description: "Spanish language wordlist",
    isPro: true,
  },
}

export function WordlistSelector({ onSelect }: { onSelect: (wordlist: string) => void }) {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Expanded Wordlists")
  const [selectedWordlist, setSelectedWordlist] = useState("effLong")
  const [customWordlistName, setCustomWordlistName] = useState("")
  const [showCustomUpload, setShowCustomUpload] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleWordlistSelect = (value: string) => {
    const wordlist = WORDLISTS[value as keyof typeof WORDLISTS]
    if (wordlist.isPro && !isProActive) {
      if (checkProAccess("expandedWordlists")) {
        setSelectedWordlist(value)
        onSelect(value)
      }
    } else {
      setSelectedWordlist(value)
      onSelect(value)
    }
  }

  const handleCustomUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted) return // Don't access localStorage until after hydration
    
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        const words = content.split("\n").filter(word => word.trim())
        // Store in localStorage for now
        localStorage.setItem(`customWordlist_${customWordlistName}`, JSON.stringify(words))
        setShowCustomUpload(false)
        setCustomWordlistName("")
      }
      reader.readAsText(file)
    }
  }

  return (
    <ProFeatureGuard>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Wordlist Source</Label>
          <Select value={selectedWordlist} onValueChange={handleWordlistSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a wordlist" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(WORDLISTS).map(([key, list]) => (
                <SelectItem 
                  key={key} 
                  value={key}
                  className={list.isPro ? "text-yellow-500" : ""}
                >
                  {list.name}
                  {list.isPro && " (Pro)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {WORDLISTS[selectedWordlist as keyof typeof WORDLISTS].description}
          </p>
        </div>

        {isProActive && (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowCustomUpload(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Custom Wordlist
            </Button>

            {showCustomUpload && (
              <div className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Name your wordlist"
                  value={customWordlistName}
                  onChange={(e) => setCustomWordlistName(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".txt"
                    onChange={handleCustomUpload}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomUpload(false)}
                  >
                    Cancel
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload a text file with one word per line
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </ProFeatureGuard>
  )
} 