import { LandingPageClient } from './LandingPageClient'
import { getPopularApps } from '../actions/getPopularApps'

export async function LandingPage() {
  const popularAppsResponse = await getPopularApps()
  const popularApps = popularAppsResponse.success ? popularAppsResponse.data : []

  return <LandingPageClient popularApps={popularApps || []} />
}