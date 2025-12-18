import { NextResponse } from 'next/server'
import { systemState, logActivity } from '@/lib/state'

export async function POST() {
  systemState.advanced_mode = !systemState.advanced_mode
  const mode = systemState.advanced_mode ? "Advanced DQN" : "Simple DQN"
  
  logActivity('mode_toggle', `Switched to ${mode}`)
  
  return NextResponse.json({ 
    success: true, 
    mode, 
    advanced: systemState.advanced_mode,
    features: {
      neural_network: systemState.advanced_mode,
      replay_buffer: systemState.advanced_mode,
      target_network: systemState.advanced_mode,
      epsilon_greedy: true
    }
  })
}