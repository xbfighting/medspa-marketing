import { NextResponse } from 'next/server'
import { logClaudeAPICall, calculateCost } from '@/lib/claude-logger'

interface AnalyzeRequest {
  goal: string
}

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
  reasoning?: string
}

export async function POST(request: Request) {
  let goal: string = ''
  
  try {
    const body = await request.json() as AnalyzeRequest
    goal = body.goal

    // Check if API key is configured
    const apiKey = process.env.CLAUDE_API_KEY
    if (!apiKey) {
      console.error('CLAUDE_API_KEY not configured')
      // Fallback to mock data if no API key
      return NextResponse.json(getMockResponse(goal))
    }

    // Call Claude API
    const startTime = Date.now()
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        temperature: 0.3,
        messages: [{
          role: 'user',
          content: `You are a marketing strategist for a medical spa. Analyze this campaign goal and provide structured insights.

Goal: "${goal}"

Respond with a JSON object containing:
1. understanding: An object with:
   - goal: Categorize as one of: "Fill Appointments", "Customer Reactivation", "Promote Services", "Build Loyalty", "Increase Revenue"
   - target: Identify target audience like "Dormant Customers", "Active Customers", "VIP Customers", "New Customers", "At-Risk Customers"
   - urgency: Rate as "High", "Medium", or "Low"
   - timeline: Suggest timeline like "3-5 days", "7 days", "14-21 days"
   - strategy: Suggest primary strategy type

2. strategies: Array of 3 recommended strategies, each with:
   - id: lowercase-hyphenated-id
   - name: Strategy name
   - icon: Single emoji
   - description: Brief description
   - metrics: { avgROI: "XXX%", successRate: "XX%", timeline: "X days", usageCount: number }
   - tags: Array of 3-4 relevant tags
   - reasoning: Why this strategy fits their goal

Keep the response focused on medical spa marketing best practices.`
        }]
      })
    })

    const duration = Date.now() - startTime

    if (!response.ok) {
      console.error('Claude API error:', response.statusText)
      
      // Log failed API call
      await logClaudeAPICall({
        timestamp: new Date().toISOString(),
        endpoint: 'analyze-goal',
        model: 'claude-3-haiku-20240307',
        requestData: { goal },
        error: `API Error: ${response.statusText}`,
        duration
      })
      
      return NextResponse.json(getMockResponse(goal))
    }

    const data = await response.json()
    const content = data.content[0].text
    
    // Extract usage info for logging
    const usage = data.usage || {}
    const cost = calculateCost(
      'claude-3-haiku-20240307',
      usage.input_tokens || 0,
      usage.output_tokens || 0
    )

    // Parse Claude's response
    let result
    try {
      result = JSON.parse(content)
      console.log('Claude response result:', result)
      
      // Log successful API call
      await logClaudeAPICall({
        timestamp: new Date().toISOString(),
        endpoint: 'analyze-goal',
        model: 'claude-3-haiku-20240307',
        inputTokens: usage.input_tokens,
        outputTokens: usage.output_tokens,
        cost,
        requestData: { goal },
        responseData: result,
        duration
      })

    } catch (e) {
      console.error('Failed to parse Claude response:', e)
      
      // Log parsing error
      await logClaudeAPICall({
        timestamp: new Date().toISOString(),
        endpoint: 'analyze-goal',
        model: 'claude-3-haiku-20240307',
        requestData: { goal },
        responseData: content,
        error: 'Failed to parse response',
        duration
      })
      
      return NextResponse.json(getMockResponse(goal))
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in analyze-goal:', error)
    // Return mock data as fallback
    return NextResponse.json(getMockResponse(goal))
  }
}

// Fallback mock data when API is not available
function getMockResponse(goal: string): any {
  const understanding: Understanding = {
    goal: goal.includes('fill') ? 'Fill Appointments' :
          goal.includes('re-engage') || goal.includes('reactivat') ? 'Customer Reactivation' :
          goal.includes('loyal') ? 'Build Loyalty' :
          goal.includes('revenue') || goal.includes('increase') ? 'Increase Revenue' :
          'Promote Services',
    target: goal.includes('haven\'t visited') || goal.includes('dormant') ? 'Dormant Customers' :
            goal.includes('vip') || goal.includes('loyal') ? 'VIP Customers' :
            goal.includes('new') ? 'New Customers' :
            goal.includes('risk') ? 'At-Risk Customers' :
            'Active Customers',
    urgency: goal.includes('urgent') || goal.includes('tomorrow') || goal.includes('today') ? 'High' :
             goal.includes('soon') || goal.includes('week') ? 'Medium' : 'Low',
    timeline: goal.includes('tomorrow') || goal.includes('today') ? '1-2 days' :
              goal.includes('week') ? '7 days' : '14-21 days',
    strategy: goal.includes('re-engage') || goal.includes('win') ? 'win-back' :
              goal.includes('fill') || goal.includes('appointment') ? 'urgent-booking' :
              goal.includes('loyal') ? 'loyalty' :
              'promotional'
  }

  const strategies: Strategy[] = [
    {
      id: 'urgent-slots',
      name: 'Last-Minute Slot Filler',
      icon: '⏰',
      description: 'Fill empty appointments quickly with time-sensitive offers',
      metrics: {
        avgROI: '280%',
        successRate: '72%',
        timeline: '3-5 days',
        usageCount: 89
      },
      tags: ['urgent', 'appointments', 'quick-win'],
      reasoning: 'Perfect for filling immediate appointment gaps'
    },
    {
      id: 'flash-sale',
      name: 'Flash Sale Campaign',
      icon: '⚡',
      description: 'Create urgency with limited-time exclusive offers',
      metrics: {
        avgROI: '340%',
        successRate: '68%',
        timeline: '7 days',
        usageCount: 156
      },
      tags: ['promotional', 'urgency', 'conversion'],
      reasoning: 'Drives quick decisions with time pressure'
    },
    {
      id: 'vip-exclusive',
      name: 'VIP Exclusive Access',
      icon: '👑',
      description: 'Make customers feel special with exclusive appointment slots',
      metrics: {
        avgROI: '410%',
        successRate: '81%',
        timeline: '5-7 days',
        usageCount: 203
      },
      tags: ['vip', 'exclusive', 'loyalty'],
      reasoning: 'Builds loyalty through exclusivity'
    }
  ]

  return { understanding, strategies }
}
