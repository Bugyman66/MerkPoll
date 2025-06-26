<template>
  <div class="home page-layout">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-particles"></div>
      <div class="energy-grid"></div>
      <div class="holographic-rings"></div>
    </div>

    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-content">
          <div class="nav-brand">
            <router-link to="/" class="brand-link">
              <span class="brand-glow">MerkPoll</span>
            </router-link>
            <span class="brand-subtitle">Privacy-First Voting</span>
          </div>
          <div class="nav-menu">
            <router-link to="/elections" class="nav-link">
              <div class="nav-link-glow"></div>
              <span class="nav-link-text">Elections</span>
            </router-link>
            
            <!-- Error Display -->
            <div v-if="authStore.error && !authStore.isLoggedIn" class="error-banner animate-fade-in">
              {{ authStore.error }}
              <button @click="authStore.error = null" class="error-close">×</button>
            </div>
            
            <button 
              v-if="!isAuthenticated" 
              @click="connectWallet"
              class="btn btn-primary btn-hover-lift btn-futuristic"
              :disabled="authStore.loading"
            >
              <div class="btn-glow-border"></div>
              <span v-if="authStore.loading" class="loading-spinner loading-spinner-sm"></span>
              <span class="btn-text">{{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}</span>
            </button>
            <div v-else class="nav-auth">
              <span class="wallet-address">{{ authStore.truncatedAddress }}</span>
              <router-link to="/admin" class="btn btn-outline btn-sm btn-futuristic">
                <div class="btn-glow-border"></div>
                <span class="btn-text">Admin Panel</span>
              </router-link>
              <button @click="disconnectWallet" class="btn btn-ghost btn-sm btn-futuristic">
                <div class="btn-glow-border"></div>
                <span class="btn-text">Disconnect</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content animate-fade-in">
          <div class="hero-title-container">
            <h1 class="hero-title">
              Secure, Private, 
              <span class="hero-accent hero-glow">Decentralized Voting</span>
            </h1>
            <div class="title-underline"></div>
          </div>
          <p class="hero-description">
            MerkPoll leverages Merkle Trees and blockchain technology to ensure 
            your vote remains private while maintaining complete transparency and verifiability.
          </p>
          <div class="hero-actions">
            <router-link to="/elections" class="btn btn-primary btn-lg btn-hover-lift btn-futuristic">
              <div class="btn-glow-border"></div>
              <span class="btn-text">View Elections</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </router-link>
            <button @click="scrollToFeatures" class="btn btn-outline btn-lg btn-futuristic">
              <div class="btn-glow-border"></div>
              <span class="btn-text">Learn More</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
      <div class="features-container">
        <div class="features-header animate-fade-in">
          <h2 class="features-title">
            Why Choose <span class="title-glow">MerkPoll</span>?
          </h2>
          <p class="features-description">
            Built on cutting-edge technology to ensure election integrity
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card animate-slide-up" style="animation-delay: 0.1s">
            <div class="feature-glow-border"></div>
            <div class="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="feature-title">Privacy Protected</h3>
            <p class="feature-description">
              Merkle Trees ensure your vote remains anonymous while maintaining verifiability
            </p>
          </div>
          
          <div class="feature-card animate-slide-up" style="animation-delay: 0.2s">
            <div class="feature-glow-border"></div>
            <div class="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="feature-title">Blockchain Secured</h3>
            <p class="feature-description">
              Built on Aptos blockchain for immutable and transparent election records
            </p>
          </div>
          
          <div class="feature-card animate-slide-up" style="animation-delay: 0.3s">
            <div class="feature-glow-border"></div>
            <div class="feature-icon">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="feature-title">Instant Verification</h3>
            <p class="feature-description">
              Real-time vote verification and tamper-proof election results
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-container">
        <div class="cta-content animate-scale">
          <div class="cta-glow-border"></div>
          <h2 class="cta-title">
            Ready to Experience <span class="title-glow">Secure Voting</span>?
          </h2>
          <p class="cta-description">
            Join thousands of voters who trust MerkPoll for transparent, private elections
          </p>
          <router-link to="/elections" class="btn btn-primary btn-xl btn-hover-lift btn-futuristic">
            <div class="btn-glow-border"></div>
            <span class="btn-text">Get Started Now</span>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { isPetraInstalled, showPetraInstallInstructions, openPetraInstallPage } from '../utils/walletUtils'

const authStore = useAuthStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isLoggedIn)

