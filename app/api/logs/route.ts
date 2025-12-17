import { NextResponse } from 'next/server'
import { systemState } from '@/lib/state'

export async function GET() {
  return NextResponse.json(systemState.logs.slice(-10))
}