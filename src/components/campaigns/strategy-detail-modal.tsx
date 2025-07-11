import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useState } from 'react'

interface StrategyDetailModalProps {
  strategy: any
  isOpen: boolean
  onClose: () => void
  onConfirm: (customization: any) => void
  mode?: 'strategy' | 'template'
}

export function StrategyDetailModal({
  strategy,
  isOpen,
  onClose,
  onConfirm,
  mode = 'strategy'
}: StrategyDetailModalProps) {
  const [customization, setCustomization] = useState({
    discount: '20%',
    urgency: 'medium',
    tone: 'friendly'
  })

  if (!strategy) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{strategy.icon}</span>
            {strategy.name}
          </DialogTitle>
          <DialogDescription>{strategy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timeline Visualization */}
          <div>
            <h3 className="font-semibold mb-3">Campaign Timeline</h3>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
              <div className="relative flex justify-between">
                {[1, 7, 14].map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-white border-2 border-purple-500 rounded-full flex items-center justify-center mb-2">
                      {index === 2 ? '💬' : '✉️'}
                    </div>
                    <p className="text-xs font-medium">Day {day}</p>
                    <p className="text-xs text-gray-500">
                      {index === 0 ? 'Launch' : index === 1 ? 'Reminder' : 'Final'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customization Options */}
          <div>
            <h3 className="font-semibold mb-4">Customize Parameters</h3>
            <div className="grid grid-cols-3 gap-6">
              {/* Discount */}
              <div className="space-y-3">
                <Label>Discount Amount</Label>
                <RadioGroup
                  value={customization.discount}
                  onValueChange={(value) => setCustomization({...customization, discount: value})}
                >
                  {['15%', '20%', '25%', '30%'].map(amount => (
                    <div key={amount} className="flex items-center space-x-2">
                      <RadioGroupItem value={amount} />
                      <Label className="font-normal">{amount}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Urgency */}
              <div className="space-y-3">
                <Label>Urgency Level</Label>
                <RadioGroup
                  value={customization.urgency}
                  onValueChange={(value) => setCustomization({...customization, urgency: value})}
                >
                  {['low', 'medium', 'high'].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <RadioGroupItem value={level} />
                      <Label className="font-normal capitalize">{level}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Tone */}
              <div className="space-y-3">
                <Label>Message Tone</Label>
                <RadioGroup
                  value={customization.tone}
                  onValueChange={(value) => setCustomization({...customization, tone: value})}
                >
                  {['professional', 'friendly', 'urgent'].map(tone => (
                    <div key={tone} className="flex items-center space-x-2">
                      <RadioGroupItem value={tone} />
                      <Label className="font-normal capitalize">{tone}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Expected Results */}
          <div>
            <h3 className="font-semibold mb-3">Expected Results</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Open Rate</p>
                  <p className="text-xl font-semibold">45-55%</p>
                </div>
                <div>
                  <p className="text-gray-600">Click Rate</p>
                  <p className="text-xl font-semibold">12-18%</p>
                </div>
                <div>
                  <p className="text-gray-600">Conversion</p>
                  <p className="text-xl font-semibold">8-12%</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg ROI</p>
                  <p className="text-xl font-semibold">{strategy.metrics?.avgROI || '320%'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(customization)}>
            Continue with These Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}