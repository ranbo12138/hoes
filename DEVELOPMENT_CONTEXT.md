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
- **富文本**: 使用 `markdown-it` 渲染剧情文本。
- **风格**: 暗黑/金色/魔法风格 (`var(--color-gold)`, `var(--color-purple-deep)`).

### 1.3 AI 架构 (AI Architecture)
- **接口层**: `src/api/llm.js` 封装了 OpenAI/Gemini 的调用细节。
- **协议层**: AI 输出包含 ` ```json ` 指令块，由 `src/stores/game.js` 中的 `processAIResponse` 解析。
- **配置层**: `src/stores/settings.js` 管理 API Key 和 Endpoint，支持本地持久化。

---

## 2. 下一步核心任务：基础功能补全 (Basic Systems)

**目标**: 完善游戏的循环体验，确保“招募-经营-存档”流程闭环。

### 2.1 存档系统修复 (Save System Fix)
目前 `save.js` 只保存了 `gameStore`，**丢失了 `girlsStore` 和 `settingsStore`**。
- **任务**: 
  - 重构 `save.js`，使其支持多 Store 的打包保存/读取。
  - 在加载存档时，正确初始化 `girls.ts` 中的动态列表。

### 2.2 招募系统 (Recruitment)
需要一个工厂函数来生成随机 NPC。
- **Location**: `src/utils/girlFactory.ts` (需新建)
- **Logic**: 
  - 随机种族 (Race): Human, Elf, Catgirl, Succubus...
  - 随机稀有度 (Rarity): N(50%), R(30%), SR(15%), SSR(5%).
  - 随机特质 (Traits): 基于稀有度决定特质数量。
  - 随机属性: 生成初始三围、理智上限等。

---

## 3. 已完成的核心模块 (Completed Modules)

### 3.1 AI 指令协议 (AI Command Protocol)
- **实现**: `src/stores/game.js` -> `processAIResponse`
- **支持指令**:
  - `UPDATE_GIRL`: 更新 Sanity, Energy, Attire 等。
  - `ADD_GOLD`: 增减金币。
  - `SYSTEM_NOTICE`: 系统提示。

### 3.2 数据模型 (Data Model)
- **Files**: `src/stores/girls.ts`
- **Features**: 
  - 完整的 TS 类型定义 (`Girl`, `GirlDynamicData`).
  - 包含理智 (Sanity) 和 堕落度 (Depravity) 核心数值。

---

## 4. 待办事项清单 (Detailed Todo)

1.  **修复存档**: 修改 `save.js`，整合 `girlsStore` 数据。
2.  **工厂函数**: 创建 `src/utils/girlFactory.ts`。
3.  **UI 接入**: 在主界面或游戏内添加“招募”入口，调用工厂函数并扣除金币。
4.  **记忆系统**: 开启 `llm.js` 中的工具调用功能，实现 `save_memory` / `recall_memory`。
