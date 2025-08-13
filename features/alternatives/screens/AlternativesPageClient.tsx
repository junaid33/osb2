'use client';

import React from 'react'
import { HeroSection } from '../components/HeroSection'
import { EventsSection } from '../components/EventsSection'
import { Sidebar } from '../components/Sidebar'

interface AlternativesPageClientProps {
  proprietary: string;
  slug: string;
}


export function AlternativesPageClient({ proprietary, slug }: AlternativesPageClientProps) {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <HeroSection />
      <div className="container mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <EventsSection />
        </div>
        <div className="md:w-1/3">
          <Sidebar />
        </div>
      </div>
    </div>
  )
}