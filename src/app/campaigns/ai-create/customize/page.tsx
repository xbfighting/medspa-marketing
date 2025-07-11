'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Users, Filter, ChevronRight } from 'lucide-react'
import customersData from '@/data/customers.json'

export default function CustomizePage() {
  const router = useRouter()
  const [selectedFilters, setSelectedFilters] = useState({
    lifecycle: ['At-Risk', 'Dormant'],
    value: 'all'
  })
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  // Filter customers based on strategy
  const filteredCustomers = customersData.filter(customer => {
    if (selectedFilters.lifecycle.length > 0) {
      return selectedFilters.lifecycle.includes(customer.lifecycleStage)
    }
    return true
  }).slice(0, 20) // Limit for demo

  useEffect(() => {
    // Auto-select all filtered customers initially
    setSelectedCustomers(filteredCustomers.map(c => c.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProceed = () => {
    sessionStorage.setItem('selected_customers', JSON.stringify(selectedCustomers))
    router.push('/campaigns/ai-create/generate')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Select Target Customers</h1>
        <p className="text-gray-600 mt-2">
          Based on your strategy, we recommend targeting these customer segments
        </p>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recommended Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['At-Risk', 'Dormant', 'High-Value', 'Recent Visit'].map((segment) => (
              <Badge
                key={segment}
                variant={selectedFilters.lifecycle.includes(segment) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => {
                  // Toggle filter logic
                }}
              >
                {segment}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex justify-between items-center">
              <span>Target Customers</span>
              <span className="text-sm font-normal text-gray-600">
                {selectedCustomers.length} selected
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <label
                key={customer.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCustomers([...selectedCustomers, customer.id])
                    } else {
                      setSelectedCustomers(selectedCustomers.filter(id => id !== customer.id))
                    }
                  }}
                />
                <div className="flex-1">
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{customer.lifecycleStage}</Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    Value: ${customer.customerValue}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
        <Button
          onClick={handleProceed}
          disabled={selectedCustomers.length === 0}
        >
          Continue with {selectedCustomers.length} Customers
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}