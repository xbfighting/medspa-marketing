'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react'
import { StrategyDetailModal } from '@/components/campaigns/strategy-detail-modal'

interface Understanding {
  goal: string
  target: string
  urgency: string
  timeline: string
  strategy: string
}

interface Strategy {
  id: string
  name: string
  icon: string
  description: string
  metrics: {
    avgROI: string
    successRate: string
    timeline: string
    usageCount: number
  }
  tags: string[]
}

export default function StrategiesPage() {
  const router = useRouter()
  const [understanding, setUnderstanding] = useState<Understanding | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [modalStrategy, setModalStrategy] = useState<Strategy | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const goal = sessionStorage.getItem('campaign_goal')
    if (goal) {
      analyzeGoal(goal)
    } else {
      router.push('/')
    }
  }, [router])

  const analyzeGoal = async (goal: string) => {
    try {
      setError(null)
      
      // Call API to analyze goal
      const response = await fetch('/api/ai/analyze-goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goal })
      })

      if (!response.ok) {
        throw new Error('Failed to analyze goal')
      }

      const data = await response.json()
      
      setUnderstanding(data.understanding)
      setStrategies(data.strategies)
      setIsAnalyzing(false)
    } catch (err) {
      setError('Failed to analyze your goal. Please try again.')
      setIsAnalyzing(false)
    }
  }

  const handleStrategySelect = (strategy: Strategy) => {
    setModalStrategy(strategy)
    setShowDetailModal(true)
  }

  const handleModalConfirm = (customization: any) => {
    sessionStorage.setItem('selected_strategy', modalStrategy?.id || '')
    sessionStorage.setItem('strategy_customization', JSON.stringify(customization))
    router.push('/campaigns/ai-create/customize')
  }

  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-lg text-gray-600">AI is analyzing your marketing goal...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Card className="p-6 max-w-md">
            <div className="text-red-600 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-900 font-medium mb-2">{error}</p>
            <div className="flex gap-3 justify-center mt-4">
              <Button variant="outline" onClick={() => router.push('/')}>Go Back</Button>
              <Button onClick={() => {
                const goal = sessionStorage.getItem('campaign_goal')
                if (goal) analyzeGoal(goal)
              }}>Try Again</Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* AI Understanding Card */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            I understand you want to:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Goal</p>
              <p className="font-medium">{understanding?.goal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Target</p>
              <p className="font-medium">{understanding?.target}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Urgency</p>
              <p className="font-medium">{understanding?.urgency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Timeline</p>
              <p className="font-medium">{understanding?.timeline}</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push('/')}>
              Adjust Understanding
            </Button>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Looks Good
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Recommendations */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended Strategies</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy) => (
            <Card
              key={strategy.id}
              className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                selectedStrategy === strategy.id ? 'ring-2 ring-purple-600' : ''
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <span className="text-3xl">{strategy.icon}</span>
                  {strategy.metrics.usageCount > 100 && (
                    <Badge variant="secondary">Popular</Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{strategy.name}</CardTitle>
                <CardDescription>{strategy.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                  <div className="text-center">
                    <TrendingUp className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <p className="font-medium">{strategy.metrics.avgROI}</p>
                    <p className="text-xs text-gray-500">ROI</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <p className="font-medium">{strategy.metrics.successRate}</p>
                    <p className="text-xs text-gray-500">Success</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1 text-gray-500" />
                    <p className="font-medium">{strategy.metrics.timeline}</p>
                    <p className="text-xs text-gray-500">Timeline</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {strategy.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {selectedStrategy === strategy.id && (
                  <Button
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStrategySelect(strategy)
                    }}
                  >
                    Use This Strategy
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Strategy Detail Modal */}
      <StrategyDetailModal
        strategy={modalStrategy}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onConfirm={handleModalConfirm}
      />
    </div>
  )
}