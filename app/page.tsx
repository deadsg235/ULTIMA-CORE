'use client'

import { useState, useEffect, useRef } from 'react'

export default function UltimaTerminal() {
  const [messages, setMessages] = useState<string[]>(['ULTIMA AI INITIALIZED...', 'System Status: ACTIVE', 'DQN Core: LOADED', 'Ready for interaction.'])
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
      
      // Typewriter effect
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
      }, 30)
      
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
      setMessages(prev => [...prev, `Mode switched: ${data.mode || 'Simple DQN'}`])
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
      { role: 'assistant', content: 'Hello! I am ULTIMA AI.' },
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
      setMessages(prev => [...prev, `DQN Training: ${data.message}`])
      if (data.stats) {
        setMessages(prev => [...prev, `Buffer: ${data.stats.bufferSize}, Epsilon: ${data.stats.epsilon.toFixed(3)}`])
      }
      
    } catch (error) {
      setMessages(prev => [...prev, 'DQN training failed'])
    }
  }

  return (
    <div className="container">
      <div className="main-terminal">
        <div className="header">
          <h1>🚀 ULTIMA AI</h1>
          <p>Self-Referencing AI Terminal</p>
          <span className="status-indicator"></span> ACTIVE
        </div>
        
        <div className="controls">
          <button className="btn" onClick={upgradePrompt}>Upgrade</button>
          <button className="btn" onClick={toggleMode}>Advanced Mode</button>
          <button className="btn" onClick={createTool}>Create Tool</button>
          <button className="btn" onClick={trainDQN}>Train DQN</button>
          <button className="btn" onClick={() => setMessages([])}>Clear</button>
        </div>
        
        <div className="terminal-output" ref={outputRef}>
          {messages.map((msg, i) => (
            <div key={i} className="message">{msg}</div>
          ))}
        </div>
        
        <div className="input-area">
          <input
            type="text"
            className="input-field"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Enter your message..."
          />
          <button className="btn" onClick={sendMessage}>Send</button>
        </div>
      </div>
      
      <div className="sidebar">
        <div className="sidebar-section">
          <h3>📊 System Status</h3>
          <div>Mode: {status.advanced_mode ? 'Advanced' : 'Simple'} DQN</div>
          <div>Tools: {status.tools_count || 0}</div>
          <div>Logs: {status.logs_count || 0}</div>
        </div>
        
        <div className="sidebar-section">
          <h3>📝 Activity Logs</h3>
          {logs.map((log, i) => (
            <div key={i} className="log-entry">
              {log.timestamp?.split('T')[1]?.split('.')[0]} - {log.action}
            </div>
          ))}
        </div>
        
        <div className="sidebar-section">
          <h3>🛠️ Created Tools</h3>
          {tools.map((tool, i) => (
            <div key={i} className="tool-entry">
              {tool.name} - {tool.created?.split('T')[0]}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .container {
          display: flex;
          height: 100vh;
          background: linear-gradient(135deg, #0a0a0a, #1a0a0a);
          color: #ff0000;
          font-family: 'Courier New', monospace;
          position: relative;
        }
        
        .container::before {
          content: '';
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 0, 0, 0.03) 2px,
            rgba(255, 0, 0, 0.03) 4px
          );
          pointer-events: none;
          z-index: 1000;
        }
        
        .main-terminal {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border-right: 2px solid #ff0000;
        }
        
        .sidebar {
          width: 300px;
          background: rgba(10, 0, 0, 0.8);
          padding: 15px;
          overflow-y: auto;
        }
        
        .header {
          text-align: center;
          margin-bottom: 20px;
          padding: 10px;
          border: 2px solid #ff0000;
          background: rgba(255, 0, 0, 0.1);
        }
        
        .header h1 {
          font-size: 24px;
          text-shadow: 0 0 10px #ff0000;
          animation: glow 2s ease-in-out infinite alternate;
        }
        
        @keyframes glow {
          from { text-shadow: 0 0 5px #ff0000; }
          to { text-shadow: 0 0 20px #ff0000, 0 0 30px #ff0000; }
        }
        
        .controls {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .terminal-output {
          flex: 1;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #ff0000;
          padding: 15px;
          overflow-y: auto;
          margin-bottom: 15px;
          font-size: 14px;
          line-height: 1.4;
        }
        
        .input-area {
          display: flex;
          gap: 10px;
        }
        
        .input-field {
          flex: 1;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid #ff0000;
          color: #ff0000;
          padding: 10px;
          font-family: inherit;
          font-size: 14px;
        }
        
        .input-field:focus {
          outline: none;
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
        }
        
        .btn {
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid #ff0000;
          color: #ff0000;
          padding: 10px 15px;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.3s;
        }
        
        .btn:hover {
          background: rgba(255, 0, 0, 0.4);
          box-shadow: 0 0 15px rgba(255, 0, 0, 0.6);
        }
        
        .sidebar-section {
          margin-bottom: 20px;
          border: 1px solid #ff0000;
          padding: 10px;
          background: rgba(0, 0, 0, 0.5);
        }
        
        .sidebar-section h3 {
          margin-bottom: 10px;
          text-align: center;
          font-size: 16px;
        }
        
        .log-entry, .tool-entry {
          font-size: 12px;
          margin-bottom: 5px;
          padding: 5px;
          background: rgba(255, 0, 0, 0.1);
          border-left: 2px solid #ff0000;
        }
        
        .status-indicator {
          display: inline-block;
          width: 10px;
          height: 10px;
          background: #ff0000;
          border-radius: 50%;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}