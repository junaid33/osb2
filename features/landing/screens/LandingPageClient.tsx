'use client'

import Link from 'next/link'
import Hero from '../components/Hero'

interface PopularApp {
  id: string
  name: string
  slug: string
  description: string | null
  websiteUrl: string | null
  simpleIconSlug: string | null
  simpleIconColor: string | null
  openSourceAlternativesCount: number
}

interface LandingPageClientProps {
  popularApps: PopularApp[]
}

export function LandingPageClient({ popularApps }: LandingPageClientProps) {
  return (
    <>
      <Hero />

      {/* Popular Proprietary Apps Section */}
      <div id="popular-apps" className="mx-auto px-6 py-12 sm:py-24 max-w-5xl md:max-w-7xl">
        <div className="space-y-10">
          <div className="space-y-5">
            <h1 className="text-4xl lg:text-5xl font-medium tracking-tight text-center">
              Popular Proprietary Apps
            </h1>
            <p className="text-center text-muted-foreground">
              Find open source alternatives
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {popularApps.map((app, index) => (
              <Link 
                key={app.id} 
                href={`/alternatives/${app.slug}`}
                className={`
                  ${index === 1 ? 
                    'relative overflow-hidden rounded-xl border border-slate-800 p-[1px] backdrop-blur-3xl' : 
                    'bg-card p-7 rounded-xl border hover:bg-card/80 transition-colors'
                  }
                `}
              >
                {index === 1 && (
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"></span>
                )}
                
                <div className={`
                  ${index === 1 ? 
                    'inline-flex flex-col gap-3 h-full w-full rounded-xl bg-slate-950 backdrop-blur-3xl p-7' : 
                    'flex flex-col gap-3'
                  }
                `}>
                  <div 
                    className={`
                      p-2 rounded-lg w-11 h-11 justify-center flex items-center
                      ${index === 1 ? 'bg-transparent border' : 'bg-muted'}
                    `}
                    style={app.simpleIconColor ? { backgroundColor: `${app.simpleIconColor}20` } : {}}
                  >
                    {app.simpleIconSlug ? (
                      <img 
                        src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${app.simpleIconSlug}.svg`}
                        alt={`${app.name} icon`}
                        className="w-5 h-5"
                        style={app.simpleIconColor ? { filter: `brightness(0) saturate(100%) ${app.simpleIconColor}` } : {}}
                      />
                    ) : (
                      <div 
                        className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-xs font-medium"
                        style={{ color: app.simpleIconColor || '#888' }}
                      >
                        {app.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <p className="font-medium">{app.name}</p>
                  
                  <p className={`text-sm ${index === 1 ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                    {app.description || `Find open source alternatives to ${app.name}`}
                  </p>
                  
                  {app.openSourceAlternativesCount > 0 && (
                    <div className={`flex gap-1 items-center font-semibold text-sm ${index === 1 ? 'text-blue-500' : 'text-primary'}`}>
                      <span>{app.openSourceAlternativesCount} alternatives</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}