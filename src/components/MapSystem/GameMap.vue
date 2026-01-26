<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMapStore } from '@/stores/map'
import MapRenderer from './MapRenderer.vue'
import MapControls from './MapControls.vue'
import MapDashboard from './MapDashboard.vue'
import InteractionMenu from './InteractionMenu.vue'

const mapStore = useMapStore()

// 键盘控制支持
function handleKeydown(e) {
  if (mapStore.showInteractionMenu) return

  switch(e.key) {
    case 'ArrowUp': mapStore.movePlayer(0, -1); break;
    case 'ArrowDown': mapStore.movePlayer(0, 1); break;
    case 'ArrowLeft': mapStore.movePlayer(-1, 0); break;
    case 'ArrowRight': mapStore.movePlayer(1, 0); break;
    case 'Enter': mapStore.triggerInteraction(); break;
    case 'Escape': mapStore.toggleMap(); break;
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="game-map-container">
    <MapDashboard />
    
    <div class="map-center-area">
      <MapRenderer />
    </div>

    <div class="map-bottom-area">
      <MapControls />
    </div>

    <InteractionMenu />
  </div>
</template>

<style scoped>
.game-map-container {
  position: absolute;
  top: 0; 
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20; /* 确保覆盖在 Log 层之上，但在 TopBar 之下(TopBar 是 fixed) */
  background: #10051a; /* 深色背景防止透出下面的 Log */
  display: flex;
  flex-direction: column;
  padding-top: var(--header-height, 48px); /* 避开 TopBar */
}

.map-center-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.map-bottom-area {
  padding-bottom: 20px;
}
</style>
