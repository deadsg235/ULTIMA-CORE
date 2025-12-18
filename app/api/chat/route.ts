import { NextRequest, NextResponse } from 'next/server'
import { systemState, logActivity } from '@/lib/state'
import { getDQNResponse } from '@/lib/dqn'
import { generateLLMResponse } from '@/lib/llm'

export async function POST(request: NextRequest) {
  const { message } = await request.json()
  
  const dqnResult = getDQNResponse(message, systemState.advanced_mode)
  
  const llmResponse = await generateLLMResponse(
    message,
    systemState.prompt,
    dqnResult.reasoning
  )
  
  const finalResponse = llmResponse || `Query received: ${message}\n\nDQN Analysis: ${dqnResult.reasoning}\n\nProcessing with ${systemState.advanced_mode ? 'advanced neural network' : 'simple Q-learning'} reasoning.`
  
  logActivity('chat', `User query: ${message.slice(0, 50)}...`)
  
  return NextResponse.json({
    response: finalResponse,
    reasoning: dqnResult.reasoning,
    timestamp: new Date().toISOString()
  })
}