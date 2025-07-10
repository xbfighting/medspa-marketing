'use client'

import { useEffect, useState } from 'react'
import { CustomerCard } from '@/components/customers/customer-card'
import { CustomerFilters } from '@/components/customers/customer-filters'
import { Button } from '@/components/ui/button'
import { fetchCustomers } from '@/lib/api'
import { Customer } from '@/lib/types'
import { Plus } from 'lucide-react'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLifecycle, setSelectedLifecycle] = useState('all')
  const [selectedLoyalty, setSelectedLoyalty] = useState('all')

  useEffect(() => {
    async function loadCustomers() {
      try {
        const data = await fetchCustomers()
        setCustomers(data)
        setFilteredCustomers(data)
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCustomers()
  }, [])

  useEffect(() => {
    let filtered = customers

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
      )
    }

    // Filter by lifecycle stage
    if (selectedLifecycle !== 'all') {
      filtered = filtered.filter(customer => customer.lifecycleStage === selectedLifecycle)
    }

    // Filter by loyalty tier
    if (selectedLoyalty !== 'all') {
      filtered = filtered.filter(customer => customer.loyaltyTier === selectedLoyalty)
    }

    setFilteredCustomers(filtered)
  }, [customers, searchTerm, selectedLifecycle, selectedLoyalty])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedLifecycle('all')
    setSelectedLoyalty('all')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading customers...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Customers
        </h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <CustomerFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLifecycle={selectedLifecycle}
        onLifecycleChange={setSelectedLifecycle}
        selectedLoyalty={selectedLoyalty}
        onLoyaltyChange={setSelectedLoyalty}
        onClearFilters={handleClearFilters}
        totalResults={filteredCustomers.length}
      />

      {/* Customer Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No customers found</div>
          {(searchTerm || selectedLifecycle !== 'all' || selectedLoyalty !== 'all') && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  )
}