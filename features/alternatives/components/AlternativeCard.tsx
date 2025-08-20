import React from 'react'
import { Star, GitFork, MapPin, ExternalLink, Github, Hammer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ToolIcon from '@/components/ToolIcon'

interface AlternativeCardProps {
  name: string
  description: string
  githubStars?: number
  githubForks?: number
  license?: string
  websiteUrl?: string
  repositoryUrl?: string
  tags?: string[]
}

// Generate placeholder avatars for the avatar group
const generateAvatars = (count: number) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500'];
  return Array.from({ length: Math.min(count, 4) }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    initials: String.fromCharCode(65 + i)
  }));
};

export function AlternativeCard({
  name,
  description,
  githubStars,
  githubForks,
  license,
  websiteUrl,
  repositoryUrl,
  tags = [],
}: AlternativeCardProps) {
  const starCount = githubStars || 0;
  const forkCount = githubForks || 0;
  const totalEngagement = starCount + forkCount;
  const avatars = generateAvatars(4);
  
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden mb-4 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Time placeholder */}
          <div className="text-gray-400 text-sm mb-2">
            Open Source
          </div>
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3">{name}</h3>
          
          {/* Organization */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <ToolIcon
              name={name}
              size={24}
              simpleIconColor="#3b82f6"
            />
            <span>By {license || 'Open Source Community'}</span>
          </div>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <MapPin className="h-4 w-4" />
            <span>GitHub Repository</span>
          </div>
          
          {/* Badge and Avatar Group */}
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-3 py-1 text-sm bg-green-900/50 text-green-400 rounded-full">
              Suggested: {starCount > 0 ? `${starCount} stars` : 'New'}
            </span>
            
            {/* Avatar Group */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {avatars.map((avatar) => (
                  <div
                    key={avatar.id}
                    className={`w-8 h-8 rounded-full ${avatar.color} flex items-center justify-center text-white text-xs font-medium border-2 border-zinc-900`}
                  >
                    {avatar.initials}
                  </div>
                ))}
              </div>
              {totalEngagement > 4 && (
                <span className="ml-2 text-sm text-gray-400">
                  +{Math.max(0, totalEngagement - 4)}
                </span>
              )}
            </div>
          </div>
          
          {/* Build Button */}
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.open(`/build?alternative=${name.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
          >
            <Hammer className="h-4 w-4 mr-2" />
            Build with {name}
          </Button>
        </div>
        
        {/* Right side card */}
        <div className="w-32 h-24 ml-6 flex-shrink-0">
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-3">
            <div className="text-center text-xs text-white">
              <div className="font-bold mb-1">OPEN</div>
              <div className="font-bold mb-1">SOURCE</div>
              <div className="text-gray-200 text-xs">Alternative</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}