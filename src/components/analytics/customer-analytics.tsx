'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = {
  'New': '#3b82f6',
  'Active': '#10b981',
  'At-Risk': '#f59e0b',
  'Dormant': '#6b7280',
  'Bronze': '#cd7f32',
  'Silver': '#c0c0c0',
  'Gold': '#ffd700',
  'Platinum': '#9333ea'
}

export function CustomerAnalytics() {
  // Customer lifecycle distribution
  const lifecycleData = [
    { name: 'New', value: 234, percentage: 19 },
    { name: 'Active', value: 567, percentage: 46 },
    { name: 'At-Risk', value: 234, percentage: 19 },
    { name: 'Dormant', value: 199, percentage: 16 }
  ]

  // Customer value by loyalty tier
  const loyaltyData = [
    { tier: 'Bronze', customers: 450, avgValue: 1200 },
    { tier: 'Silver', customers: 380, avgValue: 2500 },
    { tier: 'Gold', customers: 280, avgValue: 4800 },
    { tier: 'Platinum', customers: 124, avgValue: 8500 }
  ]

  // Treatment preferences
  const treatmentData = [
    { treatment: 'Botox', count: 890 },
    { treatment: 'Fillers', count: 650 },
    { treatment: 'Laser', count: 420 },
    { treatment: 'Facials', count: 780 },
    { treatment: 'Peels', count: 340 }
  ]

  // Customer acquisition trend
  const acquisitionData = [
    { month: 'Jan', new: 45, returning: 120 },
    { month: 'Feb', new: 52, returning: 135 },
    { month: 'Mar', new: 61, returning: 142 },
    { month: 'Apr', new: 58, returning: 156 },
    { month: 'May', new: 72, returning: 168 },
    { month: 'Jun', new: 68, returning: 175 }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Customer Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lifecycle Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifecycle Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={lifecycleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                  >
                    {lifecycleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {lifecycleData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Tier Value */}
        <Card>
          <CardHeader>
            <CardTitle>Average Customer Value by Loyalty Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loyaltyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="tier" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="avgValue" fill="#9333ea" radius={[8, 8, 0, 0]}>
                    {loyaltyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.tier as keyof typeof COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Treatments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={treatmentData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis type="number" />
                  <YAxis dataKey="treatment" type="category" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#9333ea" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={acquisitionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="new" stackId="a" fill="#3b82f6" name="New Customers" />
                  <Bar dataKey="returning" stackId="a" fill="#10b981" name="Returning Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}