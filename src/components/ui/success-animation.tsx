'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'

interface SuccessAnimationProps {
  type?: 'check' | 'sparkles' | 'celebration' | 'crown'
  size?: 'sm' | 'md' | 'lg'
  duration?: number
  onComplete?: () => void
  className?: string
}

export function SuccessAnimation({
  type = 'check',
  size = 'md',
  duration = 2000,
  onComplete,
  className = ''
}: SuccessAnimationProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const iconSize = sizeClasses[size]

  const renderIcon = () => {
    switch (type) {
      case 'check':
        return <Check className={iconSize} />
      case 'sparkles':
        return <Sparkles className={iconSize} />
      case 'celebration':
        return <Zap className={iconSize} />
      case 'crown':
        return <Crown className={iconSize} />
      default:
        return <Check className={iconSize} />
    }
  }

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        duration: duration / 1000
      }}
      onAnimationComplete={onComplete}
    >
      {/* Background circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-500 opacity-20"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ 
          duration: 0.6,
          times: [0, 0.8, 1],
          ease: "easeOut"
        }}
      />

      {/* Main icon */}
      <motion.div
        className="relative z-10 text-green-600"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 12,
          delay: 0.2
        }}
      >
        {renderIcon()}
      </motion.div>

      {/* Sparkle particles */}
      {type === 'celebration' && (
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              initial={{ 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60]
              }}
              transition={{
                duration: 1,
                delay: 0.5 + (i * 0.1),
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-green-400"
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ 
          duration: 1,
          delay: 0.3,
          ease: "easeOut"
        }}
      />
    </motion.div>
  )
}

interface SuccessMessageProps {
  message: string
  subMessage?: string
  showAnimation?: boolean
  animationType?: 'check' | 'sparkles' | 'celebration' | 'crown'
  onComplete?: () => void
  className?: string
}

export function SuccessMessage({
  message,
  subMessage,
  showAnimation = true,
  animationType = 'check',
  onComplete,
  className = ''
}: SuccessMessageProps) {
  return (
    <motion.div
      className={`flex flex-col items-center text-center p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {showAnimation && (
        <SuccessAnimation
          type={animationType}
          size="lg"
          onComplete={onComplete}
          className="mb-4"
        />
      )}
      
      <motion.h3
        className="text-lg font-semibold text-green-800 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {message}
      </motion.h3>
      
      {subMessage && (
        <motion.p
          className="text-sm text-green-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {subMessage}
        </motion.p>
      )}
    </motion.div>
  )
}

interface SuccessToastProps {
  message: string
  visible: boolean
  onClose: () => void
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export function SuccessToast({
  message,
  visible,
  onClose,
  duration = 3000,
  position = 'top-right'
}: SuccessToastProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  return (
    <motion.div
      className={`fixed ${positionClasses[position]} z-50 max-w-sm`}
      initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 100 : -100 }}
      animate={{ 
        opacity: visible ? 1 : 0, 
        scale: visible ? 1 : 0.8,
        x: visible ? 0 : (position.includes('right') ? 100 : -100)
      }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onAnimationComplete={() => {
        if (visible) {
          setTimeout(onClose, duration)
        }
      }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-green-200 p-4 flex items-center gap-3">
        <SuccessAnimation
          type="check"
          size="sm"
          duration={1000}
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-green-600 hover:text-green-800 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  )
}