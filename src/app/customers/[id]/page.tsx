'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CustomerDetail } from '@/components/customers/customer-detail'
import { Button } from '@/components/ui/button'
import { fetchCustomer } from '@/lib/api'
import { Customer } from '@/lib/types'
import { ArrowLeft } from 'lucide-react'

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCustomer() {
      try {
        const data = await fetchCustomer(params.id as string)
        setCustomer(data)
      } catch (error) {
        console.error('Failed to load customer:', error)
        setError('Failed to load customer details')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadCustomer()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading customer details...</div>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          {error || 'Customer not found'}
        </div>
        <Button variant="outline" onClick={() => router.push('/customers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </div>
    )
  }

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/customers')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
      </div>

      {/* Customer Details */}
      <CustomerDetail customer={customer} />
    </div>
  )
}