# AGENTS.md - 异世界娼馆模拟器开发指南

> 本文档为 AI 助手提供项目的全面技术上下文，确保代码修改和开发工作的一致性与准确性。

---

## 📋 项目概述

**项目名称**: 异世界娼馆模拟器 (Otherworld Brothel Simulator)

**项目类型**: Vue 3 + Vite 构建的 Web 游戏，采用 AI 驱动剧情的 RPG 模拟经营玩法

**当前版本**: v0.2.0

**核心定位**: 暗黑奇幻风格的经营模拟游戏，玩家作为异世界娼馆的店主，管理员工（NPC）、探索地图、推进 AI 生成的剧情

**当前阶段**: AI Integration & Core Systems (AI 融合与核心系统)

---

## 🏗️ 技术栈与架构

### 核心技术栈
- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5.4.0
- **状态管理**: Pinia 3.0.4
- **路由**: Vue Router 4.6.4
- **图标库**: @phosphor-icons/vue 2.2.1
- **富文本渲染**: markdown-it 14.1.0
- **语言**: JavaScript (遗留代码) + TypeScript (新模块)
- **Node 版本要求**: ^18.0.0 || >=20.0.0
- **开发工具**: vite-plugin-vue-devtools 7.0.0

### 架构设计原则
1. **混合语言策略**: 正从 JS 向 TS 迁移
   - 新增的 Store 和复杂逻辑层**必须使用 TypeScript**
   - 现有 `.vue` 组件暂时保持 JavaScript，按需重构
   - `src/stores/girls.ts` 是数据模型的标准参考

2. **UI 设计系统**
   - **禁止**引入 ElementUI、AntDesign 等重型组件库
   - **强制**使用纯 CSS + 自定义组件（`BaseButton.vue`, `BasePanel.vue`, `TopBar.vue`）
   - **图标**必须使用 `@phosphor-icons/vue`
   - **富文本**使用 `markdown-it` 渲染剧情文本
   - **风格**: 暗黑/金色/魔法风格（使用 `--color-gold`, `--color-purple-deep` 等变量）
   - **优先级**: 移动端体验优先

3. **AI 架构设计**
   - **接口层**: `src/api/llm.js` 封装 OpenAI/Gemini 调用细节
   - **协议层**: AI 输出包含 JSON 指令块，由 `src/stores/game.js` 解析
   - **配置层**: `src/stores/settings.js` 管理 API 配置，支持本地持久化

---

## 📁 目录结构详解

```
hoes/
├── src/
│   ├── components/           # Vue 组件
│   │   ├── Base/            # 基础 UI 组件（必须使用）
│   │   │   ├── BaseButton.vue
│   │   │   ├── BasePanel.vue
│   │   │   ├── TopBar.vue
│   │   │   └── AutoTransparentImage.vue
│   │   ├── Game/            # 游戏核心组件
│   │   │   ├── GameInputBar.vue
│   │   │   ├── GameLogList.vue
│   │   │   ├── LogItem.vue
│   │   │   └── Panel/
│   │   │       └── GirlsPanel.vue  # 员工管理面板
│   │   ├── MapSystem/       # 地图探索系统
│   │   │   ├── GameMap.vue
│   │   │   ├── InteractionMenu.vue
│   │   │   ├── MapControls.vue
│   │   │   ├── MapDashboard.vue
│   │   │   └── MapRenderer.vue
│   │   ├── SettingsModal.vue # 系统/AI 设置弹窗
│   │   └── icons/           # 图标组件
│   ├── stores/              # Pinia 状态管理
│   │   ├── game.js          # 全局游戏状态 & AI 指令处理中间件
│   │   ├── girls.ts         # [TS] 员工/NPC 数据中心（标准参考）
│   │   ├── map.js           # 地图系统状态
│   │   ├── settings.js      # AI 配置与系统设置状态
│   │   └── system.js        # 系统级状态
│   ├── views/               # 页面视图
│   │   ├── HomeView.vue     # 主页
│   │   └── GameView.vue     # 游戏主界面
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── api/                 # API 层
│   │   ├── llm.js           # AI 接口封装 (OpenAI/Gemini)
│   │   └── save.js          # 存档系统（localStorage）
│   ├── styles/              # 全局样式
│   │   ├── main.css
│   │   └── variables.css    # CSS 变量定义
│   ├── utils/               # 工具函数
│   │   └── pixelProcessors.js
│   ├── assets/              # 静态资源
│   │   ├── base.css
│   │   ├── bg_main.jpg
│   │   ├── logo_original.jpg
│   │   ├── logo.svg
│   │   └── main.css
│   ├── App.vue              # 根组件
│   └── main.js              # 入口文件
├── public/                  # 公共静态资源
│   └── favicon.ico
├── vite.config.js           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── jsconfig.json            # JavaScript 配置
├── package.json             # 项目依赖
└── index.html               # HTML 入口
```

