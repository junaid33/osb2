# Capability Research & Population Task

## Objective
You need to populate missing GitHub code links, documentation URLs, and implementation notes for ALL capabilities in our Open Source Builders database. Currently, most capabilities have empty `githubPath`, `documentationUrl`, and `implementationNotes` fields.

## Data Model Structure
Each OpenSourceCapability has these fields that need to be populated:
- `githubPath` - Relative path to code that implements this capability (e.g., "src/auth/providers/google.ts")
- `documentationUrl` - Link to documentation for this specific capability  
- `implementationNotes` - How this application implements this capability
- `implementationComplexity` - basic/intermediate/advanced (already set, but verify if correct)

## Step 1: Get All Missing Data
Hit the GraphQL API at `http://localhost:3007/api/graphql` with this query:

```graphql
query GetAllCapabilitiesNeedingResearch {
  openSourceApplications {
    id
    name
    slug
    repositoryUrl
    capabilities {
      id
      capability {
        id
        name
        slug
        description
        category
      }
      githubPath
      documentationUrl
      implementationNotes
      implementationComplexity
      isActive
    }
  }
}
```

## Step 2: Identify Applications Needing Research
Filter the results to find all OpenSourceCapabilities where:
- `githubPath` is empty/null
- `documentationUrl` is empty/null  
- `implementationNotes` is empty/null

Create a prioritized list focusing on:
1. **High-impact applications** (popular tools with many stars)
2. **Applications with many capabilities** (like Medusa, Supabase, etc.)
3. **Well-documented projects** (easier to research)

## Step 3: Research Each Capability
For EACH missing capability, you need to find:

### GitHub Path Research
1. Go to the application's GitHub repository
2. Search the codebase for files that implement this specific capability
3. Find the main file/directory that contains the core implementation
4. Record the relative path from repository root (e.g., "packages/medusa/src/services/order.ts")

### Documentation URL Research  
1. Check the application's official documentation
2. Find the specific page that documents this capability
3. Get the exact URL to that documentation section
4. Prefer official docs over blog posts or tutorials

### Implementation Notes Research
1. Read the code and documentation to understand HOW they implement this capability
2. Write 1-2 sentences explaining their approach
3. Include key technical details (frameworks used, architecture patterns, etc.)
4. Examples:
   - "Uses Stripe SDK with webhook handlers for payment processing"
   - "Implements JWT-based auth with refresh token rotation"
   - "GraphQL API with DataLoader for efficient batching"

## Step 4: Output Format
Create a structured list for EACH application like this:

```markdown
## Medusa (ID: cmeasld39006asbbjgos75awb)
Repository: https://github.com/medusajs/medusa

### Order Management (ID: [capability-id])
- **GitHub Path**: `packages/medusa/src/services/order.ts`
- **Documentation URL**: `https://docs.medusajs.com/modules/orders/overview`
- **Implementation Notes**: `Order service with state machine for order lifecycle management, supports draft orders and order editing`
- **Complexity**: intermediate ✓

### Product Catalog Management (ID: [capability-id])  
- **GitHub Path**: `packages/medusa/src/services/product.ts`
- **Documentation URL**: `https://docs.medusajs.com/modules/products/overview`
- **Implementation Notes**: `Product service with variant management, collection grouping, and category hierarchies`
- **Complexity**: intermediate ✓
```

## Step 5: Research Priority Applications
Start with these high-priority applications:

1. **Medusa** - E-commerce platform (Shopify alternative)
2. **Supabase** - Backend-as-a-service (Firebase alternative)  
3. **Strapi** - Headless CMS
4. **Nextcloud** - File sharing/collaboration
5. **Mattermost** - Team communication
6. **Redmine** - Project management
7. **Ghost** - Publishing platform

## Important Guidelines

### Research Quality Standards
- **Be specific**: Don't just say "handles authentication" - explain HOW (OAuth, JWT, sessions, etc.)
- **Be accurate**: Verify the GitHub paths actually exist and contain relevant code
- **Be current**: Use the latest version/documentation
- **Be concise**: 1-2 sentences max for implementation notes

### GitHub Path Standards  
- Always use relative paths from repository root
- Point to the main implementation file, not tests or examples
- If it's a directory, end with trailing slash: `src/auth/`
- If it's distributed across multiple files, pick the main entry point

### Documentation URL Standards
- Prefer official documentation over GitHub README
- Use permanent URLs, not versioned URLs when possible
- Link to the specific section, not the general page
- If no official docs exist, use the GitHub README section

## Expected Deliverables
1. **Complete research list** with all missing data populated
2. **Verification notes** for any capabilities you couldn't research (with reasons)
3. **Update queries** ready to run against the GraphQL API to populate the data

## Success Metrics  
- All high-priority applications have complete capability data
- GitHub paths are verified to exist and contain relevant code
- Documentation URLs are working and relevant
- Implementation notes accurately describe the technical approach

---

**NOTE**: This is foundational work for our prompt builder feature. Each capability with proper GitHub links will enable users to see actual code examples when building with these tools.