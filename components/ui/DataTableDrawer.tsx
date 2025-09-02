"use client"

import * as DrawerPrimitives from "@radix-ui/react-dialog"
import * as TabsPrimitives from "@radix-ui/react-tabs"
import * as SelectPrimitives from "@radix-ui/react-select"
import { RiCloseLine, RiExpandUpDownLine, RiCheckLine, RiArrowUpSLine, RiArrowDownSLine } from "@remixicon/react"
import { Download, File, Trash2, CircleCheck, Github, Info, Folder, Lightbulb, ChevronDown, Nut, Search, X, Package } from "lucide-react"
import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { request } from 'graphql-request'
import debounce from 'lodash.debounce'
// Using Tremor-style Select components defined below for consistent styling
import { LogoIcon as OpenfrontIcon } from "@/components/OpenFrontIcon"
import { LogoIcon as OpenshipIcon } from "@/components/OpenShipIcon"
import { NextKeystoneIcon } from "@/components/NextKeystoneIcon"
import { LogoIcon } from "@/features/dashboard/components/Logo"
import ToolIcon from '@/components/ToolIcon'
import BuildStatsCard from './BuildStatsCard'

// GraphQL query for searching capabilities
const SEARCH_CAPABILITIES_QUERY = `
  query SearchCapabilities($search: String!) {
    openSourceApplications(
      where: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { slug: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
      take: 8
      orderBy: { name: asc }
    ) {
      id
      name
      slug
      description
      repositoryUrl
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
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        isActive
      }
    }
  }
`

interface SearchResult {
  openSourceApplications: {
    id: string
    name: string
    slug: string
    description?: string
    repositoryUrl?: string
    websiteUrl?: string
    simpleIconSlug?: string
    simpleIconColor?: string
    capabilities: {
      capability: {
        id: string
        name: string
        slug: string
        description?: string
        category?: string
        complexity?: string
      }
      implementationNotes?: string
      githubPath?: string
      documentationUrl?: string
      implementationComplexity?: string
      isActive?: boolean
    }[]
  }[]
}

interface SelectedCapability {
  id: string // composite key: toolId-capabilityId
  capabilityId: string
  toolId: string
  name: string
  description?: string
  category?: string
  complexity?: string
  toolName: string
  toolIcon?: string
  toolColor?: string
  toolRepo?: string
  implementationNotes?: string
  githubPath?: string
  documentationUrl?: string
}

// Placeholder data types
interface Transaction {
  id: string
  merchant: string
  amount: number
  transaction_date: string
  expense_status: string
  category: string
}

interface DataTableDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data?: Transaction
}

const categories = [
  "Office Supplies",
  "Travel", 
  "Software",
  "Hardware",
  "Marketing",
  "Training",
  "Other"
]

const expense_statuses = [
  { value: "approved", label: "Approved" },
  { value: "pending", label: "Pending" },
  { value: "rejected", label: "Rejected" },
]

// Placeholder activity data
const activity = [
  {
    id: 1,
    type: "submitted",
    person: { name: "Emily Ross" },
    date: "2d ago",
    dateTime: "2024-07-13T10:32",
  },
  {
    id: 2,
    type: "added", 
    person: { name: "Emily Ross" },
    date: "1d ago",
    dateTime: "2024-07-14T11:03",
  },
  {
    id: 3,
    type: "commented",
    person: {
      name: "Chelsea Hagon",
      imageUrl:
        "https://images.unsplash.com/photo-1619895862022-09114b41f16f?q=80&w=1887&auto=format&fit=facearea&&facepad=2&w=256&h=256",
    },
    comment:
      'Re-classified expense from category "Consultation services" to "Coffee shop"',
    date: "3d ago",
    dateTime: "2023-01-23T15:56",
  },
  {
    id: 4,
    type: "approved",
    person: { name: "Maxime River" },
    date: "10min ago",
    dateTime: "2024-07-15T09:01",
  },
]

