<template>
  <div class="login-page">
    <div class="login-container">
      <div class="glass-container login-card">
        <div class="login-header">
          <h1 class="login-title">Admin Access</h1>
          <p class="login-subtitle">Connect your wallet to manage elections</p>
        </div>

        <div class="wallet-section">
          <div v-if="!authStore.isLoggedIn" class="connect-wallet">
            <div class="wallet-icon">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
              </svg>
            </div>
            
            <h2>Connect Petra Wallet</h2>
            <p>To create and manage elections, please connect your Aptos wallet.</p>
            
            <div v-if="authStore.error" class="glass-card error-message">
              {{ authStore.error }}
            </div>
            
            <button 
              @click="connectWallet" 
              class="glass-btn primary large"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}
            </button>
            
            <div class="wallet-info">
              <p class="info-text">
                Don't have Petra Wallet? 
                <a href="https://petra.app/" target="_blank" rel="noopener noreferrer">
                  Download here
                </a>
              </p>
            </div>
          </div>

          <div v-else class="wallet-connected">
            <div class="success-icon">
              <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            
            <h2>Wallet Connected</h2>
            <p>Successfully connected to {{ authStore.truncatedAddress }}</p>
            
            <div class="action-buttons">
              <router-link to="/admin" class="glass-btn primary large">
                Go to Admin Panel
              </router-link>
              <button @click="disconnectWallet" class="glass-btn outline">
                Disconnect
              </button>
            </div>
          </div>
        </div>

        <div class="login-footer">
          <router-link to="/" class="back-link">
            ← Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const connectWallet = async () => {
  try {
    await authStore.connectWallet()
    // Auto-redirect to admin panel after successful connection
    setTimeout(() => {
      router.push('/admin')
    }, 1000)
  } catch (error) {
    console.error('Failed to connect wallet:', error)
  }
}

const disconnectWallet = async () => {
  await authStore.disconnectWallet()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 28rem;
}

.login-card {
  padding: 3rem;
  text-align: center;
}

.login-header {
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  opacity: 0.8;
  font-size: 1rem;
}

.wallet-section {
  margin-bottom: 2rem;
}

.connect-wallet, .wallet-connected {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.wallet-icon, .success-icon {
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.success-icon {
  color: #51cf66;
}

.connect-wallet h2, .wallet-connected h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.connect-wallet p, .wallet-connected p {
  opacity: 0.8;
  margin: 0;
  line-height: 1.6;
}

.error-message {
  padding: 1rem;
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  font-size: 0.875rem;
  width: 100%;
  backdrop-filter: blur(10px);
}

.wallet-info {
  margin-top: 1rem;
}

.info-text {
  font-size: 0.875rem;
  opacity: 0.8;
}

.info-text a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  opacity: 0.9;
}

.info-text a:hover {
  text-decoration: underline;
  opacity: 1;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.large {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.login-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
}

.back-link {
  color: white;
  text-decoration: none;
  font-size: 0.875rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 1;
}

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.5rem;
  }
}
</style>
