# 异世界娼馆模拟器 (Otherworld Brothel Simulator)

> 一个由 AI 驱动剧情、深度 RPG 模拟经营的异世界 Web 游戏。

## 📅 项目进度 (Development Status)

**当前阶段：Core Loop & Systems V2 (Soul Injection)**

### ✨ 近期更新 (Recent Updates)

#### 1. AI 记忆系统 (Memory System) - *New*
- **Memory Store**: 实现了基于 Events (经历) 和 Facts (认知) 的双层记忆结构。
- **Auto-Memorization**: AI 现在可以通过 `SAVE_EVENT` 等指令主动记录它认为重要的事情。
- **Context Injection**: 对话时会自动检索相关记忆，让 NPC "记得" 发生过的事。

#### 2. UI/UX 3.0 "Arcane" - *New*
- **Visual Overhaul**: 全面移除了工业化 UI 痕迹，转向 "魔法遗物" 风格。
  - **Global Noise**: 全局噪点纹理。
  - **Chamfered Panels**: 切角八边形容器 + 装饰性边框。
  - **Floating HUD**: 悬浮式的时间轮盘与操作坞。

#### 3. 核心玩法闭环
- **招募系统**: 塔罗牌风格随机 NPC 生成。
- **日程系统**: 每日任务分配与结算。
- **持久化存档**: 完整支持 Game/Girls/Memory 状态保存。

---

## 🏗️ 核心架构 (Architecture)

### 技术栈
- **Frontend**: Vue 3 (Composition API) + Vite
- **State**: Pinia (TypeScript)
- **UI**: Custom CSS (Magic/Dark Theme) / Phosphor Icons
- **AI**: Fetch API + Custom Protocol (JSON Schema)

### 目录结构
```
src/
├── api/
│   ├── llm.js         # AI 接口 (OpenAI/Gemini)
│   └── save.js        # 存档管理
├── components/
│   ├── Base/          # BaseButton, BasePanel
│   ├── Game/          # GameHUD, GameLogList, etc.
│   │   └── Panel/     # RecruitPanel, SchedulePanel
│   └── ...
├── stores/
│   ├── game.js        # 全局状态
│   ├── girls.ts       # [TS] NPC 数据
│   ├── memory.ts      # [TS] AI 记忆库
│   └── schedule.ts    # [TS] 日程逻辑
└── types/             # [TS] 类型定义
```

---

## 🚀 后续开发路线 (Roadmap)

### Phase 3.5: 丰富性扩展 (Variety)
- [ ] **事件扩展**: 增加“特殊客人”、“突发事件”、“道具交互”等丰富日程的内容。
- [ ] **AI 主动性**: 让 AI 在闲聊中主动提起往事 (Active Recall)。

---

## 📝 开发者笔记
*   **Map System Removed**: 地图系统已被移除，专注于经营模拟与叙事。
*   **UI Style**: 保持 `variables.css` 中的深渊/金色调，严禁引入扁平化/Material Design 元素。
