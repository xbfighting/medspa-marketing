# AI Campaign Strategy Platform - Implementation Guide

## Project Overview

Transform the existing MedSpa marketing platform to focus on AI-powered campaign creation through natural language input, while maintaining all existing functionality.

### Core Objectives

1. Add natural language interface for campaign creation
2. Implement AI strategy recommendation system
3. Create comprehensive template library (20-25 templates)
4. Maintain separation between AI and Manual flows
5. Focus on campaigns module (not full CRM)

### Architecture Changes

- **Keep**: Campaigns module (enhanced)
- **Add**: Templates page, AI creation flow
- **Simplify**: Dashboard (campaign-focused only)
- **Hide**: Customers page (becomes selector within campaigns)
- **Remove**: Settings page

---

## Milestone 1: Foundation Setup

### Goal

Create new home page with natural language input and update navigation structure.

### Todo List

- [ ] Replace existing redirect home page with natural language interface
- [ ] Add pre-filled example text
- [ ] Implement basic form submission
- [ ] Update navigation to include Home
- [ ] Add Templates to navigation (placeholder)
- [ ] Test navigation works correctly

### Implementation

#### 1.1 New Home Page

**File**: `app/page.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Pre-fill with example for demo
  useEffect(() => {
    setInput("I need to fill empty appointment slots next Tuesday and Wednesday")
  }, [])

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsProcessing(true)
    // Store in sessionStorage for next step
    sessionStorage.setItem('campaign_goal', input)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800))

    // Navigate to AI flow
    router.push('/campaigns/ai-create/strategies')
  }

  const examples = [
    "Re-engage customers who haven't visited in 3 months with exclusive offers",
    "Promote our summer specials to active customers",
    "Fill appointment slots for next week",
    "Launch our new laser treatment to women over 35",
    "Send birthday offers with special discounts"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Create Smarter Campaigns with AI
          </h1>
          <p className="text-xl text-gray-600">
            Describe your marketing goal in plain English, and let AI create the perfect strategy
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="p-8 shadow-xl">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your marketing goal in plain English..."
            className="min-h-[120px] text-lg resize-none mb-6"
            autoFocus
          />

          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing your request...</span>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Campaign with AI
              </>
            )}
          </Button>
        </Card>

        {/* Examples */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example)}
                className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                • {example}
              </button>
            ))}
          </div>
        </div>

        {/* Alternative Path */}
        <div className="mt-12 text-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-gray-500 px-4">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <Button
            variant="outline"
            onClick={() => router.push('/templates')}
            size="lg"
          >
            Browse Strategy Templates
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

#### 1.2 Update Navigation

**File**: `app/layout.tsx`

```tsx
import { Home, Layers } from 'lucide-react'  // Add these imports

// Update navigation items array
const navItems = [
  { href: '/', label: 'Home', icon: Home },  // Add this
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/campaigns', label: 'Campaigns', icon: Mail },
  { href: '/templates', label: 'Templates', icon: Layers },  // Add this
  { href: '/analytics', label: 'Analytics', icon: BarChart3 }
  // Remove Customers from here
]
```

### Verification Checklist

- [ ] Home page loads with pre-filled example
- [ ] Input accepts natural language text
- [ ] Processing state shows correctly
- [ ] Examples are clickable and update input
- [ ] Navigation includes Home and Templates
- [ ] Routes to AI flow work

**⚠️ STOP: Please confirm Milestone 1 completion before proceeding**

---

## Milestone 2: AI Flow Structure

### Goal

Create the AI campaign creation flow structure and AI understanding display.

### Todo List

- [ ] Create AI flow directory structure
- [ ] Implement strategies page with AI understanding
- [ ] Create mock strategy recommendations (3-5)
- [ ] Add strategy selection functionality
- [ ] Create route handlers for AI flow
- [ ] Test flow navigation

### Implementation

#### 2.1 Create AI Flow Structure

Create the following directory structure:

```
app/campaigns/ai-create/
├── layout.tsx
├── strategies/
│   └── page.tsx
├── customize/
│   └── page.tsx
└── generate/
    └── page.tsx
