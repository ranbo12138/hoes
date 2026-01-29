import { defineStore } from 'pinia'
import { ref } from 'vue'

// 预设接口定义
export interface AIPreset {
  id: string
  name: string
  description?: string
  isBuiltin: boolean
  createdAt: number

  // AI 参数（兼容 SillyTavern）
  parameters: {
    // Context Settings
    max_tokens: number
    context_length: number

    // Sampler Parameters
    temperature: number
    top_p: number
    top_k: number
    repetition_penalty: number
    repetition_penalty_range: number
    repetition_penalty_slope: number
    min_p: number
    typical_p: number
    top_a: number
    tail_free_sampling: number
    smoothing_factor: number
    mirostat_mode: number
    mirostat_tau: number
    mirostat_eta: number
    frequency_penalty: number
    presence_penalty: number

    // 流式响应
    streaming: boolean
  }

  // 提示词配置
  prompts: {
    main: string
    // 未来可扩展：
    // scenario?: string
    // character?: string
    // jailbreak?: string
  }

  // 变量配置（可选）
  variables?: {
    [key: string]: string
  }
}

// 默认预设工厂
export function createDefaultPresets(): AIPreset[] {
  return [
    {
      id: 'preset_default_dark_fantasy',
      name: '暗黑奇幻默认',
      description: '适合暗黑奇幻风格游戏的默认预设',
      isBuiltin: true,
      createdAt: Date.now(),
      parameters: {
        max_tokens: 2048,
        context_length: 4096,
        temperature: 0.8,
        top_p: 0.9,
        top_k: 40,
        repetition_penalty: 1.0,
        repetition_penalty_range: 0,
        repetition_penalty_slope: 0,
        min_p: 0.05,
        typical_p: 1.0,
        top_a: 0.0,
        tail_free_sampling: 1.0,
        smoothing_factor: 0.0,
        mirostat_mode: 0,
        mirostat_tau: 5.0,
        mirostat_eta: 0.1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        streaming: true
      },
      prompts: {
        main: `You are the Game Master (GM) of a dark fantasy brothel management RPG called "Otherworld Brothel Simulator".
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
Always stay in character.`
      }
    },
    {
      id: 'preset_creative',
      name: '创意增强',
      description: '提高随机性和创意性，适合探索剧情',
      isBuiltin: true,
      createdAt: Date.now(),
      parameters: {
        max_tokens: 2048,
        context_length: 4096,
        temperature: 1.1,
        top_p: 0.95,
        top_k: 50,
        repetition_penalty: 1.1,
        repetition_penalty_range: 512,
        repetition_penalty_slope: 0,
        min_p: 0.05,
        typical_p: 1.0,
        top_a: 0.0,
        tail_free_sampling: 1.0,
        smoothing_factor: 0.0,
        mirostat_mode: 0,
        mirostat_tau: 5.0,
        mirostat_eta: 0.1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        streaming: true
      },
      prompts: {
        main: `You are the Game Master (GM) of a dark fantasy brothel management RPG called "Otherworld Brothel Simulator".
Focus on creative storytelling and unexpected plot developments. Be bold, imaginative, and willing to surprise the player with twists and turns.

### Output Format
You MUST respond with two parts:
1. **Narrative**: The story text for the player to read. Be creative and unexpected!
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
Always stay in character and embrace the unexpected!`
      }
    }
  ]
}

// SillyTavern 预设转换器
export function importSillyTavernPreset(data: any): AIPreset | null {
  try {
    const preset: AIPreset = {
      id: 'st_' + Date.now(),
      name: data.name || 'Imported Preset',
      description: data.description || '',
      isBuiltin: false,
      createdAt: Date.now(),
      parameters: {
        max_tokens: data.response_length || 2048,
        context_length: data.context_length || 4096,
        temperature: data.temperature ?? 0.8,
        top_p: data.top_p ?? 0.9,
        top_k: data.top_k ?? 40,
        repetition_penalty: data.repetition_penalty ?? 1.0,
        repetition_penalty_range: data.repetition_penalty_range ?? 0,
        repetition_penalty_slope: data.repetition_penalty_slope ?? 0,
        min_p: data.min_p ?? 0.05,
        typical_p: data.typical_p ?? 1.0,
        top_a: data.top_a ?? 0.0,
        tail_free_sampling: data.tail_free_sampling ?? 1.0,
        smoothing_factor: data.smoothing_factor ?? 0.0,
        mirostat_mode: data.mirostat_mode ?? 0,
        mirostat_tau: data.mirostat_tau ?? 5.0,
        mirostat_eta: data.mirostat_eta ?? 0.1,
        frequency_penalty: data.frequency_penalty ?? 0.0,
        presence_penalty: data.presence_penalty ?? 0.0,
        streaming: true
      },
      prompts: {
        main: data.prompts?.main || ''
      }
    }
    return preset
  } catch (e) {
    console.error('[Preset Import] Failed to parse:', e)
    return null
  }
}

