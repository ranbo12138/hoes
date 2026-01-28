# 异世界娼馆模拟器 (Otherworld Brothel Simulator)

> 一个由 AI 驱动剧情、深度 RPG 模拟经营的异世界 Web 游戏。

## 📅 项目进度 (Development Status)

**当前阶段：AI Integration & Core Systems (AI 融合与核心系统)**

### ✨ 近期更新 (Recent Updates)

#### 1. AI 深度融合 (AI Integration) - *Completed*
- **多模态 AI 连接**：支持 **OpenAI** (及兼容接口) 和 **Google Gemini** (原生接口) 两种模式。
- **AI 指令协议 (Protocol)**：实现了基于 JSON 的指令协议，AI 可直接控制游戏数值（如 `UPDATE_GIRL`, `ADD_GOLD`）。
- **实时剧情驱动**：NPC 的状态（理智/精力/堕落度）现在会随 AI 剧情实时变化，并反馈到 UI 上。
- **配置面板**：新增独立的“AI 连接”设置页，支持获取模型列表、自定义 Endpoint 和工具调用开关。

#### 2. UI/UX 全面升级
- **纯 CSS 组件化**：移除旧版图片素材依赖，全面采用 CSS3 实现“暗黑/奢华/魔法”风格的 UI（`BaseButton`, `BasePanel`）。
- **图标系统**：集成 `@phosphor-icons/vue`，统一全站视觉语言。
- **移动端适配**：优化了 `TopBar` 和 `GameInputBar` 的布局，确保在移动端的高质感体验。

#### 3. 员工管理系统 (Employee System)
- **TypeScript 迁移**：核心数据层 `girls.ts` 已全面 TypeScript 化。
- **深度数据模型**：包含理智 (Sanity)、堕落度 (Depravity)、精力 (Energy) 等多维数值。
- **技能评级系统**：实现了 S/A/B/C/D 五级技能评价。

---

## 🏗️ 核心架构 (Architecture)

### 技术栈
- **Frontend**: Vue 3 (Composition API) + Vite
- **State Management**: Pinia (支持 TypeScript)
- **UI Framework**: Custom CSS / Phosphor Icons
- **AI Layer**: Fetch API + Custom Protocol Middleware
- **Language**: JavaScript (Legacy) / TypeScript (New Modules)

### 目录结构
```
src/
├── api/
│   └── llm.js         # AI 接口封装 (OpenAI/Gemini)
├── components/
│   ├── Base/          # 基础 UI 组件 (Button, Panel, TopBar)
│   ├── Game/          # 游戏核心组件 (LogList, InputBar)
│   ├── SettingsModal.vue # 系统/AI 设置弹窗
│   └── ...
├── stores/
│   ├── game.js        # 全局游戏状态 & AI 指令处理中间件
│   ├── girls.ts       # [TS] 员工/NPC 数据中心
│   ├── settings.js    # AI 配置与系统设置状态
│   └── ...
└── views/             # 页面视图 (HomeView, GameView)
```

---

## 🚀 后续开发路线 (Roadmap)

### Phase 2: 经营与招募 (Next Step)
- [ ] **招募/黑市系统**: 基于 Rarity 和 Traits 的抽卡或购买系统，从 `useGirlsStore` 动态生成新 NPC。
- [ ] **存档系统升级**: 确保持久化存储所有动态生成的 NPC 数据（目前 `save.js` 仅支持基础数据）。

### Phase 3: 玩法扩展
- [ ] **AI 记忆系统 (Memory)**: 利用 Function Calling 让 AI 记录和读取长期剧情关键点。
- [ ] **日程安排系统**: 为每位员工分配“接客”、“调教”或“休息”指令。
- [ ] **地图交互完善**: 实装 10x10 网格地图的点击移动与随机事件触发。

---

## 📝 开发者笔记
*   **AI 开发**：新增了 `src/api/llm.js` 和 `src/stores/settings.js`，修改 `llm.js` 可适配更多模型。
*   **数据模型**：`girls.ts` 是核心，所有 AI 对角色的修改必须通过 `updateGirlStatus` Action 进行。
*   **设计原则**：优先保证移动端体验，保持暗黑奇幻的视觉统一性。
