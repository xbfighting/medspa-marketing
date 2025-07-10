'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { EmailEditor } from './email-editor'
import { EmailPreview } from './email-preview'
import { AIGenerateButton } from './ai-generate-button'
import { TypewriterText } from '@/components/ui/typewriter'
import { EmailEditorWithVariables } from './enhanced-email-editor'
import { HighlightedContent } from './highlighted-content'
import { samplePersonalizationData } from '@/lib/personalization'
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  FileText, 
  Sparkles, 
  Send,
  Mail,
  MessageSquare,
  Calendar,
  Target,
  Wand2
} from 'lucide-react'
import { Customer, Campaign } from '@/lib/types'
import { AI_TEMPLATES, generateContent, generateSubjectLine, generatePreviewText } from '@/lib/ai-templates'
import { formatDistanceToNow } from 'date-fns'

interface CreateWizardProps {
  customers: Customer[]
  onComplete?: (campaign: Partial<Campaign>) => void
}

export function CreateWizard({ customers, onComplete }: CreateWizardProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form state
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [campaignDetails, setCampaignDetails] = useState({
    name: '',
    type: 'Email' as 'Email' | 'SMS',
    schedule: 'now' as 'now' | 'later',
    scheduledDate: '',
    scheduledTime: ''
  })
  const [aiSettings, setAiSettings] = useState({
    template: '',
    tone: 'Friendly' as 'Professional' | 'Friendly' | 'Urgent' | 'Casual',
    customFields: {} as Record<string, string>
  })
  const [generatedContent, setGeneratedContent] = useState({
    subject: '',
    previewText: '',
    content: '',
    isGenerated: false
  })
  const [showTypewriter, setShowTypewriter] = useState(false)

  const steps = [
    { number: 1, title: 'Select Recipients', icon: Users },
    { number: 2, title: 'Campaign Details', icon: FileText },
    { number: 3, title: 'AI Generation', icon: Sparkles },
    { number: 4, title: 'Review & Send', icon: Send }
  ]

  // Filter customers by criteria
  const [filters, setFilters] = useState({
    lifecycleStage: 'all',
    loyaltyTier: 'all',
    lastVisitDays: 'all'
  })

  const filteredCustomers = customers.filter(customer => {
    if (filters.lifecycleStage !== 'all' && customer.lifecycleStage !== filters.lifecycleStage) {
      return false
    }
    if (filters.loyaltyTier !== 'all' && customer.loyaltyTier !== filters.loyaltyTier) {
      return false
    }
    if (filters.lastVisitDays !== 'all') {
      const daysSinceVisit = customer.lastInteraction 
        ? Math.floor((Date.now() - new Date(customer.lastInteraction).getTime()) / (1000 * 60 * 60 * 24))
        : 999
      
      switch (filters.lastVisitDays) {
        case '30':
          return daysSinceVisit <= 30
        case '60':
          return daysSinceVisit <= 60
        case '90':
          return daysSinceVisit <= 90
        case '90+':
          return daysSinceVisit > 90
      }
    }
    return true
  })

  const handleSelectAllCustomers = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(filteredCustomers.map(c => c.id))
    } else {
      setSelectedCustomers([])
    }
  }

  const handleCustomerToggle = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId)
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    )
  }

  const handleGenerateContent = async () => {
    if (!aiSettings.template || selectedCustomers.length === 0) return

    // Get first selected customer for personalization example
    const sampleCustomer = customers.find(c => selectedCustomers.includes(c.id))
    if (!sampleCustomer) return

    // Reset typewriter state
    setShowTypewriter(false)

    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const subject = generateSubjectLine(aiSettings.template, sampleCustomer.name, aiSettings.tone)
    const previewText = generatePreviewText(aiSettings.template, aiSettings.tone)
    const content = generateContent({
      template: aiSettings.template,
      tone: aiSettings.tone,
      personalization: {
        customerName: sampleCustomer.name,
        lastProcedure: sampleCustomer.lastProcedure,
        loyaltyTier: sampleCustomer.loyaltyTier,
        customFields: aiSettings.customFields
      }
    }, campaignDetails.type === 'Email' ? 'email' : 'sms')

    setGeneratedContent({
      subject,
      previewText,
      content,
      isGenerated: true
    })

    // Start typewriter animation
    setShowTypewriter(true)
  }

  const handleComplete = () => {
    const campaign: Partial<Campaign> = {
      name: campaignDetails.name,
      type: campaignDetails.type,
      status: campaignDetails.schedule === 'now' ? 'Active' : 'Scheduled',
      subject: generatedContent.subject,
      content: generatedContent.content,
      targetCustomerIds: selectedCustomers,
      createdDate: new Date().toISOString(),
      scheduledDate: campaignDetails.schedule === 'later' 
        ? `${campaignDetails.scheduledDate}T${campaignDetails.scheduledTime}` 
        : new Date().toISOString(),
      template: aiSettings.template,
      tone: aiSettings.tone
    }

    if (onComplete) {
      onComplete(campaign)
    } else {
      // In a real app, this would make an API call to create the campaign
      console.log('Creating campaign:', campaign)
      router.push('/campaigns')
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return selectedCustomers.length > 0
      case 2:
        return campaignDetails.name.length > 0 && 
               (campaignDetails.schedule === 'now' || 
                (campaignDetails.scheduledDate && campaignDetails.scheduledTime))
      case 3:
        return generatedContent.isGenerated
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number
            const isUpcoming = currentStep < step.number
            
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-400'}
                `}>
                  {isCompleted ? (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-2 flex-1">
                  <div className={`text-sm font-medium transition-colors duration-200 ${
                    isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 flex-1 mx-4 transition-colors duration-200 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Choose which customers will receive this campaign'}
            {currentStep === 2 && 'Set up your campaign name, type, and schedule'}
            {currentStep === 3 && 'Let AI generate personalized content for your campaign'}
            {currentStep === 4 && 'Review your campaign before sending'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Select Recipients */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Lifecycle Stage</Label>
                  <Select 
                    value={filters.lifecycleStage} 
                    onValueChange={(value) => setFilters({...filters, lifecycleStage: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="At-Risk">At-Risk</SelectItem>
                      <SelectItem value="Dormant">Dormant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Loyalty Tier</Label>
                  <Select 
                    value={filters.loyaltyTier} 
                    onValueChange={(value) => setFilters({...filters, loyaltyTier: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="Bronze">Bronze</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Last Visit</Label>
                  <Select 
                    value={filters.lastVisitDays} 
                    onValueChange={(value) => setFilters({...filters, lastVisitDays: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="30">Within 30 days</SelectItem>
                      <SelectItem value="60">Within 60 days</SelectItem>
                      <SelectItem value="90">Within 90 days</SelectItem>
                      <SelectItem value="90+">Over 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Select All */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onCheckedChange={handleSelectAllCustomers}
                  />
                  <Label className="font-medium">
                    Select all {filteredCustomers.length} customers
                  </Label>
                </div>
                <Badge variant="secondary">
                  {selectedCustomers.length} selected
                </Badge>
              </div>

              {/* Customer List */}
              <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
                {filteredCustomers.map(customer => (
                  <div 
                    key={customer.id} 
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox 
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={() => handleCustomerToggle(customer.id)}
                      />
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-600">
                          {customer.email} • {customer.loyaltyTier} • Last visit: {
                            customer.lastInteraction 
                              ? formatDistanceToNow(new Date(customer.lastInteraction), { addSuffix: true })
                              : 'Never'
                          }
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{customer.lifecycleStage}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Campaign Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name"
                  placeholder="e.g., Summer Botox Promotion"
                  value={campaignDetails.name}
                  onChange={(e) => setCampaignDetails({...campaignDetails, name: e.target.value})}
                />
              </div>

              <div>
                <Label>Campaign Type</Label>
                <RadioGroup 
                  value={campaignDetails.type}
                  onValueChange={(value) => setCampaignDetails({...campaignDetails, type: value as 'Email' | 'SMS'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="Email" id="email" />
                    <Label htmlFor="email" className="flex items-center cursor-pointer flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Campaign
                      <span className="ml-auto text-sm text-gray-500">Rich content with images</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="SMS" id="sms" />
                    <Label htmlFor="sms" className="flex items-center cursor-pointer flex-1">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      SMS Campaign
                      <span className="ml-auto text-sm text-gray-500">Short and direct messages</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label>Schedule</Label>
                <RadioGroup 
                  value={campaignDetails.schedule}
                  onValueChange={(value) => setCampaignDetails({...campaignDetails, schedule: value as 'now' | 'later'})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="now" id="now" />
                    <Label htmlFor="now">Send immediately</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="later" id="later" />
                    <Label htmlFor="later">Schedule for later</Label>
                  </div>
                </RadioGroup>

                {campaignDetails.schedule === 'later' && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="scheduled-date">Date</Label>
                      <Input 
                        id="scheduled-date"
                        type="date"
                        value={campaignDetails.scheduledDate}
                        onChange={(e) => setCampaignDetails({...campaignDetails, scheduledDate: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="scheduled-time">Time</Label>
                      <Input 
                        id="scheduled-time"
                        type="time"
                        value={campaignDetails.scheduledTime}
                        onChange={(e) => setCampaignDetails({...campaignDetails, scheduledTime: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: AI Generation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <Label>Choose a Template</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {AI_TEMPLATES.map(template => {
                    const isSelected = aiSettings.template === template.id
                    return (
                      <div 
                        key={template.id}
                        className={`
                          relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 
                          hover:shadow-md hover:scale-[1.02] group
                          ${isSelected 
                            ? 'border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200' 
                            : 'border-gray-200 hover:border-primary-300 hover:bg-primary-25 bg-white'
                          }
                        `}
                        onClick={() => setAiSettings({...aiSettings, template: template.id})}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        
                        <div className={`font-medium transition-colors ${
                          isSelected ? 'text-primary-700' : 'text-gray-900 group-hover:text-primary-700'
                        }`}>
                          {template.name}
                        </div>
                        <div className={`text-sm mt-1 transition-colors ${
                          isSelected ? 'text-primary-600' : 'text-gray-600 group-hover:text-primary-600'
                        }`}>
                          {template.description}
                        </div>
                        <Badge variant="secondary" className="mt-2">{template.category}</Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <Label>Select Tone</Label>
                <RadioGroup 
                  value={aiSettings.tone}
                  onValueChange={(value) => setAiSettings({...aiSettings, tone: value as any})}
                  className="mt-2 grid grid-cols-2 gap-3"
                >
                  {['Professional', 'Friendly', 'Urgent', 'Casual'].map(tone => (
                    <div key={tone} className="flex items-center space-x-2">
                      <RadioGroupItem value={tone} id={tone.toLowerCase()} />
                      <Label htmlFor={tone.toLowerCase()}>{tone}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Custom Fields for selected template */}
              {aiSettings.template && (
                <div>
                  <Label>Customize Content</Label>
                  <div className="space-y-3 mt-2">
                    {AI_TEMPLATES.find(t => t.id === aiSettings.template)?.variables.map(variable => (
                      <div key={variable}>
                        <Label htmlFor={variable} className="text-sm">
                          {variable.charAt(0).toUpperCase() + variable.slice(1).replace(/([A-Z])/g, ' $1')}
                        </Label>
                        <Input 
                          id={variable}
                          placeholder={`Enter ${variable}`}
                          value={aiSettings.customFields[variable] || ''}
                          onChange={(e) => setAiSettings({
                            ...aiSettings,
                            customFields: {
                              ...aiSettings.customFields,
                              [variable]: e.target.value
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-center">
                <AIGenerateButton 
                  onGenerate={handleGenerateContent}
                  disabled={!aiSettings.template}
                  className="w-full md:w-auto"
                />
              </div>

              {/* Generated Content Preview */}
              {generatedContent.isGenerated && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <h3 className="font-medium">AI Generated Content</h3>
                  </div>
                  
                  {campaignDetails.type === 'Email' ? (
                    <div className="space-y-4">
                      {showTypewriter ? (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm">Subject Line</Label>
                            <div className="p-3 bg-white rounded border mt-1">
                              <TypewriterText
                                text={generatedContent.subject}
                                speed={30}
                                className="text-sm font-medium text-gray-900"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Preview Text</Label>
                            <div className="p-3 bg-white rounded border mt-1">
                              <TypewriterText
                                text={generatedContent.previewText}
                                speed={25}
                                delay={1000}
                                className="text-sm text-gray-700"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-sm">Email Content</Label>
                            <div className="p-4 bg-white rounded border min-h-[100px] mt-1">
                              <TypewriterText
                                text={generatedContent.content.replace(/<[^>]*>/g, '')}
                                speed={20}
                                delay={2000}
                                className="text-sm text-gray-800 leading-relaxed"
                                onComplete={() => {
                                  // After typewriter completes, switch to editable mode
                                  setTimeout(() => setShowTypewriter(false), 1000)
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <EmailEditorWithVariables
                          subject={generatedContent.subject}
                          content={generatedContent.content}
                          previewText={generatedContent.previewText}
                          onSubjectChange={(subject) => setGeneratedContent({...generatedContent, subject})}
                          onContentChange={(content) => setGeneratedContent({...generatedContent, content})}
                          onPreviewTextChange={(previewText) => setGeneratedContent({...generatedContent, previewText})}
                          variables={samplePersonalizationData}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="mt-2">
                      {showTypewriter ? (
                        <div className="p-3 bg-white rounded border min-h-[80px]">
                          <TypewriterText
                            text={generatedContent.content}
                            speed={30}
                            delay={500}
                            className="text-sm text-gray-800"
                            onComplete={() => {
                              setTimeout(() => setShowTypewriter(false), 1000)
                            }}
                          />
                        </div>
                      ) : (
                        <Textarea 
                          rows={3}
                          value={generatedContent.content}
                          onChange={(e) => setGeneratedContent({...generatedContent, content: e.target.value})}
                          className="text-sm"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review & Send */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h3 className="font-semibold text-lg">Campaign Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Campaign Name</div>
                    <div className="font-medium">{campaignDetails.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Type</div>
                    <div className="font-medium flex items-center">
                      {campaignDetails.type === 'Email' ? <Mail className="h-4 w-4 mr-1" /> : <MessageSquare className="h-4 w-4 mr-1" />}
                      {campaignDetails.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Recipients</div>
                    <div className="font-medium">{selectedCustomers.length} customers</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Schedule</div>
                    <div className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {campaignDetails.schedule === 'now' 
                        ? 'Send immediately' 
                        : `${campaignDetails.scheduledDate} at ${campaignDetails.scheduledTime}`
                      }
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Template</div>
                    <div className="font-medium">{AI_TEMPLATES.find(t => t.id === aiSettings.template)?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Tone</div>
                    <div className="font-medium">{aiSettings.tone}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-medium mb-4">Content Preview</h4>
                {campaignDetails.type === 'Email' ? (
                  <EmailPreview
                    subject={generatedContent.subject}
                    content={generatedContent.content}
                    previewText={generatedContent.previewText}
                    fromName="MedSpa Clinic"
                    fromEmail="hello@medspaclinic.com"
                    recipientName="Sarah Johnson"
                    recipientEmail="sarah@example.com"
                  />
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">SMS Content</div>
                      <div className="bg-gray-50 border rounded-lg p-4 font-mono text-sm">
                        {generatedContent.content}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Character count: {generatedContent.content.length}/160 (SMS limit)
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-900">Ready to send?</div>
                    <div className="text-sm text-yellow-700 mt-1">
                      This campaign will be sent to {selectedCustomers.length} customers 
                      {campaignDetails.schedule === 'now' ? ' immediately' : ` on ${campaignDetails.scheduledDate}`}.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Navigation */}
        <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : router.push('/campaigns')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          {currentStep < 4 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceedToNext()}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!canProceedToNext()}
            >
              <Send className="h-4 w-4 mr-2" />
              {campaignDetails.schedule === 'now' ? 'Send Campaign' : 'Schedule Campaign'}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}