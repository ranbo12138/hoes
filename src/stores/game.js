import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGameStore = defineStore('game', () => {
  // 资源状态
  const gold = ref(1000)
  const day = ref(1)
  const energy = ref(100)

  // 游戏日志 (Chat History)
  // 结构: { id, type: 'system'|'npc'|'player', text, name, timestamp }
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

  // 更新某条日志的内容
  function updateLog(id, newText) {
    const log = logs.value.find(l => l.id === id)
    if (log) {
      log.text = newText
    }
  }

  // 删除某条日志
  function deleteLog(id) {
    logs.value = logs.value.filter(l => l.id !== id)
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
    clearLogs
  }
})
