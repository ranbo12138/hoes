<script setup>
import { ref } from 'vue' // 引入 ref
import { useRouter } from 'vue-router'
import BaseButton from '@/components/Base/BaseButton.vue'
import { useSystemStore } from '@/stores/system'
import bgImg from '@/assets/bg_main.jpg'
import logoImg from '@/assets/logo_original.jpg' // 改为引用 jpg 原图

import AutoTransparentImage from '@/components/Base/AutoTransparentImage.vue'

const router = useRouter()
const systemStore = useSystemStore()
const hasLogo = ref(true) // 默认假设有 Logo

function handleImageError() {
  hasLogo.value = false // 图片加载失败时回退到文字
}

function handleStart() {
  console.log('Starting new game...')
  systemStore.startGame()
  router.push('/game') 
}

function handleLoad() {
  console.log('Loading save...')
  alert('打开存档界面')
}

function handleSettings() {
  console.log('Opening settings...')
  alert('打开设置')
}
</script>

<template>
  <div class="home-view" :style="{ backgroundImage: `url(${bgImg})` }">
    <!-- 遮罩层 -->
    <div class="overlay"></div>

    <div class="content-wrapper">
      <div class="title-section">
        <!-- 使用自动去黑底组件 -->
        <AutoTransparentImage 
          v-if="hasLogo" 
          :src="logoImg" 
          :threshold="30"
          class="game-logo-wrapper"
        />

        <!-- 如果没图片（或加载失败），显示原来的 CSS 艺术字 -->
        <div v-else class="text-fallback">
          <h1 class="main-title" data-text="异世界娼馆">异世界娼馆</h1>
          <h2 class="sub-title">模拟器</h2>
        </div>
        
      </div>

      <nav class="menu-nav">
        <BaseButton class="menu-item" @click="handleStart">开始经营</BaseButton>
        <BaseButton class="menu-item" @click="handleLoad">读取记录</BaseButton>
        <BaseButton class="menu-item" @click="handleSettings">系统设置</BaseButton>
      </nav>

      <footer class="version-info">
        v{{ systemStore.version }} - Early Access
      </footer>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 100vw;
  height: 100vh;
  position: relative;
  
  /* 备用背景：优雅的深色酒馆风格 */
  background: radial-gradient(circle at center, #2e1a47 0%, #1a0b2e 100%);
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
  /* 深色半透明遮罩，让白色/金色文字在热闹背景上也能看清 */
  background: radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2; /* 确保内容在遮罩之上 */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
  animation: float 4s ease-in-out infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.game-logo-wrapper {
  max-width: 800px;
  width: 90%;
  margin-bottom: 10px;
}

.text-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-title {
  font-size: 6rem;
  margin: 0;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.5rem;
  
  /* 黄金质感 */
  background: linear-gradient(to bottom, #fffebb 0%, #ffd700 50%, #b8860b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  
  /* 强烈的文字阴影，保证在任何背景下都清晰可见 */
  filter: drop-shadow(0 4px 0 #3e2723) drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
}

.sub-title {
  font-size: 3rem;
  margin: 0;
  color: #fff;
  letter-spacing: 1rem;
  opacity: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}

.eng-title {
  margin-top: 10px;
  font-size: 1rem;
  color: var(--color-accent);
  letter-spacing: 0.3rem;
  text-transform: uppercase;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
  background: rgba(0,0,0,0.6);
  display: inline-block;
  padding: 4px 16px;
  border-radius: 4px;
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 40px;
  /* 调整为更深色的半透明底板，适配暖色背景 */
  background: rgba(20, 10, 5, 0.6);
  border-radius: 16px;
  border: 1px solid rgba(255,215,0, 0.2);
  backdrop-filter: blur(4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.menu-item :deep(button) {
  width: 200px;
  height: 55px;
  font-size: 1.2rem;
}

.version-info {
  position: absolute;
  bottom: 16px;
  right: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
