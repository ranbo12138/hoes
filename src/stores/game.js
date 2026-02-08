import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useGirlsStore } from './girls'
import { useMemoryStore } from './memory'
import { callLLM } from '@/api/llm'

export const useGameStore = defineStore('game', () => {
  // 资源状态
  const gold = ref(1000)
  const day = ref(1)
  const energy = ref(100)

  // 游戏日志 (Chat History)
  const logs = ref([
    { 
      id: 1, 
      type: 'system', 
      text: '欢迎来到 **异世界娼馆**。作为新任店主，你接手了这家 *破旧* 的店铺...', 
      timestamp: new Date().toLocaleTimeString() 
    },
    { 
      id: 2, 
      type: 'npc', 
      name: '爱丽丝', 
      text: '店主大人，早上好！今天我们要先做点什么呢？', 
      avatar: 'npc_1',
      timestamp: new Date().toLocaleTimeString() 
    }
  ])

  function addLog(log) {
    logs.value.push({
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...log
    })
  }

  // AI 指令处理中间件
  function processAIResponse(fullText) {
    // 1. 尝试提取 JSON 块
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = fullText.match(jsonRegex);
    
    let displayText = fullText;
    
    if (match) {
      try {
        const jsonStr = match[1];
        const commands = JSON.parse(jsonStr);
        const girlsStore = useGirlsStore();
        const memoryStore = useMemoryStore();
        
        console.log('[AI Protocol] Executing commands:', commands);

        // 2. 移除 JSON 得到纯剧情文本
        displayText = fullText.replace(match[0], '').trim();

        // 3. 执行指令
        if (Array.isArray(commands)) {
          commands.forEach(cmd => {
            switch (cmd.type) {
              case 'UPDATE_GIRL':
                // { type: 'UPDATE_GIRL', id: 'g001', data: { sanity: -5 } }
                if (cmd.id && cmd.data) {
                  girlsStore.updateGirlStatus(cmd.id, cmd.data);
                }
                break;
              
              case 'ADD_GOLD':
                // { type: 'ADD_GOLD', amount: 100 }
                if (typeof cmd.amount === 'number') {
                  gold.value += cmd.amount;
                }
                break;

              case 'SYSTEM_NOTICE':
                // { type: 'SYSTEM_NOTICE', text: '...' }
                if (cmd.text) {
                  addLog({ type: 'system', text: cmd.text });
                }
                break;

              // --- 记忆系统指令 ---
              case 'SAVE_EVENT':
                // { type: 'SAVE_EVENT', description: '...', importance: 5, npcs: [] }
                if (cmd.description) {
                  memoryStore.addEvent(
                    cmd.description, 
                    day.value, 
                    'narrative', 
                    cmd.npcs || [], 
                    cmd.importance || 5
        );
                  console.log('[Memory] Event saved:', cmd.description);
                }
                break;

              case 'SAVE_FACT':
                // { type: 'SAVE_FACT', npcId: '...', content: '...' }
                if (cmd.npcId && cmd.content) {
                  memoryStore.addFact(cmd.npcId, cmd.content);
                  console.log('[Memory] Fact saved:', cmd.content);
                }
                break;

              default:
                console.warn('[AI Protocol] Unknown command type:', cmd.type);
            }
          });
        }
      } catch (e) {
        console.error('[AI Protocol] Failed to parse AI commands:', e);
        // 如果解析失败，保留原文，避免剧情丢失
      }
    }
    
    return displayText;
  }

  // 核心交互逻辑：发送消息
  async function sendMessage(text) {
    if (!text || !text.trim()) return

    // 1. 添加玩家日志
    addLog({
      type: 'player',
      text: text,
      name: '店主'
    })

    // 2. 准备上下文数据
    const girlsStore = useGirlsStore()
    const memoryStore = useMemoryStore()

    // 简单的关键词提取作为 memory recall 的 query
    // 实际项目中可能需要先调用一次 LLM 提取关键词，或者直接用整句
    const memoryContext = memoryStore.recall(text)

    const context = {
      gold: gold.value,
      day: day.value,
      girls: girlsStore.girls,
      memory: memoryContext // 注入记忆上下文
    }

    // 3. 调用 LLM
    // 添加一个临时的 loading log
    const loadingLogId = Date.now() + 1
    addLog({
      id: loadingLogId,
      type: 'system',
      text: 'AI 正在思考剧情...'
    })

    try {
      const aiResponse = await callLLM(text, context)
      
      // 移除 loading log
      deleteLog(loadingLogId)

      // 处理回复
      const cleanText = processAIResponse(aiResponse)
      
      addLog({
        type: 'npc',
        name: '系统', // 或者根据回复内容动态判断角色
        text: cleanText
      })

    } catch (error) {
      // 移除 loading log
      deleteLog(loadingLogId)
      
      console.error('AI Call Failed:', error)
      addLog({
        type: 'system',
        text: `(系统错误: ${error.message}。请在首页“系统设置”中检查 API 配置)`
      })
    }
  }

  function updateLog(id, newText) {
    const log = logs.value.find(l => l.id === id)
    if (log) {
      log.text = newText
    }
  }

  function deleteLog(id) {
    logs.value = logs.value.filter(l => l.id !== id)
  }

  // 重新生成逻辑
  async function regenerateLog(id) {
    const index = logs.value.findIndex(l => l.id === id)
    if (index !== -1) {
       logs.value.splice(index, 1)
       // TODO: 触发 AI 重新生成
       return true
    }
    return false
  }

  function clearLogs() {
    logs.value = []
  }

  function loadState(state) {
    if (state.gold !== undefined) gold.value = state.gold
    if (state.day !== undefined) day.value = state.day
    if (state.energy !== undefined) energy.value = state.energy
    if (state.logs !== undefined) logs.value = state.logs
  }

  return {
   gold,
    day,
    energy,
    logs,
    addLog,
    sendMessage,
    updateLog,
    deleteLog,
    regenerateLog,
    clearLogs,
    loadState
  }
})
