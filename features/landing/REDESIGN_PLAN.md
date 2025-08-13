# Landing Page V2 Redesign Plan

## Overview
This redesign updates the landing page to work with the new Keystone V2 models while maintaining the core homepage functionality that works well. The focus is on:

1. **Maintaining the excellent homepage UX** - proprietary app selection → alternatives display
2. **Fixing the "0 out of 36 features" issue** with reliable capability counting  
3. **Updating all queries** to use new model names (Tool→Application, Feature→Capability)
4. **Enhancing the build page** with better capability selection and GitHub code links

## Current Landing Page Analysis

### What Works Really Well Currently 

#### 1. Homepage Hero & App Selection (`components/Hero.tsx`)
```typescript
// Current implementation that works great:
- Clean search interface for proprietary apps
- Nice visual cards with app icons
- Smooth transitions and loading states
- Categories sidebar for filtering
```
**Keep**: Entire Hero component design and UX
**Update**: Change queries from `tools` to `applications`

#### 2. Alternative Cards Display (`components/AlternativeCard.tsx`)
```typescript
// Current features that work well:
- Clean card design with app icons  
- GitHub stars display
- "Alternative to X" labeling
- Good visual hierarchy
```
**Keep**: Visual design and layout
**Fix**: The capability counting logic
**Update**: Field names for new models

#### 3. Feature Comparison UI (`components/FeatureBadge.tsx`)
```typescript
// Current UI that's excellent:
- Green checkmarks for matching capabilities
- Red X for missing capabilities  
- "34/36 94%" display
- Expandable feature list
```
**Keep**: Entire visual design
**Fix**: The underlying data logic that causes 0/36 issues

### Current Problems to Fix

#### 1. Feature Counting Logic Issues - CRITICAL FIX
**Problem**: 
```typescript
// Current logic in AlternativeCard.tsx causing 0/36:
const proprietaryFeatures = alternative.proprietaryTool.features?.filter(f => 
  f.qualityScore >= 7 && f.verified
) || []
const matchingFeatures = alternative.openSourceTool.features?.filter(osf =>
  osf.qualityScore >= 7 && osf.verified &&
  proprietaryFeatures.some(pf => pf.feature.id === osf.feature.id)
) || []
```
**Issues**:
- `qualityScore >= 7` filters out too many features
- `verified` boolean inconsistently set  
- Complex scoring system unreliable
- **Result**: Often shows "0 out of 36 features"

**Solution with Virtual Fields (ULTIMATE FIX)**:
```typescript
// NEW: No calculation needed on frontend!
// Virtual fields pre-calculate everything:
const { matchingCapabilitiesCount, totalCapabilitiesCount, capabilityPercentage } = openSourceApp

// Display is trivial:
return (
  <div className="capability-display">
    <div className="count">{matchingCapabilitiesCount}/{totalCapabilitiesCount}</div>
    <div className="percentage">({capabilityPercentage}%)</div>
  </div>
)
// Always displays: "34/36 (94%)" - NEVER 0/36
```

**Why Virtual Fields Completely Fix 0/36 Issue**:
1. **No frontend logic**: All calculations done in Keystone virtual fields
2. **Always reliable**: Virtual fields can't return inconsistent data
3. **Automatic updates**: Recalculated when data changes
4. **Simple queries**: Frontend just requests pre-calculated numbers
5. **One connection**: Each open source app connects to ONE proprietary app

#### 2. Tool vs Application Naming
**Problem**: All queries use old `tools`, `features` field names
**Solution**: Update to `applications`, `capabilities`

#### 3. Build Page Enhancement Opportunities
**Problem**: Generic feature selection without implementation guidance
**Solution**: Add GitHub code links and implementation complexity

## Detailed Component Updates

### 1. Hero Component (`components/Hero.tsx`)
**Current Implementation**: Works great, minimal changes needed

