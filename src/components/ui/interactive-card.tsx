'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { ReactNode } from "react"

interface InteractiveCardProps {
  children: ReactNode
  clickable?: boolean
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function InteractiveCard({
  children,
  clickable = false,
  href,
  onClick,
  className,
  disabled = false
}: InteractiveCardProps) {
  const baseClasses = "bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200"

  const hoverClasses = clickable && !disabled
    ? "hover:shadow-lg hover:scale-[1.01] hover:border-purple-300 cursor-pointer"
    : "hover:shadow-md cursor-default"

  const disabledClasses = disabled
    ? "opacity-60 cursor-not-allowed"
    : ""

  const cardClasses = cn(baseClasses, hoverClasses, disabledClasses, className)

  if (href && !disabled) {
    return (
      <Link href={href} className={cardClasses}>
        {children}
      </Link>
    )
  }

  return (
    <div
      className={cardClasses}
      onClick={clickable && !disabled ? onClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable && !disabled ? 0 : undefined}
      onKeyDown={clickable && !disabled ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      } : undefined}
    >
      {children}
    </div>
  )
}