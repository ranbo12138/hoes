<script setup lang="ts">
import { ref } from 'vue'
import { useGirlsStore } from '@/stores/girls'
import type { Girl } from '@/stores/girls'
import { 
  PhX, PhPersonSimpleRun, PhCoins, PhTShirt, PhHeartbeat, 
  PhBrain, PhLink, PhSparkle, PhCrown, PhMagicWand, PhTrendUp
} from '@phosphor-icons/vue'

const emit = defineEmits(['close'])
const girlsStore = useGirlsStore()

// View Mode: 'overview' | 'details' | 'skills'
const activeTab = ref<Record<string, string>>({}) 

// 技能描述字典 (模拟数据，未来可移至 Store 或配置表)
const skillDescriptions: Record<string, Record<string, { current: string, next: string }>> = {
  service: {
    'D': { current: '动作生涩，偶尔会遭到客人投诉。', next: '勉强能完成基本流程，客人不再抱怨。' },
    'C': { current: '中规中矩，能完成基本服务流程。', next: '开始掌握取悦客人的节奏。' },
    'B': { current: '熟练工，知道如何让客人放松。', next: '服务令人印象深刻，回头客增加。' },
    'A': { current: '令人愉悦，能精准把握客人的敏感点。', next: '传说级的技巧，能让客人灵魂出窍。' },
    'S': { current: '神乎其技，仅仅是侍奉就能让客人达到高潮。', next: '已达顶峰。' }
  },
  technique: {
    'D': { current: '只会像木头一样躺着。', next: '学会了一些基本的配合动作。' },
    'C': { current: '懂得基本的体位配合。', next: '学会主动引导客人的欲望。' },
    'B': { current: '掌握多种高难度姿势。', next: '身体柔软度惊人，可以解锁特殊玩法。' },
    'A': { current: '榨汁姬，没有任何男人能坚持10分钟。', next: '魅魔转世，操控快感的大师。' },
    'S': { current: '行走的名器，传说中的存在。', next: '已达顶峰。' }
  },
  endurance: {
    'D': { current: '体力很差，接客一次就要休息半天。', next: '能连续接待两位客人。' },
    'C': { current: '普通人的体力。', next: '适应了高强度的工作节奏。' },
    'B': { current: '精力充沛，甚至可以熬夜加班。', next: '不知疲倦的永动机。' },
    'A': { current: '钢筋铁骨，无论怎么折腾第二天都能恢复。', next: '拥有龙一般的体质。' },
    'S': { current: '似乎拥有无限的体力槽。', next: '已达顶峰。' }
  }
}

// 获取技能描述的辅助函数
function getSkillDesc(type: 'service' | 'technique' | 'endurance', level: string) {
  return skillDescriptions[type][level] || { current: '未知等级', next: '未知' }
}

function handleClose() {
  emit('close')
}

function toggleTab(id: string, tab: string) {
  activeTab.value[id] = tab
}

function getActiveTab(id: string) {
  return activeTab.value[id] || 'overview'
}

// Helpers
function getEnergyColor(current: number, max: number) {
  const ratio = current / max
  if (ratio > 0.7) return '#4ADE80' 
  if (ratio > 0.3) return '#FACC15' 
  return '#EF4444' 
}

function getSanityColor(current: number, max: number) {
  const ratio = current / max
  if (ratio > 0.7) return '#A78BFA' // Purple
  if (ratio > 0.3) return '#818CF8' // Indigo
  return '#4C1D95' // Dark Purple
}

function getRarityColor(rarity: string) {
  switch (rarity) {
    case 'SSR': return '#FFD700'; // Gold
    case 'SR': return '#C0C0C0';  // Silver
    case 'R': return '#CD7F32';   // Bronze
    default: return '#9CA3AF';    // Gray
  }
}
</script>

