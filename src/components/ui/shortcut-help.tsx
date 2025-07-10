'use client'

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatShortcut } from '@/hooks/use-shortcuts'
import { Keyboard, Search, Plus, Home, Users, Mail, HelpCircle } from 'lucide-react'
import { motion } from 'framer-motion'

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

interface ShortcutHelpProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shortcuts: ShortcutAction[]
}

export function ShortcutHelp({ open, onOpenChange, shortcuts }: ShortcutHelpProps) {
  // Group shortcuts by category
  const groupedShortcuts = shortcuts.reduce((groups, shortcut) => {
    const category = shortcut.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(shortcut)
    return groups
  }, {} as Record<string, ShortcutAction[]>)

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'navigation':
        return <Home className="h-4 w-4" />
      case 'actions':
        return <Plus className="h-4 w-4" />
      case 'campaign':
        return <Mail className="h-4 w-4" />
      case 'customer':
        return <Users className="h-4 w-4" />
      case 'help':
        return <HelpCircle className="h-4 w-4" />
      case 'general':
        return <Keyboard className="h-4 w-4" />
      default:
        return <Keyboard className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-purple-600" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster and boost your productivity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                {getCategoryIcon(category)}
                <h3 className="font-medium text-gray-900">{category}</h3>
                <Badge variant="secondary" className="text-xs">
                  {categoryShortcuts.length}
                </Badge>
              </div>

              <div className="grid gap-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      {shortcut.description}
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {formatShortcut(shortcut)}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Pro Tips:</p>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• Shortcuts work globally except when typing in input fields</li>
                <li>• Press <Badge variant="outline" className="mx-1 font-mono text-xs">?</Badge> anytime to see this help</li>
                <li>• Use <Badge variant="outline" className="mx-1 font-mono text-xs">Esc</Badge> to close modals and overlays</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ShortcutBadgeProps {
  shortcut: ShortcutAction
  className?: string
}

export function ShortcutBadge({ shortcut, className }: ShortcutBadgeProps) {
  return (
    <Badge variant="outline" className={`font-mono text-xs ${className}`}>
      {formatShortcut(shortcut)}
    </Badge>
  )
}

interface ShortcutTooltipProps {
  shortcut: string
  description: string
  children: React.ReactNode
}

export function ShortcutTooltip({ shortcut, description, children }: ShortcutTooltipProps) {
  return (
    <div className="group relative">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {description}
        <div className="text-gray-400 mt-0.5 font-mono">
          {shortcut}
        </div>
      </div>
    </div>
  )
}