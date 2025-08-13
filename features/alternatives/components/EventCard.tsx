import React from 'react'
import { MapPin, User } from 'lucide-react'

interface EventCardProps {
  time: string
  title: string
  organizer: string
  location: string
  capacity: string
  imageSrc: string
}

export function EventCard({
  time,
  title,
  organizer,
  location,
  capacity,
  imageSrc,
}: EventCardProps) {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden mb-4">
      <div className="p-4 flex gap-4">
        <div className="flex-1">
          <div className="text-gray-300 mb-1">{time}</div>
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <User className="h-4 w-4" />
            <span>By {organizer}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 text-xs bg-amber-900/50 text-amber-400 rounded-full">
              {capacity}
            </span>
          </div>
        </div>
        <div className="w-24 h-24 flex-shrink-0">
          <div className="w-full h-full rounded-lg bg-gradient-to-b from-orange-500 to-pink-600 flex items-center justify-center p-2">
            <div className="text-center text-xs">
              <div className="text-white font-bold">SAN DIEGO</div>
              <div className="text-white">FOUNDERS</div>
              <div className="text-white">BEACH HOUSE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}