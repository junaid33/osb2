import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Logo } from "@/features/dashboard/components/Logo"
import { Marquee } from "@/components/ui/Marquee"
import { useQuery } from '@tanstack/react-query'
import { fetchAllCapabilities, fetchAllOpenSourceApps, fetchAllProprietaryApps } from '../../lib/data'
const CURRENT_YEAR = new Date().getFullYear()

const Footer = () => {
  // Fetch all data for marquee using React Query
  const { data: capabilities } = useQuery({
    queryKey: ['all-capabilities'],
    queryFn: fetchAllCapabilities,
    staleTime: 5 * 60 * 1000,
  })

  const { data: openSourceApps } = useQuery({
    queryKey: ['all-open-source-apps'],
    queryFn: fetchAllOpenSourceApps,
    staleTime: 5 * 60 * 1000,
  })

  const { data: proprietaryApps } = useQuery({
    queryKey: ['all-proprietary-apps'],
    queryFn: fetchAllProprietaryApps,
    staleTime: 5 * 60 * 1000,
  })

  // Create separate marquee items for each row using real data
  const proprietaryItems = proprietaryApps?.slice(0, 10).map(app => ({
    text: app.name.toUpperCase(),
    href: `/alternatives/${app.slug}`
  })) || []

  const openSourceItems = openSourceApps?.slice(0, 10).map(app => ({
    text: app.name.toUpperCase(),
    href: `/os-alternatives/${app.slug}`
  })) || []

  const capabilityItems = capabilities?.slice(0, 10).map(cap => ({
    text: cap.name.toUpperCase(),
    href: `/capabilities/${cap.slug}`
  })) || []

  // Don't render marquee if no data is available
  if (!proprietaryItems.length && !openSourceItems.length && !capabilityItems.length) {
    return null
  }

  const sections = {
    openSource: {
      title: "Open Source Apps",
      items: openSourceApps?.slice(0, 4).map(app => ({
        label: app.name,
        href: `/os-alternatives/${app.slug}`
      })) || [],
    },
    proprietary: {
      title: "Proprietary Apps",
      items: proprietaryApps?.slice(0, 4).map(app => ({
        label: app.name,
        href: `/alternatives/${app.slug}`
      })) || [],
    },
  }

  return (
    <div>
      {/* Three-row Marquee section */}
      <div className="py-4">
        {/* Top row - Proprietary Apps - going left */}
        <Marquee
          items={proprietaryItems}
          repeat={3}
          duration={30}
          fontSize="lg"
          className="py-2"
          accentColor="blue"
        />

        {/* Middle row - Open Source Apps - going right */}
        <Marquee
          items={openSourceItems}
          repeat={3}
          duration={30}
          fontSize="lg"
          className="py-2"
          reverse={true}
          accentColor="green"
        />

        {/* Bottom row - Capabilities - going left */}
        <Marquee
          items={capabilityItems}
          repeat={3}
          duration={35}
          fontSize="lg"
          className="py-2"
          accentColor="orange"
        />
      </div>

      <div className="px-4 xl:px-0">
        <footer
          id="footer"
          className="relative mx-auto flex max-w-6xl flex-wrap pt-4"
        >
          {/* Vertical Lines */}
          <div className="pointer-events-none inset-0">
            {/* Left */}
            <div
              className="absolute inset-y-0 my-[-5rem] w-px"
              style={{
                maskImage: "linear-gradient(transparent, white 5rem)",
              }}
            >
              <svg className="h-full w-full" preserveAspectRatio="none">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  className="stroke-border"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Right */}
            <div
              className="absolute inset-y-0 right-0 my-[-5rem] w-px"
              style={{
                maskImage: "linear-gradient(transparent, white 5rem)",
              }}
            >
              <svg className="h-full w-full" preserveAspectRatio="none">
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                  className="stroke-border"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>
          </div>
          <svg
            className="mb-10 h-20 w-full border-y border-dashed border-border stroke-border"
          >
            <defs>
              <pattern
                id="diagonal-footer-pattern"
                patternUnits="userSpaceOnUse"
                width="64"
                height="64"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const offset = i * 8
                  return (
                    <path
                      key={i}
                      d={`M${-106 + offset} 110L${22 + offset} -18`}
                      stroke=""
                      strokeWidth="1"
                    />
                  )
                })}
              </pattern>
            </defs>
            <rect
              stroke="none"
              width="100%"
              height="100%"
              fill="url(#diagonal-footer-pattern)"
            />
          </svg>
          <div className="mr-auto flex w-full justify-between lg:w-fit lg:flex-col px-6">
            <div className="flex flex-col">
              <Link
                href="/"
                className="flex items-center font-medium text-foreground select-none sm:text-sm mb-2"
              >
                <Logo />
                <span className="sr-only">opensource.builders Logo (go home)</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                Find open source alternatives to popular proprietary software
              </p>
              <Link
                href="https://github.com/junaid33/opensource.builders"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm">
                  <StarIcon className="-ms-1 opacity-60" size={12} aria-hidden="true" />
                  <span className="flex items-baseline gap-2">
                    GitHub
                    <span className="text-primary-foreground/60 text-xs">1,266</span>
                  </span>
                </Button>
              </Link>
              <div className="mt-4 text-sm text-muted-foreground">
                &copy; {CURRENT_YEAR} opensource.builders
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="mt-10 min-w-44 pl-2 lg:mt-0 lg:pl-0">
              <h3 className="mb-4 font-medium text-foreground sm:text-sm">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li key={item.label} className="text-sm">
                    <Link
                      href={item.href}
                      className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </footer>
      </div>
    </div>
  )
}

export default Footer