const connectWallet = async () => {
  // First check if Petra is installed
  if (!isPetraInstalled()) {
    const instructions = showPetraInstallInstructions()
    
    if (confirm(`${instructions}\n\nWould you like to visit the Petra Wallet website now?`)) {
      openPetraInstallPage()
    }
    return
  }

  try {
    await authStore.connectWallet()
    // Redirect to admin panel after successful connection
    router.push('/admin')
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    
    // More specific error handling
    if (error.message.includes('not installed')) {
      openPetraInstallPage()
    } else if (error.message.includes('rejected')) {
      alert('Connection was rejected. Please approve the connection request in your Petra Wallet.')
    } else {
      alert(`Failed to connect wallet: ${authStore.error || error.message}`)
    }
  }
}

const disconnectWallet = async () => {
  await authStore.disconnectWallet()
}

const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ 
    behavior: 'smooth' 
  })
}
</script>

<style scoped>
/* Import Google Fonts for futuristic typography */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800&display=swap');

.home {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, rgba(30, 211, 194, 0.3), transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(207, 171, 115, 0.2), transparent),
    radial-gradient(1px 1px at 90px 40px, rgba(30, 211, 194, 0.4), transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(207, 171, 115, 0.3), transparent),
    radial-gradient(2px 2px at 160px 30px, rgba(30, 211, 194, 0.2), transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: float 20s linear infinite;
}

.energy-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(30, 211, 194, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(207, 171, 115, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 15s linear infinite;
}

.holographic-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border: 1px solid rgba(30, 211, 194, 0.2);
  border-radius: 50%;
  animation: rotate 30s linear infinite;
}

.holographic-rings::before,
.holographic-rings::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(207, 171, 115, 0.15);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}

.holographic-rings::before {
  width: 400px;
  height: 400px;
  animation-delay: -2s;
}

.holographic-rings::after {
  width: 200px;
  height: 200px;
  animation-delay: -1s;
}

@keyframes float {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-100px); }
}

@keyframes grid-move {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes rotate {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.6; transform: translate(-50%, -50%) scale(1.1); }
}

