import { useState, ReactNode, useEffect } from 'react'
import { usePro } from './pro-context'
import { ProUpgradeModal } from '@/components/pro-upgrade-modal'
import { isChromeExtension, getChromeProStatus, getChromeProFeatures } from './chrome-pro'

// Chrome extension types
declare global {
  interface Window {
    chrome?: {
      runtime: {
        id: string;
      };
      storage: {
        local: {
          get: (key: string, callback: (result: any) => void) => void;
          set: (items: object, callback?: () => void) => void;
        };
      };
    };
  }
}

type ProFeatureGuardProps = {
  children: ReactNode
}

type ProFeatureHook = {
  checkProAccess: (feature: string) => boolean
  ProFeatureGuard: React.FC<ProFeatureGuardProps>
}

export function useProFeature(featureName: string): ProFeatureHook {
  const { isProActive, proFeatures } = usePro()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [chromeProActive, setChromeProActive] = useState(false)
  const [chromeFeatures, setChromeFeatures] = useState<Record<string, boolean>>({})
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Check Chrome extension Pro status on mount
  useEffect(() => {
    if (!isMounted) return // Don't run until after hydration

    const checkProStatus = async () => {
      if (isChromeExtension) {
        const [proStatus, features] = await Promise.all([
          getChromeProStatus(),
          getChromeProFeatures()
        ])
        setChromeProActive(proStatus)
        setChromeFeatures(features)
      }
    }
    checkProStatus()
  }, [isMounted])

  const checkProAccess = (feature: string): boolean => {
    if (!isMounted) return false // Don't allow access before hydration

    const hasAccess = isChromeExtension 
      ? (chromeProActive && chromeFeatures[feature])
      : (isProActive && proFeatures[feature as keyof typeof proFeatures])

    if (!hasAccess) {
      setShowUpgradeModal(true)
      return false
    }
    return true
  }

  const ProFeatureGuard: React.FC<ProFeatureGuardProps> = ({ children }) => {
    return (
      <div>
        {children}
        <ProUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          featureName={featureName}
        />
      </div>
    )
  }

  return {
    checkProAccess,
    ProFeatureGuard,
  }
} 