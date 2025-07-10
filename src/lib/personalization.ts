import { User, Activity, Tag, Calendar, Crown, Heart } from 'lucide-react'

export interface PersonalizationVariable {
  key: string
  label: string
  example: string
  description?: string
}

export interface PersonalizationCategory {
  label: string
  icon: any
  variables: PersonalizationVariable[]
}

export const personalVariables: Record<string, PersonalizationCategory> = {
  customer: {
    label: 'Customer Information',
    icon: User,
    variables: [
      { 
        key: 'firstName', 
        label: 'First Name', 
        example: 'Sarah',
        description: 'Customer\'s first name only'
      },
      { 
        key: 'lastName', 
        label: 'Last Name', 
        example: 'Johnson',
        description: 'Customer\'s last name only'
      },
      { 
        key: 'fullName', 
        label: 'Full Name', 
        example: 'Sarah Johnson',
        description: 'Customer\'s complete name'
      },
      { 
        key: 'email', 
        label: 'Email Address', 
        example: 'sarah@example.com',
        description: 'Customer\'s email address'
      },
      { 
        key: 'phone', 
        label: 'Phone Number', 
        example: '(310) 555-0123',
        description: 'Customer\'s phone number'
      },
      { 
        key: 'loyaltyTier', 
        label: 'Loyalty Tier', 
        example: 'Gold',
        description: 'Customer\'s loyalty membership level'
      },
    ]
  },
  treatment: {
    label: 'Treatment History',
    icon: Activity,
    variables: [
      { 
        key: 'lastProcedure', 
        label: 'Last Procedure', 
        example: 'Botox Injection',
        description: 'Most recent treatment received'
      },
      { 
        key: 'lastVisitDate', 
        label: 'Last Visit Date', 
        example: '3 months ago',
        description: 'When customer last visited'
      },
      { 
        key: 'totalVisits', 
        label: 'Total Visits', 
        example: '12',
        description: 'Total number of appointments'
      },
      { 
        key: 'favoriteService', 
        label: 'Favorite Service', 
        example: 'HydraFacial',
        description: 'Most frequently booked service'
      },
      { 
        key: 'nextMaintenance', 
        label: 'Next Maintenance Due', 
        example: 'March 15, 2024',
        description: 'Recommended follow-up date'
      },
      { 
        key: 'totalSpent', 
        label: 'Total Spent', 
        example: '$2,450',
        description: 'Lifetime customer value'
      },
    ]
  },
  offer: {
    label: 'Special Offers',
    icon: Tag,
    variables: [
      { 
        key: 'discountPercent', 
        label: 'Discount Percentage', 
        example: '20%',
        description: 'Percentage discount amount'
      },
      { 
        key: 'discountAmount', 
        label: 'Discount Dollar Amount', 
        example: '$50',
        description: 'Fixed dollar discount'
      },
      { 
        key: 'offerCode', 
        label: 'Promotion Code', 
        example: 'SPRING20',
        description: 'Unique promotional code'
      },
      { 
        key: 'expiryDate', 
        label: 'Offer Expires', 
        example: 'March 31, 2024',
        description: 'Promotion expiration date'
      },
      { 
        key: 'specialOffer', 
        label: 'Special Offer', 
        example: 'Buy 2 get 1 free',
        description: 'Custom promotional offer'
      },
    ]
  },
  clinic: {
    label: 'Clinic Information',
    icon: Heart,
    variables: [
      { 
        key: 'clinicName', 
        label: 'Clinic Name', 
        example: 'Radiance MedSpa',
        description: 'Business name'
      },
      { 
        key: 'doctorName', 
        label: 'Doctor Name', 
        example: 'Dr. Emily Chen',
        description: 'Primary physician'
      },
      { 
        key: 'clinicPhone', 
        label: 'Clinic Phone', 
        example: '(555) 123-4567',
        description: 'Main contact number'
      },
      { 
        key: 'clinicAddress', 
        label: 'Clinic Address', 
        example: '123 Beauty Ave, Beverly Hills',
        description: 'Physical location'
      },
      { 
        key: 'websiteUrl', 
        label: 'Website URL', 
        example: 'www.radiancemedspa.com',
        description: 'Clinic website'
      },
    ]
  }
}

// Helper function to get all variables as a flat array
export function getAllVariables(): PersonalizationVariable[] {
  return Object.values(personalVariables)
    .flatMap(category => category.variables)
}

// Helper function to find a variable by key
export function findVariable(key: string): PersonalizationVariable | undefined {
  return getAllVariables().find(variable => variable.key === key)
}

// Helper function to replace variables in text with actual values
export function replaceVariables(
  text: string, 
  values: Record<string, string>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key] || match
  })
}

// Helper function to extract variables from text
export function extractVariables(text: string): string[] {
  const matches = text.match(/\{\{(\w+)\}\}/g)
  if (!matches) return []
  
  return matches.map(match => match.replace(/[{}]/g, ''))
}

// Helper function to validate if a variable key exists
export function isValidVariable(key: string): boolean {
  return !!findVariable(key)
}

// Sample data for testing personalization
export const samplePersonalizationData: Record<string, string> = {
  // Customer info
  firstName: 'Sarah',
  lastName: 'Johnson',
  fullName: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '(310) 555-0123',
  loyaltyTier: 'Gold',
  
  // Treatment history
  lastProcedure: 'Botox Injection',
  lastVisitDate: '3 months ago',
  totalVisits: '12',
  favoriteService: 'HydraFacial',
  nextMaintenance: 'March 15, 2024',
  totalSpent: '$2,450',
  
  // Offers
  discountPercent: '20%',
  discountAmount: '$50',
  offerCode: 'SPRING20',
  expiryDate: 'March 31, 2024',
  specialOffer: 'Buy 2 HydraFacials, get 1 free',
  
  // Clinic info
  clinicName: 'Radiance MedSpa',
  doctorName: 'Dr. Emily Chen',
  clinicPhone: '(555) 123-4567',
  clinicAddress: '123 Beauty Ave, Beverly Hills, CA 90210',
  websiteUrl: 'www.radiancemedspa.com'
}