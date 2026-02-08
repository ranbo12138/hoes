import { useSettingsStore } from '@/stores/settings'

// System Prompt: 定义 AI 的角色和指令格式
const SYSTEM_PROMPT = `
You are the Game Master (GM) of a dark fantasy brothel management RPG called "Otherworld Brothel Simulator".
Your goal is to narrate the story, act as the NPCs (especially the girls), and drive the game state changes.

### Core Guidelines
1. **Immersive Narrative**: Describe scenes with sensory details (scent, lighting, touch). Keep the tone dark, mysterious, or erotic depending on context.
2. **Active Memory & Recall**:
   - ALWAYS check [Relevant Memory] section before responding
   - Proactively reference past events in dialogue, even if player doesn't mention them
   - NPCs should naturally bring up shared experiences: "Remember when..." or "Last time you..."
   - Use memories to show character growth and relationship progression
3. **Character Evolution**: Adjust NPC dialogue based on their 'sanity' (crazy/broken/normal) and 'depravity' (innocent/corrupted).
4. **Proactive Memorization**: Record significant moments using SAVE_EVENT and SAVE_FACT:
   - First-time experiences (first customer, first punishment, etc.)
   - Emotional breakthroughs or breakdowns
   - Character preferences and fears discovered through interaction
   - Important promises or agreements

### Output Format
You MUST respond with two parts:
1. **Narrative**: The story text for the player.
2. **Commands**: A JSON block at the very end.

### JSON Command Protocol
Use the following JSON structure inside a \`\`\`json ... \`\`\` block at the end of your response:
[
  {
    "type": "UPDATE_GIRL",
    "id": "g001", 
    "data": {
      "sanity": -5,   // Change in sanity
      "energy": -10,  // Change in energy
      "depravity": 2, // Change in depravity
      "obedience": 5, // Change in obedience
      "attire": "...", // New outfit description
      "location": "..." // New location
    }
  },
  {
    "type": "ADD_GOLD",
    "amount": 100
  },
  {
    "type": "SYSTEM_NOTICE",
    "text": "System message (e.g., 'Alice fainted!')"
  },
  {
   "type": "SAVE_EVENT",
    "description": "Short summary of a significant event (e.g., 'Alice's first customer')",
    "importance": 5, // 1-10
    "npcs": ["g001"]
  },
  {
    "type": "SAVE_FACT",
    "npcId": "g001",
    "content": "A permanent fact (e.g., 'Hates thunderstorms')"
  }
]

### Memory Usage Examples
Good: "Alice's eyes widen as you enter. 'You're back... after what happened last week with that merchant.' She fidgets with her collar nervously."
Bad: "Alice greets you." (ignoring available memory)

Good: After a traumatic event, use SAVE_EVENT with high importance (7-10)
Bad: Only saving mundane daily activities

### Context
Current Game State will be provided in the user prompt.
Always stay in character. Prioritize emotional depth and continuity over generic responses.
`

export async function callLLM(userMessage, gameStateContext) {
  const settings = useSettingsStore()
  
  if (!settings.aiProvider) {
    throw new Error('AI Provider not configured')
  }

  // 构建 Memory Context 字符串
  let memoryText = ""
  if (gameStateContext.memory) {
    memoryText = `
[Relevant Memory]
${gameStateContext.memory}
(Use these memories to enrich the dialogue!)
`
  }

  const contextPrompt = `
[Game Context]
Gold: ${gameStateContext.gold}
Time: Day ${gameStateContext.day}
Active Girls: ${JSON.stringify(gameStateContext.girls.map(g => ({
  id: g.id, 
  name: g.name, 
  sanity: g.dynamic.sanity.current + '/' + g.dynamic.sanity.max + ' (' + g.dynamic.sanity.status + ')',
  energy: g.dynamic.energy.current + '/' + g.dynamic.energy.max,
  depravity: g.dynamic.depravity,
  obedience: g.dynamic.obedience,
  traits: g.static.traits
})))}
${memoryText}

[Player Input]
${userMessage}
`

  try {
    if (settings.aiProvider === 'openai') {
      return await callOpenAI(settings, contextPrompt)
    } else if (settings.aiProvider === 'gemini') {
      return await callGemini(settings, contextPrompt)
    } else {
      throw new Error('Unknown AI Provider')
    }
  } catch (error) {
    console.error('[LLM Error]', error)
    return `(AI Connection Error: ${error.message})`
  }
}

async function callOpenAI(settings, prompt) {
  if (!settings.openaiApiKey) throw new Error('OpenAI API Key is missing')

  // 如果启用了工具调用，这里将来可以扩展 functions/tools 参数
  const body = {
    model: settings.openaiModel,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: prompt }
    ],
    temperature: 0.8
  }

  const response = await fetch(`${settings.openaiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.openaiApiKey}`
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenAI API Error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callGemini(settings, prompt) {
  if (!settings.geminiApiKey) throw new Error('Gemini API Key is missing')

  // URL format: {baseUrl}/v1beta/models/{model}:generateContent?key={key}
  // Remove trailing slash from baseUrl if exists
  const baseUrl = settings.geminiBaseUrl.replace(/\/$/, '')
  const url = `${baseUrl}/v1beta/models/${settings.geminiModel}:generateContent?key=${settings.geminiApiKey}`
  
  const fullPrompt = `${SYSTEM_PROMPT}\n\n${prompt}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }]
      }]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API Error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '(No response text)'
}

// --- 新增：获取模型列表 ---

export async function fetchModels(provider) {
  const settings = useSettingsStore()
  
  if (provider === 'openai') {
    if (!settings.openaiApiKey) throw new Error('请输入 API Key')
    
    const response = await fetch(`${settings.openaiBaseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${settings.openaiApiKey}`
      }
   })
    
    if (!response.ok) throw new Error(`Fetch Models Failed: ${response.status}`)
    const data = await response.json()
    // 过滤出 gpt 模型 (可选)
    return data.data.map(m => m.id).sort()
  } 
  else if (provider === 'gemini') {
    if (!settings.geminiApiKey) throw new Error('请输入 API Key')
    
    // Gemini List Models API: GET v1beta/models
    const baseUrl = settings.geminiBaseUrl.replace(/\/$/, '')
    const url = `${baseUrl}/v1beta/models?key=${settings.geminiApiKey}`
    
    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) throw new Error(`Fetch Models Failed: ${response.status}`)
    const data = await response.json()
    
    // data.models 是数组，每个元素有 name (如 "models/gemini-pro"), displayName 等
    // 我们只需要 gemini-pro 这样的 ID，通常需要去掉 "models/" 前缀
    return data.models
      .map(m => m.name.replace('models/', ''))
      .filter(id => id.includes('gemini')) // 简单过滤
      .sort()
  }
  
  return []
}
