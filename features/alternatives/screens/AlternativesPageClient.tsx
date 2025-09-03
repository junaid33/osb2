'use client';

import React, { useState, useEffect } from 'react'
import { HeroSection } from '../components/HeroSection'
import { EventsSection } from '../components/EventsSection'
import NoiseBackground from '../components/NoiseBackground'
import StatsCard from '../components/StatsCard'
import { DataTableDrawer } from '@/components/ui/DataTableDrawer'
import type { ProprietaryApp } from '../actions/getAlternatives'
import { request } from 'graphql-request'

interface AlternativesPageClientProps {
  proprietaryApp: ProprietaryApp;
  slug: string;
}

const GET_ALL_OPEN_SOURCE_APPS = `
  query GetAllOpenSourceApps {
    openSourceApplications(
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      repositoryUrl
      websiteUrl
      simpleIconSlug
      simpleIconColor
      capabilities {
        capability {
          id
          name
          slug
          description
          category
          complexity
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`;

export function AlternativesPageClient({ proprietaryApp, slug }: AlternativesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [apps, setApps] = useState([])
  const [selectedCapabilities, setSelectedCapabilities] = useState([])

  useEffect(() => {
    const loadApps = async () => {
      try {
        const data = await request('/api/graphql', GET_ALL_OPEN_SOURCE_APPS);
        setApps(data.openSourceApplications);
      } catch (error) {
        console.error('Error loading apps:', error);
      }
    };
    loadApps();
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pinnedCapabilities');
      if (saved) {
        setSelectedCapabilities(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading capabilities:', error);
    }
  }, []);

  const handleSelectedCapabilitiesChange = (capabilities) => {
    setSelectedCapabilities(capabilities);
    try {
      localStorage.setItem('pinnedCapabilities', JSON.stringify(capabilities));
    } catch (error) {
      console.error('Error saving capabilities:', error);
    }
  };

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
        apps={apps}
        selectedCapabilities={selectedCapabilities}
        onSelectedCapabilitiesChange={handleSelectedCapabilitiesChange}
      />
    </div>
  )
}