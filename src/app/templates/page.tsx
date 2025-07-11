'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import templatesData from '@/data/strategy-templates.json'

export default function TemplatesPage() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Filter templates
  const filteredTemplates = templatesData.templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
                         template.description.toLowerCase().includes(search.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))

    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Get popular templates
  const popularTemplates = [...templatesData.templates]
    .sort((a, b) => b.metrics.usageCount - a.metrics.usageCount)
    .slice(0, 6)

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Strategy Templates</h1>
        <p className="text-gray-600 mt-2">
          Proven campaign strategies for medical aesthetics
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs for categories */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Templates ({templatesData.templates.length})</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
          <TabsTrigger value="treatment">Treatment</TabsTrigger>
          <TabsTrigger value="event">Event</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Popular Templates Section */}
      {selectedCategory === 'all' && search === '' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">🔥 Most Popular</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularTemplates.slice(0, 3).map((template) => (
              <TemplateCard key={template.id} template={template} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found matching your criteria.</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearch('')
            setSelectedCategory('all')
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}

// Template Card Component
function TemplateCard({ template, featured = false }: { template: any, featured?: boolean }) {
  const router = useRouter()

  const handleUseTemplate = () => {
    // Clear any existing session data
    sessionStorage.removeItem('selected_template')
    sessionStorage.removeItem('template_customization')
    sessionStorage.removeItem('campaign_basics')
    sessionStorage.removeItem('selected_customers')
    sessionStorage.removeItem('generated_content')
    sessionStorage.removeItem('completed_steps')
    
    // Set selected template and default customization
    sessionStorage.setItem('selected_template', template.id)
    sessionStorage.setItem('template_customization', JSON.stringify({
      discount: '20%',
      urgency: 'medium',
      tone: 'friendly'
    }))
    sessionStorage.setItem('completed_steps', JSON.stringify([1]))
    
    // Navigate directly to campaign details
    router.push('/campaigns/create/details')
  }

  return (
    <Card className={`hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] ${featured ? 'border-purple-200' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <span className="text-3xl">{template.icon}</span>
          <div className="flex gap-1">
            {featured && <Badge variant="default">Popular</Badge>}
            {template.metrics.usageCount > 200 && <Badge variant="secondary">Trending</Badge>}
          </div>
        </div>
        <CardTitle className="text-lg">{template.name}</CardTitle>
        <CardDescription className="line-clamp-2">{template.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div className="text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
            <p className="font-medium">{template.metrics.avgROI}</p>
            <p className="text-xs text-gray-500">Avg ROI</p>
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

        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag: string) => (
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

        <Button className="w-full" size="sm" onClick={handleUseTemplate}>
          Use This Strategy
        </Button>
      </CardContent>
    </Card>
  )
}