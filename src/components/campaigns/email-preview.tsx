'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Monitor, 
  Smartphone, 
  Moon, 
  Sun, 
  Mail,
  Star,
  MoreHorizontal,
  Reply,
  Forward,
  Archive
} from 'lucide-react'

interface EmailPreviewProps {
  subject: string
  content: string
  fromName?: string
  fromEmail?: string
  recipientName?: string
  recipientEmail?: string
  previewText?: string
}

export function EmailPreview({
  subject,
  content,
  fromName = "MedSpa Clinic",
  fromEmail = "hello@medspaclinic.com",
  recipientName = "Sarah Johnson",
  recipientEmail = "sarah@example.com",
  previewText = ""
}: EmailPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [darkMode, setDarkMode] = useState(false)

  const formatEmailContent = (content: string) => {
    // Add email-safe styling
    const formatted = `
      <div style="
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        line-height: 1.6; 
        color: ${darkMode ? '#e5e7eb' : '#333333'};
        max-width: 600px;
        margin: 0 auto;
        background-color: ${darkMode ? '#1f2937' : '#ffffff'};
        padding: 0;
      ">
        ${content}
      </div>
    `
    return formatted
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Device Selector */}
        <div className="flex gap-2">
          <Button
            variant={device === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('desktop')}
            className="flex items-center gap-2"
          >
            <Monitor className="h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={device === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('mobile')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Mobile
          </Button>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2"
        >
          {darkMode ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
      </div>

      {/* Preview Container */}
      <div className={cn(
        "p-6 rounded-lg transition-colors duration-300",
        darkMode ? "bg-gray-800" : "bg-gray-100"
      )}>
        <div className={cn(
          "mx-auto bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden",
          device === 'desktop' ? 'max-w-4xl' : 'max-w-sm',
          darkMode && "bg-gray-900"
        )}>
          {/* Email Client Header */}
          <div className={cn(
            "border-b px-4 py-3 transition-colors",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
          )}>
            {/* Window Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn(
                  "text-xs font-medium",
                  darkMode ? "text-gray-300" : "text-gray-600"
                )}>
                  Gmail
                </span>
                <Mail className={cn(
                  "h-4 w-4",
                  darkMode ? "text-gray-400" : "text-gray-500"
                )} />
              </div>
            </div>

            {/* Email Header Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {fromName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium text-sm",
                      darkMode ? "text-gray-200" : "text-gray-900"
                    )}>
                      {fromName}
                    </div>
                    <div className={cn(
                      "text-xs",
                      darkMode ? "text-gray-400" : "text-gray-500"
                    )}>
                      {fromEmail}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Star className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className={cn(
                "text-sm",
                darkMode ? "text-gray-300" : "text-gray-600"
              )}>
                to {recipientName} &lt;{recipientEmail}&gt;
              </div>

              <div>
                <div className={cn(
                  "font-medium text-base mb-1",
                  darkMode ? "text-gray-100" : "text-gray-900"
                )}>
                  {subject}
                </div>
                {previewText && (
                  <div className={cn(
                    "text-sm",
                    darkMode ? "text-gray-400" : "text-gray-600"
                  )}>
                    {previewText}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div className={cn(
            "transition-colors duration-300",
            darkMode ? "bg-gray-900" : "bg-white"
          )}>
            <div className="p-6">
              <div
                className={cn(
                  "prose prose-sm max-w-none email-content",
                  darkMode && "prose-invert"
                )}
                dangerouslySetInnerHTML={{ __html: formatEmailContent(content) }}
              />
            </div>
          </div>

          {/* Email Actions Footer */}
          <div className={cn(
            "border-t px-4 py-3 flex items-center justify-between",
            darkMode ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"
          )}>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Reply className="h-3 w-3" />
                Reply
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Forward className="h-3 w-3" />
                Forward
              </Button>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Archive className="h-3 w-3" />
              Archive
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className={cn(
        "text-xs p-3 rounded border text-center",
        darkMode ? "bg-gray-800 border-gray-700 text-gray-400" : "bg-blue-50 border-blue-200 text-blue-700"
      )}>
        💡 This is how your email will appear in {device} Gmail clients. 
        {device === 'mobile' && ' Mobile view automatically adjusts layout and font sizes.'}
      </div>
    </div>
  )
}