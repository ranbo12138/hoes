import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const version = ref('0.1.0')
  const volume = ref(50)
  const isGameRunning = ref(false)

  function setVolume(val) {
    volume.value = val
  }

  function startGame() {
    isGameRunning.value = true
  }

  return {
    version,
    volume,
    isGameRunning,
    setVolume,
    startGame
  }
})
