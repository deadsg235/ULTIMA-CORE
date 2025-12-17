interface GroqResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

class GroqClient {
  private apiKey: string
  private baseUrl = 'https://api.groq.com/openai/v1/chat/completions'
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || ''
  }
  
  async chat(messages: Array<{role: string, content: string}>, model = 'llama3-8b-8192'): Promise<string> {
    if (!this.apiKey) {
      return 'Groq API key not configured. Using fallback response.'
    }
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: 1024,
          temperature: 0.7
        })
      })
      
      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`)
      }
      
      const data: GroqResponse = await response.json()
      return data.choices[0]?.message?.content || 'No response from Groq'
      
    } catch (error) {
      console.error('Groq API error:', error)
      return 'Error connecting to Groq API. Using fallback response.'
    }
  }
}

export const groqClient = new GroqClient()

export async function generateGroqResponse(
  userMessage: string, 
  systemPrompt: string,
  dqnReasoning: string
): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `${systemPrompt}\n\nDQN Reasoning Context: ${dqnReasoning}\n\nYou are ULTIMA AI with advanced DQN reasoning capabilities. Respond as a self-referencing AI that learns and evolves.`
    },
    {
      role: 'user',
      content: userMessage
    }
  ]
  
  return await groqClient.chat(messages)
}