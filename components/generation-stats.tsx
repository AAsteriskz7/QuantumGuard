import { useState, useEffect } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BarChart, TrendingUp, Shield, Target, RotateCcw } from "lucide-react"

interface GenerationStats {
  totalGenerated: number
  passphraseCount: number
  passwordCount: number
  averageEntropyPassphrase: number
  averageEntropyPassword: number
  strongPasswordsGenerated: number
  weeklyGeneration: number[]
  lastWeekTotal: number
  securityScoreDistribution: {
    weak: number
    moderate: number
    strong: number
    excellent: number
  }
}

interface GenerationEvent {
  type: "passphrase" | "password"
  entropy: number
  timestamp: number
  securityLevel: "weak" | "moderate" | "strong" | "excellent"
}

const STORAGE_KEY = "quantumGuardStats"

export function GenerationStats({ onNewGeneration }: { onNewGeneration?: (event: GenerationEvent) => void }) {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Generation Statistics")
  const [stats, setStats] = useState<GenerationStats | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    loadStats()
  }, [isMounted])

  const loadStats = () => {
    if (!isMounted) return
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const events: GenerationEvent[] = JSON.parse(stored)
        setStats(calculateStats(events))
      } else {
        setStats(getEmptyStats())
      }
    } catch (error) {
      console.error("Error loading stats:", error)
      setStats(getEmptyStats())
    }
  }

  const getEmptyStats = (): GenerationStats => ({
    totalGenerated: 0,
    passphraseCount: 0,
    passwordCount: 0,
    averageEntropyPassphrase: 0,
    averageEntropyPassword: 0,
    strongPasswordsGenerated: 0,
    weeklyGeneration: new Array(7).fill(0),
    lastWeekTotal: 0,
    securityScoreDistribution: {
      weak: 0,
      moderate: 0,
      strong: 0,
      excellent: 0
    }
  })

  const calculateStats = (events: GenerationEvent[]): GenerationStats => {
    const now = Date.now()
    const weekAgo = now - (7 * 24 * 60 * 60 * 1000)
    
    // Filter recent events
    const recentEvents = events.filter(e => e.timestamp > weekAgo)
    
    // Calculate weekly distribution
    const weeklyGeneration = new Array(7).fill(0)
    recentEvents.forEach(event => {
      const dayIndex = Math.floor((now - event.timestamp) / (24 * 60 * 60 * 1000))
      if (dayIndex < 7) {
        weeklyGeneration[6 - dayIndex]++
      }
    })

    // Calculate averages
    const passphrases = events.filter(e => e.type === "passphrase")
    const passwords = events.filter(e => e.type === "password")
    
    const avgEntropyPassphrase = passphrases.length > 0 
      ? passphrases.reduce((sum, e) => sum + e.entropy, 0) / passphrases.length 
      : 0
    
    const avgEntropyPassword = passwords.length > 0 
      ? passwords.reduce((sum, e) => sum + e.entropy, 0) / passwords.length 
      : 0

    // Security distribution
    const securityScoreDistribution = {
      weak: events.filter(e => e.securityLevel === "weak").length,
      moderate: events.filter(e => e.securityLevel === "moderate").length,
      strong: events.filter(e => e.securityLevel === "strong").length,
      excellent: events.filter(e => e.securityLevel === "excellent").length,
    }

    return {
      totalGenerated: events.length,
      passphraseCount: passphrases.length,
      passwordCount: passwords.length,
      averageEntropyPassphrase: avgEntropyPassphrase,
      averageEntropyPassword: avgEntropyPassword,
      strongPasswordsGenerated: events.filter(e => e.entropy > 80).length,
      weeklyGeneration,
      lastWeekTotal: recentEvents.length,
      securityScoreDistribution
    }
  }

  const recordGeneration = (type: "passphrase" | "password", entropy: number) => {
    if (!isMounted || !checkProAccess("generationStats")) return

    const securityLevel = getSecurityLevel(entropy)
    const event: GenerationEvent = {
      type,
      entropy,
      timestamp: Date.now(),
      securityLevel
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const events: GenerationEvent[] = stored ? JSON.parse(stored) : []
      
      // Keep only last 1000 events to prevent storage bloat
      if (events.length >= 1000) {
        events.splice(0, events.length - 999)
      }
      
      events.push(event)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
      
      setStats(calculateStats(events))
      
      if (onNewGeneration) {
        onNewGeneration(event)
      }
    } catch (error) {
      console.error("Error recording generation:", error)
    }
  }

  const getSecurityLevel = (entropy: number): "weak" | "moderate" | "strong" | "excellent" => {
    if (entropy < 50) return "weak"
    if (entropy < 80) return "moderate"
    if (entropy < 120) return "strong"
    return "excellent"
  }

  const clearStats = () => {
    if (!isMounted) return
    
    if (confirm("Are you sure you want to clear all generation statistics? This action cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY)
      setStats(getEmptyStats())
    }
  }

  const getSecurityColor = (level: string) => {
    switch (level) {
      case "weak": return "text-red-500"
      case "moderate": return "text-yellow-500"
      case "strong": return "text-green-500"
      case "excellent": return "text-blue-500"
      default: return "text-gray-500"
    }
  }

  // Expose the recordGeneration function globally for other components
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      (window as any).recordQuantumGuardGeneration = recordGeneration
    }
  }, [isMounted])

  if (!stats) return null

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart className="w-5 h-5 text-indigo-500" />
              <CardTitle>Generation Statistics</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={clearStats}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
          <CardDescription>
            Privacy-preserving analytics of your password generation patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-blue-500">{stats.totalGenerated}</div>
              <div className="text-xs text-muted-foreground">Total Generated</div>
            </div>
            
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-green-500">{stats.lastWeekTotal}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-500">{stats.strongPasswordsGenerated}</div>
              <div className="text-xs text-muted-foreground">Strong (80+ bits)</div>
            </div>
            
            <div className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl font-bold text-teal-500">
                {stats.totalGenerated > 0 ? Math.round((stats.strongPasswordsGenerated / stats.totalGenerated) * 100) : 0}%
              </div>
              <div className="text-xs text-muted-foreground">Strong Rate</div>
            </div>
          </div>

          {/* Generation Types */}
          <div className="space-y-4">
            <h4 className="font-semibold">Generation Breakdown</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Passphrases</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.passphraseCount} ({stats.totalGenerated > 0 ? Math.round((stats.passphraseCount / stats.totalGenerated) * 100) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={stats.totalGenerated > 0 ? (stats.passphraseCount / stats.totalGenerated) * 100 : 0} 
                  className="h-2"
                />
                {stats.averageEntropyPassphrase > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Avg entropy: {stats.averageEntropyPassphrase.toFixed(1)} bits
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Passwords</span>
                  <span className="text-sm text-muted-foreground">
                    {stats.passwordCount} ({stats.totalGenerated > 0 ? Math.round((stats.passwordCount / stats.totalGenerated) * 100) : 0}%)
                  </span>
                </div>
                <Progress 
                  value={stats.totalGenerated > 0 ? (stats.passwordCount / stats.totalGenerated) * 100 : 0} 
                  className="h-2"
                />
                {stats.averageEntropyPassword > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Avg entropy: {stats.averageEntropyPassword.toFixed(1)} bits
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Security Level Distribution */}
          <div className="space-y-4">
            <h4 className="font-semibold">Security Level Distribution</h4>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.securityScoreDistribution).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className={`text-sm font-medium capitalize ${getSecurityColor(level)}`}>
                    {level}
                  </span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Activity */}
          <div className="space-y-4">
            <h4 className="font-semibold">Weekly Activity</h4>
            <div className="grid grid-cols-7 gap-1">
              {stats.weeklyGeneration.map((count, index) => {
                const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                const maxCount = Math.max(...stats.weeklyGeneration, 1)
                const height = Math.max((count / maxCount) * 40, 2)
                
                return (
                  <div key={index} className="text-center">
                    <div 
                      className="bg-blue-500 rounded-t mx-auto mb-1"
                      style={{ width: "16px", height: `${height}px` }}
                    />
                    <div className="text-xs text-muted-foreground">{dayNames[index]}</div>
                    <div className="text-xs font-medium">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="text-xs text-muted-foreground p-3 bg-muted/20 rounded-lg">
            <Shield className="w-4 h-4 inline mr-2" />
            <strong>Privacy Note:</strong> Only generation patterns and entropy levels are stored locally. 
            Actual passwords and passphrases are never saved or transmitted.
          </div>
        </CardContent>
      </Card>
    </ProFeatureGuard>
  )
} 