// Placeholder data
const defaultTransaction: Transaction = {
  id: "1",
  merchant: "FedEx",
  amount: 24.99,
  transaction_date: "2024-01-15T14:30:00",
  expense_status: "approved",
  category: "Office Supplies"
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Tremor-style Badge component
function TremorBadge({ variant, children }: { variant: string, children: React.ReactNode }) {
  const baseStyles = "inline-flex items-center gap-x-1 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
  
  let variantStyles = ""
  switch (variant) {
    case "approved":
      variantStyles = "bg-emerald-50 text-emerald-900 ring-emerald-600/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20"
      break
    case "pending":
      variantStyles = "bg-orange-50 text-orange-900 ring-orange-600/30 dark:bg-orange-400/10 dark:text-orange-500 dark:ring-orange-400/20"
      break
    case "rejected":
      variantStyles = "bg-rose-50 text-rose-900 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-500 dark:ring-rose-400/20"
      break
    default:
      variantStyles = "bg-blue-50 text-blue-900 ring-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
  }
  
  const [copied, setCopied] = React.useState(false)

  const handleCopyPrompt = async () => {
    const prompt = "Select a starter, then add capabilities to generate a copy-ready AI prompt."
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_) {
      setCopied(false)
    }
  }

  return (
    <span className={cn(baseStyles, variantStyles)}>
      {children}
    </span>
  )
}

// Tremor-style Button component 
function TremorButton({ variant = "primary", children, className, ...props }: { 
  variant?: "primary" | "secondary" | "ghost"
  children: React.ReactNode
  className?: string
  [key: string]: any
}) {
  const baseStyles = "relative inline-flex items-center justify-center whitespace-nowrap rounded-md border px-3 py-2 text-center font-medium shadow-sm transition-all duration-100 ease-in-out text-base sm:text-sm disabled:pointer-events-none disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
  
  let variantStyles = ""
  switch (variant) {
    case "primary":
      variantStyles = "border-transparent text-white dark:text-white bg-blue-500 dark:bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:dark:bg-gray-800 disabled:dark:text-gray-600"
      break
    case "secondary":
      variantStyles = "border-gray-300 dark:border-gray-800 text-gray-900 dark:text-gray-50 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/30 disabled:text-gray-400 disabled:dark:text-gray-600"
      break
    case "ghost":
      variantStyles = "shadow-none border-transparent text-gray-900 dark:text-gray-50 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800/80 disabled:text-gray-400 disabled:dark:text-gray-600"
      break
  }
  
  return (
    <button className={cn(baseStyles, variantStyles, className)} {...props}>
      {children}
    </button>
  )
}

// Tremor-style Input component
function TremorInput({ className, ...props }: { className?: string, [key: string]: any }) {
  return (
    <input
      className={cn(
        "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm",
        "border-gray-300 dark:border-gray-800",
        "text-gray-900 dark:text-gray-50",
        "placeholder-gray-400 dark:placeholder-gray-500",
        "bg-background",
        "disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
        "disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 dark:focus:border-blue-500 dark:focus:ring-blue-400/20",
        className
      )}
      {...props}
    />
  )
}

