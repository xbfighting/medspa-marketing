export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  lifecycleStage: 'New' | 'Active' | 'At-Risk' | 'Dormant'
  customerValue: number
  lastInteraction: string
  avatar?: string
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  joinDate: string
  totalSpent: number
  visitCount: number
  preferences: {
    treatments: string[]
    communication: 'Email' | 'SMS' | 'Both'
    frequency: 'Weekly' | 'Bi-weekly' | 'Monthly'
  }
  tags: string[]
  notes: string
}

export interface Campaign {
  id: string
  name: string
  type: 'Email' | 'SMS'
  status: 'Active' | 'Scheduled' | 'Completed'
  subject: string
  content: string
  targetAudience: {
    segments: string[]
    criteria: {
      lifecycleStage?: string[]
      loyaltyTier?: string[]
      totalSpentMin?: number
      lastInteractionDays?: number
    }
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
  }
  schedule: {
    sendAt: string
    timezone: string
  }
  createdAt: string
  createdBy: string
  template: string
  personalization: {
    enabled: boolean
    fields: string[]
  }
}

export interface Activity {
  id: string
  type: 'customer_interaction' | 'campaign_sent' | 'system_event'
  title: string
  description: string
  timestamp: string
  entityId: string
  entityType: 'customer' | 'campaign'
  metadata: Record<string, unknown>
}

export interface KPI {
  title: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: string
}

export interface ChartData {
  name: string
  value: number
  color?: string
  [key: string]: any
}