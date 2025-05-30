"use client"
import { ProSettings } from "@/components/pro-settings"

export default function ProPage() {
  return (
    <div className="py-12 max-w-4xl mx-auto">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold">QuantumGuard Pro</h1>
        <p className="text-muted-foreground">
          Manage your Pro license and unlock premium features for advanced password generation
        </p>
      </section>

      <ProSettings />
    </div>
  )
} 