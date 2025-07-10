'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X, Filter } from 'lucide-react'

interface CustomerFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedLifecycle: string
  onLifecycleChange: (lifecycle: string) => void
  selectedLoyalty: string
  onLoyaltyChange: (loyalty: string) => void
  onClearFilters: () => void
  totalResults: number
}

export function CustomerFilters({
  searchTerm,
  onSearchChange,
  selectedLifecycle,
  onLifecycleChange,
  selectedLoyalty,
  onLoyaltyChange,
  onClearFilters,
  totalResults
}: CustomerFiltersProps) {
  const hasActiveFilters = selectedLifecycle !== 'all' || selectedLoyalty !== 'all' || searchTerm.length > 0

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search customers by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Lifecycle Stage Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedLifecycle} onValueChange={onLifecycleChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Lifecycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="At-Risk">At-Risk</SelectItem>
                <SelectItem value="Dormant">Dormant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loyalty Tier Filter */}
          <Select value={selectedLoyalty} onValueChange={onLoyaltyChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Loyalty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="Bronze">Bronze</SelectItem>
              <SelectItem value="Silver">Silver</SelectItem>
              <SelectItem value="Gold">Gold</SelectItem>
              <SelectItem value="Platinum">Platinum</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center space-x-1"
            >
              <X className="h-3 w-3" />
              <span>Clear</span>
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500">
          {totalResults} customer{totalResults !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Search: "{searchTerm}"</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onSearchChange('')}
              />
            </Badge>
          )}
          {selectedLifecycle !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Stage: {selectedLifecycle}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onLifecycleChange('all')}
              />
            </Badge>
          )}
          {selectedLoyalty !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Tier: {selectedLoyalty}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onLoyaltyChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}