// 导出为 SillyTavern 兼容格式
export function exportToSillyTavernPreset(preset: AIPreset): any {
  return {
    name: preset.name,
    description: preset.description,
    response_length: preset.parameters.max_tokens,
    context_length: preset.parameters.context_length,
    temperature: preset.parameters.temperature,
    top_p: preset.parameters.top_p,
    top_k: preset.parameters.top_k,
    repetition_penalty: preset.parameters.repetition_penalty,
    repetition_penalty_range: preset.parameters.repetition_penalty_range,
    repetition_penalty_slope: preset.parameters.repetition_penalty_slope,
    min_p: preset.parameters.min_p,
    typical_p: preset.parameters.typical_p,
    top_a: preset.parameters.top_a,
    tail_free_sampling: preset.parameters.tail_free_sampling,
    smoothing_factor: preset.parameters.smoothing_factor,
    mirostat_mode: preset.parameters.mirostat_mode,
    mirostat_tau: preset.parameters.mirostat_tau,
    mirostat_eta: preset.parameters.mirostat_eta,
    prompts: preset.prompts
  }
}

export const usePresetStore = defineStore('presets', () => {
  const presets = ref<AIPreset[]>([])
  const activePresetId = ref<string>('')

  const STORAGE_KEY = 'hoes_presets_v1'

  function loadPresets() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.presets) presets.value = data.presets
        if (data.activePresetId) activePresetId.value = data.activePresetId
      } catch (e) {
        console.error('Failed to load presets:', e)
      }
    }

    // 如果没有预设，加载默认预设
    if (presets.value.length === 0) {
      presets.value = createDefaultPresets()
      activePresetId.value = presets.value[0].id
      savePresets()
    }
  }

  function savePresets() {
    const data = {
      presets: presets.value,
      activePresetId: activePresetId.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function setActivePreset(id: string) {
    activePresetId.value = id
    savePresets()
  }

  function getActivePreset(): AIPreset | undefined {
    return presets.value.find(p => p.id === activePresetId.value)
  }

  function addPreset(preset: AIPreset) {
    presets.value.push(preset)
    savePresets()
  }

  function updatePreset(id: string, updates: Partial<AIPreset>) {
    const index = presets.value.findIndex(p => p.id === id)
    if (index !== -1) {
      presets.value[index] = { ...presets.value[index], ...updates }
      savePresets()
    }
  }

  function deletePreset(id: string) {
    const index = presets.value.findIndex(p => p.id === id)
    if (index !== -1 && !presets.value[index].isBuiltin) {
      presets.value.splice(index, 1)
      // 如果删除的是当前激活的预设，切换到第一个预设
      if (activePresetId.value === id && presets.value.length > 0) {
        activePresetId.value = presets.value[0].id
      }
      savePresets()
    }
  }

  function duplicatePreset(id: string): AIPreset {
    const original = presets.value.find(p => p.id === id)
    if (!original) {
      throw new Error('Preset not found')
    }

    const newPreset: AIPreset = {
      ...JSON.parse(JSON.stringify(original)),
      id: 'custom_' + Date.now(),
      name: original.name + ' (副本)',
      isBuiltin: false,
      createdAt: Date.now()
    }
    addPreset(newPreset)
    return newPreset
  }

  function importPreset(data: any): AIPreset | null {
    const preset = importSillyTavernPreset(data)
    if (preset) {
      addPreset(preset)
      return preset
    }
    return null
  }

  function exportPreset(id: string): string {
    const preset = presets.value.find(p => p.id === id)
    if (!preset) {
      throw new Error('Preset not found')
    }
    return JSON.stringify(exportToSillyTavernPreset(preset), null, 2)
  }

  // 初始化加载
  loadPresets()

  return {
    presets,
    activePresetId,
    getActivePreset,
    setActivePreset,
    addPreset,
    updatePreset,
    deletePreset,
    duplicatePreset,
    importPreset,
    exportPreset
  }
})