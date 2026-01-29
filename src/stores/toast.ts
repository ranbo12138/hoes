import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: number
  type: ToastType
  message: string
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<ToastMessage[]>([])
  let nextId = 1

  function show(
    message: string,
    type: ToastType = 'info',
    duration: number = 3000
  ): number {
    const id = nextId++
    const toast: ToastMessage = { id, type, message, duration }
    toasts.value.push(toast)

    // 自动关闭
    if (duration && duration > 0) {
      setTimeout(() => {
        close(id)
      }, duration)
    }

    return id
  }

  function success(message: string, duration?: number): number {
    return show(message, 'success', duration)
  }

  function error(message: string, duration?: number): number {
    return show(message, 'error', duration)
  }

  function warning(message: string, duration?: number): number {
    return show(message, 'warning', duration)
  }

  function info(message: string, duration?: number): number {
    return show(message, 'info', duration)
  }

  function close(id: number): void {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clear(): void {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    close,
    clear
  }
})