'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

interface ShortcutAction {
  key: string
  ctrl?: boolean
  meta?: boolean
  shift?: boolean
  alt?: boolean
  description: string
  action: () => void
  category?: string
}

export function useShortcuts(actions: ShortcutAction[] = []) {
  const router = useRouter()
  const [showHelp, setShowHelp] = useState(false)

  // Default global shortcuts
  const defaultActions = useMemo((): ShortcutAction[] => [
    {
      key: 'k',
      ctrl: true,
      meta: true,
      description: 'Quick search',
      category: 'Navigation',
      action: () => {
        // TODO: Open search modal
        console.log('Opening quick search...')
      }
    },
    {
      key: 'n',
      ctrl: true,
      meta: true,
      description: 'New campaign',
      category: 'Actions',
      action: () => {
        router.push('/campaigns/create')
      }
    },
    {
      key: 'd',
      ctrl: true,
      meta: true,
      description: 'Go to dashboard',
      category: 'Navigation',
      action: () => {
        router.push('/')
      }
    },
    {
      key: 'k',
      ctrl: true,
      meta: true,
      description: 'Go to campaigns',
      category: 'Navigation',
      action: () => {
        router.push('/campaigns')
      }
    },
    {
      key: 'u',
      ctrl: true,
      meta: true,
      description: 'Go to customers',
      category: 'Navigation',
      action: () => {
        router.push('/customers')
      }
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      category: 'Help',
      action: () => {
        setShowHelp(true)
      }
    },
    {
      key: 'Escape',
      description: 'Close modal/overlay',
      category: 'General',
      action: () => {
        setShowHelp(false)
      }
    }
  ], [router, setShowHelp])

  const allActions = useMemo(() => [...defaultActions, ...actions], [defaultActions, actions])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if we're in an input field
      const target = e.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true'

      // For most shortcuts, don't trigger if in input field
      // Exception: Escape key should always work
      if (isInputField && e.key !== 'Escape') return

      for (const shortcut of allActions) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const metaMatch = shortcut.meta ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey
        const altMatch = shortcut.alt ? e.altKey : !e.altKey

        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && 
            ctrlMatch && metaMatch && shiftMatch && altMatch) {
          e.preventDefault()
          shortcut.action()
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [allActions])

  return {
    shortcuts: allActions,
    showHelp,
    setShowHelp
  }
}

export function useGlobalShortcuts() {
  return useShortcuts()
}

// Hook for specific page shortcuts
export function useCampaignShortcuts() {
  const router = useRouter()
  
  const campaignActions: ShortcutAction[] = [
    {
      key: 's',
      ctrl: true,
      meta: true,
      description: 'Save campaign',
      category: 'Campaign',
      action: () => {
        // TODO: Save current campaign
        console.log('Saving campaign...')
      }
    },
    {
      key: 'p',
      ctrl: true,
      meta: true,
      description: 'Preview campaign',
      category: 'Campaign',
      action: () => {
        // TODO: Open preview
        console.log('Opening preview...')
      }
    },
    {
      key: 'Enter',
      ctrl: true,
      meta: true,
      description: 'Send campaign',
      category: 'Campaign',
      action: () => {
        // TODO: Send campaign
        console.log('Sending campaign...')
      }
    }
  ]

  return useShortcuts(campaignActions)
}

export function useCustomerShortcuts() {
  const router = useRouter()
  
  const customerActions: ShortcutAction[] = [
    {
      key: 'a',
      ctrl: true,
      meta: true,
      description: 'Add new customer',
      category: 'Customer',
      action: () => {
        // TODO: Open new customer modal
        console.log('Adding new customer...')
      }
    },
    {
      key: 'f',
      ctrl: true,
      meta: true,
      description: 'Filter customers',
      category: 'Customer',
      action: () => {
        // TODO: Focus filter input
        console.log('Focusing filter...')
      }
    }
  ]

  return useShortcuts(customerActions)
}

// Format shortcut for display
export function formatShortcut(shortcut: ShortcutAction): string {
  const parts: string[] = []
  
  if (shortcut.ctrl || shortcut.meta) {
    parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')
  }
  if (shortcut.shift) parts.push('⇧')
  if (shortcut.alt) parts.push(navigator.platform.includes('Mac') ? '⌥' : 'Alt')
  
  let key = shortcut.key
  if (key === ' ') key = 'Space'
  if (key === 'Escape') key = 'Esc'
  if (key === '?') key = '?'
  
  parts.push(key.toUpperCase())
  
  return parts.join(' + ')
}