import { NextResponse } from 'next/server'
import campaigns from '@/data/campaigns.json'

export async function GET(
  request: Request,
  context: any
) {
  const params = await context.params
  try {
    const campaign = campaigns.find(c => c.id === params.id)
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    )
  }
}