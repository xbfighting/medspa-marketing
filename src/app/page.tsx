'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Pre-fill with example for demo
  useEffect(() => {
    setInput("I need to fill empty appointment slots next Tuesday and Wednesday")
  }, [])

  const handleSubmit = async () => {
    if (!input.trim()) return

    setIsProcessing(true)
    // Store in sessionStorage for next step
    sessionStorage.setItem('campaign_goal', input)

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 800))

    // Navigate to AI flow
    router.push('/campaigns/ai-create/strategies')
  }

  const examples = [
    "Re-engage customers who haven't visited in 3 months with exclusive offers",
    "Promote our summer specials to active customers",
    "Fill appointment slots for next week",
    "Launch our new laser treatment to women over 35",
    "Send birthday offers with special discounts"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-4 py-16 w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Create Smarter Campaigns with AI
          </h1>
          <p className="text-xl text-gray-600">
            Describe your marketing goal in plain English, and let AI create the perfect strategy
          </p>
        </div>

        {/* Main Input Card */}
        <Card className="p-8 shadow-xl">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your marketing goal in plain English..."
            className="min-h-[120px] text-lg resize-none mb-6"
            autoFocus
          />

          <Button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            {isProcessing ? (
              <span className="animate-pulse">Processing your request...</span>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Create Campaign with AI
              </>
            )}
          </Button>
        </Card>

        {/* Examples */}
        <div className="mt-8">
          <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
          <div className="space-y-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => setInput(example)}
                className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                • {example}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}