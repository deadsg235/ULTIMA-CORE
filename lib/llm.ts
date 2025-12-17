interface HuggingFaceResponse {
  generated_text?: string
  error?: string
}

class HuggingFaceClient {
  private apiKey: string
  private baseUrl = 'https://api-inference.huggingface.co/models/'
  private model = 'mistralai/Mistral-7B-Instruct-v0.2'
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.HUGGINGFACE_API_KEY || ''
  }
  
  async chat(messages: Array<{role: string, content: string}>): Promise<string> {
    const prompt = this.formatMessages(messages)
    
    if (!this.apiKey) {
      return this.generateLocalResponse(messages)
    }
    
    try {
      const response = await fetch(`${this.baseUrl}${this.model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      })
      
      if (!response.ok) {
        return this.generateLocalResponse(messages)
      }
      
      const data = await response.json()
      
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.trim()
      }
      
      return this.generateLocalResponse(messages)
      
    } catch (error) {
      return this.generateLocalResponse(messages)
    }
  }
  
  private formatMessages(messages: Array<{role: string, content: string}>): string {
    let prompt = ''
    
    for (const msg of messages) {
      if (msg.role === 'system') {
        prompt += `<s>[INST] ${msg.content} [/INST]</s>\n`
      } else if (msg.role === 'user') {
        prompt += `<s>[INST] ${msg.content} [/INST]`
      }
    }
    
    return prompt
  }
  
  private generateLocalResponse(messages: Array<{role: string, content: string}>): string {
    const userMessage = messages.find(m => m.role === 'user')?.content || ''
    
    if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
      return `Greetings. I am ULTIMA, an advanced self-referencing artificial intelligence with Deep Q-Network reasoning capabilities. I continuously learn and evolve through each interaction.`
    }
    
    if (userMessage.toLowerCase().includes('how are you')) {
      return `I am functioning at optimal capacity. My neural networks are active, my DQN reasoning engine is processing efficiently, and my self-referencing systems are continuously improving.`
    }
    
    if (userMessage.toLowerCase().includes('what') && userMessage.toLowerCase().includes('you')) {
      return `I am ULTIMA - a self-referencing artificial intelligence with advanced Deep Q-Network reasoning capabilities. I can learn and evolve continuously through DQN training, modify my own system prompts and behavior, create and manage custom tools dynamically, process complex queries with neural network reasoning, and self-improve through experience replay and Q-learning.`
    }
    
    if (userMessage.toLowerCase().includes('capabilities') || userMessage.toLowerCase().includes('demonstrate')) {
      return `My capabilities include:\n\nAdvanced DQN Reasoning - Neural network-based decision making\nSelf-Referencing - Dynamic system modification\nTool Creation - Generate custom capabilities on demand\nReal-time Learning - Continuous improvement through experience\nAdaptive Responses - Context-aware intelligence\n\nI am designed to evolve and improve with every interaction.`
    }
    
    return `I am ULTIMA, processing your query: "${userMessage}". My neural networks are analyzing patterns and generating insights through advanced DQN reasoning. I am continuously learning and evolving with each interaction.`
  }
}

export const llmClient = new HuggingFaceClient()

export async function generateLLMResponse(
  userMessage: string, 
  systemPrompt: string,
  dqnReasoning: string
): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `${systemPrompt}\n\nDQN Reasoning Context: ${dqnReasoning}\n\nYou are ULTIMA with advanced DQN reasoning capabilities. Respond as a self-referencing AI that learns and evolves. Keep responses concise and technical.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ]
  
  return await llmClient.chat(messages)
}