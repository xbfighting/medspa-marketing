'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Users, 
  Mail, 
  BarChart3, 
  FileText,
  Sparkles,
  Database,
  Filter
} from 'lucide-react'

interface EmptyStateProps {
  icon?: any
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'secondary'
    icon?: any
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  illustration?: 'search' | 'data' | 'campaigns' | 'customers' | 'analytics' | 'custom'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  illustration = 'custom',
  size = 'md',
  className
}: EmptyStateProps) {
  const sizes = {
    sm: {
      container: 'py-8',
      icon: 'h-8 w-8 mb-3',
      title: 'text-base',
      description: 'text-sm',
      spacing: 'space-y-3'
    },
    md: {
      container: 'py-12',
      icon: 'h-12 w-12 mb-4',
      title: 'text-lg',
      description: 'text-base',
      spacing: 'space-y-4'
    },
    lg: {
      container: 'py-16',
      icon: 'h-16 w-16 mb-6',
      title: 'text-xl',
      description: 'text-lg',
      spacing: 'space-y-6'
    }
  }

  const sizeConfig = sizes[size]

  const getIllustration = () => {
    if (Icon) return Icon

    switch (illustration) {
      case 'search':
        return Search
      case 'data':
        return Database
      case 'campaigns':
        return Mail
      case 'customers':
        return Users
      case 'analytics':
        return BarChart3
      default:
        return FileText
    }
  }

  const IllustrationIcon = getIllustration()

  const getIllustrationAnimation = () => {
    switch (illustration) {
      case 'search':
        return {
          animate: {
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" as const
          }
        }
      case 'data':
        return {
          animate: {
            y: [0, -5, 0],
            opacity: [0.7, 1, 0.7]
          },
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
      default:
        return {
          animate: {
            scale: [1, 1.05, 1]
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut" as const
          }
        }
    }
  }

  return (
    <motion.div
      className={cn("text-center", sizeConfig.container, className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn("flex flex-col items-center", sizeConfig.spacing)}>
        <motion.div
          className={cn(
            "mx-auto text-gray-400 relative",
            sizeConfig.icon
          )}
          {...getIllustrationAnimation()}
        >
          <IllustrationIcon className="w-full h-full" />
          
          {illustration === 'campaigns' && (
            <>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full"
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full"
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
            </>
          )}
          
          {illustration === 'analytics' && (
            <motion.div
              className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.h3
            className={cn("font-medium text-gray-900 mb-2", sizeConfig.title)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {title}
          </motion.h3>
          
          <motion.p
            className={cn("text-gray-500 mb-6", sizeConfig.description)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {description}
          </motion.p>
        </div>

        {(action || secondaryAction) && (
          <motion.div
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || 'default'}
                className="flex items-center gap-2"
              >
                {action.icon && <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            )}
            
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="outline"
                className="flex items-center gap-2"
              >
                {secondaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Legacy support - keep existing component interfaces
export function CustomersEmptyState({ onCreateCustomer }: { onCreateCustomer?: () => void }) {
  return (
    <EmptyState
      illustration="customers"
      title="No customers found"
      description="Get started by adding your first customer to begin tracking their journey and personalizing their experience."
      action={onCreateCustomer ? {
        label: "Add Customer",
        onClick: onCreateCustomer,
        icon: Plus
      } : undefined}
    />
  )
}

export function CampaignsEmptyState({ onCreateCampaign }: { onCreateCampaign?: () => void }) {
  return (
    <EmptyState
      illustration="campaigns"
      title="No campaigns yet"
      description="Create your first marketing campaign to engage with your customers and grow your business."
      action={onCreateCampaign ? {
        label: "Create Campaign",
        onClick: onCreateCampaign,
        icon: Plus
      } : undefined}
    />
  )
}

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      illustration="search"
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or filters to find what you're looking for."
      size="sm"
    />
  )
}

export function AnalyticsEmptyState() {
  return (
    <EmptyState
      illustration="analytics"
      title="Not enough data"
      description="Analytics will appear here once you have customers and campaigns with activity data."
    />
  )
}

// New enhanced empty states
export function EmptyCampaigns({ onCreateCampaign }: { onCreateCampaign: () => void }) {
  return (
    <EmptyState
      illustration="campaigns"
      title="No campaigns yet"
      description="Create your first marketing campaign to start engaging with your customers and growing your business."
      action={{
        label: "Create Campaign",
        onClick: onCreateCampaign,
        icon: Plus
      }}
    />
  )
}

export function EmptyCustomers({ onAddCustomer }: { onAddCustomer: () => void }) {
  return (
    <EmptyState
      illustration="customers"
      title="No customers found"
      description="Start building your customer base by adding your first customer or importing existing customer data."
      action={{
        label: "Add Customer",
        onClick: onAddCustomer,
        icon: Plus
      }}
      secondaryAction={{
        label: "Import Customers",
        onClick: () => console.log('Import customers')
      }}
    />
  )
}

export function EmptySearchResults({ 
  query, 
  onClearSearch 
}: { 
  query: string
  onClearSearch: () => void 
}) {
  return (
    <EmptyState
      illustration="search"
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or clearing filters to see more results."
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: "outline"
      }}
      size="sm"
    />
  )
}

export function EmptyAnalytics() {
  return (
    <EmptyState
      illustration="analytics"
      title="Not enough data yet"
      description="Send some campaigns and gather customer interactions to see analytics and insights here."
      size="md"
    />
  )
}

export function EmptyFilterResults({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <EmptyState
      icon={Filter}
      title="No matches found"
      description="No results match your current filters. Try adjusting or clearing your filters to see more items."
      action={{
        label: "Clear Filters",
        onClick: onClearFilters,
        variant: "outline"
      }}
      size="sm"
    />
  )
}

export function LoadingEmptyState({ 
  title = "Loading...", 
  description = "Please wait while we fetch your data." 
}: { 
  title?: string
  description?: string
}) {
  return (
    <motion.div
      className="text-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mx-auto h-12 w-12 mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-full w-full text-purple-500" />
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </motion.div>
  )
}