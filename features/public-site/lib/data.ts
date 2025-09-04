// Single data functions used by both server prefetch and client useQuery
import { makeGraphQLRequest } from './graphql/client';
import { GET_POPULAR_APPS, GET_ALTERNATIVES, GET_ALL_PROPRIETARY_APPS, MULTI_MODEL_SEARCH } from './graphql/queries';
import { PopularAppsResponse, AlternativesResponse, SearchResult, PopularApp, ProprietaryApplication } from '../types';

// Fetch popular apps
export async function fetchPopularApps(): Promise<PopularApp[]> {
  const data = await makeGraphQLRequest<PopularAppsResponse>(GET_POPULAR_APPS);
  return data.proprietaryApplications;
}

// Fetch all proprietary apps
export async function fetchAllProprietaryApps(): Promise<PopularApp[]> {
  const data = await makeGraphQLRequest<PopularAppsResponse>(GET_ALL_PROPRIETARY_APPS);
  return data.proprietaryApplications;
}

// Fetch alternatives for a proprietary app
export async function fetchAlternatives(slug: string): Promise<ProprietaryApplication> {
  const data = await makeGraphQLRequest<AlternativesResponse>(GET_ALTERNATIVES, { slug });
  
  const proprietaryApps = data.proprietaryApplications;
  
  if (!proprietaryApps || proprietaryApps.length === 0) {
    throw new Error('Proprietary application not found');
  }

  // Transform the response to match our interface
  const proprietaryApp: ProprietaryApplication = {
    id: proprietaryApps[0].id,
    name: proprietaryApps[0].name,
    slug: proprietaryApps[0].slug,
    description: proprietaryApps[0].description || '',
    websiteUrl: proprietaryApps[0].websiteUrl,
    simpleIconSlug: proprietaryApps[0].simpleIconSlug,
    simpleIconColor: proprietaryApps[0].simpleIconColor,
    capabilities: (() => {
      const capabilityMap = new Map();
      proprietaryApps[0].capabilities?.forEach((pc: any) => {
        const capability = {
          id: pc.capability.id,
          name: pc.capability.name,
          slug: pc.capability.slug,
          description: pc.capability.description || '',
          category: pc.capability.category,
          complexity: pc.capability.complexity,
        };
        // Use capability ID as key to deduplicate
        capabilityMap.set(capability.id, capability);
      });
      return Array.from(capabilityMap.values());
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
          complexity: c.capability.complexity,
        },
        implementationNotes: c.implementationNotes,
        githubPath: c.githubPath,
        documentationUrl: c.documentationUrl,
        implementationComplexity: c.implementationComplexity,
        isActive: c.isActive,
      })) || [],
    })),
  };
  
  return proprietaryApp;
}

// Fetch search results
export async function fetchSearchResults(searchQuery: string): Promise<SearchResult> {
  const data = await makeGraphQLRequest<SearchResult>(MULTI_MODEL_SEARCH, { search: searchQuery });
  return data;
}