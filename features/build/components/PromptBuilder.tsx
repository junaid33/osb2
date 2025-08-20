'use client'

import { useState, useId, useEffect, useRef, useCallback } from 'react'
import { Search, Package, ExternalLink, X, Check, ChevronDown, Lightbulb, Nut, HelpCircle, Copy, CheckCircle, Sparkles, Download, Info, Github, Folder } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { DisplayCard } from '@/features/landing/components/display-card'
import { MiniDonutChart } from '@/components/ui/mini-donut-chart'
import { request } from 'graphql-request'
import ToolIcon from '@/components/ToolIcon'
import debounce from 'lodash.debounce'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

// Enhanced search query to get open source tools with their capabilities
const SEARCH_QUERY = `
  query SearchOpenSourceTools($search: String!) {
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
        qualityScore
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
      qualityScore?: number
    }[]
  }[]
}

interface SelectedCapability {
  id: string // This will be toolId-capabilityId composite key
  capabilityId: string // Original capability ID
  toolId: string // Tool ID
  name: string
  description?: string
  category?: string
  complexity?: string
  toolName: string
  toolIcon?: string
  toolColor?: string
  toolRepo?: string // Repository URL
}

const starterTemplates = [
  {
    id: '1',
    name: 'Next.js + Keystone Starter',
    description: 'Full-stack template with admin',
    info: 'A full stack Next.js application with a Keystone admin built in, a GraphQL API, one-click deployable to Vercel and Railway',
    source: 'https://github.com/junaid33/next-keystone-starter'
  },
  {
    id: 'openfront',
    name: 'Openfront',
    description: 'Open source e-commerce platform',
    info: 'Openfront is built off of this same starter, but it\'s a Shopify alternative',
    source: 'https://github.com/openshiporg/openfront'
  },
  {
    id: 'openship',
    name: 'Openship',
    description: 'Order routing & fulfillment platform',
    info: 'Openship is built off the same Next.js + Keystone starter with additional order routing and fulfillment automation capabilities',
    source: 'https://github.com/openshiporg/openship'
  },
  {
    id: 'byos',
    name: 'Bring Your Own Starter',
    description: 'Start with what you have',
    info: 'Use your existing codebase as the foundation. Perfect for integrating powerful features from open source tools into your current project without starting from scratch.',
    source: null
  }
]

interface PromptBuilderProps {
  onPromptChange?: (prompt: string) => void
  className?: string
}

export function PromptBuilder({ onPromptChange, className }: PromptBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('1')
  const [selectedCapabilities, setSelectedCapabilities] = useState<SelectedCapability[]>([])
  const [expandedChips, setExpandedChips] = useState<Set<string>>(new Set())
  const [copied, setCopied] = useState(false)
  const [copiedGitClone, setCopiedGitClone] = useState(false)
  const selectId = useId()

  // Search state
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Debounced search function
  const performSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults(null)
        return
      }

      setLoading(true)
      try {
        const data = await request<SearchResult>(
          '/api/graphql',
          SEARCH_QUERY,
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

  useEffect(() => {
    performSearch(search)
  }, [search, performSearch])

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleCapabilitySelect = (capability: any, toolId: string, toolName: string, toolIcon?: string, toolColor?: string, toolRepo?: string) => {
    const compositeId = `${toolId}-${capability.id}`
    const selectedCapability: SelectedCapability = {
      id: compositeId,
      capabilityId: capability.id,
      toolId: toolId,
      name: capability.name,
      description: capability.description,
      category: capability.category,
      complexity: capability.complexity,
      toolName,
      toolIcon,
      toolColor,
      toolRepo
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

  const toggleChipExpansion = (chipId: string) => {
    setExpandedChips(prev => {
      const newSet = new Set(prev)
      if (newSet.has(chipId)) {
        newSet.delete(chipId)
      } else {
        newSet.add(chipId)
      }
      return newSet
    })
  }

  const getTemplatePromptText = (templateId: string) => {
    const templatePrompts: Record<string, string> = {
      '1': `This starter is a full-stack Next.js application that combines Next.js (App Router) with Keystone.js as a headless CMS. It features:

