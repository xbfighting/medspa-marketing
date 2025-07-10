import { NextResponse } from 'next/server'
import customers from '@/data/customers.json'

export async function GET() {
  try {
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}