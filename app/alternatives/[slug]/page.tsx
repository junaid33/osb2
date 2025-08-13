import { AlternativesPage } from '@/features/alternatives/screens/AlternativesPage';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function AlternativePageRoute({ params }: PageProps) {
  const { slug } = await params;
  
  return <AlternativesPage slug={slug} />;
}