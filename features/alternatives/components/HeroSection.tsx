import React from 'react'
import { Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <div className="relative h-[500px] overflow-hidden bg-black">
      <div className="flex flex-col justify-center h-full max-w-3xl px-6 md:px-12">
        <div className="bg-blue-500/20 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-xl text-gray-200 font-light mb-1">
          What's Happening in
        </h2>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
          San Diego
        </h1>
        <div className="flex items-center text-gray-300 mb-6">
          <span className="text-sm">10:52 AM PDT</span>
        </div>
        <div className="w-full h-px bg-gray-400/30 mb-6"></div>
        <p className="text-white/90 max-w-xl mb-8">
          San Diego's event scene is vibrant with tech gatherings, creative
          meetups and cultural celebrations, reflecting the city's dynamic blend
          of technology, diversity, and innovation.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Input
            type="email"
            placeholder="me@email.com"
            className="bg-blue-900/30 backdrop-blur-sm border-none text-white placeholder:text-gray-400 w-full sm:max-w-xs"
          />
          <Button className="bg-white text-black hover:bg-gray-200 px-8">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  )
}