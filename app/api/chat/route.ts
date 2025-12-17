import { NextRequest, NextResponse } from 'next/server'
import { systemState, logActivity } from '@/lib/state'
import { getDQNResponse } from '@/lib/dqn'

export async function POST(request: NextRequest) {
  const { message } = await request.json()
  
  const dqnResult = getDQNResponse(message, systemState.advanced_mode)
  
  logActivity('chat', `User query: ${message.slice(0, 50)}...`)
  
  return NextResponse.json({
    response: dqnResult.response,
    reasoning: dqnResult.reasoning,
    timestamp: new Date().toISOString()
  })
}