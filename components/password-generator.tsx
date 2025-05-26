"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, RefreshCw, Shield, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(32)
  const [password, setPassword] = useState<string>("")
  const [entropy, setEntropy] = useState<number>(0)
  const [quantumEntropy, setQuantumEntropy] = useState<number>(0)
  const [copied, setCopied] = useState<boolean>(false)
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // Character set options
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true)
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true)
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true)
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true)

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const numberChars = "0123456789"
  const symbolChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?"

  const generatePassword = () => {
    setIsGenerating(true)

    setTimeout(() => {
      try {
        let charset = ""
        if (includeUppercase) charset += uppercaseChars
        if (includeLowercase) charset += lowercaseChars
        if (includeNumbers) charset += numberChars
        if (includeSymbols) charset += symbolChars

        if (charset.length === 0) {
          alert("Please select at least one character type")
          setIsGenerating(false)
          return
        }

        let result = ""
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(
            (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) * charset.length,
          )
          result += charset[randomIndex]
        }

        setPassword(result)

        // Calculate entropy only when password is generated
        const calculatedEntropy = length * Math.log2(charset.length)
        setEntropy(calculatedEntropy)
        setQuantumEntropy(calculatedEntropy / 2)
      } catch (error) {
        console.error("Error generating password:", error)
      } finally {
        setIsGenerating(false)
      }
    }, 300)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getEntropyDescription = (bits: number) => {
    if (bits < 50) return "Weak"
    if (bits < 80) return "Moderate"
    if (bits < 100) return "Strong"
    if (bits < 128) return "Very Strong"
    if (bits < 150) return "Excellent"
    return "Maximum Security"
  }

  const getEntropyColor = (bits: number) => {
    if (bits < 50) return "text-red-500"
    if (bits < 80) return "text-yellow-500"
    if (bits < 100) return "text-green-500"
    if (bits < 128) return "text-blue-500"
    if (bits < 150) return "text-teal-400"
    return "text-purple-400"
  }

  const getQuantumResistanceLabel = (bits: number) => {
    if (bits < 40) return "Quantum Vulnerable"
    if (bits < 64) return "Quantum Moderate"
    if (bits < 80) return "Quantum Robust"
    if (bits < 100) return "Quantum Excellent"
    return "Quantum Maximum"
  }

  const getSecurityGuidance = (len: number) => {
    if (len < 16) return "Too Short - Increase length for better security"
    if (len < 25) return "Basic Security - Consider longer for quantum resistance"
    if (len < 32) return "Good Security - Quantum Moderate"
    if (len < 40) return "Strong Security - Quantum Robust"
    return "Maximum Security - Quantum Excellent"
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="length">Password Length: {length}</Label>
              <span className="text-sm text-muted-foreground">{getSecurityGuidance(length)}</span>
            </div>
            <div className="flex items-center gap-4">
              <Slider
                id="length"
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                className="flex-1"
              />
              <Input
                type="number"
                min={8}
                max={64}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-16"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Character Types</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="uppercase" 
                  checked={includeUppercase} 
                  onCheckedChange={(checked) => setIncludeUppercase(checked === true)} 
                />
                <Label htmlFor="uppercase" className="text-sm">
                  Uppercase (A-Z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lowercase" 
                  checked={includeLowercase} 
                  onCheckedChange={(checked) => setIncludeLowercase(checked === true)} 
                />
                <Label htmlFor="lowercase" className="text-sm">
                  Lowercase (a-z)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="numbers" 
                  checked={includeNumbers} 
                  onCheckedChange={(checked) => setIncludeNumbers(checked === true)} 
                />
                <Label htmlFor="numbers" className="text-sm">
                  Numbers (0-9)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="symbols" 
                  checked={includeSymbols} 
                  onCheckedChange={(checked) => setIncludeSymbols(checked === true)} 
                />
                <Label htmlFor="symbols" className="text-sm">
                  Symbols (!@#$...)
                </Label>
              </div>
            </div>
          </div>

          <Button onClick={generatePassword} className="w-full bg-blue-500 hover:bg-blue-600" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Password"
            )}
          </Button>
        </div>

        {password && (
          <div className="space-y-6">
            <div className="p-4 border rounded-lg bg-muted/30">
              <Label htmlFor="password" className="mb-2 block text-sm font-medium">
                Your Generated Password
              </Label>
              <div className="flex">
                <Input id="password" value={password} readOnly className="font-mono text-sm" />
                <Button variant="outline" size="icon" className="ml-2" onClick={copyToClipboard}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg bg-blue-900/20">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  <h3 className="text-sm font-medium">Classical Entropy</h3>
                </div>
                <p className="text-2xl font-bold">
                  <span className={getEntropyColor(entropy)}>{entropy.toFixed(1)} bits</span>
                </p>
                <p className="text-sm text-muted-foreground">{getEntropyDescription(entropy)}</p>
              </div>

              <div className="p-4 border rounded-lg bg-teal-900/20">
                <div className="flex items-center mb-2">
                  <Shield className="w-4 h-4 mr-2 text-teal-500" />
                  <h3 className="text-sm font-medium">Quantum Resistance</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3 h-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Strength estimate against potential future attacks from quantum computers using Grover's
                        Algorithm. Higher is better.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-2xl font-bold">
                  <span className={getEntropyColor(quantumEntropy)}>{quantumEntropy.toFixed(1)} bits</span>
                </p>
                <p className="text-sm text-muted-foreground">{getQuantumResistanceLabel(quantumEntropy)}</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-900/10 to-purple-900/10">
              <h3 className="mb-4 text-lg font-medium">🔐 Perfect for Password Managers</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This high-entropy password is ideal for accounts where memorability isn't needed. Store it securely in
                your password manager.
              </p>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  💡 Pro Tip: Use unique passwords like this for every account, managed by a password manager secured
                  with a memorable QuantumGuard passphrase!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