**Changes Required**:
```typescript
// OLD query:
const GET_PROPRIETARY_TOOLS = `
  query GetProprietaryTools {
    tools(where: { isOpenSource: { equals: false } }) {
      id
      name 
      slug
      simpleIconSlug
      simpleIconColor
    }
  }
`

// NEW query:
const GET_PROPRIETARY_APPLICATIONS = `
  query GetProprietaryApplications {
    applications(where: { isOpenSource: { equals: false } }) {
      id
      name
      slug  
      simpleIconSlug
      simpleIconColor
    }
  }
`
```

**Files to Update**:
- `actions/getProprietaryTools.ts` → `actions/getProprietaryApplications.ts`
- Update all references from `tools` to `applications`

### 2. AlternativeCard Component (`components/AlternativeCard.tsx`)
**Current Implementation**: Great visual design, needs data logic fixes

**Critical Fix - Capability Counting**:
```typescript
// CURRENT (broken logic):
const proprietaryFeatures = alternative.proprietaryTool?.features?.filter(f => 
  f.qualityScore >= 7 && f.verified
) || []

const matchingFeatures = alternative.openSourceTool?.features?.filter(osf =>
  osf.qualityScore >= 7 && osf.verified &&
  proprietaryFeatures.some(pf => pf.feature.id === osf.feature.id)
) || []

// NEW (reliable logic):
const proprietaryCapabilities = alternative.proprietaryApplication?.capabilities?.filter(c => 
  c.isActive
) || []

const matchingCapabilities = alternative.openSourceApplication?.capabilities?.filter(osc =>
  osc.isActive &&
  proprietaryCapabilities.some(pc => pc.capability.id === osc.capability.id)
) || []

const percentage = proprietaryCapabilities.length > 0 
  ? Math.round((matchingCapabilities.length / proprietaryCapabilities.length) * 100)
  : 0
```

**GraphQL Query Update with Virtual Fields (SUPER SIMPLE)**:
```typescript
// OLD complex query causing 0/36 issues:
query GetAlternatives($slug: String!) {
  alternatives(where: { proprietaryTool: { slug: { equals: $slug } } }) {
    openSourceTool {
      features {
        qualityScore  # Complex filtering fails
        verified      # Inconsistent data
        feature { name }
      }
    }
    proprietaryTool {
      features {
        qualityScore  # Complex filtering fails
        verified      # Inconsistent data
        feature { name }  
      }
    }
  }
}

// NEW super simple query with virtual fields:
query GetAlternativesToProprietary($slug: String!) {
  proprietaryApplication(where: { slug: $slug }) {
    id
    name
    description
    simpleIconSlug
    simpleIconColor
    
    # All open source alternatives to this proprietary app:
    openSourceAlternatives {
      id
      name
      slug
      description
      githubStars
      repositoryUrl
      simpleIconSlug
      simpleIconColor
      
      # Virtual fields - pre-calculated, always reliable:
      matchingCapabilitiesCount    # 34
      totalCapabilitiesCount       # 36
      capabilityPercentage         # 94
      
      # Rich capability data for expanded view:
      capabilities(where: { isActive: { equals: true } }) {
        id
        implementationNotes
        githubPath
        documentationUrl
        implementationComplexity
        capability {
          id
          name
          description
          category
        }
      }
    }
  }
}

// Build page query (open source apps only):
query SearchOpenSourceApplications($search: String!) {
  openSourceApplications(where: {
    OR: [
      { name: { contains: $search, mode: insensitive } }
      { description: { contains: $search, mode: insensitive } }
    ]
  }) {
    id
    name
    slug
    description
    repositoryUrl
    githubStars
    primaryAlternativeTo {
      name  # "Alternative to Shopify"
    }
    capabilities(where: { isActive: { equals: true } }) {
      id
      implementationNotes
      githubPath
      documentationUrl
      implementationComplexity
      capability {
        id
        name
        description
        category
      }
    }
  }
}

// Homepage hero query (proprietary apps only):
query GetProprietaryApplications {
  proprietaryApplications {
    id
    name
    slug
    description
    simpleIconSlug
    simpleIconColor
    category {
      name
    }
    # Count of available alternatives:
    openSourceAlternatives {
      id  # Just count
    }
  }
}
```

