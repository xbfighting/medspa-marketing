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
import { ProgressIndicator } from '@/components/campaigns/progress-indicator'
import { 
  Sparkles, 
  Loader2, 
  Mail, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Users, 
  RefreshCw,
  Edit3,
  Eye,
  Copy,
  Check,
  FileText
} from 'lucide-react'
import { generateContent, generateSubjectLine, generatePreviewText } from '@/lib/ai-templates'
import { EnhancedEmailEditor } from '@/components/campaigns/enhanced-email-editor'
import { EmailPreview } from '@/components/campaigns/email-preview'
import { cn } from '@/lib/utils'
import templatesData from '@/data/strategy-templates.json'

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
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview')
  const [campaignType, setCampaignType] = useState<'Email' | 'SMS'>('Email')
  const [editedContent, setEditedContent] = useState<GeneratedContent | null>(null)
  const [copiedToClipboard, setCopiedToClipboard] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3])
  const [campaignData, setCampaignData] = useState<any>(null)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Retrieve data from session storage
    const templateId = sessionStorage.getItem('selected_template')
    const customization = JSON.parse(sessionStorage.getItem('template_customization') || '{}')
    const campaignBasics = JSON.parse(sessionStorage.getItem('campaign_basics') || '{}')
    const customerIds = JSON.parse(sessionStorage.getItem('selected_customers') || '[]')
    const savedSteps = JSON.parse(sessionStorage.getItem('completed_steps') || '[]')

    if (!templateId || !campaignBasics || customerIds.length === 0) {
      router.push('/campaigns/create/templates')
      return
    }

    // Find template
    const template = templatesData.templates.find(t => t.id === templateId)
    if (!template) {
      router.push('/campaigns/create/templates')
      return
    }

    setCampaignData({
      template,
      customization,
      campaignBasics,
      customerIds,
      customerCount: customerIds.length
    })

    // Set campaign type from basics
    setCampaignType(campaignBasics.type || 'Email')
    setCompletedSteps(savedSteps)

    // Generate content on first load
    if (isFirstLoad) {
      generateCampaignContent(template, customization)
      setIsFirstLoad(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const generateCampaignContent = async (template: any, customization: any) => {
    setIsGenerating(true)
    setError(null)

    try {
      // Call API to generate content
      const campaignDetails = JSON.parse(sessionStorage.getItem('campaign_details') || '{}')
      const selectedCustomers = JSON.parse(sessionStorage.getItem('selected_customers') || '[]')
      
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaignType: campaignType.toLowerCase() as 'email' | 'sms',
          template: {
            id: template.id,
            name: template.name,
            description: template.description
          },
          details: {
            service: campaignDetails.service || template.name,
            discount: customization?.discount || '20%',
            validUntil: campaignDetails.validUntil || 'Limited time',
            bookingWindow: campaignDetails.bookingWindow || 'This week'
          },
          customerSegment: {
            count: selectedCustomers.length
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const data = await response.json()
      
      // Format the response
      const content: GeneratedContent = {
        type: campaignType,
        subject: data.subject || '',
        preview: data.preview || '',
        content: data.content || '',
        smsContent: campaignType === 'SMS' ? data.content : data.smsContent,
        cta: {
          text: 'Book Your Appointment',
          url: 'https://booking.medspa.com'
        }
      }

      setGeneratedContent(content)
      setEditedContent(content)
      
    } catch (err) {
      console.error('Error generating content:', err)
      setError('Failed to generate content. Using fallback templates.')
      
      // Fallback to local generation
      await generateFallbackContent(template, customization)
    }

    setIsGenerating(false)
  }

  const generateFallbackContent = async (template: any, customization: any) => {
    // Simulate generation time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate content using template
    const tone = (customization?.tone || 'friendly').charAt(0).toUpperCase() + 
                 (customization?.tone || 'friendly').slice(1) as any
    
    // Map strategy template to AI template or use fallback
    const aiTemplateMap: Record<string, string> = {
      'vip-winback': 'vip-exclusive',
      'spring-refresh': 'seasonal-promotion',
      'summer-body': 'seasonal-promotion',
      'holiday-glow': 'seasonal-promotion',
      'new-year-transformation': 'seasonal-promotion',
      'botox-maintenance': 'maintenance-reminder',
      'welcome-series': 'new-treatment',
      'loyalty-rewards': 'vip-exclusive',
      'at-risk-prevention': 'maintenance-reminder',
      'birthday-vip': 'vip-exclusive',
      'filler-followup': 'maintenance-reminder',
      'laser-package': 'new-treatment',
      'skincare-upgrade': 'new-treatment',
      'event-prep': 'seasonal-promotion',
      'flash-friday': 'seasonal-promotion',
      'referral-reward': 'vip-exclusive',
      'membership-launch': 'new-treatment',
      'post-treatment-care': 'education-skincare',
      'seasonal-skin-check': 'education-skincare',
      'couples-package': 'seasonal-promotion',
      'anti-aging-series': 'new-treatment',
      'acne-clear-program': 'new-treatment',
      'mommy-makeover': 'new-treatment',
      'mens-grooming': 'new-treatment',
      'wellness-wednesday': 'seasonal-promotion'
    }
    
    const aiTemplateId = aiTemplateMap[template.id] || 'seasonal-promotion'
    
    const emailBody = generateContent({
      template: aiTemplateId,
      tone,
      personalization: {
        customerName: '[FirstName]',
        customFields: {
          discount: customization?.discount || '20%',
          treatments: '<li>Botox - Smooth away wrinkles</li><li>Dermal Fillers - Restore volume</li>',
          season: 'Special',
          bookingDeadline: 'This Week'
        }
      }
    })

    const subject = generateSubjectLine(aiTemplateId, '[FirstName]', tone)
    const preview = generatePreviewText(aiTemplateId, customization?.discount || '20%')

    // Generate SMS content
    const smsContent = `Hi [FirstName]! 🌟 Exclusive ${customization?.discount || '20%'} off on ${template.name}. Limited time offer! Book now: [link] Reply STOP to opt out.`

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
  }

  const handleRegenerate = () => {
    if (campaignData) {
      generateCampaignContent(campaignData.template, campaignData.customization)
    }
  }

  const handleCopyContent = () => {
    const textToCopy = campaignType === 'Email' 
      ? editedContent?.content || generatedContent?.content || ''
      : editedContent?.smsContent || generatedContent?.smsContent || ''
    
    navigator.clipboard.writeText(textToCopy)
    setCopiedToClipboard(true)
    setTimeout(() => setCopiedToClipboard(false), 2000)
  }

  const handleProceed = () => {
    const finalContent = editedContent || generatedContent
    if (!finalContent) return

    // Save to session
    sessionStorage.setItem('generated_content', JSON.stringify(finalContent))
    sessionStorage.setItem('completed_steps', JSON.stringify([...completedSteps, 4]))
    
    // Navigate to preview
    router.push('/campaigns/create/preview')
  }

  const updateContent = (field: keyof GeneratedContent, value: string) => {
    if (!editedContent) return
    setEditedContent({
      ...editedContent,
      [field]: value
    })
  }

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
    }
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
      {/* Progress Indicator */}
      <ProgressIndicator 
        currentStep={4} 
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <FileText className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Generate Campaign Content</h1>
        <p className="text-gray-600">
          Creating personalized content for {campaignData.customerCount} customers
        </p>
      </div>

      {/* Template Info */}
      <Card className="border-purple-200 bg-purple-50/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{campaignData.template.icon}</span>
              <div>
                <p className="font-medium">{campaignData.template.name}</p>
                <p className="text-sm text-gray-600">
                  {campaignData.campaignBasics.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                {campaignData.customerCount} recipients
              </span>
              <Badge variant="secondary">
                {campaignData.customization?.tone || 'Friendly'} tone
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isGenerating && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Generating personalized content...
              </p>
              <p className="text-sm text-gray-600">
                This will take just a moment
              </p>
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
        </div>
      )}

      {/* Action Buttons */}
      {generatedContent && !isGenerating && (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => router.push('/campaigns/create/customers')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
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
            <Button onClick={handleProceed}>
              Continue to Preview
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}