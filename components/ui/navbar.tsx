"use client";

import { Sparkles } from "lucide-react";
import { Logo } from "@/features/dashboard/components/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NavbarSearch } from "@/features/search/components/NavbarSearch";
import { DataTableDrawer } from "@/components/ui/DataTableDrawer";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface NavbarProps {
  className?: string;
  apps: any[];
}

export default function Navbar({ className, apps }: NavbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pinnedCapabilities');
      if (saved) {
        setSelectedCapabilities(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading capabilities:', error);
    }
  }, []);

  const handleSelectedCapabilitiesChange = (capabilities) => {
    setSelectedCapabilities(capabilities);
    try {
      localStorage.setItem('pinnedCapabilities', JSON.stringify(capabilities));
    } catch (error) {
      console.error('Error saving capabilities:', error);
    }
  };

  return (
    <>
      <header className={cn("bg-transparent backdrop-blur-0 shadow-none", className)}>
        <div className="flex flex-col">
          {/* Main navbar row */}
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <a href="/" className="text-primary hover:text-primary/90">
                <Logo />
              </a>
            </div>

            {/* Center - Search (hidden on mobile) */}
            <div className="hidden md:flex flex-1 items-center justify-center gap-4 max-w-md">
              <NavbarSearch />
            </div>

            {/* Right side - Theme toggle and Build button */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button 
                size="sm" 
                className="text-sm"
                onClick={() => setDrawerOpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                Build
              </Button>
            </div>
          </div>

          {/* Mobile search row (shown only on mobile) */}
          <div className="flex md:hidden">
            <NavbarSearch />
          </div>
        </div>
      </header>
      
      <DataTableDrawer 
        open={drawerOpen} 
        onOpenChange={setDrawerOpen}
        apps={apps}
        selectedCapabilities={selectedCapabilities}
        onSelectedCapabilitiesChange={handleSelectedCapabilitiesChange}
      />
    </>
  );
}
