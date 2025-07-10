import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Customer } from '@/lib/types'
import { Phone, Mail, Calendar, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface CustomerCardProps {
  customer: Customer
}

export function CustomerCard({ customer }: CustomerCardProps) {
  const getLifecycleBadgeColor = (stage: string) => {
    switch (stage) {
      case 'New':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'At-Risk':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Dormant':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getLoyaltyBadgeColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Gold':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'Silver':
        return 'bg-gray-50 text-gray-600 border-gray-200'
      case 'Bronze':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Link href={`/customers/${customer.id}`}>
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardContent className="p-6">
          {/* Header with Avatar and Basic Info */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="bg-primary-100 text-primary-700">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {customer.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge 
                    variant="outline" 
                    className={getLifecycleBadgeColor(customer.lifecycleStage)}
                  >
                    {customer.lifecycleStage}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={getLoyaltyBadgeColor(customer.loyaltyTier)}
                  >
                    {customer.loyaltyTier}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              {customer.email}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              {customer.phone}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-500 mb-1">
                <DollarSign className="h-4 w-4 mr-1" />
                Total Value
              </div>
              <div className="font-semibold text-gray-900">
                ${customer.customerValue?.toLocaleString() || customer.totalSpent?.toLocaleString() || '0'}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-sm text-gray-500 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                Last Visit
              </div>
              <div className="font-semibold text-gray-900">
                {customer.lastInteraction 
                  ? formatDistanceToNow(new Date(customer.lastInteraction), { addSuffix: true })
                  : 'Never'
                }
              </div>
            </div>
          </div>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {customer.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {customer.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{customer.tags.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}