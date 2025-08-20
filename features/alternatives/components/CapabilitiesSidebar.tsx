import React from 'react'
import type { Capability } from '../actions/getAlternatives'

interface CapabilitiesSidebarProps {
  capabilities: Capability[]
}

export function CapabilitiesSidebar({ capabilities }: CapabilitiesSidebarProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Features</h3>
      
      {capabilities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No features available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {capabilities.map((capability) => (
            <div
              key={capability.id}
              className="bg-zinc-900 rounded-lg p-4 cursor-pointer hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{capability.name}</h4>
                  {capability.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">
                      {capability.description}
                    </p>
                  )}
                </div>
                <div className="ml-3 flex flex-col items-end gap-1">
                  {capability.category && (
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                      {capability.category}
                    </span>
                  )}
                  {capability.complexity && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      capability.complexity === 'basic' 
                        ? 'bg-green-500/20 text-green-400'
                        : capability.complexity === 'intermediate'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {capability.complexity}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}