"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { ChevronLeft, ChevronRight, Pin, Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Capability {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  complexity?: string;
}

interface CapabilityItem {
  name: string;
  category: string;
  percentage: number;
  compatible: boolean;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
  implementationComplexity?: string;
  description?: string;
  complexity?: string;
}

interface OpenSourceAlternative {
  id: string;
  name: string;
  slug: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  capabilities: Array<{ capability: Capability }>;
}

interface StatsCardProps {
  capabilities?: Capability[];
  openSourceAlternatives?: OpenSourceAlternative[];
  onOpenDrawer?: () => void;
}

// Fallback data for when no capabilities are provided
const fallbackData: CapabilityItem[] = [
  { name: "Task Management", category: "other", percentage: 85, compatible: true },
  { name: "Real-time Collaboration", category: "other", percentage: 70, compatible: true },
  { name: "API Integration", category: "other", percentage: 60, compatible: false },
  { name: "Advanced Analytics", category: "other", percentage: 45, compatible: false },
  { name: "Mobile Apps", category: "other", percentage: 30, compatible: false },
];


const chartConfig = {
  used: {
    label: "Used",
    color: "hsl(var(--primary))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

function DonutChart({ percentage, compatible }: { percentage: number; compatible: boolean }) {
  const backgroundData = [{ name: "background", value: 100, fill: "#E5E7EB" }];
  const fillColor = compatible ? "#10B981" : "#EF4444"; // Green for compatible, red for not compatible
  const foregroundData = [
    {
      name: "used",
      value: compatible ? 100 : Math.max(0, Math.min(100, Number(percentage))),
      fill: fillColor,
    },
    {
      name: "empty",
      value: compatible ? 0 : 100 - Math.max(0, Math.min(100, Number(percentage))),
      fill: "transparent",
    },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="w-6 h-6 flex-shrink-0 aspect-square"
    >
      <PieChart>
        <Pie
          data={backgroundData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={6}
          outerRadius={10}
          isAnimationActive={false}
        >
          {backgroundData.map((entry, index) => (
            <Cell key={`bg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Pie
          data={foregroundData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={6}
          outerRadius={10}
          startAngle={90}
          endAngle={-270}
        >
          {foregroundData.map((entry, index) => (
            <Cell key={`fg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

export default function StatsCard({ capabilities = [], openSourceAlternatives = [], onOpenDrawer }: StatsCardProps) {
  const [currentAlternativeIndex, setCurrentAlternativeIndex] = useState(0);
  const [pinnedCapabilities, setPinnedCapabilities] = useState<Set<string>>(new Set());
  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null);
  const [capabilitySearch, setCapabilitySearch] = useState('');
  
  // If no alternatives, show fallback
  if (openSourceAlternatives.length === 0) {
    const capabilityData = fallbackData;
    const compatibleCount = capabilityData.filter(item => item.compatible).length;
    const totalCount = capabilityData.length;
    const compatibilityScore = Math.round((compatibleCount / totalCount) * 100);

    return (
      <div className="group relative p-1 rounded-xl overflow-hidden transition-all duration-300 bg-muted border border-border ring-2 ring-border/50 hover:shadow-lg">
        <div className="relative flex flex-col space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-foreground">Capabilities</h3>
              <p className="text-xs text-muted-foreground font-medium">
                No alternatives available
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentAlternative = openSourceAlternatives[currentAlternativeIndex];
  
  // Transform capabilities data for current alternative
  const capabilityData = capabilities.length > 0 ? capabilities.map(cap => {
    const capabilityImpl = currentAlternative.capabilities.find(osc => osc.capability.id === cap.id);
    const hasCapability = !!capabilityImpl;
    return {
      name: cap.name,
      category: cap.category || 'other',
      percentage: hasCapability ? 100 : 0,
      compatible: hasCapability,
      description: cap.description,
      complexity: cap.complexity,
      // Add the relationship fields
      implementationNotes: capabilityImpl?.implementationNotes,
      githubPath: capabilityImpl?.githubPath,
      documentationUrl: capabilityImpl?.documentationUrl,
      implementationComplexity: capabilityImpl?.implementationComplexity
    };
  }) : fallbackData;

  const compatibleCount = capabilityData.filter(item => item.compatible).length;
  const totalCount = capabilityData.length;
  const compatibilityScore = Math.round((compatibleCount / totalCount) * 100);

  const nextAlternative = () => {
    setCurrentAlternativeIndex((prev) => (prev + 1) % openSourceAlternatives.length);
    setPinnedCapabilities(new Set()); // Reset pins when switching alternatives
    setHoveredCapability(null); // Reset hover when switching
  };

  const prevAlternative = () => {
    setCurrentAlternativeIndex((prev) => (prev - 1 + openSourceAlternatives.length) % openSourceAlternatives.length);
    setPinnedCapabilities(new Set()); // Reset pins when switching alternatives
    setHoveredCapability(null); // Reset hover when switching
  };

  const togglePin = (capabilityName: string) => {
    const capabilityItem = capabilityData.find(item => item.name === capabilityName)
    if (!capabilityItem) return

    setPinnedCapabilities(prev => {
      const newPinned = new Set(prev);
      const isPinning = !newPinned.has(capabilityName)
      
      if (newPinned.has(capabilityName)) {
        newPinned.delete(capabilityName);
      } else {
        newPinned.add(capabilityName);
      }

      // Also save to localStorage for the drawer
      if (isPinning) {
        try {
          const existingPinned = JSON.parse(localStorage.getItem('pinnedCapabilities') || '[]')
          const compositeId = `${currentAlternative.id}-${capabilityName.replace(/\s+/g, '-').toLowerCase()}`
          
          const newCapability = {
            id: compositeId,
            capabilityId: capabilityName.replace(/\s+/g, '-').toLowerCase(),
            toolId: currentAlternative.id,
            name: capabilityName,
            description: capabilityItem.description,
            category: capabilityItem.category,
            complexity: capabilityItem.implementationComplexity || capabilityItem.complexity,
            toolName: currentAlternative.name,
            toolIcon: currentAlternative.simpleIconSlug,
            toolColor: currentAlternative.simpleIconColor,
            toolRepo: currentAlternative.repositoryUrl,
            implementationNotes: capabilityItem.implementationNotes,
            githubPath: capabilityItem.githubPath,
            documentationUrl: capabilityItem.documentationUrl
          }

          const updatedPinned = existingPinned.filter((c: any) => c.id !== compositeId)
          updatedPinned.push(newCapability)
          localStorage.setItem('pinnedCapabilities', JSON.stringify(updatedPinned))
        } catch (error) {
          console.error('Error saving pinned capability:', error)
        }
      } else {
        // Remove from localStorage
        try {
          const existingPinned = JSON.parse(localStorage.getItem('pinnedCapabilities') || '[]')
          const compositeId = `${currentAlternative.id}-${capabilityName.replace(/\s+/g, '-').toLowerCase()}`
          const updatedPinned = existingPinned.filter((c: any) => c.id !== compositeId)
          localStorage.setItem('pinnedCapabilities', JSON.stringify(updatedPinned))
        } catch (error) {
          console.error('Error removing pinned capability:', error)
        }
      }

      return newPinned;
    });
  };

  return (
    <div className="group relative p-1 rounded-xl overflow-hidden transition-all duration-300 bg-muted border border-border ring-2 ring-border/50 hover:shadow-lg">
      <div className="relative flex flex-col space-y-2">
        {/* Header in the outer gray card */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left side: Logo and capabilities info */}
          <div className="flex items-center gap-2">
            {currentAlternative.simpleIconSlug ? (
              <div 
                className="w-8 h-8 flex-shrink-0 rounded flex items-center justify-center"
                style={{ backgroundColor: currentAlternative.simpleIconColor || '#6B7280' }}
              >
                <img
                  src={`https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${currentAlternative.simpleIconSlug}.svg`}
                  alt={`${currentAlternative.name} icon`}
                  className="w-5 h-5"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            ) : (
              <div 
                className="w-8 h-8 flex-shrink-0 rounded flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: currentAlternative.simpleIconColor || '#6B7280' }}
              >
                {currentAlternative.name.charAt(0).toUpperCase()}
              </div>
            )}
            <Select value={currentAlternativeIndex.toString()} onValueChange={(value) => setCurrentAlternativeIndex(parseInt(value))}>
              <SelectTrigger className="border-0 shadow-none p-0 h-auto bg-transparent hover:bg-transparent focus:ring-0 gap-1">
                <div className="flex flex-col items-start">
                  <h3 className="text-sm font-medium text-foreground">{currentAlternative.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium">
                    {compatibleCount} Capabilities
                  </p>
                </div>
              </SelectTrigger>
              <SelectContent>
                {openSourceAlternatives.map((alt, index) => (
                  <SelectItem key={alt.id} value={index.toString()}>
                    <div className="flex items-center gap-3">
                      {alt.simpleIconSlug ? (
                        <div 
                          className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ backgroundColor: alt.simpleIconColor || '#6B7280' }}
                        >
                          <img
                            src={`https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${alt.simpleIconSlug}.svg`}
                            alt={`${alt.name} icon`}
                            className="w-4 h-4"
                            style={{ filter: 'brightness(0) invert(1)' }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-6 h-6 rounded-md flex items-center justify-center text-white font-bold text-xs"
                          style={{ backgroundColor: alt.simpleIconColor || '#6B7280' }}
                        >
                          {alt.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">{alt.name}</div>
                        <div className="text-xs text-muted-foreground">{alt.capabilities?.length || 0} Capabilities</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Right side: Navigation and donut */}
          <div className="flex items-center gap-2">
            {/* Left chevron */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevAlternative}
              disabled={openSourceAlternatives.length <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Right chevron */}
            <Button
              variant="ghost"
              size="sm"
              onClick={nextAlternative}
              disabled={openSourceAlternatives.length <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            {/* Donut chart with popover */}
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-help">
                  <DonutChart percentage={compatibilityScore} compatible={compatibilityScore === 100} />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" side="bottom" align="end">
                <div className="text-xs">
                  <span className="font-medium">{compatibleCount}/{totalCount} capabilities supported</span>
                  <br />
                  <span className="text-muted-foreground">{compatibilityScore}% compatibility</span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Capabilities list in the inner white card */}
        <div className="ring-foreground/5 text-card-foreground rounded-lg bg-card border shadow border-transparent ring-1 p-2">
          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search capabilities..."
              className="pl-9 pr-3 h-9 text-sm"
              value={capabilitySearch}
              onChange={(e) => setCapabilitySearch(e.target.value)}
            />
          </div>
          
          {/* Capabilities list with scroll */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(() => {
              const filteredCapabilities = capabilityData.filter((item) => {
                if (!capabilitySearch.trim()) return true;
                return item.name.toLowerCase().includes(capabilitySearch.toLowerCase());
              });

              if (filteredCapabilities.length === 0 && capabilitySearch.trim()) {
                return (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No capabilities found for "{capabilitySearch}"</p>
                  </div>
                );
              }

              return filteredCapabilities
                .sort((a, b) => {
                  // Sort by pinned first, then by compatible status
                  const aPinned = pinnedCapabilities.has(a.name);
                  const bPinned = pinnedCapabilities.has(b.name);
                  if (aPinned && !bPinned) return -1;
                  if (!aPinned && bPinned) return 1;
                  // Then sort compatible capabilities first within each group
                  if (a.compatible && !b.compatible) return -1;
                  if (!a.compatible && b.compatible) return 1;
                  return 0;
                })
            })()
              .map((item) => {
                const isPinned = pinnedCapabilities.has(item.name);
                const isHovered = hoveredCapability === item.name;
                const showPin = item.compatible; // Only show pin for compatible capabilities
                
                return (
                  <div
                    key={item.name}
                    onClick={showPin ? (e) => {
                      e.preventDefault()
                      togglePin(item.name)
                      if (onOpenDrawer) {
                        onOpenDrawer()
                      }
                    } : undefined}
                    onMouseEnter={() => setHoveredCapability(item.name)}
                    onMouseLeave={() => setHoveredCapability(null)}
                    className="flex items-center justify-between gap-5 rounded-2xl bg-background border p-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="rounded-lg p-1 flex-shrink-0">
                        <DonutChart percentage={item.percentage} compatible={item.compatible} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{item.name}</div>
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          {item.githubPath && currentAlternative.repositoryUrl && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`${currentAlternative.repositoryUrl}/blob/main/${item.githubPath}`, '_blank');
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                CODE
                              </button>
                              <span className="text-muted-foreground">·</span>
                            </>
                          )}
                          {item.documentationUrl && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(item.documentationUrl, '_blank');
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                DOCS
                              </button>
                              <span className="text-muted-foreground">·</span>
                            </>
                          )}
                          {item.implementationNotes && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-muted-foreground hover:text-foreground"
                                >
                                  META
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-3" side="bottom" align="start">
                                <div className="space-y-3">
                                  <div className="text-sm font-medium">{item.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    <div className="font-medium mb-1">Implementation Notes:</div>
                                    <div>{item.implementationNotes}</div>
                                  </div>
                                  {item.implementationComplexity && (
                                    <div className="text-xs text-muted-foreground">
                                      <span className="font-medium">Complexity:</span> {item.implementationComplexity}
                                    </div>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </div>
                    </div>
                    {showPin && (
                      <div className={`flex items-center justify-center size-8 rounded-full bg-primary flex-shrink-0 transition-opacity duration-250 ${
                        isPinned || isHovered ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <Pin className="size-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}