'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, CheckCircle, Loader2, Mail, MessageSquare, ArrowRight, Users } from 'lucide-react'
import { generateContent, generateSubjectLine, generatePreviewText } from '@/lib/ai-templates'

interface GenerationStep {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed'
}

export default function GeneratePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [campaignData, setCampaignData] = useState<any>(null)
  
  const steps: GenerationStep[] = [
    { id: 'analyze', label: 'Analyzing strategy and customers', status: 'pending' },
    { id: 'generate', label: 'Generating personalized content', status: 'pending' },
    { id: 'optimize', label: 'Optimizing for engagement', status: 'pending' },
    { id: 'finalize', label: 'Finalizing campaign', status: 'pending' }
  ]

  const [stepStatuses, setStepStatuses] = useState(steps)

  useEffect(() => {
    // Retrieve data from session storage
    const goal = sessionStorage.getItem('campaign_goal')
    const strategyId = sessionStorage.getItem('selected_strategy')
    const customization = JSON.parse(sessionStorage.getItem('strategy_customization') || '{}')
    const customerIds = JSON.parse(sessionStorage.getItem('selected_customers') || '[]')

    if (!goal || !strategyId || customerIds.length === 0) {
      router.push('/')
      return
    }

    setCampaignData({
      goal,
      strategyId,
      customization,
      customerIds,
      customerCount: customerIds.length
    })

    // Start generation process
    generateCampaign()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const generateCampaign = async () => {
    // Simulate step-by-step generation
    for (let i = 0; i < steps.length; i++) {
      // Update current step to processing
      setStepStatuses(prev => prev.map((step, index) => ({
        ...step,
        status: index === i ? 'processing' : index < i ? 'completed' : 'pending'
      })))
      setCurrentStep(i)

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mark as completed
      setStepStatuses(prev => prev.map((step, index) => ({
        ...step,
        status: index <= i ? 'completed' : 'pending'
      })))
    }

    // Generate actual content using existing AI template system
    const template = 'seasonal-promotion'
    const tone = (campaignData?.customization?.tone || 'friendly').charAt(0).toUpperCase() + (campaignData?.customization?.tone || 'friendly').slice(1) as any
    
    const body = generateContent({
      template,
      tone,
      personalization: {
        customerName: 'Sarah',
        customFields: {
          discount: campaignData?.customization?.discount || '20%',
          treatments: '<li>Botox</li><li>Dermal Fillers</li>',
          season: 'Special',
          bookingDeadline: 'This Week'
        }
      }
    })

    const subject = generateSubjectLine(template, 'Sarah', tone)
    const preview = generatePreviewText(template, campaignData?.customization?.discount || '20%')

    setGeneratedContent({
      type: 'Email',
      subject,
      preview,
      content: body,
      cta: {
        text: 'Book Your Appointment',
        url: 'https://booking.medspa.com'
      }
    })
  }

  const handleCreateCampaign = async () => {
    // Create campaign object
    const newCampaign = {
      name: `AI Campaign - ${campaignData.goal.slice(0, 30)}...`,
      type: 'Email',
      status: 'Scheduled',
      subject: generatedContent.subject,
      previewText: generatedContent.preview,
      content: generatedContent.content,
      ctaText: generatedContent.cta.text,
      ctaUrl: generatedContent.cta.url,
      targetCustomerIds: campaignData.customerIds,
      createdWithAI: true,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      performance: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0
      }
    }

    // In a real app, this would save to the backend
    // For now, we'll just redirect to campaigns page
    sessionStorage.setItem('new_campaign', JSON.stringify(newCampaign))
    
    // Clear session data
    sessionStorage.removeItem('campaign_goal')
    sessionStorage.removeItem('selected_strategy')
    sessionStorage.removeItem('strategy_customization')
    sessionStorage.removeItem('selected_customers')

    // Redirect to campaigns page
    router.push('/campaigns')
  }

  if (!campaignData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI is Creating Your Campaign</h1>
        <p className="text-gray-600">
          Generating personalized content for {campaignData.customerCount} customers
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Generation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stepStatuses.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className="relative">
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : step.status === 'processing' ? (
                    <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                  )}
                </div>
                <span className={`text-sm ${
                  step.status === 'completed' ? 'text-gray-900 font-medium' :
                  step.status === 'processing' ? 'text-purple-600 font-medium' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card className="border-purple-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Generated Campaign</CardTitle>
              <Badge variant="secondary">
                <Mail className="h-3 w-3 mr-1" />
                Email Campaign
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Subject Line</p>
              <p className="font-medium">{generatedContent.subject}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Preview Text</p>
              <p className="text-gray-700">{generatedContent.preview}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Content Preview</p>
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 line-clamp-4">
                {generatedContent.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {campaignData.customerCount} recipients
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  Personalized content
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {generatedContent && (
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline">
              Customize Further
            </Button>
            <Button onClick={handleCreateCampaign}>
              Create Campaign
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}