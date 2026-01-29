import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TimeSlot, ActivityType, TaskConfig, TaskResult } from '@/types/schedule'
import { useGirlsStore } from './girls'
import { useGameStore } from './game' // JS store, but usable

export const useScheduleStore = defineStore('schedule', () => {
  const girlsStore = useGirlsStore()
  const gameStore = useGameStore()

  // --- 1. 任务配置 (Master Data) ---
  const tasks = ref<TaskConfig[]>([
    {
      id: 'rest_bedroom',
      name: '卧室休息',
      type: 'rest',
      description: '在房间里睡觉，恢复少量精力。',
      costEnergy: -20, // 负数代表恢复
      costSanity: -5
    },
    {
      id: 'serve_normal',
      name: '普通接客',
      type: 'serve',
      description: '在大厅接待普通客人。',
      costEnergy: 15,
      costSanity: 5,
      baseIncome: 10,
      expService: 5
    },
    {
      id: 'train_basic',
      name: '基础调教',
      type: 'train',
      description: '进行基础的服从性训练。',
      costEnergy: 10,
      costSanity: 10,
      expTechnique: 5
    }
  ])

  // --- 2. 当前分配状态 (State) ---
  // 结构: { 'g001': { 'morning': 'serve_normal', ... } }
  const currentAssignments = ref<Record<string, Record<TimeSlot, string | null>>>({})

  // 初始化某人的日程表
  function initScheduleForGirl(girlId: string) {
    if (!currentAssignments.value[girlId]) {
      currentAssignments.value[girlId] = {
        morning: 'rest_bedroom', // 默认休息
        afternoon: 'serve_normal',
        night: 'serve_normal'
      }
    }
  }

  // 修改分配
  function setAssignment(girlId: string, slot: TimeSlot, taskId: string) {
    if (!currentAssignments.value[girlId]) initScheduleForGirl(girlId)
    currentAssignments.value[girlId][slot] = taskId
  }

  function getAssignment(girlId: string, slot: TimeSlot): string | null {
    return currentAssignments.value[girlId]?.[slot] || null
  }

  // --- 3. 结算逻辑 (Core Logic) ---
  function executeDay() {
    const results: TaskResult[] = []
    const slots: TimeSlot[] = ['morning', 'afternoon', 'night']

    // 遍历所有员工
    girlsStore.girls.forEach(girl => {
      // 确保有日程
      initScheduleForGirl(girl.id)
      const schedule = currentAssignments.value[girl.id]

      slots.forEach(slot => {
        const taskId = schedule[slot]
        if (!taskId) return

        const task = tasks.value.find(t => t.id === taskId)
        if (!task) return

        // 计算结果
        // 简单模型: 必定成功，数值直接加减
        // 进阶模型(TODO): 根据体力判断是否失败
        
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

        // 应用消耗
        result.changes.energy = -task.costEnergy
        result.changes.sanity = -task.costSanity

        // 应用收益
        if (task.type === 'serve') {
            // 收入公式: 基础 + 侍奉等级 * 5
            const skillBonus = 0 // TODO: 从 girl.dynamic.skills 计算
            result.income = (task.baseIncome || 0) + skillBonus
            result.log = `${girl.name} 接待了客人，赚取了 ${result.income}G`
        } else if (task.type === 'rest') {
            result.log = `${girl.name} 休息了一段时间。`
        } else if (task.type === 'train') {
            result.changes.obedience = 2
            result.log = `${girl.name} 接受了调教。`
        }

        results.push(result)
      })
    })

    // 应用所有结果到 Store
    applyResults(results)
    
    return results
  }

  function applyResults(results: TaskResult[]) {
    let totalIncome = 0
    const summaryLogs: string[] = []

    results.forEach(res => {
       // 更新 Girl 状态
       girlsStore.updateGirlStatus(res.girlId, {
         energy: res.changes.energy, // updateGirlStatus 是增量更新
         sanity: res.changes.sanity,
         obedience: res.changes.obedience,
         depravity: res.changes.depravity
       })

       // 累加金币
       totalIncome += res.income
       
       // 记录日志 (仅记录重要事件，避免刷屏)
       // if (res.income > 0) summaryLogs.push(res.log)
    })

    // 更新全局金币
    if (totalIncome > 0) {
      gameStore.gold += totalIncome
      gameStore.addLog({ type: 'system', text: `今日营业结束，总收入: ${totalIncome} G` })
    }

    // 推进日期
    gameStore.day += 1
    gameStore.energy -= 10 // 店主消耗精力
  }

  return {
    tasks,
    currentAssignments,
    initScheduleForGirl,
    setAssignment,
    getAssignment,
    executeDay
  }
})
