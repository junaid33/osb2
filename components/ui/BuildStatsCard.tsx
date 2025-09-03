"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { Cell, Pie, PieChart } from "recharts";
import { ChevronLeft, ChevronRight, Pin, Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import debounce from 'lodash.debounce';
import ToolIcon from '@/components/ToolIcon';


interface Capability {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  complexity?: string;
}

interface CapabilityImpl {
  capability: Capability;
  implementationNotes?: string;
  githubPath?: string;
  documentationUrl?: string;
  implementationComplexity?: string;
  isActive?: boolean;
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

interface OpenSourceApp {
  id: string;
  name: string;
  slug: string;
  description?: string;
  repositoryUrl?: string;
  websiteUrl?: string;
  simpleIconSlug?: string;
  simpleIconColor?: string;
  capabilities: CapabilityImpl[];
}


interface BuildStatsCardProps {
  apps: OpenSourceApp[];
  onCapabilityPin?: (capability: any, app: OpenSourceApp) => void;
  onCapabilityUnpin?: (capabilityId: string) => void;
  selectedCapabilities?: Set<string>;
}

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
  const fillColor = compatible ? "#10B981" : "#EF4444";
  const foregroundData = [
    { name: "used", value: percentage, fill: fillColor },
    { name: "remaining", value: 100 - percentage, fill: "transparent" },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-8 w-8">
      <PieChart>
        <Pie
          data={backgroundData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={10}
          outerRadius={14}
          startAngle={90}
          endAngle={-270}
        >
          {backgroundData.map((entry, index) => (
            <Cell key={`bg-cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Pie
          data={foregroundData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={10}
          outerRadius={14}
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

export default function BuildStatsCard({ apps, onCapabilityPin, onCapabilityUnpin, selectedCapabilities: externalSelectedCapabilities }: BuildStatsCardProps) {
  const [currentAppIndex, setCurrentAppIndex] = useState(0);
  const [pinnedCapabilities, setPinnedCapabilities] = useState<Set<string>>(new Set());
  const [hoveredCapability, setHoveredCapability] = useState<string | null>(null);
  const [capabilitySearch, setCapabilitySearch] = useState('');
  const [isAppsDropdownOpen, setIsAppsDropdownOpen] = useState(false);
  const [appSearchTerm, setAppSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const appSearchRef = useRef<HTMLInputElement>(null);

  // Filter apps based on search
  const filteredApps = appSearchTerm.trim() 
    ? apps.filter(app =>
        app.name.toLowerCase().includes(appSearchTerm.toLowerCase()) ||
        app.description?.toLowerCase().includes(appSearchTerm.toLowerCase())
      )
    : apps;

  // Sync pinned capabilities
  const currentApp = apps[currentAppIndex];
  if (externalSelectedCapabilities && currentApp && apps.length > 0) {
    const newPinnedCapabilities = new Set<string>();
    currentApp.capabilities.forEach(capImpl => {
      const compositeId = `${currentApp.id}-${capImpl.capability.id}`;
      if (externalSelectedCapabilities.has(compositeId)) {
        newPinnedCapabilities.add(capImpl.capability.name);
      }
    });
    if (JSON.stringify([...pinnedCapabilities]) !== JSON.stringify([...newPinnedCapabilities])) {
      setPinnedCapabilities(newPinnedCapabilities);
    }
  }

  const handleAppChange = (newIndex: number) => {
    setCurrentAppIndex(newIndex);
    setPinnedCapabilities(new Set());
    setHoveredCapability(null);
    setCapabilitySearch('');
  };

  const nextApp = () => {
    const newIndex = (currentAppIndex + 1) % apps.length;
    handleAppChange(newIndex);
  };

  const prevApp = () => {
    const newIndex = (currentAppIndex - 1 + apps.length) % apps.length;
    handleAppChange(newIndex);
  };

  const toggleAppsDropdown = () => {
    setIsAppsDropdownOpen(!isAppsDropdownOpen);
    if (!isAppsDropdownOpen) {
      setTimeout(() => {
        appSearchRef.current?.focus();
      }, 100);
    }
  };

  const selectApp = (index: number) => {
    const originalIndex = apps.findIndex(a => a.id === apps[index].id);
    handleAppChange(originalIndex);
    setIsAppsDropdownOpen(false);
    setAppSearchTerm('');
  };

  const handlePinCapability = (capability: CapabilityItem) => {
    const currentApp = apps[currentAppIndex];
    if (!currentApp) return;
    
    const capabilityImpl = currentApp.capabilities.find(
      capImpl => capImpl.capability.name === capability.name
    );
    
    if (!capabilityImpl) return;

    const compositeId = `${currentApp.id}-${capabilityImpl.capability.id}`;
    
    if (pinnedCapabilities.has(capability.name)) {
      if (onCapabilityUnpin) {
        onCapabilityUnpin(compositeId);
      }
    } else {
      if (onCapabilityPin) {
        onCapabilityPin(capabilityImpl, currentApp);
      }
    }
  };

  // No apps state
  if (!apps || apps.length === 0) {
    return (
      <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
        <div className="relative flex flex-col space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex flex-col">
              <h3 className="text-sm font-medium text-foreground">No Applications</h3>
              <p className="text-xs text-muted-foreground font-medium">
                No open source applications found
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform capabilities data for current app
  const capabilityData: CapabilityItem[] = currentApp.capabilities.map(capImpl => ({
    name: capImpl.capability.name,
    category: capImpl.capability.category || 'other',
    percentage: 100, // Always 100% for open source
    compatible: true, // Open source is always compatible
    implementationNotes: capImpl.implementationNotes,
    githubPath: capImpl.githubPath,
    documentationUrl: capImpl.documentationUrl,
    implementationComplexity: capImpl.implementationComplexity,
    description: capImpl.capability.description,
    complexity: capImpl.capability.complexity,
  }));

  const compatibleCount = capabilityData.length; // All are compatible
  const totalCount = capabilityData.length;
  const compatibilityScore = 100; // 100% compatibility for open source

  return (
    <div className="group relative p-1 rounded-xl transition-all duration-300 bg-muted border border-border ring-2 ring-border/50">
      <div className="relative flex flex-col space-y-2">
        {/* Header in the outer gray card */}
        <div className="flex items-center justify-between px-3 py-2">
          {/* Left side: Logo and capabilities info */}
          <div className="flex items-center gap-2 flex-1 min-w-0" ref={dropdownRef}>
            <ToolIcon
              name={currentApp.name}
              simpleIconSlug={currentApp.simpleIconSlug}
              simpleIconColor={currentApp.simpleIconColor}
              size={32}
            />
            
            {/* Custom dropdown trigger */}
            <div className="relative flex-1 min-w-0">
              <div className="flex flex-col items-start min-w-0">
                <button
                  onClick={toggleAppsDropdown}
                  className="flex items-center gap-1 text-left"
                >
                  <h3 className="text-sm font-medium text-foreground truncate">{currentApp.name}</h3>
                  <ChevronDown 
                    className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
                      isAppsDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    {compatibleCount} Capabilities
                  </p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsCollapsed(!isCollapsed)
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isCollapsed ? 'Expand' : 'Collapse'}
                  </button>
                </div>
              </div>

              {/* Custom dropdown */}
              {isAppsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 max-h-96 rounded-lg border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-lg z-50">
                  <div className="p-2">
                    <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                      Switch to other open source app
                    </div>
                    
                    {/* Search Input */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        ref={appSearchRef}
                        type="search"
                        placeholder="Search applications..."
                        className="pl-9 pr-3 h-9 text-sm"
                        value={appSearchTerm}
                        onChange={(e) => setAppSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    {/* Applications List */}
                    <div className="space-y-1 max-h-64 overflow-y-auto">
                      {filteredApps.length > 0 ? (
                        filteredApps.map((app, index) => (
                          <button
                            key={app.id}
                            onClick={() => selectApp(index)}
                            className="w-full flex items-center gap-3 p-2 rounded-md text-left hover:bg-muted/50 transition-colors"
                          >
                            <ToolIcon
                              name={app.name}
                              simpleIconSlug={app.simpleIconSlug}
                              simpleIconColor={app.simpleIconColor}
                              size={24}
                            />
                            <div className="flex flex-col min-w-0 flex-1">
                              <div className="text-sm font-medium text-foreground truncate">
                                {app.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {app.capabilities.length} capabilities
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {appSearchTerm.trim() 
                            ? `No results found for "${appSearchTerm}"` 
                            : "No applications available"
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right side: Navigation and donut */}
          <div className="flex items-center gap-2">
            {/* Left chevron */}
            <Button
              variant="ghost"
              size="sm"
              onClick={prevApp}
              disabled={apps.length <= 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            {/* Right chevron */}
            <Button
              variant="ghost"
              size="sm"
              onClick={nextApp}
              disabled={apps.length <= 1}
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
        {!isCollapsed && (
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
                .map((item) => {
                const isPinned = pinnedCapabilities.has(item.name);
                const isHovered = hoveredCapability === item.name;
                const showPin = item.compatible; // Only show pin for compatible capabilities
                
                return (
                  <div
                    key={item.name}
                    onClick={showPin ? (e) => {
                      e.preventDefault()
                      handlePinCapability(item)
                    } : undefined}
                    onMouseEnter={() => setHoveredCapability(item.name)}
                    onMouseLeave={() => setHoveredCapability(null)}
                    className="flex items-center justify-between gap-5 rounded-2xl bg-background border p-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold truncate">{item.name}</div>
                        <div className="flex items-center gap-1 text-[11px] font-medium">
                          {item.githubPath && currentApp.repositoryUrl && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(`${currentApp.repositoryUrl}/blob/main/${item.githubPath}`, '_blank');
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
                                  INFO
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 p-3" side="bottom" align="start">
                                <div className="space-y-3">
                                  <div className="text-sm font-medium">{item.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {item.implementationNotes}
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
                })
            })()}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}