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

// Helper to check if we're in a Chrome extension
// Use a function to ensure consistent behavior between server and client
export const isChromeExtension = (() => {
  if (typeof window === 'undefined') return false
  return !!(window.chrome?.runtime?.id)
})()

// Helper to get Pro status from Chrome storage
export const getChromeProStatus = async (): Promise<boolean> => {
  if (!isChromeExtension) return false
  return new Promise((resolve) => {
    window.chrome?.storage.local.get('quantumGuardPro', (result) => {
      resolve(result.quantumGuardPro === true)
    })
  })
}

// Helper to set Pro status in Chrome storage
export const setChromeProStatus = async (isPro: boolean): Promise<void> => {
  if (!isChromeExtension) return
  return new Promise((resolve) => {
    window.chrome?.storage.local.set({ quantumGuardPro: isPro }, () => {
      resolve()
    })
  })
}

// Helper to get Pro features from Chrome storage
export const getChromeProFeatures = async (): Promise<Record<string, boolean>> => {
  if (!isChromeExtension) return {}
  return new Promise((resolve) => {
    window.chrome?.storage.local.get('quantumGuardProFeatures', (result) => {
      resolve(result.quantumGuardProFeatures || {})
    })
  })
}

// Helper to set Pro features in Chrome storage
export const setChromeProFeatures = async (features: Record<string, boolean>): Promise<void> => {
  if (!isChromeExtension) return
  return new Promise((resolve) => {
    window.chrome?.storage.local.set({ quantumGuardProFeatures: features }, () => {
      resolve()
    })
  })
}

// Helper to activate Pro license in Chrome extension
export const activateChromePro = async (licenseKey: string): Promise<boolean> => {
  if (!isChromeExtension) return false

  try {
    // TODO: Implement actual license validation with Lemon Squeezy
    // For now, just check against a test key
    if (licenseKey === 'QUANTUMGUARD-TEST-PRO-2024') {
      await setChromeProStatus(true)
      await setChromeProFeatures({
        expandedWordlists: true,
        patternGeneration: true,
        mnemonicPhrases: true,
        advancedRandomStrings: true,
        savedPresets: true,
        batchGeneration: true,
        advancedStrengthViz: true,
        generationStats: true,
        premiumThemes: true,
      })
      return true
    }
    return false
  } catch (error) {
    console.error('Error activating Pro license:', error)
    return false
  }
}

// Helper to deactivate Pro license in Chrome extension
export const deactivateChromePro = async (): Promise<void> => {
  if (!isChromeExtension) return
  await setChromeProStatus(false)
  await setChromeProFeatures({})
} 