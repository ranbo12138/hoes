import type { Girl, GirlStatusUpdate } from '@/types/girl'

/**
 * 对 Girl 应用状态更新 (包含数值限制和状态推导)
 * 直接修改传入的对象 (Mutable operation)
 */
export function applyGirlStatusUpdate(girl: Girl, updates: GirlStatusUpdate) {
  // 更新理智 (Sanity) - 包含状态检查
  if (updates.sanity !== undefined) {
    const current = girl.dynamic.sanity.current
    const max = girl.dynamic.sanity.max
    const nextVal = Math.min(max, Math.max(0, current + updates.sanity))
    
    girl.dynamic.sanity.current = nextVal
    
    // 简单的状态阈值检查
    if (nextVal <= 0) girl.dynamic.sanity.status = '疯狂'
    else if (nextVal < 20) girl.dynamic.sanity.status = '崩溃'
    else if (nextVal < 50) girl.dynamic.sanity.status = '恍惚'
    else girl.dynamic.sanity.status = '正常'
  }

  // 更新精力 (Energy)
  if (updates.energy !== undefined) {
    const current = girl.dynamic.energy.current
    const max = girl.dynamic.energy.max
    girl.dynamic.energy.current = Math.min(max, Math.max(0, current + updates.energy))
  }

  // 更新服从度 (Obedience)
  if (updates.obedience !== undefined) {
    const current = girl.dynamic.obedience
    girl.dynamic.obedience = Math.min(100, Math.max(0, current + updates.obedience))
  }

  // 更新堕落度 (Depravity)
  if (updates.depravity !== undefined) {
    const current = girl.dynamic.depravity
    girl.dynamic.depravity = Math.min(100, Math.max(0, current + updates.depravity))
  }

  // 字符串/状态类更新
  if (updates.attire) girl.dynamic.attire = updates.attire
  if (updates.location) girl.dynamic.location = updates.location
  if (updates.currentActivity) girl.dynamic.currentActivity = updates.currentActivity
}