<template>
  <div class="panel-overlay">
    <div class="panel-container">
      <div class="panel-header">
        <h2 class="panel-title">员工名册 ({{ girlsStore.girls.length }})</h2>
        <button class="close-btn" @click="handleClose">
          <PhX weight="bold" />
        </button>
      </div>

      <div class="panel-content">
        <div 
          v-for="girl in girlsStore.girls" 
          :key="girl.id" 
          class="girl-card"
          :style="{ borderColor: getRarityColor(girl.static.rarity) + '40' }"
        >
          <!-- Left: Avatar & Tabs -->
          <div class="card-left">
            <div 
              class="avatar-frame"
              :style="{ borderColor: getRarityColor(girl.static.rarity) }"
            >
              <span class="rarity-badge" :style="{ background: getRarityColor(girl.static.rarity) }">
                {{ girl.static.rarity }}
              </span>
              <div class="avatar-placeholder">
                {{ girl.name[0] }}
              </div>
            </div>
            
            <div class="tabs-vertical">
              <button 
                class="tab-btn" 
                :class="{ active: getActiveTab(girl.id) === 'overview' }"
                @click="toggleTab(girl.id, 'overview')"
              >
                状态
              </button>
              <button 
                class="tab-btn"
                :class="{ active: getActiveTab(girl.id) === 'skills' }"
                @click="toggleTab(girl.id, 'skills')"
              >
                技能
              </button>
              <button 
                class="tab-btn"
                :class="{ active: getActiveTab(girl.id) === 'details' }"
                @click="toggleTab(girl.id, 'details')"
              >
                档案
              </button>
            </div>
          </div>

          <!-- Right: Content Area -->
          <div class="card-right">
            <!-- Header Info -->
            <div class="info-header">
              <div class="name-box">
                <span class="name">{{ girl.name }}</span>
                <span class="race-tag">{{ girl.static.race }}</span>
              </div>
              <div class="income-badge">
                <PhCoins weight="fill" class="coin-icon" />
                <span>+{{ girl.dynamic.dailyIncome }}</span>
              </div>
            </div>

            <!-- TAB 1: OVERVIEW (状态概览) -->
            <div v-if="getActiveTab(girl.id) === 'overview'" class="tab-content fade-in">
              <!-- Location -->
              <div class="status-badge">
                <PhPersonSimpleRun weight="fill" />
                {{ girl.dynamic.location }} - {{ girl.dynamic.currentActivity }}
              </div>

              <!-- Bars Grid (Added Text Labels) -->
              <div class="bars-grid">
                <!-- HP/Energy -->
                <div class="bar-row">
                  <div class="label-box">
                    <PhHeartbeat weight="fill" class="bar-icon red" />
                    <span>精力</span>
                  </div>
                  <div class="progress-bg">
                    <div class="progress-fill" 
                      :style="{ width: (girl.dynamic.energy.current / girl.dynamic.energy.max * 100) + '%', background: getEnergyColor(girl.dynamic.energy.current, girl.dynamic.energy.max) }"
                    ></div>
        </div>
                  <span class="val">{{ girl.dynamic.energy.current }}</span>
                </div>

                <!-- Sanity -->
                <div class="bar-row">
                  <div class="label-box">
                    <PhBrain weight="fill" class="bar-icon purple" />
                    <span>理智</span>
                  </div>
                  <div class="progress-bg">
                    <div class="progress-fill" 
                      :style="{ width: (girl.dynamic.sanity.current / girl.dynamic.sanity.max * 100) + '%', background: getSanityColor(girl.dynamic.sanity.current, girl.dynamic.sanity.max) }"
                    ></div>
                  </div>
                  <span class="val">{{ girl.dynamic.sanity.current }}</span>
                </div>

                <!-- Depravity -->
                <div class="bar-row">
                  <div class="label-box">
                    <PhLink weight="bold" class="bar-icon pink" />
                    <span>堕落</span>
                  </div>
                  <div class="progress-bg">
                    <div class="progress-fill" 
                      :style="{ width: girl.dynamic.depravity + '%', background: '#EC4899' }"
                    ></div>
                  </div>
                  <span class="val">{{ girl.dynamic.depravity }}</span>
                </div>
              </div>

              <!-- Mini Skills Summary (Text + Value) -->
              <div class="mini-skills">
                <div class="mini-skill-item">
                  <span class="ms-label">侍奉</span>
                  <span class="ms-val">{{ girl.dynamic.skills.service }}</span>
                </div>
                <div class="mini-skill-item">
                  <span class="ms-label">技巧</span>
                  <span class="ms-val">{{ girl.dynamic.skills.technique }}</span>
                </div>
                <div class="mini-skill-item">
                  <span class="ms-label">耐力</span>
                  <span class="ms-val">{{ girl.dynamic.skills.endurance }}</span>
                </div>
                <div class="mini-skill-item">
                  <span class="ms-label">服从</span>
                  <span class="ms-val">{{ girl.dynamic.obedience }}</span>
                </div>
              </div>
            </div>

            <!-- TAB 2: SKILLS (技能详情) -->
            <div v-else-if="getActiveTab(girl.id) === 'skills'" class="tab-content fade-in">
              <div class="skills-list">
                <!-- Skill Item: Service -->
                <div class="skill-detail-item">
                  <div class="sd-header">
                    <div class="sd-title">
                      <PhMagicWand weight="fill" class="sd-icon gold" />
                      <span>侍奉等级</span>
                    </div>
                    <span class="rank-big">{{ girl.dynamic.skills.service }}</span>
                  </div>
                  <div class="sd-desc">
                    <p class="current-eff">
                      <span class="bullet">▶</span> 
                      {{ getSkillDesc('service', girl.dynamic.skills.service).current }}
                    </p>
                    <p class="next-eff" v-if="girl.dynamic.skills.service !== 'S'">
                      <span class="bullet">Next:</span> 
                      {{ getSkillDesc('service', girl.dynamic.skills.service).next }}
                    </p>
                  </div>
                </div>

                <!-- Skill Item: Technique -->
                <div class="skill-detail-item">
                  <div class="sd-header">
                    <div class="sd-title">
                      <PhTrendUp weight="bold" class="sd-icon pink" />
                      <span>技巧等级</span>
                    </div>
                    <span class="rank-big">{{ girl.dynamic.skills.technique }}</span>
                  </div>
                  <div class="sd-desc">
                    <p class="current-eff">
                       <span class="bullet">▶</span> 
                       {{ getSkillDesc('technique', girl.dynamic.skills.technique).current }}
                    </p>
                    <p class="next-eff" v-if="girl.dynamic.skills.technique !== 'S'">
                      <span class="bullet">Next:</span> 
                      {{ getSkillDesc('technique', girl.dynamic.skills.technique).next }}
                    </p>
                  </div>
                </div>

                 <!-- Skill Item: Endurance -->
                 <div class="skill-detail-item">
                  <div class="sd-header">
                    <div class="sd-title">
                      <PhHeartbeat weight="fill" class="sd-icon red" />
                      <span>耐力等级</span>
                    </div>
                    <span class="rank-big">{{ girl.dynamic.skills.endurance }}</span>
                  </div>
                  <div class="sd-desc">
                    <p class="current-eff">
                       <span class="bullet">▶</span> 
                       {{ getSkillDesc('endurance', girl.dynamic.skills.endurance).current }}
                    </p>
                    <p class="next-eff" v-if="girl.dynamic.skills.endurance !== 'S'">
                      <span class="bullet">Next:</span> 
                      {{ getSkillDesc('endurance', girl.dynamic.skills.endurance).next }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 3: DETAILS (档案) -->
            <div v-else class="tab-content fade-in">
               <div class="tags-row">
                 <span v-for="t in girl.static.traits" :key="t" class="trait-tag">
                   <PhSparkle weight="fill" size="12" /> {{ t }}
                 </span>
                 <span class="trait-tag measure">{{ girl.static.measurements }}</span>
               </div>
               
               <p class="desc-text">{{ girl.static.description }}</p>
               
               <div class="attire-box">
                 <PhTShirt class="icon" /> 
                 <span>{{ girl.dynamic.attire }}</span>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.panel-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  padding: 12px;
}

