import { NextResponse } from 'next/server'
import customers from '@/data/customers.json'

export async function GET(
  request: Request,
  context: any
) {
  const params = await context.params
  try {
    const customer = customers.find(c => c.id === params.id)
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(customer)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    )
  }
}