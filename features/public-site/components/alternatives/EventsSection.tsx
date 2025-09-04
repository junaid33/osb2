import React from 'react'
import { DisplayCard } from './AlternativeCard'
import type { OpenSourceApplication as OpenSourceAlternative, Capability } from '../../types'

interface EventsSectionProps {
  alternatives: OpenSourceAlternative[];
  proprietaryCapabilities: Capability[];
}

export function EventsSection({ alternatives, proprietaryCapabilities }: EventsSectionProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Open Source Alternatives</h2>
      </div>
      
      {alternatives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No open source alternatives found yet.</p>
          <p className="text-gray-500 text-sm mt-2">Be the first to submit one!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {alternatives.map((alternative) => {
            // Calculate compatibility manually
            const proprietaryCapIds = proprietaryCapabilities.map(c => c.id)
            const matchingCapabilities = alternative.capabilities.filter(oc => 
              proprietaryCapIds.includes(oc.capability.id)
            )
            const matchingCount = matchingCapabilities.length
            const totalCount = proprietaryCapabilities.length
            const compatibilityScore = totalCount > 0 ? Math.round((matchingCount / totalCount) * 100) : 0
            
            return (
              <DisplayCard
                key={alternative.id}
                name={alternative.name}
                description={alternative.description}
                websiteUrl={alternative.websiteUrl}
                repositoryUrl={alternative.repositoryUrl}
                simpleIconSlug={alternative.simpleIconSlug}
                simpleIconColor={alternative.simpleIconColor}
                license={alternative.license}
                githubStars={alternative.githubStars}
                isOpenSource={true}
                capabilities={proprietaryCapabilities.map(proprietary => {
                  const openSourceHasThis = alternative.capabilities.find(oc => 
                    oc.capability.id === proprietary.id
                  )
                  return {
                    name: proprietary.name,
                    compatible: !!openSourceHasThis,
                    category: proprietary.category,
                    complexity: proprietary.complexity
                  }
                })}
                totalCapabilities={totalCount}
                compatibilityScore={compatibilityScore}
                alternatives={[]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}