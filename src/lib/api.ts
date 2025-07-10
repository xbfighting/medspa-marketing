import { Customer, Campaign } from './types'

const API_BASE = '/api'

export async function fetchCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_BASE}/customers`)
  if (!response.ok) {
    throw new Error('Failed to fetch customers')
  }
  return response.json()
}

export async function fetchCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${API_BASE}/campaigns`)
  if (!response.ok) {
    throw new Error('Failed to fetch campaigns')
  }
  return response.json()
}

export async function fetchCustomer(id: string): Promise<Customer> {
  const response = await fetch(`${API_BASE}/customers/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch customer')
  }
  return response.json()
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/campaigns/${id}`)
  if (!response.ok) {
    throw new Error('Failed to fetch campaign')
  }
  return response.json()
}