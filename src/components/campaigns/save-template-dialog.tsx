import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface SaveTemplateDialogProps {
  campaign: any
  performance: {
    improvement: number
    openRate: number
    clickRate: number
    conversionRate: number
    roi: number
  }
  isOpen: boolean
  onClose: () => void
  onSave: (template: any) => void
}

export function SaveTemplateDialog({
  campaign,
  performance,
  isOpen,
  onClose,
  onSave
}: SaveTemplateDialogProps) {
  const [templateName, setTemplateName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('custom')

  const handleSave = () => {
    const newTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      icon: '⭐',
      description,
      category,
      metrics: {
        avgROI: `${performance.roi}%`,
        successRate: `${performance.conversionRate}%`,
        timeline: '14 days',
        usageCount: 0
      },
      tags: ['custom', 'proven', category],
      createdFrom: campaign.id
    }

    onSave(newTemplate)
    onClose()

    // Show success toast
    toast.success("Template saved!", {
      description: "Your successful campaign has been saved as a reusable template.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
          <DialogDescription>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">
                This campaign performed {performance.improvement}% above average!
              </span>
            </div>
            Save it as a template to reuse this winning strategy.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g., Summer VIP Reactivation"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what makes this strategy effective..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Strategy</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="lifecycle">Customer Lifecycle</SelectItem>
                <SelectItem value="treatment">Treatment-Based</SelectItem>
                <SelectItem value="event">Event/Promotional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Performance Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium mb-2">Performance Highlights</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Open Rate:</span>
                <span className="font-medium ml-2">{performance.openRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Click Rate:</span>
                <span className="font-medium ml-2">{performance.clickRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">Conversion:</span>
                <span className="font-medium ml-2">{performance.conversionRate}%</span>
              </div>
              <div>
                <span className="text-gray-600">ROI:</span>
                <span className="font-medium ml-2">{performance.roi}%</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Not Now
          </Button>
          <Button onClick={handleSave} disabled={!templateName || !description}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}