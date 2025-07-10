import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Campaign } from '@/lib/types'
import { 
  Mail, 
  MessageSquare, 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign,
  Target,
  Eye,
  MousePointer,
  ShoppingCart,
  Play,
  Pause,
  Copy,
  BarChart3
} from 'lucide-react'
import { format } from 'date-fns'

interface CampaignDetailProps {
  campaign: Campaign
}

export function CampaignDetail({ campaign }: CampaignDetailProps) {
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
        return <Mail className="h-5 w-5" />
      case 'SMS':
        return <MessageSquare className="h-5 w-5" />
      default:
        return <Mail className="h-5 w-5" />
    }
  }

  const getMetrics = () => {
    return campaign.metrics || campaign.performance || {
      sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0
    }
  }

  const calculateRates = () => {
    const metrics = getMetrics()
    const openRate = metrics.sent > 0 ? (metrics.opened / metrics.sent) * 100 : 0
    const clickRate = metrics.opened > 0 ? (metrics.clicked / metrics.opened) * 100 : 0
    const conversionRate = metrics.sent > 0 ? (metrics.converted / metrics.sent) * 100 : 0
    
    return { openRate, clickRate, conversionRate }
  }

  const { openRate, clickRate, conversionRate } = calculateRates()

  // Mock performance over time data
  const performanceData = [
    { day: 'Day 1', opened: 2340, clicked: 287, converted: 42 },
    { day: 'Day 2', opened: 1890, clicked: 234, converted: 31 },
    { day: 'Day 3', opened: 1245, clicked: 156, converted: 18 },
    { day: 'Day 7', opened: 678, clicked: 89, converted: 12 },
  ]

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-primary-50 rounded-lg">
                {getTypeIcon(campaign.type)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {campaign.name}
                </h1>
                <p className="text-gray-600 mb-3">
                  {campaign.subject}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant="outline" 
                    className={getStatusBadgeColor(campaign.status)}
                  >
                    {campaign.status}
                  </Badge>
                  <Badge variant="outline">
                    {campaign.type}
                  </Badge>
                  {campaign.template && (
                    <Badge variant="secondary">
                      {campaign.template}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {campaign.status === 'Active' && (
                <Button size="sm" variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              {campaign.status === 'Scheduled' && (
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Send Now
                </Button>
              )}
              <Button size="sm" variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button size="sm" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Campaign Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Created</span>
              <span className="text-sm font-medium">
                {format(new Date(campaign.createdDate || campaign.createdAt), 'MMM dd, yyyy')}
              </span>
            </div>
            {(campaign.scheduledDate || campaign.schedule?.sendAt) && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Scheduled</span>
                <span className="text-sm font-medium">
                  {format(new Date(campaign.scheduledDate || campaign.schedule.sendAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            )}
            {campaign.createdBy && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created by</span>
                <span className="text-sm font-medium">{campaign.createdBy}</span>
              </div>
            )}
            {campaign.schedule?.timezone && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Timezone</span>
                <span className="text-sm font-medium">{campaign.schedule.timezone}</span>
              </div>
            )}
            {campaign.personalization?.enabled && (
              <div className="pt-3 border-t">
                <div className="text-sm font-medium text-gray-900 mb-2">Personalization</div>
                <div className="flex flex-wrap gap-1">
                  {campaign.personalization.fields?.map((field, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {field}
                    </Badge>
                  ))}
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
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Sent</span>
                </div>
                <span className="font-bold text-lg">
                  {getMetrics().sent.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">Opened</span>
                  </div>
                  <span className="font-bold text-lg">
                    {getMetrics().opened.toLocaleString()} ({openRate.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={openRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Clicked</span>
                  </div>
                  <span className="font-bold text-lg">
                    {getMetrics().clicked.toLocaleString()} ({clickRate.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={clickRate} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">Converted</span>
                  </div>
                  <span className="font-bold text-lg">
                    {getMetrics().converted.toLocaleString()} ({conversionRate.toFixed(1)}%)
                  </span>
                </div>
                <Progress value={conversionRate} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <span className="font-bold text-lg text-green-600">
                  ${getMetrics().revenue.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-gray-900 mb-2">Segments</h4>
              {campaign.targetAudience?.segments && campaign.targetAudience.segments.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {campaign.targetAudience.segments.map((segment, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {segment}
                    </Badge>
                  ))}
                </div>
              ) : campaign.targetSegment?.lifecycleStages && campaign.targetSegment.lifecycleStages.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {campaign.targetSegment.lifecycleStages.map((stage, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {stage}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No segments specified</p>
              )}
            </div>

            {campaign.targetAudience?.criteria && (
              <div className="pt-3 border-t">
                <h4 className="font-medium text-sm text-gray-900 mb-2">Criteria</h4>
                <div className="space-y-2 text-sm">
                  {campaign.targetAudience.criteria.lifecycleStage && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lifecycle Stage</span>
                      <span>{campaign.targetAudience.criteria.lifecycleStage.join(', ')}</span>
                    </div>
                  )}
                  {campaign.targetAudience.criteria.loyaltyTier && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loyalty Tier</span>
                      <span>{campaign.targetAudience.criteria.loyaltyTier.join(', ')}</span>
                    </div>
                  )}
                  {campaign.targetAudience.criteria.totalSpentMin && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min. Spend</span>
                      <span>${campaign.targetAudience.criteria.totalSpentMin}</span>
                    </div>
                  )}
                  {campaign.targetAudience.criteria.lastInteractionDays && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Interaction</span>
                      <span>Within {campaign.targetAudience.criteria.lastInteractionDays} days</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Content Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Content Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 mb-4">
              <div className="text-sm text-gray-600">Subject Line:</div>
              <div className="font-medium">{campaign.subject}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Content:</div>
              {campaign.type === 'Email' ? (
                <div className="prose prose-sm max-w-none" 
                     dangerouslySetInnerHTML={{ __html: campaign.content || '<p>Content preview not available</p>' }} />
              ) : (
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {campaign.content || 'Content preview not available'}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{data.day}</div>
                <div className="flex space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-green-600">{data.opened}</div>
                    <div className="text-gray-500">Opens</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-purple-600">{data.clicked}</div>
                    <div className="text-gray-500">Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">{data.converted}</div>
                    <div className="text-gray-500">Conversions</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}