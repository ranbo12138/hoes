import type { TimeSlot, TaskConfig, TaskResult } from '@/types/schedule'
import type { Girl } from '@/types/girl'

// --- 随机事件定义 ---
export interface RandomEvent {
  id: string
  text: string
  trigger: (girl: Girl, task: TaskConfig) => boolean
  effect: (res: TaskResult) => void
}

// --- 1. 任务配置 (Master Data) ---
export const TASKS_CONFIG: TaskConfig[] = [
  {
    id: 'rest_bedroom',
    name: '卧室休息',
    type: 'rest',
    description: '在房间里睡觉，恢复少量精力。',
    costEnergy: -30, // 恢复更多
    costSanity: -10
  },
  {
    id: 'serve_normal',
    name: '普通接客',
    type: 'serve',
    description: '在大厅接待普通客人。',
    costEnergy: 15,
    costSanity: 5,
    baseIncome: 15,
    expService: 5
  },
  {
    id: 'serve_special',
    name: '特殊服务',
    type: 'serve',
    description: '接待有特殊癖好的客人。高收入，高风险。',
    costEnergy: 25,
    costSanity: 20, 
    baseIncome: 60,
    expService: 10
  },
  {
    id: 'train_basic',
    name: '基础调教',
    type: 'train',
    description: '进行基础的服从性训练。',
    costEnergy: 10,
    costSanity: 5,
    expTechnique: 5
  },
  {
    id: 'train_deep',
    name: '深度调教',
    type: 'train',
    description: '使用道具进行深度开发。提升服从度。',
    costEnergy: 30,
    costSanity: 15,
    expTechnique: 15
  },
  {
    id: 'street_solicit',
    name: '街头招揽',
    type: 'serve',
    description: '在门口招揽客人。收入低，但可能打听到传闻。',
    costEnergy: 10,
    costSanity: 0,
    baseIncome: 5,
    expService: 2
  }
]

// --- 突发事件库 ---
export const RANDOM_EVENTS: RandomEvent[] = [
  {
    id: 'tip_gold',
    text: '客人非常满意，额外给了一笔小费！(+20G)',
    trigger: (_g, t) => t.type === 'serve' && Math.random() < 0.1, // 10% 概率
    effect: (res) => { res.income += 20 }
  },
  {
    id: 'break_item',
    text: '不小心打碎了名贵的酒杯... (-15G)',
    trigger: (g, t) => t.type === 'serve' && g.dynamic.energy.current < 50 && Math.random() < 0.15, // 疲劳时容易出错
    effect: (res) => { res.income = Math.max(0, res.income - 15) }
  },
  {
    id: 'mental_break',
    text: '突然无法控制情绪，把客人吓跑了。(收益归零)',
    trigger: (g, t) => t.type === 'serve' && g.dynamic.sanity.current < 30 && Math.random() < 0.3, // 低理智高风险
    effect: (res) => { res.income = 0; res.success = false; }
  },
  {
    id: 'deep_insight',
    text: '在交流中似乎顿悟了什么技巧... (技巧经验UP)',
    trigger: (_g, t) => t.type === 'train' && Math.random() < 0.1,
    effect: (res) => { res.changes.exp = { ...res.changes.exp, technique: 20 } }
  }
]

/**
 * 计算一天的日程结果
 * Pure function: 只计算，不修改 Store
 */
export function calculateDailySchedule(
  girls: Girl[],
  assignments: Record<string, Record<TimeSlot, string | null>>
): TaskResult[] {
  const results: TaskResult[] = []
  const slots: TimeSlot[] = ['morning', 'afternoon', 'night']

  girls.forEach(girl => {
    const schedule = assignments[girl.id] || { morning: 'rest_bedroom', afternoon: 'serve_normal', night: 'serve_normal' }

    // 临时状态副本，用于计算当天的连续消耗
    let tempEnergy = girl.dynamic.energy.current
    // let tempSanity = girl.dynamic.sanity.current // 暂时没用到累加判断，保留变量名以防未来需要

    slots.forEach(slot => {
      const taskId = schedule[slot]
      if (!taskId) return

      const task = TASKS_CONFIG.find(t => t.id === taskId)
      if (!task) return

      const result: TaskResult = {
        girlId: girl.id,
        slot,
        taskId,
        success: true,
        income: 0,
        changes: {
          energy: 0,
          sanity: 0,
          obedience: 0,
          depravity: 0,
          exp: {}
        },
        log: ''
      }

      // --- 核心判定逻辑 ---
      
      // 1. 体力判定
      let successChance = 1.0
      if (tempEnergy < 30) {
        successChance -= (30 - tempEnergy) * 0.02 // 每少1点扣2%成功率
      }
      if (tempEnergy <= 0) successChance = 0 // 精力耗尽无法工作

      // 2. 基础消耗计算
      const energyCost = task.costEnergy
      const sanityCost = task.costSanity

      // 3. 执行判定
      if (task.type !== 'rest' && Math.random() > successChance) {
        // 失败！
        result.success = false
        result.log = `${girl.name} 因体力不支晕倒了，工作未能完成。`
        result.changes.energy = -10 // 失败也要扣一点
        // 收益归零
      } else {
        // 成功执行
        result.changes.energy = -energyCost
        result.changes.sanity = -sanityCost
        
        // 基础收益
        if (task.type === 'serve') {
          result.income = task.baseIncome || 0
          if (task.id === 'serve_special') {
            result.changes.depravity = 4
            result.log = `${girl.name} 完成了特殊服务。`
          } else {
            result.log = `${girl.name} 接待了客人。`
          }
        } else if (task.type === 'rest') {
          result.log = `${girl.name} 休息中。`
        } else if (task.type === 'train') {
           result.changes.obedience = 2
           if (task.id === 'train_deep') {
             result.changes.obedience = 5
             result.changes.depravity = 2
           }
           result.log = `${girl.name} 完成了训练。`
        }

        // 4. 随机事件触发 (仅在成功时)
        for (const evt of RANDOM_EVENTS) {
          if (evt.trigger(girl, task)) {
            evt.effect(result)
            result.log += ` (事件: ${evt.text})`
            break; // 一次只触发一个事件
          }
        }
      }

      // 更新临时状态供下一个 slot 使用
      tempEnergy += result.changes.energy
      // tempSanity += result.changes.sanity 

      results.push(result)
    })
  })

  return results
}
