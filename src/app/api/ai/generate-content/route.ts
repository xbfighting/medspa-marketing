import { NextResponse } from 'next/server'
import { logClaudeAPICall, calculateCost } from '@/lib/claude-logger'

interface GenerateRequest {
  campaignType: 'email' | 'sms'
  strategy: {
    id: string
    name: string
    description: string
  }
  customization?: {
    tone: string
    urgency: string
    discount: string
    incentive: string
  }
  customerSegment?: {
    lifecycle: string
    count: number
  }
  template?: {
    id: string
    name: string
    description: string
  }
  details?: {
    service: string
    discount: string
    validUntil: string
    bookingWindow: string
  }
}

interface GeneratedContent {
  subject?: string
  preview?: string
  content: string
  personalizationTokens: string[]
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as GenerateRequest
    
    // Check if Claude API is enabled
    const enableClaudeAPI = process.env.ENABLE_CLAUDE_API !== 'false'
    const apiKey = process.env.CLAUDE_API_KEY
    
    // Skip API call if disabled or no key
    if (!enableClaudeAPI || !apiKey) {
      console.log('Claude API disabled or not configured, using mock content')
      return NextResponse.json(getMockContent(data))
    }

    // Build context based on flow type
    const isManualFlow = !!data.template
    const context = isManualFlow ? 
      buildManualFlowContext(data) : 
      buildAIFlowContext(data)

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
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: context
        }]
      })
    })

    const duration = Date.now() - startTime

    if (!response.ok) {
      console.error('Claude API error:', response.status, response.statusText)
      
      // Try to log the error (but don't fail if logging fails)
      try {
        await logClaudeAPICall({
          timestamp: new Date().toISOString(),
          endpoint: 'generate-content',
          model: 'claude-3-haiku-20240307',
          requestData: data,
          error: `API Error: ${response.status} ${response.statusText}`,
          duration
        })
      } catch (logError) {
        console.error('Failed to log API error:', logError)
      }
      
      return NextResponse.json(getMockContent(data))
    }

    const responseData = await response.json()
    const content = responseData.content[0].text
    
    // Extract usage info for logging
    const usage = responseData.usage || {}
    const cost = calculateCost(
      'claude-3-haiku-20240307',
      usage.input_tokens || 0,
      usage.output_tokens || 0
    )

    // Parse Claude's response
    let result: GeneratedContent
    try {
      result = JSON.parse(content)
      
      // Try to log successful API call (but don't fail if logging fails)
      try {
        await logClaudeAPICall({
          timestamp: new Date().toISOString(),
          endpoint: 'generate-content',
          model: 'claude-3-haiku-20240307',
          inputTokens: usage.input_tokens,
          outputTokens: usage.output_tokens,
          cost,
          requestData: data,
          responseData: result,
          duration
        })
      } catch (logError) {
        console.error('Failed to log API success:', logError)
      }

    } catch (e) {
      console.error('Failed to parse Claude response:', e)
      
      // Log parsing error
      await logClaudeAPICall({
        timestamp: new Date().toISOString(),
        endpoint: 'generate-content',
        model: 'claude-3-haiku-20240307',
        requestData: data,
        responseData: content,
        error: 'Failed to parse response',
        duration
      })
      
      return NextResponse.json(getMockContent(data))
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in generate-content:', error)
    return NextResponse.json({ 
      error: 'Failed to generate content' 
    }, { status: 500 })
  }
}

function buildAIFlowContext(data: GenerateRequest): string {
  const { campaignType, strategy, customization, customerSegment } = data
  
  return `You are a medical spa marketing expert. Generate a ${campaignType} campaign based on this strategy:

Strategy: ${strategy.name} - ${strategy.description}
Tone: ${customization?.tone || 'Professional'}
Urgency: ${customization?.urgency || 'Medium'}
Discount: ${customization?.discount || 'No specific discount'}
Incentive: ${customization?.incentive || 'Standard offer'}
Target Audience: ${customerSegment?.lifecycle || 'All'} customers (${customerSegment?.count || 'various'} recipients)

Generate a JSON response with:
${campaignType === 'email' ? `
- subject: Compelling email subject line
- preview: Email preview text (50-90 characters)
- content: Full email body in HTML with styling. Use inline styles for formatting.
` : `
- content: SMS message (160 characters max)
`}
- personalizationTokens: Array of tokens used like ["[FirstName]", "[ServiceName]", "[Discount]"]

The content should:
1. Be specific to medical spa services
2. Create urgency without being pushy
3. Include personalization tokens naturally
4. Follow best practices for ${campaignType} marketing
5. Include a clear call-to-action

Keep the tone ${customization?.tone || 'professional'} and the urgency level ${customization?.urgency || 'medium'}.`
}

