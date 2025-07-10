'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  personalVariables, 
  PersonalizationVariable, 
  samplePersonalizationData 
} from '@/lib/personalization'
import { 
  Search, 
  Plus, 
  Eye, 
  EyeOff, 
  Copy,
  Check,
  Info
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface VariablePanelProps {
  onInsert: (variable: string) => void
  className?: string
  showPreview?: boolean
}

export function VariablePanel({ 
  onInsert, 
  className,
  showPreview = true 
}: VariablePanelProps) {
  const [search, setSearch] = useState('')
  const [showExamples, setShowExamples] = useState(true)
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null)

  const filteredCategories = Object.entries(personalVariables).map(([key, category]) => ({
    key,
    ...category,
    variables: category.variables.filter(variable =>
      variable.label.toLowerCase().includes(search.toLowerCase()) ||
      variable.key.toLowerCase().includes(search.toLowerCase()) ||
      variable.example.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(category => category.variables.length > 0)

  const handleInsert = (variableKey: string) => {
    onInsert(`{{${variableKey}}}`)
  }

  const handleCopy = async (variableKey: string) => {
    await navigator.clipboard.writeText(`{{${variableKey}}}`)
    setCopiedVariable(variableKey)
    setTimeout(() => setCopiedVariable(null), 2000)
  }

  const totalVariables = Object.values(personalVariables)
    .reduce((total, category) => total + category.variables.length, 0)

  const filteredCount = filteredCategories
    .reduce((total, category) => total + category.variables.length, 0)

  return (
    <div className={cn("w-80 bg-gray-50 border border-gray-200 rounded-lg flex flex-col h-full shadow-sm", className)}>
      {/* Header */}
      <div className="p-4 border-b bg-white rounded-t-lg shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Personalization</h3>
          <Badge variant="secondary" className="text-xs">
            {filteredCount} of {totalVariables}
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExamples(!showExamples)}
            className="text-xs"
          >
            {showExamples ? (
              <>
                <EyeOff className="h-3 w-3 mr-1" />
                Hide Examples
              </>
            ) : (
              <>
                <Eye className="h-3 w-3 mr-1" />
                Show Examples
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Variable Categories */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <AnimatePresence>
            {filteredCategories.map((category) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Category Header */}
                <div className="flex items-center gap-2">
                  <category.icon className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {category.label}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {category.variables.length}
                  </Badge>
                </div>

                {/* Variables */}
                <div className="space-y-2">
                  {category.variables.map((variable) => (
                    <VariableItem
                      key={variable.key}
                      variable={variable}
                      showExamples={showExamples}
                      onInsert={() => handleInsert(variable.key)}
                      onCopy={() => handleCopy(variable.key)}
                      isCopied={copiedVariable === variable.key}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No variables found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try different search terms
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {showPreview && (
        <div className="p-4 border-t bg-white rounded-b-lg shrink-0">
          <div className="flex items-start gap-2 text-xs text-gray-600">
            <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">How to use:</p>
              <p>Click any variable to insert it into your content. Variables will be automatically replaced with customer data when the campaign is sent.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface VariableItemProps {
  variable: PersonalizationVariable
  showExamples: boolean
  onInsert: () => void
  onCopy: () => void
  isCopied: boolean
}

function VariableItem({ 
  variable, 
  showExamples, 
  onInsert, 
  onCopy, 
  isCopied 
}: VariableItemProps) {
  return (
    <motion.div
      className="group bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onInsert}
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900 leading-tight">
                {variable.label}
              </span>
              <code className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-mono shrink-0">
                {`{{${variable.key}}}`}
              </code>
            </div>
            
            {variable.description && (
              <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                {variable.description}
              </p>
            )}
            
            {showExamples && (
              <div className="flex items-start gap-1 text-xs">
                <span className="text-gray-400 shrink-0">Example:</span>
                <span className="font-medium text-purple-700 break-words">
                  {samplePersonalizationData[variable.key] || variable.example}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onCopy()
              }}
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Copy variable"
            >
              {isCopied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onInsert()
              }}
              className="h-6 w-6 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              title="Insert variable"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}