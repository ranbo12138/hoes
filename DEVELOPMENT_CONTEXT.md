# 开发上下文 (Development Context) & 架构设计

> ⚠️ **致 AI 开发者**: 在开始工作前，请务必阅读本文档。这里记录了项目的核心架构决策和未完成功能的具体实现方案。

## 1. 核心架构决策

### 1.1 混合语言策略
- **现状**: 项目正从 JS 迁移到 TS。
- **规则**: 
 - 新增的 Store 和复杂逻辑层必须使用 **TypeScript**。
  - 逻辑计算引擎必须分离到 `src/engines/` 目录。
  - 核心类型定义存放于 `src/types/`。

### 1.2 模块化与工程标准
- **Engine Layer**: 所有的游戏核心计算（日程结算、数值限制、随机判定）都必须是 **纯函数 (Pure Functions)**，放在 `src/engines/` 中。
  - `scheduleEngine.ts`: 负责日程的成功率、消耗、收益计算。
  - `girlEngine.ts`: 负责 NPC 的状态更新、状态机流转 (Sanity Check)。
- **Store Layer**: Pinia Store 仅负责持有状态 (`ref`) 和调用 Engine，不应包含复杂的 `if-else` 业务逻辑。

### 1.3 UI 设计系统 (Design System)
- **风格**: 诱惑/氛围/魔法/暗黑 (Seductive/Atmospheric/Magic/Dark).
- **组件**: 
  - `BaseButton`: 带有流光和扫光动效的按钮。
  - `BasePanel`: 八边形切角 + 装饰性内边框的通用容器。
  - `GameHUD`: 悬浮式 HUD，包含时间轮盘 (Rune)、资源吊坠和 Action Bar。
- **全局**: 使用噪点纹理 (`noise`) 去除数码味，强化"古籍"质感。

---

## 2. 核心系统状态 (System Status)

### 2.1 经济循环 (Economy Loop) - *Implemented*
- **黑市 (Market)**: 
  - 提供 `vitality_potion`, `vintage_wine`, `collar` 等道具。
  - 实现了 购买 -> 消耗 -> 状态恢复/改变 的完整闭环。
- **日程 (Schedule)**:
  - 派遣 NPC 工作 -> 消耗精力/理智 -> 获得金币 -> 去黑市买药恢复。

### 2.2 AI 记忆系统 (Memory System) - *Core Implemented*
- **Location**: `src/stores/memory.ts`
- **Concept**:
  - **Short-term**: 当前对话 Context（已实现）。
  - **Long-term Events**: 关键事件记录 (`addEvent`)，如“第一次接客”。
  - **Long-term Facts**: 静态知识库 (`addFact`)，如“爱丽丝怕黑”。
- **Mechanism**: 
  - 通过 LLM Tool Calling (`SAVE_EVENT`, `SAVE_FACT`) 主动写入。
  - 每次 LLM 请求前，使用关键词匹配 (`recall`) 注入相关记忆上下文。

### 2.3 角色系统 (Character System)
- **数据结构**: 分离为 Static (不变属性) 和 Dynamic (动态属性)。
- **状态机**: 引入了 SAN 值状态 (`正常` -> `恍惚` -> `崩溃` -> `疯狂`)。

---

## 3. 已完成的核心模块 (Completed Modules)

### 3.1 核心循环 (Core Loop)
- **存档**: `src/api/save.js` 支持多 Store (Game, Girls, Memory) 打包。
- **招募**: `RecruitPanel` + `girlFactory` (SSR/SR/R/N 体系)。
- **日程**: `SchedulePanel` + `scheduleEngine.ts` (每日任务分配与结算)。
- **交易**: `MarketPanel` + `market.ts` (道具购买与使用)。

### 3.2 UI/UX 3.0 (Arcane Upgrade)
- 全面重构了 UI，移除了通用 App 风格。
- **New HUD**: 悬浮式布局，更加沉浸。
- **Settings UX**: 模型选择优化为下拉列表 + 自动获取，极大提升了配置体验。

---

## 4. 待办事项清单 (Detailed Todo)

1.  **Event Content**: 扩充 `scheduleEngine.ts` 中的随机事件库，目前数量较少。
2.  **Item Diversity**: 黑市目前只有 4 种商品，需要更多功能性道具（如增加特定技能经验的书籍）。
3.  **NPC Interaction**: 实现“赠送礼物”功能，利用 Market 买到的物品增加 NPC 好感度。
4.  **Prompt Optimization**: 优化 System Prompt，使其能更主动地利用 Memory 系统 (Active Recall)。
