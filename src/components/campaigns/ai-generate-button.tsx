'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Check, Wand2, Zap, Stars } from 'lucide-react'

interface AIGenerateButtonProps {
  onGenerate: () => Promise<void>
  disabled?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
}

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error'

export function AIGenerateButton({ 
  onGenerate, 
  disabled = false, 
  className,
  size = 'lg' 
}: AIGenerateButtonProps) {
  const [status, setStatus] = useState<GenerationStatus>('idle')

  const handleClick = async () => {
    if (status === 'generating' || disabled) return

    setStatus('generating')

    try {
      await onGenerate()
      setStatus('success')
      
      // Auto reset after success animation
      setTimeout(() => setStatus('idle'), 2500)
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const getButtonContent = () => {
    switch (status) {
      case 'idle':
        return (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.div>
            Generate with AI
          </motion.div>
        )

      case 'generating':
        return (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            >
              <Loader2 className="h-5 w-5" />
            </motion.div>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              AI is crafting your message...
            </motion.span>
          </motion.div>
        )

      case 'success':
        return (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Check className="h-5 w-5" />
            </motion.div>
            Content Generated!
          </motion.div>
        )

      case 'error':
        return (
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Zap className="h-5 w-5" />
            Try Again
          </motion.div>
        )
    }
  }

  const getButtonClassName = () => {
    const baseClasses = "relative overflow-hidden transition-all duration-300 font-medium"
    
    switch (status) {
      case 'idle':
        return cn(
          baseClasses,
          "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
          "shadow-lg hover:shadow-xl transform hover:scale-105",
          "text-white border-0"
        )

      case 'generating':
        return cn(
          baseClasses,
          "bg-gradient-to-r from-purple-400 to-pink-400",
          "shadow-md cursor-not-allowed",
          "text-white border-0"
        )

      case 'success':
        return cn(
          baseClasses,
          "bg-gradient-to-r from-green-500 to-emerald-500",
          "shadow-lg text-white border-0"
        )

      case 'error':
        return cn(
          baseClasses,
          "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600",
          "shadow-lg hover:shadow-xl",
          "text-white border-0"
        )
    }
  }

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={status === 'generating' || disabled}
        size={size}
        className={cn(getButtonClassName(), className)}
      >
        {/* Background particles animation for idle state */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  initial={{ 
                    x: Math.random() * 200,
                    y: Math.random() * 50,
                    opacity: 0
                  }}
                  animate={{ 
                    x: Math.random() * 200,
                    y: Math.random() * 50,
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <span className="relative z-10">
          {getButtonContent()}
        </span>

        {/* Success confetti effect */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#fbbf24', '#f59e0b', '#eab308', '#84cc16'][i % 4]
                  }}
                  initial={{ 
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    opacity: 1
                  }}
                  animate={{ 
                    x: `${50 + (Math.random() - 0.5) * 200}%`,
                    y: `${50 + (Math.random() - 0.5) * 200}%`,
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Status indicator */}
      <AnimatePresence>
        {status === 'generating' && (
          <motion.div
            className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1]
            }}
            exit={{ scale: 0 }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Stars className="h-3 w-3 text-yellow-800 m-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}