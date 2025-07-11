'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProgressIndicator } from '@/components/campaigns/progress-indicator'
import { EmailPreview } from '@/components/campaigns/email-preview'
import { 
  Send, 
  ArrowLeft,
  Clock,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Edit
} from 'lucide-react'
import { format } from 'date-fns'
import templatesData from '@/data/strategy-templates.json'

interface CampaignSummary {
  template: any
  campaignBasics: any
  customerIds: string[]
  generatedContent: any
  customization: any
}

export default function PreviewPage() {
  const router = useRouter()
  const [campaignSummary, setCampaignSummary] = useState<CampaignSummary | null>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3, 4])
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [estimatedCost, setEstimatedCost] = useState(0)

  useEffect(() => {
    // Retrieve all data from session
    const templateId = sessionStorage.getItem('selected_template')
    const customization = JSON.parse(sessionStorage.getItem('template_customization') || '{}')
    const campaignBasics = JSON.parse(sessionStorage.getItem('campaign_basics') || '{}')
    const customerIds = JSON.parse(sessionStorage.getItem('selected_customers') || '[]')
    const generatedContent = JSON.parse(sessionStorage.getItem('generated_content') || '{}')
    const savedSteps = JSON.parse(sessionStorage.getItem('completed_steps') || '[]')

    if (!templateId || !campaignBasics || !customerIds.length || !generatedContent) {
      router.push('/campaigns/create/templates')
      return
    }

    // Find template
    const template = templatesData.templates.find(t => t.id === templateId)
    if (!template) {
      router.push('/campaigns/create/templates')
      return
    }

    setCampaignSummary({
      template,
      campaignBasics,
      customerIds,
      generatedContent,
      customization
    })

    // Calculate estimated cost
    const costPerRecipient = campaignBasics.type === 'Email' ? 0.02 : 0.05
    setEstimatedCost(customerIds.length * costPerRecipient)

    setCompletedSteps([...savedSteps, 5])
  }, [router])

  const handleStepClick = (step: number) => {
    switch (step) {
      case 1:
        router.push('/campaigns/create/templates')
        break
      case 2:
        router.push('/campaigns/create/details')
        break
      case 3:
        router.push('/campaigns/create/customers')
        break
      case 4:
        router.push('/campaigns/create/generate')
        break
    }
  }

  const handleSendCampaign = async () => {
    if (!campaignSummary) return

    setIsSending(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create campaign object
      const newCampaign = {
        name: campaignSummary.campaignBasics.name,
        type: campaignSummary.campaignBasics.type,
        status: campaignSummary.campaignBasics.schedule === 'now' ? 'Sent' : 'Scheduled',
        subject: campaignSummary.generatedContent.subject,
        previewText: campaignSummary.generatedContent.preview,
        content: campaignSummary.generatedContent.type === 'Email' 
          ? campaignSummary.generatedContent.content 
          : campaignSummary.generatedContent.smsContent,
        ctaText: campaignSummary.generatedContent.cta.text,
        ctaUrl: campaignSummary.generatedContent.cta.url,
        targetCustomerIds: campaignSummary.customerIds,
        templateId: campaignSummary.template.id,
        customization: campaignSummary.customization,
        scheduledDate: campaignSummary.campaignBasics.schedule === 'later' 
          ? `${campaignSummary.campaignBasics.scheduledDate}T${campaignSummary.campaignBasics.scheduledTime}:00`
          : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        createdWithAI: false,
        performance: {
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0
        }
      }

      // Save to session (in real app, would save to backend)
      sessionStorage.setItem('new_campaign', JSON.stringify(newCampaign))
      
      // Clear session data
      sessionStorage.removeItem('selected_template')
      sessionStorage.removeItem('template_customization')
      sessionStorage.removeItem('campaign_basics')
      sessionStorage.removeItem('selected_customers')
      sessionStorage.removeItem('generated_content')
      sessionStorage.removeItem('completed_steps')

      setIsSuccess(true)
      
      // Redirect after showing success
      setTimeout(() => {
        router.push('/campaigns')
      }, 2000)
    } catch (error) {
      console.error('Failed to send campaign:', error)
      setIsSending(false)
    }
  }

  if (!campaignSummary) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Campaign Created Successfully!</h2>
          <p className="text-gray-600">
            {campaignSummary.campaignBasics.schedule === 'now' 
              ? 'Your campaign is being sent to recipients...'
              : 'Your campaign has been scheduled.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator 
        currentStep={5} 
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Send className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Review and Send</h1>
        <p className="text-gray-600">
          Review your campaign details before sending
        </p>
      </div>

      {/* Campaign Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Campaign Details */}
        <div className="md:col-span-1 space-y-4">
          {/* Campaign Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Campaign Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{campaignSummary.campaignBasics.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Template</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl">{campaignSummary.template.icon}</span>
                  <p className="font-medium">{campaignSummary.template.name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <div className="flex items-center gap-2 mt-1">
                  {campaignSummary.campaignBasics.type === 'Email' ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                  <p className="font-medium">{campaignSummary.campaignBasics.type}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {campaignSummary.campaignBasics.schedule === 'now' ? (
                <div>
                  <Badge variant="secondary">Send Immediately</Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Campaign will be sent as soon as you click send
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">
                      {format(new Date(campaignSummary.campaignBasics.scheduledDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">
                      {campaignSummary.campaignBasics.scheduledTime}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipients & Cost */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recipients & Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Recipients</p>
                <p className="font-medium">{campaignSummary.customerIds.length} customers</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Cost</p>
                <div className="flex items-center gap-2 mt-1">
                  <DollarSign className="h-4 w-4" />
                  <p className="font-medium">${estimatedCost.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-medium">${campaignSummary.campaignBasics.budget}</p>
              </div>
            </CardContent>
          </Card>

          {/* Edit Buttons */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/campaigns/create/details')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/campaigns/create/customers')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Recipients
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => router.push('/campaigns/create/generate')}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          </div>
        </div>

        {/* Right Column - Content Preview */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Content Preview</CardTitle>
              <CardDescription>
                This is how your {campaignSummary.campaignBasics.type.toLowerCase()} will appear to recipients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {campaignSummary.campaignBasics.type === 'Email' ? (
                <EmailPreview
                  subject={campaignSummary.generatedContent.subject}
                  previewText={campaignSummary.generatedContent.preview}
                  content={campaignSummary.generatedContent.content}
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="max-w-sm mx-auto">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MessageSquare className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {campaignSummary.campaignBasics.name}
                          </p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {campaignSummary.generatedContent.smsContent}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {campaignSummary.campaignBasics.schedule === 'now' 
                              ? 'Sending now...' 
                              : `Scheduled for ${format(new Date(campaignSummary.campaignBasics.scheduledDate), 'MMM d')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Warning Alert */}
      {campaignSummary.campaignBasics.schedule === 'now' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This campaign will be sent immediately to all {campaignSummary.customerIds.length} selected recipients. 
            This action cannot be undone.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={() => router.push('/campaigns/create/generate')}
          disabled={isSending}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          size="lg"
          onClick={handleSendCampaign}
          disabled={isSending}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isSending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {campaignSummary.campaignBasics.schedule === 'now' ? 'Sending...' : 'Scheduling...'}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {campaignSummary.campaignBasics.schedule === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}