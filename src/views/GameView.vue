<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'
import { useMapStore } from '@/stores/map' // 引入 MapStore
import BaseButton from '@/components/Base/BaseButton.vue'
import AutoTransparentImage from '@/components/Base/AutoTransparentImage.vue'
import GameMap from '@/components/MapSystem/GameMap.vue' // 引入地图组件
import bgImg from '@/assets/bg_main.jpg'

const router = useRouter()
const gameStore = useGameStore()
const mapStore = useMapStore() // 使用 MapStore
const logContainer = ref(null)
const userInput = ref('')
const activeLogId = ref(null)
const editingLogId = ref(null) // 当前正在编辑的日志 ID
const editText = ref('') // 编辑时的临时文本

// 快捷指令占位数据
const quickActions = [
  { id: 'work', label: '接客', icon: '💋' },
  { id: 'map', label: '地图', icon: '🗺️' }, // 修改这里
  { id: 'rest', label: '休息', icon: '💤' },
  { id: 'manage', label: '管理', icon: '📜' },
  { id: 'shop', label: '商店', icon: '🛍️' }
]

function handleQuickAction(action) {
  if (action.id === 'map') {
    mapStore.toggleMap()
    return
  }
  
  // 暂时模拟点击效果，将来这里连接具体逻辑
  userInput.value = `执行指令: [${action.label}]`
  handleSend()
}

// 自动滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight
    }
  })
}

// 发送消息
function handleSend() {
  if (!userInput.value.trim()) return

  // 1. 玩家发言
  gameStore.addLog({
    type: 'player',
    text: userInput.value,
    name: '店主'
  })

  const tempInput = userInput.value
  userInput.value = ''
  scrollToBottom()

  // 2. 模拟系统回复 (后续接驳 AI)
  setTimeout(() => {
    gameStore.addLog({
      type: 'npc',
      name: '系统',
      text: `你刚才说了: "${tempInput}"。 (AI 接口暂未连接)`
    })
    scrollToBottom()
  }, 800)
}

// 开启编辑模式
function startEdit(log) {
  editingLogId.value = log.id
  editText.value = log.text
  // 关闭工具栏
  activeLogId.value = null
}

// 保存编辑
function saveEdit(id) {
  if (editText.value.trim()) {
    gameStore.updateLog(id, editText.value)
  }
  cancelEdit()
}

// 取消编辑
function cancelEdit() {
  editingLogId.value = null
  editText.value = ''
}

// 删除日志
function handleDelete(id) {
  if (confirm('确定要删除这条记录吗？')) {
    gameStore.deleteLog(id)
  }
}

// 重新生成 (模拟)
function handleRegenerate(log) {
  // 逻辑：删除当前这条，并将上一条用户的输入作为“新指令”重新发送
  // 这里暂时简单处理：删除并提示
  if (confirm('重新生成将会删除当前回复，重新请求 AI。继续吗？')) {
    gameStore.deleteLog(log.id)
    // TODO: 触发 AI 重新生成逻辑
    alert('已删除。实际接入 AI 后，这里会触发重新请求。')
  }
}

function handleGirlsPanel() {
  alert('打开 [妓女状态] 面板')
}

onMounted(() => {
  scrollToBottom()
})

// 监听日志变化自动滚动
watch(() => gameStore.logs.length, scrollToBottom)
</script>

