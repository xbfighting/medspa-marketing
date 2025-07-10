import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Mail, BarChart3, Search, Plus } from 'lucide-react'

interface EmptyStateProps {
  type: 'customers' | 'campaigns' | 'analytics' | 'search' | 'general'
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  showIcon?: boolean
}

export function EmptyState({ 
  type, 
  title, 
  description, 
  actionLabel, 
  onAction,
  showIcon = true 
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case 'customers':
        return <Users className="h-12 w-12 text-gray-400" />
      case 'campaigns':
        return <Mail className="h-12 w-12 text-gray-400" />
      case 'analytics':
        return <BarChart3 className="h-12 w-12 text-gray-400" />
      case 'search':
        return <Search className="h-12 w-12 text-gray-400" />
      default:
        return <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
          <div className="h-6 w-6 bg-gray-300 rounded-full" />
        </div>
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {showIcon && (
          <div className="mb-4">
            {getIcon()}
          </div>
        )}
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
        
        {actionLabel && onAction && (
          <Button onClick={onAction} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>{actionLabel}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export function CustomersEmptyState({ onCreateCustomer }: { onCreateCustomer?: () => void }) {
  return (
    <EmptyState
      type="customers"
      title="No customers found"
      description="Get started by adding your first customer to begin tracking their journey and personalizing their experience."
      actionLabel="Add Customer"
      onAction={onCreateCustomer}
    />
  )
}

export function CampaignsEmptyState({ onCreateCampaign }: { onCreateCampaign?: () => void }) {
  return (
    <EmptyState
      type="campaigns"
      title="No campaigns yet"
      description="Create your first marketing campaign to engage with your customers and grow your business."
      actionLabel="Create Campaign"
      onAction={onCreateCampaign}
    />
  )
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      type="search"
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or filters to find what you're looking for."
      showIcon={true}
    />
  )
}

export function AnalyticsEmptyState() {
  return (
    <EmptyState
      type="analytics"
      title="Not enough data"
      description="Analytics will appear here once you have customers and campaigns with activity data."
      showIcon={true}
    />
  )
}