'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CampaignDetail } from '@/components/campaigns/campaign-detail'
import { Button } from '@/components/ui/button'
import { fetchCampaign } from '@/lib/api'
import { Campaign } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCampaign() {
      try {
        const data = await fetchCampaign(params.id as string)
        setCampaign(data)
      } catch (error) {
        console.error('Failed to load campaign:', error)
        setError('Failed to load campaign details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadCampaign()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading campaign details...</div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          {error || 'Campaign not found'}
        </div>
        <Button variant="outline" onClick={() => router.push('/campaigns')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/campaigns')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
      </div>

      {/* Campaign Details */}
      <CampaignDetail campaign={campaign} />
    </div>
  )
}