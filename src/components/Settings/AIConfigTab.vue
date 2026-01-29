<script setup>
import { ref, computed, watch } from 'vue'
import BaseButton from '../Base/BaseButton.vue'
import { useSettingsStore } from '@/stores/settings'
import { usePresetStore } from '@/stores/presets'
import { useToastStore } from '@/stores/toast'
import { fetchModels } from '@/api/llm'
import { PhList, PhTestTube } from '@phosphor-icons/vue'

const settings = useSettingsStore()
const presetStore = usePresetStore()
const toastStore = useToastStore()

const isLoadingModels = ref(false)
const availableModels = ref([])
const isTestingConnection = ref(false)

const providerOptions = [
  { value: 'openai', label: 'OpenAI 兼容模式' },
  { value: 'gemini', label: 'Google Gemini' }
]

// 当前活动的预设参数
const presetParams = computed(() => {
  const activePreset = presetStore.presets.find(p => p.id === presetStore.activePresetId)
  return activePreset?.parameters || {}
})

// 监听模型选择变化
watch(() => settings.aiProvider, async (newProvider) => {
  availableModels.value = []
})

async function handleFetchModels() {
  isLoadingModels.value = true
  try {
    availableModels.value = await fetchModels(settings.aiProvider)
    if (availableModels.value.length > 0) {
      toastStore.success(`获取成功！发现 ${availableModels.value.length} 个模型`)
    } else {
      toastStore.warning('获取成功，但未发现可用模型')
    }
  } catch (e) {
    toastStore.error('获取模型列表失败: ' + e.message)
  } finally {
    isLoadingModels.value = false
  }
}

async function handleTestConnection() {
  isTestingConnection.value = true
  try {
    // 验证必填项
    if (settings.aiProvider === 'openai' && !settings.openaiApiKey) {
      toastStore.error('请输入 OpenAI API Key')
      return
    }
    if (settings.aiProvider === 'gemini' && !settings.geminiApiKey) {
      toastStore.error('请输入 Gemini API Key')
      return
    }
    if (!settings.openaiModel && !settings.geminiModel) {
      toastStore.error('请输入模型名称')
      return
    }

    // 测试连接逻辑
    const models = await fetchModels(settings.aiProvider)
    toastStore.success('连接成功！')
  } catch (e) {
    toastStore.error('连接失败: ' + e.message)
  } finally {
    isTestingConnection.value = false
  }
}
</script>

