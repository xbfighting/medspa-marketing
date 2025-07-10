'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CampaignPerformanceData {
  month: string
  openRate: number
  clickRate: number
  conversionRate: number
}

interface CampaignChartProps {
  data: CampaignPerformanceData[]
}

export function CampaignChart({ data }: CampaignChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Campaign Performance Trends
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
              <XAxis 
                dataKey="month" 
                className="text-sm"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-sm"
                tick={{ fontSize: 12 }}
                label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="openRate" 
                stroke="#9333ea" 
                strokeWidth={2}
                name="Open Rate"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="clickRate" 
                stroke="#059669" 
                strokeWidth={2}
                name="Click Rate"
                dot={{ r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversionRate" 
                stroke="#dc2626" 
                strokeWidth={2}
                name="Conversion Rate"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-500 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Open Rate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Click Rate</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2" />
            <span className="text-sm text-gray-600">Conversion Rate</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}