function buildManualFlowContext(data: GenerateRequest): string {
  const { campaignType, template, details } = data
  
  return `You are a medical spa marketing expert. Generate a ${campaignType} campaign based on this template:

Template: ${template?.name} - ${template?.description}
Service: ${details?.service || 'General services'}
Discount: ${details?.discount || 'Special offer'}
Valid Until: ${details?.validUntil || 'Limited time'}
Booking Window: ${details?.bookingWindow || 'Standard hours'}

Generate a JSON response with:
${campaignType === 'email' ? `
- subject: Compelling email subject line based on the template theme
- preview: Email preview text (50-90 characters)
- content: Full email body in HTML with professional styling. Use inline styles and make it visually appealing.
` : `
- content: SMS message (160 characters max) that matches the template theme
`}
- personalizationTokens: Array of tokens used like ["[FirstName]", "[ServiceName]", "[Discount]", "[ValidUntil]"]

The content should:
1. Match the template's theme and purpose
2. Incorporate all the provided details naturally
3. Be professional and compelling
4. Include relevant personalization tokens
5. Have a strong call-to-action
6. For emails, use a clean, mobile-responsive design

Create content that would convert well for a medical spa audience.`
}

function getMockContent(data: GenerateRequest): GeneratedContent {
  const { campaignType } = data
  
  if (campaignType === 'email') {
    return {
      subject: "✨ [FirstName], Your Exclusive Spa Offer Awaits!",
      preview: "Save [Discount] on your favorite treatments - Limited time only!",
      content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #9333ea; color: white; padding: 30px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">Exclusive Offer Just for You!</h1>
  </div>
  
  <div style="padding: 30px; background-color: #f9fafb;">
    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
      Dear [FirstName],
    </p>
    
    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
      We've missed you at the spa! As one of our valued clients, we're offering you an exclusive [Discount] discount on [ServiceName].
    </p>
    
    <div style="background-color: white; border: 2px dashed #9333ea; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="font-size: 20px; color: #9333ea; font-weight: bold; margin: 10px 0;">
        Save [Discount] on [ServiceName]
      </p>
      <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">
        Valid until [ValidUntil] | Use code: EXCLUSIVE[Discount]
      </p>
    </div>
    
    <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
      Don't miss this opportunity to treat yourself. Book your appointment today and rediscover the relaxation you deserve.
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="#" style="background-color: #9333ea; color: white; padding: 15px 40px; text-decoration: none; font-size: 18px; font-weight: bold; border-radius: 8px; display: inline-block;">
        Book Now
      </a>
    </div>
    
    <p style="font-size: 14px; color: #6b7280; text-align: center;">
      Questions? Call us at (555) 123-4567 or reply to this email.
    </p>
  </div>
  
  <div style="background-color: #e5e7eb; padding: 20px; text-align: center;">
    <p style="font-size: 12px; color: #6b7280; margin: 0;">
      © 2024 Your Medical Spa. All rights reserved.<br>
      123 Spa Street, City, State 12345
    </p>
  </div>
</div>`,
      personalizationTokens: ["[FirstName]", "[Discount]", "[ServiceName]", "[ValidUntil]"]
    }
  } else {
    return {
      content: "Hi [FirstName]! 🌟 Save [Discount] on [ServiceName] this week only! Book now: [BookingLink] Reply STOP to opt out.",
      personalizationTokens: ["[FirstName]", "[Discount]", "[ServiceName]", "[BookingLink]"]
    }
  }
}