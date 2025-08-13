import React from 'react'
import { EventCard } from './EventCard'
import { PlusCircle, Rss, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EventsSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Events</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-zinc-800 border-none hover:bg-zinc-700 flex items-center gap-1"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Submit Event</span>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-800 border-none hover:bg-zinc-700"
          >
            <Rss className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="bg-zinc-800 border-none hover:bg-zinc-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative pl-6 border-l border-zinc-700">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="absolute left-0 w-3 h-3 -translate-x-1.5 bg-zinc-700 rounded-full"></div>
            <span className="font-bold mr-2">Yesterday</span>
            <span className="text-gray-400">Monday</span>
          </div>
          <EventCard
            time="6:00 PM"
            title="San Diego Startup Dinner & Poker Night by Agree.com"
            organizer="Marty Ringlein"
            location="4609 Adair St"
            capacity="Near Capacity"
            imageSrc="https://uploadthingy.s3.us-west-1.amazonaws.com/uSze54Vgduw4iUUYMxPqZ9/CleanShot_2025-08-12_at_10.52.392x.png"
          />
        </div>
        <div>
          <div className="flex items-center mb-4">
            <div className="absolute left-0 w-3 h-3 -translate-x-1.5 bg-zinc-700 rounded-full"></div>
            <span className="font-bold mr-2">Tomorrow</span>
            <span className="text-gray-400">Wednesday</span>
          </div>
        </div>
      </div>
    </div>
  )
}