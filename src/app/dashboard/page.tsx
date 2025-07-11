'use client'

import { useEffect, useState } from 'react'
import { Send, Mail, TrendingUp, DollarSign } from 'lucide-react'
import { KPICard } from '@/components/dashboard/kpi-card'
import { CampaignChart } from '@/components/dashboard/campaign-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { fetchCampaigns } from '@/lib/api'
import { Campaign } from '@/lib/types'

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const campaignsData = await fetchCampaigns()
        setCampaigns(campaignsData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate Campaign KPIs
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length
  const completedCampaigns = campaigns.filter(c => c.status === 'Completed').length

  const avgOpenRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => {
        const metrics = c.metrics || c.performance
        if (!metrics || metrics.sent === 0) return sum
        return sum + (metrics.opened / metrics.sent) * 100
      }, 0) / campaigns.length
    : 0

  const avgConversionRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => {
        const metrics = c.metrics || c.performance
        if (!metrics || metrics.sent === 0) return sum
        return sum + (metrics.converted / metrics.sent) * 100
      }, 0) / campaigns.length
    : 0

  const totalRevenue = campaigns.reduce((sum, c) => {
    const metrics = c.metrics || c.performance
    return sum + (metrics?.revenue || 0)
  }, 0)


  // Mock campaign performance data
  const campaignPerformanceData = [
    { month: 'Jan', openRate: 22.5, clickRate: 4.2, conversionRate: 1.8 },
    { month: 'Feb', openRate: 24.1, clickRate: 4.8, conversionRate: 2.1 },
    { month: 'Mar', openRate: 26.3, clickRate: 5.1, conversionRate: 2.3 },
    { month: 'Apr', openRate: 25.8, clickRate: 4.9, conversionRate: 2.2 },
    { month: 'May', openRate: 28.2, clickRate: 5.5, conversionRate: 2.6 },
    { month: 'Jun', openRate: 27.9, clickRate: 5.3, conversionRate: 2.4 }
  ]

  // Campaign-focused recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'campaign_sent' as const,
      title: 'Summer Promotion Campaign Sent',
      description: 'Campaign sent to 1,234 customers',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      entityId: 'camp-1',
      entityType: 'campaign' as const
    },
    {
      id: '2',
      type: 'campaign_sent' as const,
      title: 'Flash Friday Sale Launched',
      description: 'Time-sensitive offer sent to 892 VIP customers',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      entityId: 'camp-2',
      entityType: 'campaign' as const
    },
    {
      id: '3',
      type: 'system_event' as const,
      title: 'AI Strategy Template Added',
      description: 'New winning campaign saved as reusable template',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      entityId: 'temp-1',
      entityType: 'campaign' as const
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dashboard
      </h1>

      {/* Campaign KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Campaigns"
          value={totalCampaigns}
          change={18.2}
          trend="up"
          icon={Send}
        />
        <KPICard
          title="Active Campaigns"
          value={activeCampaigns}
          change={8.2}
          trend="up"
          icon={Mail}
        />
        <KPICard
          title="Avg Open Rate"
          value={`${avgOpenRate.toFixed(1)}%`}
          change={3.1}
          trend="up"
          icon={TrendingUp}
        />
        <KPICard
          title="Campaign Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={15.3}
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Campaign Performance Chart */}
      <div className="mb-8">
        <CampaignChart data={campaignPerformanceData} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={recentActivities} />
    </div>
  )
}