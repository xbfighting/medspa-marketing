'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  BarChart3, 
  Settings,
  Sparkles,
  Layers
} from 'lucide-react'
import { NavItem } from './nav-item'

const navigation = [
  {
    label: 'AI Assistant',
    href: '/',
    icon: Sparkles,
  },
  {
    label: 'Campaigns',
    href: '/campaigns',
    icon: Mail,
  },
  {
    label: 'Templates',
    href: '/templates',
    icon: Layers,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn(
      "flex h-full w-64 flex-col bg-white border-r border-gray-200 shadow-sm",
      className
    )}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            MedSpa AI
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          Powered by AI Marketing
        </div>
      </div>
    </div>
  )
}