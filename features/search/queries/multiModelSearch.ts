import { gql } from 'graphql-request'

export const MULTI_MODEL_SEARCH = gql`
  query MultiModelSearch($search: String!) {
    openSourceApplications(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
          { capabilities: { some: { capability: { name: { contains: $search, mode: insensitive } } } } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      simpleIconSlug
      simpleIconColor
      repositoryUrl
      websiteUrl
    }
    
    proprietaryApplications(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
          { capabilities: { some: { capability: { name: { contains: $search, mode: insensitive } } } } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      simpleIconSlug
      simpleIconColor
      websiteUrl
    }
    
    capabilities(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
      take: 5
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      category
      complexity
    }
  }
`

export interface SearchResult {
  openSourceApplications: {
    id: string
    name: string
    slug: string
    description?: string
    simpleIconSlug?: string
    simpleIconColor?: string
    repositoryUrl?: string
    websiteUrl?: string
  }[]
  proprietaryApplications: {
    id: string
    name: string
    slug: string
    description?: string
    simpleIconSlug?: string
    simpleIconColor?: string
    websiteUrl?: string
  }[]
  capabilities: {
    id: string
    name: string
    slug: string
    description?: string
    category?: string
    complexity?: string
  }[]
}