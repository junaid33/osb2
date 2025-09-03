'use client';

import React, { useState, useEffect } from 'react'
import { HeroSection } from '../components/HeroSection'
import { EventsSection } from '../components/EventsSection'
import NoiseBackground from '../components/NoiseBackground'
import StatsCard from '../components/StatsCard'
import { DataTableDrawer } from '@/components/ui/DataTableDrawer'
import { useSelectedCapabilities, useCapabilityActions } from '@/hooks/use-capabilities-config'
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

function AlternativesContent({ proprietaryApp, slug }: AlternativesPageClientProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [apps, setApps] = useState([])
  const selectedCapabilities = useSelectedCapabilities()
  const { addCapability, removeCapability } = useCapabilityActions()

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

  const handleSelectedCapabilitiesChange = (capabilities) => {
    // This is called when capabilities are changed from the BuildStatsCard - but we use the provider now
    // The provider will automatically handle the sync through the context
    console.log('Capability change handled by provider', capabilities)
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
        <div className="mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row gap-8 max-w-5xl">
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

export function AlternativesPageClient({ proprietaryApp, slug }: AlternativesPageClientProps) {
  return <AlternativesContent proprietaryApp={proprietaryApp} slug={slug} />
}