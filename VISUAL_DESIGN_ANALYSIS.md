# 视觉设计分析报告

## 项目类型
- **技术栈**: Vue 3 + Vite + CSS (Phosphor Icons)
- **应用类型**: 异世界娼馆经营模拟 (Management Sim / Dark Fantasy)
- **平台**: 移动端优先（响应式设计）

---

## 当前设计风格：Arcane Artifact (奥术造物)

### 配色方案
- **主色调**: 深渊紫 (`#1A0B2E`) - 营造神秘、压抑但诱惑的基调。
- **强调色**: 炼金金 (`#D4AF37`) - 代表财富、魔法与高贵。
- **功能色**:
  - 绯红 (`#C0392B`): 警告、战斗、堕落。
  - 魅粉 (`#FF69B4`): 诱惑、NPC 互动。
  - 幽蓝 (`#4A90E2`): 魔法、理智、科技。

### 视觉语言
1.  **Glassmorphism (黑曜石毛玻璃)**: 
    - 使用高模糊度 (`blur(12px)`) + 低透明度黑背景，模拟黑曜石质感。
    - 区别于传统的 iOS 亮色毛玻璃，这里更强调“深邃”。
2.  **Chamfered Corners (八边形切角)**: 
    - 所有的 Panel、Button 均采用 `clip-path` 或 CSS border trick 实现切角。
    - 呼应魔法符文、宝石切面的形状。
3.  **Glow & Shimmer (微光与流光)**:
    - 关键交互元素（按钮 hover、选中态）带有 `box-shadow` 外发光。
    - 文本使用 `text-shadow` 制造荧光墨水的效果。

---

## 主要 UI 组件库

### 1. GameHUD (悬浮抬头显示)
- **布局**: 
  - 左上: **Time Rune** (时间符文轮盘)，显示 Day。
  - 右上: **Resource Gems** (资源胶囊)，显示 Gold。
  - 底部/中部: **Action Dock** (操作坞)，悬浮的一排功能图标。
- **交互**: 点击穿透 (Click-through) 设计，HUD 本身不遮挡游戏背景点击。

### 2. BasePanel (奥术面板)
- **结构**: 
  - 黑色半透明遮罩 (`overlay`)。
  - 居中的八边形容器。
  - 顶部由金色线条构成的 Title Bar。
- **用途**: 承载所有子系统（招募、日程、黑市、成员）。

### 3. MarketPanel (黑市面板) *[New]*
- **布局**: 
  - 左侧: 垂直滚动的商品列表卡片 (`ItemCard`)。
  - 右侧: 详情展示区 + 购买交互区。
- **特色**: 
  - 商品图标使用 `duotone` 风格。
  - 选中态带有强烈的金色光晕。

### 4. SettingsModal (配置终端)
- **UX 升级**:
  - 模型选择器现在支持 **Dropdown List** 模式。
  - 加载时图标会有 `spin` 动画。
  - 输入框支持 "Edit" 和 "Select" 两种模式切换。

---

## 关键 CSS 变量 (Variables)

```css
:root {
  /* 核心色板 */
  --color-gold: #D4AF37;
  --color-gold-light: #FFD700;
  --color-gold-dark: #AA8C2C;
  --color-purple-deep: #1A0B2E;
  
  /* 文本 */
  --text-main: #FDFEFE;
  --text-dim: #B0BEC5;
  
  /* 材质 */
  --bg-panel: rgba(13, 5, 24, 0.85); /* 深渊黑紫 */
  --backdrop-blur: 8px;
  
  /* 字体 */
  --font-main: 'Cinzel', serif; /* 标题 */
  --font-ui: 'Segoe UI', sans-serif; /* 正文 */
}
```

## 下一步视觉优化计划
1.  **动态反馈**: 增加金币扣除/获得的数字飘字动画。
2.  **转场特效**: 面板打开/关闭目前只有简单的 Fade，可以增加类似“魔法阵展开”的缩放+旋转效果。
3.  **Avatar**: 目前使用占位符，需要引入 AI 生成的二次元厚涂风格头像。
