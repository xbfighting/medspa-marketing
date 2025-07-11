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

export async function logClaudeAPICall(log: ClaudeAPILog) {
  // Create a safe log object without sensitive data
  const safeLog = {
    timestamp: log.timestamp,
    endpoint: log.endpoint,
    model: log.model,
    inputTokens: log.inputTokens,
    outputTokens: log.outputTokens,
    cost: log.cost ? `$${log.cost.toFixed(4)}` : undefined,
    duration: `${log.duration}ms`,
    error: log.error,
    // Only include safe parts of request data
    requestType: log.requestData?.campaignType,
    strategy: log.requestData?.strategy?.name,
    // Safely indicate if response was successful
    responseSuccess: !log.error && !!log.responseData
  }

  // Log to console
  console.log('[Claude API]', safeLog)
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

