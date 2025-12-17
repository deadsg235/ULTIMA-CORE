import { NextRequest, NextResponse } from 'next/server'
import { systemState, logActivity } from '@/lib/state'
import { getDQNResponse } from '@/lib/dqn'
import { generateGroqResponse } from '@/lib/groq'

export async function POST(request: NextRequest) {
  const { message } = await request.json()
  
  const dqnResult = getDQNResponse(message, systemState.advanced_mode)
  
  // Generate natural language response using Groq
  const groqResponse = await generateGroqResponse(
    message,
    systemState.prompt,
    dqnResult.reasoning
  )
  
  const finalResponse = `[ULTIMA AI - ${systemState.advanced_mode ? 'Advanced' : 'Simple'} DQN Mode]\n\nDQN Analysis: ${dqnResult.reasoning}\n\n${groqResponse}`
  
  logActivity('chat', `User query: ${message.slice(0, 50)}...`)
  
  return NextResponse.json({
    response: finalResponse,
    reasoning: dqnResult.reasoning,
    timestamp: new Date().toISOString()
  })
}