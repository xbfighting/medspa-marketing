export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  age?: number
  gender?: string
  location?: {
    city: string
    state: string
  }
  lifecycleStage: 'New' | 'Active' | 'At-Risk' | 'Dormant'
  customerValue: number
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum'
  lastInteraction: string
  registrationDate?: string
  lastProcedure?: string
  lastProcedureDate?: string
  nextMaintenanceDate?: string
  procedureHistory?: Array<{
    date: string
    procedure: string
    amount: number
    doctor: string
    satisfaction: string
  }>
  avatar?: string
  // Computed fields for backward compatibility
  joinDate?: string
  totalSpent?: number
  visitCount?: number
  preferences?: {
    treatments: string[]
    communication: 'Email' | 'SMS' | 'Both'
    frequency: 'Weekly' | 'Bi-weekly' | 'Monthly'
  }
  tags?: string[]
  notes?: string
}

export interface Campaign {
  id: string
  name: string
  type: 'Email' | 'SMS'
  status: 'Active' | 'Scheduled' | 'Completed'
  category?: string
  tone?: string
  createdDate: string
  scheduledDate?: string
  sentDate?: string
  subject: string
  previewText?: string
  content: string
  ctaText?: string
  ctaUrl?: string
  targetSegment?: {
    lifecycleStages?: string[]
    procedures?: string[]
    ageRange?: {
      min: number
      max: number
    }
    lastVisitDays?: {
      min: number
      max: number
    }
  }
  targetCustomerIds?: string[]
  offer?: {
    type: string
    value: string
    validUntil: string
    procedures: string[]
  }
  performance?: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
    appointments?: number
    deliveryRate?: string
    openRate?: string
    clickRate?: string
    conversionRate?: string
    roi?: number
  }
  // Backward compatibility fields
  targetAudience?: {
    segments: string[]
    criteria: {
      lifecycleStage?: string[]
      loyaltyTier?: string[]
      totalSpentMin?: number
      lastInteractionDays?: number
    }
  }
  metrics?: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
    revenue: number
  }
  schedule?: {
    sendAt: string
    timezone: string
  }
  createdAt?: string
  createdBy?: string
  template?: string
  personalization?: {
    enabled: boolean
    fields: string[]
  }
  createdWithAI?: boolean
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