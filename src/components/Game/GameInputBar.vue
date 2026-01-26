<script setup>
import { ref } from 'vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import { 
  PhHeart,      // 替换 PhLips 为 PhHeart
  PhMoonStars, 
  PhScroll, 
  PhStorefront 
} from '@phosphor-icons/vue'

const emit = defineEmits(['send'])
const userInput = ref('')

const quickActions = [
  { id: 'work', label: '接客', icon: PhHeart, color: '#FF69B4' }, // 使用 PhHeart
  { id: 'rest', label: '休息', icon: PhMoonStars, color: '#87CEEB' },
  { id: 'manage', label: '管理', icon: PhScroll, color: '#D4AF37' },
  { id: 'shop', label: '商店', icon: PhStorefront, color: '#90EE90' }
]

function handleSend() {
  if (!userInput.value.trim()) return
  emit('send', userInput.value)
  userInput.value = ''
}

function handleQuickAction(action) {
  emit('send', `执行指令: [${action.label}]`)
}
</script>

<template>
  <div class="bottom-input-layer">
    <!-- 快捷指令栏 -->
    <div class="quick-actions-bar">
      <button 
        v-for="action in quickActions" 
        :key="action.id"
        class="quick-btn-new"
        @click="handleQuickAction(action)"
      >
 <div class="btn-inner">
          <component 
            :is="action.icon" 
            weight="duotone" 
            class="btn-icon"
            :style="{ color: action.color }"
          />
          <span class="btn-label">{{ action.label }}</span>
        </div>
      </button>
    </div>

    <!-- 输入框区域 -->
    <div class="input-panel">
      <input 
        v-model="userInput" 
        type="text" 
        placeholder="下达指令..."
        @keyup.enter="handleSend"
      />
      <BaseButton class="send-btn-new" @click="handleSend">发送</BaseButton>
    </div>
  </div>
</template>

<style scoped>
.bottom-input-layer {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  padding: 0 12px max(12px, var(--safe-bottom)) 12px;
  z-index: 100;
  background: linear-gradient(to top, var(--color-purple-deep) 60%, transparent 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 快捷指令栏 */
.quick-actions-bar {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.quick-actions-bar::-webkit-scrollbar { display: none; }

.quick-btn-new {
  flex: 0 0 auto;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.btn-inner {
  width: 60px;
  height: 50px;
  background: rgba(30, 15, 40, 0.9);
  border: 1px solid var(--color-gold-dark);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: all 0.2s;
}

.quick-btn-new:active .btn-inner {
  transform: scale(0.95);
  background: var(--color-gold-dark);
  color: var(--color-purple-deep);
}

.btn-icon { font-size: 1.4rem; }
.btn-label { font-size: 0.7rem; font-weight: bold; color: var(--text-gold); }

/* 输入框面板 */
.input-panel {
  display: flex;
  gap: 8px;
  background: rgba(20, 10, 30, 0.95);
  padding: 8px;
  border-radius: 12px;
  border: 1px solid var(--color-gold-dark);
  box-shadow: 0 -4px 16px rgba(0,0,0,0.6);
}

.input-panel input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 0.95rem;
  outline: none;
  padding: 0 8px;
}

.input-panel input::placeholder {
  color: var(--text-dim);
  font-style: italic;
}

.send-btn-new :deep(button) {
  min-width: 70px !important;
  height: 36px !important;
  font-size: 0.9rem !important;
}
</style>
