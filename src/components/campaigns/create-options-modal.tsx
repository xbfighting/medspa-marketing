import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateOptionsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateOptionsModal({ isOpen, onClose }: CreateOptionsModalProps) {
  const router = useRouter()

  const handleAIAssistant = () => {
    onClose()
    router.push('/')
  }

  const handleManualSetup = () => {
    onClose()
    router.push('/campaigns/create')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How would you like to create your campaign?</DialogTitle>
          <DialogDescription>
            Choose between AI-powered creation or traditional manual setup
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          <button
            onClick={handleAIAssistant}
            className="w-full p-4 border-2 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Describe your goal and let AI create the perfect strategy
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={handleManualSetup}
            className="w-full p-4 border-2 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all text-left group"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold">Manual Setup</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Create a campaign from scratch with full control
                </p>
              </div>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}