// Tremor-style Select components
function TremorSelect({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return <SelectPrimitives.Root {...props}>{children}</SelectPrimitives.Root>
}

function TremorSelectTrigger({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <SelectPrimitives.Trigger
      className={cn(
        "group/trigger flex w-full select-none items-center justify-between gap-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition text-base sm:text-sm",
        "border-gray-300 dark:border-gray-800",
        "text-gray-900 dark:text-gray-50",
        "data-[placeholder]:text-gray-500 data-[placeholder]:dark:text-gray-500",
        "bg-background",
        "hover:bg-gray-50 hover:dark:bg-gray-950/50",
        "data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400",
        "data-[disabled]:dark:border-gray-700 data-[disabled]:dark:bg-gray-800 data-[disabled]:dark:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 dark:focus:border-blue-500 dark:focus:ring-blue-400/20",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <SelectPrimitives.Icon asChild>
        <RiExpandUpDownLine className="size-4 shrink-0 text-gray-400 dark:text-gray-600 group-data-[disabled]/trigger:text-gray-300 group-data-[disabled]/trigger:dark:text-gray-600" />
      </SelectPrimitives.Icon>
    </SelectPrimitives.Trigger>
  )
}

function TremorSelectContent({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <SelectPrimitives.Portal>
      <SelectPrimitives.Content
        className={cn(
          "relative z-50 overflow-hidden rounded-md border shadow-xl shadow-black/[2.5%]",
          "min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]",
          "max-h-[--radix-select-content-available-height]",
          "bg-background",
          "text-gray-900 dark:text-gray-50",
          "border-gray-200 dark:border-gray-800",
          "will-change-[transform,opacity]",
          "data-[state=closed]:animate-hide",
          "data-[side=bottom]:animate-slideDownAndFade data-[side=left]:animate-slideLeftAndFade data-[side=right]:animate-slideRightAndFade data-[side=top]:animate-slideUpAndFade"
        )}
        sideOffset={8}
        position="popper"
        collisionPadding={10}
        {...props}
      >
        <SelectPrimitives.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
          <RiArrowUpSLine className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollUpButton>
        <SelectPrimitives.Viewport className="p-1">
          {children}
        </SelectPrimitives.Viewport>
        <SelectPrimitives.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
          <RiArrowDownSLine className="size-3 shrink-0" aria-hidden="true" />
        </SelectPrimitives.ScrollDownButton>
      </SelectPrimitives.Content>
    </SelectPrimitives.Portal>
  )
}

function TremorSelectItem({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return (
    <SelectPrimitives.Item
      className={cn(
        "grid cursor-pointer grid-cols-[1fr_20px] gap-x-2 rounded px-3 py-2 outline-none transition-colors data-[state=checked]:font-semibold sm:text-sm",
        "text-gray-900 dark:text-gray-50",
        "data-[disabled]:pointer-events-none data-[disabled]:text-gray-400 data-[disabled]:hover:bg-none dark:data-[disabled]:text-gray-600",
        "focus-visible:bg-gray-100 focus-visible:dark:bg-gray-900",
        "hover:bg-gray-100 hover:dark:bg-gray-900"
      )}
      {...props}
    >
      <SelectPrimitives.ItemText className="flex-1 truncate">
        {children}
      </SelectPrimitives.ItemText>
      <SelectPrimitives.ItemIndicator>
        <RiCheckLine className="size-5 shrink-0 text-gray-800 dark:text-gray-200" aria-hidden="true" />
      </SelectPrimitives.ItemIndicator>
    </SelectPrimitives.Item>
  )
}

// Tremor-style Tabs components  
function TremorTabs({ children, ...props }: { children: React.ReactNode, [key: string]: any }) {
  return <TabsPrimitives.Root {...props}>{children}</TabsPrimitives.Root>
}

function TremorTabsList({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <TabsPrimitives.List className={cn("px-6", className)}>
      <div className="flex items-center justify-start border-b border-gray-200 dark:border-gray-800">
        {children}
      </div>
    </TabsPrimitives.List>
  )
}

function TremorTabsTrigger({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <TabsPrimitives.Trigger
      className={cn(
        "-mb-px items-center justify-center whitespace-nowrap border-b-2 border-transparent px-4 pb-3 text-sm font-medium transition-all",
        "text-gray-500 dark:text-gray-500",
        "hover:text-gray-700 hover:dark:text-gray-400",
        "hover:border-gray-300 hover:dark:border-gray-400",
        "data-[state=active]:border-gray-900 data-[state=active]:text-gray-900",
        "data-[state=active]:dark:border-gray-50 data-[state=active]:dark:text-gray-50",
        "disabled:pointer-events-none",
        "disabled:text-gray-300 disabled:dark:text-gray-700",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900",
        className
      )}
      {...props}
    >
      {children}
    </TabsPrimitives.Trigger>
  )
}

function TremorTabsContent({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <TabsPrimitives.Content
      className={cn("outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900", className)}
      {...props}
    >
      {children}
    </TabsPrimitives.Content>
  )
}

// Tremor-style Label component
function TremorLabel({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: any }) {
  return (
    <label className={cn("text-sm font-medium text-gray-900 dark:text-gray-50", className)} {...props}>
      {children}
    </label>
  )
}

// Tremor-style Textarea component
function TremorTextarea({ className, ...props }: { className?: string, [key: string]: any }) {
  return (
    <textarea
      className={cn(
        "relative block w-full appearance-none rounded-md border px-2.5 py-2 shadow-sm outline-none transition sm:text-sm min-h-[100px] resize-y",
        "border-gray-300 dark:border-gray-800",
        "text-gray-900 dark:text-gray-50",
        "placeholder-gray-400 dark:placeholder-gray-500", 
        "bg-background",
        "disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
        "disabled:dark:border-gray-700 disabled:dark:bg-gray-800 disabled:dark:text-gray-500",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 dark:focus:border-blue-500 dark:focus:ring-blue-400/20",
        className
      )}
      {...props}
    />
  )
}

function DataTableDrawerFeed() {
  return (
    <>
      <ul role="list" className="space-y-6">
        {activity.map((activityItem, activityItemindex) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={cn(
                activityItemindex === activity.length - 1 ? "h-6" : "-bottom-6",
                "absolute left-0 top-0 flex w-6 justify-center",
              )}
            >
              <span className="w-px bg-gray-200 dark:bg-gray-800" aria-hidden="true" />
            </div>
            {activityItem.type === "submitted" ||
              activityItem.type === "added" ? (
              <>
                <div className="relative flex size-6 flex-none items-center justify-center bg-background">
                  <div className="size-1.5 rounded-full bg-muted ring-1 ring-border" />
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {activityItem.person.name}
                  </span>
                  {activityItem.type === "submitted" ? (
                    <> {activityItem.type} expense</>
                  ) : (
                    <> {activityItem.type} receipt to expense</>
                  )}
                </p>
                <time
                  dateTime={activityItem.dateTime}
                  className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500"
                >
                  {activityItem.date}
                </time>
              </>
            ) : activityItem.type === "commented" ? (
              <>
                <Image
                  alt="Profile Picture"
                  width={50}
                  height={50}
                  src={activityItem.person.imageUrl || ""}
                  className="relative mt-3 size-6 flex-none rounded-full bg-gray-50"
                />
                <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-300 dark:ring-gray-800">
                  <div className="flex justify-between gap-x-4">
                    <div className="py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                      <span className="font-medium text-gray-900 dark:text-gray-50">
                        {activityItem.person.name}
                      </span>{" "}
                      commented
                    </div>
                    <time
                      dateTime={activityItem.dateTime}
                      className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500"
                    >
                      {activityItem.date}
                    </time>
                  </div>
                  <p className="text-sm leading-6 text-gray-500">
                    {activityItem.comment}
                  </p>
                </div>
              </>
            ) : activityItem.type === "approved" ? (
              <>
                <div className="relative flex size-6 flex-none items-center justify-center bg-white dark:bg-[#090E1A]">
                  <CircleCheck
                    className="size-5 text-blue-500 dark:text-blue-500"
                    aria-hidden="true"
                  />
                </div>
                <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500">
                  <span className="font-medium text-gray-900 dark:text-gray-50">
                    {activityItem.person.name}
                  </span>{" "}
                  {activityItem.type} the audit.
                </p>
                <time
                  dateTime={activityItem.dateTime}
                  className="flex-none py-0.5 text-xs leading-5 text-gray-500 dark:text-gray-500"
                >
                  {activityItem.date}
                </time>
              </>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="flex gap-x-4">
        <Image
          alt="Profile Picture"
          width={50}
          height={50}
          src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1887&auto=format&fit=facearea&&facepad=2&w=256&h=256"
          className="size-6 flex-none rounded-full bg-gray-50"
        />
        <form action="#" className="relative flex-auto">
          <TremorLabel className="sr-only">
            Add your comment
          </TremorLabel>
          <TremorTextarea
            placeholder="Add your comment..."
            rows={4}
          />
        </form>
      </div>
    </>
  )
}

export function DataTableDrawer({
  open,
  onOpenChange,
  data = defaultTransaction,
}: DataTableDrawerProps) {
  const status = expense_statuses.find(
    (item) => item.value === data?.expense_status,
  )

  // Starter templates (from legacy Build page)
  const starterTemplates = [
    { id: "1", name: "Next.js + Keystone Starter", description: "Full-stack template with admin", source: "https://github.com/junaid33/next-keystone-starter" },
    { id: "openfront", name: "Openfront", description: "Open source e-commerce platform", source: "https://github.com/openshiporg/openfront" },
    { id: "openship", name: "Openship", description: "Order routing & fulfillment platform", source: "https://github.com/openshiporg/openship" },
    { id: "opensource-builders", name: "opensource.builders", description: "Open source tool discovery platform", source: "https://github.com/junaid33/opensource.builders" },
    { id: "byos", name: "Bring Your Own Starter", description: "Start with what you have", source: null },
  ] as const
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("1")
  const [copied, setCopied] = React.useState(false)
  
  // Capability search state
  const [search, setSearch] = React.useState('')
  const [results, setResults] = React.useState<SearchResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [selectedCapabilities, setSelectedCapabilities] = React.useState<SelectedCapability[]>([])
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  // Load pinned capabilities from localStorage on mount
  React.useEffect(() => {
    try {
      const pinnedCapabilities = localStorage.getItem('pinnedCapabilities')
      if (pinnedCapabilities) {
        const parsed = JSON.parse(pinnedCapabilities)
        setSelectedCapabilities(parsed)
      }
    } catch (error) {
      console.error('Error loading pinned capabilities:', error)
    }
  }, [])

  // Refresh selected capabilities when drawer opens
  React.useEffect(() => {
    if (open) {
      try {
        const pinnedCapabilities = localStorage.getItem('pinnedCapabilities')
        if (pinnedCapabilities) {
          const parsed = JSON.parse(pinnedCapabilities)
          setSelectedCapabilities(parsed)
        }
      } catch (error) {
        console.error('Error refreshing pinned capabilities:', error)
      }
    }
  }, [open])

  // Save selected capabilities to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('pinnedCapabilities', JSON.stringify(selectedCapabilities))
    } catch (error) {
      console.error('Error saving pinned capabilities:', error)
    }
  }, [selectedCapabilities])

  // Debounced search function
  const performSearch = React.useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults(null)
        return
      }

      setLoading(true)
      try {
        const data = await request<SearchResult>(
          '/api/graphql',
          SEARCH_CAPABILITIES_QUERY,
          { search: searchTerm }
        )
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300),
    []
  )

  React.useEffect(() => {
    performSearch(search)
  }, [search, performSearch])

  const handleCapabilitySelect = (capability: any, toolId: string, toolName: string, toolIcon?: string, toolColor?: string, toolRepo?: string) => {
    const compositeId = `${toolId}-${capability.capability.id}`
    const selectedCapability: SelectedCapability = {
      id: compositeId,
      capabilityId: capability.capability.id,
      toolId: toolId,
      name: capability.capability.name,
      description: capability.capability.description,
      category: capability.capability.category,
      complexity: capability.capability.complexity,
      toolName,
      toolIcon,
      toolColor,
      toolRepo,
      implementationNotes: capability.implementationNotes,
      githubPath: capability.githubPath,
      documentationUrl: capability.documentationUrl
    }

    setSelectedCapabilities(prev => {
      const isAlreadySelected = prev.some(f => f.id === compositeId)
      if (isAlreadySelected) {
        return prev.filter(f => f.id !== compositeId)
      } else {
        return [...prev, selectedCapability]
      }
    })
  }

  const handleCapabilityRemove = (capabilityId: string) => {
    setSelectedCapabilities(prev => prev.filter(f => f.id !== capabilityId))
  }

  const handleCapabilityPin = (capabilityImpl: any, app: any) => {
    const compositeId = `${app.id}-${capabilityImpl.capability.id}`
    const selectedCapability: SelectedCapability = {
      id: compositeId,
      capabilityId: capabilityImpl.capability.id,
      toolId: app.id,
      name: capabilityImpl.capability.name,
      description: capabilityImpl.capability.description,
      category: capabilityImpl.capability.category,
      complexity: capabilityImpl.capability.complexity,
      toolName: app.name,
      toolIcon: app.simpleIconSlug,
      toolColor: app.simpleIconColor,
      toolRepo: app.repositoryUrl,
      implementationNotes: capabilityImpl.implementationNotes,
      githubPath: capabilityImpl.githubPath,
      documentationUrl: capabilityImpl.documentationUrl
    }

    setSelectedCapabilities(prev => {
      const isAlreadySelected = prev.some(f => f.id === compositeId)
      if (isAlreadySelected) {
        return prev.filter(f => f.id !== compositeId)
      } else {
        return [...prev, selectedCapability]
      }
    })
  }

  const handleCopyPrompt = async () => {
    const prompt = "Select a starter, then add capabilities to generate a copy-ready AI prompt."
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (_error) {
      setCopied(false)
    }
  }

  return (
    <DrawerPrimitives.Root open={open} onOpenChange={onOpenChange}>
      {data ? (
        <DrawerPrimitives.Portal>
          <DrawerPrimitives.Overlay
            className={cn(
              "fixed inset-0 z-50 overflow-y-auto",
              "bg-black/30 dark:bg-black/60",
              "data-[state=closed]:animate-hide data-[state=open]:animate-dialogOverlayShow"
            )}
            style={{
              animationDuration: "400ms",
              animationFillMode: "backwards",
            }}
          >
            <DrawerPrimitives.Content
              className={cn(
                "fixed inset-y-2 mx-auto flex w-[95vw] flex-1 flex-col overflow-y-auto rounded-md border p-4 shadow-lg focus:outline-none max-sm:inset-x-2 sm:inset-y-2 sm:right-2 sm:max-w-lg sm:p-6",
                "border-border",
                "bg-background",
                "data-[state=closed]:animate-drawerSlideRightAndFade data-[state=open]:animate-drawerSlideLeftAndFade",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              )}
            >
              {/* Header */}
              <div className="-mx-6 flex items-start justify-between gap-x-4 border-b border-border px-6 pb-4">
                <div className="mt-1 flex flex-col gap-y-1">
                  <DrawerPrimitives.Title className="text-base font-semibold text-foreground w-full">
                    Interactive Prompt Builder
                  </DrawerPrimitives.Title>
                  <div className="mt-1">
                    <span className="text-left text-sm text-muted-foreground">
                      Build a copy-ready AI prompt by choosing a starter and adding capabilities from open source tools. Pin compatibilities on any alternatives page to add them here.
                    </span>
                  </div>
                </div>
                <DrawerPrimitives.Close asChild>
                  <TremorButton
                    variant="ghost"
                    className="aspect-square p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <RiCloseLine className="size-6" aria-hidden="true" />
                  </TremorButton>
                </DrawerPrimitives.Close>
              </div>

              {/* Body */}
              <div className="flex-1 py-4 -mx-6 overflow-y-scroll">
                <TremorTabs defaultValue="builder">
                  <TremorTabsList>
                    <TremorTabsTrigger value="builder" className="px-4">
                      Builder
                    </TremorTabsTrigger>
                    <TremorTabsTrigger value="full-prompt" className="px-4">
                      Full Prompt
                    </TremorTabsTrigger>
                  </TremorTabsList>
                  <TremorTabsContent value="builder" className="space-y-5 px-6 mt-4">
                    {/* Choose Starter (ported) */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Choose Starter</p>
                      <TremorSelect value={selectedTemplate} onValueChange={setSelectedTemplate}>
                        <TremorSelectTrigger>
                          {(() => {
                            const t = starterTemplates.find(s => s.id === selectedTemplate)
                            if (!t) return <SelectPrimitives.Value placeholder="Choose a starter template" />
                            return (
                              <span className="flex items-center gap-3">
                                {t.id === 'openfront' ? (
                                  <OpenfrontIcon className="w-6 h-6" />
                                ) : t.id === 'openship' ? (
                                  <OpenshipIcon className="w-6 h-6" />
                                ) : t.id === 'byos' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : t.id === '1' ? (
                                  <NextKeystoneIcon className="w-6 h-6" />
                                ) : t.id === 'opensource-builders' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : (
                                  <LogoIcon className="w-6 h-6" />
                                )}
                                <span>
                                  <span className="block font-medium leading-5">{t.name}</span>
                                  <span className="text-gray-500 dark:text-gray-500 mt-0.5 block text-xs leading-4">{t.description}</span>
                                </span>
                              </span>
                            )
                          })()}
                        </TremorSelectTrigger>
                        <TremorSelectContent>
                          {starterTemplates.map((template) => (
                            <TremorSelectItem key={template.id} value={template.id}>
                              <span className="flex items-center gap-3">
                                {template.id === 'openfront' ? (
                                  <OpenfrontIcon className="w-6 h-6" />
                                ) : template.id === 'openship' ? (
                                  <OpenshipIcon className="w-6 h-6" />
                                ) : template.id === 'byos' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : template.id === '1' ? (
                                  <NextKeystoneIcon className="w-6 h-6" />
                                ) : template.id === 'opensource-builders' ? (
                                  <LogoIcon className="w-6 h-6" />
                                ) : (
                                  <LogoIcon className="w-6 h-6" />
                                )}
                                <span>
                                  <span className="block font-medium">{template.name}</span>
                                  <span className="text-gray-500 dark:text-gray-500 mt-0.5 block text-xs">{template.description}</span>
                                </span>
                              </span>
                            </TremorSelectItem>
                          ))}
                        </TremorSelectContent>
                      </TremorSelect>
                      {(() => {
                        const template = starterTemplates.find(t => t.id === selectedTemplate)
                        if (!template) return null
                        return (
                          <div className="flex items-center gap-2">
                            {template.source && (
                              <a href={template.source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-50 transition-colors text-xs">
                                <Github className="h-3 w-3" />
                                <span>Source</span>
                              </a>
                            )}
                            <span className="text-gray-500 dark:text-gray-600 text-xs">•</span>
                            <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-500 text-xs"><Info className="h-3 w-3" /> Info</span>
                          </div>
                        )
                      })()}
                    </div>

                    {/* Build Stats Card */}
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Open Source Applications</p>
                      <BuildStatsCard 
                        onCapabilityPin={handleCapabilityPin}
                        onCapabilityUnpin={handleCapabilityRemove}
                        selectedCapabilities={new Set(selectedCapabilities.map(cap => cap.id))}
                      />

                      {/* Selected Capabilities */}
                      {selectedCapabilities.length > 0 && (
                        <div className="space-y-2">
                          {selectedCapabilities.map((capability) => (
                            <div key={capability.id} className="flex items-center justify-between gap-3 rounded-lg bg-muted border p-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="flex h-8 w-8 items-center justify-center">
                                  {capability.toolIcon ? (
                                    <ToolIcon
                                      name={capability.toolName}
                                      simpleIconSlug={capability.toolIcon}
                                      simpleIconColor={capability.toolColor}
                                      size={32}
                                    />
                                  ) : (
                                    <div 
                                      className="flex aspect-square items-center justify-center rounded-md overflow-hidden relative after:rounded-[inherit] after:absolute after:inset-0 after:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] after:pointer-events-none"
                                      style={{ 
                                        width: 32, 
                                        height: 32,
                                        background: capability.toolColor || '#6B7280'
                                      }}
                                    >
                                      {/* Noise texture overlay */}
                                      <div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                          backgroundSize: "256px 256px",
                                        }}
                                      />
                                      
                                      {/* Letter */}
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <span
                                          className="font-silkscreen text-primary-foreground select-none"
                                          style={{ fontSize: 16 }}
                                        >
                                          {capability.toolName.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                      
                                      {/* Subtle highlight */}
                                      <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent rounded-t-md" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium">{capability.name}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    from {capability.toolName}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCapabilityRemove(capability.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TremorTabsContent>
                  <TremorTabsContent value="full-prompt" className="space-y-6 px-6">
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-50">Prompt</h3>
                    <div className="space-y-2">
                      <div className="px-2 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm text-sm">
                        <div className="hidden sm:flex items-center gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="hover:bg-muted rounded p-1 transition-colors" aria-label="In a nutshell">
                                <Lightbulb className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent side="top" className="w-80">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Nut className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm font-medium">In a nutshell</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Shows the generated AI prompt based on your selected starter and capabilities.</p>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <button className="hover:bg-muted rounded p-1 transition-colors" aria-label="Expand">
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          Placeholder prompt. Once wired, this will mirror the interactive prompt from the original Build page.
                        </div>
                      </div>

                      <div className="ml-2 sm:ml-6 p-3 rounded-lg bg-background backdrop-blur-sm border border-border/50 shadow-sm text-xs text-muted-foreground">
                        Use Next.js + Keystone starter. Then implement: 1) Block-based editor from Tool A, 2) Bi-directional linking from Tool B, 3) Real-time collaboration from Tool C.
                      </div>
                    </div>
                  </TremorTabsContent>
                </TremorTabs>
              </div>

              {/* Footer */}
              <div className="flex border-t border-border pt-4 sm:justify-end -mx-6 -mb-2 gap-2 bg-background px-6">
                <TremorButton className="w-full" onClick={handleCopyPrompt}>{copied ? "Copied!" : "Copy Prompt"}</TremorButton>
              </div>
            </DrawerPrimitives.Content>
          </DrawerPrimitives.Overlay>
        </DrawerPrimitives.Portal>
      ) : null}
    </DrawerPrimitives.Root>
  )
}