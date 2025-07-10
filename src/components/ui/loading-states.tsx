'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2, Sparkles, Activity, Zap } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'purple' | 'green' | 'blue'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'default',
  className 
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  const colors = {
    default: 'text-gray-600',
    purple: 'text-purple-600',
    green: 'text-green-600',
    blue: 'text-blue-600'
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={cn(sizes[size], colors[color], className)}
    >
      <Loader2 className="w-full h-full" />
    </motion.div>
  )
}

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'purple' | 'green' | 'blue'
  className?: string
}

export function PulseLoader({ 
  size = 'md', 
  color = 'purple',
  className 
}: PulseLoaderProps) {
  const sizes = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4'
  }

  const colors = {
    default: 'bg-gray-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600'
  }

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn("rounded-full", sizes[size], colors[color])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

interface SkeletonProps {
  className?: string
  animated?: boolean
}

export function Skeleton({ className, animated = true }: SkeletonProps) {
  return (
    <motion.div
      className={cn("bg-gray-200 rounded", className)}
      animate={animated ? {
        opacity: [1, 0.5, 1]
      } : {}}
      transition={animated ? {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      } : {}}
    />
  )
}

interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'purple' | 'green' | 'blue'
  animated?: boolean
  showLabel?: boolean
  className?: string
}

export function ProgressBar({
  progress,
  size = 'md',
  color = 'purple',
  animated = true,
  showLabel = false,
  className
}: ProgressBarProps) {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const colors = {
    default: 'bg-gray-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600'
  }

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      
      <div className={cn("w-full bg-gray-200 rounded-full", sizes[size])}>
        <motion.div
          className={cn("rounded-full", sizes[size], colors[color])}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={animated ? { 
            duration: 0.5, 
            ease: "easeOut" 
          } : { duration: 0 }}
        />
      </div>
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
  icon?: 'default' | 'sparkles' | 'activity' | 'zap'
  className?: string
}

export function LoadingCard({
  title = "Loading...",
  description = "Please wait while we process your request",
  icon = 'default',
  className
}: LoadingCardProps) {
  const getIcon = () => {
    switch (icon) {
      case 'sparkles':
        return <Sparkles className="h-8 w-8 text-purple-600" />
      case 'activity':
        return <Activity className="h-8 w-8 text-blue-600" />
      case 'zap':
        return <Zap className="h-8 w-8 text-yellow-600" />
      default:
        return <LoadingSpinner size="lg" color="purple" />
    }
  }

  return (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center p-8 bg-white rounded-lg border shadow-sm",
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="mb-4"
        animate={icon === 'default' ? {} : {
          scale: [1, 1.1, 1],
          rotate: icon === 'sparkles' ? [0, 5, -5, 0] : 0
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {getIcon()}
      </motion.div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center max-w-sm">{description}</p>
    </motion.div>
  )
}

interface ButtonLoadingProps {
  loading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}

export function ButtonWithLoading({
  loading,
  children,
  loadingText = "Loading...",
  className,
  disabled,
  onClick
}: ButtonLoadingProps) {
  return (
    <motion.button
      className={cn(
        "relative inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200",
        "bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
    >
      <motion.span
        className="flex items-center gap-2"
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingSpinner size="sm" color="default" className="text-white mr-2" />
          <span>{loadingText}</span>
        </motion.div>
      )}
    </motion.button>
  )
}

interface LoadingOverlayProps {
  visible: boolean
  title?: string
  description?: string
  progress?: number
  className?: string
}

export function LoadingOverlay({
  visible,
  title = "Processing...",
  description = "Please wait while we complete your request",
  progress,
  className
}: LoadingOverlayProps) {
  return (
    <motion.div
      className={cn(
        "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{ pointerEvents: visible ? 'auto' : 'none' }}
    >
      <motion.div
        className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: visible ? 1 : 0.9, 
          opacity: visible ? 1 : 0 
        }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className="mb-6">
          <LoadingSpinner size="lg" color="purple" className="mx-auto" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        
        {progress !== undefined && (
          <ProgressBar 
            progress={progress} 
            showLabel 
            className="mt-4" 
          />
        )}
      </motion.div>
    </motion.div>
  )
}

// Skeleton components for specific layouts
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 space-y-4", className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-2 w-4/5" />
        <Skeleton className="h-2 w-3/5" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-4 w-full" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              className="h-3 w-full" 
            />
          ))}
        </div>
      ))}
    </div>
  )
}