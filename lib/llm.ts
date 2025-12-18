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
      return ''
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
        return ''
      }
      
      const data = await response.json()
      
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.trim()
      }
      
      return ''
      
    } catch (error) {
      return ''
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