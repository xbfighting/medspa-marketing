'use client'

import { useState } from 'react'
import { PerformanceOverview } from '@/components/analytics/performance-overview'
import { CustomerAnalytics } from '@/components/analytics/customer-analytics'
import { CampaignAnalytics } from '@/components/analytics/campaign-analytics'
import { RevenueTrends } from '@/components/analytics/revenue-trends'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('last30days')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Track performance, understand your customers, and optimize your marketing efforts
        </p>
      </div>

      <div className="space-y-8">
        {/* Performance Overview */}
        <PerformanceOverview 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Analytics Tabs */}
        <Tabs defaultValue="customers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
            <TabsTrigger value="campaigns">Campaign Analytics</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="customers" className="space-y-6">
            <CustomerAnalytics />
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-6">
            <CampaignAnalytics />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueTrends />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}