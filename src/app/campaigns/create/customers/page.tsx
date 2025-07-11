'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ProgressIndicator } from '@/components/campaigns/progress-indicator'
import { CustomerSelection } from '@/components/campaigns/customer-selection'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import templatesData from '@/data/strategy-templates.json'

export default function CustomersPage() {
  const router = useRouter()
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2])
  const [templateInfo, setTemplateInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get data from session
    const templateId = sessionStorage.getItem('selected_template')
    const campaignBasics = sessionStorage.getItem('campaign_basics')
    const savedSteps = JSON.parse(sessionStorage.getItem('completed_steps') || '[]')
    
    if (!templateId || !campaignBasics) {
      router.push('/campaigns/create/templates')
      return
    }

    // Find template for smart filters
    const template = templatesData.templates.find(t => t.id === templateId)
    if (template) {
      setTemplateInfo(template)
    }
    
    setCompletedSteps(savedSteps)
    setIsLoading(false)
  }, [router])

  const handleStepClick = (step: number) => {
    switch (step) {
      case 1:
        router.push('/campaigns/create/templates')
        break
      case 2:
        router.push('/campaigns/create/details')
        break
    }
  }

  const handleProceed = () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer')
      return
    }

    // Save to session
    sessionStorage.setItem('selected_customers', JSON.stringify(selectedCustomers))
    sessionStorage.setItem('completed_steps', JSON.stringify([...completedSteps, 3]))
    
    // Navigate to content generation
    router.push('/campaigns/create/generate')
  }

  // Determine pre-selected filters based on template
  const getPreSelectedFilters = () => {
    if (!templateInfo) return {}
    
    const filters: any = {}
    
    // Smart filter suggestions based on template
    if (templateInfo.targetAudience.includes('dormant') || templateInfo.targetAudience.includes('inactive')) {
      filters.lifecycle = ['Dormant', 'At-Risk']
    } else if (templateInfo.targetAudience.includes('VIP') || templateInfo.targetAudience.includes('loyal')) {
      filters.loyaltyTier = ['Gold', 'Platinum']
    } else if (templateInfo.targetAudience.includes('new')) {
      filters.lifecycle = ['New']
    } else if (templateInfo.targetAudience.includes('active')) {
      filters.lifecycle = ['Active']
    }
    
    return filters
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator 
        currentStep={3} 
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Select Target Customers</h1>
        <p className="text-gray-600 mt-2">
          Choose which customers should receive this campaign
        </p>
      </div>

      {/* Template Suggestion */}
      {templateInfo && (
        <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
          <span className="text-2xl flex-shrink-0">{templateInfo.icon}</span>
          <div className="text-sm">
            <p className="font-medium text-blue-900">Template Recommendation</p>
            <p className="text-blue-700 mt-1">
              This template is designed for: <strong>{templateInfo.targetAudience}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Customer Selection Component */}
      <CustomerSelection 
        preSelectedFilters={getPreSelectedFilters()}
        onSelectionChange={setSelectedCustomers}
      />

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/campaigns/create/details')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          {selectedCustomers.length > 0 && (
            <p className="text-sm text-gray-600">
              Estimated reach: <span className="font-semibold">{selectedCustomers.length} customers</span>
            </p>
          )}
          <Button
            onClick={handleProceed}
            disabled={selectedCustomers.length === 0}
          >
            Continue with {selectedCustomers.length} Customers
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}