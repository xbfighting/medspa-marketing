# MedSpa AI Marketing Platform - Fresh Start

## Project Overview

Create a brand new Next.js application showcasing an AI-driven personalized marketing platform for medical aesthetics clinics. Start from scratch with clean architecture and modern best practices.

## Initial Setup

```bash
# Create new Next.js project
npx create-next-app@latest medspa-marketing --typescript --tailwind --app --src-dir=false --import-alias="@/*"

cd medspa-marketing

# Install essential dependencies
npm install @radix-ui/react-avatar @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @tanstack/react-query recharts date-fns

# Initialize shadcn/ui
npx shadcn@latest init -d

# Add shadcn components we'll need
npx shadcn@latest add button card input label select tabs toast avatar dropdown-menu badge skeleton table dialog
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
│   └── c            # Campaign sample data
└── public/
    └── [assets]

```

### TIPS

- You can copy customers.json and customers.json from /data/*ptah;
- You can refer to the following UI/UX design: <https://claude.ai/public/artifacts/f7bca104-9ea5-4300-9c51-6fd8cb6a5128>

## Development Milestones

### Milestone 1: Project Foundation (Start Here!)

**Goal**: Set up clean Next.js project with basic layout

**Steps**:

1. Run setup commands above
2. Clean up default Next.js content
3. Create basic layout structure
4. Add purple theme colors to tailwind.config.ts:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#faf5ff',
        500: '#9333ea',
        600: '#7c3aed',
        700: '#6d28d9',
      }
    }
  }
}
```

**Create core types** (`lib/types.ts`):

```typescript
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  lifecycleStage: 'New' | 'Active' | 'At-Risk' | 'Dormant'
  customerValue: number
  lastInteraction: string
  // ... rest as defined earlier
}

export interface Campaign {
  id: string
  name: string
  type: 'Email' | 'SMS'
  status: 'Active' | 'Scheduled' | 'Completed'
  // ... rest as defined earlier
}
```

**Verification**:

- `npm run dev` works
- Basic page routes load
- No TypeScript errors

**Commit**: "feat: initialize project with basic structure"

### Milestone 2: Navigation Layout

**Goal**: Implement sidebar navigation and responsive layout

**Create Sidebar** (`components/layout/sidebar.tsx`):

- Logo/Brand at top
- Navigation items with Lucide icons:
  - Dashboard (LayoutDashboard)
  - Customers (Users)
  - Campaigns (Mail)
  - Analytics (BarChart3)
  - Settings (Settings)
- Active state highlighting
- Collapsible on mobile

**Create Header** (`components/layout/header.tsx`):

- Search bar
- User profile dropdown
- Mobile menu toggle

**Update Root Layout** (`app/layout.tsx`):

- Integrate Sidebar and Header
- Responsive flex layout
- Proper spacing

**Verification**:

- Navigation works on all screen sizes
- Active states display correctly
- Clean responsive behavior

**Commit**: "feat: add navigation layout with sidebar"

### Milestone 3: Dashboard Page

**Goal**: Create home dashboard with KPIs and charts

**KPI Cards**:

- Total Customers
- Active Campaigns
- Avg Open Rate
- Monthly Revenue

**Charts**:

- Customer Lifecycle Distribution (Pie)
- Campaign Performance Trend (Line)

**Activity Feed**:

- Recent customer interactions
- Campaign launches
- System events

**Add sample data** (`data/` directory):

- Copy the generated customers.json
- Copy the generated campaigns.json

**Create API routes** to serve data:

```typescript
// app/api/customers/route.ts
import customers from '@/data/customers.json'

export async function GET() {
  return Response.json(customers)
}
```

**Verification**:

- Dashboard displays all widgets
- Charts render with data
- Responsive grid layout

**Commit**: "feat: implement dashboard with KPIs and charts"

### Milestone 4: Customer Management

**Goal**: Build customer list and detail pages

**Customer List** (`app/customers/page.tsx`):

- Search bar (name, email)
- Filter chips (lifecycle stage, loyalty tier)
- Customer cards in grid
- Pagination

**Customer Detail** (`app/customers/[id]/page.tsx`):

- Customer header info
- Purchase history timeline
- Interaction log
- Recommended actions
- Quick action buttons

**Components**:

- CustomerCard with hover effects
- CustomerFilters with state management
- CustomerTimeline for history

**Verification**:

- Search and filters work
- Detail page loads correctly
- Data displays accurately

**Commit**: "feat: add customer list and detail pages"

### Milestone 5: Campaign List & Details

**Goal**: Display campaigns with performance metrics

**Campaign List** (`app/campaigns/page.tsx`):

- Campaign cards with metrics
- Status badges (Active/Scheduled/Completed)
- Type icons (Email/SMS)
- Performance indicators

**Campaign Detail** (`app/campaigns/[id]/page.tsx`):

- Campaign overview
- Target audience
- Content preview
- Performance metrics
- A/B test results (if applicable)

**Verification**:

- All campaigns display
- Metrics are accurate
- Status filtering works

**Commit**: "feat: implement campaign management pages"

### Milestone 6: Create Campaign Wizard (Core Feature!)

**Goal**: Multi-step campaign creation with AI generation

**Step Components**:

1. **Select Recipients**: Customer selection/filtering
2. **Campaign Details**: Name, type, schedule
3. **AI Generation**: Template + tone selection + generate button
4. **Review & Send**: Preview and confirmation

**AI Generation Logic** (`lib/ai-templates.ts`):

```typescript
export function generateContent(
  customers: Customer[],
  template: string,
  tone: 'Professional' | 'Friendly' | 'Urgent'
) {
  // Smart template replacement
  // Tone modifiers
  // Personalization logic
}
```

**State Management**:

- Use React Context or component state
- Preserve data between steps
- Allow back navigation

**Verification**:

- All steps flow smoothly
- AI generation produces varied content
- Preview shows personalization

**Commit**: "feat: add campaign creation wizard with AI generation"

### Milestone 7: Analytics Page

**Goal**: Comprehensive analytics dashboard

**Sections**:

- Performance Overview (date range selector)
- Customer Analytics (segments, LTV)
- Campaign Analytics (by type, by segment)
- Revenue Trends

**Charts**:

- Use Recharts for all visualizations
- Interactive tooltips
- Consistent color scheme

**Verification**:

- All charts render correctly
- Data aggregations are accurate
- Responsive layout

**Commit**: "feat: implement analytics dashboard"

### Milestone 8: Polish & Enhancements

**Goal**: Add professional touches

**Features**:

- Loading states (skeletons)
- Empty states with illustrations
- Error boundaries
- Toast notifications
- Smooth transitions
- Print-friendly reports
- Onboarding tour

**Performance**:

- Implement React Query for caching
- Add optimistic updates
- Lazy load heavy components

**Verification**:

- Smooth user experience
- No console errors
- Fast perceived performance

**Commit**: "feat: add polish and UX enhancements"

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

## Common Issues & Solutions

**Issue**: Module not found errors
**Solution**: Check import paths, use `@/` alias

**Issue**: Hydration errors
**Solution**: Ensure client components marked with 'use client'

**Issue**: Type errors
**Solution**: Define interfaces properly in types.ts

**Issue**: API not working
**Solution**: Check route.ts naming and exports

## Final Checklist

- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Data displays properly
- [ ] AI generation creates varied content
- [ ] Responsive on all devices
- [ ] Performance is smooth
- [ ] Code is well-organized
- [ ] Types are properly defined
- [ ] Build succeeds without warnings
