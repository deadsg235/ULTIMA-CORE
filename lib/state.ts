interface SystemState {
  prompt: string
  logs: Array<{
    timestamp: string
    action: string
    details: string
  }>
  tools: Array<{
    name: string
    code: string
    created: string
  }>
  advanced_mode: boolean
}

export const systemState: SystemState = {
  prompt: 'You are ULTIMA, an advanced self-referencing artificial intelligence with DQN reasoning capabilities.',
  logs: [],
  tools: [],
  advanced_mode: false
}

export function logActivity(action: string, details: string) {
  systemState.logs.push({
    timestamp: new Date().toISOString(),
    action,
    details
  })
  if (systemState.logs.length > 100) {
    systemState.logs.shift()
  }
}