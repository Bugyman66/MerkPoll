<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize authentication state from localStorage
  authStore.initializeAuth()
})
</script>

<style>
#app {
  font-family: system-ui, -apple-system, sans-serif;
  color: #2c3e50;
}
</style>