.panel-container {
  width: 100%;
  max-width: 500px;
  height: 85vh;
  background: linear-gradient(135deg, #1a0b2e 0%, #11051e 100%);
  border: 1px solid var(--color-gold);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
}

.panel-title {
  color: var(--color-gold);
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.close-btn {
  background: none; border: none;
  color: var(--text-dim); font-size: 1.4rem;
  cursor: pointer;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Card */
.girl-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid; /* Color via inline style */
  border-radius: 8px;
  padding: 8px;
  display: flex;
  gap: 10px;
  position: relative;
  overflow: hidden;
  min-height: 140px;
}

/* Left */
.card-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 70px;
  flex-shrink: 0;
}

.avatar-frame {
  width: 60px; height: 60px;
  border: 2px solid; /* Color via inline style */
  border-radius: 50%;
  position: relative;
  display: flex; 
  align-items: center; justify-content: center;
  background: #000;
  flex-shrink: 0;
}

.avatar-placeholder {
  font-size: 1.5rem; color: #fff;
  font-weight: bold;
}

.rarity-badge {
  position: absolute;
  top: -2px; right: -6px;
  font-size: 0.6rem;
  font-weight: bold;
  color: #000;
  padding: 1px 4px;
  border-radius: 4px;
  box-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}

.tabs-vertical {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.tab-btn {
  background: rgba(255,255,255,0.05);
  border: none;
  color: var(--text-dim);
  font-size: 0.7rem;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-gold);
  color: #000;
  font-weight: bold;
}

/* Right */
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden; /* Prevent text spill */
}

