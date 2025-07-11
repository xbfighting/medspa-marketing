import fs from 'fs'
import path from 'path'

interface ClaudeAPILog {
  timestamp: string
  endpoint: string
  model: string
  inputTokens?: number
  outputTokens?: number
  cost?: number
  requestData: any
  responseData?: any
  error?: string
  duration: number
}

const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'claude-api.log')

// Try to ensure log directory exists (but don't fail if we can't)
try {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
} catch (error) {
  console.warn('Unable to create log directory:', error)
}

export async function logClaudeAPICall(log: ClaudeAPILog) {
  try {
    // Format log entry as JSON with newline
    const logEntry = JSON.stringify(log) + '\n'
    
    // Append to log file
    await fs.promises.appendFile(LOG_FILE, logEntry, 'utf8')
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Claude API]', {
        endpoint: log.endpoint,
        duration: `${log.duration}ms`,
        cost: log.cost ? `$${log.cost.toFixed(4)}` : 'N/A',
        error: log.error
      })
    }
  } catch (error) {
    console.error('Failed to write Claude API log:', error)
  }
}

// Helper to calculate cost based on model and tokens
export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  // Claude pricing per 1M tokens
  const pricing: Record<string, { input: number, output: number }> = {
    'claude-3-opus-20240229': { input: 15, output: 75 },
    'claude-3-sonnet-20240229': { input: 3, output: 15 },
    'claude-3-haiku-20240307': { input: 0.25, output: 1.25 }
  }
  
  const modelPricing = pricing[model] || pricing['claude-3-haiku-20240307']
  
  return (inputTokens * modelPricing.input + outputTokens * modelPricing.output) / 1_000_000
}

// Helper to read logs (for potential analytics)
export async function readClaudeLogs(limit?: number): Promise<ClaudeAPILog[]> {
  try {
    const content = await fs.promises.readFile(LOG_FILE, 'utf8')
    const lines = content.trim().split('\n').filter(Boolean)
    const logs = lines.map(line => JSON.parse(line))
    
    if (limit) {
      return logs.slice(-limit)
    }
    
    return logs
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      return []
    }
    throw error
  }
}