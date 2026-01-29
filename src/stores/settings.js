import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // --- 基础设置 ---
  const volume = ref(50)
  
  // --- AI 设置 ---
  const aiProvider = ref('openai') // 'openai' | 'gemini'
  const enableTools = ref(false)   // 是否允许 AI 调用工具 (Memory, etc.)

  // OpenAI 兼容模式配置
  const openaiBaseUrl = ref('https://api.openai.com/v1')
  const openaiApiKey = ref('')
  const openaiModel = ref('gpt-3.5-turbo')

  // Gemini 原生模式配置
  const geminiBaseUrl = ref('https://generativelanguage.googleapis.com')
  const geminiApiKey = ref('')
  const geminiModel = ref('gemini-pro')

  // --- 自定义变量 ---
  const customVars = ref([
    { name: 'custom_var', value: '自定义值' }
  ])

  // --- 持久化逻辑 ---
  const STORAGE_KEY = 'obs_settings_v1'

  function loadSettings() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const data = JSON.parse(stored)
        if (data.volume !== undefined) volume.value = data.volume
        if (data.aiProvider) aiProvider.value = data.aiProvider
        if (data.enableTools !== undefined) enableTools.value = data.enableTools
        
        if (data.openaiBaseUrl) openaiBaseUrl.value = data.openaiBaseUrl
        if (data.openaiApiKey) openaiApiKey.value = data.openaiApiKey
        if (data.openaiModel) openaiModel.value = data.openaiModel
        
        if (data.geminiBaseUrl) geminiBaseUrl.value = data.geminiBaseUrl
        if (data.geminiApiKey) geminiApiKey.value = data.geminiApiKey
        if (data.geminiModel) geminiModel.value = data.geminiModel
        
        // 加载自定义变量
        if (data.customVars && Array.isArray(data.customVars)) {
          customVars.value = data.customVars
        }
      } catch (e) {
        console.error('Failed to load settings:', e)
      }
    }
  }

  function saveSettings() {
    const data = {
      volume: volume.value,
      aiProvider: aiProvider.value,
      enableTools: enableTools.value,
      
      openaiBaseUrl: openaiBaseUrl.value,
      openaiApiKey: openaiApiKey.value,
      openaiModel: openaiModel.value,
      
      geminiBaseUrl: geminiBaseUrl.value,
      geminiApiKey: geminiApiKey.value,
      geminiModel: geminiModel.value,
      
      // 保存自定义变量
      customVars: customVars.value
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  // 监听变化自动保存
  watch(
    [
      volume, aiProvider, enableTools,
      openaiBaseUrl, openaiApiKey, openaiModel, 
      geminiBaseUrl, geminiApiKey, geminiModel,
      customVars
    ], 
    () => {
      saveSettings()
    }
  )

  // 初始化加载
  loadSettings()

  return {
    volume,
    aiProvider,
    enableTools,
    openaiBaseUrl,
    openaiApiKey,
    openaiModel,
    geminiBaseUrl,
    geminiApiKey,
    geminiModel,
    customVars
  }
})
