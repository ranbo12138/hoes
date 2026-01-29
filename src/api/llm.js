import { useSettingsStore } from '@/stores/settings'
import { usePresetStore } from '@/stores/presets'
import { VariableResolver } from '@/utils/variableResolver'

// 默认 System Prompt（如果预设中没有提供）
const DEFAULT_SYSTEM_PROMPT = `
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
    "id": "g001",
    "data": {
      "sanity": -5,
      "energy": -10,
      "depravity": 2,
      "attire": "...",
      "location": "..."
    }
  },
  {
    "type": "ADD_GOLD",
    "amount": 100
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

/**
 * 调用 LLM
 * @param {string} userMessage - 用户消息
 * @param {Object} gameStateContext - 游戏状态上下文
 * @param {Function} onChunk - 流式响应回调函数（可选）
 * @returns {Promise<string>} - 完整的 AI 回复文本
 */
export async function callLLM(userMessage, gameStateContext, onChunk = null) {
  const settings = useSettingsStore()
  const presetStore = usePresetStore()

  if (!settings.aiProvider) {
    throw new Error('AI Provider not configured')
  }

  // 获取当前预设
  const activePreset = presetStore.getActivePreset()
  if (!activePreset) {
    throw new Error('No active preset found')
  }

  // 准备变量
  const variables = {
    ...gameStateContext,
    player_name: '店主', // 默认玩家名称
    extra: {}
  }

  // 准备 System Prompt（支持变量替换）
  const systemPrompt = activePreset.prompts.main || DEFAULT_SYSTEM_PROMPT
  const resolvedSystemPrompt = VariableResolver.resolve(systemPrompt, variables)

  // 准备上下文 Prompt
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

  // 检查是否启用流式响应
  const enableStreaming = activePreset.parameters.streaming && onChunk !== null

  try {
    if (settings.aiProvider === 'openai') {
      if (enableStreaming) {
        return await callOpenAIStream(settings, resolvedSystemPrompt, contextPrompt, activePreset.parameters, onChunk)
      } else {
        return await callOpenAI(settings, resolvedSystemPrompt, contextPrompt, activePreset.parameters)
      }
    } else if (settings.aiProvider === 'gemini') {
      if (enableStreaming) {
        return await callGeminiStream(settings, resolvedSystemPrompt, contextPrompt, activePreset.parameters, onChunk)
      } else {
        return await callGemini(settings, resolvedSystemPrompt, contextPrompt, activePreset.parameters)
      }
    } else {
      throw new Error('Unknown AI Provider')
    }
  } catch (error) {
    console.error('[LLM Error]', error)
    throw error
  }
}

/**
 * 调用 OpenAI（非流式）
 */
async function callOpenAI(settings, systemPrompt, userPrompt, parameters) {
  if (!settings.openaiApiKey) throw new Error('OpenAI API Key is missing')

  const body = {
    model: settings.openaiModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: parameters.temperature,
    max_tokens: parameters.max_tokens,
    top_p: parameters.top_p,
    top_k: parameters.top_k > 0 ? parameters.top_k : undefined,
    frequency_penalty: parameters.frequency_penalty,
    presence_penalty: parameters.presence_penalty
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

/**
 * 调用 OpenAI（流式）
 */
async function callOpenAIStream(settings, systemPrompt, userPrompt, parameters, onChunk) {
  if (!settings.openaiApiKey) throw new Error('OpenAI API Key is missing')

  const body = {
    model: settings.openaiModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: parameters.temperature,
    max_tokens: parameters.max_tokens,
    top_p: parameters.top_p,
    top_k: parameters.top_k > 0 ? parameters.top_k : undefined,
    frequency_penalty: parameters.frequency_penalty,
    presence_penalty: parameters.presence_penalty,
    stream: true
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

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        if (data === '[DONE]') continue

        try {
          const json = JSON.parse(data)
          const content = json.choices?.[0]?.delta?.content
          if (content) {
            fullText += content
            if (onChunk) onChunk(content)
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }

  return fullText
}

/**
 * 调用 Gemini（非流式）
 */
async function callGemini(settings, systemPrompt, userPrompt, parameters) {
  if (!settings.geminiApiKey) throw new Error('Gemini API Key is missing')

  const baseUrl = settings.geminiBaseUrl.replace(/\/$/, '')
  const url = `${baseUrl}/v1beta/models/${settings.geminiModel}:generateContent?key=${settings.geminiApiKey}`

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: parameters.temperature,
        maxOutputTokens: parameters.max_tokens,
        topP: parameters.top_p,
        topK: parameters.top_k > 0 ? parameters.top_k : undefined
      }
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API Error: ${response.status} - ${err}`)
  }

  const data = await response.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '(No response text)'
}

/**
 * 调用 Gemini（流式）
 */
async function callGeminiStream(settings, systemPrompt, userPrompt, parameters, onChunk) {
  if (!settings.geminiApiKey) throw new Error('Gemini API Key is missing')

  const baseUrl = settings.geminiBaseUrl.replace(/\/$/, '')
  const url = `${baseUrl}/v1beta/models/${settings.geminiModel}:streamGenerateContent?key=${settings.geminiApiKey}`

  const fullPrompt = `${systemPrompt}\n\n${userPrompt}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        temperature: parameters.temperature,
        maxOutputTokens: parameters.max_tokens,
        topP: parameters.top_p,
        topK: parameters.top_k > 0 ? parameters.top_k : undefined
      }
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Gemini API Error: ${response.status} - ${err}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n')

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6)
        try {
          const json = JSON.parse(data)
          const content = json.candidates?.[0]?.content?.parts?.[0]?.text
          if (content) {
            fullText += content
            if (onChunk) onChunk(content)
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
  }

  return fullText
}

/**
 * 获取模型列表
 */
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
    return data.data.map(m => m.id).sort()
  }
  else if (provider === 'gemini') {
    if (!settings.geminiApiKey) throw new Error('请输入 API Key')

    const baseUrl = settings.geminiBaseUrl.replace(/\/$/, '')
    const url = `${baseUrl}/v1beta/models?key=${settings.geminiApiKey}`

    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) throw new Error(`Fetch Models Failed: ${response.status}`)
    const data = await response.json()

    return data.models
      .map(m => m.name.replace('models/', ''))
      .filter(id => id.includes('gemini'))
      .sort()
  }

  return []
}