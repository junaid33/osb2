import React from 'react'
import { Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import NoiseBackground from './NoiseBackground'
import type { ProprietaryApp } from '../actions/getAlternatives'

interface HeroSectionProps {
  proprietaryApp: ProprietaryApp;
}

export function HeroSection({ proprietaryApp }: HeroSectionProps) {
  return (
    <div className="relative h-[500px] overflow-hidden bg-black">
      {/* Dynamic Noise Background with app's color */}
      <NoiseBackground 
        color={proprietaryApp.simpleIconColor || "#10b981"}
        className="absolute inset-0 z-0"
      />
      
      <div className="relative z-10 flex flex-col justify-center h-full max-w-3xl px-6 md:px-12">
        <div 
          className="backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ 
            backgroundColor: `${proprietaryApp.simpleIconColor || '#10b981'}20` 
          }}
        >
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl text-gray-200 font-light mb-1">
          Find open source alternatives to
        </h2>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
          {proprietaryApp.name}
        </h1>
        <div className="flex items-center text-gray-300 mb-6">
          <span className="text-sm">{proprietaryApp.openSourceAlternatives.length} alternatives found</span>
        </div>
        <div className="w-full h-px bg-gray-400/30 mb-6"></div>
        <p className="text-white/90 max-w-xl mb-8">
          {proprietaryApp.description || 
           `Discover powerful open source alternatives to ${proprietaryApp.name} that offer 
           similar functionality, better customization, and freedom from vendor lock-in.
           Choose from community-driven solutions that prioritize transparency and innovation.`}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            type="email"
            placeholder="me@email.com"
            className="backdrop-blur-sm border-none text-white placeholder:text-gray-400 w-full sm:max-w-xs"
            style={{ 
              backgroundColor: `${proprietaryApp.simpleIconColor || '#10b981'}30` 
            }}
          />
          <Button className="bg-white text-black hover:bg-gray-200 px-8">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  )
}