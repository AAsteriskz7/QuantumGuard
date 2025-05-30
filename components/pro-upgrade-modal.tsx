import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Crown, Lock, Sparkles } from "lucide-react"

interface ProUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  featureName: string
}

export function ProUpgradeModal({ isOpen, onClose, featureName }: ProUpgradeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <DialogTitle>Pro Feature</DialogTitle>
          </div>
          <DialogDescription>
            This feature is available exclusively to QuantumGuard Pro users
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
            <Lock className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="font-medium mb-1">{featureName}</h4>
              <p className="text-sm text-muted-foreground">
                Upgrade to Pro to unlock this and many other premium features
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Pro Benefits Include:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Expanded wordlist selection</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Pattern-based passphrase generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Mnemonic phrase generation</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>Advanced random string controls</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>And much more...</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Maybe Later
            </Button>
            <Button className="flex-1">
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 