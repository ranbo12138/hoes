# 异世界娼馆模拟器 (Otherworld Brothel Simulator)

> 一个由 AI 驱动剧情、深度 RPG 模拟经营的异世界 Web 游戏。

## 📅 项目进度 (Development Status)

**当前阶段：Core Systems & UI Refinement (核心系统与界面重构)**

### ✨ 近期更新 (Recent Updates)

#### 1. UI/UX 全面升级
- **纯 CSS 组件化**：移除旧版图片素材依赖，全面采用 CSS3 实现“暗黑/奢华/魔法”风格的 UI（`BaseButton`, `BasePanel`）。
- **图标系统**：集成 `@phosphor-icons/vue`，统一全站视觉语言，解决了早期版本的资源缺失报错。
- **移动端适配**：优化了 `TopBar` 和 `GameInputBar` 的布局，确保在移动端的高质感体验。

#### 2. 员工管理系统 (Employee System) - *New!*
- **TypeScript 迁移**：将核心数据层 `girls.ts` 迁移至 TypeScript，提供强类型支持。
- **深度数据模型**：
  - **生理维**：精力 (Energy)。
  - **心理维**：理智 (Sanity)、堕落度 (Depravity) —— 核心暗黑玩法数值。
  - **属性维**：稀有度 (N/R/SR/SSR)、特质 (Traits)、三围数据。
- **技能评级系统**：实现了 S/A/B/C/D 五级技能评价（侍奉/技巧/耐力），并支持查看下一级进阶预览。
- **可视化面板**：全新的 `GirlsPanel`，支持“概览/技能/档案”三页签切换，动态展示员工状态。

#### 3. 基础架构修复
- 修复了 `TopBar` 和 `GameInputBar` 中因图标库版本差异导致的 `SyntaxError`。
- 优化了 Vue Router 的导航守卫逻辑，确保“开始游戏”流程顺畅。

---

## 🏗️ 核心架构 (Architecture)

### 技术栈
- **Frontend**: Vue 3 (Composition API) + Vite
- **State Management**: Pinia (支持 TypeScript)
- **UI Framework**: Custom CSS / Phosphor Icons
- **Language**: JavaScript (Legacy) / TypeScript (New Modules)

### 目录结构
```
src/
├── components/
│   ├── Base/          # 基础 UI 组件 (Button, Panel, TopBar)
│   ├── Game/          # 游戏核心组件 (LogList, InputBar)
│   │   └── Panel/     # 弹窗面板 (GirlsPanel)
│   └── MapSystem/     # 地图探索系统
├── stores/
│   ├── game.js        # 全局游戏状态 (金币, 时间, 日志)
│   └── girls.ts       # [TS] 员工/NPC 数据中心
└── views/             # 页面视图 (HomeView, GameView)
```

---

## 🚀 后续开发路线 (Roadmap)

### Phase 1: AI 深度融合 (Next Step)
- [ ] **AI 指令协议 (AI Command Protocol)**: 开发中间件，从 AI 的自然语言回复中提取 JSON 指令（如 `UPDATE_GIRL`, `ADD_GOLD`），实现剧情自动驱动游戏数据变化。
- [ ] **动态剧情生成**: 让 NPC 的对话根据当前的 SAN 值和堕落度自动变化风格。

### Phase 2: 经营与招募
- [ ] **招募/黑市系统**: 基于 Rarity 和 Traits 的抽卡或购买系统，从 `useGirlsStore` 动态生成新 NPC。
- [ ] **存档系统升级**: 确保持久化存储所有动态生成的 NPC 数据。

### Phase 3: 玩法扩展
- [ ] **日程安排系统**: 为每位员工分配“接客”、“调教”或“休息”指令。
- [ ] **地图交互完善**: 实装 10x10 网格地图的点击移动与随机事件触发。

---

## 📝 开发者笔记
*   目前 `girls.ts` 已启用 TypeScript，后续新增 Store 建议优先使用 TS。
*   图标库使用 `@phosphor-icons/vue`，组件命名采用 PascalCase (如 `PhHeart`)。
*   **设计原则**：优先保证移动端体验，保持暗黑奇幻的视觉统一性。
