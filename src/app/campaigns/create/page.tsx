'use client'

import { useEffect, useState } from 'react'
import { CreateWizard } from '@/components/campaigns/create-wizard'
import { fetchCustomers } from '@/lib/api'
import { Customer } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CreateCampaignPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await fetchCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/campaigns')}
          className="flex items-center mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campaigns
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">
          Create New Campaign
        </h1>
        <p className="text-gray-600 mt-2">
          Use AI to generate personalized marketing campaigns for your customers
        </p>
      </div>

      {/* Wizard */}
      <CreateWizard customers={customers} />
    </div>
  )
}