<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGirlsStore } from '@/stores/girls'
import { useScheduleStore } from '@/stores/schedule'
import BasePanel from '@/components/Base/BasePanel.vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import { PhCaretLeft, PhCaretRight, PhSun, PhMoon, PhCoffee, PhX } from '@phosphor-icons/vue'
import type { TimeSlot } from '@/types/schedule'

const emit = defineEmits(['close'])
const girlsStore = useGirlsStore()
const scheduleStore = useScheduleStore()

// --- State ---
const currentIndex = ref(0)
const showTaskSelector = ref(false)
const selectingSlot = ref<TimeSlot | null>(null)

// --- Computed ---
const currentGirl = computed(() => {
  if (girlsStore.girls.length === 0) return null
  return girlsStore.girls[currentIndex.value]
})

const currentSchedule = computed(() => {
  if (!currentGirl.value) return null
  // 确保初始化
  scheduleStore.initScheduleForGirl(currentGirl.value.id)
  return scheduleStore.currentAssignments[currentGirl.value.id]
})

// --- Methods ---
function prevGirl() {
  if (currentIndex.value > 0) currentIndex.value--
}

function nextGirl() {
  if (currentIndex.value < girlsStore.girls.length - 1) currentIndex.value++
}

function openTaskSelector(slot: TimeSlot) {
  selectingSlot.value = slot
  showTaskSelector.value = true
}

function selectTask(taskId: string) {
  if (currentGirl.value && selectingSlot.value) {
    scheduleStore.setAssignment(currentGirl.value.id, selectingSlot.value, taskId)
    showTaskSelector.value = false
  }
}

function getTaskName(taskId: string | null) {
  if (!taskId) return '未安排'
  const t = scheduleStore.tasks.find(task => task.id === taskId)
  return t ? t.name : '未知'
}

function handleExecute() {
  scheduleStore.executeDay()
  emit('close')
}

// Icons mapping
const SLOT_ICONS = {
  morning: PhSun,
  afternoon: PhCoffee,
  night: PhMoon
}

const SLOT_NAMES = {
  morning: '早晨',
  afternoon: '下午',
  night: '晚上'
}
</script>

<template>
  <div class="schedule-overlay">
    <BasePanel title="日程安排" class="schedule-panel">
      <!-- Close Button -->
      <button class="close-btn" @click="$emit('close')">
        <PhX weight="bold" />
      </button>

      <div v-if="!currentGirl" class="empty-state">
        目前没有员工，请先去人才市场招募。
      </div>

      <div v-else class="content-container">
        <!-- 1. Girl Switcher -->
        <div class="girl-switcher">
          <button class="nav-btn" :disabled="currentIndex === 0" @click="prevGirl">
            <PhCaretLeft size="24" />
          </button>
          
          <div class="girl-info">
            <span class="girl-name">{{ currentGirl.name }}</span>
            <span class="girl-status">
              体力: {{ currentGirl.dynamic.energy.current }}/{{ currentGirl.dynamic.energy.max }}
            </span>
          </div>

          <button class="nav-btn" :disabled="currentIndex === girlsStore.girls.length - 1" @click="nextGirl">
            <PhCaretRight size="24" />
          </button>
        </div>

        <!-- 2. Slots -->
        <div class="slots-container" v-if="currentSchedule">
          <div 
            v-for="slot in ['morning', 'afternoon', 'night'] as TimeSlot[]" 
            :key="slot"
            class="slot-card"
            @click="openTaskSelector(slot)"
          >
            <div class="slot-icon">
              <component :is="SLOT_ICONS[slot]" size="32" weight="duotone" />
            </div>
            <div class="slot-info">
              <span class="slot-label">{{ SLOT_NAMES[slot] }}</span>
              <span class="task-name">{{ getTaskName(currentSchedule[slot]) }}</span>
            </div>
          </div>
        </div>

        <!-- 3. Actions -->
        <div class="action-bar">
          <BaseButton @click="handleExecute">开始营业</BaseButton>
        </div>
      </div>

      <!-- Task Selector Overlay (Inner) -->
      <div v-if="showTaskSelector" class="task-selector-overlay" @click.self="showTaskSelector = false">
        <div class="selector-modal">
          <h3>选择工作</h3>
          <div class="task-list">
            <div 
              v-for="task in scheduleStore.tasks" 
              :key="task.id"
              class="task-item"
              @click="selectTask(task.id)"
            >
              <div class="task-header">
                <span class="t-name">{{ task.name }}</span>
                <span class="t-cost" :class="{ gain: task.costEnergy < 0 }">
                  {{ task.costEnergy > 0 ? `-${task.costEnergy}` : `+${Math.abs(task.costEnergy)}` }} 精力
                </span>
              </div>
              <div class="task-desc">{{ task.description }}</div>
            </div>
          </div>
        </div>
      </div>

    </BasePanel>
  </div>
</template>

<style scoped>
.schedule-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  padding: 20px;
}

.schedule-panel {
  width: 100%;
  max-width: 400px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(0,0,0,0.5);
  border-radius: 50%;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--color-gold-dark);
  color: var(--color-gold);
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 50;
  transition: all 0.2s;
}
.close-btn:hover { 
  transform: rotate(90deg); 
  background: rgba(0,0,0,0.8);
  border-color: var(--color-gold);
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Switcher */
.girl-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
}

.girl-info {
  text-align: center;
}
.girl-name { display: block; font-size: 1.2rem; font-weight: bold; color: #fff; }
.girl-status { font-size: 0.85rem; color: #aaa; }

.nav-btn {
  background: none; border: none; color: var(--color-gold); cursor: pointer;
  padding: 8px;
}
.nav-btn:disabled { color: #555; cursor: not-allowed; }

/* Slots */
.slots-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slot-card {
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.3);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer;
  transition: all 0.2s;
}
.slot-card:hover {
  background: rgba(255,215,0,0.05);
  border-color: var(--color-gold);
}

.slot-icon {
  margin-right: 16px;
  color: var(--color-gold);
}

.slot-info { display: flex; flex-direction: column; }
.slot-label { font-size: 0.8rem; color: #888; text-transform: uppercase; }
.task-name { font-size: 1.1rem; color: #eee; font-weight: bold; }

/* Action Bar */
.action-bar {
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

/* Task Selector */
.task-selector-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-end; /* Mobile friendly bottom sheet style */
  z-index: 100;
}

.selector-modal {
  width: 100%;
  background: #1a0b2e;
  border-top: 2px solid var(--color-gold);
  padding: 20px;
  border-radius: 16px 16px 0 0;
  animation: slide-up 0.3s ease-out;
  max-height: 70%;
  overflow-y: auto;
}

.selector-modal h3 {
  margin-top: 0;
  color: var(--color-gold);
  text-align: center;
  margin-bottom: 20px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  padding: 12px;
  background: rgba(255,255,255,0.05);
  border-radius: 6px;
  cursor: pointer;
}
.task-item:hover { background: rgba(255,255,255,0.1); }

.task-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.t-name { font-weight: bold; color: #eee; }
.t-cost { font-size: 0.9rem; color: #E74C3C; }
.t-cost.gain { color: #2ECC71; }

.task-desc { font-size: 0.8rem; color: #888; }

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
</style>
