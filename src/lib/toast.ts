import { toast } from 'sonner'

// Success toast for positive user actions
export const showSuccessToast = (message: string, description?: string) => {
  toast.success(message, {
    description,
  })
}

// Error toast for failed operations
export const showErrorToast = (message: string, description?: string) => {
  toast.error(message, {
    description,
  })
}

// Info toast for general information
export const showInfoToast = (message: string, description?: string) => {
  toast.info(message, {
    description,
  })
}

// Warning toast for caution messages
export const showWarningToast = (message: string, description?: string) => {
  toast.warning(message, {
    description,
  })
}

// Loading toast for ongoing operations
export const showLoadingToast = (message: string) => {
  return toast.loading(message)
}

// Dismiss a specific toast
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId)
}

// Specific toast functions for common app actions
export const toasts = {
  // Customer actions
  customerCreated: () => showSuccessToast('Customer added successfully', 'New customer has been added to your database'),
  customerUpdated: () => showSuccessToast('Customer updated', 'Customer information has been saved'),
  customerDeleted: () => showSuccessToast('Customer removed', 'Customer has been removed from your database'),
  
  // Campaign actions
  campaignCreated: () => showSuccessToast('Campaign created successfully', 'Your campaign is ready to be sent'),
  campaignSent: () => showSuccessToast('Campaign sent', 'Your campaign has been sent to the target audience'),
  campaignScheduled: () => showSuccessToast('Campaign scheduled', 'Your campaign will be sent at the scheduled time'),
  campaignPaused: () => showInfoToast('Campaign paused', 'Campaign has been paused and can be resumed later'),
  campaignResumed: () => showSuccessToast('Campaign resumed', 'Campaign is now active again'),
  
  // AI generation
  contentGenerated: () => showSuccessToast('Content generated', 'AI has created personalized content for your campaign'),
  contentGenerationFailed: () => showErrorToast('Content generation failed', 'Please try again with different parameters'),
  
  // Data operations
  dataLoaded: () => showSuccessToast('Data loaded', 'Latest information has been refreshed'),
  dataLoadFailed: () => showErrorToast('Failed to load data', 'Please check your connection and try again'),
  dataSaved: () => showSuccessToast('Changes saved', 'Your changes have been saved successfully'),
  dataSaveFailed: () => showErrorToast('Save failed', 'Could not save changes. Please try again'),
  
  // Settings
  settingsUpdated: () => showSuccessToast('Settings updated', 'Your preferences have been saved'),
  settingsResetToDefault: () => showInfoToast('Settings reset', 'All settings have been reset to default values'),
  
  // General errors
  networkError: () => showErrorToast('Network error', 'Please check your internet connection'),
  unknownError: () => showErrorToast('Something went wrong', 'An unexpected error occurred. Please try again'),
}