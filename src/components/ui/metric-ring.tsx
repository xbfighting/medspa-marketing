'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface MetricRingProps {
  value: number
  benchmark?: number
  label: string
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'green' | 'blue' | 'yellow' | 'red'
  showTrend?: boolean
  animationDelay?: number
  className?: string
}

export function MetricRing({
  value,
  benchmark = 100,
  label,
  size = 'md',
  color = 'purple',
  showTrend = true,
  animationDelay = 0,
  className
}: MetricRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  const percentage = Math.min((value / benchmark) * 100, 100)
  const isAboveBenchmark = value > benchmark
  const isEqual = Math.abs(value - benchmark) < 0.1
  
  const sizes = {
    sm: { container: 'w-16 h-16', text: 'text-sm', subText: 'text-xs' },
    md: { container: 'w-20 h-20', text: 'text-base', subText: 'text-xs' },
    lg: { container: 'w-24 h-24', text: 'text-lg', subText: 'text-sm' }
  }
  
  const colors = {
    purple: {
      primary: 'text-purple-500',
      secondary: 'text-purple-400',
      background: 'text-purple-100'
    },
    green: {
      primary: 'text-green-500',
      secondary: 'text-green-400',
      background: 'text-green-100'
    },
    blue: {
      primary: 'text-blue-500',
      secondary: 'text-blue-400',
      background: 'text-blue-100'
    },
    yellow: {
      primary: 'text-yellow-500',
      secondary: 'text-yellow-400',
      background: 'text-yellow-100'
    },
    red: {
      primary: 'text-red-500',
      secondary: 'text-red-400',
      background: 'text-red-100'
    }
  }

  const sizeConfig = sizes[size]
  const colorConfig = colors[color]
  
  // Determine color based on performance
  const performanceColor = isEqual 
    ? colorConfig 
    : isAboveBenchmark 
      ? colors.green 
      : colors.yellow

  const circumference = 2 * Math.PI * 36
  const strokeDasharray = `${(animatedValue / 100) * circumference} ${circumference}`

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [percentage, animationDelay])

  const getTrendIcon = () => {
    if (!showTrend) return null
    
    if (isEqual) return <Minus className="h-3 w-3" />
    if (isAboveBenchmark) return <TrendingUp className="h-3 w-3 text-green-600" />
    return <TrendingDown className="h-3 w-3 text-red-600" />
  }

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <motion.div
        className={cn("relative", sizeConfig.container)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.5, 
          delay: animationDelay / 1000,
          type: "spring",
          stiffness: 200
        }}
      >
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            cx="50%"
            cy="50%"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className={cn("transition-colors duration-500", colorConfig.background)}
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50%"
            cy="50%"
            r="36"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (animatedValue / 100) * circumference}
            className={cn("transition-all duration-1000 ease-out", performanceColor.primary)}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (animatedValue / 100) * circumference }}
            transition={{ duration: 1, delay: animationDelay / 1000, ease: "easeOut" }}
          />
          
          {/* Benchmark indicator */}
          {benchmark !== 100 && (
            <circle
              cx="50%"
              cy="50%"
              r="38"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray="2 4"
              className="text-gray-400"
            />
          )}
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.div 
            className={cn("font-semibold", sizeConfig.text, performanceColor.primary)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: (animationDelay + 500) / 1000,
              type: "spring" 
            }}
          >
            {Math.round(value)}%
          </motion.div>
          
          <motion.div 
            className={cn("font-medium text-gray-600", sizeConfig.subText)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: (animationDelay + 700) / 1000 
            }}
          >
            {label}
          </motion.div>
        </div>
        
        {/* Trend indicator */}
        {showTrend && (
          <motion.div 
            className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-sm border"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.3, 
              delay: (animationDelay + 1000) / 1000,
              type: "spring" 
            }}
          >
            {getTrendIcon()}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

interface MetricProgressProps {
  value: number
  max: number
  label: string
  color?: 'purple' | 'green' | 'blue' | 'yellow' | 'red'
  showValue?: boolean
  animationDelay?: number
  className?: string
}

export function MetricProgress({
  value,
  max,
  label,
  color = 'purple',
  showValue = true,
  animationDelay = 0,
  className
}: MetricProgressProps) {
  const [animatedValue, setAnimatedValue] = useState(0)
  const percentage = (value / max) * 100

  const colors = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(percentage)
    }, animationDelay)

    return () => clearTimeout(timer)
  }, [percentage, animationDelay])

  return (
    <motion.div
      className={cn("space-y-2", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: animationDelay / 1000 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && (
          <span className="text-sm text-gray-600">
            {value}/{max}
          </span>
        )}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={cn("h-2 rounded-full", colors[color])}
          initial={{ width: "0%" }}
          animate={{ width: `${animatedValue}%` }}
          transition={{ 
            duration: 1, 
            delay: animationDelay / 1000,
            ease: "easeOut" 
          }}
        />
      </div>
    </motion.div>
  )
}

interface MetricGridProps {
  metrics: Array<{
    value: number
    benchmark?: number
    label: string
    color?: 'purple' | 'green' | 'blue' | 'yellow' | 'red'
  }>
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function MetricGrid({ metrics, size = 'md', className }: MetricGridProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {metrics.map((metric, index) => (
        <MetricRing
          key={index}
          value={metric.value}
          benchmark={metric.benchmark}
          label={metric.label}
          color={metric.color}
          size={size}
          animationDelay={index * 200}
        />
      ))}
    </div>
  )
}