---

## 🚀 构建与运行命令

### 开发环境
```bash
npm run dev
```
启动 Vite 开发服务器，默认端口 5173

### 生产构建
```bash
npm run build
```
构建生产版本到 `dist/` 目录

### 预览生产构建
```bash
npm run preview
```
预览构建后的应用

---

## 🎨 UI/UX 开发规范

### CSS 变量系统
所有颜色、尺寸、字体均使用 `src/styles/variables.css` 中定义的变量：

**核心颜色变量**:
- `--color-gold`: 主金色 (#D4AF37)
- `--color-gold-light`: 亮金色 (#FFD700)
- `--color-gold-dark`: 深金色 (#AA8C2C)
- `--color-gold-shadow`: 金色阴影 (#3E2723)
- `--color-red`: 主红色 (#C0392B)
- `--color-purple-deep`: 深紫色背景 (#1A0B2E)
- `--color-purple-dark`: 深紫色面板 (#2E1A47)
- `--color-purple-light`: 亮紫色 (#4A148C)
- `--text-main`: 主文本色 (#FDFEFE)
- `--text-gold`: 金色文本 (#F1C40F)
- `--text-dim`: 暗淡文本 (#B0BEC5)

**语义化变量**:
- `--color-primary`: var(--color-gold)
- `--color-secondary`: var(--color-purple-light)
- `--color-accent`: var(--color-red)
- `--bg-main`: var(--color-purple-deep)
- `--bg-panel`: rgba(20, 10, 30, 0.85)

**尺寸变量**:
- `--header-height`: 48px（移动端）
- `--border-width`: 1px（移动端）/ 2px（桌面端）

### 组件使用规范
1. **按钮**: 必须使用 `<base-button>` 组件
   ```vue
   <base-button label="确定" variant="primary" @click="handleClick" />
   ```

2. **面板**: 必须使用 `<base-panel>` 组件
   ```vue
   <base-panel title="员工信息">
     <!-- 内容 -->
   </base-panel>
   ```

3. **图标**: 使用 `@phosphor-icons/vue`
   ```vue
   <script setup>
   import { PhHeart, PhStar, PhList } from '@phosphor-icons/vue'
   </script>
   <template>
     <PhHeart :size="24" color="var(--color-gold)" />
     <PhList size="20" weight="fill" />
   </template>
   ```

4. **富文本**: 使用 `markdown-it` 渲染剧情文本
   ```vue
   <div v-html="renderMarkdown(text)" />
   ```

### 响应式设计
- 移动端优先（基准字体 14px）
- 桌面端通过媒体查询调整（基准字体 16px，边框加粗）

---

## 💾 数据模型规范

### 员工数据模型（girls.ts 标准参考）

```typescript
// 稀有度类型
type Rarity = 'N' | 'R' | 'SR' | 'SSR';

// 静态数据（不可变）
interface GirlStaticData {
  race: string;           // 种族
  rarity: Rarity;         // 稀有度
  features: string[];     // 外貌特征
  traits: string[];       // 特质（如 ['敏感', '高傲']）
  measurements: string;   // 三围
  description: string;    // 描述
  avatar?: string;        // 头像路径
}

// 动态数据（可变）
interface GirlDynamicData {
  // 生理维
  energy: {
    current: number;
    max: number;
  };
  // 心理维
  sanity: {
    current: number;
    max: number;
    status: '正常' | '恍惚' | '崩溃' | '疯狂';
  };
  obedience: number;      // 服从度 (0-100)
  depravity: number;      // 堕落度 (0-100)
  
  // 经营维
  location: string;
  currentActivity: string;
  dailyIncome: number;
  attire: string;
  
  // 技能评级（S/A/B/C/D）
  skills: {
    service: string;      // 侍奉
    technique: string;    // 技巧
    endurance: string;    // 耐力
  }
}

// 完整员工对象
interface Girl {
  id: string;
  name: string;
  static: GirlStaticData;
  dynamic: GirlDynamicData;
}

// 更新指令接口
interface GirlStatusUpdate {
  sanity?: number;    // 增量
  energy?: number;    // 增量
  obedience?: number; // 增量
  depravity?: number; // 增量
  attire?: string;    // 替换
  location?: string;  // 替换
  currentActivity?: string; // 替换
}
```

### 游戏状态模型（game.js）

```javascript
{
  gold: number,        // 金币
  day: number,         // 游戏天数
  energy: number,      // 玩家精力
  logs: Array          // 游戏日志（聊天记录）
}
```

### 设置状态模型（settings.js）

```javascript
{
  // 基础设置
  volume: number,           // 音量 (0-100)
  
  // AI 设置
  aiProvider: string,       // 'openai' | 'gemini'
  enableTools: boolean,     // 是否允许 AI 调用工具
  
  // OpenAI 配置
  openaiBaseUrl: string,    // API Endpoint
  openaiApiKey: string,     // API Key
  openaiModel: string,      // 模型名称
  
  // Gemini 配置
  geminiBaseUrl: string,    // API Endpoint
  geminiApiKey: string,     // API Key
  geminiModel: string       // 模型名称
}
```

---

## 🔧 核心功能实现指南

### 1. AI 指令协议（已完成）

**目标**: 从 AI 的自然语言回复中提取 JSON 指令，自动更新游戏状态

**协议标准**:
AI 回复末尾应包含被 ` ```json ` 包裹的指令块：

```json
[
  {
    "type": "UPDATE_GIRL",
    "id": "g001",
    "data": {
      "sanity": -5,
      "energy": -10,
      "depravity": 2
    }
  },
  {
    "type": "ADD_GOLD",
    "amount": 50
  },
  {
    "type": "SYSTEM_NOTICE",
    "text": "系统提示信息"
  }
]
```

**支持的指令类型**:
- `UPDATE_GIRL`: 更新员工状态（sanity, energy, obedience, depravity, attire, location, currentActivity）
- `ADD_GOLD`: 增加金币
- `SYSTEM_NOTICE`: 系统通知

**实现位置**: `src/stores/game.js` 的 `processAIResponse` 方法

**实现逻辑**:
1. 正则提取 ` ```json [...] ``` ` 块
2. `JSON.parse` 解析指令数组
3. 剔除 JSON 部分，保留纯文本剧情
4. 遍历指令数组，调用相应的 Store 方法更新状态
5. 使用 `useGirlsStore().updateGirlStatus()` 更新员工数据

### 2. AI 接口层（已完成）

**实现位置**: `src/api/llm.js`

**支持模式**:
- **OpenAI 兼容模式**: 支持任何兼容 OpenAI API 格式的服务
- **Gemini 原生模式**: 使用 Google Gemini 原生 API

**核心功能**:
- `callLLM(userMessage, gameStateContext)`: 调用 AI 获取剧情回复
- `fetchModels(provider)`: 获取可用模型列表

**System Prompt**: 定义了 AI 的角色、输出格式和指令协议

### 3. 设置系统（已完成）

**实现位置**: `src/stores/settings.js`

**功能**:
- 管理 AI 配置（Provider, API Key, Endpoint, Model）
- 管理系统设置（音量）
- 自动持久化到 localStorage
- 支持 `enableTools` 开关（实验性功能，用于 Function Calling）

**UI 组件**: `src/components/SettingsModal.vue`
- 通用设置面板（音量）
- AI 连接配置面板
- 支持获取模型列表功能

### 4. 存档系统（待修复）

**当前状态**: `src/api/save.js` 提供了基础的 localStorage 存储功能

**待修复**: 
- `save.js` 尚未保存 `girlsStore` 和 `settingsStore` 的数据
- 需要持久化所有动态生成的 NPC 数据

**使用方法**:
```javascript
import saveAPI from '@/api/save'

// 保存
await saveAPI.saveGame({
  game: gameStore.$state,
  girls: girlsStore.$state,
  settings: settingsStore.$state
})

// 读取
const data = await saveAPI.loadGame()
if (data) {
  gameStore.$patch(data.game)
  girlsStore.$patch(data.girls)
  settingsStore.$patch(data.settings)
}
```

### 5. 招募系统（待实现）

**目标**: 基于 `girls.ts` 的结构，创建随机 NPC 生成工厂函数

**实现位置**: `src/utils/girlFactory.ts`（需新建）

**实现要点**:
- 使用 Rarity (N/R/SR/SSR) 权重系统：N(50%), R(30%), SR(15%), SSR(5%)
- 随机生成种族（Human, Elf, Catgirl, Succubus...）
- 随机生成特征和特质
- 基于稀有度决定特质数量
- 初始化动态数据（sanity, obedience, depravity 等）
- 调用 `useGirlsStore().addGirl(newGirl)` 添加到游戏

---

## 📝 开发约定

### 代码风格
1. **组件命名**: PascalCase（如 `BaseButton.vue`, `GirlsPanel.vue`, `SettingsModal.vue`）
2. **文件命名**:
   - Vue 组件: PascalCase
   - JavaScript/TS 文件: camelCase
   - 工具函数: camelCase
3. **Store 命名**: `useXxxStore`（如 `useGameStore`, `useGirlsStore`, `useSettingsStore`）
4. **变量命名**: camelCase

### TypeScript 使用
- 新增 Store 必须使用 TypeScript
- 使用 `interface` 定义数据模型
- 使用 `type` 定义联合类型
- 启用严格模式（`strict: true`）

### 注释规范
- 仅在复杂逻辑处添加注释，解释"为什么"而非"是什么"
- 使用 JSDoc 风格注释复杂函数

### Git 提交规范
- 提交信息应简洁明了，聚焦于"为什么"而非"是什么"
- 示例: `feat: 实现员工技能评级系统`、`fix: 修复 TopBar 图标渲染错误`

---

## 🎯 当前开发优先级

### 高优先级
1. **存档系统修复**: 重构 `save.js`，整合 `girlsStore` 和 `settingsStore` 数据
2. **招募系统**: 创建 `src/utils/girlFactory.ts`，实现随机 NPC 生成
3. **UI 接入**: 在主界面或游戏内添加"招募"入口，调用工厂函数并扣除金币

### 中优先级
1. **日程安排系统**: 为员工分配"接客"、"调教"、"休息"指令
2. **地图交互完善**: 实现 10x10 网格地图的点击移动与随机事件
3. **崩溃事件**: 当 SAN 值低于 20 时触发特殊事件
4. **AI 记忆系统**: 开启 `llm.js` 中的工具调用功能，实现 `save_memory` / `recall_memory`

### 低优先级
1. **UI 组件重构**: 将现有 JS 组件逐步迁移到 TypeScript
2. **测试覆盖**: 添加单元测试和集成测试

---

## 🔍 调试与问题排查

### 常见问题
1. **图标不显示**: 检查是否正确导入 `@phosphor-icons/vue`
2. **样式不生效**: 确认是否使用了 CSS 变量而非硬编码颜色
3. **状态不更新**: 检查 Pinia Store 的调用方式是否正确
4. **AI 连接失败**: 检查 API Key 和 Endpoint 配置，查看浏览器控制台错误日志

### 开发工具
- Vue DevTools（已集成 `vite-plugin-vue-devtools`）
- 浏览器开发者工具的 Vue 面板
- 浏览器控制台（查看 AI 调用日志和错误）

### AI 指令调试
在 `src/stores/game.js` 的 `processAIResponse` 方法中，已添加 `console.log('[AI Protocol] Executing commands:', commands)` 用于调试指令执行。

---

## 📚 相关文档

- `README.md`: 项目介绍和进度概览
- `DEVELOPMENT_CONTEXT.md`: 详细的架构设计和实现方案

---

## ⚠️ 重要提醒

1. **严禁创建恶意代码**: 本项目仅为娱乐目的，不得用于任何非法或恶意用途
2. **数据安全**: 不要在代码中硬编码敏感信息（API 密钥、密码等）
3. **性能优化**: 移动端优先，注意组件渲染性能
4. **兼容性**: 确保在主流移动浏览器上正常运行
5. **AI 安全**: 所有 API Key 通过 localStorage 本地存储，不会上传到服务器

---

**最后更新**: 2026-01-29
**维护者**: ranbo12138