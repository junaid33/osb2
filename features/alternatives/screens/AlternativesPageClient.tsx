'use client';

import React from 'react'
import { HeroSection } from '../components/HeroSection'
import { EventsSection } from '../components/EventsSection'
import { Sidebar } from '../components/Sidebar'
import type { ProprietaryApp } from '../actions/getAlternatives'

interface AlternativesPageClientProps {
  proprietaryApp: ProprietaryApp;
  slug: string;
}

export function AlternativesPageClient({ proprietaryApp, slug }: AlternativesPageClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <HeroSection 
        proprietaryApp={proprietaryApp} 
      />
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <EventsSection 
            alternatives={proprietaryApp.openSourceAlternatives} 
          />
        </div>
        <div className="md:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}