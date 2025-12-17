import { NextRequest, NextResponse } from 'next/server'
import { DQNTrainer } from '@/lib/training'
import { logActivity } from '@/lib/state'

export async function POST(request: NextRequest) {
  const { trainingData } = await request.json()
  
  if (!trainingData || !Array.isArray(trainingData)) {
    return NextResponse.json({ success: false, message: 'Invalid training data' })
  }
  
  try {
    await DQNTrainer.loadTrainingData(trainingData)
    const stats = DQNTrainer.getTrainingStats()
    
    logActivity('training', `Trained on ${trainingData.length} samples`)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Training completed',
      stats
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Training failed' 
    })
  }
}

export async function GET() {
  const stats = DQNTrainer.getTrainingStats()
  return NextResponse.json(stats)
}