<template>
  <div class="game-view" :style="{ backgroundImage: `url(${bgImg})` }">
    <!-- 强力遮罩，确保文字可读性 -->
    <div class="bg-overlay"></div>

    <!-- 1. 顶部悬浮胶囊 (HUD) -->
    <div class="top-layer">
      <div class="control-pill">
        <!-- 返回主页 -->
        <button class="icon-btn" @click="goBack" title="返回主页">
          <span class="icon">🏠</span>
        </button>
        
        <div class="divider"></div>

        <div class="status-item">
            <span class="icon">💰</span>
            <span class="val">{{ gameStore.gold }}</span>
        </div>
        
        <div class="divider"></div>

        <div class="status-item">
            <span class="icon">📅</span>
            <span class="val">Day {{ gameStore.day }}</span>
        </div>

        <div class="divider"></div>

        <!-- 新增：妓女状态入口 -->
        <button class="icon-btn" @click="handleGirlsPanel" title="妓女状态">
          <span class="icon">💋</span>
        </button>

        <div class="divider"></div>

        <!-- 玩家头像 -->
        <div class="avatar-btn">
          <!-- 这里的 src 可以换成玩家头像变量 -->
          <div class="avatar-placeholder">🧙‍♂️</div>
        </div>
      </div>
    </div>

    <!-- 地图覆盖层 (放在这里，作为全局覆盖) -->
    <transition name="fade">
      <GameMap v-if="mapStore.isMapActive" />
    </transition>

    <!-- 2. 游戏文字流区域 -->
    <div class="game-log" ref="logContainer">
      <div 
        v-for="log in gameStore.logs" 
        :key="log.id"
        class="log-item"
        :class="[log.type, { active: activeLogId === log.id, editing: editingLogId === log.id }]"
        @click="!editingLogId && toggleLogTool(log.id)"
      >
        <!-- 名字 (仅 NPC/Player 显示) -->
        <div v-if="log.type !== 'system'" class="log-name">{{ log.name }}</div>

        <!-- 内容 (普通模式) -->
        <div v-if="editingLogId !== log.id" class="log-content">{{ log.text }}</div>

        <!-- 内容 (编辑模式) -->
        <div v-else class="edit-mode" @click.stop>
          <textarea v-model="editText" rows="3"></textarea>
          <div class="edit-actions">
            <button class="mini-btn save" @click="saveEdit(log.id)">保存</button>
            <button class="mini-btn cancel" @click="cancelEdit">取消</button>
          </div>
        </div>

        <!-- 迷你工具栏 -->
        <div v-if="editingLogId !== log.id" class="mini-toolbar" @click.stop>
            <button class="tool-btn" @click="startEdit(log)">📝 修改</button>
            <button class="tool-btn" @click="handleDelete(log.id)">🗑️ 删除</button>
            <button class="tool-btn" @click="handleRegenerate(log)">🔄 重新生成</button>
        </div>
      </div>
    </div>

    <!-- 3. 底部输入区 (地图模式下隐藏) -->
    <div class="bottom-input-layer" v-show="!mapStore.isMapActive">
      <!-- 新增：快捷指令栏 -->
      <div class="quick-actions-bar">
        <button 
          v-for="action in quickActions" 
          :key="action.id"
          class="quick-btn"
          @click="handleQuickAction(action)"
        >
          <span class="btn-icon">{{ action.icon }}</span>
          <span class="btn-label">{{ action.label }}</span>
        </button>
      </div>

      <div class="input-wrapper">
        <input 
          v-model="userInput" 
          type="text" 
          placeholder="输入指令或与角色对话..."
          @keyup.enter="handleSend"
        />
        <BaseButton class="send-btn" @click="handleSend">发送</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 定义局部 CSS 变量，覆盖全局或适配组件 */
.game-view {
  --pill-bg: rgba(20, 10, 5, 0.85); /* 深褐色磨砂背景 */
  --pill-border: rgba(255, 215, 0, 0.2); /* 淡金色边框 */
  --text-main: #e6edf3;
  --text-player: #89d185; /* 玩家文字：柔和绿 */
  --text-npc: #fff;
  --input-bg: rgba(0, 0, 0, 0.7);
  
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: center;
  overflow: hidden;
}

.bg-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(10, 5, 10, 0.85); /* 深色遮罩，突出文字 */
  z-index: 0;
}

/* --- 1. Top HUD --- */
.top-layer {
  position: fixed;
  top: 0; left: 0; right: 0;
  /* 适配刘海屏 */
  padding: max(16px, var(--safe-top)) 16px 16px 16px;
  display: flex;
  justify-content: space-between;
  z-index: 100;
  pointer-events: none;
}

/* 只是为了把胶囊挤到右边去 (如果只想右对齐) */
.top-layer::before { content: ''; flex: 1; }

.control-pill {
  pointer-events: auto;
  background: var(--pill-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--pill-border);
  border-radius: 30px;
  padding: 6px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  color: var(--text-main);
  font-family: var(--font-title);
}

.divider { width: 1px; height: 16px; background: rgba(255,255,255,0.2); }

.icon-btn {
  background: none; border: none; cursor: pointer;
  font-size: 1.2rem; display: flex; align-items: center;
  opacity: 0.8; transition: opacity 0.2s;
}
.icon-btn:hover { opacity: 1; transform: scale(1.1); }

.status-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ffd700;
}

