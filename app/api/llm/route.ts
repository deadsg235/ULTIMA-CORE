import { NextRequest, NextResponse } from 'next/server'
import { llmClient } from '@/lib/llm'
import { logActivity } from '@/lib/state'

export async function POST(request: NextRequest) {
  const { messages } = await request.json()
  
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
  }
  
  try {
    const response = await llmClient.chat(messages)
    
    logActivity('llm_api', 'Generated response using Mistral-7B')
    
    return NextResponse.json({ 
      response,
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to generate response' 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    provider: 'Hugging Face Inference API',
    status: 'Free LLM integration active',
    enabled: !!process.env.HUGGINGFACE_API_KEY
  })
}