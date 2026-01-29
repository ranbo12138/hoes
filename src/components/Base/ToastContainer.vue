<script setup>
import { useToastStore } from '@/stores/toast'
import GameToast from './GameToast.vue'

const toastStore = useToastStore()
</script>

<template>
  <div class="toast-container">
    <GameToast
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :toast="toast"
      @close="toastStore.close(toast.id)"
    />
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 400px;
  width: 90%;
}

@media (max-width: 768px) {
  .toast-container {
    top: 60px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
}
</style>