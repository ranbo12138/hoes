<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { 
  PhCoins, 
  // PhMapTrifold, 
  // PhArrowUUpLeft, 
  PhHeart,
  PhUserPlus,
  PhFloppyDisk,
  PhArrowCounterClockwise,
  PhClipboardText,
  PhHouse,
  PhStorefront
} from '@phosphor-icons/vue'

const props = defineProps({
  // showMap: Boolean,
  // onToggleMap: Function,
  onRecruit: Function,
  onSchedule: Function,
  onMarket: Function,
  onGirls: Function,
  onSave: Function,
  onLoad: Function
})

const router = useRouter()
const gameStore = useGameStore()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="game-hud">
    <!-- 左上角：时间轮盘 (Day Widget) -->
    <div class="hud-widget time-widget">
      <div class="rune-circle">
        <div class="day-label">DAY</div>
        <div class="day-value">{{ gameStore.day }}</div>
      </div>
    </div>

    <!-- 右上角：资源 & 操作区 -->
    <div class="hud-top-right">
      <!-- 资源栏 -->
      <div class="hud-widget resource-widget">
        <PhCoins weight="fill" class="res-icon gold-icon" />
        <span class="res-value">{{ gameStore.gold }}</span>
      </div>
    </div>

    <!-- 顶部居中：操作栏 (悬浮吊坠风格) -->
    <div class="hud-action-bar">
      <!-- 地图开关 (Removed) -->
      <!-- <button class="hud-btn" @click="onToggleMap" :title="showMap ? '返回' : '地图'">
        <component :is="showMap ? PhArrowUUpLeft : PhMapTrifold" weight="fill" />
      </button> -->
      
      <div class="divider"></div>

      <!-- 核心功能 -->
      <button class="hud-btn" @click="onRecruit" title="招募">
        <PhUserPlus weight="bold" />
      </button>
      <button class="hud-btn" @click="onSchedule" title="日程">
        <PhClipboardText weight="bold" />
      </button>
      <button class="hud-btn" @click="onMarket" title="黑市">
        <PhStorefront weight="bold" />
      </button>
      <button class="hud-btn pink" @click="onGirls" title="成员">
        <PhHeart weight="fill" />
      </button>

      <div class="divider"></div>

      <!-- 系统功能 -->
      <button class="hud-btn small" @click="onSave" title="保存">
        <PhFloppyDisk weight="bold" />
      </button>
      <button class="hud-btn small" @click="onLoad" title="读取">
        <PhArrowCounterClockwise weight="bold" />
      </button>
      <button class="hud-btn small" @click="goHome" title="主页">
        <PhHouse weight="bold" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.game-hud {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 0; /* 不占用布局空间，仅作为定位容器 */
  z-index: 100;
  pointer-events: none; /* 允许点击穿透到下层游戏画面 */
}

/* --- 通用 Widget 容器 --- */
.hud-widget {
  pointer-events: auto;
  background: var(--bg-panel); /* 使用半透明深色 */
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-gold-dark);
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

/* --- 左上角：时间轮盘 --- */
.time-widget {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-gold);
  box-shadow: 
    0 0 10px rgba(197, 160, 40, 0.3),
    inset 0 0 20px rgba(0,0,0,0.8);
}

.rune-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--color-gold);
}

.day-label {
  font-size: 0.7rem;
  letter-spacing: 1px;
  opacity: 0.8;
  font-weight: bold;
}

.day-value {
  font-size: 1.4rem;
  font-weight: bold;
  line-height: 1;
  text-shadow: 0 2px 4px black;
}

/* --- 右上角区域 --- */
.hud-top-right {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* 资源条 */
.resource-widget {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px; /* 胶囊形 */
  color: var(--color-gold-light);
  min-width: 100px;
  justify-content: center;
}

.gold-icon {
  font-size: 1.2rem;
  color: #FFD700;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.5));
}

.res-value {
  font-size: 1.1rem;
  font-weight: bold;
  font-family: var(--font-ui);
}

/* --- 顶部居中：Action Bar --- */
.hud-action-bar {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  background: rgba(13, 5, 24, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-gold-dark);
  border-radius: 12px;
  
  /* 装饰性倒角 (利用 clip-path 或 pseudo elements) - 这里简化为圆角 + 边框 */
  box-shadow: 
    0 4px 16px rgba(0,0,0,0.6),
    0 0 0 1px rgba(0,0,0,0.8); /* 双重边框模拟 */
}

/* 装饰线条 - 顶部悬挂感 */
.hud-action-bar::before {
  content: '';
  position: absolute;
  top: -16px; /* 延伸到屏幕外 */
  left: 20px;
  right: 20px;
  height: 16px;
  border-left: 1px solid rgba(255,255,255,0.2);
  border-right: 1px solid rgba(255,255,255,0.2);
  pointer-events: none;
}

.hud-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--color-gold);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  transition: all0.2s ease;
  position: relative;
  overflow: hidden;
}

.hud-btn:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
}

.hud-btn:active {
  transform: translateY(0);
}

.hud-btn.pink { color: #FF69B4; }
.hud-btn.pink:hover { 
  background: rgba(255, 105, 180, 0.1); 
  border-color: rgba(255, 105, 180, 0.3);
  box-shadow: 0 0 10px rgba(255, 105, 180, 0.2);
}

.hud-btn.small {
  font-size: 1.1rem;
  opacity: 0.7;
}
.hud-btn.small:hover { opacity: 1; }

.divider {
  width: 1px;
  height: 20px;
  background: rgba(255,255,255,0.15);
  margin: 0 4px;
}

/* 响应式适配：手机端将 Action Bar 移到底部，或者简化 */
@media (max-width: 600px) {
  .hud-action-bar {
    top: auto;
    bottom: 20px; /* 底部悬浮 */
    width: 90%;
    justify-content: space-around;
  }
  
  .hud-action-bar::before {
    display: none; /* 移除悬挂线 */
  }

  .time-widget {
    top: 10px;
    left: 10px;
    width: 50px;
    height: 50px;
  }
  .day-label { font-size: 0.6rem; }
  .day-value { font-size: 1rem; }

  .hud-top-right {
    top: 10px;
    right: 10px;
  }
}
</style>
