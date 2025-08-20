import React from 'react'
import { Clock, ChevronDown } from 'lucide-react'
import NoiseBackground from './NoiseBackground'
import ToolIcon from '@/components/ToolIcon'
import type { ProprietaryApp } from '../actions/getAlternatives'

interface HeroSectionProps {
  proprietaryApp: ProprietaryApp;
}

export function HeroSection({ proprietaryApp }: HeroSectionProps) {
  return (
    <div className="relative h-[500px] overflow-hidden bg-black">
      {/* Noise Background */}
      <div className="absolute inset-0 w-full h-full">
        <NoiseBackground 
          color={proprietaryApp.simpleIconColor || "#10b981"}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-5xl px-6 md:px-12 mx-auto">
        <div className="mb-4">
          <ToolIcon
            name={proprietaryApp.name}
            simpleIconSlug={proprietaryApp.simpleIconSlug}
            simpleIconColor={proprietaryApp.simpleIconColor}
            size={64}
          />
        </div>
        <h2 className="text-xl text-gray-200 font-light mb-1">
          Open Source Alternatives to
        </h2>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            {proprietaryApp.name}
          </h1>
          <button className="text-white/70 hover:text-white transition-colors">
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
        <div className="flex items-center text-gray-300 mb-6">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{proprietaryApp.websiteUrl || 'website.com'}</span>
        </div>
        <div className="w-full h-px bg-gray-400/30 mb-6"></div>
        <p className="text-white/90 max-w-xl mb-8">
          San Diego's event scene is vibrant with tech gatherings, creative meetups and cultural celebrations, reflecting the city's dynamic blend of technology, diversity, and innovation.
        </p>
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