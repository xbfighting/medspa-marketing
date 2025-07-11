'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateCampaignPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear any previous session data
    sessionStorage.removeItem('selected_template')
    sessionStorage.removeItem('campaign_basics')
    sessionStorage.removeItem('selected_customers')
    sessionStorage.removeItem('generated_content')
    sessionStorage.removeItem('completed_steps')
    
    // Redirect to template selection
    router.push('/campaigns/create/templates')
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Redirecting...</div>
    </div>
  )
}