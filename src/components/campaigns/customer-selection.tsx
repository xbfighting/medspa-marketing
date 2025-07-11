'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Users, Filter, Search, DollarSign, Calendar, Award } from 'lucide-react'
import customersData from '@/data/customers.json'

interface FilterOptions {
  lifecycle: string[]
  loyaltyTier: string[]
  valueRange: string
  lastVisit: string
  searchTerm: string
}

interface CustomerSelectionProps {
  preSelectedFilters?: Partial<FilterOptions>
  onSelectionChange?: (customerIds: string[]) => void
}

export function CustomerSelection({ 
  preSelectedFilters = {},
  onSelectionChange 
}: CustomerSelectionProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    lifecycle: preSelectedFilters.lifecycle || [],
    loyaltyTier: preSelectedFilters.loyaltyTier || [],
    valueRange: preSelectedFilters.valueRange || 'all',
    lastVisit: preSelectedFilters.lastVisit || 'all',
    searchTerm: preSelectedFilters.searchTerm || ''
  })
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Filter customers based on all criteria
  const filteredCustomers = (customersData as any[]).filter((customer: any) => {
    // Lifecycle filter
    if (filters.lifecycle.length > 0 && !filters.lifecycle.includes(customer.lifecycleStage)) {
      return false
    }

    // Loyalty tier filter
    if (filters.loyaltyTier.length > 0 && !filters.loyaltyTier.includes(customer.loyaltyTier)) {
      return false
    }

    // Value range filter
    if (filters.valueRange !== 'all') {
      const value = customer.customerValue
      switch (filters.valueRange) {
        case 'high':
          if (value < 5000) return false
          break
        case 'medium':
          if (value < 1000 || value >= 5000) return false
          break
        case 'low':
          if (value >= 1000) return false
          break
      }
    }

    // Last visit filter
    if (filters.lastVisit !== 'all') {
      const lastVisitDate = new Date(customer.lastInteraction)
      const daysSince = Math.floor((Date.now() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24))
      
      switch (filters.lastVisit) {
        case '30':
          if (daysSince > 30) return false
          break
        case '60':
          if (daysSince > 60) return false
          break
        case '90':
          if (daysSince > 90) return false
          break
        case '90+':
          if (daysSince <= 90) return false
          break
      }
    }

    // Search filter
    if (filters.searchTerm) {
      const search = filters.searchTerm.toLowerCase()
      if (!customer.name.toLowerCase().includes(search) && 
          !customer.email.toLowerCase().includes(search)) {
        return false
      }
    }

    return true
  })

  // Auto-select filtered customers when filters change (if selectAll is true)
  useEffect(() => {
    if (selectAll) {
      const newSelection = filteredCustomers.map(c => c.id)
      setSelectedCustomers(newSelection)
      onSelectionChange?.(newSelection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, selectAll])

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange?.(selectedCustomers)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomers])

  const toggleLifecycleFilter = (stage: string) => {
    setFilters(prev => ({
      ...prev,
      lifecycle: prev.lifecycle.includes(stage)
        ? prev.lifecycle.filter(s => s !== stage)
        : [...prev.lifecycle, stage]
    }))
  }

  const toggleLoyaltyFilter = (tier: string) => {
    setFilters(prev => ({
      ...prev,
      loyaltyTier: prev.loyaltyTier.includes(tier)
        ? prev.loyaltyTier.filter(t => t !== tier)
        : [...prev.loyaltyTier, tier]
    }))
  }

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([])
      setSelectAll(false)
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
      setSelectAll(true)
    }
  }

  const toggleCustomer = (customerId: string, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, customerId])
    } else {
      setSelectedCustomers(selectedCustomers.filter(id => id !== customerId))
      setSelectAll(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Smart Filters
          </CardTitle>
          <CardDescription>
            {filteredCustomers.length} customers match your criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search Customers</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                id="search"
                placeholder="Search by name or email..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Lifecycle Stage */}
          <div>
            <Label>Lifecycle Stage</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['New', 'Active', 'At-Risk', 'Dormant'].map((stage) => (
                <Badge
                  key={stage}
                  variant={filters.lifecycle.includes(stage) ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleLifecycleFilter(stage)}
                >
                  {stage}
                </Badge>
              ))}
            </div>
          </div>

          {/* Loyalty Tier */}
          <div>
            <Label>Loyalty Tier</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {['Bronze', 'Silver', 'Gold', 'Platinum'].map((tier) => (
                <Badge
                  key={tier}
                  variant={filters.loyaltyTier.includes(tier) ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleLoyaltyFilter(tier)}
                >
                  <Award className="h-3 w-3 mr-1" />
                  {tier}
                </Badge>
              ))}
            </div>
          </div>

          {/* Value Range and Last Visit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value-range">Customer Value</Label>
              <Select
                value={filters.valueRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, valueRange: value }))}
              >
                <SelectTrigger id="value-range" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Values</SelectItem>
                  <SelectItem value="high">High ($5,000+)</SelectItem>
                  <SelectItem value="medium">Medium ($1,000-$4,999)</SelectItem>
                  <SelectItem value="low">Low (&lt; $1,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="last-visit">Last Visit</Label>
              <Select
                value={filters.lastVisit}
                onValueChange={(value) => setFilters(prev => ({ ...prev, lastVisit: value }))}
              >
                <SelectTrigger id="last-visit" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Time</SelectItem>
                  <SelectItem value="30">Within 30 days</SelectItem>
                  <SelectItem value="60">Within 60 days</SelectItem>
                  <SelectItem value="90">Within 90 days</SelectItem>
                  <SelectItem value="90+">Over 90 days ago</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilters({
                  lifecycle: [],
                  loyaltyTier: [],
                  valueRange: 'all',
                  lastVisit: 'all',
                  searchTerm: ''
                })
                setSelectAll(false)
              }}
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Target Customers
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm font-normal text-gray-600">
                  {selectedCustomers.length} of {filteredCustomers.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedCustomers.length === filteredCustomers.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No customers match your filters. Try adjusting the criteria.
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <label
                  key={customer.id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedCustomers.includes(customer.id)}
                    onCheckedChange={(checked) => toggleCustomer(customer.id, !!checked)}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge variant="outline" className="mb-1">
                        {customer.lifecycleStage}
                      </Badge>
                      <p className="text-xs text-gray-600">
                        {customer.loyaltyTier} • ${customer.customerValue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(customer.lastInteraction).toLocaleDateString()}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {selectedCustomers.length > 0 && (
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            <strong>Campaign reach:</strong> {selectedCustomers.length} customers selected
          </p>
        </div>
      )}
    </div>
  )
}