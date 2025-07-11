# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# MedSpa AI Marketing Platform

## Project Overview

An AI-driven personalized marketing platform for medical aesthetics clinics built with Next.js 15, TypeScript, and modern web technologies. The platform enables clinics to manage customers, create AI-powered campaigns, and analyze performance metrics.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Deploy to Vercel
npm run vercel-build
```

## Project Structure

```
medspa-marketing/
├── app/
│   ├── (dashboard)/
│   │   └── page.tsx              # Dashboard (home page)
│   ├── customers/
│   │   ├── page.tsx              # Customer list
│   │   └── [id]/
│   │       └── page.tsx          # Customer detail
│   ├── campaigns/
│   │   ├── page.tsx              # Campaign list
│   │   ├── create/
│   │   │   └── page.tsx          # Create campaign wizard
│   │   └── [id]/
│   │       └── page.tsx          # Campaign detail
│   ├── analytics/
│   │   └── page.tsx              # Analytics page
│   ├── settings/
│   │   └── page.tsx              # Settings page
│   ├── api/
│   │   ├── customers/
│   │   │   ├── route.ts          # GET all customers
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET single customer
│   │   ├── campaigns/
│   │   │   ├── route.ts          # GET all campaigns
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET single campaign
│   │   └── generate/
│   │       └── route.ts          # POST generate AI content
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   ├── header.tsx            # Top header
│   │   └── mobile-nav.tsx        # Mobile navigation
│   ├── dashboard/
│   │   ├── kpi-card.tsx          # KPI metric cards
│   │   ├── lifecycle-chart.tsx   # Customer lifecycle pie chart
│   │   ├── campaign-chart.tsx    # Campaign performance line chart
│   │   └── activity-feed.tsx     # Recent activities
│   ├── customers/
│   │   ├── customer-card.tsx     # Customer list item
│   │   ├── customer-filters.tsx  # Search and filters
│   │   └── customer-detail.tsx   # Customer info sections
│   └── campaigns/
│       ├── campaign-card.tsx     # Campaign list item
│       ├── campaign-filters.tsx  # Campaign filters
│       └── create-wizard.tsx     # Multi-step creator
├── lib/
│   ├── types.ts                  # TypeScript definitions
│   ├── utils.ts                  # Utility functions
│   ├── api.ts                    # API client functions
│   └── ai-templates.ts           # AI content generation
├── hooks/
│   ├── use-customers.ts          # Customer data hooks
│   └── use-campaigns.ts          # Campaign data hooks
├── data/
│   ├── customers.json            # Customer sample data
│   └── campaigns.json            # Campaign sample data
└── public/
    └── [assets]

```

## High-Level Architecture

### Tech Stack
- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4 with custom purple theme
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Query for server state
- **Data Visualization**: Recharts
- **Animations**: Framer Motion, tailwindcss-animate
- **Rich Text**: Tiptap editor

### Key Architectural Patterns

1. **Route Groups**: Using `(dashboard)` for grouped layout without affecting URL structure
2. **API Routes**: RESTful endpoints in `/app/api` returning JSON data from `/data` files
3. **Component Organization**:
   - Base UI components in `/components/ui` (shadcn/ui)
   - Feature components organized by domain (dashboard, customers, campaigns, analytics)
   - Shared layout components for navigation
4. **Type Safety**: All major data structures defined in `/lib/types.ts`
5. **Data Fetching**: React Query hooks in `/hooks` for caching and synchronization
6. **AI Content Generation**: Template-based system in `/lib/ai-templates.ts`

### Purple Theme Configuration

The project uses a custom purple theme defined in `tailwind.config.ts`:
- Primary colors: `#9333ea` (500), `#7c3aed` (600), `#6d28d9` (700)
- CSS variables for theme colors (--primary, --background, etc.)
- Consistent use of `primary` color throughout components

### Key Features

1. **Customer Management**: 
   - Lifecycle stages (New, Active, At-Risk, Dormant)
   - Loyalty tiers (Bronze, Silver, Gold, Platinum)
   - Purchase history and interaction tracking

2. **Campaign System**:
   - Multi-step creation wizard with AI content generation
   - Email and SMS campaign types
   - A/B testing capabilities
   - Performance tracking and analytics

3. **AI-Powered Content**:
   - Template-based content generation
   - Tone customization (Professional, Friendly, Urgent)
   - Customer-specific personalization
   - Dynamic preview with personalization indicators

4. **Analytics Dashboard**:
   - Customer lifecycle distribution
   - Campaign performance metrics
   - Revenue tracking
   - Segmentation analysis

## Key Implementation Details

### API Routes Pattern

```typescript
// Consistent error handling
export async function GET(request: Request) {
  try {
    const data = await fetchData()
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    )
  }
}
```

### React Query Setup

```typescript
// app/providers.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Consistent UI Patterns

- Card-based layouts
- 8px spacing grid
- Purple accent color (#9333ea)
- Subtle shadows (shadow-sm)
- Smooth transitions (transition-all duration-200)

## Testing Each Milestone

After each milestone:

1. Run `npm run build` - must pass
2. Test all new features manually
3. Check responsive design
4. Verify no console errors
5. Commit with descriptive message

## Common Development Tasks

### Adding a New Component
1. Check existing components in `/components` for similar patterns
2. Use shadcn/ui components as base when applicable
3. Follow the established TypeScript interface patterns from `/lib/types.ts`
4. Apply consistent styling with Tailwind classes

### Working with Data
- Customer data: `/data/customers.json` with 100 sample records
- Campaign data: `/data/campaigns.json` with 20 sample campaigns
- API routes already configured to serve this data
- Use React Query hooks from `/hooks` for data fetching

### Modifying the AI Content Generation
- Core logic in `/lib/ai-templates.ts`
- Templates support customer personalization tokens
- Tone modifiers adjust language style
- Preview component shows personalization in real-time

### Adding New Routes
1. Create route in `/app` directory following Next.js App Router conventions
2. Use route groups like `(dashboard)` for shared layouts
3. API routes go in `/app/api` and should return JSON responses
4. Follow the error handling pattern shown in existing API routes
