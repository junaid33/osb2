'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

export interface Capability {
  id: string
  name: string
  slug: string
  description?: string
  category?: string
  complexity?: string
}

export interface ProprietaryApp {
  id: string
  name: string
  slug: string
  description: string
  websiteUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  openSourceAlternatives: OpenSourceAlternative[]
  capabilities: Capability[]
}

export interface OpenSourceAlternative {
  id: string
  name: string
  slug: string
  description: string
  githubStars?: number
  githubForks?: number
  license?: string
  websiteUrl?: string
  repositoryUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  capabilities: Array<{
    capability: Capability
    implementationNotes?: string
    githubPath?: string
    documentationUrl?: string
    implementationComplexity?: string
    isActive?: boolean
  }>
}

interface GetAlternativesResponse {
  success: boolean
  data?: ProprietaryApp
  error?: string
}

/**
 * Server-side action to fetch proprietary app and its open source alternatives
 */
export async function getAlternatives(slug: string): Promise<GetAlternativesResponse> {
  const query = `
    query GetAlternatives($slug: String!) {
      proprietaryApplications(where: { slug: { equals: $slug } }) {
        id
        name
        slug
        description
        websiteUrl
        simpleIconSlug
        simpleIconColor
        capabilities {
          capability {
            id
            name
            slug
            description
            category
            complexity
          }
        }
        openSourceAlternatives {
          id
          name
          slug
          description
          githubStars
          githubForks
          license
          websiteUrl
          repositoryUrl
          simpleIconSlug
          simpleIconColor
          capabilities {
            capability {
              id
              name
              slug
              description
              category
              complexity
            }
            implementationNotes
            githubPath
            documentationUrl
            implementationComplexity
            isActive
          }
        }
      }
    }
  `

  try {
    const response = await keystoneClient(query, { slug })

    if (!response.success) {
      console.error('Failed to fetch alternatives:', response.error)
      return {
        success: false,
        error: response.error
      }
    }

    const proprietaryApps = response.data.proprietaryApplications

    if (!proprietaryApps || proprietaryApps.length === 0) {
      return {
        success: false,
        error: 'Proprietary application not found'
      }
    }

    // Transform the response to match our interface
    const proprietaryApp: ProprietaryApp = {
      id: proprietaryApps[0].id,
      name: proprietaryApps[0].name,
      slug: proprietaryApps[0].slug,
      description: proprietaryApps[0].description || '',
      websiteUrl: proprietaryApps[0].websiteUrl,
      simpleIconSlug: proprietaryApps[0].simpleIconSlug,
      simpleIconColor: proprietaryApps[0].simpleIconColor,
      capabilities: (() => {
        const capabilityMap = new Map()
        proprietaryApps[0].capabilities?.forEach((pc: any) => {
          const capability = {
            id: pc.capability.id,
            name: pc.capability.name,
            slug: pc.capability.slug,
            description: pc.capability.description || '',
            category: pc.capability.category,
            complexity: pc.capability.complexity
          }
          // Use capability ID as key to deduplicate
          capabilityMap.set(capability.id, capability)
        })
        return Array.from(capabilityMap.values())
      })(),
      openSourceAlternatives: proprietaryApps[0].openSourceAlternatives.map((alt: any) => ({
        id: alt.id,
        name: alt.name,
        slug: alt.slug,
        description: alt.description || '',
        githubStars: alt.githubStars || 0,
        githubForks: alt.githubForks || 0,
        license: alt.license,
        websiteUrl: alt.websiteUrl,
        repositoryUrl: alt.repositoryUrl,
        simpleIconSlug: alt.simpleIconSlug,
        simpleIconColor: alt.simpleIconColor,
        capabilities: alt.capabilities?.map((c: any) => ({
          capability: {
            id: c.capability.id,
            name: c.capability.name,
            slug: c.capability.slug,
            description: c.capability.description || '',
            category: c.capability.category,
            complexity: c.capability.complexity
          },
          implementationNotes: c.implementationNotes,
          githubPath: c.githubPath,
          documentationUrl: c.documentationUrl,
          implementationComplexity: c.implementationComplexity,
          isActive: c.isActive
        })) || []
      }))
    }

    return {
      success: true,
      data: proprietaryApp
    }

  } catch (error) {
    console.error('Error fetching alternatives:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}