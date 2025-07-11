'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ProgressIndicator } from '@/components/campaigns/progress-indicator'
import { StrategyDetailModal } from '@/components/campaigns/strategy-detail-modal'
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Users,
  Filter,
  Sparkles
} from 'lucide-react'
import templatesData from '@/data/strategy-templates.json'
import { cn } from '@/lib/utils'

interface Template {
  id: string
  name: string
  icon: string
  description: string
  category: string
  metrics: {
    avgROI: string
    successRate: string
    timeline: string
    usageCount: number
  }
  tags: string[]
  targetAudience: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [modalTemplate, setModalTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Categories from the templates
  const categories = [
    { id: 'all', name: 'All Templates', count: templatesData.templates.length },
    { id: 'retention', name: 'Customer Retention', count: templatesData.templates.filter(t => t.category === 'retention').length },
    { id: 'acquisition', name: 'New Customer', count: templatesData.templates.filter(t => t.category === 'acquisition').length },
    { id: 'seasonal', name: 'Seasonal', count: templatesData.templates.filter(t => t.category === 'seasonal').length },
    { id: 'product', name: 'Product Launch', count: templatesData.templates.filter(t => t.category === 'product').length },
    { id: 'engagement', name: 'Engagement', count: templatesData.templates.filter(t => t.category === 'engagement').length }
  ]

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setTemplates(templatesData.templates as Template[])
      setIsLoading(false)
    }, 500)
  }, [])

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = !searchTerm || 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const handleTemplateSelect = (template: Template) => {
    setModalTemplate(template)
    setShowDetailModal(true)
  }

  const handleModalConfirm = (customization: any) => {
    if (!modalTemplate) return
    
    // Store template and customization in session
    sessionStorage.setItem('selected_template', modalTemplate.id)
    sessionStorage.setItem('template_customization', JSON.stringify(customization))
    sessionStorage.setItem('completed_steps', JSON.stringify([1]))
    
    // Navigate to details page
    router.push('/campaigns/create/details')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Sparkles className="h-8 w-8 animate-pulse text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} completedSteps={[]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Select a Campaign Template</h1>
        <p className="text-gray-600 mt-2">
          Choose from our proven templates to create your marketing campaign
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {filteredTemplates.length} templates found
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              selectedCategory === category.id
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category.name}
            <Badge variant="secondary" className="ml-2">
              {category.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
              selectedTemplate === template.id && "ring-2 ring-purple-600"
            )}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <span className="text-3xl">{template.icon}</span>
                {template.metrics.usageCount > 100 && (
                  <Badge variant="secondary">Popular</Badge>
                )}
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                <div className="text-center">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                  <p className="font-medium">{template.metrics.avgROI}</p>
                  <p className="text-xs text-gray-500">ROI</p>
                </div>
                <div className="text-center">
                  <Users className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                  <p className="font-medium">{template.metrics.successRate}</p>
                  <p className="text-xs text-gray-500">Success</p>
                </div>
                <div className="text-center">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                  <p className="font-medium">{template.metrics.timeline}</p>
                  <p className="text-xs text-gray-500">Timeline</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Target Audience */}
              <p className="text-xs text-gray-600 mb-4">
                Best for: {template.targetAudience}
              </p>

              {/* Action Button */}
              {selectedTemplate === template.id && (
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTemplateSelect(template)
                  }}
                >
                  Use This Template
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your criteria.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
            }}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Template Detail Modal */}
      <StrategyDetailModal
        strategy={modalTemplate}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onConfirm={handleModalConfirm}
        mode="template"
      />
    </div>
  )
}