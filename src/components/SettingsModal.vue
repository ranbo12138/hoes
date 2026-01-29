<script setup>
import { ref, computed, watch } from 'vue'
import BasePanel from './Base/BasePanel.vue'
import BaseButton from './Base/BaseButton.vue'
import { PhX, PhGear, PhRobot, PhMagicWand, PhChatText, PhBracketsCurly } from '@phosphor-icons/vue'
import BaseSettingsTab from './Settings/BaseSettingsTab.vue'
import AIConfigTab from './Settings/AIConfigTab.vue'
import PresetManagerTab from './Settings/PresetManagerTab.vue'
import PromptEditorTab from './Settings/PromptEditorTab.vue'
import VariableManagerTab from './Settings/VariableManagerTab.vue'
import { usePresetStore } from '@/stores/presets'

const props = defineProps({
  panelType: {
    type: String,
    default: 'general' // 'general' | 'ai'
  }
})

const emit = defineEmits(['close'])

const presetStore = usePresetStore()
const activeTab = ref('base')

// 所有标签页定义
const allTabs = [
  { id: 'base', label: '基础设置', icon: PhGear, panelType: 'general' },
  { id: 'ai', label: 'AI 配置', icon: PhRobot, panelType: 'ai' },
  { id: 'presets', label: '预设管理', icon: PhMagicWand, panelType: 'ai' },
  { id: 'prompts', label: 'Prompt 编辑', icon: PhChatText, panelType: 'ai' },
  { id: 'variables', label: '变量管理', icon: PhBracketsCurly, panelType: 'ai' }
]

// 根据 panelType 过滤可用的标签页
const tabs = computed(() => {
  if (props.panelType === 'general') {
    return allTabs.filter(tab => tab.panelType === 'general')
  } else {
    return allTabs.filter(tab => tab.panelType === 'ai')
  }
})

// 标题根据 panelType 变化
const title = computed(() => {
  return props.panelType === 'general' ? '系统设置' : 'AI 配置中心'
})

// 监听 panelType 变化，重置到第一个可用标签页
watch(() => props.panelType, (newType) => {
  const availableTabs = tabs.value
  if (availableTabs.length > 0) {
    activeTab.value = availableTabs[0].id
  }
}, { immediate: true })

function close() {
  emit('close')
}

function setActiveTab(tabId) {
  activeTab.value = tabId
}

// 处理编辑预设事件
function handleEditPreset(preset) {
  // 激活该预设
  presetStore.setActivePreset(preset.id)
  // 切换到 Prompt 编辑标签页
  activeTab.value = 'prompts'
  toastStore.success(`正在编辑预设: ${preset.name}`)
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <BasePanel class="settings-modal" :title="title">
      <button class="close-btn" @click="close">
        <PhX size="24" />
      </button>

      <!-- 标签页导航 -->
      <div class="tabs-nav" v-if="tabs.length > 1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-button"
          :class="{ active: activeTab === tab.id }"
          @click="setActiveTab(tab.id)"
        >
          <component :is="tab.icon" size="16" />
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- 标签页内容 -->
      <div class="modal-content">
        <BaseSettingsTab v-if="activeTab === 'base'" />
        <AIConfigTab v-if="activeTab === 'ai'" />
        <PresetManagerTab 
          v-if="activeTab === 'presets'" 
          @edit-preset="handleEditPreset"
        />
        <PromptEditorTab v-if="activeTab === 'prompts'" />
        <VariableManagerTab v-if="activeTab === 'variables'" />
      </div>

      <div class="actions">
        <BaseButton @click="close">关闭</BaseButton>
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
  width: 95%;
  max-width: 700px;
  height: 90vh;
  max-height: 90vh;
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
  z-index: 10;
}

.close-btn:hover {
  transform: scale(1.1);
  color: #fff;
}

.tabs-nav {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  overflow-x: auto;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-dim);
  border-radius: 4px 4px 0 0;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.tab-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-main);
}

.tab-button.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--color-gold);
  color: var(--color-gold);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-bottom: 12px;
  margin-top: 4px;
  min-height: 0;
}

/* 自定义滚动条 */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: var(--color-gold-dark);
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-gold);
}

.actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 768px) {
  .settings-modal {
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    border: none;
  }

  .close-btn {
    top: 12px;
    right: 12px;
  }

  .tabs-nav {
    margin-bottom: 12px;
    padding-bottom: 2px;
    gap: 2px;
  }

  .tab-button {
    padding: 6px 8px;
    font-size: 0.8rem;
    border-radius: 3px 3px 0 0;
  }

  .tab-button span {
    font-size: 0.75rem;
  }

  .modal-content {
    padding-right: 4px;
    margin-bottom: 12px;
    margin-top: 4px;
  }

  .actions {
    padding-top: 8px;
    gap: 8px;
  }

  .actions button {
    flex: 1;
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style>