<template>
  <div class="ai-config">
    <!-- API 提供商 -->
    <div class="form-group">
      <label>API 提供商</label>
      <select v-model="settings.aiProvider">
        <option v-for="opt in providerOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

    <hr class="divider" />

    <!-- 连接配置 -->
    <div v-if="settings.aiProvider === 'openai'" class="provider-form">
      <div class="form-group">
        <label>API Endpoint (Base URL)</label>
        <input type="text" v-model="settings.openaiBaseUrl" placeholder="https://api.openai.com/v1" />
      </div>
      <div class="form-group">
        <label>API Key</label>
        <input type="password" v-model="settings.openaiApiKey" placeholder="sk-..." />
      </div>
      <div class="form-group">
        <label>Model Name</label>
        <div class="input-with-btn">
          <select 
            @change="settings.openaiModel = $event.target.value"
            :disabled="availableModels.length === 0"
          >
            <option value="" disabled>选择模型或手动输入...</option>
            <option v-for="model in availableModels" :key="model" :value="model">
              {{ model }}
            </option>
          </select>
          <button class="icon-btn" @click="handleFetchModels" :disabled="isLoadingModels">
            <PhList size="20" />
          </button>
        </div>
        <input
          type="text"
          v-model="settings.openaiModel"
          placeholder="手动输入模型名称"
          class="manual-input"
        />
      </div>
    </div>

    <div v-if="settings.aiProvider === 'gemini'" class="provider-form">
      <div class="form-group">
        <label>API Endpoint (Base URL)</label>
        <input type="text" v-model="settings.geminiBaseUrl" placeholder="https://generativelanguage.googleapis.com" />
      </div>
      <div class="form-group">
        <label>API Key</label>
        <input type="password" v-model="settings.geminiApiKey" placeholder="AIza..." />
      </div>
      <div class="form-group">
        <label>Model Name</label>
        <div class="input-with-btn">
          <select 
            @change="settings.geminiModel = $event.target.value"
            :disabled="availableModels.length === 0"
          >
            <option value="" disabled>选择模型或手动输入...</option>
            <option v-for="model in availableModels" :key="model" :value="model">
              {{ model }}
            </option>
          </select>
          <button class="icon-btn" @click="handleFetchModels" :disabled="isLoadingModels">
            <PhList size="20" />
          </button>
        </div>
        <input
          type="text"
          v-model="settings.geminiModel"
          placeholder="手动输入模型名称"
          class="manual-input"
        />
      </div>
    </div>

    <hr class="divider" />

    <!-- 测试连接 -->
    <div class="form-group">
      <BaseButton @click="handleTestConnection" :disabled="isTestingConnection">
        <PhTestTube size="16" /> 测试连接
      </BaseButton>
    </div>

    <!-- 当前预设参数预览 -->
    <div v-if="presetStore.activePresetId" class="preset-preview">
      <h4>当前预设参数</h4>
      <div class="param-grid">
        <div class="param-item">
          <label>Temperature:</label>
          <span>{{ presetParams.temperature }}</span>
        </div>
        <div class="param-item">
          <label>Max Tokens:</label>
          <span>{{ presetParams.max_tokens }}</span>
        </div>
        <div class="param-item">
          <label>Top P:</label>
          <span>{{ presetParams.top_p }}</span>
        </div>
        <div class="param-item">
          <label>Top K:</label>
          <span>{{ presetParams.top_k }}</span>
        </div>
        <div class="param-item">
          <label>Repetition Penalty:</label>
          <span>{{ presetParams.repetition_penalty }}</span>
        </div>
        <div class="param-item">
          <label>Streaming:</label>
          <span>{{ presetParams.streaming ? '启用' : '禁用' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-config {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;
}

.form-group label {
  color: var(--color-gold-dark);
  font-size: 0.8rem;
}

.form-group input,
.form-group select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-dark);
  padding: 6px;
  color: var(--text-main);
  border-radius: 3px;
  font-size: 0.85rem;
}

.form-group input:focus,
.form-group select:focus {
  border-color: var(--color-gold);
  outline: none;
}

.input-with-btn {
  display: flex;
  gap: 5px;
}

.input-with-btn select {
  flex: 1;
}

.manual-input {
  margin-top: 6px;
  font-size: 0.9rem;
}

.icon-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-dark);
  color: var(--color-gold);
  padding: 0 10px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover:not(:disabled) {
  background: var(--color-gold-dark);
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 15px 0;
}

.preset-preview {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 10px;
  border-radius: 4px;
  max-height: 150px;
  overflow-y: auto;
}

.preset-preview h4 {
  margin: 0 0 8px 0;
  color: var(--color-gold);
  font-size: 0.85rem;
}

.param-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.param-item label {
  color: var(--text-dim);
  font-size: 0.7rem;
}

.param-item span {
  color: var(--text-main);
  font-size: 0.8rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ai-config {
    gap: 10px;
  }

  .form-group {
    margin-bottom: 8px;
    gap: 4px;
  }

  .form-group label {
    font-size: 0.75rem;
  }

  .form-group input,
  .form-group select {
    padding: 5px;
    font-size: 0.8rem;
  }

  .divider {
    margin: 10px 0;
  }

  .preset-preview {
    padding: 8px;
    max-height: 120px;
  }

  .preset-preview h4 {
    font-size: 0.8rem;
    margin-bottom: 6px;
  }

  .param-grid {
    grid-template-columns: 1fr;
    gap: 6px;
  }

  .param-item label {
    font-size: 0.65rem;
  }

  .param-item span {
    font-size: 0.75rem;
  }

  .actions button {
    font-size: 0.8rem;
    padding: 6px 10px;
  }
}
</style>