```

#### 2.2 AI Flow Layout

**File**: `app/campaigns/ai-create/layout.tsx`

```tsx
export default function AICreateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {children}
      </div>
    </div>
  )
}
```

#### 2.3 Strategies Page

**File**: `app/campaigns/ai-create/strategies/page.tsx`

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react'

interface Understanding {
  goal: string
  target: string
  urgency: string
  timeline: string
  strategy: string
}

interface Strategy {
  id: string
  name: string
  icon: string
  description: string
  metrics: {
    avgROI: string
    successRate: string
    timeline: string
    usageCount: number
  }
  tags: string[]
}

export default function StrategiesPage() {
  const router = useRouter()
  const [understanding, setUnderstanding] = useState<Understanding | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(true)

  useEffect(() => {
    const goal = sessionStorage.getItem('campaign_goal')
    if (goal) {
      analyzeGoal(goal)
    } else {
      router.push('/')
    }
  }, [router])

  const analyzeGoal = async (goal: string) => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock AI understanding
    const mockUnderstanding: Understanding = {
      goal: goal.includes('fill') ? 'Fill Appointments' :
            goal.includes('re-engage') ? 'Customer Reactivation' :
            'Promote Services',
      target: goal.includes('haven\'t visited') ? 'Dormant Customers' :
              goal.includes('active') ? 'Active Customers' :
              'All Customers',
      urgency: goal.includes('next week') || goal.includes('Tuesday') ? 'High' : 'Medium',
      timeline: goal.includes('next week') ? '7 days' : '14-21 days',
      strategy: goal.includes('re-engage') ? 'win-back' :
                goal.includes('fill') ? 'urgent-booking' :
                'promotional'
    }

    setUnderstanding(mockUnderstanding)

    // Mock strategy recommendations
    const mockStrategies: Strategy[] = [
      {
        id: 'urgent-slots',
        name: 'Last-Minute Slot Filler',
        icon: '⏰',
        description: 'Fill empty appointments quickly with time-sensitive offers',
        metrics: {
          avgROI: '280%',
          successRate: '72%',
          timeline: '3-5 days',
          usageCount: 89
        },
        tags: ['urgent', 'appointments', 'quick-win']
      },
      {
        id: 'flash-sale',
        name: 'Flash Sale Campaign',
        icon: '⚡',
        description: 'Create urgency with limited-time exclusive offers',
        metrics: {
          avgROI: '340%',
          successRate: '68%',
          timeline: '7 days',
          usageCount: 156
        },
        tags: ['promotional', 'urgency', 'conversion']
      },
      {
        id: 'exclusive-vip',
        name: 'VIP Exclusive Access',
        icon: '👑',
        description: 'Make customers feel special with exclusive appointment slots',
        metrics: {
          avgROI: '410%',
          successRate: '81%',
          timeline: '5-7 days',
          usageCount: 203
        },
        tags: ['vip', 'exclusive', 'loyalty']
      }
    ]

    setStrategies(mockStrategies)
    setIsAnalyzing(false)
  }

  const handleStrategySelect = (strategyId: string) => {
    sessionStorage.setItem('selected_strategy', strategyId)
    router.push('/campaigns/ai-create/customize')
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">AI is analyzing your marketing goal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* AI Understanding Card */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            I understand you want to:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Goal</p>
              <p className="font-medium">{understanding?.goal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Target</p>
              <p className="font-medium">{understanding?.target}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgency</p>
              <p className="font-medium">{understanding?.urgency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Timeline</p>
              <p className="font-medium">{understanding?.timeline}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              Adjust Understanding
            </Button>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Looks Good
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended Strategies</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <Card
              key={strategy.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedStrategy === strategy.id ? 'ring-2 ring-purple-600' : ''
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{strategy.icon}</span>
                  {strategy.metrics.usageCount > 100 && (
                    <Badge variant="secondary">Popular</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                <CardDescription>{strategy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <p className="font-medium">{strategy.metrics.avgROI}</p>
                    <p className="text-xs text-gray-500">ROI</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <p className="font-medium">{strategy.metrics.successRate}</p>
                    <p className="text-xs text-gray-500">Success</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <p className="font-medium">{strategy.metrics.timeline}</p>
                    <p className="text-xs text-gray-500">Timeline</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {strategy.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedStrategy === strategy.id && (
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStrategySelect(strategy.id)
                    }}
                  >
                    Use This Strategy
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Verification Checklist

- [ ] AI understanding displays correctly
- [ ] Loading animation works
- [ ] Strategy cards show with proper data
- [ ] Selection state is visible
- [ ] Navigation to customize page works
- [ ] Data persists in sessionStorage

**⚠️ STOP: Please confirm Milestone 2 completion before proceeding**

---

## Milestone 3: Strategy Detail & Customization

### Goal

Implement strategy detail modal and customer selection/customization page.

### Todo List

- [ ] Create strategy detail modal component
- [ ] Add customizable parameters (discount, urgency, tone)
- [ ] Implement customize page for target customers
- [ ] Add customer group selection
- [ ] Create preview of selected customers
- [ ] Connect to existing customer data

### Implementation

#### 3.1 Strategy Detail Modal

**File**: `components/campaigns/strategy-detail-modal.tsx`

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'

interface StrategyDetailModalProps {
  strategy: any
  isOpen: boolean
  onClose: () => void
  onConfirm: (customization: any) => void
}

export function StrategyDetailModal({
  strategy,
  isOpen,
  onClose,
  onConfirm
}: StrategyDetailModalProps) {
  const [customization, setCustomization] = useState({
    discount: '20%',
    urgency: 'medium',
    tone: 'friendly'
  })

  if (!strategy) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{strategy.icon}</span>
            {strategy.name}
          </DialogTitle>
          <DialogDescription>{strategy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timeline Visualization */}
          <div>
            <h3 className="font-semibold mb-3">Campaign Timeline</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
              <div className="relative flex justify-between">
                {[1, 7, 14].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-white border-2 border-purple-500 rounded-full flex items-center justify-center mb-2">
                      {index === 2 ? '💬' : '✉️'}
                    </div>
                    <p className="text-xs font-medium">Day {day}</p>
                    <p className="text-xs text-gray-500">
                      {index === 0 ? 'Launch' : index === 1 ? 'Reminder' : 'Final'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div>
            <h3 className="font-semibold mb-4">Customize Parameters</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Discount */}
              <div className="space-y-3">
                <Label>Discount Amount</Label>
                <RadioGroup
                  value={customization.discount}
                  onValueChange={(value) => setCustomization({...customization, discount: value})}
                >
                  {['15%', '20%', '25%', '30%'].map(amount => (
                    <div key={amount} className="flex items-center space-x-2">
                      <RadioGroupItem value={amount} />
                      <Label className="font-normal">{amount}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Urgency */}
              <div className="space-y-3">
                <Label>Urgency Level</Label>
                <RadioGroup
                  value={customization.urgency}
                  onValueChange={(value) => setCustomization({...customization, urgency: value})}
                >
                  {['low', 'medium', 'high'].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} />
                      <Label className="font-normal capitalize">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Tone */}
              <div className="space-y-3">
                <Label>Message Tone</Label>
                <RadioGroup
                  value={customization.tone}
                  onValueChange={(value) => setCustomization({...customization, tone: value})}
                >
                  {['professional', 'friendly', 'urgent'].map(tone => (
                    <div key={tone} className="flex items-center space-x-2">
                      <RadioGroupItem value={tone} />
                      <Label className="font-normal capitalize">{tone}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Expected Results */}
          <div>
            <h3 className="font-semibold mb-3">Expected Results</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Open Rate</p>
                  <p className="text-xl font-semibold">45-55%</p>
                </div>
                <div>
                  <p className="text-gray-600">Click Rate</p>
                  <p className="text-xl font-semibold">12-18%</p>
                </div>
                <div>
                  <p className="text-gray-600">Conversion</p>
                  <p className="text-xl font-semibold">8-12%</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg ROI</p>
                  <p className="text-xl font-semibold">{strategy.metrics?.avgROI || '320%'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(customization)}>
            Continue with These Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 3.2 Customize Target Customers Page

**File**: `app/campaigns/ai-create/customize/page.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Filter, ChevronRight } from 'lucide-react'
import customersData from '@/data/customers.json'

