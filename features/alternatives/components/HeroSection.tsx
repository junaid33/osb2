import React from 'react'
import { Clock } from 'lucide-react'
import ToolIcon from '@/components/ToolIcon'
import { ProprietaryAppsDropdown } from './ProprietaryAppsDropdown'
import type { ProprietaryApp } from '../actions/getAlternatives'

interface HeroSectionProps {
  proprietaryApp: ProprietaryApp;
}

export function HeroSection({ proprietaryApp }: HeroSectionProps) {
  return (
    <div className="h-[500px] overflow-hidden">
      {/* Content */}
      <div className="flex flex-col justify-center h-full max-w-5xl px-6 md:px-12 mx-auto">
        <div className="mb-4">
          <ToolIcon
            name={proprietaryApp.name}
            simpleIconSlug={proprietaryApp.simpleIconSlug}
            simpleIconColor={proprietaryApp.simpleIconColor}
            size={64}
          />
        </div>
        <h2 className="text-xl text-muted-foreground font-light mb-1">
          Open Source Alternatives to
        </h2>
        <h1 className="text-5xl md:text-6xl font-bold text-foreground flex items-baseline gap-2 mb-2">
          {proprietaryApp.name}
          <ProprietaryAppsDropdown 
            currentSlug={proprietaryApp.slug}
            currentName={proprietaryApp.name}
            iconColor={proprietaryApp.simpleIconColor}
          />
        </h1>
        <div className="flex items-center text-muted-foreground mb-6">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{proprietaryApp.websiteUrl || 'website.com'}</span>
        </div>
        {/* <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            type="email"
            placeholder="me@email.com"
            className="backdrop-blur-sm border-none text-white placeholder:text-gray-400 w-full sm:max-w-xs"
            style={{ 
              backgroundColor: `${proprietaryApp.simpleIconColor || '#10b981'}30` 
            }}
          />
          <Button size="lg">
            Subscribe
          </Button>
        </div> */}
      </div>
    </div>
  )
}