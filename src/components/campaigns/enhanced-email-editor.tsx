'use client'

import { useState } from 'react'
import { EmailEditor } from './email-editor'
import { VariablePanel } from './variable-panel'
import { HighlightedContent, VariablePreview } from './highlighted-content'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { 
  PanelRight, 
  PanelRightClose, 
  Eye, 
  Code2, 
  FileText,
  Sparkles
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnhancedEmailEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  showVariablePanel?: boolean
  variables?: Record<string, string>
}

export function EnhancedEmailEditor({
  content,
  onChange,
  placeholder = "Start writing your personalized email...",
  className,
  showVariablePanel = true,
  variables
}: EnhancedEmailEditorProps) {
  const [panelOpen, setPanelOpen] = useState(showVariablePanel)
  const [activeTab, setActiveTab] = useState('editor')

  const handleVariableInsert = (variable: string) => {
    // Insert variable at cursor position or append to content
    const newContent = content + variable
    onChange(newContent)
  }

  const insertVariableAtCursor = (variable: string) => {
    // Get the current cursor position if editor is focused
    // For now, we'll append to the end of content
    const currentContent = content || ''
    const newContent = currentContent + (currentContent ? ' ' : '') + variable
    onChange(newContent)
  }

  return (
    <div className={cn("flex h-full bg-white border rounded-lg overflow-hidden", className)}>
      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b bg-gray-50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">Email Editor</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="editor" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs">
                  <Code2 className="h-3 w-3 mr-1" />
                  Code
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {showVariablePanel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPanelOpen(!panelOpen)}
                className="text-xs"
              >
                {panelOpen ? (
                  <>
                    <PanelRightClose className="h-3 w-3 mr-1" />
                    Hide Panel
                  </>
                ) : (
                  <>
                    <PanelRight className="h-3 w-3 mr-1" />
                    Variables
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} className="h-full">
            <TabsContent value="editor" className="h-full m-0">
              <EmailEditor
                content={content}
                onChange={onChange}
                placeholder={placeholder}
                className="border-0 rounded-none h-full"
              />
            </TabsContent>
            
            <TabsContent value="preview" className="h-full m-0 overflow-auto">
              <div className="p-6">
                <VariablePreview
                  content={content}
                  variables={variables}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="code" className="h-full m-0 overflow-auto">
              <div className="p-6">
                <HighlightedContent
                  content={content}
                  variables={variables}
                  onVariableClick={(key) => {
                    console.log('Variable clicked:', key)
                    // Could open variable details or edit modal
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Variable Panel */}
      <AnimatePresence>
        {panelOpen && showVariablePanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-l bg-gray-50 overflow-hidden"
          >
            <VariablePanel
              onInsert={insertVariableAtCursor}
              className="w-full border-0"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface EmailEditorWithVariablesProps {
  subject: string
  content: string
  previewText?: string
  onSubjectChange: (subject: string) => void
  onContentChange: (content: string) => void
  onPreviewTextChange?: (previewText: string) => void
  variables?: Record<string, string>
  className?: string
}

export function EmailEditorWithVariables({
  subject,
  content,
  previewText,
  onSubjectChange,
  onContentChange,
  onPreviewTextChange,
  variables,
  className
}: EmailEditorWithVariablesProps) {
  const [panelOpen, setPanelOpen] = useState(false)
  const [activeField, setActiveField] = useState<'subject' | 'preview' | 'content'>('content')

  const handleVariableInsert = (variable: string) => {
    switch (activeField) {
      case 'subject':
        onSubjectChange(subject + variable)
        break
      case 'preview':
        if (onPreviewTextChange) {
          onPreviewTextChange((previewText || '') + variable)
        }
        break
      case 'content':
        onContentChange(content + variable)
        break
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Subject Line */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Subject Line</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            onFocus={() => setActiveField('subject')}
            placeholder="Enter email subject..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPanelOpen(!panelOpen)}
            className="shrink-0"
          >
            {panelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>
        </div>
        {subject && (
          <div className="mt-2">
            <HighlightedContent 
              content={subject} 
              variables={variables}
              className="text-sm"
            />
          </div>
        )}
      </div>

      {/* Preview Text */}
      {onPreviewTextChange && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Preview Text</label>
          <input
            type="text"
            value={previewText || ''}
            onChange={(e) => onPreviewTextChange(e.target.value)}
            onFocus={() => setActiveField('preview')}
            placeholder="Enter preview text..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          {previewText && (
            <div className="mt-2">
              <HighlightedContent 
                content={previewText} 
                variables={variables}
                className="text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Main Editor with Variable Panel */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 block">Email Content</label>
        
        <div className="flex gap-4 h-96">
          <div 
            className="flex-1 min-w-0"
            onClick={() => setActiveField('content')}
          >
            <EnhancedEmailEditor
              content={content}
              onChange={onContentChange}
              variables={variables}
              showVariablePanel={false}
              className="h-full"
            />
          </div>

          {/* Variable Panel */}
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="shrink-0 overflow-hidden"
              >
                <VariablePanel
                  onInsert={handleVariableInsert}
                  className="h-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}