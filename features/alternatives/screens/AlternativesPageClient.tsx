'use client';

import React, { useState } from 'react'
import { HeroSection } from '../components/HeroSection'
import { EventsSection } from '../components/EventsSection'
import NoiseBackground from '../components/NoiseBackground'
import StatsCard from '../components/StatsCard'
import { DataTableDrawer } from '@/components/ui/DataTableDrawer'
import type { ProprietaryApp } from '../actions/getAlternatives'

interface AlternativesPageClientProps {
  proprietaryApp: ProprietaryApp;
  slug: string;
}

export function AlternativesPageClient({ proprietaryApp, slug }: AlternativesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="relative flex flex-col min-h-screen text-foreground pt-16 md:pt-20">
      {/* Full-page noise background */}
      <div className="absolute inset-0 w-full h-full">
        <NoiseBackground 
          color={proprietaryApp.simpleIconColor || "#10b981"}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <HeroSection 
          proprietaryApp={proprietaryApp} 
        />
        <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8 max-w-5xl">
          <div className="md:w-2/3">
            <EventsSection 
              alternatives={proprietaryApp.openSourceAlternatives}
              proprietaryCapabilities={proprietaryApp.capabilities}
            />
          </div>
          <div className="md:w-1/3 space-y-6">
            <StatsCard 
              capabilities={proprietaryApp.capabilities}
              openSourceAlternatives={proprietaryApp.openSourceAlternatives}
              onOpenDrawer={() => setDrawerOpen(true)}
            />
          </div>
        </div>
      </div>
      
      <DataTableDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}