import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useGameStore } from './game'

export const useMapStore = defineStore('map', () => {
  const gameStore = useGameStore()
  
  // --- 状态 State ---
  const isMapActive = ref(false)
  const currentFloor = ref(1) // 1, 2, 3
  
  // 玩家状态
  const player = ref({
    x: 4,
    y: 4,
    direction: 'down' // up, down, left, right
  })

  // 交互状态
  const showInteractionMenu = ref(false)
  const currentTarget = ref(null) // 当前面对的 NPC 或物体

  // --- 地图数据 Data (Mock) ---
  // 0: 空地/地板, 1: 墙壁, 2: 楼梯, 3: 装饰物
  const mapSize = { w: 10, h: 10 } // 10x10 网格示例
  
  // 区域定义：用于顶部弹窗描述
  // 格式: { floor, x1, y1, x2, y2, name, desc }
  const zones = [
    { 
      floor: 1, x1: 0, y1: 0, x2: 9, y2: 6, 
      name: '酒馆大厅', 
      desc: '客似云来，波波看样子喝了很多。矮人们正在嚷嚷着要更烈的酒。' 
    },
    { 
      floor: 1, x1: 0, y1: 7, x2: 4, y2: 9, 
      name: '后厨通道', 
      desc: '空气中弥漫着烤肉和香料的味道，厨师正在忙碌地备餐。' 
    },
    { 
      floor: 2, x1: 0, y1: 0, x2: 9, y2: 9, 
      name: '二楼客房区', 
      desc: '这里相对安静，走廊里传来隐约的嬉笑声和床架的摇晃声。' 
    }
  ]

  // NPC 数据
  // type: 'guest' | 'staff' | 'girl'
  const npcs = ref([
    { id: 'girl_1', name: '爱丽丝', type: 'girl', floor: 1, x: 5, y: 3, avatar: '👱‍♀️' },
    { id: 'staff_1', name: '老约翰', type: 'staff', floor: 1, x: 2, y: 2, avatar: '🧔' },
    { id: 'guest_1', name: '醉酒矮人', type: 'guest', floor: 1, x: 6, y: 5, avatar: '🍺' }
  ])

  // --- Getters ---
  
  // 获取当前区域描述
  const currentZoneInfo = computed(() => {
    const p = player.value
    const zone = zones.find(z => 
      z.floor === currentFloor.value && 
      p.x >= z.x1 && p.x <= z.x2 && 
      p.y >= z.y1 && p.y <= z.y2
    )
    return zone || { name: '未知区域', desc: '这里昏暗不清，没有什么特别的。' }
  })

  // 获取玩家正前方的坐标
  const facingCoords = computed(() => {
    const { x, y, direction } = player.value
    let targetX = x
    let targetY = y
    if (direction === 'up') targetY -= 1
    if (direction === 'down') targetY += 1
    if (direction === 'left') targetX -= 1
    if (direction === 'right') targetX += 1
    return { x: targetX, y: targetY }
  })

  // 检测正前方是否有可交互对象
  const interactTarget = computed(() => {
    const { x, y } = facingCoords.value
    // 检查 NPC
    const npc = npcs.value.find(n => n.floor === currentFloor.value && n.x === x && n.y === y)
    if (npc) return npc
    return null
  })

  // --- Actions ---

  function toggleMap() {
    isMapActive.value = !isMapActive.value
  }

  function movePlayer(dx, dy) {
    if (showInteractionMenu.value) return // 菜单打开时禁止移动

    // 更新朝向
    if (dx > 0) player.value.direction = 'right'
    if (dx < 0) player.value.direction = 'left'
    if (dy > 0) player.value.direction = 'down'
    if (dy < 0) player.value.direction = 'up'

    const newX = player.value.x + dx
    const newY = player.value.y + dy

    // 边界检查
    if (newX < 0 || newX >= mapSize.w || newY < 0 || newY >= mapSize.h) return

    // 碰撞检查 (简单的墙壁/NPC碰撞)
    const isNpcHere = npcs.value.some(n => n.floor === currentFloor.value && n.x === newX && n.y === newY)
    if (isNpcHere) return // 撞到人了

    // 移动
    player.value.x = newX
    player.value.y = newY
  }

  function triggerInteraction() {
    const target = interactTarget.value
    if (target) {
      currentTarget.value = target
      showInteractionMenu.value = true
    } else {
      // 如果前面没人，可能是调查环境
      gameStore.sendMessage(`(调查环境) ${currentZoneInfo.value.desc}`)
    }
  }

  function closeInteraction() {
    showInteractionMenu.value = false
    currentTarget.value = null
  }

  // 执行具体交互指令
  async function executeAction(actionType, subType = null) {
    const target = currentTarget.value
    if (!target) return

    let text = ''
    
    if (target.type === 'girl') {
      if (actionType === 'follow') {
        text = `我对${target.name}说：跟我上楼。❤️`
      } else if (actionType === 'train') {
        text = `我对${target.name}进行调教（${subType}）。🥵`
      } else {
        text = `我和${target.name}进行了日常交谈。`
      }
    } else {
      // 客人或员工
      text = `我与${target.name}进行了互动。`
    }

    // 发送到主游戏 Log
    await gameStore.sendMessage(text)
    
    closeInteraction()
  }

  return {
    isMapActive,
    currentFloor,
    player,
    npcs,
    currentZoneInfo,
    interactTarget,
    showInteractionMenu,
    currentTarget,
    toggleMap,
    movePlayer,
    triggerInteraction,
    closeInteraction,
    executeAction
  }
})
