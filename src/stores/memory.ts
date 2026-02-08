import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface MemoryEvent {
  id: string
  timestamp: number // 现实时间戳
  day: number       // 游戏内天数
  type: 'narrative' | 'achievement' | 'tragedy' | 'transaction'
  description: string
  involved_npcs: string[] // NPC IDs
  importance: number // 1-10
}

export interface Fact {
  id: string
  npc_id: string
  content: string // e.g. "爱丽丝害怕打雷"
  confidence: number // 0-1
  source: string // 'dialogue' | 'observation'
}

export const useMemoryStore = defineStore('memory', () => {
  // --- State ---
  
  // 1. 长期记忆：关键事件
  const events = ref<MemoryEvent[]>([])

  // 2. 长期记忆：事实库 (关于世界或NPC的知识)
  const facts = ref<Fact[]>([])

  // 3. 短期记忆：当前场景/对话的上下文摘要
  // 这里的 logs 由 gameStore 维护，memoryStore 只维护精炼后的摘要
  const contextSummary = ref<string>("")

  // --- Actions ---

  /**
   * 记录发生的一个关键事件
   */
  function addEvent(
    description: string, 
    day: number, 
    type: MemoryEvent['type'] = 'narrative', 
    npcs: string[] = [],
    importance: number = 5
  ) {
    const event: MemoryEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      day,
      type,
      description,
      involved_npcs: npcs,
      importance
    }
    events.value.push(event)
    
    // 保持按时间倒序或顺序？顺序比较符合直觉
    // events.value.sort((a, b) => a.day - b.day)
  }

  /**
   * 记住一个关于 NPC 或世界的知识
   */
  function addFact(npcId: string, content: string, source = 'dialogue') {
    // 简单的查重：如果有完全一样的内容则忽略
    if (facts.value.some(f => f.npc_id === npcId && f.content === content)) {
      return
    }

    const fact: Fact = {
      id: crypto.randomUUID(),
      npc_id: npcId,
      content,
      confidence: 1.0,
      source
    }
    facts.value.push(fact)
  }

  /**
   * 检索相关记忆 (简单的关键词匹配)
   * 在 LLM 调用前使用，构建 Prompt Context
   */
  function recall(query: string, npcId?: string): string {
    const relevantEvents = events.value
      .filter(e => {
        const matchText = e.description.includes(query)
        const matchNpc = npcId ? e.involved_npcs.includes(npcId) : true
        return matchText || matchNpc
      })
      .slice(-5) // 只取最近 5 条

    const relevantFacts = npcId 
      ? facts.value.filter(f => f.npc_id === npcId)
      : []

    let recallText = ""
    
    if (relevantEvents.length > 0) {
      recallText += "【过往经历】:\n" + relevantEvents.map(e => `- [Day ${e.day}] ${e.description}`).join('\n') + "\n"
    }

    if (relevantFacts.length > 0) {
      recallText += `【关于 ${npcId} 的认知】:\n` + relevantFacts.map(f => `- ${f.content}`).join('\n') + "\n"
    }

    return recallText
  }

  /**
   * 清空所有记忆 (重置游戏时使用)
   */
  function clearMemory() {
    events.value = []
    facts.value = []
    contextSummary.value = ""
  }

  /**
   * 序列化/反序列化 (用于存档)
   */
  function loadState(state: any) {
    if (state.events) events.value = state.events
    if (state.facts) facts.value = state.facts
    if (state.contextSummary) contextSummary.value = state.contextSummary
  }

  return {
    events,
    facts,
    contextSummary,
    addEvent,
    addFact,
    recall,
    clearMemory,
    loadState
  }
})
