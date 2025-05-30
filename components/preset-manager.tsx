import { useState, useEffect } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Trash2, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Preset {
  id: string
  name: string
  type: "passphrase" | "pattern" | "string" | "mnemonic"
  settings: Record<string, any>
}

export function PresetManager({ 
  currentSettings,
  onLoadPreset,
}: { 
  currentSettings: Record<string, any>
  onLoadPreset: (settings: Record<string, any>) => void
}) {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Saved Presets")
  const [presets, setPresets] = useState<Preset[]>([])
  const [newPresetName, setNewPresetName] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<string>("")
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return // Don't access localStorage until after hydration
    
    // Load presets from localStorage
    const stored = localStorage.getItem("quantumGuardPresets")
    if (stored) {
      setPresets(JSON.parse(stored))
    }
  }, [isMounted])

  const savePreset = () => {
    if (!newPresetName || !isMounted) return

    const newPreset: Preset = {
      id: Date.now().toString(),
      name: newPresetName,
      type: currentSettings.type || "passphrase",
      settings: { ...currentSettings },
    }

    const updatedPresets = [...presets, newPreset]
    setPresets(updatedPresets)
    localStorage.setItem("quantumGuardPresets", JSON.stringify(updatedPresets))
    setNewPresetName("")
    setShowSaveDialog(false)
  }

  const deletePreset = (id: string) => {
    if (!isMounted) return
    
    const updatedPresets = presets.filter(p => p.id !== id)
    setPresets(updatedPresets)
    localStorage.setItem("quantumGuardPresets", JSON.stringify(updatedPresets))
    if (selectedPreset === id) {
      setSelectedPreset("")
    }
  }

  const loadPreset = (id: string) => {
    const preset = presets.find(p => p.id === id)
    if (preset) {
      onLoadPreset(preset.settings)
      setSelectedPreset(id)
    }
  }

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <CardTitle>Saved Presets</CardTitle>
          </div>
          <CardDescription>
            Save and load your favorite generation settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Load Preset</Label>
            <Select value={selectedPreset} onValueChange={loadPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {presets.map(preset => (
                  <SelectItem key={preset.id} value={preset.id}>
                    {preset.name} ({preset.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Current Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Preset</DialogTitle>
                <DialogDescription>
                  Give your preset a name to save your current settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Preset Name</Label>
                  <Input
                    placeholder="e.g., My Secure Passphrase"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                  />
                </div>
                <Button onClick={savePreset} className="w-full">
                  Save Preset
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {presets.length > 0 && (
            <div className="space-y-2">
              <Label>Your Presets</Label>
              <div className="space-y-2">
                {presets.map(preset => (
                  <div
                    key={preset.id}
                    className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{preset.name}</p>
                      <p className="text-sm text-muted-foreground">{preset.type}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePreset(preset.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </ProFeatureGuard>
  )
} 