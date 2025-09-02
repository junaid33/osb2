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
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Open source
          <br />
          alternatives to
          <br />
          <div className="flex items-baseline gap-2">
            <span className="font-geist-sans font-semibold text-muted-foreground">
              {proprietaryApp.name}
            </span>
            <div className="text-base tracking-normal">
              <ProprietaryAppsDropdown 
                currentSlug={proprietaryApp.slug}
                currentName={proprietaryApp.name}
                iconColor={proprietaryApp.simpleIconColor}
              />
            </div>
          </div>
        </h1>
        <div className="flex items-center mb-6">
          <a
            href={proprietaryApp.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 text-sm text-white font-medium hover:bg-black/90 transition-colors cursor-pointer"
          >
            <Clock className="h-4 w-4 opacity-60" />
            <span className="opacity-60">
              {proprietaryApp.websiteUrl 
                ? proprietaryApp.websiteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
                : 'website.com'}
            </span>
          </a>
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