export default function CustomizePage() {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = useState({
    lifecycle: ['At-Risk', 'Dormant'],
    value: 'all'
  })
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  // Filter customers based on strategy
  const filteredCustomers = customersData.filter(customer => {
    if (selectedFilters.lifecycle.length > 0) {
      return selectedFilters.lifecycle.includes(customer.lifecycleStage)
    }
    return true
  }).slice(0, 20) // Limit for demo

  useEffect(() => {
    // Auto-select all filtered customers initially
    setSelectedCustomers(filteredCustomers.map(c => c.id))
  }, [])

  const handleProceed = () => {
    sessionStorage.setItem('selected_customers', JSON.stringify(selectedCustomers))
    router.push('/campaigns/ai-create/generate')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Select Target Customers</h1>
        <p className="text-gray-600 mt-2">
          Based on your strategy, we recommend targeting these customer segments
        </p>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recommended Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['At-Risk', 'Dormant', 'High-Value', 'Recent Visit'].map((segment) => (
              <Badge
                key={segment}
                variant={selectedFilters.lifecycle.includes(segment) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  // Toggle filter logic
                }}
              >
                {segment}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex justify-between items-center">
              <span>Target Customers</span>
              <span className="text-sm font-normal text-gray-600">
                {selectedCustomers.length} selected
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <label
                key={customer.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCustomers([...selectedCustomers, customer.id])
                    } else {
                      setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{customer.lifecycleStage}</Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Value: ${customer.customerValue}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          onClick={handleProceed}
          disabled={selectedCustomers.length === 0}
        >
          Continue with {selectedCustomers.length} Customers
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

### Verification Checklist

- [ ] Strategy detail modal opens and displays correctly
- [ ] Parameter customization works
- [ ] Customer filtering works
- [ ] Customer selection persists
- [ ] Navigation between pages works
- [ ] Data flows correctly through the process

**⚠️ STOP: Please confirm Milestone 3 completion before proceeding**

---

## Milestone 4: Template Library

### Goal

Create comprehensive template library with 20-25 pre-built strategies.

### Todo List

- [ ] Create complete template data file
- [ ] Build templates browsing page
- [ ] Add search and filter functionality
- [ ] Implement category organization
- [ ] Add template usage from library
- [ ] Create "My Templates" section placeholder

### Implementation

#### 4.1 Complete Template Data

**File**: `data/strategy-templates.json`

```json
{
  "templates": [
    {
      "id": "spring-refresh",
      "name": "Spring Refresh Campaign",
      "icon": "🌸",
      "description": "Capitalize on spring renewal mindset to promote skincare treatments",
      "category": "seasonal",
      "metrics": {
        "avgROI": "320%",
        "successRate": "78%",
        "timeline": "21 days",
        "usageCount": 45
      },
      "tags": ["seasonal", "skincare", "multi-touch"],
      "targetAudience": "All active customers",
      "bestMonths": ["March", "April", "May"]
    },
    {
      "id": "summer-body",
      "name": "Summer Body Prep",
      "icon": "☀️",
      "description": "Target body contouring and skin treatments for summer readiness",
      "category": "seasonal",
      "metrics": {
        "avgROI": "380%",
        "successRate": "82%",
        "timeline": "30 days",
        "usageCount": 92
      },
      "tags": ["seasonal", "body", "planning"],
      "targetAudience": "Customers interested in body treatments",
      "bestMonths": ["April", "May", "June"]
    },
    {
      "id": "holiday-glow",
      "name": "Holiday Party Glow",
      "icon": "✨",
      "description": "Help customers look their best for holiday events and parties",
      "category": "seasonal",
      "metrics": {
        "avgROI": "290%",
        "successRate": "75%",
        "timeline": "14 days",
        "usageCount": 67
      },
      "tags": ["seasonal", "events", "facial"],
      "targetAudience": "Active customers with event history",
      "bestMonths": ["November", "December"]
    },
    {
      "id": "new-year-transformation",
      "name": "New Year, New You",
      "icon": "🎊",
      "description": "Leverage New Year resolutions for comprehensive treatment packages",
      "category": "seasonal",
      "metrics": {
        "avgROI": "410%",
        "successRate": "71%",
        "timeline": "30 days",
        "usageCount": 103
      },
      "tags": ["seasonal", "transformation", "packages"],
      "targetAudience": "All customer segments",
      "bestMonths": ["January", "February"]
    },
    {
      "id": "vip-winback",
      "name": "VIP Win-back Strategy",
      "icon": "💎",
      "description": "Re-engage high-value dormant customers with exclusive offers",
      "category": "lifecycle",
      "metrics": {
        "avgROI": "420%",
        "successRate": "89%",
        "timeline": "14 days",
        "usageCount": 127
      },
      "tags": ["re-engagement", "high-value", "proven"],
      "targetAudience": "Dormant VIP customers"
    },
    {
      "id": "welcome-series",
      "name": "New Patient Welcome",
      "icon": "👋",
      "description": "Onboard new patients with educational content and intro offers",
      "category": "lifecycle",
      "metrics": {
        "avgROI": "350%",
        "successRate": "85%",
        "timeline": "30 days",
        "usageCount": 201
      },
      "tags": ["onboarding", "education", "retention"],
      "targetAudience": "New customers (first 30 days)"
    },
    {
      "id": "loyalty-rewards",
      "name": "Loyalty Milestone Rewards",
      "icon": "🏆",
      "description": "Celebrate customer milestones with exclusive perks",
      "category": "lifecycle",
      "metrics": {
        "avgROI": "380%",
        "successRate": "91%",
        "timeline": "7 days",
        "usageCount": 156
      },
      "tags": ["loyalty", "retention", "rewards"],
      "targetAudience": "Long-term active customers"
    },
    {
      "id": "at-risk-prevention",
      "name": "Churn Prevention Campaign",
      "icon": "🚨",
      "description": "Identify and re-engage customers showing signs of churning",
      "category": "lifecycle",
      "metrics": {
        "avgROI": "340%",
        "successRate": "67%",
        "timeline": "21 days",
        "usageCount": 89
      },
      "tags": ["retention", "at-risk", "preventive"],
      "targetAudience": "At-risk customers (reduced activity)"
    },
    {
      "id": "birthday-vip",
      "name": "Birthday VIP Treatment",
      "icon": "🎂",
      "description": "Make customers feel special with birthday month offers",
      "category": "lifecycle",
      "metrics": {
        "avgROI": "290%",
        "successRate": "88%",
        "timeline": "30 days",
        "usageCount": 234
      },
      "tags": ["birthday", "personalized", "special-occasion"],
      "targetAudience": "Customers with birthday in target month"
    },
    {
      "id": "botox-maintenance",
      "name": "Botox Maintenance Reminder",
      "icon": "💉",
      "description": "Timely reminders for Botox touch-ups every 3-4 months",
      "category": "treatment",
      "metrics": {
        "avgROI": "450%",
        "successRate": "92%",
        "timeline": "7 days",
        "usageCount": 312
      },
      "tags": ["maintenance", "botox", "recurring"],
      "targetAudience": "Botox patients due for treatment"
    },
    {
      "id": "filler-followup",
      "name": "Filler Maintenance Program",
      "icon": "💋",
      "description": "Keep dermal filler results optimal with timely touch-ups",
      "category": "treatment",
      "metrics": {
        "avgROI": "390%",
        "successRate": "87%",
        "timeline": "14 days",
        "usageCount": 189
      },
      "tags": ["maintenance", "fillers", "recurring"],
      "targetAudience": "Filler patients (6-12 months)"
    },
    {
      "id": "laser-package",
      "name": "Laser Treatment Series",
      "icon": "⚡",
      "description": "Promote multi-session laser packages for better results",
      "category": "treatment",
      "metrics": {
        "avgROI": "360%",
        "successRate": "73%",
        "timeline": "45 days",
        "usageCount": 78
      },
      "tags": ["laser", "packages", "series"],
      "targetAudience": "Customers interested in laser treatments"
    },
    {
      "id": "skincare-upgrade",
      "name": "Skincare Regimen Upgrade",
      "icon": "🧴",
      "description": "Upsell medical-grade skincare to treatment patients",
      "category": "treatment",
      "metrics": {
        "avgROI": "280%",
        "successRate": "69%",
        "timeline": "14 days",
        "usageCount": 145
      },
      "tags": ["skincare", "upsell", "products"],
      "targetAudience": "Recent treatment patients"
    },
    {
      "id": "event-prep",
      "name": "Special Event Prep",
      "icon": "👰",
      "description": "Target customers preparing for weddings, reunions, or events",
      "category": "event",
      "metrics": {
        "avgROI": "340%",
        "successRate": "81%",
        "timeline": "60 days",
        "usageCount": 56
      },
      "tags": ["events", "planning", "packages"],
      "targetAudience": "Customers with upcoming events"
    },
    {
      "id": "flash-friday",
      "name": "Flash Friday Sales",
      "icon": "⚡",
      "description": "Create urgency with limited Friday-only deals",
      "category": "event",
      "metrics": {
        "avgROI": "310%",
        "successRate": "76%",
        "timeline": "1 day",
        "usageCount": 198
      },
      "tags": ["flash-sale", "urgency", "weekly"],
      "targetAudience": "Price-sensitive active customers"
    },
    {
      "id": "referral-reward",
      "name": "Referral Rewards Program",
      "icon": "🤝",
      "description": "Incentivize customers to refer friends and family",
      "category": "event",
      "metrics": {
        "avgROI": "520%",
        "successRate": "64%",
        "timeline": "30 days",
        "usageCount": 167
      },
      "tags": ["referral", "word-of-mouth", "incentive"],
      "targetAudience": "Satisfied active customers"
    },
    {
      "id": "membership-launch",
      "name": "VIP Membership Launch",
      "icon": "👑",
      "description": "Convert regular customers to recurring membership model",
      "category": "event",
      "metrics": {
        "avgROI": "480%",
        "successRate": "71%",
        "timeline": "14 days",
        "usageCount": 43
      },
      "tags": ["membership", "recurring", "vip"],
      "targetAudience": "High-frequency customers"
    },
    {
      "id": "post-treatment-care",
      "name": "Post-Treatment Care Series",
      "icon": "🌟",
      "description": "Nurture patients after major treatments for satisfaction and retention",
      "category": "lifecycle",
      "metrics": {
        "avgROI": "260%",
        "successRate": "94%",
        "timeline": "30 days",
        "usageCount": 289
      },
      "tags": ["aftercare", "satisfaction", "retention"],
      "targetAudience": "Recent treatment patients"
    },
    {
      "id": "seasonal-skin-check",
      "name": "Seasonal Skin Assessment",
      "icon": "🔍",
      "description": "Quarterly skin health check-ups and treatment recommendations",
      "category": "seasonal",
      "metrics": {
        "avgROI": "330%",
        "successRate": "77%",
        "timeline": "14 days",
        "usageCount": 124
      },
      "tags": ["assessment", "preventive", "quarterly"],
      "targetAudience": "All active customers"
    },
    {
      "id": "couples-package",
      "name": "Couples Treatment Special",
      "icon": "💑",
      "description": "Target couples for joint treatment sessions and packages",
      "category": "event",
      "metrics": {
        "avgROI": "370%",
        "successRate": "72%",
        "timeline": "21 days",
        "usageCount": 87
      },
      "tags": ["couples", "packages", "special"],
      "targetAudience": "Customers with partners"
    }
  ]
}
```

#### 4.2 Templates Page

**File**: `app/templates/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, Clock, Users, Plus } from 'lucide-react'
import Link from 'next/link'
import templatesData from '@/data/strategy-templates.json'

export default function TemplatesPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter templates
  const filteredTemplates = templatesData.templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
                         template.description.toLowerCase().includes(search.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get popular templates
  const popularTemplates = [...templatesData.templates]
    .sort((a, b) => b.metrics.usageCount - a.metrics.usageCount)
    .slice(0, 6)

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Strategy Templates</h1>
          <p className="text-gray-600 mt-2">
            Proven campaign strategies for medical aesthetics
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Custom
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs for categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Templates ({templatesData.templates.length})</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Popular Templates Section */}
      {selectedCategory === 'all' && search === '' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔥 Most Popular</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularTemplates.slice(0, 3).map((template) => (
              <TemplateCard key={template.id} template={template} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearch('')
            setSelectedCategory('all')
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Template Card Component
function TemplateCard({ template, featured = false }: { template: any, featured?: boolean }) {
  return (
    <Card className={`hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] ${featured ? 'border-purple-200' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <span className="text-3xl">{template.icon}</span>
          <div className="flex gap-1">
            {featured && <Badge variant="default">Popular</Badge>}
            {template.metrics.usageCount > 200 && <Badge variant="secondary">Trending</Badge>}
          </div>
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div className="text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="font-medium">{template.metrics.avgROI}</p>
            <p className="text-xs text-gray-500">Avg ROI</p>
          </div>
          <div className="text-center">
            <Users className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="font-medium">{template.metrics.successRate}</p>
            <p className="text-xs text-gray-500">Success</p>
          </div>
          <div className="text-center">
            <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="font-medium">{template.metrics.timeline}</p>
            <p className="text-xs text-gray-500">Timeline</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        <Button className="w-full" size="sm" asChild>
          <Link href={`/campaigns/create?template=${template.id}`}>
            Use This Strategy
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
```

### Verification Checklist

- [ ] Templates page displays all 20 templates
- [ ] Search functionality works across name, description, and tags
- [ ] Category filtering works correctly
- [ ] Popular templates section shows top 3
- [ ] Cards display all metrics correctly
- [ ] Use This Strategy button links properly

**⚠️ STOP: Please confirm Milestone 4 completion before proceeding**

---

## Milestone 5: Integration & Polish

### Goal

Integrate AI and Manual flows, add save template functionality, and polish the experience.

### Todo List

- [ ] Update campaign list with create options modal
- [ ] Add AI badge to campaigns created with AI
- [ ] Implement save as template dialog
- [ ] Add success animations
- [ ] Simplify dashboard to campaign-only metrics
- [ ] Test complete flow end-to-end

### Implementation

#### 5.1 Create Campaign Options Modal

**File**: `components/campaigns/create-options-modal.tsx`

```tsx
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateOptionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateOptionsModal({ isOpen, onClose }: CreateOptionsModalProps) {
  const router = useRouter()

  const handleAIAssistant = () => {
    onClose()
    router.push('/')
  }

  const handleManualSetup = () => {
    onClose()
    router.push('/campaigns/create')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How would you like to create your campaign?</DialogTitle>
          <DialogDescription>
            Choose between AI-powered creation or traditional manual setup
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <button
            onClick={handleAIAssistant}
            className="w-full p-4 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Describe your goal and let AI create the perfect strategy
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleManualSetup}
            className="w-full p-4 border-2 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold">Manual Setup</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Create a campaign from scratch with full control
                </p>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

#### 5.2 Update Campaign List

**File**: `app/campaigns/page.tsx` (Update existing)

```tsx
// Add to imports
import { CreateOptionsModal } from '@/components/campaigns/create-options-modal'
import { Sparkles } from 'lucide-react'

// Add state
const [showCreateOptions, setShowCreateOptions] = useState(false)

// Update create button
<Button onClick={() => setShowCreateOptions(true)}>
  <Plus className="mr-2 h-4 w-4" />
  Create Campaign
</Button>

// Add modal before closing div
<CreateOptionsModal
  isOpen={showCreateOptions}
  onClose={() => setShowCreateOptions(false)}
/>

// In campaign card, add AI indicator
{campaign.createdWithAI && (
  <Badge variant="secondary" className="gap-1">
    <Sparkles className="h-3 w-3" />
    AI Created
  </Badge>
)}
```

#### 5.3 Save as Template Dialog

**File**: `components/campaigns/save-template-dialog.tsx`

```tsx
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface SaveTemplateDialogProps {
  campaign: any
  performance: {
    improvement: number
    openRate: number
    clickRate: number
    conversionRate: number
    roi: number
  }
  isOpen: boolean
  onClose: () => void
  onSave: (template: any) => void
}

export function SaveTemplateDialog({
  campaign,
  performance,
  isOpen,
  onClose,
  onSave
}: SaveTemplateDialogProps) {
  const [templateName, setTemplateName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('custom')

  const handleSave = () => {
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      icon: '⭐',
      description,
      category,
      metrics: {
        avgROI: `${performance.roi}%`,
        successRate: `${performance.conversionRate}%`,
        timeline: '14 days',
        usageCount: 0
      },
      tags: ['custom', 'proven', category],
      createdFrom: campaign.id
    }

    onSave(newTemplate)
    onClose()

    // Show success toast
    toast({
      title: "Template saved!",
      description: "Your successful campaign has been saved as a reusable template.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">
                This campaign performed {performance.improvement}% above average!
              </span>
            </div>
            Save it as a template to reuse this winning strategy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g., Summer VIP Reactivation"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what makes this strategy effective..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Strategy</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="lifecycle">Customer Lifecycle</SelectItem>
                <SelectItem value="treatment">Treatment-Based</SelectItem>
                <SelectItem value="event">Event/Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Performance Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Performance Highlights</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Open Rate:</span>
                <span className="font-medium ml-2">{performance.openRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Click Rate:</span>
                <span className="font-medium ml-2">{performance.clickRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Conversion:</span>
                <span className="font-medium ml-2">{performance.conversionRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">ROI:</span>
                <span className="font-medium ml-2">{performance.roi}%</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Not Now
          </Button>
          <Button onClick={handleSave} disabled={!templateName || !description}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

#### 5.4 Simplified Dashboard

**File**: `app/dashboard/page.tsx` (Update to show only campaign metrics)

```tsx
// Remove customer-related widgets
// Focus only on:
// - Total Active Campaigns
// - Average Campaign Performance
// - Revenue from Campaigns
// - Recent Campaign Activities
```

### Verification Checklist

- [ ] Create campaign modal appears and works
- [ ] Both paths (AI/Manual) are accessible
- [ ] AI-created campaigns show badge
- [ ] Save template dialog appears for high-performing campaigns
- [ ] Template is saved and appears in library
- [ ] Dashboard shows only campaign metrics

**⚠️ STOP: Please confirm Milestone 5 completion before proceeding**

---

## Summary & Final Testing

### What We've Built

1. ✅ Natural language home page for campaign creation
2. ✅ AI flow with strategy recommendations
3. ✅ Strategy customization and customer selection
4. ✅ Comprehensive template library (20+ templates)
5. ✅ Integration between AI and Manual flows
6. ✅ Save successful campaigns as templates

### Complete Flow Test

1. [ ] Create campaign via natural language → AI flow → Generate content
2. [ ] Create campaign via manual flow
3. [ ] Browse and use template from library
4. [ ] Save high-performing campaign as template
5. [ ] Verify all data persists correctly

### Final Commit

```bash
git add .
git commit -m "feat: complete AI-powered campaign strategy platform"
```

## Next Steps (Future Enhancements)

1. Real NLP processing with OpenAI/Claude API
2. Actual performance tracking and analytics
3. A/B testing capabilities
4. Multi-language support
5. Export/Import templates
