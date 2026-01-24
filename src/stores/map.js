import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMapStore = defineStore('map', () => {
  // 状态
  const currentFloor = ref(1)
  const playerPos = ref({ x: 6, y: 10 }) // 初始在入口附近
  const isMapActive = ref(false)

  // 区域定义 (元数据)
  const zoneMeta = {
    0: { name: '墙壁', passable: false, color: 'transparent' },
    1: { name: '厕所', passable: true, color: '#4a3b3b', desc: '味道不太好闻...' },
    2: { name: '仓库', passable: true, color: '#3e2723', desc: '堆满了杂物。' },
    3: { name: '酒客包厢', passable: true, color: '#5d4037', desc: '私密的谈话空间。' },
    4: { name: '吟游诗人舞台', passable: true, color: '#795548', desc: '音乐从这里传来。' },
    5: { name: '酒馆大厅', passable: true, color: '#8d6e63', desc: '热闹非凡，人声鼎沸。' },
    6: { name: '吧台', passable: true, color: '#a1887f', desc: '酒保正在擦拭杯子。' },
    7: { name: '厨房', passable: true, color: '#d7ccc8', desc: '闲人免进。' },
    8: { name: '大门入口', passable: true, color: '#555', desc: '寒风呼啸。' },
    9: { name: '吧台座位', passable: true, color: '#8d6e63', desc: '醉汉的栖息地。' }
  }

  // 地图矩阵设计 (13x12)
  // 对应你的手绘图布局
  const floor1Matrix = [
    [0, 0, 0, 2, 2, 2, 0, 3, 3, 3, 0, 0, 0], // Row 0
    [1, 1, 1, 2, 2, 2, 0, 3, 3, 3, 0, 0, 0], // Row 1: 左厕所，中仓库，右酒客
    [1, 1, 1, 0, 5, 5, 5, 5, 5, 0, 6, 6, 6], // Row 2: 厕所下沿，中间是大厅，右边吧台
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 6, 6, 6], // Row 3
    [4, 4, 4, 0, 5, 5, 5, 5, 5, 0, 9, 9, 9], // Row 4: 左舞台，中大厅，右吧台座
    [4, 4, 4, 0, 5, 5, 5, 5, 5, 0, 9, 9, 9], // Row 5
    [4, 4, 4, 0, 5, 5, 5, 5, 5, 0, 9, 9, 9], // Row 6
    [0, 0, 0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0], // Row 7
    [7, 7, 7, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0], // Row 8: 左厨房
    [7, 7, 7, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0], // Row 9
    [7, 7, 7, 0, 8, 8, 8, 8, 8, 0, 0, 0, 0], // Row 10: 底部入口
    [0, 0, 0, 0, 8, 8, 8, 8, 8, 0, 0, 0, 0]  // Row 11
  ]

  const mapData = {
    1: {
      matrix: floor1Matrix,
      width: 13,
      height: 12,
      stairs: [
        { x: 2, y: 1, toFloor: 2, label: '上二楼' } // 假设厕所旁有楼梯
      ]
    }
    // 二楼三楼稍后按同样逻辑定义
  }

  // NPC 位置 (精确坐标)
  const npcs = ref([
    { id: 'bartender', name: '酒保', floor: 1, x: 11, y: 3, type: 'staff', icon: '🍺' },
    { id: 'girl_alice', name: '爱丽丝', floor: 1, x: 6, y: 5, type: 'girl', icon: '💃' }, // 大厅中间
    { id: 'dwarf', name: '矮人', floor: 1, x: 5, y: 6, type: 'customer', icon: '🧔' }
  ])

  // 获取当前位置的格子类型
  const currentTileType = computed(() => {
    const floor = mapData[currentFloor.value]
    if (!floor) return 0
    const row = floor.matrix[playerPos.value.y]
    return row ? row[playerPos.value.x] : 0
  })

  // 获取当前区域信息
  const currentZoneDesc = computed(() => {
    const type = currentTileType.value
    return zoneMeta[type] || zoneMeta[0]
  })

  const currentInteractables = computed(() => {
    // 检查 NPC (重叠或相邻)
    const nearbyNPCs = npcs.value.filter(npc => 
      npc.floor === currentFloor.value && 
      Math.abs(npc.x - playerPos.value.x) <= 1 && 
      Math.abs(npc.y - playerPos.value.y) <= 1
    )
    
    // 检查楼梯 (重叠)
    const floor = mapData[currentFloor.value]
    const stair = floor?.stairs?.find(s => s.x === playerPos.value.x && s.y === playerPos.value.y)

    return { npcs: nearbyNPCs, stair }
  })

  function move(dx, dy) {
    const floor = mapData[currentFloor.value]
    const nextX = playerPos.value.x + dx
    const nextY = playerPos.value.y + dy

    // 1. 越界检查
    if (nextX < 0 || nextX >= floor.width || nextY < 0 || nextY >= floor.height) return

    // 2. 墙壁检查
    const tileType = floor.matrix[nextY][nextX]
    const tileInfo = zoneMeta[tileType]
    if (!tileInfo || !tileInfo.passable) return // 撞墙

    playerPos.value = { x: nextX, y: nextY }
  }

  function toggleMap() {
    isMapActive.value = !isMapActive.value
  }

  return {
    currentFloor,
    playerPos,
    isMapActive,
    mapData,
    zoneMeta,
    npcs,
    currentZoneDesc,
    currentInteractables,
    move,
    toggleMap
  }
})
