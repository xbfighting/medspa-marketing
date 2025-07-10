import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Customer } from '@/lib/types'
import { 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star,
  MessageSquare,
  Gift,
  TrendingUp,
  User
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface CustomerDetailProps {
  customer: Customer
}

export function CustomerDetail({ customer }: CustomerDetailProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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

  // Mock data for demonstrations
  const mockPurchaseHistory = [
    {
      id: '1',
      date: '2024-06-15',
      service: 'Botox Treatment',
      amount: 650,
      status: 'Completed'
    },
    {
      id: '2',
      date: '2024-05-20',
      service: 'Facial Consultation',
      amount: 150,
      status: 'Completed'
    },
    {
      id: '3',
      date: '2024-04-10',
      service: 'Chemical Peel',
      amount: 300,
      status: 'Completed'
    }
  ]

  const mockInteractions = [
    {
      id: '1',
      type: 'email',
      title: 'Summer Promotion Campaign',
      date: '2024-06-20',
      status: 'opened'
    },
    {
      id: '2',
      type: 'call',
      title: 'Follow-up call after treatment',
      date: '2024-06-16',
      status: 'completed'
    },
    {
      id: '3',
      type: 'appointment',
      title: 'Botox consultation',
      date: '2024-06-14',
      status: 'attended'
    }
  ]

  const recommendedActions = [
    'Send birthday discount offer',
    'Schedule follow-up appointment',
    'Recommend Hydrafacial treatment',
    'Invite to VIP member event'
  ]

  return (
    <div className="space-y-6">
      {/* Customer Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {customer.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
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
                    {customer.loyaltyTier} Member
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{customer.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Joined {customer.registrationDate || customer.joinDate ? format(new Date(customer.registrationDate || customer.joinDate), 'MMM dd, yyyy') : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Last interaction: {customer.lastInteraction 
                  ? formatDistanceToNow(new Date(customer.lastInteraction), { addSuffix: true })
                  : 'Never'
                }
              </span>
            </div>
            {customer.preferences && (
              <div className="pt-3 border-t">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Preferences</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Communication: {customer.preferences.communication}</div>
                  <div>Frequency: {customer.preferences.frequency}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Customer Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Total Spent</span>
              </div>
              <span className="font-bold text-lg">
                ${customer.customerValue?.toLocaleString() || customer.totalSpent?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Visit Count</span>
              </div>
              <span className="font-bold text-lg">
                {customer.visitCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Avg. Spend</span>
              </div>
              <span className="font-bold text-lg">
                ${customer.visitCount ? Math.round((customer.customerValue || customer.totalSpent || 0) / customer.visitCount) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Loyalty Points</span>
              </div>
              <span className="font-bold text-lg">
                {Math.round((customer.customerValue || customer.totalSpent || 0) * 0.1)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recommendedActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-2"
                >
                  {action}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPurchaseHistory.map((purchase) => (
              <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{purchase.service}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(purchase.date), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold">${purchase.amount}</div>
                  <Badge variant="secondary" className="text-xs">
                    {purchase.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interaction Log */}
      <Card>
        <CardHeader>
          <CardTitle>Interaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockInteractions.map((interaction) => (
              <div key={interaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">{interaction.title}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(interaction.date), 'MMM dd, yyyy')} • {interaction.type}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {interaction.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {customer.tags && customer.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{customer.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}