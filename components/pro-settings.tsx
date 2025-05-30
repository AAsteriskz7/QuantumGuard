import { useState } from "react"
import { usePro } from "@/lib/pro-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, CheckCircle2, XCircle } from "lucide-react"

export function ProSettings() {
  const { isProActive, activatePro, deactivatePro } = usePro()
  const [licenseKey, setLicenseKey] = useState("")
  const [isActivating, setIsActivating] = useState(false)
  const [activationError, setActivationError] = useState<string | null>(null)

  const handleActivate = async () => {
    setIsActivating(true)
    setActivationError(null)
    
    try {
      const success = await activatePro(licenseKey)
      if (!success) {
        setActivationError("Invalid license key. Please try again.")
      }
    } catch (error) {
      setActivationError("An error occurred while activating. Please try again.")
    } finally {
      setIsActivating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <CardTitle>QuantumGuard Pro</CardTitle>
        </div>
        <CardDescription>
          Unlock premium features and advanced security options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProActive ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-500">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Pro License Active</span>
            </div>
            <Button 
              variant="outline" 
              onClick={deactivatePro}
              className="w-full"
            >
              Deactivate Pro License
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="license-key">License Key</Label>
              <Input
                id="license-key"
                placeholder="Enter your license key"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
              />
              {activationError && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <XCircle className="w-4 h-4" />
                  <span>{activationError}</span>
                </div>
              )}
            </div>
            <Button 
              onClick={handleActivate}
              disabled={isActivating || !licenseKey}
              className="w-full"
            >
              {isActivating ? "Activating..." : "Activate Pro License"}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Pro Features Include:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Expanded wordlist selection</li>
            <li>• Pattern-based passphrase generation</li>
            <li>• Mnemonic phrase generation</li>
            <li>• Advanced random string controls</li>
            <li>• Saved generation presets</li>
            <li>• Batch generation & export</li>
            <li>• Advanced strength visualization</li>
            <li>• Generation statistics</li>
            <li>• Premium UI themes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 