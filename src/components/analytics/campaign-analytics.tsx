'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Mail, MessageSquare, TrendingUp, MousePointer, ShoppingCart } from 'lucide-react'

export function CampaignAnalytics() {
  // Campaign performance over time
  const performanceData = [
    { month: 'Jan', email: 28.5, sms: 32.1 },
    { month: 'Feb', email: 31.2, sms: 35.8 },
    { month: 'Mar', email: 29.8, sms: 33.4 },
    { month: 'Apr', email: 32.5, sms: 36.2 },
    { month: 'May', email: 35.1, sms: 38.9 },
    { month: 'Jun', email: 33.7, sms: 37.5 }
  ]

  // Conversion funnel
  const funnelData = [
    { stage: 'Sent', value: 10000, rate: 100 },
    { stage: 'Delivered', value: 9800, rate: 98 },
    { stage: 'Opened', value: 3200, rate: 32 },
    { stage: 'Clicked', value: 640, rate: 6.4 },
    { stage: 'Converted', value: 192, rate: 1.9 }
  ]

  // Campaign ROI
  const roiData = [
    { campaign: 'New Year Promo', spent: 2500, revenue: 18500, roi: 640 },
    { campaign: 'Valentine Special', spent: 1800, revenue: 12400, roi: 589 },
    { campaign: 'Spring Refresh', spent: 3200, revenue: 22100, roi: 591 },
    { campaign: 'Summer Glow', spent: 2800, revenue: 19800, roi: 607 },
    { campaign: 'Fall Treatments', spent: 2100, revenue: 15200, roi: 624 }
  ]

  // Best performing campaigns
  const topCampaigns = [
    { name: 'Platinum VIP Exclusive', type: 'Email', openRate: 78.2, conversionRate: 12.4, revenue: 45600 },
    { name: 'Botox Reminder - March', type: 'SMS', openRate: 92.1, conversionRate: 18.6, revenue: 38900 },
    { name: 'Holiday Gift Cards', type: 'Email', openRate: 65.3, conversionRate: 8.9, revenue: 34200 },
    { name: 'New Customer Welcome', type: 'Email', openRate: 82.4, conversionRate: 15.2, revenue: 28700 }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
          <p className="font-medium mb-1">{label}</p>
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Campaign Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Open Rate Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Open Rate Trends by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="month" />
                  <YAxis label={{ value: 'Open Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="email" 
                    stroke="#9333ea" 
                    strokeWidth={2}
                    name="Email"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sms" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="SMS"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelData.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <span className="text-sm text-gray-600">{stage.value.toLocaleString()} ({stage.rate}%)</span>
                  </div>
                  <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                  {index < funnelData.length - 1 && (
                    <div className="flex justify-center my-2">
                      <div className="w-0.5 h-6 bg-gray-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Campaigns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Campaign</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-right py-3 px-4">Open Rate</th>
                    <th className="text-right py-3 px-4">Conversion</th>
                    <th className="text-right py-3 px-4">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topCampaigns.map((campaign, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{campaign.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="flex items-center w-fit">
                          {campaign.type === 'Email' ? <Mail className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                          {campaign.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <TrendingUp className="h-3 w-3 text-green-500" />
                          <span>{campaign.openRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <MousePointer className="h-3 w-3 text-blue-500" />
                          <span>{campaign.conversionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${campaign.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* ROI Analysis */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Campaign ROI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={roiData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="campaign" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                            <p className="font-medium mb-1">{label}</p>
                            <p className="text-sm text-gray-600">Spent: ${payload[0].payload.spent}</p>
                            <p className="text-sm text-green-600">Revenue: ${payload[0].payload.revenue}</p>
                            <p className="text-sm font-medium">ROI: {payload[0].payload.roi}%</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    fill="#10b98133"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}