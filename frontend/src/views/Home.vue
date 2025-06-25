<template>
  <div class="home">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-content">
          <div class="nav-brand">
            <router-link to="/" class="brand-link">
              MerkPoll
            </router-link>
            <span class="brand-subtitle">Privacy-First Voting</span>
          </div>
          <div class="nav-menu">
            <router-link to="/elections" class="nav-link">
              Elections
            </router-link>
            
            <!-- Error Display -->
            <div v-if="authStore.error && !authStore.isLoggedIn" class="error-banner">
              {{ authStore.error }}
              <button @click="authStore.error = null" class="error-close">×</button>
            </div>
            
            <button 
              v-if="!isAuthenticated" 
              @click="connectWallet"
              class="btn btn-primary"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}
            </button>
            <div v-else class="nav-auth">
              <span class="wallet-address">{{ authStore.truncatedAddress }}</span>
              <router-link to="/admin" class="btn btn-outline">
                Admin Panel
              </router-link>
              <button @click="disconnectWallet" class="btn btn-text">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-container">
        <div class="hero-content">
          <h1 class="hero-title">
            Secure, Private, 
            <span class="text-primary">Decentralized Voting</span>
          </h1>
          <p class="hero-description">
            MerkPoll leverages Merkle Trees and blockchain technology to ensure 
            your vote remains private while maintaining complete transparency and verifiability.
          </p>
          <div class="hero-actions">
            <router-link to="/elections" class="btn btn-primary btn-large">
              View Elections
            </router-link>
            <button class="btn btn-outline btn-large">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="features-container">
        <div class="features-header">
          <h2 class="features-title">
            Why Choose MerkPoll?
          </h2>
          <p class="features-description">
            Built on cutting-edge technology to ensure election integrity
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon feature-icon-blue">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h3 class="feature-title">Privacy Protected</h3>
            <p class="feature-description">
              Merkle Trees ensure your vote remains anonymous while maintaining verifiability
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon feature-icon-green">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="feature-title">Blockchain Secured</h3>
            <p class="feature-description">
              Built on Aptos blockchain for immutable and transparent election records
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon feature-icon-yellow">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
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
        <h2 class="cta-title">
          Ready to Experience Secure Voting?
        </h2>
        <p class="cta-description">
          Join thousands of voters who trust MerkPoll for transparent, private elections
        </p>
        <router-link to="/elections" class="btn btn-white btn-large">
          Get Started
        </router-link>
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
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Navigation */
.navbar {
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border-bottom: 1px solid #e5e7eb;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  text-decoration: none;
}

.brand-subtitle {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: #374151;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.wallet-address {
  font-family: monospace;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
}

.error-banner {
  position: relative;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin: 0 1rem;
  max-width: 300px;
}

.error-close {
  position: absolute;
  top: 0.5rem;
  right: 0.75rem;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  padding: 5rem 0;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.text-primary {
  color: #2563eb;
}

.hero-description {
  font-size: 1.25rem;
  color: #4b5563;
  max-width: 48rem;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Features Section */
.features {
  padding: 5rem 0;
  background: white;
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.features-header {
  text-align: center;
  margin-bottom: 4rem;
}

.features-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
}

.features-description {
  color: #6b7280;
  max-width: 32rem;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  border: 1px solid #e5e7eb;
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
}

.feature-icon-blue {
  background-color: #dbeafe;
  color: #2563eb;
}

.feature-icon-green {
  background-color: #d1fae5;
  color: #059669;
}

.feature-icon-yellow {
  background-color: #fef3c7;
  color: #d97706;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  background-color: #2563eb;
  padding: 4rem 0;
}

.cta-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.cta-title {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.cta-description {
  color: #bfdbfe;
  max-width: 32rem;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  text-align: center;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.btn-outline {
  border: 1px solid #2563eb;
  color: #2563eb;
  background: transparent;
}

.btn-outline:hover {
  background-color: #2563eb;
  color: white;
}

.btn-text {
  background: none;
  color: #374151;
}

.btn-text:hover {
  color: #dc2626;
}

.btn-white {
  background: white;
  color: #2563eb;
}

.btn-white:hover {
  background: #f9fafb;
}

.btn-large {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-menu {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
