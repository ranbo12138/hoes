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

  return {
    girls,
    getGirlById,
    totalDailyIncome,
    addGirl
  }
})
