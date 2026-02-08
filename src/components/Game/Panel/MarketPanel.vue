<script setup>
import { ref, computed } from 'vue'
import BasePanel from '@/components/Base/BasePanel.vue'
import BaseButton from '@/components/Base/BaseButton.vue'
import { useMarketStore } from '@/stores/market'
import { useGirlsStore } from '@/stores/girls'
import { useGameStore } from '@/stores/game'
import {
  PhFlask,
  PhWine,
  PhLockKey,
  PhHouseLine,
  PhCoins,
  PhFire,
  PhDrop,
  PhDress,
  PhBook,
  PhShield,
  PhSparkle,
  PhCookie,
  PhLightning
} from '@phosphor-icons/vue'

const emit = defineEmits(['close'])

const marketStore = useMarketStore()
const girlsStore = useGirlsStore()
const gameStore = useGameStore()

// 选中的商品
const selectedItem = ref(null)
// 选中的目标NPC (用于消耗品)
const selectedTargetId = ref('')

// 商品图标映射
const iconMap = {
  'potion_vitality': PhFlask,
  'wine_vintage': PhWine,
  'incense_dream': PhFire,
  'elixir_corruption': PhDrop,
  'collar_leather': PhLockKey,
  'silk_lingerie': PhDress,
  'book_seduction': PhBook,
  'amulet_protection': PhShield,
  'perfume_luxury': PhSparkle,
  'chocolate_dark': PhCookie,
  'whip_discipline': PhLightning,
  'contract_expansion': PhHouseLine
}

function selectItem(item) {
  selectedItem.value = item
  // 默认选中第一个 girl
  if (itemsNeedTarget.value && girlsStore.girls.length > 0) {
    selectedTargetId.value = girlsStore.girls[0].id
  } else {
    selectedTargetId.value = ''
  }
}

const itemsNeedTarget = computed(() => {
  return selectedItem.value && (selectedItem.value.type === 'consumable' || selectedItem.value.type === 'equipment')
})

function handleBuy() {
  if (!selectedItem.value) return
  
  const success = marketStore.buyItem(selectedItem.value.id, selectedTargetId.value)
  if (success) {
    // 购买成功后清空选择，或者保留方便继续买？保留吧。
  }
}

function close() {
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="close">
    <BasePanel title="地下黑市" class="market-panel">
    
      <div class="market-container">
        <!-- 左侧：商品列表 -->
        <div class="item-list">
          <div 
            v-for="item in marketStore.items" 
            :key="item.id"
            class="item-card"
            :class="{ active: selectedItem?.id === item.id }"
            @click="selectItem(item)"
          >
            <div class="item-icon-box">
              <component :is="iconMap[item.id] || PhLockKey" weight="duotone" />
            </div>
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-price">
                <PhCoins weight="fill" class="coin-icon"/> {{ item.price }}
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：详情与购买 -->
        <div class="item-detail">
          <div v-if="selectedItem" class="detail-content">
            <h4 class="detail-title">{{ selectedItem.name }}</h4>
            <p class="detail-desc">{{ selectedItem.description }}</p>
            
            <div class="detail-price">
              售价: <span class="price-val">{{ selectedItem.price }} G</span>
            </div>

            <div class="divider"></div>

            <!-- 目标选择 -->
            <div v-if="itemsNeedTarget" class="target-selector">
              <label>使用对象:</label>
              <select v-model="selectedTargetId" class="magic-select">
                <option v-for="girl in girlsStore.girls" :key="girl.id" :value="girl.id">
                  {{ girl.name }} (SAN: {{ girl.dynamic.sanity.current }})
                </option>
              </select>
            </div>

            <div class="action-area">
              <BaseButton 
                :disabled="gameStore.gold < selectedItem.price"
                @click="handleBuy"
              >
                购买
              </BaseButton>
            </div>
            
            <p v-if="gameStore.gold < selectedItem.price" class="warning-text">
              金币不足
            </p>

          </div>
          <div v-else class="empty-state">
            <p>请选择一件商品...</p>
          </div>
        </div>
      </div>

      <div class="close-btn-wrapper">
        <BaseButton variant="secondary" @click="close">离开</BaseButton>
      </div>

    </BasePanel>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.market-panel {
  width: 90%;
  max-width: 800px;
  height: 600px;
  display: flex;
  flex-direction: column;
}

.market-container {
  display: flex;
  flex: 1;
  gap: 24px;
  height: 100%;
  overflow: hidden;
  margin-bottom: 16px;
}

/* 左侧列表 */
.item-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;
}

.item-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.item-card:hover {
  background: rgba(255, 215, 0, 0.1);
  border-color: rgba(255, 215, 0, 0.3);
}

.item-card.active {
  background: linear-gradient(90deg, rgba(255, 215, 0, 0.15), transparent);
  border-color: var(--color-gold);
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.1);
}

.item-icon-box {
  font-size: 2rem;
  color: var(--text-dim);
  display: flex;
  align-items: center;
}
.item-card.active .item-icon-box { color: var(--color-gold); }

.item-info {
  flex: 1;
}

.item-name {
  font-family: var(--font-main);
  font-size: 1.1rem;
  color: var(--text-main);
}
.item-card.active .item-name { color: var(--color-gold); }

.item-price {
  font-size: 0.9rem;
  color: var(--color-gold-light);
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 右侧详情 */
.item-detail {
  flex: 1;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-dim);
  font-style: italic;
}

.detail-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-title {
  font-size: 1.8rem;
  color: var(--color-gold);
  margin-bottom: 16px;
  border-bottom: 1px solid var(--color-gold-dark);
  padding-bottom: 8px;
}

.detail-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-main);
  margin-bottom: 24px;
}

.detail-price {
  font-size: 1.2rem;
  margin-bottom: 24px;
}
.price-val {
  color: #FFD700;
  font-weight: bold;
}

.divider {
  height: 1px;
  background: rgba(255,255,255,0.1);
  margin-bottom: 24px;
}

.target-selector {
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.magic-select {
  background: rgba(0,0,0,0.5);
  border: 1px solid var(--color-gold-dark);
  color: var(--text-main);
  padding: 8px;
  border-radius: 4px;
  outline: none;
}

.action-area {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
}

.warning-text {
  color: var(--color-red-light);
  text-align: right;
  margin-top: 8px;
  font-size: 0.9rem;
}

.close-btn-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

/* 移动端适配 */
@media (max-width: 600px) {
  .market-container {
    flex-direction: column;
  }
  .item-list {
    flex: none;
    height: 40%;
  }
}
</style>
