'use client'

import { useState, useEffect, useRef } from 'react'

export default function UltimaTerminal() {
  const [messages, setMessages] = useState<string[]>(['ULTIMA INITIALIZED', 'System Status: ACTIVE', 'DQN Core: LOADED', 'Mode: SIMPLE DQN', 'Ready for interaction'])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<any>({})
  const [logs, setLogs] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    updateSidebar()
    const interval = setInterval(updateSidebar, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateSidebar = async () => {
    try {
      const [statusRes, logsRes, toolsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/logs'),
        fetch('/api/tools')
      ])
      setStatus(await statusRes.json())
      setLogs(await logsRes.json())
      setTools(await toolsRes.json())
    } catch (error) {
      console.error('Sidebar update failed:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    
    const userMessage = `> ${input}`
    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })
      const data = await response.json()
      
      let i = 0
      const text = data.response
      const typeInterval = setInterval(() => {
        setMessages(prev => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1] = text.substring(0, i)
          return newMessages
        })
        i++
        if (i > text.length) clearInterval(typeInterval)
      }, 20)
      
      setMessages(prev => [...prev, ''])
    } catch (error) {
      setMessages(prev => [...prev, 'Error: Connection failed'])
    }
  }

  const upgradePrompt = async () => {
    const newPrompt = prompt('Enter new system prompt:')
    if (!newPrompt) return

    try {
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: newPrompt })
      })
      const data = await response.json()
      setMessages(prev => [...prev, `System upgraded: ${data.message}`])
    } catch (error) {
      setMessages(prev => [...prev, 'Upgrade failed'])
    }
  }

  const toggleMode = async () => {
    try {
      const response = await fetch('/api/toggle-mode', { method: 'POST' })
      const data = await response.json()
      const modeDisplay = data.advanced ? 'ADVANCED DQN' : 'SIMPLE DQN'
      setMessages(prev => [...prev, `Mode switched to: ${modeDisplay}`])
      setMessages(prev => [...prev, `Neural Network: ${data.advanced ? 'ACTIVE' : 'INACTIVE'}`])
      setMessages(prev => [...prev, `Replay Buffer: ${data.advanced ? 'ENABLED' : 'DISABLED'}`])
      updateSidebar()
    } catch (error) {
      setMessages(prev => [...prev, 'Mode toggle failed'])
    }
  }

  const createTool = async () => {
    const name = prompt('Tool name:')
    const code = prompt('Tool code:')
    
    if (!name || !code) return
    
    try {
      const response = await fetch('/api/create-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code })
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, `Tool created: ${data.message}`])
      updateSidebar()
      
    } catch (error) {
      setMessages(prev => [...prev, 'Tool creation failed'])
    }
  }

  const trainDQN = async () => {
    const trainingData = [
      { role: 'user', content: 'Hello ULTIMA' },
      { role: 'assistant', content: 'Hello! I am ULTIMA.' },
      { role: 'user', content: 'How are you?' },
      { role: 'assistant', content: 'I am functioning optimally and learning continuously.' }
    ]
    
    try {
      const response = await fetch('/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trainingData })
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, `Training: ${data.message}`])
      if (data.stats) {
        setMessages(prev => [...prev, `Buffer: ${data.stats.bufferSize}, Epsilon: ${data.stats.epsilon.toFixed(3)}`])
      }
      
    } catch (error) {
      setMessages(prev => [...prev, 'Training failed'])
    }
  }

  return (
    <div className="container">
      <div className="main-terminal">
        <div className="header">
          <h1>ULTIMA</h1>
          <div className="status-bar">
            <span className="status-dot"></span>
            <span>ACTIVE</span>
          </div>
        </div>
        
        <div className="controls">
          <button className="btn" onClick={upgradePrompt}>UPGRADE</button>
          <button className="btn" onClick={toggleMode}>
            {status.advanced_mode ? 'ADVANCED' : 'SIMPLE'}
          </button>
          <button className="btn" onClick={createTool}>TOOL</button>
          <button className="btn" onClick={trainDQN}>TRAIN</button>
          <button className="btn" onClick={() => setMessages([])}>CLEAR</button>
        </div>
        
        <div className="terminal-output" ref={outputRef}>
          {messages.map((msg, i) => (
            <div key={i} className="message">{msg}</div>
          ))}
        </div>
        
        <div className="input-area">
          <span className="prompt">$</span>
          <input
            type="text"
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </div>
      
      <div className="sidebar">
        <div className="sidebar-section">
          <h3>SYSTEM</h3>
          <div className="stat-line">MODE: {status.advanced_mode ? 'ADVANCED' : 'SIMPLE'}</div>
          <div className="stat-line">LLM: {status.llm_enabled ? 'ACTIVE' : 'LOCAL'}</div>
          <div className="stat-line">TOOLS: {status.tools_count || 0}</div>
          <div className="stat-line">LOGS: {status.logs_count || 0}</div>
        </div>
        
        <div className="sidebar-section">
          <h3>ACTIVITY</h3>
          <div className="log-container">
            {logs.map((log, i) => (
              <div key={i} className="log-entry">
                {log.timestamp?.split('T')[1]?.split('.')[0]} {log.action}
              </div>
            ))}
          </div>
        </div>
        
        <div className="sidebar-section">
          <h3>TOOLS</h3>
          <div className="tool-container">
            {tools.map((tool, i) => (
              <div key={i} className="tool-entry">
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .container {
          display: flex;
          height: 100vh;
          background: #000;
          color: #ff0000;
          font-family: 'Courier New', monospace;
        }
        
        .main-terminal {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #ff0000;
        }
        
        .sidebar {
          width: 280px;
          background: #000;
          padding: 20px;
          border-left: 1px solid #ff0000;
          overflow-y: auto;
        }
        
        .header {
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid #ff0000;
        }
        
        .header h1 {
          font-size: 32px;
          font-weight: 300;
          letter-spacing: 8px;
          margin-bottom: 8px;
        }
        
        .status-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          letter-spacing: 2px;
        }
        
        .status-dot {
          width: 8px;
          height: 8px;
          background: #ff0000;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .controls {
          display: flex;
          gap: 8px;
          margin-bottom: 15px;
        }
        
        .terminal-output {
          flex: 1;
          background: #000;
          border: 1px solid #ff0000;
          padding: 15px;
          overflow-y: auto;
          margin-bottom: 15px;
          font-size: 13px;
          line-height: 1.6;
        }
        
        .message {
          margin-bottom: 8px;
        }
        
        .input-area {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #ff0000;
          padding: 10px;
          background: #000;
        }
        
        .prompt {
          font-size: 16px;
          font-weight: bold;
        }
        
        .input-field {
          flex: 1;
          background: transparent;
          border: none;
          color: #ff0000;
          font-family: inherit;
          font-size: 14px;
          outline: none;
        }
        
        .btn {
          background: transparent;
          border: 1px solid #ff0000;
          color: #ff0000;
          padding: 8px 16px;
          cursor: pointer;
          font-family: inherit;
          font-size: 11px;
          letter-spacing: 1px;
          transition: all 0.2s;
          min-width: 80px;
        }
        
        .btn:hover {
          background: #ff0000;
          color: #000;
        }
        
        .btn:active {
          transform: scale(0.95);
        }
        
        .sidebar-section {
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 1px solid #ff0000;
        }
        
        .sidebar-section:last-child {
          border-bottom: none;
        }
        
        .sidebar-section h3 {
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }
        
        .stat-line {
          font-size: 11px;
          margin-bottom: 6px;
          letter-spacing: 1px;
        }
        
        .log-container, .tool-container {
          max-height: 150px;
          overflow-y: auto;
        }
        
        .log-entry, .tool-entry {
          font-size: 10px;
          margin-bottom: 4px;
          padding: 4px 0;
          letter-spacing: 0.5px;
          opacity: 0.8;
        }
        
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #ff0000;
        }
      `}</style>
    </div>
  )
}