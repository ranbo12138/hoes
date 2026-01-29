<script setup>
import { ref, computed, watch } from 'vue'
import BaseButton from '../Base/BaseButton.vue'
import TextEditorModal from '../Base/TextEditorModal.vue'
import TextPreview from '../Base/TextPreview.vue'
import { usePresetStore } from '@/stores/presets'
import { useToastStore } from '@/stores/toast'
import { PromptComposer, PromptType } from '@/stores/prompts'

const presetStore = usePresetStore()
const toastStore = useToastStore()

const activePreset = computed(() =>
  presetStore.presets.find(p => p.id === presetStore.activePresetId)
)

const mainPrompt = ref('')
const previewVars = ref({
  player_name: '店主',
  gold: 1000,
  day: 5
})

// 文本编辑器状态
const showEditor = ref(false)
const editorTitle = ref('编辑主提示词')

// 变量列表
const variableList = ['player_name', 'gold', 'day', 'girl_name', 'location']

// 获取变量显示文本
function getVariableDisplay(varName) {
  return `{{${varName}}}`
}

// 监听预设变化，更新编辑器内容
watch(() => presetStore.activePresetId, (newId) => {
  const preset = presetStore.presets.find(p => p.id === newId)
  if (preset) {
    mainPrompt.value = preset.prompts.main
  }
}, { immediate: true })

// 防抖函数
let debounceTimer = null

function debounceUpdatePreset(newValue) {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  debounceTimer = setTimeout(() => {
    if (activePreset.value) {
      activePreset.value.prompts.main = newValue
      presetStore.updatePreset(activePreset.value.id, {
        prompts: activePreset.value.prompts
      })
    }
  }, 1000) // 1秒防抖
}

// 监听编辑器内容变化，更新预设
watch(mainPrompt, (newValue) => {
  debounceUpdatePreset(newValue)
})

function handleSave() {
  toastStore.success('提示词已保存')
  showEditor.value = false
}

function handleReset() {
  if (activePreset.value) {
    mainPrompt.value = activePreset.value.prompts.main
    toastStore.info('已重置为原始内容')
  }
}

function openEditor() {
  editorTitle.value = activePreset.value 
    ? `编辑预设: ${activePreset.value.name}` 
    : '编辑主提示词'
  showEditor.value = true
}

function insertVariable(varName) {
  const textarea = document.querySelector('.prompt-textarea')
  if (textarea) {
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = mainPrompt.value
    const before = text.substring(0, start)
    const after = text.substring(end)
    mainPrompt.value = before + `{{${varName}}}` + after
    textarea.focus()
  }
}

function getPreview() {
  if (!activePreset.value) return ''
  return PromptComposer.composeSystemPrompt(
    {
      id: 'preview',
      name: 'Preview',
      prompts: [
        {
          type: PromptType.MAIN,
          name: 'Main',
          content: mainPrompt.value,
          enabled: true,
          priority: 1
        }
      ]
    },
    previewVars.value
  )
}
</script>

<template>
  <div class="prompt-editor">
    <div class="editor-header">
      <h3>主提示词编辑器</h3>
      <div class="actions">
        <BaseButton variant="secondary" size="small" @click="handleReset">
          重置
        </BaseButton>
        <BaseButton size="small" @click="openEditor">
          编辑
        </BaseButton>
      </div>
    </div>

    <!-- 变量插入助手 -->
    <div class="variable-helper">
      <label>插入变量:</label>
      <div class="var-buttons">
        <button
          v-for="varName in variableList"
          :key="varName"
          class="var-btn"
          @click="insertVariable(varName)"
        >
          {{ getVariableDisplay(varName) }}
        </button>
      </div>
    </div>

    <!-- 提示词预览（只读，点击放大） -->
    <div class="preview-section">
      <TextPreview
        :content="mainPrompt"
        title="提示词预览"
        :max-height="'200px'"
        @click="openEditor"
      />
    </div>

    <!-- 变量预览 -->
    <div class="preview-section">
      <h4>变量预览</h4>
      <div class="preview-vars">
        <div v-for="(value, key) in previewVars" :key="key" class="preview-var">
          <label>{{ key }}:</label>
          <input type="text" v-model="previewVars[key]" />
        </div>
      </div>
    </div>

    <!-- 实时预览 -->
    <div class="preview-section">
      <h4>实时预览（变量替换后）</h4>
      <TextPreview
        :content="getPreview()"
        title="实时预览"
        :max-height="'150px'"
      />
    </div>

    <!-- 文本编辑器模态框 -->
    <TextEditorModal
      :show="showEditor"
      :title="editorTitle"
      v-model="mainPrompt"
      @close="showEditor = false"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.prompt-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  margin: 0;
  color: var(--color-gold);
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 8px;
}

.variable-helper {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 12px;
  border-radius: 4px;
}

.variable-helper label {
  display: block;
  color: var(--color-gold);
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.var-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.var-btn {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--color-gold);
  color: var(--color-gold);
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-family: monospace;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.var-btn:hover {
  background: rgba(212, 175, 55, 0.2);
}

.preview-section {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.3);
  padding: 12px;
  border-radius: 4px;
}

.preview-section h4 {
  margin: 0 0 12px 0;
  color: var(--color-gold);
  font-size: 0.9rem;
}

.preview-vars {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.preview-var {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.preview-var label {
  color: var(--text-dim);
  font-size: 0.8rem;
}

.preview-var input {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-gold-dark);
  padding: 6px;
  color: var(--text-main);
  border-radius: 3px;
  font-size: 0.85rem;
}

.preview-var input:focus {
  border-color: var(--color-gold);
  outline: none;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .editor-header h3 {
    font-size: 0.9rem;
  }

  .var-buttons {
    gap: 4px;
  }

  .var-btn {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .preview-vars {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .preview-section {
    padding: 8px;
  }
}
</style>