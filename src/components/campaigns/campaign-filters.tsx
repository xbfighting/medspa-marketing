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

interface CampaignFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedStatus: string
  onStatusChange: (status: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
  onClearFilters: () => void
  totalResults: number
}

export function CampaignFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange,
  onClearFilters,
  totalResults
}: CampaignFiltersProps) {
  const hasActiveFilters = selectedStatus !== 'all' || selectedType !== 'all' || searchTerm.length > 0

  return (
    <div className="bg-white p-6 rounded-lg border shadow-sm mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search campaigns by name or subject..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="SMS">SMS</SelectItem>
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
          {totalResults} campaign{totalResults !== 1 ? 's' : ''} found
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
          {selectedStatus !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Status: {selectedStatus}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onStatusChange('all')}
              />
            </Badge>
          )}
          {selectedType !== 'all' && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Type: {selectedType}</span>
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={() => onTypeChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}