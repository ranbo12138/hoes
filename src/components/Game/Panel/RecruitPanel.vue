<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { useGirlsStore } from '@/stores/girls'
import { generateRandomGirl } from '@/utils/girlFactory'
import BasePanel from '@/components/Base/BasePanel.vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import { PhUser, PhStar, PhX } from '@phosphor-icons/vue'

const emit = defineEmits(['close'])
const gameStore = useGameStore()
const girlsStore = useGirlsStore()

const currentGirl = ref(null)
const errorMsg = ref('')

const COSTS = {
  NORMAL: 100,
  PREMIUM: 500
}

function handleRecruit(type) {
  errorMsg.value = ''
  const cost = type === 'PREMIUM' ? COSTS.PREMIUM : COSTS.NORMAL
  
  if (gameStore.gold < cost) {
    errorMsg.value = '金币不足！'
    return
  }
  
  gameStore.gold -= cost
  
  let rarityOverride = undefined
  if (type === 'PREMIUM') {
     const roll = Math.random()
     if (roll < 0.1) rarityOverride = 'SSR'
     else if (roll < 0.4) rarityOverride = 'SR'
     else rarityOverride = 'R'
  }
  
  currentGirl.value = generateRandomGirl(rarityOverride)
}

function confirmRecruit() {
  if(currentGirl.value) {
    girlsStore.addGirl(currentGirl.value)
    currentGirl.value = null
    emit('close')
  }
}

function discard() {
  currentGirl.value = null
}

function formatTraits(traits) {
  return traits.join('  •  ')
}

function getRarityColor(rarity) {
  switch(rarity) {
    case 'SSR': return '#FFD700'; // Gold
    case 'SR': return '#E74C3C';  // Red
    case 'R': return '#3498DB';   // Blue
    default: return '#95A5A6';    // Gray
  }
}
</script>

<template>
  <div class="recruit-overlay">
    <BasePanel title="人才市场" class="recruit-panel">
      <!-- Close Button -->
      <button class="close-btn" @click="$emit('close')">
        <PhX weight="bold" />
      </button>

      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>

      <!-- Result Card Area -->
      <div v-if="currentGirl" class="result-container">
        <!-- The Card -->
        <div class="character-card" :style="{ borderColor: getRarityColor(currentGirl.static.rarity) }">
          <div class="card-glow" :style="{ background: getRarityColor(currentGirl.static.rarity) }"></div>
          
          <div class="card-inner">
            <div class="rarity-badge" :style="{ color: getRarityColor(currentGirl.static.rarity) }">
              {{ currentGirl.static.rarity }}
            </div>
            
            <h2 class="char-name">{{ currentGirl.name }}</h2>
            <div class="char-race">{{ currentGirl.static.race }}</div>
            
            <div class="divider-mini"></div>
            
            <div class="char-info">
              <div class="info-row">
                <span class="label">三围</span>
                <span class="val">{{ currentGirl.static.measurements }}</span>
              </div>
              <div class="info-row">
                <span class="label">特征</span>
                <span class="val">{{ currentGirl.static.features.join(' / ') }}</span>
              </div>
              <div class="traits-box">
                {{ formatTraits(currentGirl.static.traits) }}
              </div>
            </div>

            <div class="char-desc">
              "{{ currentGirl.static.description }}"
            </div>
          </div>
        </div>

        <div class="card-actions">
           <BaseButton @click="confirmRecruit">签订契约</BaseButton>
           <BaseButton variant="secondary" @click="discard">放弃</BaseButton>
        </div>
      </div>

      <!-- Selection Menu -->
      <div v-else class="recruit-options">
        <div class="option-card" @click="handleRecruit('NORMAL')">
          <div class="icon-wrapper">
            <PhUser size="32" weight="duotone" />
          </div>
          <div class="opt-content">
            <div class="opt-header">
              <span class="opt-title">普通招募</span>
              <span class="opt-cost">{{ COSTS.NORMAL }} G</span>
            </div>
            <div class="opt-desc">寻找普通的流浪者，也许有意外之喜。</div>
          </div>
        </div>

        <div class="option-card premium" @click="handleRecruit('PREMIUM')">
          <div class="icon-wrapper gold">
            <PhStar size="32" weight="fill" />
          </div>
          <div class="opt-content">
            <div class="opt-header">
              <span class="opt-title gold">精选招募</span>
              <span class="opt-cost gold">{{ COSTS.PREMIUM }} G</span>
            </div>
            <div class="opt-desc">定向寻找高潜力的特殊人才 (R级以上)。</div>
          </div>
        </div>
      </div>
    </BasePanel>
  </div>
