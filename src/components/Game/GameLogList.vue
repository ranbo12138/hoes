e<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/game'
import LogItem from './LogItem.vue'

const gameStore = useGameStore()
const containerRef = ref(null)

// 自动滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  })
}

// 监听日志长度变化
watch(() => gameStore.logs.length, scrollToBottom)

onMounted(() => {
  scrollToBottom()
})

// 处理事件
function handleUpdate(id, newText) {
  gameStore.updateLog(id, newText)
}

function handleDelete(id) {
  gameStore.deleteLog(id)
}

function handleRegenerate(id) {
  gameStore.regenerateLog(id)
}
</script>

<template>
  <div class="game-log-list" ref="containerRef">
    <LogItem 
      v-for="log in gameStore.logs" 
      :key="log.id" 
      :log="log"
      @update="handleUpdate"
      @delete="handleDelete"
      @regenerate="handleRegenerate"
    />
  </div>
</template>

<style scoped>
.game-log-list {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 20px 16px 140px 16px; /* 底部留白给输入框 */
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.game-log-list::-webkit-scrollbar { display: none; }
</style>
