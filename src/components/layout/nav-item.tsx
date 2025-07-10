'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"

interface NavItemProps {
  icon: LucideIcon
  label: string
  href: string
  collapsed?: boolean
}

export function NavItem({
  icon: Icon,
  label,
  href,
  collapsed = false
}: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <Link href={href} className="group">
      <div className={cn(
        "flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 relative",
        "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",
        isActive
          ? "bg-purple-500 text-white shadow-md transform scale-105"
          : "text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm"
      )}>
        {/* Active indicator */}
        {isActive && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 rounded-r" />
        )}
        
        <Icon className={cn(
          "h-5 w-5 transition-colors duration-200",
          collapsed ? "mx-auto" : "mr-3",
          isActive ? "text-white" : "text-gray-500 group-hover:text-purple-600"
        )} />
        
        {!collapsed && (
          <span className={cn(
            "font-medium transition-colors duration-200",
            isActive ? "text-white" : "text-gray-700 group-hover:text-purple-700"
          )}>
            {label}
          </span>
        )}
        
        {/* Hover effect for inactive items */}
        {!isActive && (
          <div className="absolute inset-0 rounded-lg bg-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-200" />
        )}
      </div>
    </Link>
  )
}