.avatar-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  background: #333;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #ffd700;
  position: relative;
  cursor: pointer;
}
.avatar-btn::after {
  content: ''; position: absolute; top: -2px; right: -2px;
  width: 10px; height: 10px; background: #ff5252;
  border-radius: 50%; border: 2px solid #000;
}

/* --- 2. Game Log --- */
.game-log {
  position: relative;
  z-index: 10;
  flex: 1;
  /* 增加底部留白，防止内容被输入框遮挡 */
  padding: 80px 16px 120px 16px; 
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* iOS顺滑滚动 */
  
  /* 隐藏滚动条 */
  scrollbar-width: none; 
}
.game-log::-webkit-scrollbar { display: none; }

.log-item {
  margin-bottom: 24px;
  max-width: 800px;
  margin-left: auto; margin-right: auto;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s;
  position: relative;
}

/* 点击激活样式 */
.log-item.active {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 215, 0, 0.1);
}

.log-name {
  font-size: 0.8rem;
  margin-bottom: 4px;
  opacity: 0.7;
  font-weight: bold;
}

.log-content {
  line-height: 1.6;
  font-size: 1rem;
  white-space: pre-wrap;
}

/* 不同角色的颜色 */
.log-item.player {
  text-align: right;
}
.log-item.player .log-name { color: var(--text-player); }
.log-item.player .log-content { color: var(--text-player); }

.log-item.npc .log-name { color: #ffd700; }
.log-item.npc .log-content { color: var(--text-npc); }

.log-item.system {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 40px;
}
.log-item.system .log-content {
  font-size: 0.85rem;
  color: #8b949e;
  font-style: italic;
  background: rgba(0,0,0,0.3);
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
}

/* 编辑模式样式 */
.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.edit-mode textarea {
  width: 100%;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  padding: 8px;
  border-radius: 8px;
  font-family: inherit;
  resize: vertical;
}
.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.mini-btn {
  padding: 4px 12px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
}
.mini-btn.save { background: var(--accent); color: white; }
.mini-btn.cancel { background: rgba(255,255,255,0.1); color: #ccc; }

/* Mini Toolbar */
.mini-toolbar {
  display: none;
  margin-top: 8px;
  gap: 8px;
  animation: fadeIn 0.2s;
}
.log-item.player .mini-toolbar { justify-content: flex-end; }
.log-item.active .mini-toolbar { display: flex; }

.tool-btn {
  background: #30363d;
  color: #b0bec5;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
}
.tool-btn:hover { background: #40464d; color: #fff; }

/* --- 3. Bottom Input --- */
.bottom-input-layer {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  /* 适配底部 Home 条 */
  padding: 0 16px max(16px, var(--safe-bottom)) 16px;
  z-index: 100;
  /*渐变高度增加，覆盖快捷栏 */
  background: linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-direction: column; /* 改为垂直布局 */
  gap: 12px;
}

.quick-actions-bar {
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  overflow-x: auto; /* 支持横向滚动 */
  padding: 4px 2px;
  /* 隐藏滚动条 */
  scrollbar-width: none;
}
.quick-actions-bar::-webkit-scrollbar { display: none; }

.quick-btn {
  flex: 1;
  min-width: 64px;
  height: 56px;
  background: rgba(48, 54, 61, 0.85); /* 深色磨砂 */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  color: #e6edf3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: all 0.2s;
  /* 手游触摸优化 */
  touch-action: manipulation;
}

.quick-btn:active {
  transform: scale(0.95);
  background: rgba(255, 215, 0, 0.15);
  border-color: rgba(255, 215, 0, 0.5);
}

.btn-icon { font-size: 1.4rem; line-height: 1; }
.btn-label { font-size: 0.75rem; font-weight: bold; opacity: 0.9; }

.input-wrapper {
  width: 100%;
  max-width: 800px;
  display: flex;
  gap: 10px;
  background: var(--pill-bg);
  padding: 8px;
  border-radius: 30px; /* 大圆角胶囊 */
  border: 1px solid rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(10px);
  box-shadow: 0 -4px 20px rgba(0,0,0,0.5);
}

.input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0 16px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  outline: none;
}
.input-wrapper input::placeholder { color: rgba(255,255,255,0.3); }

/* 调整发送按钮样式以适应 Input */
.send-btn :deep(button) {
  min-width: 80px !important;
  height: 40px !important;
  font-size: 0.9rem !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
