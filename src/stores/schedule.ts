import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TimeSlot, TaskConfig, TaskResult } from '@/types/schedule'
import { useGirlsStore } from './girls'
import { useGameStore } from './game'
import { calculateDailySchedule, TASKS_CONFIG } from '@/engines/scheduleEngine'

export const useScheduleStore = defineStore('schedule', () => {
  const girlsStore = useGirlsStore()
  const gameStore = useGameStore()

  // --- 1. 任务配置 (Master Data) ---
  // 直接使用引擎中的配置，或者如果需要动态修改，可以 wrap 成 ref
  const tasks = ref<TaskConfig[]>(TASKS_CONFIG)

  // --- 2. 当前分配状态 (State) ---
  // 结构: { 'g001': { 'morning': 'serve_normal', ... } }
  const currentAssignments = ref<Record<string, Record<TimeSlot, string | null>>>({})

  function initScheduleForGirl(girlId: string) {
    if (!currentAssignments.value[girlId]) {
      currentAssignments.value[girlId] = {
        morning: 'rest_bedroom',
        afternoon: 'serve_normal',
        night: 'serve_normal'
      }
    }
  }

  function setAssignment(girlId: string, slot: TimeSlot, taskId: string) {
    if (!currentAssignments.value[girlId]) initScheduleForGirl(girlId)
    currentAssignments.value[girlId][slot] = taskId
  }

  function getAssignment(girlId: string, slot: TimeSlot): string | null {
    return currentAssignments.value[girlId]?.[slot] || null
  }

  // --- 3. 结算逻辑 (Core Logic) ---
  function executeDay() {
    // 确保所有 girl 都有 schedule 初始化 (防止新招募的没 schedule)
    girlsStore.girls.forEach(girl => initScheduleForGirl(girl.id))

    // 调用计算引擎
    const results = calculateDailySchedule(girlsStore.girls, currentAssignments.value)

    // 应用所有结果到 Store
    applyResults(results)
    
    return results
  }

  function applyResults(results: TaskResult[]) {
    let totalIncome = 0

    results.forEach(res => {
       girlsStore.updateGirlStatus(res.girlId, {
         energy: res.changes.energy,
         sanity: res.changes.sanity,
         obedience: res.changes.obedience,
         depravity: res.changes.depravity
       })

       totalIncome += res.income
    })

    if (totalIncome > 0) {
      gameStore.gold += totalIncome
      gameStore.addLog({ type: 'system', text: `今日营业结束，总收入: ${totalIncome} G` })
    } else {
      gameStore.addLog({ type: 'system', text: `今日营业结束，没有收入。` })
    }
    
    // 显示随机事件日志
    const events = results.filter(r => r.log.includes('事件') || !r.success)
    if (events.length > 0) {
      events.forEach(e => {
        gameStore.addLog({ type: 'system', text: e.log })
      })
    }

    gameStore.day += 1
    gameStore.energy -= 10
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
