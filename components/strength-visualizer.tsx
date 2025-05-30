import { useState, useEffect } from "react"
import { usePro } from "@/lib/pro-context"
import { useProFeature } from "@/lib/use-pro-feature"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Shield, Clock, Zap } from "lucide-react"

interface StrengthAnalysis {
  entropy: number
  classicalSecurity: string
  quantumResistance: number
  crackTimeClassical: string
  crackTimeQuantum: string
  attackScenarios: AttackScenario[]
  recommendations: string[]
}

interface AttackScenario {
  name: string
  description: string
  timeToBreak: string
  feasibility: "Low" | "Medium" | "High"
  color: string
}

export function StrengthVisualizer({ 
  password, 
  type = "password" 
}: { 
  password: string
  type?: "password" | "passphrase"
}) {
  const { isProActive } = usePro()
  const { checkProAccess, ProFeatureGuard } = useProFeature("Advanced Strength Visualization")
  const [analysis, setAnalysis] = useState<StrengthAnalysis | null>(null)

  useEffect(() => {
    if (password) {
      setAnalysis(analyzePassword(password, type))
    }
  }, [password, type])

  const analyzePassword = (pwd: string, pwdType: string): StrengthAnalysis => {
    // Calculate entropy based on type
    let entropy: number
    if (pwdType === "passphrase") {
      // Estimate words (rough calculation)
      const wordCount = pwd.split(/[\s\-_.]+/).length
      entropy = wordCount * 12.9 // EFF wordlist entropy per word
    } else {
      // Calculate charset entropy
      const hasLower = /[a-z]/.test(pwd)
      const hasUpper = /[A-Z]/.test(pwd)
      const hasDigit = /[0-9]/.test(pwd)
      const hasSymbol = /[^a-zA-Z0-9]/.test(pwd)
      
      let charset = 0
      if (hasLower) charset += 26
      if (hasUpper) charset += 26
      if (hasDigit) charset += 10
      if (hasSymbol) charset += 32 // Estimate
      
      entropy = pwd.length * Math.log2(charset)
    }

    const quantumResistance = entropy / 2

    // Time calculations (simplified estimates)
    const classicalTime = calculateCrackTime(entropy, "classical")
    const quantumTime = calculateCrackTime(quantumResistance, "quantum")

    // Attack scenarios
    const attackScenarios: AttackScenario[] = [
      {
        name: "Personal Computer",
        description: "Single desktop with GPU (10^9 guesses/sec)",
        timeToBreak: calculateAttackTime(entropy, 1e9),
        feasibility: entropy < 40 ? "High" : entropy < 60 ? "Medium" : "Low",
        color: entropy < 40 ? "#ef4444" : entropy < 60 ? "#f59e0b" : "#10b981"
      },
      {
        name: "Dedicated Hacker",
        description: "Specialized hardware (10^12 guesses/sec)",
        timeToBreak: calculateAttackTime(entropy, 1e12),
        feasibility: entropy < 50 ? "High" : entropy < 70 ? "Medium" : "Low",
        color: entropy < 50 ? "#ef4444" : entropy < 70 ? "#f59e0b" : "#10b981"
      },
      {
        name: "Nation State",
        description: "Government-level resources (10^15 guesses/sec)",
        timeToBreak: calculateAttackTime(entropy, 1e15),
        feasibility: entropy < 60 ? "High" : entropy < 80 ? "Medium" : "Low",
        color: entropy < 60 ? "#ef4444" : entropy < 80 ? "#f59e0b" : "#10b981"
      },
      {
        name: "Future Quantum",
        description: "Theoretical quantum computer (Grover's algorithm)",
        timeToBreak: calculateAttackTime(quantumResistance, 1e12),
        feasibility: quantumResistance < 40 ? "High" : quantumResistance < 60 ? "Medium" : "Low",
        color: quantumResistance < 40 ? "#ef4444" : quantumResistance < 60 ? "#f59e0b" : "#10b981"
      }
    ]

    // Recommendations
    const recommendations: string[] = []
    if (entropy < 50) {
      recommendations.push("Consider increasing length or complexity")
    }
    if (entropy < 80) {
      recommendations.push("Good for most uses, but consider longer for high-security needs")
    }
    if (quantumResistance < 60) {
      recommendations.push("May be vulnerable to future quantum attacks")
    }
    if (pwdType === "password" && pwd.length < 12) {
      recommendations.push("Passwords should be at least 12 characters")
    }
    if (pwdType === "passphrase" && pwd.split(/[\s\-_.]+/).length < 6) {
      recommendations.push("Consider using more words for better security")
    }

    return {
      entropy,
      classicalSecurity: getSecurityLevel(entropy),
      quantumResistance,
      crackTimeClassical: classicalTime,
      crackTimeQuantum: quantumTime,
      attackScenarios,
      recommendations
    }
  }

  const calculateCrackTime = (bits: number, type: "classical" | "quantum"): string => {
    const operations = Math.pow(2, bits - 1) // Average case
    const rate = type === "quantum" ? 1e12 : 1e12 // Operations per second
    
    const seconds = operations / rate
    return formatTime(seconds)
  }

  const calculateAttackTime = (bits: number, rate: number): string => {
    const operations = Math.pow(2, bits - 1)
    const seconds = operations / rate
    return formatTime(seconds)
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 1) return "Instant"
    if (seconds < 60) return `${Math.round(seconds)} seconds`
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`
    return `${(seconds / 31536000).toExponential(2)} years`
  }

  const getSecurityLevel = (bits: number): string => {
    if (bits < 50) return "Weak"
    if (bits < 80) return "Moderate"
    if (bits < 100) return "Strong"
    if (bits < 128) return "Very Strong"
    return "Excellent"
  }

  const getProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100
    if (percentage < 40) return "bg-red-500"
    if (percentage < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  if (!analysis) return null

  return (
    <ProFeatureGuard>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <CardTitle>Advanced Security Analysis</CardTitle>
          </div>
          <CardDescription>
            Comprehensive strength analysis and attack scenario modeling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entropy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{analysis.entropy.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Entropy (bits)</div>
              <Badge variant={analysis.entropy > 80 ? "default" : "secondary"}>
                {analysis.classicalSecurity}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Zap className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold">{analysis.quantumResistance.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Quantum Resistance</div>
              <Badge variant={analysis.quantumResistance > 60 ? "default" : "destructive"}>
                {analysis.quantumResistance > 60 ? "Resistant" : "Vulnerable"}
              </Badge>
            </div>
            
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <Clock className="w-8 h-8 mx-auto mb-2 text-teal-500" />
              <div className="text-sm font-medium">Classical Attack</div>
              <div className="text-lg">{analysis.crackTimeClassical}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Quantum: {analysis.crackTimeQuantum}
              </div>
            </div>
          </div>

          {/* Security Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Classical Security</span>
                <span className="text-sm text-muted-foreground">{analysis.entropy.toFixed(1)}/128 bits</span>
              </div>
              <Progress 
                value={Math.min((analysis.entropy / 128) * 100, 100)} 
                className="h-2"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Quantum Resistance</span>
                <span className="text-sm text-muted-foreground">{analysis.quantumResistance.toFixed(1)}/80 bits</span>
              </div>
              <Progress 
                value={Math.min((analysis.quantumResistance / 80) * 100, 100)} 
                className="h-2"
              />
            </div>
          </div>

          {/* Attack Scenarios */}
          <div>
            <h4 className="font-semibold mb-3">Attack Scenario Analysis</h4>
            <div className="space-y-3">
              {analysis.attackScenarios.map((scenario, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-muted-foreground">{scenario.description}</div>
                    </div>
                    <Badge 
                      variant={scenario.feasibility === "Low" ? "default" : 
                              scenario.feasibility === "Medium" ? "secondary" : "destructive"}
                    >
                      {scenario.feasibility} Risk
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <strong>Time to break:</strong> {scenario.timeToBreak}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Security Recommendations</h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
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