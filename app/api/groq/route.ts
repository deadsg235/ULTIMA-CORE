import { NextRequest, NextResponse } from 'next/server'
import { groqClient } from '@/lib/groq'
import { logActivity } from '@/lib/state'

export async function POST(request: NextRequest) {
  const { messages, model } = await request.json()
  
  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 })
  }
  
  try {
    const response = await groqClient.chat(messages, model)
    
    logActivity('groq_api', `Generated response using ${model || 'default'} model`)
    
    return NextResponse.json({ 
      response,
      model: model || 'llama3-8b-8192',
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
    available_models: [
      'llama3-8b-8192',
      'llama3-70b-8192',
      'mixtral-8x7b-32768',
      'gemma-7b-it'
    ],
    status: 'Groq API integration active'
  })
}