</template>

<style scoped>
.recruit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 5, 20, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  padding: 20px;
}

.recruit-panel {
  width: 100%;
  max-width: 480px;
  min-height: 450px;
}

.close-btn {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(0,0,0,0.5); /* 半透明背景，防止看不清 */
  border-radius: 50%;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--color-gold-dark);
  color: var(--color-gold);
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 50; /* 提高层级 */
  transition: all 0.2s;
}
.close-btn:hover { 
  transform: rotate(90deg); 
  background: rgba(0,0,0,0.8);
  border-color: var(--color-gold);
}

.error-msg {
  color: var(--color-red-light);
  text-align: center;
  margin-bottom: 12px;
  font-weight: bold;
  animation: shake 0.3s;
}

/* --- Option Cards --- */
.recruit-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
}

.option-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s var(--ease-magic);
  position: relative;
  overflow: hidden;
}

.option-card:hover {
  background: rgba(255,255,255,0.08);
  border-color: var(--color-gold);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.option-card.premium:hover {
  border-color: var(--color-gold-light);
  box-shadow: var(--shadow-glow);
}

.icon-wrapper {
  width: 48px; height: 48px;
  background: rgba(0,0,0,0.3);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-right: 16px;
  color: #ccc;
  flex-shrink: 0;
}
.icon-wrapper.gold {
  color: var(--color-gold);
  background: rgba(212, 175, 55, 0.1);
}

.opt-content { flex: 1; }
.opt-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 4px; 
  gap: 8px; /* 增加间距防止粘连 */
}
.opt-title { font-weight: bold; font-size: 1.1rem; color: #eee; white-space: nowrap; }
.opt-cost { font-family: var(--font-main); font-weight: bold; white-space: nowrap; margin-left: auto; }
.opt-desc { font-size: 0.85rem; color: #888; }

/* --- Result Card (Tarot Style) --- */
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: modal-pop 0.5s var(--ease-out-back);
}

.character-card {
  width: 100%;
  background: linear-gradient(180deg, #20102B 0%, #0F0518 100%);
  border: 2px solid #555; /* dynamic color via inline style */
  border-radius: 12px;
  padding: 2px; /* for inner border */
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  margin-bottom: 24px;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 5px;
  opacity: 0.8;
  box-shadow: 0 0 20px currentColor;
}

.card-inner {
  background: rgba(30, 15, 40, 0.95);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.rarity-badge {
  font-family: var(--font-main);
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 8px;
  text-shadow: 0 0 10px currentColor;
}

.char-name {
  margin: 0;
  font-size: 1.8rem;
  color: #fff;
  font-family: var(--font-main);
}
.char-race { color: #aaa; font-size: 0.9rem; letter-spacing: 1px; margin-bottom: 16px; }

.divider-mini {
  width: 40px; height: 2px; background: rgba(255,255,255,0.1); margin: 0 auto 16px auto;
}

.char-info { width: 100%; font-size: 0.9rem; }
.info-row { display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 4px; }
.label { color: var(--color-gold); }
.val { color: #eee; font-weight: bold; }

.traits-box {
  margin-top: 12px;
  color: var(--color-secondary);
  color: #D7BDE2;
  font-size: 0.85rem;
  background: rgba(0,0,0,0.2);
  padding: 8px;
  border-radius: 4px;
}

.char-desc {
  margin-top: 20px;
  font-style: italic;
  color: #999;
  font-size: 0.9rem;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  gap: 16px;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
