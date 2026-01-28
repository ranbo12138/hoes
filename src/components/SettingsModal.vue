<script setup>
import { ref, computed } from 'vue'
import BasePanel from './Base/BasePanel.vue'
import BaseButton from './Base/BaseButton.vue'
import { useSettingsStore } from '@/stores/settings'
import { fetchModels } from '@/api/llm'
import { PhX, PhList, PhCheckSquare, PhSquare } from '@phosphor-icons/vue'

const props = defineProps({
  // 'general' | 'ai'
  panelType: {
    type: String,
    default: 'general'
  }
})

const emit = defineEmits(['close'])
const settings = useSettingsStore()

const isLoadingModels = ref(false)

const providerOptions = [
  { value: 'openai', label: 'OpenAI 兼容模式' },
  { value: 'gemini', label: 'Google Gemini' }
]

const title = computed(() => {
  return props.panelType === 'ai' ? 'AI 连接配置' : '系统设置'
})

function close() {
  emit('close')
}

// 获取模型列表
async function handleFetchModels(provider) {
  isLoadingModels.value = true
  try {
    const models = await fetchModels(provider)
    if (models && models.length > 0) {
      console.log('Available Models:', models)
      alert(`获取成功！发现 ${models.length} 个模型。\n(已打印到控制台，请手动输入或粘贴)\n\n推荐:\n` + models.slice(0, 5).join('\n'))
    } else {
      alert('获取成功，但未发现可用模型。')
    }
  } catch (e) {
    alert('获取模型列表失败: ' + e.message)
  } finally {
    isLoadingModels.value = false
  }
}

function toggleTools() {
  settings.enableTools = !settings.enableTools
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <BasePanel class="settings-modal" :title="title">
      <button class="close-btn" @click="close">
        <PhX size="24" />
      </button>

      <!-- 移除 Tabs，改为根据 panelType 直接渲染内容 -->
      <div class="modal-content">
        
        <!-- 通用设置 -->
        <div v-if="panelType === 'general'" class="settings-group">
          <div class="form-item">
            <label>主音量</label>
            <input type="range" v-model="settings.volume" min="0" max="100" />
            <span>{{ settings.volume }}%</span>
          </div>
        </div>

        <!-- AI 设置 -->
        <div v-if="panelType === 'ai'" class="settings-group">
          <div class="form-item">
            <label>API 提供商</label>
            <select v-model="settings.aiProvider">
              <option v-for="opt in providerOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- 工具调用开关 -->
          <div class="form-item checkbox-item" @click="toggleTools">
            <div class="checkbox-icon">
              <PhCheckSquare v-if="settings.enableTools" size="20" weight="fill" color="var(--color-gold)" />
              <PhSquare v-else size="20" color="var(--text-dim)" />
            </div>
            <div class="checkbox-label">
              <span>允许 AI 使用工具 (Experimental)</span>
              <small class="tip">开启后，LLM 可以读写记忆库（需模型支持 Function Calling）。</small>
            </div>
          </div>

          <hr class="divider" />

          <!-- OpenAI Form -->
          <div v-if="settings.aiProvider === 'openai'" class="provider-form">
            <div class="form-item">
              <label>API Endpoint (Base URL)</label>
              <input type="text" v-model="settings.openaiBaseUrl" placeholder="https://api.openai.com/v1" />
            </div>
            <div class="form-item">
              <label>API Key</label>
              <input type="password" v-model="settings.openaiApiKey" placeholder="sk-..." />
            </div>
            <div class="form-item">
              <label>Model Name</label>
              <div class="input-with-btn">
                <input type="text" v-model="settings.openaiModel" placeholder="gpt-3.5-turbo" />
                <button class="icon-btn" @click="handleFetchModels('openai')" title="获取模型列表">
                  <PhList size="20" />
                </button>
              </div>
            </div>
          </div>

          <!-- Gemini Form -->
          <div v-if="settings.aiProvider === 'gemini'" class="provider-form">
             <div class="form-item">
              <label>API Endpoint (Base URL)</label>
              <input type="text" v-model="settings.geminiBaseUrl" placeholder="https://generativelanguage.googleapis.com" />
              <small class="tip">通常无需修改，除非使用反向代理。</small>
            </div>
            <div class="form-item">
              <label>API Key</label>
              <input type="password" v-model="settings.geminiApiKey" placeholder="AIza..." />
            </div>
            <div class="form-item">
              <label>Model Name</label>
              <div class="input-with-btn">
                <input type="text" v-model="settings.geminiModel" placeholder="gemini-pro" />
                <button class="icon-btn" @click="handleFetchModels('gemini')" title="获取模型列表">
                  <PhList size="20" />
                </button>
              </div>
            </div>
            <p class="tip">提示: Gemini 目前提供免费配额，适合测试。</p>
          </div>
        </div>

      </div>
      
      <div class="actions">
        <BaseButton @click="close">保存并关闭</BaseButton>
      </div>
    </BasePanel>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.settings-modal {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: var(--color-gold);
  cursor: pointer;
  transition: transform 0.2s;
}
.close-btn:hover {
  transform: scale(1.1);
  color: #fff;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px;
  margin-bottom: 20px;
  margin-top: 10px;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-item label {
  color: var(--color-gold-dark);
  font-size: 0.9rem;
}

.form-item input,
.form-item select {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--color-gold-dark);
  padding: 8px;
  color: var(--text-main);
  border-radius: 4px;
}

.form-item input:focus,
.form-item select:focus {
  border-color: var(--color-gold);
  outline: none;
}

/* Checkbox Style */
.checkbox-item {
  flex-direction: row;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  transition: background 0.2s;
}
.checkbox-item:hover {
  background: rgba(255, 255, 255, 0.05);
}
.checkbox-label {
  display: flex;
  flex-direction: column;
}

/* Input with Button */
.input-with-btn {
  display: flex;
  gap: 5px;
}
.input-with-btn input {
  flex: 1;
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
.icon-btn:hover {
  background: var(--color-gold-dark);
  color: #000;
}

.divider {
  border: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 10px 0;
}

.tip {
  font-size: 0.75rem;
  color: var(--text-dim);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
</style>
