'use client'

import { useEffect, useState } from 'react'
import { CampaignCard } from '@/components/campaigns/campaign-card'
import { CampaignFilters } from '@/components/campaigns/campaign-filters'
import { Button } from '@/components/ui/button'
import { fetchCampaigns } from '@/lib/api'
import { Campaign } from '@/lib/types'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const data = await fetchCampaigns()
        setCampaigns(data)
        setFilteredCampaigns(data)
      } catch (error) {
        console.error('Failed to load campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  useEffect(() => {
    let filtered = campaigns

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus)
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(campaign => campaign.type === selectedType)
    }

    setFilteredCampaigns(filtered)
  }, [campaigns, searchTerm, selectedStatus, selectedType])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedStatus('all')
    setSelectedType('all')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading campaigns...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Campaigns
        </h1>
        <Button onClick={() => router.push('/campaigns/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Filters */}
      <CampaignFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onClearFilters={handleClearFilters}
        totalResults={filteredCampaigns.length}
      />

      {/* Campaign Grid */}
      {filteredCampaigns.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No campaigns found</div>
          {(searchTerm || selectedStatus !== 'all' || selectedType !== 'all') && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  )
}