import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGirlsStore } from './girls'
import { usePresetStore } from './presets'
import { useToastStore } from './toast'
import { callLLM } from '@/api/llm'

export const useGameStore = defineStore('game', () => {
  // 资源状态
  const gold = ref(1000)
  const day = ref(1)
  const energy = ref(100)

  // 游戏日志 (Chat History)
  const logs = ref([
    {
      id: 1,
      type: 'system',
      text: '欢迎来到 **异世界娼馆**。作为新任店主，你接手了这家 *破旧* 的店铺...',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      type: 'npc',
      name: '爱丽丝',
      text: '店主大人，早上好！今天我们要先做点什么呢？',
      avatar: 'npc_1',
      timestamp: new Date().toLocaleTimeString()
    }
  ])

  // 流式响应控制器
  let currentAbortController = null
  const isGenerating = ref(false)

  function addLog(log) {
    logs.value.push({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...log
    })
  }

  // AI 指令处理中间件
  function processAIResponse(fullText) {
    // 1. 尝试提取 JSON 块
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = fullText.match(jsonRegex);

    let displayText = fullText;

    if (match) {
      try {
        const jsonStr = match[1];
        const commands = JSON.parse(jsonStr);
        const girlsStore = useGirlsStore();

        console.log('[AI Protocol] Executing commands:', commands);

        // 2. 移除 JSON 得到纯剧情文本
        displayText = fullText.replace(match[0], '').trim();

        // 3. 执行指令
        if (Array.isArray(commands)) {
          commands.forEach(cmd => {
            switch (cmd.type) {
              case 'UPDATE_GIRL':
                if (cmd.id && cmd.data) {
                  girlsStore.updateGirlStatus(cmd.id, cmd.data);
                }
                break;

              case 'ADD_GOLD':
                if (typeof cmd.amount === 'number') {
                  gold.value += cmd.amount;
                }
                break;

              case 'SYSTEM_NOTICE':
                if (cmd.text) {
                  addLog({ type: 'system', text: cmd.text });
                }
                break;

              default:
                console.warn('[AI Protocol] Unknown command type:', cmd.type);
            }
          });
        }
      } catch (e) {
        console.error('[AI Protocol] Failed to parse AI commands:', e);
        // 如果解析失败，保留原文，避免剧情丢失
      }
    }

    return displayText;
  }

  // 核心交互逻辑：发送消息（支持流式响应）
  async function sendMessage(text) {
    if (!text || !text.trim()) return
    if (isGenerating.value) {
      const toastStore = useToastStore()
      toastStore.warning('AI 正在生成回复，请稍候...')
      return
    }

    isGenerating.value = true

    // 1. 添加玩家日志
    addLog({
      type: 'player',
      text: text,
      name: '店主'
    })

    // 2. 准备上下文数据
    const girlsStore = useGirlsStore()
    const context = {
      gold: gold.value,
      day: day.value,
      girls: girlsStore.girls
    }

    // 3. 检查是否启用流式响应
    const presetStore = usePresetStore()
    const activePreset = presetStore.getActivePreset()
    const enableStreaming = activePreset?.parameters.streaming || false

    // 4. 创建 AI 日志（初始为空，用于流式填充）
    const aiLogId = Date.now()
    addLog({
      id: aiLogId,
      type: 'npc',
      name: '系统',
      text: '', // 初始为空，流式填充
      isStreaming: true, // 标记为流式
      showStopButton: true // 显示停止按钮
    })

    try {
      let fullText = ''

      // 调用 LLM（支持流式响应）
      await callLLM(text, context, (chunk) => {
        // 流式回调：逐字更新
        fullText += chunk
        updateLog(aiLogId, fullText)
      })

      // 流式结束，处理 JSON 指令
      const cleanText = processAIResponse(fullText)
      updateLog(aiLogId, cleanText)

      // 移除流式标记
      const log = logs.value.find(l => l.id === aiLogId)
      if (log) {
        log.isStreaming = false
        log.showStopButton = false
      }

    } catch (error) {
      console.error('AI Call Failed:', error)

      // 移除流式标记
      const log = logs.value.find(l => l.id === aiLogId)
      if (log) {
        log.isStreaming = false
        log.showStopButton = false
      }

      // 显示错误
      const toastStore = useToastStore()
      toastStore.error(`系统错误: ${error.message}`)

      updateLog(aiLogId, `(系统错误: ${error.message}。请在"系统设置"中检查 API 配置)`)
    } finally {
      isGenerating.value = false
    }
  }

  // 停止生成
  function stopGeneration() {
    if (currentAbortController) {
      currentAbortController.abort()
      currentAbortController = null
      isGenerating.value = false

      // 标记所有流式日志为非流式
      logs.value.forEach(log => {
        if (log.isStreaming) {
          log.isStreaming = false
          log.showStopButton = false
        }
      })

      const toastStore = useToastStore()
      toastStore.info('已停止生成')
    }
  }

  function updateLog(id, newText) {
    const log = logs.value.find(l => l.id === id)
    if (log) {
      log.text = newText
    }
  }

  function deleteLog(id) {
    logs.value = logs.value.filter(l => l.id !== id)
  }

  // 重新生成逻辑
  async function regenerateLog(id) {
    const index = logs.value.findIndex(l => l.id === id)
    if (index !== -1) {
      logs.value.splice(index, 1)
      // TODO: 触发 AI 重新生成
      return true
    }
    return false
  }

  function clearLogs() {
    logs.value = []
  }

  return {
    gold,
    day,
    energy,
    logs,
    isGenerating,
    addLog,
    sendMessage,
    stopGeneration,
    updateLog,
    deleteLog,
    regenerateLog,
    clearLogs
  }
})