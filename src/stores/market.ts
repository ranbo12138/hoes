import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGameStore } from './game'
import { useGirlsStore } from './girls'

export interface Item {
  id: string
  name: string
  description: string
  price: number
  type: 'consumable' | 'equipment' | 'unlock'
  effect: (targetId?: string) => { success: boolean, message: string }
  icon?:string // 可选图标名
}

export const useMarketStore = defineStore('market', () => {
  const gameStore = useGameStore()
  const girlsStore = useGirlsStore()

  // --- 商品列表 ---
  const items = ref<Item[]>([
    {
      id: 'potion_vitality',
      name: '活力药剂',
      description: '恢复指定角色 50 点精力。',
      price: 150,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }
        
        girlsStore.updateGirlStatus(targetId, { energy: 50 })
        return { success: true, message: `${girl.name} 服用了活力药剂，精力充沛！` }
      }
    },
    {
      id: 'wine_vintage',
      name: '陈年红酒',
      description: '安抚心灵，恢复指定角色 30 点理智。',
      price: 200,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }
        
        girlsStore.updateGirlStatus(targetId, { sanity: 30 })
        return { success: true, message: `${girl.name} 品尝了红酒，心情平复了一些。` }
      }
    },
    {
      id: 'collar_leather',
      name: '拘束项圈',
      description: '强制提升 10 点服从度，但会微量减少理智。',
      price: 500,
      type: 'consumable', // 虽然像装备，但简化为一次性消耗品使用
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }
        
        girlsStore.updateGirlStatus(targetId, { obedience: 10, sanity: -5 })
        return { success: true, message: `给 ${girl.name} 戴上了项圈。她看起来更加顺从了。` }
      }
    },
    {
      id: 'contract_expansion',
      name: '扩建契约',
      description: '扩建娼馆设施（占位功能，暂时仅扣钱）。',
      price: 5000,
      type: 'unlock',
      effect: () => {
        return { success: true, message: '扩建计划已批准！（功能开发中）' }
      }
    }
  ])

  // --- 购买逻辑 ---
  function buyItem(itemId: string, targetId?: string) {
    const item = items.value.find(i => i.id === itemId)
    if (!item) return false

    // 1. 检查金币
    if (gameStore.gold < item.price) {
      gameStore.addLog({ type: 'system', text: `金币不足，无法购买 ${item.name}。` })
      return false
    }

    // 2. 尝试执行效果
    const result = item.effect(targetId)
    
    if (result.success) {
      // 3. 扣款
      gameStore.gold -= item.price
      gameStore.addLog({ type: 'system', text: `购买了 [${item.name}]: ${result.message}` })
      return true
    } else {
      gameStore.addLog({ type: 'system', text: `购买失败: ${result.message}` })
      return false
    }
  }

  return {
    items,
    buyItem
  }
})
