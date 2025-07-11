'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  BarChart3, 
  Settings,
  Sparkles,
  FileEdit,
  LogOut
} from 'lucide-react'
import { NavItem } from './nav-item'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    label: 'AI Assistant',
    href: '/',
    icon: Sparkles,
  },
  {
    label: 'Campaign Builder',
    href: '/campaigns/create',
    icon: FileEdit,
  },
  {
    label: 'My Campaigns',
    href: '/campaigns',
    icon: Mail,
    exact: true,
  },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter()
  
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }
  
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
            exact={item.exact}
          />
        ))}
      </nav>

      {/* Footer with Logout */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
        <div className="text-xs text-gray-500 text-center">
          Powered by AI Marketing
        </div>
      </div>
    </div>
  )
}