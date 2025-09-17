"use client";

import { CombinedLogo } from "@/components/CombinedLogo";
import { ArrowUpRight } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="pt-28 pb-8 md:pt-36 md:pb-16">
            <div className="max-w-2xl text-left">
              <div className="flex items-center justify-start mb-4">
                <CombinedLogo />
              </div>
              <p className="flex items-center text-sm text-muted-foreground mb-4 uppercase font-medium tracking-wide">
                An Openship initiative <ArrowUpRight className="size-4 ml-1"/>
              </p>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                opensource.builders
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <div className="max-w-2xl space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 font-instrument-serif">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              opensource.builders started as a simple alternatives directory but
              has evolved into something much more significant. We're building a
              capability-driven platform that represents a fundamental shift
              toward personal software and composable applications.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 font-instrument-serif">The Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              We envision a world where software is personal, composable, and
              truly owned by its users. This isn't just about finding
              alternatives to proprietary software—it's about understanding
              capabilities, building composable solutions, and creating a
              decentralized marketplace where developers and users can connect
              directly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 font-instrument-serif">Connected Ecosystem</h2>
            <p className="text-muted-foreground leading-relaxed">
              opensource.builders is part of a larger initiative that includes
              Openship (the open source fulfillment platform) and Openfront (the
              headless commerce solution). Together, these projects demonstrate
              how open source software can provide powerful, flexible
              alternatives to monolithic proprietary platforms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 font-instrument-serif">
              Capability-Driven Development
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Rather than simply cataloging tools, we focus on capabilities. We
              help developers understand what features and functions they need,
              then connect them with the open source solutions that provide
              those capabilities. This approach enables better decision-making
              and more thoughtful software architecture.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 font-instrument-serif">
              The Future of Software
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We believe the future belongs to personal software—applications
              that users truly own and control. By building composable, open
              source solutions and connecting them through decentralized
              marketplaces, we're working toward a world where software serves
              people, not the other way around.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
