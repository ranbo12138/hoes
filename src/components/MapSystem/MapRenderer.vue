<script setup>
import { computed } from 'vue'
import { useMapStore } from '@/stores/map'
import { 
  PhUser, 
  PhHeart, 
  PhBeerBottle,
  PhUserCircle
} from '@phosphor-icons/vue'

const mapStore = useMapStore()

const gridStyle = computed(() => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(10, 1fr)`,
    gridTemplateRows: `repeat(10, 1fr)`,
    width: '100%',
    aspectRatio: '1/1',
    background: '#1a0b2e',
    border: '2px solid #D4AF37',
    position: 'relative'
  }
})

function getNpcStyle(npc) {
  return {
    gridColumnStart: npc.x + 1,
    gridRowStart: npc.y + 1,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5
  }
}

const playerStyle = computed(() => {
  return {
    gridColumnStart: mapStore.player.x + 1,
    gridRowStart: mapStore.player.y + 1,
    zIndex: 10,
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

// 根据类型返回图标组件
function getNpcIcon(type) {
  switch (type) {
    case 'girl': return PhHeart
    case 'guest': return PhBeerBottle
    case 'staff': return PhUser
    default: return PhUser
  }
}

function getNpcColor(type) {
  switch (type) {
    case 'girl': return '#FF69B4'
    case 'guest': return '#A0522D'
    case 'staff': return '#87CEEB'
    default: return '#fff'
  }
}
</script>

<template>
  <div class="map-viewport">
    <div class="map-grid" :style="gridStyle">
      <!-- 地板纹理 -->
      <div class="floor-texture"></div>

      <!-- 渲染 NPC -->
      <div 
        v-for="npc in mapStore.npcs" 
        :key="npc.id"
        v-show="npc.floor === mapStore.currentFloor"
        class="map-entity npc"
        :style="getNpcStyle(npc)"
      >
        <component 
          :is="getNpcIcon(npc.type)" 
          weight="fill" 
          :style="{ color: getNpcColor(npc.type), fontSize: '1.6rem' }" 
        />
      </div>

      <!-- 渲染玩家 -->
      <div class="map-entity player" :class="mapStore.player.direction" :style="playerStyle">
        <div class="player-wrapper">
          <PhUserCircle weight="fill" style="color: #FFD700; fontSize: 2rem;" />
          <div class="direction-indicator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.map-viewport {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.floor-texture {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: 
    linear-gradient(45deg, #251438 25%, transparent 25%), 
    linear-gradient(-45deg, #251438 25%, transparent 25%), 
    linear-gradient(45deg, transparent 75%, #251438 75%), 
    linear-gradient(-45deg, transparent 75%, #251438 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  opacity: 0.3;
}

.player-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.direction-indicator {
  position: absolute;
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 5px solid #D4AF37;
  top: 50%;
  left: 50%;
  transform-origin: center -12px;
  transition: transform 0.2s ease;
}

/* 根据方向旋转箭头 */
.player.up .direction-indicator { transform: translate(-50%, -50%) rotate(0deg) translateY(-20px); }
.player.down .direction-indicator { transform: translate(-50%, -50%) rotate(180deg) translateY(-20px); }
.player.left .direction-indicator { transform: translate(-50%, -50%) rotate(-90deg) translateY(-20px); }
.player.right .direction-indicator { transform: translate(-50%, -50%) rotate(90deg) translateY(-20px); }
</style>
