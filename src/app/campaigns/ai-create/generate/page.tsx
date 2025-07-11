'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  Users, 
  RefreshCw,
  Edit3,
  Eye,
  Copy,
  Check,
  Send
} from 'lucide-react'
import { generateContent, generateSubjectLine, generatePreviewText } from '@/lib/ai-templates'
import { EnhancedEmailEditor } from '@/components/campaigns/enhanced-email-editor'
import { EmailPreview } from '@/components/campaigns/email-preview'
import { cn } from '@/lib/utils'

interface GenerationStep {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed'
}

interface GeneratedContent {
  type: 'Email' | 'SMS'
  subject: string
  preview: string
  content: string
  smsContent?: string
  cta: {
    text: string
    url: string
  }
}

export default function GeneratePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [campaignData, setCampaignData] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview')
  const [campaignType, setCampaignType] = useState<'Email' | 'SMS'>('Email')
  const [editedContent, setEditedContent] = useState<GeneratedContent | null>(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const steps: GenerationStep[] = [
    { id: 'analyze', label: 'Analyzing strategy and customers', status: 'pending' },
    { id: 'generate', label: 'Generating personalized content', status: 'pending' },
    { id: 'optimize', label: 'Optimizing for engagement', status: 'pending' },
    { id: 'finalize', label: 'Finalizing campaign', status: 'pending' }
  ]

  const [stepStatuses, setStepStatuses] = useState(steps)

  // Generate smart campaign name
  const generateCampaignName = (data: any, content: GeneratedContent): string => {
    const date = new Date()
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    
    // Based on strategy and content
    if (data.strategyId === 'urgent-slots') {
      return `Last-Minute Slots - ${month} ${date.getDate()}`
    } else if (data.strategyId === 'flash-sale') {
      return `Flash Sale: ${data.customization?.discount || '20%'} Off - ${month}`
    } else if (data.strategyId === 'vip-winback') {
      return `VIP Win-Back Campaign - ${month} ${date.getFullYear()}`
    } else if (content.subject.includes('Birthday')) {
      return `Birthday Celebration - ${month}`
    } else if (content.subject.includes('Exclusive')) {
      return `Exclusive Offer - ${data.customerIds.length} VIP Customers`
    } else {
      // Fallback to goal-based naming
      const goalWords = data.goal.split(' ').slice(0, 4).join(' ')
      return `${goalWords} - ${month} ${date.getDate()}`
    }
  }

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

  const generateCampaign = async (regenerate = false) => {
    setIsGenerating(true)
    
    // Reset step statuses
    setStepStatuses(steps)
    
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
    const tone = (campaignData?.customization?.tone || 'friendly').charAt(0).toUpperCase() + 
                 (campaignData?.customization?.tone || 'friendly').slice(1) as any
    
    const emailBody = generateContent({
      template,
      tone,
      personalization: {
        customerName: 'Sarah',
        customFields: {
          discount: campaignData?.customization?.discount || '20%',
          treatments: '<li>Botox - Smooth away wrinkles</li><li>Dermal Fillers - Restore volume</li>',
          season: 'Special',
          bookingDeadline: 'This Week'
        }
      }
    })

    const subject = generateSubjectLine(template, 'Sarah', tone)
    const preview = generatePreviewText(template, campaignData?.customization?.discount || '20%')

    // Generate SMS content
    const smsContent = `Hi Sarah! 🌟 Exclusive ${campaignData?.customization?.discount || '20%'} off on Botox & Fillers this week only! Limited appointments available. Book now: [link] Reply STOP to opt out.`

    const content: GeneratedContent = {
      type: campaignType,
      subject,
      preview,
      content: emailBody,
      smsContent,
      cta: {
        text: 'Book Your Appointment',
        url: 'https://booking.medspa.com'
      }
    }

    setGeneratedContent(content)
    setEditedContent(content)
    setIsGenerating(false)
  }

  const handleRegenerate = () => {
    generateCampaign(true)
  }

  const handleCopyContent = () => {
    const textToCopy = campaignType === 'Email' 
      ? editedContent?.content || generatedContent?.content || ''
      : editedContent?.smsContent || generatedContent?.smsContent || ''
    
    navigator.clipboard.writeText(textToCopy)
    setCopiedToClipboard(true)
    setTimeout(() => setCopiedToClipboard(false), 2000)
  }

  const handleCreateCampaign = async () => {
    const finalContent = editedContent || generatedContent
    if (!finalContent) return

    setIsCreating(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate smart campaign name based on strategy and goal
      const campaignName = generateCampaignName(campaignData, finalContent)
      
      // Create campaign object
      const newCampaign = {
      name: campaignName,
      type: campaignType,
      status: 'Scheduled',
      subject: finalContent.subject,
      previewText: finalContent.preview,
      content: campaignType === 'Email' ? finalContent.content : finalContent.smsContent,
      ctaText: finalContent.cta.text,
      ctaUrl: finalContent.cta.url,
      targetCustomerIds: campaignData.customerIds,
      createdWithAI: true,
      aiStrategy: campaignData.strategyId,
      aiGoal: campaignData.goal,
      customization: campaignData.customization,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
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
    sessionStorage.setItem('new_campaign', JSON.stringify(newCampaign))
    
    // Clear session data
    sessionStorage.removeItem('campaign_goal')
    sessionStorage.removeItem('selected_strategy')
    sessionStorage.removeItem('strategy_customization')
    sessionStorage.removeItem('selected_customers')

      // Redirect to campaigns page
      router.push('/campaigns')
    } catch (err) {
      setError('Failed to create campaign. Please try again.')
      setIsCreating(false)
    }
  }

  const updateContent = (field: keyof GeneratedContent, value: string) => {
    if (!editedContent) return
    setEditedContent({
      ...editedContent,
      [field]: value
    })
  }

  if (!campaignData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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

      {/* Progress Steps - Only show while generating */}
      {isGenerating && (
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
                  <span className={cn(
                    "text-sm",
                    step.status === 'completed' && "text-gray-900 font-medium",
                    step.status === 'processing' && "text-purple-600 font-medium",
                    step.status === 'pending' && "text-gray-400"
                  )}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Editor/Preview */}
      {generatedContent && !isGenerating && (
        <div className="space-y-6">
          {/* Campaign Type Selector */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Campaign Type</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={campaignType}
                onValueChange={(value) => setCampaignType(value as 'Email' | 'SMS')}
              >
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="Email" />
                    <span className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Campaign
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <RadioGroupItem value="SMS" />
                    <span className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS Campaign
                    </span>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Content Editor/Preview Tabs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Campaign Content</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyContent}
                  >
                    {copiedToClipboard ? (
                      <>
                        <Check className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'edit' | 'preview')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-4 mt-4">
                  {campaignType === 'Email' ? (
                    <>
                      {/* Email Subject */}
                      <div>
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          value={editedContent?.subject || ''}
                          onChange={(e) => updateContent('subject', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      {/* Email Preview Text */}
                      <div>
                        <Label htmlFor="preview">Preview Text</Label>
                        <Input
                          id="preview"
                          value={editedContent?.preview || ''}
                          onChange={(e) => updateContent('preview', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      {/* Email Body Editor */}
                      <div>
                        <Label>Email Content</Label>
                        <div className="mt-1">
                          <EnhancedEmailEditor
                            content={editedContent?.content || ''}
                            onChange={(content) => updateContent('content', content)}
                            showVariablePanel={false}
                            variables={{
                              customerName: 'Sarah Johnson',
                              discount: campaignData?.customization?.discount || '20%',
                              treatments: 'Botox & Dermal Fillers',
                              bookingDeadline: 'This Week'
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* SMS Content */}
                      <div>
                        <Label htmlFor="sms-content">SMS Message</Label>
                        <textarea
                          id="sms-content"
                          value={editedContent?.smsContent || ''}
                          onChange={(e) => updateContent('smsContent', e.target.value)}
                          className="mt-1 w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                          maxLength={160}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {(editedContent?.smsContent || '').length}/160 characters
                        </p>
                      </div>
                    </>
                  )}

                  {/* CTA Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cta-text">Button Text</Label>
                      <Input
                        id="cta-text"
                        value={editedContent?.cta.text || ''}
                        onChange={(e) => setEditedContent(prev => prev ? {
                          ...prev,
                          cta: { ...prev.cta, text: e.target.value }
                        } : null)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cta-url">Button URL</Label>
                      <Input
                        id="cta-url"
                        value={editedContent?.cta.url || ''}
                        onChange={(e) => setEditedContent(prev => prev ? {
                          ...prev,
                          cta: { ...prev.cta, url: e.target.value }
                        } : null)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  {campaignType === 'Email' ? (
                    <EmailPreview
                      subject={editedContent?.subject || ''}
                      previewText={editedContent?.preview || ''}
                      content={editedContent?.content || ''}
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
                              <p className="text-sm font-medium text-gray-900 mb-1">MedSpa</p>
                              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {editedContent?.smsContent}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Delivered • Now
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Campaign Info */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {campaignData.customerCount} recipients
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    AI-personalized content
                  </span>
                  <Badge variant="secondary">
                    {campaignData.customization?.tone || 'Friendly'} tone
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Action Buttons */}
      {generatedContent && !isGenerating && (
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setViewMode('edit')}
              disabled={viewMode === 'edit'}
            >
              Customize Further
            </Button>
            <Button 
              size="lg"
              onClick={handleCreateCampaign}
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Schedule Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}