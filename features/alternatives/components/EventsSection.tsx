import React from 'react'
import { AlternativeCard } from './AlternativeCard'
import { PlusCircle, Rss, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { OpenSourceAlternative } from '../actions/getAlternatives'

interface EventsSectionProps {
  alternatives: OpenSourceAlternative[];
}

export function EventsSection({ alternatives }: EventsSectionProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Open Source Alternatives</h2>
        <div className="flex gap-2">
          <Button className="ring-0"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Submit Alternative</span>
          </Button>
          <Button
            size="icon"
            className="ring-0"
          >
            <Rss className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="ring-0"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {alternatives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No open source alternatives found yet.</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to submit one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alternatives.map((alternative) => (
            <AlternativeCard
              key={alternative.id}
              name={alternative.name}
              description={alternative.description}
              githubStars={alternative.githubStars}
              githubForks={alternative.githubForks}
              license={alternative.license}
              websiteUrl={alternative.websiteUrl}
              repositoryUrl={alternative.repositoryUrl}
              tags={[]} // Could add capability-based tags later
            />
          ))}
        </div>
      )}
    </div>
  )
}