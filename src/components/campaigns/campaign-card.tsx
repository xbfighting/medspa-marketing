import { Badge } from '@/components/ui/badge'
import { InteractiveCard } from '@/components/ui/interactive-card'
import { Campaign } from '@/lib/types'
import { Mail, MessageSquare, Calendar, Users, TrendingUp, DollarSign, Sparkles } from 'lucide-react'
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

  const getMetrics = () => {
    return campaign.metrics || campaign.performance || {
      sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0
    }
  }

  const calculateOpenRate = () => {
    const metrics = getMetrics()
    if (metrics.sent === 0) return 0
    return ((metrics.opened / metrics.sent) * 100).toFixed(1)
  }

  const calculateClickRate = () => {
    const metrics = getMetrics()
    if (metrics.opened === 0) return 0
    return ((metrics.clicked / metrics.opened) * 100).toFixed(1)
  }

  const calculateConversionRate = () => {
    const metrics = getMetrics()
    if (metrics.sent === 0) return 0
    return ((metrics.converted / metrics.sent) * 100).toFixed(1)
  }

  return (
    <InteractiveCard 
      clickable 
      href={`/campaigns/${campaign.id}`}
      className="p-0"
    >
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              {getTypeIcon(campaign.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                {campaign.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {campaign.subject}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {campaign.createdWithAI && (
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="h-3 w-3" />
                AI Created
              </Badge>
            )}
            <Badge 
              variant="outline" 
              className={getStatusBadgeColor(campaign.status)}
            >
              {campaign.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
          {/* Campaign Info */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {campaign.scheduledDate || campaign.schedule?.sendAt 
                  ? format(new Date(campaign.scheduledDate || campaign.schedule.sendAt), 'MMM dd, yyyy')
                  : format(new Date(campaign.createdDate || campaign.createdAt), 'MMM dd, yyyy')
                }
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{getMetrics().sent.toLocaleString()} sent</span>
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
                <span>{getMetrics().clicked.toLocaleString()} clicks</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <DollarSign className="h-4 w-4" />
                <span>${getMetrics().revenue.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {campaign.createdDate || campaign.createdAt 
                ? formatDistanceToNow(new Date(campaign.createdDate || campaign.createdAt), { addSuffix: true })
                : ''
              }
            </div>
          </div>

          {/* Target Audience */}
          {((campaign.targetAudience?.segments && campaign.targetAudience.segments.length > 0) || 
            (campaign.targetSegment?.lifecycleStages && campaign.targetSegment.lifecycleStages.length > 0)) && (
            <div className="flex flex-wrap gap-1 pt-2 border-t border-gray-100">
              {campaign.targetAudience?.segments ? (
                <>
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
                </>
              ) : (
                campaign.targetSegment?.lifecycleStages?.slice(0, 2).map((stage, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {stage}
                  </Badge>
                ))
              )}
            </div>
          )}
        </div>
    </InteractiveCard>
  )
}