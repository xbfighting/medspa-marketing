'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  replaceVariables, 
  extractVariables, 
  findVariable, 
  samplePersonalizationData 
} from '@/lib/personalization'
import { 
  Eye, 
  EyeOff, 
  User, 
  Info,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface HighlightedContentProps {
  content: string
  variables?: Record<string, string>
  showPreview?: boolean
  className?: string
  onVariableClick?: (variableKey: string) => void
}

export function HighlightedContent({
  content,
  variables = samplePersonalizationData,
  showPreview = false,
  className,
  onVariableClick
}: HighlightedContentProps) {
  const [previewMode, setPreviewMode] = useState(showPreview)
  
  const extractedVariables = extractVariables(content)
  const invalidVariables = extractedVariables.filter(key => !findVariable(key))

  const renderWithHighlights = (text: string) => {
    // Replace variables with highlighted spans
    const highlightedText = text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const variable = findVariable(key)
      const value = variables[key] || match
      const isValid = !!variable
      
      if (previewMode) {
        return `<span class="inline-flex items-center font-medium text-purple-800" title="Variable: ${key}">${value}</span>`
      }
      
      return `<span 
        class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium cursor-pointer transition-all duration-200 ${
          isValid 
            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200' 
            : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-200'
        }" 
        title="${isValid ? `${variable?.label}: ${value}` : `Unknown variable: ${key}`}"
        data-variable="${key}"
        onclick="handleVariableClick('${key}')"
      >
        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zm2 2V5h1v1h-1zM13 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3zm2 2v-1h1v1h-1z" clip-rule="evenodd"></path>
        </svg>
        ${previewMode ? value : key}
      </span>`
    })

    return highlightedText
  }

  const handleElementClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const variableElement = target.closest('[data-variable]') as HTMLElement
    
    if (variableElement && onVariableClick) {
      const variableKey = variableElement.getAttribute('data-variable')
      if (variableKey) {
        onVariableClick(variableKey)
      }
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {extractedVariables.length} variable{extractedVariables.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {invalidVariables.length > 0 && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              {invalidVariables.length} invalid
            </Badge>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreviewMode(!previewMode)}
          className="text-xs"
        >
          {previewMode ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Show Variables
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Preview Mode
            </>
          )}
        </Button>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="prose prose-sm max-w-none"
        onClick={handleElementClick}
        dangerouslySetInnerHTML={{ __html: renderWithHighlights(content) }}
      />

      {/* Variable Summary */}
      {extractedVariables.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Variables Used</span>
          </div>
          
          <div className="space-y-2">
            {extractedVariables.map((key) => {
              const variable = findVariable(key)
              const value = variables[key]
              const isValid = !!variable
              
              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-center justify-between p-2 rounded border text-xs",
                    isValid 
                      ? "bg-white border-purple-200" 
                      : "bg-red-50 border-red-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <code className="px-1.5 py-0.5 bg-gray-100 rounded font-mono">
                      {`{{${key}}}`}
                    </code>
                    {isValid && (
                      <span className="text-gray-600">{variable.label}</span>
                    )}
                    {!isValid && (
                      <span className="text-red-600 font-medium">Unknown variable</span>
                    )}
                  </div>
                  
                  <div className="text-right">
                    {isValid && value ? (
                      <span className="font-medium text-purple-700">{value}</span>
                    ) : isValid ? (
                      <span className="text-gray-400">No value</span>
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface VariablePreviewProps {
  content: string
  variables?: Record<string, string>
  className?: string
}

export function VariablePreview({
  content,
  variables = samplePersonalizationData,
  className
}: VariablePreviewProps) {
  const processedContent = replaceVariables(content, variables)
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Preview</span>
        <Badge variant="outline" className="text-xs">
          Sample Data
        </Badge>
      </div>
      
      <div className="bg-white border rounded-lg p-4">
        <div 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </div>
  )
}

interface VariableBadgeProps {
  variableKey: string
  value?: string
  onClick?: () => void
  className?: string
}

export function VariableBadge({
  variableKey,
  value,
  onClick,
  className
}: VariableBadgeProps) {
  const variable = findVariable(variableKey)
  const isValid = !!variable
  
  return (
    <motion.span
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium cursor-pointer transition-all duration-200",
        isValid 
          ? "bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-200" 
          : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isValid ? `${variable.label}: ${value || 'No value'}` : `Unknown variable: ${variableKey}`}
    >
      <User className="w-3 h-3 mr-1" />
      {variableKey}
      {value && isValid && (
        <>
          <span className="mx-1 text-purple-400">→</span>
          <span className="font-semibold">{value}</span>
        </>
      )}
    </motion.span>
  )
}