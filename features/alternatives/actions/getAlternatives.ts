'use server'

import { keystoneClient } from '@/features/dashboard/lib/keystoneClient'

export interface ProprietaryApp {
  id: string
  name: string
  slug: string
  description: string
  websiteUrl?: string
  simpleIconSlug?: string
  simpleIconColor?: string
  openSourceAlternatives: OpenSourceAlternative[]
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
      openSourceAlternatives: proprietaryApps[0].openSourceAlternatives.map((alt: any) => ({
        id: alt.id,
        name: alt.name,
        slug: alt.slug,
        description: alt.description || '',
        githubStars: alt.githubStars || 0,
        githubForks: alt.githubForks || 0,
        license: alt.license,
        websiteUrl: alt.websiteUrl,
        repositoryUrl: alt.repositoryUrl
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