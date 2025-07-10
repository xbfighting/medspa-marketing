# UI Polish & Email Editor - Complete Implementation Plan

## Overview

分阶段实施UI优化和邮件编辑器增强，采用小步快跑的方式，每个阶段都可独立验证。

## Phase 0: Quick UI Fixes (立即可做) ⚡

### Goal

修复基础交互问题，提升整体体验

### Implementation

**1. 全局鼠标样式修复**

```css
/* app/globals.css */
/* 所有可点击元素 */
button, a, [role="button"], .clickable {
  cursor: pointer;
}

/* 不可点击但可交互的元素 */
.card-hover, .hoverable {
  cursor: default;
}

/* 禁用状态 */
button:disabled, a:disabled, .disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 拖拽元素 */
.draggable {
  cursor: move;
}

.draggable:active {
  cursor: grabbing;
}
```

**2. 创建统一的交互卡片组件**

```tsx
// components/ui/interactive-card.tsx
import { cn } from "@/lib/utils"

interface InteractiveCardProps {
  children: React.ReactNode
  clickable?: boolean
  href?: string
  onClick?: () => void
  className?: string
}

export function InteractiveCard({
  children,
  clickable = false,
  href,
  onClick,
  className
}: InteractiveCardProps) {
  const baseClasses = "bg-white rounded-lg border border-gray-200 p-6 transition-all duration-200"

  const hoverClasses = clickable
    ? "hover:shadow-lg hover:scale-[1.01] hover:border-purple-300 cursor-pointer"
    : "hover:shadow-md cursor-default"

  const Component = href ? 'a' : 'div'

  return (
    <Component
      href={href}
      className={cn(baseClasses, hoverClasses, className)}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </Component>
  )
}
```

**3. 优化导航激活状态**

```tsx
// components/layout/nav-item.tsx
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavItem({
  icon: Icon,
  label,
  href
}: {
  icon: any
  label: string
  href: string
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center px-3 py-2 rounded-lg transition-all duration-200 relative",
        isActive
          ? "bg-purple-500 text-white shadow-md scale-105"
          : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
      )}>
        {isActive && (
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 rounded-r" />
        )}
        <Icon className={cn("mr-3 h-5 w-5", isActive && "text-white")} />
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  )
}
```

**4. 批量更新现有卡片组件**

```tsx
// 替换所有客户卡片、活动卡片等
// 从：
<Card>...</Card>

// 到：
<InteractiveCard clickable onClick={() => router.push(`/customers/${id}`)}>
  ...
</InteractiveCard>
```

### Verification Checklist

- [ ] 所有可点击元素显示pointer光标
- [ ] 卡片hover效果分层明显
- [ ] 导航激活状态醒目
- [ ] 禁用状态视觉反馈正确

**Commit**: "fix: improve cursor styles and interactive states"

---

## Phase 1: Email Editor Foundation 📝

### Goal

升级基础邮件编辑器，支持富文本编辑

### Implementation

**1. 安装依赖**

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/extension-highlight @tiptap/extension-link
```

**2. 创建增强的编辑器**

```tsx
// components/campaigns/email-editor.tsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'

export function EmailEditor({
  content,
  onChange,
  placeholder = "Start writing your personalized email..."
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder,
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px]'
      }
    }
  })

  if (!editor) return null

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Enhanced Toolbar */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1">
          {/* Text formatting */}
          <div className="flex gap-1 pr-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold"
            >
              <Bold className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic"
            >
              <Italic className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive('highlight')}
              title="Highlight"
            >
              <Highlighter className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Headers */}
          <div className="flex gap-1 pr-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              H1
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              H2
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 pr-2 border-r">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="h-4 w-4" />
            </ToolbarButton>
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
            >
              <Undo className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
            >
              <Redo className="h-4 w-4" />
            </ToolbarButton>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// Toolbar button component
function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-2 rounded hover:bg-gray-200 transition-colors",
        active && "bg-purple-100 text-purple-700"
      )}
      title={title}
    >
      {children}
    </button>
  )
}
```

### Verification Checklist

- [ ] 编辑器加载成功
- [ ] 工具栏所有功能正常
- [ ] 内容保存正确
- [ ] 样式显示美观

**Commit**: "feat: upgrade to TipTap rich text editor"

---

## Phase 2: Enhanced Email Preview 👁️

### Goal

创建专业的邮件预览体验

### Implementation

**1. 创建设备预览组件**

```tsx
// components/campaigns/email-preview.tsx
import { useState } from 'react'
import { Monitor, Smartphone, Moon, Sun } from 'lucide-react'

