<template>
  <div class="home page-layout">
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
            <div v-if="authStore.error && !authStore.isLoggedIn" class="error-banner animate-fade-in">
              {{ authStore.error }}
              <button @click="authStore.error = null" class="error-close">×</button>
            </div>
            
            <button 
              v-if="!isAuthenticated" 
              @click="connectWallet"
              class="btn btn-primary btn-hover-lift"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="loading-spinner loading-spinner-sm"></span>
              {{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}
            </button>
            <div v-else class="nav-auth">
              <span class="wallet-address">{{ authStore.truncatedAddress }}</span>
              <router-link to="/admin" class="btn btn-outline btn-sm">
                Admin Panel
              </router-link>
              <button @click="disconnectWallet" class="btn btn-ghost btn-sm">
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
        <div class="hero-content animate-fade-in">
          <h1 class="hero-title">
            Secure, Private, 
            <span class="hero-accent">Decentralized Voting</span>
          </h1>
          <p class="hero-description">
            MerkPoll leverages Merkle Trees and blockchain technology to ensure 
            your vote remains private while maintaining complete transparency and verifiability.
          </p>
          <div class="hero-actions">
            <router-link to="/elections" class="btn btn-primary btn-lg btn-hover-lift">
              View Elections
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </router-link>
            <button @click="scrollToFeatures" class="btn btn-outline btn-lg">
              Learn More
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
            Why Choose MerkPoll?
          </h2>
          <p class="features-description">
            Built on cutting-edge technology to ensure election integrity
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card animate-slide-up" style="animation-delay: 0.1s">
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
          <h2 class="cta-title">
            Ready to Experience Secure Voting?
          </h2>
          <p class="cta-description">
            Join thousands of voters who trust MerkPoll for transparent, private elections
          </p>
          <router-link to="/elections" class="btn btn-primary btn-xl btn-hover-lift">
            Get Started Now
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
.home {
  min-height: 100vh;
  width: 100%;
}

/* Navigation - Glassmorphic Design */
.navbar {
  background: var(--glass-light);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border-bottom: 1px solid var(--glass-medium);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-glass-sm);
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
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
  color: var(--color-white);
  text-decoration: none;
  letter-spacing: -0.025em;
  transition: all var(--transition-normal);
}

.brand-link:hover {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
}

.brand-subtitle {
  margin-left: 0.75rem;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: var(--color-gray-300);
  white-space: nowrap;
  font-weight: 500;
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
  border-radius: var(--radius-md);
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-normal);
  white-space: nowrap;
  min-height: 44px;
  display: flex;
  align-items: center;
  position: relative;
}

.nav-link:hover {
  background: var(--glass-medium);
  transform: translateY(-1px);
  color: var(--color-white);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.wallet-address {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-gray-200);
  padding: 0.5rem 1rem;
  background: var(--glass-dark);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-md);
  min-height: 40px;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.error-banner {
  position: relative;
  background: var(--glass-heavy);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: var(--color-white);
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  max-width: 320px;
  word-wrap: break-word;
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  box-shadow: var(--shadow-glass-md);
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
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.error-close:hover {
  background: var(--glass-medium);
}

/* Hero Section - Enhanced Glassmorphic */
.hero {
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%, 
    rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: var(--blur-sm);
  -webkit-backdrop-filter: var(--blur-sm);
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
    radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
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

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: 2rem;
  line-height: 1.1;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.hero-accent {
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-200) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.hero-description {
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  color: var(--color-gray-200);
  max-width: 56rem;
  margin: 0 auto 3rem auto;
  line-height: 1.6;
  font-weight: 400;
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
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.features-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--color-gray-300);
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
  background: var(--glass-light);
  backdrop-filter: var(--blur-md);
  -webkit-backdrop-filter: var(--blur-md);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  text-align: center;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-glass-md);
}

.feature-card:hover {
  background: var(--glass-medium);
  transform: translateY(-8px);
  box-shadow: var(--shadow-glass-xl);
  border-color: var(--color-white);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  background: var(--glass-medium);
  border: 1px solid var(--glass-heavy);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-white);
  transition: all var(--transition-normal);
}

.feature-card:hover .feature-icon {
  background: var(--glass-heavy);
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.1);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.feature-description {
  color: var(--color-gray-300);
  line-height: 1.6;
  font-size: 1rem;
}

/* CTA Section - Enhanced */
.cta {
  padding: 6rem 1.5rem;
  background: var(--glass-light);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border-top: 1px solid var(--glass-medium);
  position: relative;
}

.cta::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
}

.cta-container {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.cta-content {
  text-align: center;
  background: var(--glass-medium);
  backdrop-filter: var(--blur-lg);
  -webkit-backdrop-filter: var(--blur-lg);
  border: 1px solid var(--glass-heavy);
  border-radius: var(--radius-2xl);
  padding: 4rem 2rem;
  box-shadow: var(--shadow-glass-lg);
  position: relative;
  overflow: hidden;
}

.cta-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
}

