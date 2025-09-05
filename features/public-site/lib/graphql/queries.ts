import { gql } from 'graphql-request';

// Popular apps query
export const GET_POPULAR_APPS = gql`
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
`;

// Alternatives query
export const GET_ALTERNATIVES = gql`
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
`;

// All proprietary apps query
export const GET_ALL_PROPRIETARY_APPS = gql`
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
`;

// Multi-model search query
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
`;

// OS alternatives query - get an open source app and other alternatives to the same proprietary app
export const GET_OS_ALTERNATIVES = gql`
  query GetOsAlternatives($slug: String!) {
    openSourceApplications(where: { slug: { equals: $slug } }) {
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
      primaryAlternativeTo {
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
  }
`;

// Capability applications query - get all apps that have a specific capability
export const GET_CAPABILITY_APPLICATIONS = gql`
  query GetCapabilityApplications($slug: String!) {
    capabilities(where: { slug: { equals: $slug } }) {
      id
      name
      slug
      description
      category
      complexity
      proprietaryApplications {
        proprietaryApplication {
          id
          name
          slug
          description
          websiteUrl
          simpleIconSlug
          simpleIconColor
        }
      }
      openSourceApplications {
        openSourceApplication {
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
        }
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`;