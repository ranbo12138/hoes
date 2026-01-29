# 视觉设计分析报告

## 项目类型
- **技术栈**: Vue 3 + Vite + CSS
- **应用类型**: 网吧经营模拟游戏（暗黑/成人向）
- **平台**: 移动端优先（响应式设计）

---

## 当前设计风格

### 配色方案
- **主色调**: 深紫色系
  - `--color-purple-deep`: #1A0B2E
  - `--color-purple-dark`: #2E1A47
  - `--color-purple-light`: #4A148C

- **强调色**: 金色系
  - `--color-gold-light`: #FFD700
  - `--color-gold`: #D4AF37
  - `--color-gold-dark`: #AA8C2C

- **辅助色**: 红色系 + 粉色
  - `--color-red`: #C0392B
  - `--color-red-light`: #E74C3C
  - 粉色: #FF69B4

- **背景**: 深色半透明
  - `--bg-main`: #1A0B2E
  - `--bg-panel`: rgba(20, 10, 30, 0.85)

### 设计语言
- 魔法奇幻风格 + 暗黑哥特
- 玻璃态/毛玻璃效果 (`backdrop-filter: blur`)
- 金色边框装饰和文字渐变
- 角落装饰线条

### 字体
- **主字体**: 'Cinzel', 'Times New Roman', serif（装饰性/游戏感）
- **UI 字体**: 'Segoe UI', Tahoma, sans-serif（易读性）

---

## 主要 UI 组件

### 1. TopBar（顶部导航栏）
- 半透明深紫色背景
- 金色边框底部
- 资源栏（金币、天数）
- 功能图标按钮组

### 2. BasePanel（面板容器）
- 半透明深色背景 + 内阴影
- 细微金边 + 四角装饰
- 标题带渐变金色文字 + 两侧装饰线
- 进场动画 (`modal-pop`)

### 3. BaseButton（基础按钮）
- 金色边框 + 切角设计
- 流光悬停效果
- 悬停时上浮 + 发光
- 扫光动画

### 4. GirlsPanel（员工面板）
- 卡片式布局
- 头像框 + 稀有度徽章
- Tab 切换（状态/技能/档案）
- 进度条（精力、理智、堕落）
- 技能等级系统 (D-C-B-A-S)

### 5. GameMap（地图系统）
- 网格地图
- 仪表盘、控制器、交互菜单
- 键盘方向键控制

---

## 关键设计元素

### 特效
- 背景毛玻璃效果 (`backdrop-filter: blur 12px`)
- 阴影分层（内阴影 + 外阴影）
- 发光效果 (`drop-shadow` + `box-shadow`)
- 悬停动画 (`translateY` + `scale`)
- 进场动画（弹跳/渐入）

### 装饰
- 金色边框
- 角落装饰线条 (`::before`/`::after`)
- 渐变装饰线
- 稀有度颜色编码 (SSR/SR/R)

### 图标库
- Phosphor Icons (`@phosphor-icons/vue`)

---

## 设计文件结构

```
src/
├── styles/
│   ├── variables.css  (CSS 变量定义)
│   └── main.css       (全局重置)
├── assets/
│   └── main.css       (Vite 默认样式)
├── components/
│   ├── Base/          (基础组件)
│   │   ├── TopBar.vue
│   │   ├── BasePanel.vue
│   │   └── BaseButton.vue
│   ├── Game/          (游戏组件)
│   │   ├── Panel/
│   │   │   └── GirlsPanel.vue
│   │   ├── GameLogList.vue
│   │   └── GameInputBar.vue
│   └── MapSystem/     (地图系统)
│       ├── GameMap.vue
│       ├── MapRenderer.vue
│       ├── MapControls.vue
│       └── MapDashboard.vue
└── views/
    └── GameView.vue   (主游戏视图)
```

---

## CSS 变量系统

### 调色板
```css
:root {
  /* 金色系 */
  --color-gold-light: #FFD700;
  --color-gold: #D4AF37;
  --color-gold-dark: #AA8C2C;

  /* 红色系 */
  --color-red: #C0392B;
  --color-red-light: #E74C3C;

  /* 紫色系 */
  --color-purple-deep: #1A0B2E;
  --color-purple-dark: #2E1A47;
  --color-purple-light: #4A148C;

  /* 文本颜色 */
  --text-main: #FDFEFE;
  --text-gold: #F1C40F;
  --text-dim: #B0BEC5;
}
```

### 语义化变量
```css
:root {
  --color-primary: var(--color-gold);
  --color-secondary: var(--color-purple-light);
  --color-accent: var(--color-red);

  --bg-main: var(--color-purple-deep);
  --bg-panel: rgba(20, 10, 30, 0.85);
}
```

### 尺寸与边框
```css
:root {
  --header-height: 48px;
  --border-width: 1px;
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-gold: var(--border-width) solid var(--color-gold);
}
```

### 阴影
```css
:root {
  --shadow-text: 0 1px 2px rgba(0, 0, 0, 0.8);
  --shadow-panel: 0 4px 16px rgba(0, 0, 0, 0.6);
  --shadow-glow: 0 0 8px rgba(212, 175, 55, 0.3);
}
```

---

## 建议的优化方向（供参考）

### 视觉增强
- 更精致的微交互动画
- 优化暗色模式下的可读性
- 增强玻璃态效果的层次感
- 改进移动端触摸反馈

### 用户体验
- 更清晰的信息层级
- 更流畅的页面转场
- 优化加载状态展示
- 增加操作反馈提示

### 现代化升级
- 考虑使用 CSS 变量实现主题切换
- 引入更现代的排版系统
- 优化图标使用一致性
- 统一动画曲线和时间

---

## 生成日期
2026-01-29