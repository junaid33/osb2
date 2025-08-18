import React from 'react'
import { Star, GitFork, ExternalLink, Github } from 'lucide-react'

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
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden mb-4 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-300 mb-4">{description}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4">
            {githubStars !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Star className="h-4 w-4" />
                <span>{githubStars.toLocaleString()}</span>
              </div>
            )}
            {githubForks !== undefined && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <GitFork className="h-4 w-4" />
                <span>{githubForks.toLocaleString()}</span>
              </div>
            )}
            {license && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-900/50 text-blue-400 rounded">
                {license}
              </span>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-zinc-800 text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-2">
        {websiteUrl && (
          <a 
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Website
          </a>
        )}
        {repositoryUrl && (
          <a 
            href={repositoryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm rounded transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        )}
      </div>
    </div>
  )
}