.info-header {
  display: flex; justify-content: space-between; align-items: center;
}

.name-box { display: flex; align-items: baseline; gap: 6px; }
.name { font-size: 1.05rem; font-weight: bold; color: #eee; }
.race-tag { font-size: 0.75rem; color: var(--text-dim); }

.income-badge {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.85rem; color: #FFD700;
  background: rgba(255, 215, 0, 0.1);
  padding: 2px 6px; border-radius: 4px;
}

/* --- TAB: OVERVIEW --- */
.status-badge {
  font-size: 0.8rem; color: #ddd;
  background: rgba(255,255,255,0.08);
  padding: 4px 8px; border-radius: 4px;
  display: flex; align-items: center; gap: 6px;
}

.bars-grid {
  display: flex; flex-direction: column; gap: 6px;
  margin-top: 2px;
  background: rgba(0,0,0,0.2);
  padding: 6px; border-radius: 6px;
}

.bar-row {
  display: flex; align-items: center; gap: 8px;
}

.label-box {
  display: flex; align-items: center; gap: 4px;
  width: 50px; flex-shrink: 0;
  font-size: 0.75rem; color: var(--text-dim);
}

.bar-icon { font-size: 0.85rem; }
.bar-icon.red { color: #EF4444; }
.bar-icon.purple { color: #A78BFA; }
.bar-icon.pink { color: #EC4899; }

.progress-bg {
  flex: 1; height: 6px;
  background: rgba(0,0,0,0.5);
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill { height: 100%; transition: width 0.3s; }
.val { font-size: 0.7rem; width: 24px; text-align: right; color: #aaa; }

.mini-skills {
  display: flex; justify-content: space-between;
  margin-top: 4px;
  background: rgba(0,0,0,0.2);
  padding: 4px 8px; border-radius: 4px;
}
.mini-skill-item {
  display: flex; flex-direction: column; align-items: center; gap: 0px;
}
.ms-label { font-size: 0.65rem; color: var(--text-dim); }
.ms-val { font-size: 0.85rem; color: var(--color-gold); font-weight: bold; }

/* --- TAB: SKILLS --- */
.skills-list {
  display: flex; flex-direction: column; gap: 8px;
}

.skill-detail-item {
  background: rgba(0,0,0,0.2);
  padding: 6px 8px; border-radius: 6px;
  border-left: 2px solid var(--color-gold-dark);
}

.sd-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 4px;
}
.sd-title {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.85rem; color: #eee; font-weight: bold;
}
.sd-icon { font-size: 1rem; }
.sd-icon.gold { color: #FFD700; }
.sd-icon.pink { color: #FF69B4; }
.sd-icon.red { color: #EF4444; }

.rank-big {
  font-family: 'Times New Roman', serif;
  font-size: 1rem; font-weight: bold;
  color: var(--color-gold);
}

.sd-desc {
  font-size: 0.75rem; color: #bbb;
  display: flex; flex-direction: column; gap: 2px;
}
.current-eff { color: #ddd; margin: 0; }
.next-eff { color: var(--text-dim); font-style: italic; margin: 0; }
.bullet { color: var(--color-gold-dark); font-size: 0.6rem; margin-right: 4px; }


/* --- TAB: DETAILS --- */
.tags-row {
  display: flex; flex-wrap: wrap; gap: 4px;
}
.trait-tag {
  font-size: 0.7rem; color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 2px 6px; border-radius: 10px;
  display: flex; align-items: center; gap: 2px;
}
.trait-tag.measure { border-color: #EC4899; color: #F9A8D4; }

.desc-text {
  font-size: 0.8rem; color: #bbb;
  margin: 0; line-height: 1.4;
  font-style: italic;
  background: rgba(0,0,0,0.2);
  padding: 6px; border-radius: 4px;
}

.attire-box {
  font-size: 0.75rem; color: #9CA3AF;
  display: flex; align-items: center; gap: 4px;
}

.fade-in {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
