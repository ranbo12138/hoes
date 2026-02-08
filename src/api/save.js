import { useGameStore } from '@/stores/game'
import { useGirlsStore } from '@/stores/girls'
import { useMemoryStore } from '@/stores/memory'

const STORAGE_KEY = 'hoes_save_data_v2'

export default {
  // 保存游戏 (支持多档位，默认为 'auto')
  async saveGame(slot = 'auto') {
    try {
      const gameStore = useGameStore()
      const girlsStore = useGirlsStore()
      const memoryStore = useMemoryStore()

      // 构建存档包
      const saveData = {
        version: 2,
        timestamp: Date.now(),
        game: {
          gold: gameStore.gold,
          day: gameStore.day,
          energy: gameStore.energy,
          logs: gameStore.logs
        },
        girls: girlsStore.girls,
        memory: {
          events: memoryStore.events,
          facts: memoryStore.facts,
          contextSummary: memoryStore.contextSummary
        }
      }

      // 序列化并存储
      const key = `${STORAGE_KEY}_${slot}`
      localStorage.setItem(key, JSON.stringify(saveData))
      
      console.log(`[SaveSystem] Game saved to slot: ${slot}`, saveData)
      return { success: true }
    } catch (e) {
      console.error('[SaveSystem] Save failed:', e)
      return { success: false, error: e }
    }
  },

  // 读取游戏
  async loadGame(slot = 'auto') {
    try {
      const key = `${STORAGE_KEY}_${slot}`
      const json = localStorage.getItem(key)
      
      if (!json) {
        console.warn(`[SaveSystem] No save data found in slot: ${slot}`)
        return { success: false, message: 'No save data' }
      }

      const data = JSON.parse(json)
      
      // 恢复 GameStore
      const gameStore = useGameStore()
      if (data.game) {
        gameStore.loadState(data.game)
      }

      // 恢复 GirlsStore
      const girlsStore = useGirlsStore()
      if (data.girls) {
        girlsStore.loadState(data.girls)
      }

      // 恢复 MemoryStore
      const memoryStore = useMemoryStore()
      if (data.memory) {
        memoryStore.loadState(data.memory)
      }

      console.log(`[SaveSystem] Game loaded from slot:${slot}`)
      return { success: true, data }
    } catch (e) {
      console.error('[SaveSystem] Load failed:', e)
      return { success: false, error: e }
    }
  },

  // 检查存档是否存在
  hasSave(slot = 'auto') {
    const key = `${STORAGE_KEY}_${slot}`
    return !!localStorage.getItem(key)
  },

  // 删除存档
  deleteSave(slot = 'auto') {
    const key = `${STORAGE_KEY}_${slot}`
    localStorage.removeItem(key)
  }
}
