<script setup>
import { computed } from 'vue'
import uncheckedImg from '@/assets/Green/Default/check_square_color_square.png'
import checkedImg from '@/assets/Green/Default/check_square_color.png'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

function toggle() {
  emit('update:modelValue', !props.modelValue)
}

const currentIcon = computed(() => props.modelValue ? checkedImg : uncheckedImg)
</script>

<template>
  <div class="green-checkbox" @click="toggle">
    <div class="icon-container">
      <img :src="currentIcon" alt="checkbox" class="checkbox-icon" />
    </div>
    <span v-if="label" class="label" :class="{ checked: modelValue }">
      {{ label }}
    </span>
  </div>
</template>

<style scoped>
.green-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  user-select: none;
}

.icon-container {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;
}

.green-checkbox:active .icon-container {
  transform: scale(0.9);
}

.checkbox-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.label {
  font-size: 16px;
  color: #444;
  transition: color 0.2s;
}

.label.checked {
  color: #2e7d32;
  font-weight: bold;
}
</style>