/* Navigation - Enhanced Glassmorphic Design */
.navbar {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(30, 211, 194, 0.3);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 4.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-link {
  font-family: 'Orbitron', monospace;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 900;
  color: var(--color-white);
  text-decoration: none;
  letter-spacing: -0.025em;
  transition: all 0.3s ease;
  position: relative;
}

.brand-glow {
  background: linear-gradient(45deg, #ffffff, rgb(30, 211, 194), #ffffff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.brand-link:hover {
  text-shadow: 0 0 30px rgba(30, 211, 194, 0.8);
  transform: translateY(-2px);
}

.brand-subtitle {
  margin-left: 0.75rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #cfab73;
  white-space: nowrap;
  font-weight: 500;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--color-white);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: 'Exo 2', sans-serif;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  white-space: nowrap;
  min-height: 44px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.nav-link-text {
  position: relative;
  z-index: 2;
}

.nav-link-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(30, 211, 194, 0.2), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover .nav-link-glow {
  left: 100%;
}

.nav-link:hover {
  background: rgba(30, 211, 194, 0.1);
  transform: translateY(-2px);
  color: var(--color-white);
  box-shadow: 0 4px 20px rgba(30, 211, 194, 0.3);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.wallet-address {
  font-family: 'Rajdhani', monospace;
  font-size: 0.875rem;
  color: #cfab73;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(30, 211, 194, 0.3);
  border-radius: 8px;
  min-height: 40px;
  display: flex;
  align-items: center;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

/* Futuristic Buttons */
.btn-futuristic {
  position: relative;
  overflow: hidden;
  border: none;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(20, 20, 20, 0.9));
  color: #ffffff;
  font-family: 'Exo 2', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.btn-glow-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #cfab73, rgb(30, 211, 194), #cfab73) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.btn-futuristic:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 211, 194, 0.4);
}

.btn-futuristic:hover .btn-glow-border {
  opacity: 1;
  animation: border-glow 2s ease-in-out infinite;
}

.btn-futuristic:hover .btn-icon {
  transform: translateX(3px);
}

@keyframes border-glow {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.btn-primary {
  background: linear-gradient(135deg, rgba(30, 211, 194, 0.2), rgba(30, 211, 194, 0.1));
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(207, 171, 115, 0.5);
}

.btn-outline:hover {
  background: rgba(207, 171, 115, 0.1);
}

.error-banner {
  position: relative;
  background: rgba(220, 38, 38, 0.9);
  border: 1px solid rgba(30, 211, 194, 0.3);
  color: var(--color-white);
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  max-width: 320px;
  word-wrap: break-word;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
}

.error-close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--color-white);
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.error-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Hero Section - Enhanced Futuristic */
.hero {
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.7) 0%, 
    rgba(20, 20, 20, 0.8) 100%);
  backdrop-filter: blur(10px);
  padding: 6rem 1.5rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 20%, rgba(30, 211, 194, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(207, 171, 115, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero-content {
  text-align: center;
}

.hero-title-container {
  position: relative;
  margin-bottom: 2rem;
}

.hero-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 900;
  color: var(--color-white);
  margin-bottom: 1rem;
  line-height: 1.1;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.hero-accent {
  background: linear-gradient(135deg, #cfab73, rgb(30, 211, 194), #cfab73);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 3s ease-in-out infinite;
}

.hero-glow {
  text-shadow: 0 0 30px rgba(30, 211, 194, 0.8);
}

.title-underline {
  width: 200px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #cfab73, transparent);
  margin: 0 auto;
  border-radius: 2px;
  animation: underline-glow 2s ease-in-out infinite;
}

@keyframes underline-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.hero-description {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  max-width: 56rem;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
  font-weight: 400;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Features Section - Enhanced */
.features {
  padding: 6rem 1.5rem;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.features-header {
  text-align: center;
  margin-bottom: 4rem;
}

.features-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.title-glow {
  background: linear-gradient(45deg, #cfab73, rgb(30, 211, 194), #cfab73);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 3s ease-in-out infinite;
}

.features-description {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature-card {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(30, 211, 194, 0.2);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.feature-glow-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #cfab73, rgb(30, 211, 194), #cfab73) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 40px rgba(30, 211, 194, 0.2);
  border-color: rgba(30, 211, 194, 0.5);
}

.feature-card:hover .feature-glow-border {
  opacity: 0.6;
  animation: border-glow 2s ease-in-out infinite;
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, rgba(30, 211, 194, 0.2), rgba(30, 211, 194, 0.1));
  border: 1px solid rgba(30, 211, 194, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(30, 211, 194);
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, rgba(30, 211, 194, 0.3), rgba(30, 211, 194, 0.2));
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 8px 25px rgba(30, 211, 194, 0.3);
}

.feature-title {
  font-family: 'Exo 2', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.feature-description {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  font-size: 1rem;
}

/* CTA Section - Enhanced */
.cta {
  padding: 6rem 1.5rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(30, 211, 194, 0.3);
  position: relative;
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.cta-content {
  text-align: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(30, 211, 194, 0.3);
  border-radius: 20px;
  padding: 4rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.cta-glow-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: inherit;
  background: linear-gradient(45deg, #cfab73, rgb(30, 211, 194), #cfab73) border-box;
  -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: destination-out;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0.6;
  animation: border-glow 3s ease-in-out infinite;
}

.cta-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
  position: relative;
  z-index: 2;
}

.cta-description {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2.5rem;
  line-height: 1.6;
  position: relative;
  z-index: 2;
}

/* Mobile Responsive Adjustments */
@media (max-width: 640px) {
  .nav-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    padding: 1rem 0;
  }
  
  .nav-menu {
    justify-content: center;
    width: 100%;
    gap: 0.5rem;
  }
  
  .nav-auth {
    justify-content: center;
    width: 100%;
    gap: 0.5rem;
  }
  
  .wallet-address {
    font-size: 0.75rem;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .error-banner {
    max-width: 100%;
  }
  
  .hero {
    padding: 4rem 1rem;
    min-height: 70vh;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 320px;
  }
  
  .features {
    padding: 4rem 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-top: 3rem;
  }
  
  .feature-card {
    padding: 2rem 1.5rem;
  }
  
  .cta {
    padding: 4rem 1rem;
  }
  
  .cta-content {
    padding: 3rem 1.5rem;
  }
}

@media (min-width: 768px) {
  .nav-container {
    padding: 0 2rem;
  }
  
  .hero {
    padding: 8rem 2rem;
  }
  
  .features {
    padding: 8rem 2rem;
  }
  
  .cta {
    padding: 8rem 2rem;
  }
}

@media (min-width: 1024px) {
  .nav-container {
    padding: 0 2.5rem;
  }
  
  .hero {
    padding: 10rem 2.5rem;
  }
  
  .features {
    padding: 10rem 2.5rem;
  }
  
  .cta {
    padding: 10rem 2.5rem;
  }
  
  .features-grid {
    gap: 3rem;
  }
}

/* Enhanced button icons */
.btn svg {
  transition: transform 0.3s ease;
}

.btn:hover svg {
  transform: translateX(3px);
}

/* Loading spinner in buttons */
.btn .loading-spinner {
  margin-right: 0.5rem;
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-scale {
  animation: scale 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
