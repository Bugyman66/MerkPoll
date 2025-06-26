<template>
  <div id="app" class="main-container">
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
/* Global App Styles - Glassmorphic Black & White */
#app {
  min-height: 100vh;
  width: 100%;
  font-family: var(--font-family);
  background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-black) 100%);
  background-attachment: fixed;
  color: var(--color-white);
  line-height: 1.6;
  position: relative;
  overflow-x: hidden;
}

/* Add subtle animated background */
#app::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

#app > * {
  position: relative;
  z-index: 1;
}

/* Enhanced Container Classes */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.container-sm {
  max-width: 640px;
}

.container-md {
  max-width: 768px;
}

.container-lg {
  max-width: 1024px;
}

.container-xl {
  max-width: 1400px;
}

.container-2xl {
  max-width: 1536px;
}

/* Responsive container padding */
@media (min-width: 640px) {
  .container {
    padding: 0 1.5rem;
  }
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2.5rem;
  }
}

@media (min-width: 1280px) {
  .container {
    padding: 0 3rem;
  }
}

/* Page Layout Classes */
.page-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.page-header {
  background: var(--glass-light);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-bottom: 1px solid var(--glass-medium);
  position: sticky;
  top: 0;
  z-index: 50;
}

.page-content {
  flex: 1;
  padding: 2rem 0;
}

.page-footer {
  background: var(--glass-dark);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-top: 1px solid var(--glass-medium);
  padding: 1.5rem 0;
  margin-top: auto;
}

/* Navigation Styles */
.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--color-white);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-normal);
  font-weight: 500;
  position: relative;
}

.nav-link:hover {
  background: var(--glass-medium);
  color: var(--color-white);
  transform: translateY(-1px);
}

.nav-link.active {
  background: var(--glass-heavy);
  color: var(--color-white);
  font-weight: 600;
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-white);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.section-subtitle {
  font-size: clamp(1.125rem, 2.5vw, 1.5rem);
  color: var(--color-gray-200);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Special Component Classes */
.hero-section {
  background: var(--glass-light);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-radius: var(--radius-2xl);
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid var(--glass-medium);
  box-shadow: var(--shadow-glass-xl);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: var(--glass-light);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  background: var(--glass-medium);
  transform: translateY(-4px);
  box-shadow: var(--shadow-glass-lg);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .page-content {
    padding: 1.5rem 0;
  }
  
  .hero-section {
    padding: 3rem 1.5rem;
    border-radius: var(--radius-lg);
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 2rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}

/* Enhanced focus states for accessibility */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Enhanced button hover effects */
.btn-hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glass-lg);
}

/* Loading states */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: var(--glass-heavy);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid var(--color-white);
  border-radius: var(--radius-lg);
  padding: 2rem;
  text-align: center;
  box-shadow: var(--shadow-glass-xl);
}
</style>
