'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import ToolIcon from '@/components/ToolIcon'
import { request } from 'graphql-request'

interface ProprietaryApp {
  id: string
  name: string
  slug: string
  description: string | null
  websiteUrl: string | null
  simpleIconSlug: string | null
  simpleIconColor: string | null
  openSourceAlternativesCount: number
}

interface ProprietaryAppsResponse {
  proprietaryApplications: ProprietaryApp[]
}

const GET_ALL_PROPRIETARY_APPS = `
  query GetAllProprietaryApps {
    proprietaryApplications(
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      websiteUrl
      simpleIconSlug
      simpleIconColor
      openSourceAlternativesCount
    }
  }
`

interface ProprietaryAppsDropdownProps {
  currentSlug?: string
  currentName: string
  iconColor?: string
}

export function ProprietaryAppsDropdown({ 
  currentSlug, 
  currentName,
  iconColor 
}: ProprietaryAppsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [apps, setApps] = useState<ProprietaryApp[]>([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Load apps when dropdown opens
  useEffect(() => {
    if (isOpen && apps.length === 0) {
      loadApps()
    }
  }, [isOpen, apps.length])

  const loadApps = async () => {
    setLoading(true)
    try {
      const data = await request<ProprietaryAppsResponse>(
        '/api/graphql',
        GET_ALL_PROPRIETARY_APPS
      )
      setApps(data.proprietaryApplications)
    } catch (error) {
      console.error('Error loading apps:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAppClick = (slug: string) => {
    router.push(`/alternatives/${slug}`)
    setIsOpen(false)
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  // Filter out current app from the list
  const otherApps = apps.filter(app => app.slug !== currentSlug)

  return (
    <div ref={dropdownRef} className="relative">
      <button 
        onClick={toggleDropdown}
        className="flex items-center justify-center rounded-md border border-transparent hover:border-border/60 transition-colors h-12 w-12 -mb-1"
        aria-label="Switch to other proprietary app"
      >
        <ChevronDown 
          className={cn(
            "h-7 w-7 transition-transform duration-200 stroke-2 align-baseline",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed top-auto left-auto mt-2 w-80 max-h-96 overflow-auto rounded-lg border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg z-[100] text-foreground" style={{
          top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 8 : 'auto',
          left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 'auto'
        }}>
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading alternatives...
            </div>
          ) : otherApps.length > 0 ? (
            <div className="p-2">
              <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                Switch to other app
              </div>
              {otherApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.slug)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-accent"
                >
                  <div className="flex h-8 w-8 items-center justify-center">
                    {app.simpleIconSlug ? (
                      <ToolIcon
                        name={app.name}
                        simpleIconSlug={app.simpleIconSlug}
                        simpleIconColor={app.simpleIconColor}
                        size={24}
                      />
                    ) : (
                      <div 
                        className="flex aspect-square items-center justify-center rounded-md overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                        style={{ width: 24, height: 24 }}
                      >
                        <span
                          className="font-semibold text-gray-100 select-none"
                          style={{ fontSize: 10 }}
                        >
                          {app.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium">{app.name}</div>
                    {app.description && (
                      <div className="truncate text-xs text-muted-foreground">
                        {app.description}
                      </div>
                    )}
                  </div>
                  {app.openSourceAlternativesCount > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {app.openSourceAlternativesCount} alternatives
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No other apps available
            </div>
          )}
        </div>
      )}
    </div>
  )
}