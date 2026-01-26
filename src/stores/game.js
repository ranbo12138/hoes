import { defineStore } from 'pinia'
import { ref } from 'vue'

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
      text: '欢迎来到异世界娼馆。作为新任店主，你接手了这家破旧的店铺...', 
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

  function addLog(log) {
    logs.value.push({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...log
    })
  }

  // 核心交互逻辑：发送消息
  async function sendMessage(text) {
    if (!text || !text.trim()) return

    // 1. 添加玩家日志
    addLog({
      type: 'player',
      text: text,
      name: '店主'
    })

    // 2. 模拟系统/AI 回复
    // 未来这里可以替换为真实的 API 调用
    return new Promise((resolve) => {
      setTimeout(() => {
        addLog({
          type: 'npc',
          name: '系统',
          text: `你刚才说了: "${text}"。 (AI 接口暂未连接)`
        })
        resolve()
      }, 800)
    })
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
    // 找到这条日志，如果是 NPC 回复，则删除它，并重新提交上一条玩家指令
    const index = logs.value.findIndex(l => l.id === id)
    if (index !== -1) {
       // 如果是删除当前条，并重试
       // 实际业务中可能需要找到"上一条玩家输入"来重发
       // 这里简单模拟：删除当前条，提示用户
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
    addLog,
    sendMessage,
    updateLog,
    deleteLog,
    regenerateLog,
    clearLogs
  }
})
