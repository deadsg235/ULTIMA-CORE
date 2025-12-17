import { NextRequest, NextResponse } from 'next/server'
import { systemState, logActivity } from '@/lib/state'

export async function POST(request: NextRequest) {
  const { prompt } = await request.json()
  
  if (prompt) {
    systemState.prompt = prompt
    logActivity('upgrade', `System prompt updated: ${prompt.slice(0, 50)}...`)
    return NextResponse.json({ success: true, message: 'Prompt updated' })
  }
  
  return NextResponse.json({ success: false, message: 'Invalid prompt' })
}