import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Mail, User, TrendingUp, Calendar } from 'lucide-react'

interface Activity {
  id: string
  type: 'customer_interaction' | 'campaign_sent' | 'system_event'
  title: string
  description: string
  timestamp: string
  entityId: string
  entityType: 'customer' | 'campaign'
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'customer_interaction':
        return <User className="h-4 w-4 text-blue-500" />
      case 'campaign_sent':
        return <Mail className="h-4 w-4 text-green-500" />
      case 'system_event':
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'customer_interaction':
        return <Badge variant="secondary" className="bg-blue-50 text-blue-700">Customer</Badge>
      case 'campaign_sent':
        return <Badge variant="secondary" className="bg-green-50 text-green-700">Campaign</Badge>
      case 'system_event':
        return <Badge variant="secondary" className="bg-purple-50 text-purple-700">System</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </h4>
                    {getActivityBadge(activity.type)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}