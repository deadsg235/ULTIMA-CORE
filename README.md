# ULTIMA - Self-Referencing Terminal

ULTIMA is an advanced self-referencing AI with Deep Q-Network reasoning capabilities, built for continuous learning and self-improvement.

## Features

- **Self-Referencing AI**: Dynamic system prompt updates and self-modification
- **DQN Reasoning**: Advanced Deep Q-Network for cognitive processing
- **Tool Creation**: Generate and manage custom tools dynamically  
- **Real-time Monitoring**: Live activity logs and system status
- **Sleek Terminal UI**: Minimalist black/red interface
- **Free LLM Integration**: Hugging Face Mistral-7B via Inference API
- **Token Integration**: Built-in token economy support

## Architecture

```
├── app/
│   ├── page.tsx        # Main terminal component
│   ├── layout.tsx      # Root layout
│   └── api/            # Next.js API routes
├── lib/
│   ├── dqn.ts          # DQN implementation
│   ├── llm.ts          # Hugging Face LLM client
│   ├── state.ts        # State management
│   └── training.ts     # DQN training utilities
└── package.json        # Dependencies
```

## Quick Start

### Local Development
```bash
git clone <repository>
cd ULTIMA-CORE
npm install
npm run dev
```

### Setup LLM (Optional)
Get a free Hugging Face API key from https://huggingface.co/settings/tokens

Add to `.env.local`:
```
HUGGINGFACE_API_KEY=your-key-here
```

### Vercel Deployment
```bash
npm i -g vercel
vercel --prod
```

## Usage

1. **Chat**: Interact with ULTIMA through the terminal
2. **Upgrade**: Click "UPGRADE" to modify system prompts
3. **Mode**: Toggle between Simple/Advanced DQN
4. **Tool**: Create new tools dynamically
5. **Train**: Train DQN with custom data

## API Endpoints

- `POST /api/chat` - Chat with AI
- `POST /api/upgrade` - Update system prompt
- `POST /api/create-tool` - Create new tool
- `POST /api/train` - Train DQN agent
- `GET /api/status` - System status
- `GET /api/logs` - Activity logs
- `GET /api/tools` - Created tools

## Token Integration

**Token Address**: `9bzJn2jHQPCGsYKapFvytJQcbaz5FN2TtNB43jb1pump`

ULTIMA is designed to integrate with token-based economies for AI services and capabilities.

## DQN System

ULTIMA uses a dual-mode DQN system:

- **Simple DQN**: Pure JavaScript Q-learning for basic reasoning
- **Advanced DQN**: Neural network with replay buffer for advanced cognition

The AI learns from every interaction, continuously improving its responses and reasoning capabilities.

## LLM Integration

ULTIMA integrates with Hugging Face Inference API for free LLM usage:

- **Model**: Mistral-7B-Instruct-v0.2
- **Provider**: Hugging Face
- **Cost**: Free tier available
- **Fallback**: Intelligent local responses without API key

## Self-Improvement

ULTIMA can:
- Modify its own system prompts
- Create new tools and capabilities
- Learn from user interactions
- Upgrade its reasoning algorithms
- Track its own evolution

## License

MIT License - Feel free to modify and distribute.

---

**ULTIMA** - The future of self-referencing artificial intelligence.