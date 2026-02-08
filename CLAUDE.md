# CLAUDE.md

这个文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

**异世界娼馆模拟器** - 一个由 AI 驱动剧情的深度 RPG 模拟经营 Web 游戏。

- **技术栈**: Vue 3 (Composition API) + Vite + Pinia + TypeScript/JavaScript 混合
- **AI 集成**: 支持 OpenAI 和 Gemini API，通过自定义 JSON 协议驱动游戏状态变化
- **平台**: 移动端优先的响应式设计

## 常用命令

### 开发
```bash
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run preview    # 预览生产构建
```

### 依赖管理
```bash
npm install        # 安装依赖
```

**注意**: 项目要求 Node.js ^18.0.0 或 >=20.0.0

## 核心架构

### 1. 分层架构原则

项目采用严格的分层架构，**必须遵守**以下规则：

#### Engine Layer (`src/engines/`)
- **职责**: 纯函数计算引擎，处理所有游戏逻辑
- **规则**:
  - 必须是纯函数（无副作用）
  - 不能直接访问 Store
  - 所有计算逻辑必须在这里实现
- **现有引擎**:
  - `scheduleEngine.ts`: 日程系统（任务配置、随机事件、结算计算）
  - `girlEngine.ts`: NPC 状态更新和状态机

#### Store Layer (`src/stores/`)
- **职责**: 状态管理，调用 Engine 执行逻辑
- **规则**:
  - 只持有状态 (`ref`) 和调用 Engine
  - 不应包含复杂的 `if-else` 业务逻辑
  - 新增 Store 必须使用 TypeScript
- **核心 Stores**:
  - `game.js`: 全局状态（金币、天数、日志）+ AI 指令处理中间件
  - `girls.ts`: NPC 数据管理
  - `memory.ts`: AI 记忆系统（Events + Facts）
  - `schedule.ts`: 日程分配与结算
  - `market.ts`: 黑市交易系统
  - `settings.js`: AI 配置（API Keys、模型选择）

### 2. AI 系统架构

#### AI 协议 (`src/api/llm.js`)
游戏通过自定义 JSON 协议与 LLM 通信：

**AI 输出格式**:
1. 叙事文本（显示给玩家）
2. JSON 指令块（驱动游戏状态变化）

**支持的指令类型**:
- `UPDATE_GIRL`: 更新 NPC 状态（精力、理智、服从度等）
- `ADD_GOLD`: 修改金币
- `SYSTEM_NOTICE`: 系统通知
- `SAVE_EVENT`: 记录关键事件到记忆系统
- `SAVE_FACT`: 记录 NPC 永久特征

**处理流程**:
`game.js:processAIResponse()` 解析 AI 回复 → 提取 JSON 指令 → 执行状态变更 → 返回纯文本给玩家

#### 记忆系统 (`src/stores/memory.ts`)
- **短期记忆**: 当前对话上下文（由 `game.js` 的 logs 维护）
- **长期记忆 - Events**: 关键事件记录（如"第一次接客"）
- **长期记忆 - Facts**: 静态知识库（如"爱丽丝怕黑"）
- **检索机制**: `recall()` 函数通过关键词匹配注入相关记忆到 LLM Context

### 3. 游戏系统

#### 日程系统
- **配置**: `scheduleEngine.ts:TASKS_CONFIG` 定义所有任务类型
- **随机事件**: `RANDOM_EVENTS` 数组定义触发条件和效果
- **结算**: `calculateDailySchedule()` 纯函数计算一天的所有结果

#### NPC 系统
- **数据结构**: 分离为 Static（不变属性）和 Dynamic（动态属性）
- **状态机**: SAN 值状态：正常 → 恍惚 → 崩溃 → 疯狂

#### 经济循环
黑市购买道具 → 使用道具恢复状态 → 派遣 NPC 工作 → 获得金币 → 循环

## 代码规范

### TypeScript 迁移策略
- **新代码**: 所有新增的 Store 和 Engine 必须使用 TypeScript
- **类型定义**: 存放在 `src/types/` 目录
- **现有 JS 文件**: 可以保持不变，但建议逐步迁移

### UI 设计系统

**风格**: Arcane Artifact（奥术造物）- 诱惑/氛围/魔法/暗黑

**核心组件**:
- `BaseButton`: 带流光和扫光动效
- `BasePanel`: 八边形切角 + 装饰性内边框
- `GameHUD`: 悬浮式 HUD（时间轮盘、资源显示、操作坞）

**设计原则**:
- 使用 `variables.css` 中定义的深渊紫/炼金金配色
- 全局噪点纹理去除数码感
- 严禁引入扁平化/Material Design 元素
- 所有面板使用切角八边形（`clip-path` 或 CSS border trick）

### 文件路径注意事项
- 项目使用 `@` 别名指向 `src/` 目录（配置在 `vite.config.js`）
- 示例: `import { useGameStore } from '@/stores/game'`

## 重要文档

- `README.md`: 项目介绍和开发路线
- `DEVELOPMENT_CONTEXT.md`: 详细的架构决策和待办事项
- `VISUAL_DESIGN_ANALYSIS.md`: UI/UX 设计规范和组件库说明

## 存档系统

- **位置**: `src/api/save.js`
- **支持**: 多 Store 打包（Game、Girls、Memory、Schedule、Market）
- **格式**: LocalStorage JSON 序列化

## 开发注意事项

1. **不要破坏分层架构**: 业务逻辑必须在 Engine 层，Store 只做状态管理
2. **AI 指令扩展**: 新增指令类型需要在 `game.js:processAIResponse()` 和 `llm.js:SYSTEM_PROMPT` 同步更新
3. **随机事件**: 扩展事件库时在 `scheduleEngine.ts:RANDOM_EVENTS` 添加
4. **UI 一致性**: 新增 UI 组件必须遵循 Arcane 风格，参考 `VISUAL_DESIGN_ANALYSIS.md`
5. **记忆系统**: AI 主动记录依赖 LLM 正确使用 `SAVE_EVENT`/`SAVE_FACT` 指令