.cta-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1.5rem;
  letter-spacing: -0.025em;
}

.cta-description {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--color-gray-200);
  margin-bottom: 2.5rem;
  line-height: 1.6;
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
  transition: transform var(--transition-normal);
}

.btn:hover svg {
  transform: translateX(2px);
}

/* Loading spinner in buttons */
.btn .loading-spinner {
  margin-right: 0.5rem;
}
</style>
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 4rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.nav-brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.brand-link {
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 700;
  color: var(--primary-color, #2563eb);
  text-decoration: none;
}

.brand-subtitle {
  margin-left: 0.5rem;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: var(--text-secondary, #6b7280);
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.nav-link {
  color: var(--text-primary, #374151);
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius-sm, 0.375rem);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.nav-link:hover {
  color: var(--primary-color, #2563eb);
  background-color: var(--bg-secondary, #f3f4f6);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.wallet-address {
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--text-secondary, #6b7280);
  padding: 0.5rem 0.75rem;
  background: var(--bg-secondary, #f3f4f6);
  border-radius: var(--border-radius-sm, 0.375rem);
  min-height: 36px;
  display: flex;
  align-items: center;
}

.error-banner {
  position: relative;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-sm, 0.375rem);
  font-size: 0.875rem;
  max-width: 280px;
  word-wrap: break-word;
}

.error-close {
  position: absolute;
  top: 0.25rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: bold;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile Navigation Adjustments */
@media (max-width: 640px) {
  .nav-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding: 1rem 0;
  }
  
  .nav-menu {
    justify-content: center;
    width: 100%;
  }
  
  .nav-auth {
    justify-content: center;
    width: 100%;
  }
  
  .wallet-address {
    font-size: 0.7rem;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .error-banner {
    max-width: 100%;
  }
}

/* Hero Section - Mobile First */
.hero {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  padding: 3rem 1rem;
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.hero-content {
  text-align: center;
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--text-primary, #111827);
  margin-bottom: 1.5rem;
  line-height: 1.1;
}

.text-primary {
  color: var(--primary-color, #2563eb);
}

.hero-description {
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: var(--text-secondary, #4b5563);
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

/* Mobile hero adjustments */
@media (max-width: 640px) {
  .hero {
    padding: 2rem 1rem;
    min-height: 60vh;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
  }
}

/* Features Section - Mobile First */
.features {
  padding: 4rem 1rem;
  background: var(--bg-primary, white);
}

.features-container {
  max-width: 1200px;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: 3rem;
}

.features-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary, #111827);
  margin-bottom: 1rem;
}

.features-description {
  color: var(--text-secondary, #6b7280);
  max-width: 32rem;
  margin: 0 auto;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.feature-card {
  background: var(--bg-primary, white);
  padding: 2rem;
  border-radius: var(--border-radius, 0.5rem);
  box-shadow: var(--shadow-md, 0 4px 6px rgba(0,0,0,0.1));
  text-align: center;
  border: 1px solid var(--border-color, #e5e7eb);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
}

.feature-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-sm, 0.5rem);
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
  font-size: clamp(1.125rem, 2.5vw, 1.25rem);
  font-weight: 600;
  color: var(--text-primary, #111827);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-secondary, #6b7280);
  line-height: 1.6;
  font-size: clamp(0.875rem, 2vw, 1rem);
}

/* Responsive grid for features */
@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .features {
    padding: 3rem 1rem;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}

/* CTA Section - Mobile First */
.cta {
  background-color: var(--primary-color, #2563eb);
  padding: 4rem 1rem;
}

.cta-container {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
}

.cta-description {
  color: #bfdbfe;
  max-width: 32rem;
  margin: 0 auto 2rem auto;
  line-height: 1.6;
  font-size: clamp(1rem, 2.5vw, 1.125rem);
}

@media (max-width: 640px) {
  .cta {
    padding: 3rem 1rem;
  }
}

/* Enhanced Buttons for Home Page */
.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  min-height: 52px;
}

@media (max-width: 640px) {
  .btn-large {
    width: 100%;
    max-width: 280px;
  }
}

/* Touch-friendly improvements */
@media (hover: none) and (pointer: coarse) {
  .btn, .nav-link {
    min-height: 48px;
  }
  
  .feature-card:hover {
    transform: none;
  }
}

/* High contrast mode improvements */
@media (prefers-contrast: high) {
  .nav-link:hover {
    background-color: var(--primary-color, #2563eb);
    color: white;
  }
  
  .feature-card {
    border-width: 2px;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  .hero {
    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
  }
  
  .hero-title {
    color: white;
  }
  
  .hero-description {
    color: #d1d5db;
  }
  
  .text-primary {
    color: #60a5fa;
  }
  
  .feature-icon-blue {
    background-color: #1e3a8a;
    color: #60a5fa;
  }
  
  .feature-icon-green {
    background-color: #064e3b;
    color: #34d399;
  }
  
  .feature-icon-yellow {
    background-color: #92400e;
    color: #fbbf24;
  }
}
</style>
