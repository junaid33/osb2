import { AlternativesPageClient } from './AlternativesPageClient';

interface AlternativesPageProps {
  slug: string;
}

export async function AlternativesPage({ slug }: AlternativesPageProps) {
  // Convert slug back to display name
  const displayName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return <AlternativesPageClient proprietary={displayName} slug={slug} />;
}