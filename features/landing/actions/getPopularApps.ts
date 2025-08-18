import { gql, request } from 'graphql-request'

const GET_POPULAR_APPS = gql`
  query GetPopularApps {
    proprietaryApplications(
      take: 9
      orderBy: { openSourceAlternativesCount: desc }
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

interface PopularAppsResponse {
  proprietaryApplications: PopularApp[]
}

export async function getPopularApps(): Promise<{
  success: boolean
  data?: PopularApp[]
  error?: string
}> {
  try {
    const endpoint = process.env.GRAPHQL_ENDPOINT || 'http://localhost:3003/api/graphql'
    
    const response = await request<PopularAppsResponse>(endpoint, GET_POPULAR_APPS)
    
    return {
      success: true,
      data: response.proprietaryApplications
    }
  } catch (error) {
    console.error('Error fetching popular apps:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}