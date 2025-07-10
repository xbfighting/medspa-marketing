import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Campaign } from '@/lib/types'
import { Mail, MessageSquare, Calendar, Users, TrendingUp, DollarSign } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface CampaignCardProps {
  campaign: Campaign
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Completed':
        return 'bg-gray-50 text-gray-700 border-gray-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail className="h-4 w-4" />
      case 'SMS':
        return <MessageSquare className="h-4 w-4" />
      default:
        return <Mail className="h-4 w-4" />
    }
  }

  const calculateOpenRate = () => {
    if (campaign.metrics.sent === 0) return 0
    return ((campaign.metrics.opened / campaign.metrics.sent) * 100).toFixed(1)
  }

  const calculateClickRate = () => {
    if (campaign.metrics.opened === 0) return 0
    return ((campaign.metrics.clicked / campaign.metrics.opened) * 100).toFixed(1)
  }

  const calculateConversionRate = () => {
    if (campaign.metrics.sent === 0) return 0
    return ((campaign.metrics.converted / campaign.metrics.sent) * 100).toFixed(1)
  }

  return (
    <Link href={`/campaigns/${campaign.id}`}>
      <Card className="hover:shadow-md transition-all duration-200 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary-50 rounded-lg">
                {getTypeIcon(campaign.type)}
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {campaign.name}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {campaign.subject}
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={getStatusBadgeColor(campaign.status)}
            >
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Campaign Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {campaign.schedule?.sendAt 
                  ? format(new Date(campaign.schedule.sendAt), 'MMM dd, yyyy')
                  : format(new Date(campaign.createdAt), 'MMM dd, yyyy')
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{campaign.metrics.sent.toLocaleString()} sent</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-700">
                {calculateOpenRate()}%
              </div>
              <div className="text-xs text-blue-600">Open Rate</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {calculateClickRate()}%
              </div>
              <div className="text-xs text-green-600">Click Rate</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-700">
                {calculateConversionRate()}%
              </div>
              <div className="text-xs text-purple-600">Conversion</div>
            </div>
          </div>

          {/* Performance Indicators */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-gray-600">
                <TrendingUp className="h-4 w-4" />
                <span>{campaign.metrics.clicked.toLocaleString()} clicks</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>${campaign.metrics.revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {campaign.createdAt 
                ? formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })
                : ''
              }
            </div>
          </div>

          {/* Target Audience */}
          {campaign.targetAudience?.segments && campaign.targetAudience.segments.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
              {campaign.targetAudience.segments.slice(0, 2).map((segment, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {segment}
                </Badge>
              ))}
              {campaign.targetAudience.segments.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{campaign.targetAudience.segments.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}