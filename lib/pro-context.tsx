"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { isChromeExtension, getChromeProStatus, getChromeProFeatures, activateChromePro, deactivateChromePro } from './chrome-pro'

// Test key for development - replace with actual Lemon Squeezy validation later
const TEST_PRO_KEY = 'QUANTUMGUARD-TEST-PRO-2024'

type ProFeatures = {
  expandedWordlists: boolean
  patternGeneration: boolean
  mnemonicPhrases: boolean
  advancedRandomStrings: boolean
  savedPresets: boolean
  batchGeneration: boolean
  advancedStrengthViz: boolean
  generationStats: boolean
  premiumThemes: boolean
}

interface ProContextType {
  isProActive: boolean
  activatePro: (key: string) => Promise<boolean>
  deactivatePro: () => Promise<void>
  proFeatures: ProFeatures
}

const DEFAULT_FEATURES: ProFeatures = {
  expandedWordlists: false,
  patternGeneration: false,
  mnemonicPhrases: false,
  advancedRandomStrings: false,
  savedPresets: false,
  batchGeneration: false,
  advancedStrengthViz: false,
  generationStats: false,
  premiumThemes: false,
}

const ALL_FEATURES: ProFeatures = {
  expandedWordlists: true,
  patternGeneration: true,
  mnemonicPhrases: true,
  advancedRandomStrings: true,
  savedPresets: true,
  batchGeneration: true,
  advancedStrengthViz: true,
  generationStats: true,
  premiumThemes: true,
}

const ProContext = createContext<ProContextType | undefined>(undefined)

export function ProProvider({ children }: { children: ReactNode }) {
  const [isProActive, setIsProActive] = useState(false)
  const [proFeatures, setProFeatures] = useState<ProFeatures>(DEFAULT_FEATURES)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return // Don't run until after hydration

    const checkProStatus = async () => {
      if (isChromeExtension) {
        const [proStatus, features] = await Promise.all([
          getChromeProStatus(),
          getChromeProFeatures()
        ])
        setIsProActive(proStatus)
        // Ensure all required features are present
        setProFeatures({
          ...DEFAULT_FEATURES,
          ...features,
        })
      } else {
        // Check localStorage for existing Pro status
        const storedProStatus = localStorage.getItem('quantumGuardPro')
        if (storedProStatus === 'true') {
          setIsProActive(true)
          setProFeatures(ALL_FEATURES)
        }
      }
    }
    checkProStatus()
  }, [isMounted])

  const activatePro = async (key: string): Promise<boolean> => {
    if (!isMounted) return false // Don't allow activation before hydration

    if (isChromeExtension) {
      const success = await activateChromePro(key)
      if (success) {
        setIsProActive(true)
        const features = await getChromeProFeatures()
        setProFeatures({ ...DEFAULT_FEATURES, ...features })
      }
      return success
    }

    // For web app, check against test key
    // Later this will validate with Lemon Squeezy
    if (key === TEST_PRO_KEY) {
      localStorage.setItem('quantumGuardPro', 'true')
      setIsProActive(true)
      setProFeatures(ALL_FEATURES)
      return true
    }
    return false
  }

  const deactivatePro = async (): Promise<void> => {
    if (!isMounted) return // Don't allow deactivation before hydration

    if (isChromeExtension) {
      await deactivateChromePro()
    } else {
      localStorage.removeItem('quantumGuardPro')
    }
    setIsProActive(false)
    setProFeatures(DEFAULT_FEATURES)
  }

  return (
    <ProContext.Provider value={{ isProActive, activatePro, deactivatePro, proFeatures }}>
      {children}
    </ProContext.Provider>
  )
}

export function usePro() {
  const context = useContext(ProContext)
  if (context === undefined) {
    throw new Error('usePro must be used within a ProProvider')
  }
  return context
}

// Utility function to check if a feature is available
export function isFeatureAvailable(feature: keyof ProFeatures): boolean {
  const { isProActive, proFeatures } = usePro()
  return isProActive && proFeatures[feature]
}

// Component to wrap Pro-only features
export function ProFeature({ 
  feature, 
  children, 
  fallback 
}: { 
  feature: keyof ProFeatures
  children: ReactNode
  fallback?: ReactNode 
}) {
  const { isProActive, proFeatures } = usePro()
  
  if (!isProActive || !proFeatures[feature]) {
    return fallback || null
  }
  
  return <>{children}</>
} 