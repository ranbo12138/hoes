<script setup>
import { computed, ref } from 'vue'
import { useMapStore } from '@/stores/map'
import BaseButton from '@/components/Base/BaseButton.vue'

const mapStore = useMapStore()
const target = computed(() => mapStore.currentTarget)

// 菜单层级管理: 'main' | 'girl_actions' | 'girl_train'
const menuLevel = ref('main') 

function handleAction(action) {
  if (!target.value) return

  if (target.value.type === 'girl') {
    if (action === 'interact') {
      menuLevel.value = 'girl_actions'
      return
    }
  }

  // 其他类型直接执行
  mapStore.executeAction(action)
}

function handleGirlAction(action) {
  if (action === 'train') {
    menuLevel.value = 'girl_train'
  } else if (action === 'follow') {
    mapStore.executeAction('follow')
  } else if (action === 'chat') {
    mapStore.executeAction('chat')
  } else if (action === 'back') {
    menuLevel.value = 'main'
  }
}

function handleTrainAction(subType) {
  if (subType === 'back') {
    menuLevel.value = 'girl_actions'
    return
  }
  mapStore.executeAction('train', subType)
}

function close() {
  menuLevel.value = 'main'
  mapStore.closeInteraction()
}
</script>

<template>
  <div class="interaction-overlay" v-if="mapStore.showInteractionMenu && target">
    <div class="menu-panel">
      <div class="menu-header">
        <span class="target-name">{{ target.name }}</span>
        <span class="target-type" v-if="target.type === 'girl'">[员工/妓女]</span>
        <span class="target-type" v-else-if="target.type === 'staff'">[普通员工]</span>
        <span class="target-type" v-else>[客人]</span>
      </div>

      <!-- Level 1: Main Menu -->
      <div class="menu-content" v-if="menuLevel === 'main'">
        <template v-if="target.type === 'girl'">
          <BaseButton class="menu-btn" @click="handleAction('interact')">互动 ❤️</BaseButton>
        </template>
        
        <template v-else>
          <BaseButton class="menu-btn" @click="handleAction('chat')">交谈</BaseButton>
          <BaseButton class="menu-btn" v-if="target.type === 'guest'" @click="handleAction('serve')">服务</BaseButton>
        </template>

        <BaseButton class="menu-btn" variant="secondary" @click="close">离开</BaseButton>
      </div>

      <!-- Level 2: Girl Actions -->
      <div class="menu-content" v-if="menuLevel === 'girl_actions'">
        <BaseButton class="menu-btn" @click="handleGirlAction('follow')">跟我上楼 ❤️</BaseButton>
        <BaseButton class="menu-btn" @click="handleGirlAction('train')">调教 🥵</BaseButton>
        <BaseButton class="menu-btn" @click="handleGirlAction('chat')">闲聊</BaseButton>
        <BaseButton class="menu-btn" variant="secondary" @click="handleGirlAction('back')">返回</BaseButton>
      </div>

      <!-- Level 3: Training Menu -->
      <div class="menu-content" v-if="menuLevel === 'girl_train'">
        <div class="sub-title">选择调教方式:</div>
        <BaseButton class="menu-btn" @click="handleTrainAction('verbal')">言语羞辱</BaseButton>
        <BaseButton class="menu-btn" @click="handleTrainAction('physical')">肉体惩罚</BaseButton>
        <BaseButton class="menu-btn" @click="handleTrainAction('pleasure')">快乐调教</BaseButton>
        <BaseButton class="menu-btn" variant="secondary" @click="handleTrainAction('back')">返回</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.interaction-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(4px);
}

.menu-panel {
  background: rgba(26, 11, 46, 0.95);
  border: 2px solid #D4AF37;
  border-radius: 12px;
  padding: 24px;
  width: 80%;
  max-width: 320px;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  animation: popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.menu-header {
  text-align: center;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 10px;
}

.target-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #D4AF37;
  display: block;
}

.target-type {
  font-size: 0.8rem;
  color: #b0bec5;
}

.menu-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-title {
  color: #e6edf3;
  text-align: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.menu-btn {
  width: 100%;
}

@keyframes popIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
