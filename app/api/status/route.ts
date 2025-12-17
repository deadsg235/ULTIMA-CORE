import { NextResponse } from 'next/server'
import { systemState } from '@/lib/state'

export async function GET() {
  return NextResponse.json({
    mode: 'nextjs',
    system_prompt: systemState.prompt,
    logs_count: systemState.logs.length,
    tools_count: systemState.tools.length,
    advanced_mode: systemState.advanced_mode
  })
}