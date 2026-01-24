# 🏰 异世界娼馆模拟器 (Otherworld Brothel Simulator)

> 沉浸式异世界经营 RPG，融合文字冒险与地图探索。

## 📱 项目状态 (Project Status)

**当前版本**: v0.1.0 (Early Access)
**开发阶段**: UI 框架与核心系统原型构建

### ✅ 已完成功能
1.  **沉浸式主页**:
    - 动态背景适配与自动 Logo 去黑底算法 (`AutoTransparentImage`).
    - 异世界风格 UI 组件库 (GreenUI 风格).
2.  **手游化适配**:
    - 全面适配 iOS/Android 刘海屏与底部 Home 条 (`safe-area-inset`).
    - 触摸反馈优化，禁止浏览器默认缩放与长按选中.
3.  **游戏主界面 (GameLoop)**:
    - 类似 LLM 的流式对话日志.
    - 支持对历史文本的 **编辑 / 删除 / 重新生成** (为接入 AI 做准备).
    - 底部快捷指令栏 (Quick Actions).
4.  **矩阵地图系统 (MapSystem)**:
    - 13x12 高精度瓦片地图 (Tile-based Matrix).
    - 虚拟方向键 (D-pad) 移动控制.
    - 区域实时感知 (移动触发区域描述).
    - 实体交互逻辑 (NPC/楼层切换).

---

## 📂 目录结构说明

```text
src/
├── api/                # 模拟后端/AI 接口
├── assets/             # 静态资源 (图片/图标)
├── components/
│   ├── Base/           # 基础 UI (按钮, 自动抠图组件)
│   ├── GreenUI/        # 风格化组件 (复选框, 滑块)
│   └── MapSystem/      # 地图核心组件 (GameMap.vue)
├── stores/             # Pinia 状态管理
│   ├── game.js         # 游戏核心数据 (金币, 日志, 天数)
│   ├── map.js          # 地图数据 (矩阵定义, 坐标, NPC位置)
│   └── system.js       # 系统设置
├── utils/              # 工具函数 (像素处理算法)
└── views/              # 页面视图
    ├── HomeView.vue    # 游戏封面/主菜单
    └── GameView.vue    # 游戏主界面 (包含地图层)
```

---

## 🚀 后续开发路线图 (Roadmap)

### 第一阶段：数据与面板 (Next Step)
- [ ] **角色系统 (`stores/girls.js`)**: 
    - 定义女孩数据结构 (姓名, 种族, 三围, 特技, 忠诚度, 堕落度).
- [ ] **妓女状态面板**: 
    - 点击 TopBar 唇印图标 (`💋`) 弹出的详情页.
    - 展示立绘、属性雷达图、当前状态 (接客中/休息/生病).

### 第二阶段：核心玩法循环
- [ ] **时间系统**: 
    - 实现 `早晨 -> 营业 -> 结算 -> 夜晚` 的循环.
- [ ] **地图逻辑补全**: 
    - 实现真正的楼层切换 (1F <-> 2F <-> 3F).
    - 完善 NPC 交互菜单 (上楼/调教) 的具体执行逻辑.
- [ ] **经营逻辑**:
    - 安排女孩在地图特定房间接客.
    - 结算金币收益.

### 第三阶段：AI 接入
- [ ] **LLM 对接**: 
    - 将 `gameStore.addLog` 对接真实 API (如 ZhipuGLM / OpenAI).
    - 将地图交互事件 (如 "调教爱丽丝") 转化为 Prompt 发送给 AI 生成剧情.

---

## 🐛 已知问题与修复计划 (Bugs & Fixes)

1.  **输入法遮挡**: 在部分小屏手机上，点击底部输入框弹出键盘时，可能会遮挡最新消息。
    - *Fix*: 需要监听窗口高度变化，动态调整 `padding-bottom`.
2.  **地图移动**: 当前移动是瞬发的，没有过渡动画。
    - *Fix*: 添加 CSS `transition` 并引入 Input Lock 机制.
3.  **楼层切换**: 目前代码中仅弹窗提示，未实际变更 `mapStore.currentFloor`.
    - *Fix*: 完善 `stores/map.js` 中的 `changeFloor` 逻辑.

---

## 🛠️ 开发指令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包构建
npm run build
```
