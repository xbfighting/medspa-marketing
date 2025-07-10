'use client'

import { useGlobalShortcuts } from '@/hooks/use-shortcuts'
import { ShortcutHelp } from '@/components/ui/shortcut-help'

export function GlobalShortcuts() {
  const { shortcuts, showHelp, setShowHelp } = useGlobalShortcuts()

  return (
    <ShortcutHelp
      open={showHelp}
      onOpenChange={setShowHelp}
      shortcuts={shortcuts}
    />
  )
}