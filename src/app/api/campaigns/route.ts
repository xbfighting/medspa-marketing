import { NextResponse } from 'next/server'
import campaigns from '@/data/campaigns.json'

export async function GET() {
  try {
    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    )
  }
}