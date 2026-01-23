<script setup>
import buttonImg from '@/assets/Green/Default/button_rectangle_flat.png'
import checkImg from '@/assets/Green/Default/check_square_color.png'
import sliderImg from '@/assets/Green/Default/slide_horizontal_color.png'
import starImg from '@/assets/Green/Default/star.png'
import arrowImg from '@/assets/Green/Default/arrow_basic_e.png'

const items = [
  { name: 'Button', src: buttonImg },
  { name: 'Check', src: checkImg },
  { name: 'Slider', src: sliderImg },
  { name: 'Star', src: starImg },
  { name: 'Arrow', src: arrowImg },
]
</script>

<template>
  <div class="green-ui-gallery">
    <h2>Green UI Component Gallery</h2>
    <div class="gallery-grid">
      <div v-for="(item, index) in items" :key="index" class="gallery-item">
        <span class="label">{{ item.name }}</span>
        <div class="image-container">
            <img :src="item.src" :alt="item.name" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.green-ui-gallery {
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 12px;
  color: #1b5e20;
  margin-top: 20px;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  min-width: 120px;
}

.image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}

.gallery-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.label {
    font-weight: bold;
    font-size: 0.9em;
}
</style>
