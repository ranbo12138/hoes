<script setup>
import { useSettingsStore } from '@/stores/settings'

const settings = useSettingsStore()
</script>

<template>
  <div class="base-settings">
    <div class="form-group">
      <label>主音量</label>
      <div class="range-input">
        <input
          type="range"
          v-model="settings.volume"
          min="0"
          max="100"
          step="1"
        />
        <span class="range-value">{{ settings.volume }}%</span>
      </div>
    </div>

    <div class="info-section">
      <h4>关于</h4>
      <p>
        <strong>异世界娼馆模拟器</strong> v0.2.0<br>
        一个由 AI 驱动剧情、深度 RPG 模拟经营的异世界 Web 游戏。
      </p>
      <p>
        当前版本支持 OpenAI 和 Gemini 两种 AI 提供商，支持预设管理和自定义提示词。
      </p>
    </div>
  </div>
</template>

<style scoped>
.base-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  color: var(--color-gold-dark);
  font-size: 0.8rem;
}

.range-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-input input[type="range"] {
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 3px;
  outline: none;
  -webkit-appearance: none;
}

.range-input input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-gold);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.range-input input[type="range"]::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.range-value {
  color: var(--color-gold);
  font-size: 0.85rem;
  min-width: 35px;
  text-align: right;
}

.info-section {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 12px;
  border-radius: 4px;
}

.info-section h4 {
  margin: 0 0 10px 0;
  color: var(--color-gold);
  font-size: 0.9rem;
}

.info-section p {
  margin: 6px 0;
  color: var(--text-main);
  font-size: 0.85rem;
  line-height: 1.5;
}

.info-section strong {
  color: var(--color-gold);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .base-settings {
    gap: 10px;
  }

  .form-group {
    gap: 4px;
  }

  .form-group label {
    font-size: 0.75rem;
  }

  .range-input {
    gap: 6px;
  }

  .range-value {
    font-size: 0.8rem;
    min-width: 30px;
  }

  .info-section {
    padding: 10px;
  }

  .info-section h4 {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }

  .info-section p {
    font-size: 0.8rem;
    margin: 4px 0;
  }
}
</style>