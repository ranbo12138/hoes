<script setup>
import { useMapStore } from '@/stores/map'

const mapStore = useMapStore()
</script>

<template>
  <transition name="slide-down">
    <div v-if="mapStore.currentZoneInfo" class="map-dashboard">
      <div class="zone-header">
        <span class="floor-tag">{{ mapStore.currentFloor }}F</span>
        <span class="zone-name">{{ mapStore.currentZoneInfo.name }}</span>
      </div>
      <div class="zone-desc">
        ⏏️{{ mapStore.currentZoneInfo.desc }}
      </div>
    </div>
  </transition>
</template>

<style scoped>
.map-dashboard {
  position: absolute;
  /* 修改这里：避开 TopBar 的高度 */
  top: var(--header-height, 48px); 
  left: 0; 
  right: 0;
  background: rgba(20, 10, 30, 0.95);
  border-bottom: 2px solid #D4AF37;
  padding: 12px 16px;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.zone-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.floor-tag {
  background: #D4AF37;
  color: #1a0b2e;
  font-weight: bold;
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.zone-name {
  color: #D4AF37;
  font-weight: bold;
  font-size: 1rem;
}

.zone-desc {
  color: #e6edf3;
  font-size: 0.85rem;
  line-height: 1.4;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}
</style>
