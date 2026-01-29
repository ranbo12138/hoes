<script setup>
import { RouterView } from 'vue-router'
import ToastContainer from './components/Base/ToastContainer.vue'
</script>

<template>
  <RouterView />
  <ToastContainer />
</template>

<style>
/* App 级别的样式通常留空，主要样式在 styles/main.css */
</style>