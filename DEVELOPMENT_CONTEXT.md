# 开发上下文 (Development Context) & 架构设计

> ⚠️ **致 AI 开发者**: 在开始工作前，请务必阅读本文档。这里记录了项目的核心架构决策和未完成功能的具体实现方案。

## 1. 核心架构决策

### 1.1 混合语言策略
- **现状**: 项目正从 JS 迁移到 TS。
- **规则**: 
  - 新增的 Store 和复杂逻辑层必须使用 **TypeScript**。
  - 现有的 `.vue` 组件暂时保持现状，按需重构。
  - `src/stores/girls.ts` 和 `src/stores/schedule.ts` 是目前的 TS 标准范例。

### 1.2 UI 设计系统
- **禁止**: 引入 ElementUI, AntDesign 等重型组件库。
- **强制**: 使用纯 CSS + 自定义组件 (`BaseButton.vue`, `BasePanel.vue`)。
- **图标**: 必须使用 `@phosphor-icons/vue`。
- **风格**: 诱惑/氛围/18+/魔法风格 (Seductive/Atmospheric/Magic).
  - 关键词: `Glow`, `Glassmorphism`, `Gold`, `Dark Purple`.
- **优先级**: 移动端体验优先 (Mobile First)。

### 1.4 模块化与工程标准
- **组件解耦**: UI 组件应剥离具体业务逻辑，通过 Props/Events 通信。
- **逻辑复用**: 复杂的状态逻辑应封装为 Composables 或 Store Actions。

---

## 2. 下一步核心任务：AI 灵魂注入 (Soul Injection)

**目标**: 让游戏摆脱单纯的数值循环，通过 AI 记忆让每个 NPC 变得鲜活。

### 2.1 AI 记忆系统 (Memory System)
- **Location**: `src/stores/memory.ts` (需新建)
- **Concept**:
  - **Short-term**: 当前对话 Context（已实现）。
  - **Long-term**: 关键事件记录（如“第一次接客”、“堕落度突破50”）。
- **Implementation**:
  - 在 `src/api/llm.js` 中启用 `tools` (Function Calling)。
  - 定义 `save_memory(key, value)` 和 `recall_memory(key)` 工具。

### 2.2 事件多样性 (Event Variety)
- 目前日程只有 3 种基础任务。
- **计划**:
  - 新增 `TaskType`: `special_service`, `outdoor_event`.
  - 在 `schedule.ts` 中引入随机性（成功/失败判定）。

---

## 3. 已完成的核心模块 (Completed Modules)

### 3.1 核心循环 (Core Loop)
- **存档**: `src/api/save.js` 支持多 Store 打包。
- **招募**: `RecruitPanel` + `girlFactory` (SSR/SR/R/N 体系)。
- **日程**: `SchedulePanel` + `schedule.ts` (每日任务分配与结算)。

### 3.2 UI/UX 2.0
- **风格**: 确立了以 `variables.css` 为核心的魔法光效风格。
- **组件**: `BaseButton` (流光), `BasePanel` (毛玻璃), `RecruitPanel` (塔罗牌)。

### 3.3 工程化
- **TypeScript**: `tsconfig.json` 已配置 `bundler` 模式并开启 `noEmit`，解决了与 Vite 的兼容性问题。

---

## 4. 待办事项清单 (Detailed Todo)

1.  **Memory Store**: 创建 `src/stores/memory.ts`，定义记忆数据结构。
2.  **LLM Tools**: 改造 `src/api/llm.js`，支持工具调用。
3.  **Prompt Engineering**: 优化 System Prompt，使其能主动查询记忆。