### 3. FeatureBadge Component (`components/FeatureBadge.tsx`) 
**Current Implementation**: Perfect visual design, needs data updates

**Changes Required**:
```typescript
// Update prop types:
interface FeatureBadgeProps {
  capability: {  // renamed from feature
    id: string
    name: string
    description?: string
    category?: string
  }
  isImplemented: boolean
  implementationNotes?: string
}

// Update display logic:
const FeatureBadge = ({ capability, isImplemented, implementationNotes }: FeatureBadgeProps) => {
  return (
    <div className={cn(
      "flex items-center gap-2 p-2 rounded-lg border",
      isImplemented ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
    )}>
      {isImplemented ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <XCircle className="h-4 w-4 text-red-600" />  
      )}
      <span className="text-sm">{capability.name}</span>
      {implementationNotes && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-3 w-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              {implementationNotes}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
```

### 4. AlternativesList Component (`components/AlternativesList.tsx`)
**Current Implementation**: Good structure, needs query updates

**Changes Required**:
- Update queries from `tools` to `applications`
- Fix capability counting logic
- Update prop types and interfaces

### 5. Build Page Enhancements

#### Current Build Page Issues:
1. Uses old `Tool` model terminology
2. Generic feature descriptions don't help implementation  
3. No direct links to code examples
4. Complexity not indicated

#### Enhanced Build Page Components:

**ToolSelector → ApplicationSelector**:
```typescript
// Enhanced search with new fields:
const SEARCH_APPLICATIONS = `
  query SearchApplications($search: String!) {
    applications(where: {
      OR: [
        { name: { contains: $search, mode: insensitive } }
        { description: { contains: $search, mode: insensitive } }
      ]
      isOpenSource: { equals: true }
    }) {
      id
      name
      slug
      description
      repositoryUrl
      githubStars
      capabilities(where: { isActive: { equals: true } }) {
        id
        implementationNotes
        githubPath                    # NEW: Direct link to code
        documentationUrl              # NEW: Link to docs  
        implementationComplexity      # NEW: Basic/Intermediate/Advanced
        capability {
          id
          name
          description
          category                    # NEW: For better grouping
          complexity                  # NEW: Overall complexity
        }
      }
    }
  }
`
```

**Enhanced FeatureSelector → CapabilitySelector**:
```typescript
interface SelectedCapability {
  id: string
  capabilityId: string
  applicationId: string
  name: string
  description?: string
  category?: string
  applicationName: string
  applicationIcon?: string
  applicationColor?: string
  applicationRepo?: string
  
  // NEW enhancement fields:
  githubPath?: string           # Direct link to implementing code
  documentationUrl?: string     # Link to capability docs
  implementationComplexity?: string  # Basic/Intermediate/Advanced
  implementationNotes?: string  # How this app implements it
}
```

**Enhanced Prompt Generation**:
```typescript
// Current generic prompts:
`Implement ${feature.applicationName}'s ${feature.name}.`

