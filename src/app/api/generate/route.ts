import { NextResponse } from 'next/server'
import { generateContent, generateSubjectLine, generatePreviewText } from '@/lib/ai-templates'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { template, tone, personalization, contentType = 'email' } = body

    if (!template || !tone || !personalization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate content using our AI templates
    const content = generateContent(
      {
        template,
        tone,
        personalization
      },
      contentType
    )

    const subject = generateSubjectLine(template, personalization.customerName, tone)
    const previewText = generatePreviewText(template, tone)

    // In a real application, this might call an actual AI API like OpenAI
    // For now, we return the template-based generated content
    return NextResponse.json({
      subject,
      previewText,
      content,
      success: true
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}