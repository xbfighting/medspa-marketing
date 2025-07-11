'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ProgressIndicator } from '@/components/campaigns/progress-indicator'
import { 
  Calendar,
  Clock,
  Mail,
  MessageSquare,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import templatesData from '@/data/strategy-templates.json'
import { format, addDays } from 'date-fns'

interface CampaignDetails {
  name: string
  type: 'Email' | 'SMS'
  description: string
  schedule: 'now' | 'later'
  scheduledDate: string
  scheduledTime: string
}

export default function DetailsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [templateInfo, setTemplateInfo] = useState<any>(null)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1])
  
  const [details, setDetails] = useState<CampaignDetails>({
    name: '',
    type: 'Email',
    description: '',
    schedule: 'later',
    scheduledDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    scheduledTime: '10:00'
  })

  useEffect(() => {
    // Get template info from session
    const templateId = sessionStorage.getItem('selected_template')
    const customization = JSON.parse(sessionStorage.getItem('template_customization') || '{}')
    const savedSteps = JSON.parse(sessionStorage.getItem('completed_steps') || '[]')
    
    if (!templateId) {
      router.push('/campaigns/create/templates')
      return
    }

    // Find template
    const template = templatesData.templates.find(t => t.id === templateId)
    if (template) {
      setTemplateInfo({ ...template, customization })
      
      // Generate smart defaults based on template
      const date = new Date()
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const month = monthNames[date.getMonth()]
      
      let defaultName = ''
      if (template.name.includes('Birthday')) {
        defaultName = `${month} Birthday Campaign`
      } else if (template.name.includes('Flash')) {
        defaultName = `Flash Sale - ${customization.discount || '20%'} Off`
      } else if (template.name.includes('VIP')) {
        defaultName = `VIP Exclusive - ${month}`
      } else {
        defaultName = `${template.name} - ${month}`
      }
      
      setDetails(prev => ({
        ...prev,
        name: defaultName,
        description: `Campaign using ${template.name} template targeting ${template.targetAudience.toLowerCase()}`
      }))
    }
    
    setCompletedSteps(savedSteps)
    setIsLoading(false)
  }, [router])

  const handleStepClick = (step: number) => {
    if (step === 1) {
      router.push('/campaigns/create/templates')
    }
  }

  const handleProceed = () => {
    // Validate form
    if (!details.name.trim()) {
      alert('Please enter a campaign name')
      return
    }

    // Save to session
    sessionStorage.setItem('campaign_basics', JSON.stringify(details))
    sessionStorage.setItem('completed_steps', JSON.stringify([...completedSteps, 2]))
    
    // Navigate to customer selection
    router.push('/campaigns/create/customers')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator 
        currentStep={2} 
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Campaign Details</h1>
        <p className="text-gray-600 mt-2">
          Configure the basic settings for your campaign
        </p>
      </div>

      {/* Template Info */}
      {templateInfo && (
        <Card className="border-purple-200 bg-purple-50/30">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{templateInfo.icon}</span>
              <div>
                <CardTitle className="text-lg">{templateInfo.name}</CardTitle>
                <CardDescription>{templateInfo.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Form */}
      <div className="space-y-6">
        {/* Campaign Name */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaign Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Campaign Name *</Label>
              <Input
                id="name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                placeholder="Enter campaign name..."
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                This name will help you identify the campaign in your dashboard
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={details.description}
                onChange={(e) => setDetails({ ...details, description: e.target.value })}
                placeholder="Add any notes about this campaign..."
                className="mt-1"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Campaign Type */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Campaign Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={details.type}
              onValueChange={(value) => setDetails({ ...details, type: value as 'Email' | 'SMS' })}
            >
              <label className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="Email" />
                <Mail className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium">Email Campaign</p>
                  <p className="text-sm text-gray-600">Rich content with images and formatting</p>
                </div>
              </label>
              <label className="flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="SMS" />
                <MessageSquare className="h-5 w-5 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium">SMS Campaign</p>
                  <p className="text-sm text-gray-600">Short, direct messages (160 characters)</p>
                </div>
              </label>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={details.schedule}
              onValueChange={(value) => setDetails({ ...details, schedule: value as 'now' | 'later' })}
              className="mb-4"
            >
              <label className="flex items-center space-x-3">
                <RadioGroupItem value="now" />
                <span>Send immediately</span>
              </label>
              <label className="flex items-center space-x-3">
                <RadioGroupItem value="later" />
                <span>Schedule for later</span>
              </label>
            </RadioGroup>

            {details.schedule === 'later' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="date"
                      type="date"
                      value={details.scheduledDate}
                      onChange={(e) => setDetails({ ...details, scheduledDate: e.target.value })}
                      className="pl-10"
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <div className="relative mt-1">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="time"
                      type="time"
                      value={details.scheduledTime}
                      onChange={(e) => setDetails({ ...details, scheduledTime: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6">
        <Button 
          variant="outline" 
          onClick={() => router.push('/campaigns/create/templates')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleProceed}>
          Continue to Customer Selection
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}