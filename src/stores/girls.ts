import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// --- 类型定义 ---

export type Rarity = 'N' | 'R' | 'SR' | 'SSR';

export interface GirlStaticData {
  race: string;       
  rarity: Rarity;     // 新增：稀有度
  features: string[]; 
  traits: string[];   // 新增：特质，如 ['敏感', '高傲']
  measurements: string; 
  description: string; 
  avatar?: string;    // 图片路径
}

export interface GirlDynamicData {
  // 生理
  energy: {
    current: number;
    max: number;
  };
  // 心理
  sanity: {           // 新增：理智值 (SAN)
    current: number;
    max: number;
    status: '正常' | '恍惚' | '崩溃' | '疯狂';
  };
  obedience: number;  // 新增：服从度 (0-100)
  depravity: number;  // 新增：堕落度 (0-100)
  
  // 经营
  location: string;    
  currentActivity: string; 
  dailyIncome: number; 
  attire: string;      
  
  // 技能等级 (S/A/B/C/D)
  skills: {
    service: string; // 侍奉
    technique: string; // 技巧
    endurance: string; // 耐力
  }
}

export interface Girl {
  id: string;
  name: string;
  static: GirlStaticData;
  dynamic: GirlDynamicData;
}

// 更新指令接口
export interface GirlStatusUpdate {
  sanity?: number;    // 增量
  energy?: number;    // 增量
  obedience?: number; // 增量
  depravity?: number; // 增量
  attire?: string;    // 替换
  location?: string;  // 替换
  currentActivity?: string; // 替换
}

// --- Store 实现 ---

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
  function addGirl(newGirl: Girl) {
    girls.value.push(newGirl)
  }

  function updateGirlStatus(id: string, updates: GirlStatusUpdate) {
    const girl = girls.value.find(g => g.id === id)
    if (!girl) {
      console.warn(`[GirlsStore] Girl not found: ${id}`)
      return
    }

    // 更新理智 (Sanity) - 包含状态检查
    if (updates.sanity !== undefined) {
      girl.dynamic.sanity.current = Math.min(girl.dynamic.sanity.max, Math.max(0, girl.dynamic.sanity.current + updates.sanity))
      
      // 简单的状态阈值检查
      const s = girl.dynamic.sanity.current
      if (s <= 0) girl.dynamic.sanity.status = '疯狂'
      else if (s < 20) girl.dynamic.sanity.status = '崩溃'
      else if (s < 50) girl.dynamic.sanity.status = '恍惚'
      else girl.dynamic.sanity.status = '正常'
    }

    // 更新精力 (Energy)
    if (updates.energy !== undefined) {
      girl.dynamic.energy.current = Math.min(girl.dynamic.energy.max, Math.max(0, girl.dynamic.energy.current + updates.energy))
    }

    // 更新服从度 (Obedience)
    if (updates.obedience !== undefined) {
      girl.dynamic.obedience = Math.min(100, Math.max(0, girl.dynamic.obedience + updates.obedience))
    }

    // 更新堕落度 (Depravity)
    if (updates.depravity !== undefined) {
      girl.dynamic.depravity = Math.min(100, Math.max(0, girl.dynamic.depravity + updates.depravity))
    }

    // 字符串/状态类更新
    if (updates.attire) girl.dynamic.attire = updates.attire
    if (updates.location) girl.dynamic.location = updates.location
    if (updates.currentActivity) girl.dynamic.currentActivity = updates.currentActivity
  }

  return {
    girls,
    getGirlById,
    totalDailyIncome,
    addGirl,
    updateGirlStatus
  }
})
