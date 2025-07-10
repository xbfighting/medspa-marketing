'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TrendingUp, TrendingDown, Users, Mail, DollarSign, Target } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
  prefix?: string
}

function MetricCard({ title, value, change, icon, prefix = '' }: MetricCardProps) {
  const isPositive = change >= 0
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            <div className="flex items-center space-x-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PerformanceOverviewProps {
  dateRange: string
  onDateRangeChange: (range: string) => void
}

export function PerformanceOverview({ dateRange, onDateRangeChange }: PerformanceOverviewProps) {
  // In a real app, these would be calculated from actual data
  const metrics = {
    totalCustomers: { value: 1234, change: 12.5 },
    activeCampaigns: { value: 8, change: -20 },
    revenue: { value: 156780, change: 23.4 },
    conversionRate: { value: '3.4%', change: 8.2 }
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Performance Overview</h2>
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="last90days">Last 90 days</SelectItem>
            <SelectItem value="last12months">Last 12 months</SelectItem>
            <SelectItem value="custom">Custom range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Customers"
          value={metrics.totalCustomers.value}
          change={metrics.totalCustomers.change}
          icon={<Users className="h-6 w-6 text-primary-500" />}
        />
        <MetricCard
          title="Active Campaigns"
          value={metrics.activeCampaigns.value}
          change={metrics.activeCampaigns.change}
          icon={<Mail className="h-6 w-6 text-primary-500" />}
        />
        <MetricCard
          title="Total Revenue"
          value={metrics.revenue.value}
          change={metrics.revenue.change}
          icon={<DollarSign className="h-6 w-6 text-primary-500" />}
          prefix="$"
        />
        <MetricCard
          title="Conversion Rate"
          value={metrics.conversionRate.value}
          change={metrics.conversionRate.change}
          icon={<Target className="h-6 w-6 text-primary-500" />}
        />
      </div>
    </div>
  )
}