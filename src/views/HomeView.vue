<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/Base/BaseButton.vue'
import BasePanel from '@/components/Base/BasePanel.vue'
import SettingsModal from '@/components/SettingsModal.vue'
import { useSystemStore } from '@/stores/system'
import saveApi from '@/api/save'
import bgImg from '@/assets/bg_main.jpg'
import logoImg from '@/assets/logo_original.jpg'
import AutoTransparentImage from '@/components/Base/AutoTransparentImage.vue'

const router = useRouter()
const systemStore = useSystemStore()
const hasLogo = ref(true)
const showSettings = ref(false)
const settingsMode = ref('general') // 'general' | 'ai'

function handleImageError() {
  hasLogo.value = false
}

async function handleStart() {
  console.log('--- Handle Start Clicked ---')
  try {
    systemStore.startGame()
    console.log('Game Started in Store, navigating...')
    await router.push({ name: 'game' })
    console.log('Navigation successful')
  } catch (e) {
    console.error('Navigation failed:', e)
    alert('无法进入游戏，请检查控制台错误信息。')
  }
}

async function handleLoad() {
  console.log('Load clicked')
  try {
    const result = await saveApi.loadGame('auto')
    if (result.success) {
      systemStore.startGame() // 标记游戏状态为运行中
      console.log('Load success, navigating...')
      await router.push({ name: 'game' })
    } else {
      alert('未找到存档记录。请先开始游戏并保存。')
    }
  } catch (e) {
    console.error('Load failed:', e)
    alert('读取存档失败，请查看控制台错误。')
  }
}

function handleSettings() {
  console.log('Settings clicked')
  settingsMode.value = 'general'
  showSettings.value = true
}

function handleAISettings() {
  console.log('AI Settings clicked')
  settingsMode.value = 'ai'
  showSettings.value = true
}

onMounted(() => {
  console.log('HomeView Mounted')
})
</script>

<template>
  <div class="home-view" :style="{ backgroundImage: `url(${bgImg})` }">
    <!-- 遮罩层: 确保 pointer-events: none -->
    <div class="overlay"></div>

    <div class="content-wrapper">
      <div class="title-section">
        <AutoTransparentImage 
          v-if="hasLogo" 
          :src="logoImg" 
          :threshold="30"
          class="game-logo-wrapper"
        />

        <div v-else class="text-fallback">
          <h1 class="main-title" data-text="异世界娼馆">异世界娼馆</h1>
          <h2 class="sub-title">模拟器</h2>
        </div>
      </div>

      <!-- 菜单导航区域 -->
      <BasePanel class="menu-nav-panel">
        <nav class="menu-nav">
          <!-- 增加一个原生按钮用于对比测试（隐藏，如果 BaseButton 不行可以临时打开） -->
          <!-- <button @click="handleStart" style="z-index:999; padding: 20px;">原生测试按钮</button> -->

          <BaseButton class="menu-item" @click="handleStart">开始经营</BaseButton>
          <BaseButton class="menu-item" variant="secondary" @click="handleLoad">读取记录</BaseButton>
          <BaseButton class="menu-item" variant="secondary" @click="handleSettings">系统设置</BaseButton>
          <BaseButton class="menu-item" variant="secondary" @click="handleAISettings">AI 连接</BaseButton>
        </nav>
      </BasePanel>

      <footer class="version-info">
        v{{ systemStore.version }} - Early Access
      </footer>
    </div>

    <Transition name="fade">
      <SettingsModal 
        v-if="showSettings" 
        :panel-type="settingsMode"
        @close="showSettings = false" 
      />
    </Transition>
  </div>
</template>

<style scoped>
.home-view {
  width: 100vw;
  height: 100vh;
  position: relative;
  background-color: var(--color-purple-deep);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%);
  z-index: 1;
  pointer-events: none; /* 关键：确保不阻挡点击 */
}

.content-wrapper {
  position: relative;
  z-index: 10; /* 提高层级 */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px; 
}

.title-section {
  text-align: center;
  margin-bottom: 40px; 
  animation: float 4s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  pointer-events: none; /* 标题不应阻挡交互 */
}
/* 标题内部的图片需要恢复 pointer-events 吗？暂时不需要 */

.game-logo-wrapper {
  max-width: 600px;
  width: 80%;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.3));
}

.text-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  font-family: var(--font-main);
  font-size: clamp(2.5rem, 10vw, 6rem);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  line-height: 1.2;
  text-align: center;
  
  background: linear-gradient(to bottom, #FFF8E1 0%, var(--color-gold) 50%, var(--color-gold-shadow) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  filter: drop-shadow(0 2px 0 var(--color-gold-shadow)) drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
}

.sub-title {
  font-family: var(--font-main);
  font-size: clamp(1.2rem, 5vw, 3rem);
  margin-top: 8px;
  color: var(--text-main);
  letter-spacing: 0.5rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.menu-nav-panel {
  min-width: 300px; /* 稍微加宽面板 */
  width: 90%;
  max-width: 420px;
  padding: 40px 30px;
  background: rgba(20, 10, 30, 0.6);
  pointer-events: auto; 
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 增加间距 */
  align-items: center;
}

.menu-item {
  width: 100%;
}

.version-info {
  position: absolute;
  bottom: 10px;
  right: 10px; 
  color: var(--text-dim);
  font-size: 0.7rem;
  text-shadow: 0 1px 2px rgba(0,0,0,1);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