// NEW enhanced prompts with direct code links:
const generateCapabilityPrompt = (capability: SelectedCapability, templateId: string) => {
  let prompt = `Implement ${capability.applicationName}'s ${capability.name}.\n\n`
  
  if (capability.githubPath) {
    prompt += `Reference implementation: ${capability.githubPath}\n`
  }
  
  if (capability.documentationUrl) {
    prompt += `Documentation: ${capability.documentationUrl}\n`
  }
  
  if (capability.implementationComplexity) {
    const complexityGuide = {
      'basic': 'This is a straightforward implementation.',
      'intermediate': 'This requires moderate technical expertise.',
      'advanced': 'This is a complex implementation requiring careful planning.'
    }
    prompt += `Complexity: ${complexityGuide[capability.implementationComplexity]}\n`
  }
  
  if (capability.implementationNotes) {
    prompt += `Implementation notes: ${capability.implementationNotes}\n`
  }
  
  return prompt
}
```

## File Structure Updates

### Actions Directory (`features/landing-v2/actions/`)
```
OLD:                           NEW:
getProprietaryTools.ts    →   getProprietaryApplications.ts  
getTool.ts               →   getApplication.ts
getAlternatives.ts       →   getAlternatives.ts (update queries)
```

### Components Directory (`features/landing-v2/components/`)
```
AlternativeCard.tsx          # Update capability counting logic
AlternativesList.tsx         # Update queries and prop types
FeatureBadge.tsx            # Rename to CapabilityBadge.tsx
Hero.tsx                    # Update queries
ProprietarySoftware.tsx     # Update queries
ToolLogo.tsx               # Rename to ApplicationLogo.tsx
ToolSelector.tsx           # Rename to ApplicationSelector.tsx (build page)
```

## GraphQL Query Migration

### Priority 1: Homepage Queries (Fix 0/36 Issue)
```typescript
// HIGH PRIORITY - This query causes the 0/36 display issue:
query GetAlternatives($slug: String!) {
  alternatives(where: { proprietaryApplication: { slug: { equals: $slug } } }) {
    id
    similarityScore
    openSourceApplication {
      id
      name
      slug
      githubStars
      simpleIconSlug
      simpleIconColor
      capabilities(where: { isActive: { equals: true } }) {  # Simple boolean check
        capability {
          id
          name
        }
      }
    }
    proprietaryApplication {
      capabilities(where: { isActive: { equals: true } }) {  # Simple boolean check
        capability {
          id
          name
        }
      }
    }
  }
}
```

### Priority 2: Build Page Queries (Enhancement)
```typescript
// Enhanced for better build experience:
query SearchCapabilities($search: String!) {
  applications(where: {
    isOpenSource: { equals: true }
    capabilities: {
      some: {
        OR: [
          { capability: { name: { contains: $search, mode: insensitive } } }
          { capability: { description: { contains: $search, mode: insensitive } } }
        ]
        isActive: { equals: true }
      }
    }
  }) {
    id
    name
    slug
    repositoryUrl
    capabilities(where: { 
      isActive: { equals: true }
      capability: {
        OR: [
          { name: { contains: $search, mode: insensitive } }
          { description: { contains: $search, mode: insensitive } }
        ]
      }
    }) {
      id
      githubPath
      documentationUrl
      implementationComplexity
      implementationNotes
      capability {
        id
        name
        description
        category
      }
    }
  }
}
```

## Testing Strategy

### 1. Homepage Functionality
- [ ] Test proprietary app selection  
- [ ] Verify alternatives display correctly
- [ ] **CRITICAL**: Verify capability counting shows actual numbers (not 0/36)
- [ ] Test percentage calculations
- [ ] Test feature badge display

### 2. Build Page Functionality  
- [ ] Test application search
- [ ] Test capability selection
- [ ] Test prompt generation with new GitHub links
- [ ] Test complexity indicators

### 3. Data Migration Validation
- [ ] Verify all applications migrated correctly
- [ ] Verify all capability relationships maintained
- [ ] Verify alternative relationships work
- [ ] Test with real Shopify/WooCommerce data

## Migration Steps

### Phase 1: Backend Model Migration
1. Implement Keystone V2 models
2. Migrate existing data to new models  
3. Run parallel GraphQL endpoints during testing

### Phase 2: Frontend Landing Page Updates
1. Update all queries to new model names
2. Fix capability counting logic in AlternativeCard
3. Test homepage with real data
4. Verify "34/36" displays work correctly

### Phase 3: Build Page Enhancements
1. Update build page components
2. Add GitHub code links 
3. Add complexity indicators
4. Enhance prompt generation

### Phase 4: Cleanup & Deploy
1. Remove old model references
2. Update app imports to use landing-v2
3. Deploy and monitor

This redesign maintains all the excellent UX that currently works while fixing the core data issues and adding valuable enhancements for the build page experience.