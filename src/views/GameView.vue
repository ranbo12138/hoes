<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useGameStore } from '@/stores/game'
/* import { useMapStore } from '@/stores/map' */

import GameHUD from '@/components/Game/GameHUD.vue'
import GameLogList from '@/components/Game/GameLogList.vue'
import GameInputBar from '@/components/Game/GameInputBar.vue'
/* import GameMap from '@/components/MapSystem/GameMap.vue' */
import GirlsPanel from '@/components/Game/Panel/GirlsPanel.vue'
import RecruitPanel from '@/components/Game/Panel/RecruitPanel.vue'
import SchedulePanel from '@/components/Game/Panel/SchedulePanel.vue'
import MarketPanel from '@/components/Game/Panel/MarketPanel.vue'
import saveApi from '@/api/save'
import bgImg from '@/assets/bg_main.jpg'

const router = useRouter()
const gameStore= useGameStore()
/* const mapStore = useMapStore() */

const showGirlsPanel = ref(false)
const showRecruitPanel = ref(false)
const showSchedulePanel = ref(false)
const showMarketPanel = ref(false)

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

function handleMarketPanel() {
  showMarketPanel.value = true
}

function closeMarketPanel() {
  showMarketPanel.value = false
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

/* function toggleMapMode() {
  // mapStore.toggleMap()
} */
</script>

<template>
  <div class="game-view" :style="{ backgroundImage: `url(${bgImg})` }">
    <div class="bg-overlay"></div>

    <!-- 新的 HUD 系统 -->
    <GameHUD 
      :showMap="false"
      :onToggleMap="() => {}"
      :onRecruit="handleRecruitPanel"
      :onSchedule="handleSchedulePanel"
      :onMarket="handleMarketPanel"
      :onGirls="handleGirlsPanel"
      :onSave="handleSave"
      :onLoad="handleLoad"
    />

    <!-- <transition name="fade">
      <GameMap v-if="mapStore.isMapActive" />
    </transition> -->

    <!-- 仅在非地图模式下显示日志和输入框 -->
    <div class="main-content-area">
      <GameLogList />
      <GameInputBar @send="handleSend" />
    </div>

    <!-- 弹窗面板区域 -->
    <Transition name="panel-fade">
      <GirlsPanel v-if="showGirlsPanel" @close="closeGirlsPanel" />
    </Transition>

    <Transition name="panel-fade">
      <RecruitPanel v-if="showRecruitPanel" @close="closeRecruitPanel" />
    </Transition>

    <Transition name="panel-fade">
      <SchedulePanel v-if="showSchedulePanel" @close="closeSchedulePanel" />
    </Transition>

    <Transition name="panel-fade">
      <MarketPanel v-if="showMarketPanel" @close="closeMarketPanel" />
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
}

.bg-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(10, 5, 20, 0.8); /* 稍微降低透明度，配合噪点 */
  z-index: 0;
}

.main-content-area {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: 80px; /* 为顶部 HUD 留出空间 (Day Widget 高度约 72px) */
  height: 100%;
}

/* 适配移动端：内容区域调整 */
@media (max-width: 600px) {
  .main-content-area {
    padding-top: 60px; /* 移动端 HUD 较小 */
    padding-bottom: 80px; /* 为底部 HUD Action Bar 留出空间 */
  }
}

.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panel-fade-enter-from,
.panel-fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
