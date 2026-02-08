import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Girl, GirlStatusUpdate } from '@/types/girl'
import { applyGirlStatusUpdate } from '@/engines/girlEngine'

export const useGirlsStore = defineStore('girls', () => {
  const girls = ref<Girl[]>([
    {
      id: 'g001',
      name: '艾琳娜',
      static: {
        race: '精灵',
        rarity: 'SSR',
        features: ['高冷', '爆乳'],
        traits: ['魔法亲和', '洁癖'],
        measurements: '34C-20-30',
        description: '曾经的精灵王庭魔法师，因债务沦落至此。虽然眼神依旧高傲，但身体已经开始适应这里的规则。'
      },
      dynamic: {
        energy: { current: 100, max: 100 },
        sanity: { current: 90, max: 100, status: '正常' },
        obedience: 30, // 初始服从度低
        depravity: 10, // 初始纯洁
        location: '二楼',
        currentActivity: '接客中',
        dailyIncome: 20,
        attire: '精灵祭司长袍(破损)',
        skills: {
          service: 'C',
          technique: 'D',
          endurance: 'B'
        }
      }
    },
    {
      id: 'g002',
      name: '米娅',
      static: {
        race: '猫娘',
        rarity: 'R',
        features: ['活泼', '兽耳'],
        traits: ['精力旺盛', '杂技'],
        measurements: '32B-22-32',
        description: '贫民窟长大的流浪猫娘，为了吃饱饭自愿加入。非常听话，但经常笨手笨脚。'
      },
      dynamic: {
        energy: { current: 40, max: 120 },
        sanity: { current: 95, max: 100, status: '正常' },
        obedience: 90,
        depravity: 40,
        location: '大厅',
        currentActivity: '休息中',
        dailyIncome: 5,
        attire: '女仆装',
        skills: {
          service: 'B',
          technique: 'C',
          endurance: 'A'
        }
      }
    }
  ])

  // Getters
  const getGirlById = computed(() => (id: string) => girls.value.find(g => g.id === id))
  
  const totalDailyIncome = computed(() => girls.value.reduce((sum, g) => sum + g.dynamic.dailyIncome, 0))

  // Actions
  function loadState(savedGirls: Girl[]) {
    girls.value = savedGirls
  }

  function addGirl(newGirl: Girl) {
    girls.value.push(newGirl)
  }

  function updateGirlStatus(id: string, updates: GirlStatusUpdate) {
    const girl = girls.value.find(g => g.id === id)
    if (!girl) {
      console.warn(`[GirlsStore] Girl not found: ${id}`)
      return
    }

    // 使用引擎处理更新逻辑
    applyGirlStatusUpdate(girl, updates)
  }

  return {
    girls,
    getGirlById,
    totalDailyIncome,
    loadState,
    addGirl,
    updateGirlStatus
  }
})
