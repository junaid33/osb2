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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
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
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif">Beginnings</h2>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium">
              Opensource.Builders began in 2020 as a way to explore open source alternatives to popular
              proprietary applications. At that time there were many new projects gaining attention.
              Five years later, open source adoption is even stronger. Almost every proprietary application
              has at least one open source counterpart. The challenge is that deciding what counts as a
              true alternative is still highly subjective.
            </p>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif">A New Approach</h2>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
              Describing one application as an alternative to another often oversimplifies the reality.
              Consider Ghost, an open source blogging platform. You might call it an alternative to
              Shopify since both support blogging, yet Shopify also provides payment systems, product
              management, and storefronts that Ghost does not.
            </p>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium">
              To solve this, we focus on tracking features rather than vague comparisons. When you look
              at applications through the lens of features, you can see exactly where they overlap and
              where they differ. This perspective also shows how multiple open source projects can replace
              a single proprietary product. Proprietary tools often accumulate more features over time,
              but many of those additions are incomplete and fail to meet user expectations. By understanding
              features clearly, you can assemble a combination of open source projects that give you exactly
              what you need, while maintaining flexibility. If one project drops a feature, you can replace
              just that piece instead of being forced into an entirely new system.
            </p>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif">Reinventing the Wheel</h2>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
              In the past, rewriting or refactoring software was often viewed as wasted effort. With the
              rise of AI, the cost of these tasks has fallen dramatically. Developers who understand a
              codebase well can now reimplement or improve entire sections more quickly and with greater
              confidence.
            </p>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium">
              Opensource.Builders supports this by doing more than simply listing which applications offer
              certain features. We also track where in the code those features live. This gives AI the
              context it needs to learn from working examples and then generate similar functionality for
              your environment. This is the idea behind the Build Drawer. You select the features you want
              from existing projects, and we create a structured prompt you can feed to the AI system of
              your choice. The AI then has a clear guide to help you bring those features into your own project.
            </p>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif">Personal Software</h2>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
              AI is not only changing the way software is built but also how people choose what software
              to use. Most users today still adapt themselves to whatever application they adopt. If they
              need a customization or a fix for an edge case, they must learn the application's API or
              extension system, which often creates deeper lock-in.
            </p>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium">
              Now the dynamics are shifting. People can begin making their own software. <a href="https://leerob.com/personal-software" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Lee Robinson compares
              this to cooking at home</a>. In the past, most people could not prepare meals for themselves and
              had to rely on professionals. In the same way, they had to rely on proprietary apps. AI is
              giving people the equivalent of a home kitchen. Instead of being stuck with takeout, you can
              now make something personal, tailored to your needs. We see Opensource.Builders as a cookbook.
              The recipes are open source projects, and our work is helping you understand and adapt them.
              Even if the results are not perfect, you have control over the process and can keep improving
              the outcome.
            </p>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4 font-instrument-serif">Openship & opensource.builders</h2>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
              At Openship, we are creating open source software-as-a-service platforms for every vertical,
              from hotels to grocery stores to barbershops. Together, these vertical platforms form the
              foundation of a decentralized marketplace, where businesses fully own their storefronts and
              customer relationships.
            </p>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium mb-4">
              Opensource.Builders is the companion to that vision. Each Openfront we build can stand on its
              own, but with our feature tracking and Build Drawer, businesses can go further. For example,
              if you run a barbershop and also want to sell merchandise, you can take e-commerce features
              from the retail Openfront and add them to the barbershop Openfront. The result is a personal
              platform that reflects your business exactly as you need it.
            </p>
            <p className="text-muted-foreground leading-relaxed sm:text-lg font-medium">
              Instead of being limited by a single provider, you have the freedom to combine, customize,
              and evolve your own Openfront, building an alternative that truly belongs to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
