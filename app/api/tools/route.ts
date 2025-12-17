import { NextResponse } from 'next/server'
import { systemState } from '@/lib/state'

export async function GET() {
  return NextResponse.json(systemState.tools)
}

export async function POST(request: Request) {
  const { name, code } = await request.json()
  
  if (name && code) {
    systemState.tools.push({
      name,
      code,
      created: new Date().toISOString()
    })
    return NextResponse.json({ success: true, message: `Tool ${name} created` })
  }
  
  return NextResponse.json({ success: false, message: 'Invalid tool data' })
}