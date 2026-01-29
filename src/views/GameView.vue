<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGameStore } from '@/stores/game'
import { useMapStore } from '@/stores/map'
import TopBar from '@/components/Base/TopBar.vue' 
import GameLogList from '@/components/Game/GameLogList.vue'
import GameInputBar from '@/components/Game/GameInputBar.vue'
import GameMap from '@/components/MapSystem/GameMap.vue'
import GirlsPanel from '@/components/Game/Panel/GirlsPanel.vue'
import RecruitPanel from '@/components/Game/Panel/RecruitPanel.vue'
import SchedulePanel from '@/components/Game/Panel/SchedulePanel.vue'
import saveApi from '@/api/save'
import bgImg from '@/assets/bg_main.jpg'

// 引入图标
import { 
  PhCoins, 
  PhCalendarBlank, 
  PhMapTrifold, 
  PhArrowUUpLeft, 
  PhHeart,
  PhUserPlus,
  PhFloppyDisk,
  PhArrowCounterClockwise,
  PhClipboardText
} from '@phosphor-icons/vue'

const router = useRouter()
const gameStore = useGameStore()
const mapStore = useMapStore()

const showGirlsPanel = ref(false)
const showRecruitPanel = ref(false)
const showSchedulePanel = ref(false)

async function handleSend(text) {

  await gameStore.sendMessage(text)
}

function handleGirlsPanel() {
  showGirlsPanel.value = true
}

function handleRecruitPanel() {
  showRecruitPanel.value = true
}

function closeGirlsPanel() {
  showGirlsPanel.value = false
}

function closeRecruitPanel() {
  showRecruitPanel.value = false
}

function handleSchedulePanel() {
  showSchedulePanel.value = true
}

function closeSchedulePanel() {
  showSchedulePanel.value = false
}

async function handleSave() {
  const result = await saveApi.saveGame()
  if (result.success) {
    gameStore.addLog({ type: 'system', text: '游戏已保存。' })
  } else {
    gameStore.addLog({ type: 'system', text: '保存失败！' })
  }
}

async function handleLoad() {
  const result = await saveApi.loadGame()
  if (result.success) {
    gameStore.addLog({ type: 'system', text: '游戏已读取。' })
  } else {
    gameStore.addLog({ type: 'system', text: '读取失败或没有存档。' })
  }
}

function handleGoBack() {

  router.push('/')
}

function toggleMapMode() {
  mapStore.toggleMap()
}
</script>

<template>
  <div class="game-view" :style="{ backgroundImage: `url(${bgImg})` }">
    <div class="bg-overlay"></div>

    <TopBar :showBack="true" :onBack="handleGoBack" title="经营中">
      <template #center>
        <div class="resource-bar">
          <div class="res-item">
            <PhCoins weight="fill" class="res-icon gold" />
            <span class="val">{{ gameStore.gold }}</span>
          </div>
          <div class="divider-v"></div>
          <div class="res-item">
            <PhCalendarBlank weight="bold" class="res-icon" />
            <span class="val">Day {{ gameStore.day }}</span>
          </div>
        </div>
      </template>

      <template #right>
        <!-- 地图切换按钮 -->
        <button class="top-icon-btn" @click="toggleMapMode" :title="mapStore.isMapActive ? '关闭地图' : '打开地图'">
           <component 
             :is="mapStore.isMapActive ? PhArrowUUpLeft : PhMapTrifold" 
             weight="bold" 
             class="action-icon"
           />
        </button>

        <div class="divider-v"></div>

        <button class="top-icon-btn" @click="handleRecruitPanel" title="人才市场">
           <PhUserPlus weight="bold" class="action-icon" />
        </button>

        <button class="top-icon-btn" @click="handleSchedulePanel" title="日程安排">
           <PhClipboardText weight="bold" class="action-icon" />
        </button>

        <div class="divider-v"></div>

        <button class="top-icon-btn" @click="handleSave" title="保存">
           <PhFloppyDisk weight="bold" class="action-icon" />
        </button>
        <button class="top-icon-btn" @click="handleLoad" title="读取">
           <PhArrowCounterClockwise weight="bold" class="action-icon" />
        </button>

        <div class="divider-v"></div>

        <button class="top-icon-btn" @click="handleGirlsPanel" title="妓女状态">
           <PhHeart weight="fill" class="action-icon pink" /> <!-- 替换为 PhHeart -->
        </button>
      </template>
    </TopBar>

    <transition name="fade">
      <GameMap v-if="mapStore.isMapActive" />
    </transition>

    <GameLogList v-show="!mapStore.isMapActive" />

    <GameInputBar v-show="!mapStore.isMapActive" @send="handleSend" />

    <Transition name="panel-fade">
      <GirlsPanel v-if="showGirlsPanel" @close="closeGirlsPanel" />
    </Transition>

    <Transition name="panel-fade">
      <RecruitPanel v-if="showRecruitPanel" @close="closeRecruitPanel" />
    </Transition>

    <Transition name="panel-fade">
      <SchedulePanel v-if="showSchedulePanel" @close="closeSchedulePanel" />
    </Transition>
  </div>
</template>


<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  padding-top: var(--header-height, 48px);
}

.bg-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(10, 5, 20, 0.9);
  z-index: 0;
}

.resource-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.res-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--color-gold);
}

.res-icon {
  font-size: 1.1rem;
}
.res-icon.gold { color: #FFD700; }

.divider-v {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.2);
}

.top-icon-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  opacity: 0.8;
  margin: 0 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  font-size: 1.3rem;
  color: var(--color-gold);
}

.action-icon.pink {
  color: #FF69B4;
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s var(--ease-out-back);
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
