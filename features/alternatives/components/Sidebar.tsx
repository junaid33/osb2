import React from 'react'
import { Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Sidebar() {
  return (
    <div className="bg-zinc-900 rounded-lg p-6">
      <div className="flex justify-center mb-4">
        <div className="bg-blue-500 w-14 h-14 rounded-full flex items-center justify-center">
          <Building2 className="h-6 w-6 text-white" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-2">San Diego</h2>
      <p className="text-gray-300 text-sm text-center mb-6">
        Discover the hottest events in San Diego, and get notified of new events
        before they sell out.
      </p>
      <div className="space-y-3">
        <Input
          type="email"
          placeholder="me@email.com"
          className="bg-zinc-800 border-none"
        />
        <Button className="w-full bg-white text-black hover:bg-gray-200">
          Subscribe
        </Button>
      </div>
      <div className="mt-6">
        <div className="w-full h-32 bg-zinc-800 rounded-lg"></div>
      </div>
    </div>
  )
}