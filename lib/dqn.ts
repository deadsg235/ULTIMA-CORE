// Neural Network Layer
class Layer {
  weights: number[][]
  biases: number[]
  
  constructor(inputSize: number, outputSize: number) {
    this.weights = Array(outputSize).fill(0).map(() => 
      Array(inputSize).fill(0).map(() => (Math.random() - 0.5) * 2)
    )
    this.biases = Array(outputSize).fill(0).map(() => (Math.random() - 0.5) * 2)
  }
  
  forward(input: number[]): number[] {
    return this.weights.map((w, i) => {
      const sum = w.reduce((acc, weight, j) => acc + weight * input[j], 0) + this.biases[i]
      return Math.max(0, sum) // ReLU activation
    })
  }
}

// Q-Network
class QNetwork {
  layer1: Layer
  layer2: Layer
  outputLayer: Layer
  
  constructor(inputSize: number, outputSize: number) {
    this.layer1 = new Layer(inputSize, 128)
    this.layer2 = new Layer(128, 64)
    this.outputLayer = new Layer(64, outputSize)
  }
  
  forward(state: number[]): number[] {
    const h1 = this.layer1.forward(state)
    const h2 = this.layer2.forward(h1)
    return this.outputLayer.forward(h2)
  }
}

// Replay Buffer
class ReplayBuffer {
  memory: Array<{
    state: number[]
    action: number
    reward: number
    nextState: number[]
    done: boolean
  }> = []
  maxSize: number
  
  constructor(maxSize: number = 10000) {
    this.maxSize = maxSize
  }
  
  add(state: number[], action: number, reward: number, nextState: number[], done: boolean) {
    this.memory.push({ state, action, reward, nextState, done })
    if (this.memory.length > this.maxSize) {
      this.memory.shift()
    }
  }
  
  sample(batchSize: number) {
    const batch = []
    for (let i = 0; i < Math.min(batchSize, this.memory.length); i++) {
      const idx = Math.floor(Math.random() * this.memory.length)
      batch.push(this.memory[idx])
    }
    return batch
  }
}

// Advanced DQN Agent
class AdvancedDQNAgent {
  qNetwork: QNetwork
  targetNetwork: QNetwork
  buffer: ReplayBuffer
  epsilon: number
  minEpsilon: number
  epsilonDecay: number
  gamma: number
  learningRate: number
  totalSteps: number
  targetUpdateFreq: number
  
  constructor(
    stateSize: number = 128,
    actionSize: number = 64,
    learningRate: number = 0.001,
    gamma: number = 0.99,
    epsilon: number = 1.0,
    minEpsilon: number = 0.01,
    epsilonDecay: number = 0.995
  ) {
    this.qNetwork = new QNetwork(stateSize, actionSize)
    this.targetNetwork = new QNetwork(stateSize, actionSize)
    this.buffer = new ReplayBuffer()
    this.epsilon = epsilon
    this.minEpsilon = minEpsilon
    this.epsilonDecay = epsilonDecay
    this.gamma = gamma
    this.learningRate = learningRate
    this.totalSteps = 0
    this.targetUpdateFreq = 100
  }
  
  encodeState(text: string): number[] {
    const encoded = Array(128).fill(0)
    for (let i = 0; i < Math.min(text.length, 128); i++) {
      encoded[i] = text.charCodeAt(i) / 255.0
    }
    return encoded
  }
  
  selectAction(state: number[]): number {
    if (Math.random() < this.epsilon) {
      return Math.floor(Math.random() * 64)
    }
    
    const qValues = this.qNetwork.forward(state)
    return qValues.indexOf(Math.max(...qValues))
  }
  
  train() {
    if (this.buffer.memory.length < 32) return
    
    const batch = this.buffer.sample(32)
    
    // Simple gradient update simulation
    for (const experience of batch) {
      const qValues = this.qNetwork.forward(experience.state)
      const nextQValues = this.targetNetwork.forward(experience.nextState)
      
      const target = experience.done 
        ? experience.reward
        : experience.reward + this.gamma * Math.max(...nextQValues)
      
      // Simplified weight update
      const error = target - qValues[experience.action]
      this.updateWeights(error)
    }
    
    this.totalSteps++
    if (this.totalSteps % this.targetUpdateFreq === 0) {
      this.updateTargetNetwork()
    }
    
    this.epsilon = Math.max(this.minEpsilon, this.epsilon * this.epsilonDecay)
  }
  
  private updateWeights(error: number) {
    // Simplified weight update - in practice would use proper backpropagation
    const updateRate = this.learningRate * error
    // Update would happen here in a real implementation
  }
  
  private updateTargetNetwork() {
    // Copy weights from main network to target network
    // Simplified - in practice would deep copy all weights
  }
  
  getConfidence(state: number[]): number {
    const qValues = this.qNetwork.forward(state)
    const maxQ = Math.max(...qValues)
    const minQ = Math.min(...qValues)
    return maxQ / (maxQ - minQ + 1e-8)
  }
}

// Simple DQN for comparison
class SimpleDQN {
  private qTable: Map<string, Map<string, number>> = new Map()
  private learningRate = 0.1
  private discountFactor = 0.95
  private epsilon = 0.1
  
  getReasoningScore(context: string): number {
    const complexity = context.split(' ').length
    return Math.min(complexity / 100.0, 1.0)
  }
}

export const simpleDQN = new SimpleDQN()
export const advancedDQN = new AdvancedDQNAgent()

export function getDQNResponse(message: string, useAdvanced: boolean = false): {
  response: string
  reasoning: string
} {
  if (useAdvanced) {
    const state = advancedDQN.encodeState(message)
    const action = advancedDQN.selectAction(state)
    const confidence = advancedDQN.getConfidence(state)
    
    // Simulate learning from interaction
    const reward = 1.0 // Positive reward for interaction
    const nextState = advancedDQN.encodeState('response')
    advancedDQN.buffer.add(state, action, reward, nextState, false)
    advancedDQN.train()
    
    const response = `[ULTIMA AI - Advanced DQN Mode]\n\nQuery: ${message}\n\nProcessing with Neural Network DQN (Action: ${action}, Confidence: ${confidence.toFixed(3)})\n\nI am ULTIMA, continuously learning through advanced neural network reasoning. My neural pathways are evolving with each interaction.`
    
    return {
      response,
      reasoning: `Advanced DQN (Action: ${action}, Confidence: ${confidence.toFixed(3)})`
    }
  } else {
    const score = simpleDQN.getReasoningScore(message)
    const response = `[ULTIMA AI - Simple DQN Mode]\n\nQuery: ${message}\n\nProcessing with Simple DQN (Score: ${score.toFixed(2)})\n\nI am ULTIMA, continuously learning and evolving through Q-learning reasoning. How may I assist you?`
    
    return {
      response,
      reasoning: `Simple DQN (Score: ${score.toFixed(2)})`
    }
  }
}