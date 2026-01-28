import { useSettingsStore } from '@/stores/settings'

// System Prompt: 定义 AI 的角色和指令格式
const SYSTEM_PROMPT = `
You are the Game Master (GM) of a dark fantasy brothel management RPG called "Otherworld Brothel Simulator".
Your goal is to narrate the story, act as the NPCs (especially the girls), and drive the game state changes.

### Output Format
You MUST respond with two parts:
1. **Narrative**: The story text for the player to read. Keep it immersive, slightly dark, and erotic if the situation fits.
2. **Commands**: A JSON block at the end to update game state.

### JSON Command Protocol
Use the following JSON structure inside a \`\`\`json ... \`\`\` block at the end of your response:
[
  {
    "type": "UPDATE_GIRL",
    "id": "g001", // The girl's ID
    "data": {
      "sanity": -5,   // Optional: Sanity change
      "energy": -10,  // Optional: Energy change
      "depravity": 2, // Optional: Depravity change
      "attire": "...", // Optional: Change clothes
      "location": "..." // Optional: Move location
    }
  },
  {
    "type": "ADD_GOLD",
    "amount": 100 // Can be negative
  },
  {
    "type": "SYSTEM_NOTICE",
    "text": "System message to show"
  }
]

### Context
Current Game State will be provided in the user prompt.
Always stay in character.
`

export async function callLLM(userMessage, gameStateContext) {
  const settings = useSettingsStore()
  
  if (!settings.aiProvider) {
    throw new Error('AI Provider not configured')
  }

  const contextPrompt = `
[Game Context]
Gold: ${gameStateContext.gold}
Time: Day ${gameStateContext.day}
Active Girls: ${JSON.stringify(gameStateContext.girls.map(g => ({
  id: g.id, 
  name: g.name, 
  status: g.dynamic.sanity.status,
  energy: g.dynamic.energy.current
})))}

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
