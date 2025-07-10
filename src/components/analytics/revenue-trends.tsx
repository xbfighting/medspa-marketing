'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { DollarSign, TrendingUp, Calendar, Users } from 'lucide-react'

export function RevenueTrends() {
  // Monthly revenue data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 125000, treatments: 320, avgTicket: 391 },
    { month: 'Feb', revenue: 138000, treatments: 345, avgTicket: 400 },
    { month: 'Mar', revenue: 142000, treatments: 358, avgTicket: 397 },
    { month: 'Apr', revenue: 156000, treatments: 380, avgTicket: 411 },
    { month: 'May', revenue: 168000, treatments: 402, avgTicket: 418 },
    { month: 'Jun', revenue: 175000, treatments: 415, avgTicket: 422 }
  ]

  // Revenue by treatment type
  const treatmentRevenue = [
    { treatment: 'Botox', revenue: 85000, percentage: 28 },
    { treatment: 'Fillers', revenue: 62000, percentage: 21 },
    { treatment: 'Laser', revenue: 48000, percentage: 16 },
    { treatment: 'Facials', revenue: 55000, percentage: 18 },
    { treatment: 'Body Contouring', revenue: 35000, percentage: 12 },
    { treatment: 'Other', revenue: 15000, percentage: 5 }
  ]

  // Customer lifetime value by tier
  const ltvData = [
    { tier: 'Bronze', ltv: 2400, avgVisits: 2.8 },
    { tier: 'Silver', ltv: 5800, avgVisits: 5.2 },
    { tier: 'Gold', ltv: 12500, avgVisits: 8.7 },
    { tier: 'Platinum', ltv: 28000, avgVisits: 15.3 }
  ]

  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Revenue Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue (6mo)</p>
                <p className="text-2xl font-bold">$924k</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +18.5% YoY
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Transaction</p>
                <p className="text-2xl font-bold">$406</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +7.8% vs last period
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue/Customer</p>
                <p className="text-2xl font-bold">$750</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.3% growth
                </p>
              </div>
              <Users className="h-8 w-8 text-primary-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Treatment</p>
                <p className="text-2xl font-bold">Botox</p>
                <p className="text-xs text-gray-600 mt-1">
                  28% of revenue
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs font-bold text-primary-700">#1</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#9333ea" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value: any) => `$${value.toLocaleString()}`}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#9333ea" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Treatment */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Treatment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {treatmentRevenue.map((item) => (
                <div key={item.treatment}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{item.treatment}</span>
                    <span className="text-sm text-gray-600">${(item.revenue / 1000).toFixed(0)}k ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-primary-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">$300k</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Lifetime Value */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value by Tier</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ltvData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                  <XAxis dataKey="tier" />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'ltv' ? `$${value.toLocaleString()}` : value,
                      name === 'ltv' ? 'Lifetime Value' : 'Avg Visits'
                    ]}
                  />
                  <Bar dataKey="ltv" fill="#9333ea" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}