export function EmailPreview({
  subject,
  content,
  fromName = "MedSpa Clinic",
  recipientName = "Sarah Johnson",
  recipientEmail = "sarah@example.com"
}) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')
  const [darkMode, setDarkMode] = useState(false)

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
          >
            <Monitor className="mr-2 h-4 w-4" />
            Desktop
          </Button>
          <Button
            variant={device === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevice('mobile')}
          >
            <Smartphone className="mr-2 h-4 w-4" />
            Mobile
          </Button>
        </div>

        {/* Dark Mode Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      {/* Preview Container */}
      <div className="bg-gray-100 rounded-lg p-6">
        <div className={cn(
          "mx-auto bg-white rounded-lg shadow-xl transition-all duration-300 overflow-hidden",
          device === 'desktop' ? 'max-w-3xl' : 'max-w-sm'
        )}>
          {/* Email Client Header */}
          <div className="bg-gray-50 border-b px-4 py-3">
            {/* Window Controls */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-gray-500">MedSpa Email</span>
            </div>

            {/* Email Meta */}
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-16">From:</span>
                <span className="font-medium">{fromName}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-16">To:</span>
                <span>{recipientName} &lt;{recipientEmail}&gt;</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-500 w-16">Subject:</span>
                <span className="font-medium">{subject}</span>
              </div>
            </div>
          </div>

          {/* Email Content */}
          <div
            className={cn(
              "p-6 email-content",
              darkMode && "dark bg-gray-900"
            )}
          >
            <div
              className={cn(
                "prose prose-sm max-w-none",
                darkMode && "prose-invert"
              )}
              dangerouslySetInnerHTML={{ __html: formatEmailContent(content) }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Format and enhance email content
function formatEmailContent(content: string) {
  // Add email-specific styling
  let formatted = content

  // Wrap in email-safe container
  formatted = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
      ${formatted}
    </div>
  `

  return formatted
}
```

**2. 添加邮件特定样式**

```css
/* app/globals.css */
/* Email content styles */
.email-content {
  font-size: 14px;
  line-height: 1.6;
}

.email-content h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0;
}

.email-content h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 14px 0;
}

.email-content p {
  margin: 12px 0;
}

.email-content a {
  color: #8b5cf6;
  text-decoration: underline;
}

.email-content ul, .email-content ol {
  margin: 12px 0;
  padding-left: 24px;
}

/* Dark mode support */
.dark .email-content {
  color: #e5e7eb;
}

.dark .email-content a {
  color: #a78bfa;
}
```

### Verification Checklist

- [ ] 设备切换流畅
- [ ] 深色模式正常工作
- [ ] 邮件头信息显示正确
- [ ] 内容格式美观

**Commit**: "feat: add professional email preview with device frames"

---

## Phase 3: AI Generation Enhancement ✨

### Goal

增强AI生成体验，添加动画和多选项

### Implementation

**1. 创建AI生成按钮动画**

```tsx
// components/campaigns/ai-generate-button.tsx
import { useState } from 'react'
import { Sparkles, Loader2, Check } from 'lucide-react'

export function AIGenerateButton({ onGenerate }) {
  const [status, setStatus] = useState<'idle' | 'generating' | 'success'>('idle')

  const handleClick = async () => {
    setStatus('generating')

    // Call generation function
    await onGenerate()

    // Show success briefly
    setStatus('success')
    setTimeout(() => setStatus('idle'), 2000)
  }

  return (
    <Button
      onClick={handleClick}
      disabled={status === 'generating'}
      className={cn(
        "w-full transition-all duration-300 transform",
        status === 'idle' && "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-105 shadow-lg",
        status === 'generating' && "bg-gradient-to-r from-purple-400 to-pink-400",
        status === 'success' && "bg-green-500 hover:bg-green-600"
      )}
    >
      {status === 'idle' && (
        <>
          <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
          Generate with AI
        </>
      )}
      {status === 'generating' && (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          AI is crafting your message...
        </>
      )}
      {status === 'success' && (
        <>
          <Check className="mr-2 h-5 w-5" />
          Content Generated!
        </>
      )}
    </Button>
  )
}
```

**2. 添加打字机效果**

```tsx
// components/ui/typewriter.tsx
import { useState, useEffect } from 'react'

export function TypewriterText({
  text,
  speed = 30,
  onComplete
}: {
  text: string
  speed?: number
  onComplete?: () => void
}) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else {
      onComplete?.()
    }
  }, [currentIndex, text, speed, onComplete])

  return <span>{displayText}</span>
}
```

**3. 创建成功动画**

```tsx
// components/ui/success-animation.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

export function SuccessAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-full p-8 shadow-2xl"
          >
            <CheckCircle className="h-24 w-24 text-green-500" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Verification Checklist

- [ ] AI按钮动画流畅
- [ ] 打字机效果自然
- [ ] 成功反馈明显
- [ ] 整体体验提升

**Commit**: "feat: enhance AI generation with animations"

---

## Phase 4: Personalization Variables 🎯

### Goal

实现智能的个性化变量系统

### Implementation

**1. 定义变量系统**

```tsx
// lib/personalization.ts
export const personalVariables = {
  customer: {
    label: 'Customer Information',
    icon: User,
    variables: [
      { key: 'firstName', label: 'First Name', example: 'Sarah' },
      { key: 'lastName', label: 'Last Name', example: 'Johnson' },
      { key: 'fullName', label: 'Full Name', example: 'Sarah Johnson' },
      { key: 'email', label: 'Email', example: 'sarah@example.com' },
      { key: 'phone', label: 'Phone', example: '(310) 555-0123' },
    ]
  },
  treatment: {
    label: 'Treatment History',
    icon: Activity,
    variables: [
      { key: 'lastProcedure', label: 'Last Procedure', example: 'Botox' },
      { key: 'lastVisitDate', label: 'Last Visit', example: '3 months ago' },
      { key: 'totalVisits', label: 'Total Visits', example: '12' },
      { key: 'favoriteService', label: 'Favorite Service', example: 'Facial' },
      { key: 'nextMaintenance', label: 'Next Maintenance', example: 'March 15' },
    ]
  },
  offer: {
    label: 'Special Offers',
    icon: Tag,
    variables: [
      { key: 'discountPercent', label: 'Discount %', example: '20%' },
      { key: 'discountAmount', label: 'Discount $', example: '$50' },
      { key: 'offerCode', label: 'Offer Code', example: 'SPRING20' },
      { key: 'expiryDate', label: 'Expires', example: 'March 31' },
    ]
  }
}
```

**2. 创建变量插入面板**

```tsx
// components/campaigns/variable-panel.tsx
export function VariablePanel({ onInsert }) {
  const [search, setSearch] = useState('')

  return (
    <div className="w-64 bg-gray-50 border-l p-4 h-full overflow-y-auto">
      <h3 className="font-medium mb-3">Personalization</h3>

      {/* Search */}
      <Input
        placeholder="Search variables..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      {/* Variable Categories */}
      <div className="space-y-4">
        {Object.entries(personalVariables).map(([category, data]) => (
          <div key={category}>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-2">
              <data.icon className="h-4 w-4" />
              {data.label}
            </div>

            <div className="space-y-1">
              {data.variables
                .filter(v => v.label.toLowerCase().includes(search.toLowerCase()))
                .map(variable => (
                  <button
                    key={variable.key}
                    onClick={() => onInsert(`{{${variable.key}}}`)}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-white hover:shadow-sm transition-all group"
                  >
                    <div className="flex justify-between items-center">
                      <span>{variable.label}</span>
                      <span className="text-xs text-gray-400 group-hover:text-purple-600">
                        {variable.example}
                      </span>
                    </div>
                  </button>
                ))
              }
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**3. 高亮显示变量**

```tsx
// components/campaigns/highlighted-content.tsx
export function HighlightedContent({ content, variables }) {
  const renderWithHighlights = (text: string) => {
    // Replace variables with highlighted spans
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = variables[key] || match
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800" title="${key}">${value}</span>`
    })
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderWithHighlights(content) }}
    />
  )
}
```

### Verification Checklist

- [ ] 变量面板显示正确
- [ ] 点击插入功能正常
- [ ] 变量高亮显示美观
- [ ] 搜索过滤有效

**Commit**: "feat: add personalization variables system"

---

## Phase 5: Final Polish ✨

### Goal

添加剩余的专业功能和优化

### Implementation

**1. 快捷键系统**

```tsx
// hooks/use-shortcuts.ts
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K - Quick search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        // Open search modal
      }

      // Cmd/Ctrl + N - New campaign
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        router.push('/campaigns/create')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])
}
```

**2. 数据可视化增强**

```tsx
// components/ui/metric-ring.tsx
export function MetricRing({
  value,
  benchmark,
  label
}: {
  value: number
  benchmark: number
  label: string
}) {
  const percentage = (value / benchmark) * 100
  const isAboveBenchmark = value > benchmark

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${percentage * 2.26} 226`}
          className={cn(
            "transition-all duration-1000",
            isAboveBenchmark ? "text-green-500" : "text-yellow-500"
          )}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-semibold">{value}%</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}
```

**3. 空状态组件**

```tsx
// components/ui/empty-state.tsx
export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: any
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}) {
  return (
    <div className="text-center py-12">
      <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
```

### Verification Checklist

- [ ] 快捷键功能正常
- [ ] 数据可视化美观
- [ ] 空状态体验良好
- [ ] 整体打磨完成

**Commit**: "feat: add final polish with shortcuts and visualizations"

---

## Implementation Timeline

```
Week 1:
├── Phase 0: Quick UI Fixes (Day 1) ✅
├── Phase 1: Email Editor Foundation (Day 2-3)
└── Phase 2: Enhanced Email Preview (Day 4-5)

Week 2:
├── Phase 3: AI Generation Enhancement (Day 1-2)
├── Phase 4: Personalization Variables (Day 3-4)
└── Phase 5: Final Polish (Day 5)
```

## Success Metrics

1. **UI响应性**: 所有交互反馈 < 100ms
2. **编辑体验**: 支持所有常见富文本操作
3. **预览准确性**: 100%还原真实邮件效果
4. **AI生成质量**: 个性化变量使用率 > 80%
5. **用户满意度**: 操作流畅，视觉愉悦

## Notes

- 每个阶段独立可验证
- 优先级从高到低排列
- 可根据反馈调整后续阶段
- 保持代码质量和性能
