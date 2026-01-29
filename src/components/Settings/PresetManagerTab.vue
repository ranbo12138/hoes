<script setup>
import { ref, computed } from 'vue'
import BasePanel from '../Base/BasePanel.vue'
import BaseButton from '../Base/BaseButton.vue'
import ConfirmDialog from '../Base/ConfirmDialog.vue'
import { usePresetStore } from '@/stores/presets'
import { useToastStore } from '@/stores/toast'
import { PhPlus, PhTrash, PhExport, PhDownloadSimple } from '@phosphor-icons/vue'

const emit = defineEmits(['edit-preset'])

const presetStore = usePresetStore()
const toastStore = useToastStore()

const activePresetId = ref(presetStore.activePresetId)
const showConfirm = ref(false)
const deleteTargetId = ref(null)
const fileInput = ref(null)

const activePreset = computed(() => 
  presetStore.presets.find(p => p.id === activePresetId.value)
)

function handleSetActive(id) {
  activePresetId.value = id
  presetStore.setActivePreset(id)
  toastStore.success(`已激活预设: ${activePreset.value?.name}`)
}

function handleEdit() {
  if (activePreset.value) {
    emit('edit-preset', activePreset.value)
  }
}

function handleCreateNew() {
  const newPreset = presetStore.duplicatePreset(activePreset.value?.id || '')
  activePresetId.value = newPreset.id
  toastStore.success('已创建新预设')
}

function handleDelete(id) {
  deleteTargetId.value = id
  showConfirm.value = true
}

function handleConfirmDelete() {
  if (deleteTargetId.value) {
    presetStore.deletePreset(deleteTargetId.value)
    toastStore.success('预设已删除')
    deleteTargetId.value = null
    showConfirm.value = false
  }
}

function handleCancelDelete() {
  deleteTargetId.value = null
  showConfirm.value = false
}

function handleExport() {
  if (activePreset.value) {
    const json = presetStore.exportPreset(activePreset.value.id)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activePreset.value.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toastStore.success('预设已导出')
  }
}

function handleImport() {
  fileInput.value?.click()
}

function onFileSelect(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      const preset = presetStore.importPreset(data)
      if (preset) {
        toastStore.success(`已导入预设: ${preset.name}`)
      } else {
        toastStore.error('导入失败：格式不正确')
      }
    } catch (err) {
      toastStore.error('导入失败：无法解析文件')
    }
  }
  reader.readAsText(file)
}
</script>

<template>
  <div class="preset-manager">
    <!-- 预设列表 -->
    <div class="preset-list">
      <div
        v-for="preset in presetStore.presets"
        :key="preset.id"
        class="preset-card"
        :class="{ active: preset.id === activePresetId }"
        @click="handleSetActive(preset.id)"
      >
        <div class="preset-info">
          <h4>{{ preset.name }}</h4>
          <p>{{ preset.description }}</p>
          <span v-if="preset.isBuiltin" class="builtin-badge">内置</span>
        </div>
        <div class="preset-actions" @click.stop>
          <BaseButton variant="secondary" size="small" @click="handleEdit">
            <PhPlus size="16" /> 编辑
          </BaseButton>
          <BaseButton variant="secondary" size="small" @click="handleDelete(preset.id)" v-if="!preset.isBuiltin">
            <PhTrash size="16" />
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="actions">
      <BaseButton @click="handleCreateNew">
        <PhPlus size="16" /> 新建预设
      </BaseButton>
      <BaseButton @click="handleExport" v-if="activePreset">
        <PhExport size="16" /> 导出
      </BaseButton>
      <BaseButton @click="handleImport">
        <PhDownloadSimple size="16" /> 导入
      </BaseButton>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="onFileSelect"
    />

    <!-- 确认对话框 -->
    <ConfirmDialog
      :show="showConfirm"
      title="删除预设"
      message="确定要删除这个预设吗？此操作不可恢复。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<style scoped>
.preset-manager {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 4px 0;
}

.preset-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 250px;
  overflow-y: auto;
}

.preset-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preset-card:hover {
  background: rgba(255, 255, 255, 0.05);
}

.preset-card.active {
  border-color: var(--color-gold);
  background: rgba(212, 175, 55, 0.1);
}

.preset-info {
  flex: 1;
}

.preset-info h4 {
  margin: 0 0 3px 0;
  color: var(--color-gold);
  font-size: 0.85rem;
}

.preset-info p {
  margin: 0;
  color: var(--text-dim);
  font-size: 0.75rem;
}

.builtin-badge {
  display: inline-block;
  background: var(--color-purple-dark);
  color: var(--color-gold);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.65rem;
  margin-top: 3px;
}

.preset-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .preset-manager {
    gap: 10px;
  }

  .preset-list {
    max-height: 200px;
  }

  .preset-card {
    padding: 6px;
  }

  .preset-info h4 {
    font-size: 0.8rem;
  }

  .preset-info p {
    font-size: 0.7rem;
  }

  .builtin-badge {
    font-size: 0.6rem;
    padding: 1px 4px;
  }

  .preset-actions {
    gap: 3px;
  }

  .actions {
    gap: 4px;
  }

  .actions button {
    font-size: 0.8rem;
    padding: 5px 8px;
  }
}
</style>