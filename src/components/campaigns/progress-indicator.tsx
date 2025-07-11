'use client'

import { cn } from '@/lib/utils'
import { 
  FileText, 
  FileEdit, 
  Users, 
  Wand2, 
  Send,
  Check
} from 'lucide-react'
import { motion } from 'framer-motion'

interface Step {
  number: number
  title: string
  icon: React.ElementType
  status: 'pending' | 'current' | 'completed'
}

interface ProgressIndicatorProps {
  currentStep: number
  onStepClick?: (step: number) => void
  completedSteps?: number[]
}

export function ProgressIndicator({ 
  currentStep, 
  onStepClick,
  completedSteps = []
}: ProgressIndicatorProps) {
  const steps: Step[] = [
    { 
      number: 1, 
      title: 'Select Template', 
      icon: FileText,
      status: currentStep === 1 ? 'current' : completedSteps.includes(1) ? 'completed' : 'pending'
    },
    { 
      number: 2, 
      title: 'Campaign Details', 
      icon: FileEdit,
      status: currentStep === 2 ? 'current' : completedSteps.includes(2) ? 'completed' : 'pending'
    },
    { 
      number: 3, 
      title: 'Select Customers', 
      icon: Users,
      status: currentStep === 3 ? 'current' : completedSteps.includes(3) ? 'completed' : 'pending'
    },
    { 
      number: 4, 
      title: 'Generate Content', 
      icon: Wand2,
      status: currentStep === 4 ? 'current' : completedSteps.includes(4) ? 'completed' : 'pending'
    },
    { 
      number: 5, 
      title: 'Preview & Send', 
      icon: Send,
      status: currentStep === 5 ? 'current' : completedSteps.includes(5) ? 'completed' : 'pending'
    }
  ]

  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-10 left-0 right-0 h-0.5 bg-gray-200">
          <motion.div 
            className="h-full bg-purple-600"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((Math.max(...completedSteps, 0)) / (steps.length - 1)) * 100}%` 
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = step.status === 'completed'
            const isCurrent = step.status === 'current'
            const isPending = step.status === 'pending'
            const isClickable = isCompleted && onStepClick

            return (
              <div
                key={step.number}
                className="flex flex-col items-center"
              >
                {/* Step Circle */}
                <motion.button
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  className={cn(
                    "relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300",
                    isCurrent && "bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-4 ring-purple-600/20",
                    isCompleted && "bg-green-500 text-white cursor-pointer hover:bg-green-600",
                    isPending && "bg-gray-200 text-gray-400",
                    !isClickable && "cursor-default"
                  )}
                  whileHover={isClickable ? { scale: 1.05 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-8 w-8" />
                  ) : (
                    <Icon className="h-8 w-8" />
                  )}
                  
                  {/* Current Step Pulse */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-purple-600"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>

                {/* Step Title */}
                <motion.div 
                  className="mt-3 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <p className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-purple-600",
                    isCompleted && "text-green-600",
                    isPending && "text-gray-400"
                  )}>
                    Step {step.number}
                  </p>
                  <p className={cn(
                    "text-xs mt-1",
                    isCurrent && "text-gray-700",
                    isCompleted && "text-gray-600",
                    isPending && "text-gray-400"
                  )}>
                    {step.title}
                  </p>
                </motion.div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}