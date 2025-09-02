import React from 'react'
import { Settings, Database, CreditCard, Package, Zap, Shield } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PinList, type PinListItem } from './PinList'
import type { Capability } from '../actions/getAlternatives'

interface CapabilitiesSidebarProps {
  capabilities: Capability[]
}

function getCapabilityIcon(name: string) {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('payment') || lowerName.includes('currency')) return CreditCard
  if (lowerName.includes('database') || lowerName.includes('storage')) return Database
  if (lowerName.includes('package') || lowerName.includes('inventory')) return Package
  if (lowerName.includes('performance') || lowerName.includes('speed')) return Zap
  if (lowerName.includes('security') || lowerName.includes('auth')) return Shield
  return Settings
}

function formatUptime(capabilityId: string): string {
  // Use capability ID to generate consistent values
  const hash = Array.from(capabilityId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const days = (hash % 150) + 50
  const hours = (hash % 24)
  const minutes = (hash % 60)
  return `Up · ${days}d ${hours}h ${minutes}m`
}

function getVersionNumber(capabilityId: string, complexity?: string): string {
  // Generate consistent version numbers based on capability ID
  const hash = Array.from(capabilityId).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const qualityScore = complexity === 'advanced' ? 9 : complexity === 'intermediate' ? 8 : 7
  const minor = hash % 10
  return `v${qualityScore}.${minor}`
}

export function CapabilitiesSidebar({ capabilities }: CapabilitiesSidebarProps) {
  // Transform capabilities to PinList format
  const pinListItems: PinListItem[] = capabilities.map((capability, index) => ({
    id: index, // Use index as ID to avoid conversion issues
    name: capability.name,
    info: `${getVersionNumber(capability.id, capability.complexity)} · ${formatUptime(capability.id)}`,
    icon: getCapabilityIcon(capability.name),
    pinned: index < 2, // Pin first 2 items by default for demo
  }))

  if (capabilities.length === 0) {
    return (
      <Card className="border border-border bg-background p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Compatibilities</h3>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No compatibilities available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border border-border bg-background p-4">
      <h3 className="text-lg font-medium text-foreground mb-4">Compatibilities</h3>
      <PinList 
        items={pinListItems}
        labels={{
          pinned: 'Pinned Compatibilities',
          unpinned: 'All Compatibilities'
        }}
        className="space-y-6"
        labelClassName="text-foreground text-sm font-medium"
      />
    </Card>
  )
}