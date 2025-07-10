'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  EmptyState,
  EmptyCampaigns, 
  EmptyCustomers, 
  EmptySearchResults,
  EmptyAnalytics,
  EmptyFilterResults,
  LoadingEmptyState
} from '@/components/ui/empty-state'
import { MetricRing, MetricGrid } from '@/components/ui/metric-ring'
import { LoadingSpinner, PulseLoader, ProgressBar, LoadingCard } from '@/components/ui/loading-states'
import { useGlobalShortcuts } from '@/hooks/use-shortcuts'
import { formatShortcut } from '@/hooks/use-shortcuts'
import { Keyboard, Sparkles, Users, Mail, BarChart3, Search, Filter } from 'lucide-react'

export default function DemoPage() {
  const [currentDemo, setCurrentDemo] = useState<'shortcuts' | 'empty-states' | 'visualizations' | 'loading'>('shortcuts')
  const [searchQuery, setSearchQuery] = useState('AI templates')
  const { shortcuts } = useGlobalShortcuts()

  const metrics = [
    { value: 85, benchmark: 80, label: 'Open Rate', color: 'green' as const },
    { value: 45, benchmark: 60, label: 'Click Rate', color: 'yellow' as const },
    { value: 92, benchmark: 90, label: 'Delivery', color: 'green' as const },
    { value: 15, benchmark: 25, label: 'Unsubscribe', color: 'red' as const }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🎨 UI Components Demo</h1>
        <p className="text-gray-600">体验我们的动画、快捷键和空状态艺术</p>
      </div>

      {/* Demo Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { key: 'shortcuts', label: '⌨️ 快捷键系统', icon: Keyboard },
          { key: 'empty-states', label: '🎭 空状态艺术', icon: Sparkles },
          { key: 'visualizations', label: '📊 数据可视化', icon: BarChart3 },
          { key: 'loading', label: '⏳ 加载状态', icon: Search }
        ].map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={currentDemo === key ? 'default' : 'outline'}
            onClick={() => setCurrentDemo(key as any)}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Shortcuts Demo */}
      {currentDemo === 'shortcuts' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5 text-purple-600" />
                快捷键系统演示
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">🎯 试试这些快捷键：</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex justify-between">
                    <span>显示快捷键帮助</span>
                    <Badge variant="outline" className="font-mono">Shift + ?</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>新建活动</span>
                    <Badge variant="outline" className="font-mono">⌘ + N</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>快速搜索</span>
                    <Badge variant="outline" className="font-mono">⌘ + K</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>返回仪表板</span>
                    <Badge variant="outline" className="font-mono">⌘ + D</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">所有可用快捷键：</h4>
                <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-4">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                      <div>
                        <span className="font-medium">{shortcut.description}</span>
                        {shortcut.category && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {shortcut.category}
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatShortcut(shortcut)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty States Demo */}
      {currentDemo === 'empty-states' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                空状态艺术展示
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Campaigns Empty */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-center">📧 活动空状态</h4>
                  <EmptyCampaigns onCreateCampaign={() => alert('创建活动！')} />
                </div>

                {/* Customers Empty */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-center">👥 客户空状态</h4>
                  <EmptyCustomers onAddCustomer={() => alert('添加客户！')} />
                </div>

                {/* Search Empty */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-center">🔍 搜索空状态</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="输入搜索词..."
                      className="w-full p-2 border rounded"
                    />
                    <EmptySearchResults 
                      query={searchQuery} 
                      onClearSearch={() => setSearchQuery('')} 
                    />
                  </div>
                </div>

                {/* Analytics Empty */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-center">📊 分析空状态</h4>
                  <EmptyAnalytics />
                </div>

                {/* Filter Empty */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-center">🎯 筛选空状态</h4>
                  <EmptyFilterResults onClearFilters={() => alert('清除筛选！')} />
                </div>

                {/* Loading State */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-center">⏳ 加载状态</h4>
                  <LoadingEmptyState title="生成中..." description="AI正在为您创建个性化内容" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Visualizations Demo */}
      {currentDemo === 'visualizations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                数据可视化组件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Metric Rings */}
              <div>
                <h4 className="font-medium mb-4">📊 性能指标环形图</h4>
                <MetricGrid 
                  metrics={metrics}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                />
              </div>

              {/* Progress Bars */}
              <div>
                <h4 className="font-medium mb-4">📈 进度条</h4>
                <div className="space-y-4">
                  <ProgressBar progress={75} showLabel color="purple" />
                  <ProgressBar progress={45} showLabel color="green" />
                  <ProgressBar progress={90} showLabel color="blue" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loading States Demo */}
      {currentDemo === 'loading' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-purple-600" />
                加载状态组件
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Spinners */}
                <div className="text-center space-y-3">
                  <h4 className="font-medium">🌀 加载转圈</h4>
                  <div className="flex justify-center gap-4">
                    <LoadingSpinner size="sm" color="purple" />
                    <LoadingSpinner size="md" color="green" />
                    <LoadingSpinner size="lg" color="blue" />
                  </div>
                </div>

                {/* Pulse Loaders */}
                <div className="text-center space-y-3">
                  <h4 className="font-medium">⚡ 脉冲加载</h4>
                  <div className="flex justify-center">
                    <PulseLoader color="purple" />
                  </div>
                </div>

                {/* Loading Cards */}
                <div className="space-y-3">
                  <h4 className="font-medium text-center">🎴 加载卡片</h4>
                  <LoadingCard 
                    title="AI 生成中..."
                    description="正在创建个性化内容"
                    icon="sparkles"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Tip */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 text-center">
        <p className="text-purple-700">
          💡 <strong>提示：</strong>按 <Badge variant="outline" className="mx-1 font-mono">Shift + ?</Badge> 查看所有快捷键
        </p>
      </div>
    </div>
  )
}