'use client'

import { useEffect, useState } from 'react'
import { Users, Mail, TrendingUp, DollarSign } from 'lucide-react'
import { KPICard } from '@/components/dashboard/kpi-card'
import { LifecycleChart } from '@/components/dashboard/lifecycle-chart'
import { CampaignChart } from '@/components/dashboard/campaign-chart'
import { ActivityFeed } from '@/components/dashboard/activity-feed'
import { fetchCustomers, fetchCampaigns } from '@/lib/api'
import { Customer, Campaign } from '@/lib/types'

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [customersData, campaignsData] = await Promise.all([
          fetchCustomers(),
          fetchCampaigns()
        ])
        setCustomers(customersData)
        setCampaigns(campaignsData)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate KPIs
  const totalCustomers = customers.length
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length

  const avgOpenRate = campaigns.length > 0
    ? campaigns.reduce((sum, c) => {
        const metrics = c.metrics || c.performance
        if (!metrics) return sum
        return sum + (metrics.opened / metrics.sent) * 100
      }, 0) / campaigns.length
    : 0
  const totalRevenue = campaigns.reduce((sum, c) => {
    const metrics = c.metrics || c.performance
    return sum + (metrics?.revenue || 0)
  }, 0)

  // Lifecycle distribution data
  const lifecycleData = [
    {
      name: 'New',
      value: customers.filter(c => c.lifecycleStage === 'New').length,
      color: '#9333ea'
    },
    {
      name: 'Active',
      value: customers.filter(c => c.lifecycleStage === 'Active').length,
      color: '#059669'
    },
    {
      name: 'At-Risk',
      value: customers.filter(c => c.lifecycleStage === 'At-Risk').length,
      color: '#dc2626'
    },
    {
      name: 'Dormant',
      value: customers.filter(c => c.lifecycleStage === 'Dormant').length,
      color: '#6b7280'
    }
  ]

  // Mock campaign performance data
  const campaignPerformanceData = [
    { month: 'Jan', openRate: 22.5, clickRate: 4.2, conversionRate: 1.8 },
    { month: 'Feb', openRate: 24.1, clickRate: 4.8, conversionRate: 2.1 },
    { month: 'Mar', openRate: 26.3, clickRate: 5.1, conversionRate: 2.3 },
    { month: 'Apr', openRate: 25.8, clickRate: 4.9, conversionRate: 2.2 },
    { month: 'May', openRate: 28.2, clickRate: 5.5, conversionRate: 2.6 },
    { month: 'Jun', openRate: 27.9, clickRate: 5.3, conversionRate: 2.4 }
  ]

  // Mock recent activities
  const recentActivities = [
    {
      id: '1',
      type: 'campaign_sent' as const,
      title: 'Summer Promotion Campaign Sent',
      description: 'Campaign sent to 1,234 customers',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      entityId: 'camp-1',
      entityType: 'campaign' as const
    },
    {
      id: '2',
      type: 'customer_interaction' as const,
      title: 'New Customer Registration',
      description: 'Sarah Johnson registered for skincare consultation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      entityId: 'cust-1',
      entityType: 'customer' as const
    },
    {
      id: '3',
      type: 'system_event' as const,
      title: 'Weekly Analytics Report Generated',
      description: 'Performance metrics updated for all active campaigns',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      entityId: 'sys-1',
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Customers"
          value={totalCustomers.toLocaleString()}
          change={12.5}
          trend="up"
          icon={Users}
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
          title="Monthly Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          change={15.3}
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LifecycleChart data={lifecycleData} />
        <CampaignChart data={campaignPerformanceData} />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={recentActivities} />
    </div>
  )
}
