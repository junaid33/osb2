import { AlternativesPageClient } from './AlternativesPageClient';
import { getAlternatives } from '../actions/getAlternatives';
import { notFound } from 'next/navigation';

interface AlternativesPageProps {
  slug: string;
}

export async function AlternativesPage({ slug }: AlternativesPageProps) {
  // Fetch real data from our schema
  const result = await getAlternatives(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const proprietaryApp = result.data;

  return (
    <AlternativesPageClient 
      proprietaryApp={proprietaryApp}
      slug={slug} 
    />
  );
}