- GraphQL API powered by Keystone.js
- Custom admin dashboard built with Tailwind CSS and shadcn/ui
- Authentication and user management
- Database integration with schema management
- Modern TypeScript architecture

The repository includes comprehensive documentation in the docs/ folder covering the architecture, Keystone integration, and dashboard system.`,
      'openfront': `Openfront is a comprehensive open source e-commerce platform built as a Shopify alternative. It features:

- **Complete E-commerce Stack**: Product management, order processing, payment handling, shipping integration
- **Multi-Store Support**: Built-in multi-tenant architecture for managing multiple stores
- **Modern Architecture**: Next.js 15 + React 19 + KeystoneJS 6 + PostgreSQL + Prisma
- **Payment Processing**: Stripe, PayPal integrations with webhook handling
- **Shipping & Fulfillment**: Multiple shipping providers, label generation, tracking
- **Analytics Dashboard**: Built-in analytics with sales performance and customer insights`,
      'openship': `Openship is an intelligent order routing and fulfillment platform that automates e-commerce operations. It features:

- **Order Routing Engine**: Automatically routes orders from shops to optimal fulfillment channels
- **Multi-Platform Integration**: Connect Shopify, WooCommerce, and other e-commerce platforms
- **Product Matching**: AI-assisted matching between shop products and supplier products
- **Inventory Synchronization**: Real-time inventory tracking across all connected platforms`,
      'byos': '' // No template setup for "bring your own starter"
    }
    return templatePrompts[templateId] || 'Use the selected starter template'
  }

  const getCapabilityPromptText = (capability: SelectedCapability, templateId: string) => {
    const isManualStarter = templateId === 'byos'
    
    const getInfrastructureDescription = () => {
      switch (templateId) {
        case 'openfront':
          return 'Openfront e-commerce platform infrastructure. Follow the existing patterns in /features/ directory and integrate with the Keystone schema and e-commerce data models.'
        case 'openship':
          return 'Openship order routing platform infrastructure. Follow the existing patterns in /features/ directory and integrate with the Keystone schema and order processing system.'
        case '1':
          return 'Next.js + Keystone.js infrastructure. Follow our existing patterns in /features/ directory and integrate with the Keystone schema.'
        default:
          return 'existing codebase architecture. Follow your current patterns and integrate with your existing infrastructure.'
      }
    }
    
    const repoUrl = capability.toolRepo || `https://github.com/search?q=${capability.toolName.toLowerCase()}`
    
    if (isManualStarter) {
      return `Implement ${capability.toolName}'s ${capability.name}. 

${capability.toolName} repository: ${repoUrl}

Please understand how this application works and then implement ${capability.name}. Use GitHub MCP (if available) or GitHub to find the relevant code that implements ${capability.name} and adapt it to your ${getInfrastructureDescription()}`
    } else {
      return `Implement ${capability.toolName}'s ${capability.name}. 

${capability.toolName} repository: ${repoUrl}

Use GitHub MCP (if available) or GitHub to find the relevant code that implements ${capability.name} and adapt it to our ${getInfrastructureDescription()}`
    }
  }

  const generatePrompt = () => {
    // For BYOS, only show capabilities (no template)
    if (selectedTemplate === 'byos') {
      if (selectedCapabilities.length === 0) return ''
      
      let prompt = 'Implement the following capabilities in your existing codebase:\n\n'
      selectedCapabilities.forEach((capability, index) => {
        prompt += `${index + 1}. ${getCapabilityPromptText(capability, selectedTemplate)}\n\n`
      })
      prompt += 'Analyze your existing codebase architecture and integrate these capabilities following your current patterns and conventions. Provide detailed step-by-step instructions that work with your specific tech stack.'
      
      return prompt.trim()
    }
    
    // For regular templates
    if (!selectedTemplate && selectedCapabilities.length === 0) return ''
    
    let prompt = ''
    
    // Add template context
    if (selectedTemplate && selectedTemplate !== 'none') {
      prompt += getTemplatePromptText(selectedTemplate) + '\n\n'
    }
    
    // Add capability prompts
    if (selectedCapabilities.length > 0) {
      prompt += 'Implement the following capabilities:\n\n'
      selectedCapabilities.forEach((capability, index) => {
        prompt += `${index + 1}. ${getCapabilityPromptText(capability, selectedTemplate)}\n\n`
      })
    }
    
    // Add closing instructions
    prompt += 'Ensure all implementations follow best practices, are properly tested, and integrate seamlessly with the existing codebase. Provide detailed step-by-step instructions for each capability implementation.'
    
    return prompt.trim()
  }

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value)
  }

  const handleCopyPrompt = async () => {
    const prompt = generatePrompt()
    if (!prompt) return
    
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy prompt:', err)
    }
  }

  const handleCopyGitClone = async () => {
    const gitCloneCommand = 'git clone https://github.com/junaid33/next-keystone-starter.git'
    
    try {
      await navigator.clipboard.writeText(gitCloneCommand)
      setCopiedGitClone(true)
      setTimeout(() => setCopiedGitClone(false), 2000)
    } catch (err) {
      console.error('Failed to copy git clone command:', err)
    }
  }

  // Update prompt when capabilities change
  useEffect(() => {
    const newPrompt = generatePrompt()
    onPromptChange?.(newPrompt)
  }, [selectedCapabilities, selectedTemplate])

  const hasResults = results && results.openSourceApplications.length > 0

  // Group capabilities by tool for display
  const groupedSelectedCapabilities = selectedCapabilities.reduce((acc, capability) => {
    if (!acc[capability.toolName]) {
      acc[capability.toolName] = {
        toolName: capability.toolName,
        toolIcon: capability.toolIcon,
        toolColor: capability.toolColor,
        capabilities: []
      }
    }
    acc[capability.toolName].capabilities.push(capability)
    return acc
  }, {} as Record<string, { toolName: string, toolIcon?: string, toolColor?: string, capabilities: SelectedCapability[] }>)

  return (
    <TooltipProvider>
      <section className={cn("py-8 px-4 sm:px-6 lg:px-8", className)}>
        <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center px-4 sm:px-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 mb-6">
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-sm font-medium text-white">AI-Powered Building</span>
          </div>
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl text-white">Feature Builder</h2>
          <p className="text-gray-400 mt-4 text-balance max-w-lg mx-auto">
            Cherry-pick powerful capabilities from open source tools. We'll generate the perfect AI prompt to implement them in your project.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl px-4 sm:px-0">
          <div className="bg-zinc-900 w-full rounded-2xl border border-zinc-700 px-4 sm:px-6 lg:px-8 py-6 shadow-sm space-y-6">
            {/* Starter Template Selection */}
            <div className="space-y-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Choose Starter</p>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange} defaultValue="1">
                <SelectTrigger
                  className="h-auto ps-2 text-left border-0 shadow-none bg-zinc-800 text-white [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_span]:shrink-0"
                >
                  <SelectValue placeholder="Choose a starter template" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-white [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                  {starterTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id} className="text-white hover:bg-zinc-700">
                      <span className="flex items-center gap-3">
                        <Folder className="w-6 h-6 text-blue-500" />
                        <span>
                          <span className="block font-medium">{template.name}</span>
                          <span className="text-gray-400 mt-0.5 block text-xs">
                            {template.description}
                          </span>
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dash Separator */}
            <div className="border-t border-dashed border-zinc-700 my-6"></div>

            {/* Capabilities Search */}
            <div className="space-y-4">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Choose Capabilities</p>
              
              {/* Selected Capabilities Summary */}
              {selectedCapabilities.length > 0 && (
                <div className="border-0 shadow-none space-y-3">
                  {Object.values(groupedSelectedCapabilities).map((toolGroup) => (
                    <div key={toolGroup.toolName} className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50 shadow-inner">
                      <div className="flex items-center gap-3">
                        <ToolIcon
                          name={toolGroup.toolName}
                          simpleIconSlug={toolGroup.toolIcon}
                          simpleIconColor={toolGroup.toolColor}
                          size={24}
                        />
                        <div className="flex-1">
                          <div className="block font-medium text-white">
                            {toolGroup.toolName}
                          </div>
                          <div className="text-gray-400 mt-0.5 block text-xs">
                            {toolGroup.capabilities.length === 1 
                              ? toolGroup.capabilities[0].name
                              : `${toolGroup.capabilities.length} capabilities selected`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Search Component */}
              <div ref={searchRef} className="relative w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    ref={inputRef}
                    type="search"
                    placeholder="Search capabilities from open source tools..."
                    className={cn(
                      "h-9 w-full pl-9 pr-3 text-sm bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-400",
                      isOpen && hasResults && "rounded-b-none"
                    )}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={handleInputFocus}
                  />
                </div>

                {/* Search Results Dropdown */}
                {isOpen && search.trim() && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-px max-h-96 overflow-y-auto rounded-b-md border border-t-0 border-zinc-700 bg-zinc-800 shadow-lg">
                    {loading ? (
                      <div className="p-4 text-center text-sm text-gray-400">
                        Searching...
                      </div>
                    ) : hasResults ? (
                      <div>
                        {/* Header with multi-selection hint and close button */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-700 bg-zinc-700/10">
                          <div className="text-xs text-gray-400">
                            Click capabilities to select • Click again to deselect
                          </div>
                          <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="p-2">
                          {/* Tools with their Capabilities */}
                        {results!.openSourceApplications.map((tool) => (
                          <div key={tool.id} className="mb-4">
                            {/* Tool Header */}
                            <div className="mb-2 px-2 py-2 rounded-md bg-zinc-700/20">
                              <div className="flex items-center gap-2 text-sm font-medium text-white">
                                <ToolIcon
                                  name={tool.name}
                                  simpleIconSlug={tool.simpleIconSlug}
                                  simpleIconColor={tool.simpleIconColor}
                                  size={20}
                                />
                                {tool.name}
                              </div>
                              {tool.description && (
                                <div className="text-xs text-gray-400 mt-1 ml-7">
                                  {tool.description}
                                </div>
                              )}
                            </div>
                            
                            {/* Capabilities from this tool */}
                            {tool.capabilities && tool.capabilities.length > 0 && (
                              <div className="ml-4 space-y-1">
                                {tool.capabilities
                                  .filter(toolCapability => toolCapability.capability !== null)
                                  .map((toolCapability, index) => (
                                  <button
                                    key={`tool-${tool.id}-capability-${toolCapability.capability.id}-${index}`}
                                    onClick={() => handleCapabilitySelect(toolCapability.capability, tool.id, tool.name, tool.simpleIconSlug, tool.simpleIconColor, tool.repositoryUrl)}
                                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm hover:bg-zinc-700 text-white"
                                  >
                                    <div className="flex h-6 w-6 items-center justify-center">
                                      {selectedCapabilities.some(f => f.id === `${tool.id}-${toolCapability.capability.id}`) ? (
                                        <div className="text-green-500 text-sm">✓</div>
                                      ) : (
                                        <Package className="h-4 w-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                      <div className="font-medium">{toolCapability.capability.name}</div>
                                      {toolCapability.capability.description && (
                                        <div className="truncate text-xs text-gray-400">
                                          {toolCapability.capability.description}
                                        </div>
                                      )}
                                    </div>
                                    {toolCapability.capability.category && (
                                      <div className="text-xs text-gray-400">
                                        {toolCapability.capability.category.replace('_', ' ')}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-400">
                        No results found for "{search}"
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>

            {/* Copy Prompt Button */}
            {generatePrompt() && (
              <div className="flex flex-col gap-4 mt-6">
                <Button
                  onClick={handleCopyPrompt}
                  className="h-10 w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </TooltipProvider>
  )
}