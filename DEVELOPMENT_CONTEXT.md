# 开发上下文 (Development Context) & 架构设计

> ⚠️ **致 AI 开发者**: 在开始工作前，请务必阅读本文档。这里记录了项目的核心架构决策和未完成功能的具体实现方案。

## 1. 核心架构决策

### 1.1 混合语言策略
- **现状**: 项目正从 JS 迁移到 TS。
- **规则**: 
  - 新增的 Store 和复杂逻辑层必须使用 **TypeScript**。
  - 现有的 `.vue` 组件暂时保持现状，按需重构。
  - `src/stores/girls.ts` 是目前的数据模型标准。

### 1.2 UI 设计系统
- **禁止**: 引入 ElementUI, AntDesign 等重型组件库。
- **强制**: 使用纯 CSS + `<base-panel>` / `<base-button>` 组件。
- **图标**: 必须使用 `@phosphor-icons/vue`。
- **风格**: 暗黑/金色/魔法风格 (`var(--color-gold)`, `var(--color-purple-deep)`).

---

## 2. 下一步核心任务：AI 指令协议 (AI Command Protocol)

**目标**: 实现在前端截获 AI 的剧情回复，并自动更新游戏状态。

### 2.1 协议标准 (The Protocol)
我们需要 System Prompt 引导 AI 在回复末尾输出被 ` ```json ` 包裹的指令块。

**JSON 结构定义**:
```typescript
type ActionType = 'UPDATE_GIRL' | 'ADD_GOLD' | 'SYSTEM_NOTICE' | 'MOVE_PLAYER';

interface AIAction {
  type: ActionType;
  // UPDATE_GIRL 载荷
  id?: string; 
  data?: {
    sanity?: number; // 增量，如 -5
    energy?: number; // 增量，如 -10
    attire?: string; // 替换文本
    location?: string;
  };
  // ADD_GOLD 载荷
  amount?: number;
  // SYSTEM_NOTICE 载荷
  text?: string;
}
```

### 2.2 实现逻辑 (Implementation Logic)
该功能应在 `src/stores/game.js` 的 `sendMessage` 方法中实现。

1.  **System Prompt**: 修改 AI 调用的提示词，强制要求 JSON 格式。
2.  **Middleware (解析器)**:
    - 接收 AI 原始文本。
    - 正则提取 ` ```json [...] ``` `。
    - `JSON.parse` 解析指令数组。
    - 剔除 JSON 部分，仅保留纯文本剧情用于 UI 显示。
3.  **Executor (执行器)**:
    - 遍历指令数组。
    - 调用 `useGirlsStore().updateGirlStatus(...)` 或修改 `gameStore` 状态。

---

## 3. 数据模型重点 (Data Model Focus)

参考 `src/stores/girls.ts`。我们非常看重以下数值的玩法影响：
- **Sanity (理智)**: 低于 20 应触发崩溃事件。
- **Depravity (堕落)**: 决定可以解锁的高级交互（未来开发）。
- **Skills**: S/A/B/C/D 评级系统。

---

## 4. 待办事项清单 (Detailed Todo)

1.  **GameStore 改造**: 引入 `processAIResponse` 函数 (参考历史对话中的设计)。
2.  **招募系统**: 基于 `girls.ts` 的结构，创建一个生成随机 NPC 的工厂函数。
3.  **持久化**: 目前的 `save.js` 尚未保存 `girlsStore` 的数据，需修复。
