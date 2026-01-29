<script setup>
import { ref, computed } from 'vue'
import { VariableResolver, BUILTIN_VARIABLES, VariableType } from '@/utils/variableResolver'
import BaseButton from '../Base/BasePanel.vue'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const settings = useSettingsStore()

// 使用 settings store 中的自定义变量
const customVars = computed({
  get: () => settings.customVars,
  set: (value) => {
    settings.customVars = value
  }
})

// 获取变量显示文本
function getVariableDisplay(varName) {
  return `{{${varName}}}`
}

// 获取类型标签
function getTypeLabel(type) {
  const labels = {
    [VariableType.SYSTEM]: '系统',
    [VariableType.GAME]: '游戏',
    [VariableType.CUSTOM]: '自定义'
  }
  return labels[type] || type
}

function addCustomVar() {
  customVars.value.push({
    name: `custom_${Date.now()}`,
    value: ''
  })
}

function removeCustomVar(index) {
  customVars.value.splice(index, 1)
}
</script>

<template>
  <div class="variable-manager">
    <!-- 内置变量列表 -->
    <div class="section">
      <h3>内置变量（只读）</h3>
      <div class="variable-list">
        <div
          v-for="varMeta in builtinVars"
          :key="varMeta.name"
          class="variable-item builtin"
        >
          <div class="var-info">
            <code class="var-name">{{ getVariableDisplay(varMeta.name) }}</code>
            <span class="var-badge">{{ getTypeLabel(varMeta.type) }}</span>
          </div>
          <div class="var-details">
            <p class="var-description">{{ varMeta.description }}</p>
            <p v-if="varMeta.defaultValue" class="var-default">
              默认值: <code>{{ varMeta.defaultValue }}</code>
            </p>
            <p v-if="varMeta.example" class="var-example">
              示例: <code>{{ varMeta.example }}</code>
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义变量列表 -->
    <div class="section">
      <h3>自定义变量</h3>
      <div class="variable-list">
        <div
          v-for="(customVar, index) in customVars"
          :key="index"
          class="variable-item"
        >
          <div class="var-info">
            <code class="var-name">{{ getVariableDisplay(customVar.name) }}</code>
            <span class="var-badge">自定义</span>
          </div>
          <div class="var-details">
            <input
              type="text"
              v-model="customVar.name"
              placeholder="变量名"
              class="var-input"
            />
            <input
              type="text"
              v-model="customVar.value"
              placeholder="变量值"
              class="var-input"
            />
            <BaseButton
              variant="secondary"
              size="small"
              @click="removeCustomVar(index)"
            >
              删除
            </BaseButton>
          </div>
        </div>
      </div>
      <BaseButton @click="addCustomVar" class="add-btn">
        + 添加自定义变量
      </BaseButton>
    </div>

    <!-- 使用说明 -->
    <div class="section">
      <h3>使用说明</h3>
      <p>在提示词中使用 <code>{{ getVariableDisplay('变量名') }}</code> 格式来引用变量。</p>
      <p>例如：<code>玩家 {{ getVariableDisplay('player_name') }} 拥有 {{ getVariableDisplay('gold') }} 金币。</code></p>
    </div>
  </div>
</template>

<style scoped>
.variable-manager {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section h3 {
  color: var(--color-gold);
  margin: 0 0 12px 0;
  font-size: 1.1rem;
}

.section p {
  color: var(--text-dim);
  margin: 4px 0;
  font-size: 0.9rem;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.variable-item {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 4px;
}

.variable-item.builtin {
  border-color: rgba(212, 175, 55, 0.3);
}

.var-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.var-name {
  color: var(--color-gold);
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.9rem;
}

.var-badge {
  background: var(--color-purple-dark);
  color: var(--color-gold);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
}

.var-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.var-description {
  margin: 0;
  color: var(--text-main);
  font-size: 0.9rem;
}

.var-default,
.var-example {
  margin: 0;
  color: var(--text-dim);
  font-size: 0.85rem;
}

.var-default code,
.var-example code {
  color: var(--color-gold-light);
  background: rgba(0, 0, 0, 0.3);
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 0.85rem;
}

.var-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-dark);
  padding: 8px;
  color: var(--text-main);
  border-radius: 4px;
  margin-bottom: 6px;
}

.var-input:focus {
  border-color: var(--color-gold);
  outline: none;
}

.add-btn {
  margin-top: 8px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .variable-manager {
    gap: 12px;
  }

  .section h3 {
    font-size: 0.9rem;
    margin-bottom: 8px;
  }

  .section p {
    font-size: 0.8rem;
  }

  .variable-item {
    padding: 8px;
  }

  .var-info {
    margin-bottom: 6px;
    gap: 6px;
  }

  .var-name {
    font-size: 0.8rem;
    padding: 2px 4px;
  }

  .var-badge {
    font-size: 0.7rem;
    padding: 1px 4px;
  }

  .var-details {
    gap: 4px;
  }

  .var-description,
  .var-default,
  .var-example {
    font-size: 0.8rem;
  }

  .var-input {
    padding: 6px;
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .add-btn {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style>