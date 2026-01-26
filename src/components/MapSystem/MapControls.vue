<script setup>
import { useMapStore } from '@/stores/map'
import { 
  PhCaretUp, 
  PhCaretDown, 
  PhCaretLeft, 
  PhCaretRight,
  PhHandPointing 
} from '@phosphor-icons/vue'

const mapStore = useMapStore()

function handleMove(dx, dy) {
  mapStore.movePlayer(dx, dy)
}

function handleInteract() {
  mapStore.triggerInteraction()
}
</script>

<template>
  <div class="map-controls">
    <!-- D-Pad -->
    <div class="d-pad">
      <button class="pad-btn up" @click="handleMove(0, -1)">
        <PhCaretUp weight="bold" />
      </button>
      <button class="pad-btn left" @click="handleMove(-1, 0)">
        <PhCaretLeft weight="bold" />
      </button>
      <button class="pad-btn right" @click="handleMove(1, 0)">
        <PhCaretRight weight="bold" />
      </button>
      <button class="pad-btn down" @click="handleMove(0, 1)">
        <PhCaretDown weight="bold" />
      </button>
      <div class="pad-center"></div>
    </div>

    <!-- Interaction Button -->
    <div class="action-area">
      <button 
        class="interact-btn" 
        :class="{ active: !!mapStore.interactTarget }"
        @click="handleInteract"
      >
        <PhHandPointing weight="fill" />
      </button>
      <span class="action-label" v-if="mapStore.interactTarget">
        交互
      </span>
    </div>
  </div>
</template>

<style scoped>
.map-controls {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
}

/* D-Pad 样式 */
.d-pad {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-template-rows: 50px 50px 50px;
  gap: 4px;
}

.pad-btn {
  background: rgba(46, 26, 71, 0.8);
  border: 1px solid #D4AF37;
  color: #D4AF37;
  font-size: 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.1s;
}

.pad-btn:active {
  background: #D4AF37;
  color: #1a0b2e;
  transform: scale(0.95);
}

.up { grid-column: 2; grid-row: 1; }
.left { grid-column: 1; grid-row: 2; }
.right { grid-column: 3; grid-row: 2; }
.down { grid-column: 2; grid-row: 3; }
.pad-center { grid-column: 2; grid-row: 2; background: rgba(0,0,0,0.2); border-radius: 50%; }

/* Action Button 样式 */
.action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.interact-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(20, 10, 30, 0.8);
  border: 2px solid #555;
  color: #aaa;
  font-size: 2.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}

.interact-btn.active {
  border-color: #D4AF37;
  color: #D4AF37;
  background: rgba(74, 20, 140, 0.6);
  box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
  animation: pulse 2s infinite;
}

.interact-btn:active {
  transform: scale(0.9);
}

.action-label {
  font-size: 0.8rem;
  color: #D4AF37;
  font-weight: bold;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
  100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
}
</style>
