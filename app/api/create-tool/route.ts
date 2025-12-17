import { NextRequest, NextResponse } from 'next/server'
import { systemState, logActivity } from '@/lib/state'

export async function POST(request: NextRequest) {
  const { name, code } = await request.json()
  
  if (name && code) {
    systemState.tools.push({
      name,
      code,
      created: new Date().toISOString()
    })
    
    logActivity('tool_creation', `Created tool: ${name}`)
    
    return NextResponse.json({ 
      success: true, 
      message: `Tool ${name} created` 
    })
  }
  
  return NextResponse.json({ 
    success: false, 
    message: 'Invalid tool data' 
  })
}