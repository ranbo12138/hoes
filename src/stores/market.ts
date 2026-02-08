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
      id: 'incense_dream',
      name: '迷梦熏香',
      description: '燃烧后散发催眠香气，大幅恢复理智 (50)，但会略微降低精力 (-10)。',
      price: 280,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { sanity: 50, energy: -10 })
        return { success: true, message: `${girl.name} 在熏香中沉睡，噩梦散去了。` }
      }
    },
    {
      id: 'elixir_corruption',
      name: '堕落灵药',
      description: '禁忌炼金产物，提升 15 点堕落度和 5 点服从度，但会损失 20 点理智。',
      price: 600,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { depravity: 15, obedience: 5, sanity: -20 })
        return { success: true, message: `${girl.name} 饮下灵药，眼神变得迷离而顺从...` }
      }
    },
    {
      id: 'collar_leather',
      name: '拘束项圈',
      description: '强制提升 10 点服从度，但会微量减少理智。',
      price: 500,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { obedience: 10, sanity: -5 })
        return { success: true, message: `给 ${girl.name} 戴上了项圈。她看起来更加顺从了。` }
      }
    },
    {
      id: 'silk_lingerie',
      name: '丝绸亵衣',
      description: '精致的情趣服装，提升 8 点堕落度，略微增加服从度 (3)。',
      price: 350,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { depravity: 8, obedience: 3 })
        return { success: true, message: `${girl.name} 换上了丝绸亵衣，脸颊泛起红晕。` }
      }
    },
    {
      id: 'book_seduction',
      name: '《魅惑之书》',
      description: '记载禁忌技巧的古籍，提升 12 点堕落度。',
      price: 450,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { depravity: 12 })
        return { success: true, message: `${girl.name} 翻阅着书页，学会了新的技巧...` }
      }
    },
    {
      id: 'amulet_protection',
      name: '守护护符',
      description: '神秘的魔法饰品，永久提升 10 点理智上限。',
      price: 800,
      type: 'equipment',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        // 提升理智上限
        girl.dynamic.sanity.max += 10
        girlsStore.updateGirlStatus(targetId, { sanity: 10 })
        return { success: true, message: `${girl.name} 戴上护符，感到内心更加坚定。(理智上限 +10)` }
      }
    },
    {
      id: 'perfume_luxury',
      name: '奢华香水',
      description: '来自王都的高级香水，恢复 20 精力和 20 理智。',
      price: 320,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { energy: 20, sanity: 20 })
        return { success: true, message: `${girl.name} 喷上香水，整个人焕然一新。` }
      }
    },
    {
      id: 'chocolate_dark',
      name: '苦甜巧克力',
      description: '稀有的甜食，恢复 15 精力，略微提升心情 (理智 +5)。',
      price: 100,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { energy: 15, sanity: 5 })
        return { success: true, message: `${girl.name} 品尝着巧克力，露出难得的微笑。` }
      }
    },
    {
      id: 'whip_discipline',
      name: '调教皮鞭',
      description: '严厉的惩戒工具，大幅提升服从度 (20)，但会造成理智和精力损失。',
      price: 700,
      type: 'consumable',
      effect: (targetId) => {
        if (!targetId) return { success: false, message: '需要指定目标' }
        const girl = girlsStore.getGirlById(targetId)
        if (!girl) return { success: false, message: '目标不存在' }

        girlsStore.updateGirlStatus(targetId, { obedience: 20, sanity: -15, energy: -10 })
        return { success: true, message: `${girl.name} 在皮鞭下颤抖，变得更加听话了。` }
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
