<script setup>
import { computed } from 'vue'
import { useMapStore } from '@/stores/map'
import { useGameStore } from '@/stores/game'

const mapStore = useMapStore()
const gameStore = useGameStore()

// 计算网格 CSS 样式
const gridStyle = computed(() => {
  const floor = mapStore.mapData[mapStore.currentFloor]
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${floor.width}, 1fr)`,
    gridTemplateRows: `repeat(${floor.height}, 1fr)`,
    gap: '2px', // 细缝，体现地砖感
    width: '100%',
    aspectRatio: `${floor.width}/${floor.height}` // 保持比例
  }
})

// 展平矩阵以便 v-for 渲染，同时携带坐标信息
const flattenedTiles = computed(() => {
  const floor = mapStore.mapData[mapStore.currentFloor]
  const tiles = []
  if (!floor) return []
  
  for (let y = 0; y < floor.height; y++) {
    for (let x = 0; x < floor.width; x++) {
      const type = floor.matrix[y][x]
      tiles.push({ x, y, type, meta: mapStore.zoneMeta[type] })
    }
  }
  return tiles
})

function handleInteract() {
  const { npcs, stair } = mapStore.currentInteractables
  
  if (stair) {
    if (confirm(`是否要 ${stair.label}?`)) {
      // 切换楼层逻辑暂略
      alert('上楼功能开发中')
    }
    return
  }

  if (npcs.length > 0) {
    const target = npcs[0]
    showInteractionMenu(target)
  } else {
    gameStore.addLog({ type: 'system', text: `你观察四周：${mapStore.currentZoneDesc.desc}` })
  }
}

function showInteractionMenu(npc) {
  if (npc.type === 'girl') {
    // 实际项目中应使用自定义弹窗而非 prompt
    const action = prompt(`对 ${npc.name} 做什么?\n1. 跟我上楼 ❤️\n2. 调教 🥵\n3. 查看状态`)
    if (action === '1') {
      gameStore.addLog({ type: 'player', text: `我对 ${npc.name} 说：跟我上楼。`, name: '店主' })
      gameStore.addLog({ type: 'npc', text: '好的，主人❤️', name: npc.name })
    } else if (action === '2') {
      gameStore.addLog({ type: 'player', text: `准备调教 ${npc.name}...`, name: '店主' })
    }
  } else {
    alert(`与 ${npc.name} 交互`)
  }
}
</script>

<template>
  <div class="map-overlay">
    <!-- 顶部实时区域概况 -->
    <div class="zone-info-banner">
      <div class="zone-name">{{ mapStore.currentZoneDesc.name }}</div>
      <div class="zone-desc">⏏️ {{ mapStore.currentZoneDesc.desc }}</div>
    </div>

   <!-- 地图可视区域 -->
    <div class="map-viewport">
      <div :style="gridStyle" class="map-grid">
        <div 
          v-for="(tile, index) in flattenedTiles" 
          :key="index"
          class="map-tile"
          :class="{ 
            'is-wall': tile.type === 0,
            'is-hall': tile.type === 5,
            'is-active': tile.x === mapStore.playerPos.x && tile.y === mapStore.playerPos.y
          }"
          :style="{ backgroundColor: tile.type === 0 ? 'transparent' : tile.meta.color }"
        >
          <!-- 玩家 -->
          <div v-if="tile.x === mapStore.playerPos.x && tile.y === mapStore.playerPos.y" class="entity player">
            🧙‍♂️
          </div>

          <!-- NPC -->
          <div v-for="npc in mapStore.npcs.filter(n => n.floor === mapStore.currentFloor && n.x === tile.x && n.y === tile.y)" :key="npc.id" class="entity npc">
            {{ npc.icon }}
          </div>
          
          <!-- 楼梯 -->
           <div v-if="mapStore.mapData[mapStore.currentFloor].stairs.find(s => s.x === tile.x && s.y === tile.y)" class="entity stair">
            🪜
          </div>
        </div>
      </div>
    </div>

    <!-- 底部控制器 -->
    <div class="map-controls">
      <div class="d-pad">
        <div class="d-row">
          <button class="d-btn up" @click="mapStore.move(0, -1)">▲</button>
        </div>
        <div class="d-row">
          <button class="d-btn left" @click="mapStore.move(-1, 0)">◀</button>
          <button class="d-btn center interact-btn" @click="handleInteract">🔘</button>
          <button class="d-btn right" @click="mapStore.move(1, 0)">▶</button>
        </div>
        <div class="d-row">
          <button class="d-btn down" @click="mapStore.move(0, 1)">▼</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(13, 17, 23, 0.98);
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  /* 增加底部安全距离，确保 D-pad 不会被 Home 条遮挡 */
  padding-bottom: max(30px, var(--safe-bottom));
}

.zone-info-banner {
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid var(--accent);
  border-bottom: 1px solid var(--accent);
  padding: 8px;
  text-align: center;
  color: #fff;
}
.zone-name { font-weight: bold; color: #ffd700; font-size: 1.1rem; }
.zone-desc { font-size: 0.8rem; opacity: 0.8; }

.map-viewport {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  overflow: hidden;
}

.map-grid {
  width: 100%;
  max-width: 90vw;/* 适配手机宽度 */
}

.map-tile {
  position: relative;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem; /* 小图标 */
}

/* 墙壁样式 */
.is-wall {
  /* 即使是透明，也可以加点纹理表示不可走 */
  /* background-image: radial-gradient(#333 1px, transparent 1px); */
  /* background-size: 4px 4px; */
}

.entity {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  font-size: 1rem;
}
.player {
  z-index: 20;
  animation: bounce 0.5s infinite alternate;
  font-size: 1.2rem;
}

/* D-Pad Controls (复用之前的样式，略微调整尺寸) */
.map-controls {
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.d-pad { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.d-row { display: flex; gap: 8px; }
.d-btn {
  width: 50px; height: 50px;
  background: #333;
  border: 1px solid #555;
  border-radius: 8px;
  color: white;
  font-size: 1.2rem;
}
.d-btn:active { background: #444; }
.interact-btn {
  width: 60px; height: 60px;
  border-radius: 50%;
  background: #238636;
  font-size: 1.5rem;
}

@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
}
</style>
