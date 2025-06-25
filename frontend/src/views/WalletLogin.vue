<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
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
            
            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>
            
            <button 
              @click="connectWallet" 
              class="btn btn-primary btn-large"
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
              <router-link to="/admin" class="btn btn-primary btn-large">
                Go to Admin Panel
              </router-link>
              <button @click="disconnectWallet" class="btn btn-outline">
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
}

.login-header {
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #6b7280;
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
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.success-icon {
  color: #059669;
}

.connect-wallet h2, .wallet-connected h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.connect-wallet p, .wallet-connected p {
  color: #6b7280;
  margin: 0;
}

.error-message {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-size: 0.875rem;
  width: 100%;
}

.wallet-info {
  margin-top: 1rem;
}

.info-text {
  font-size: 0.875rem;
  color: #6b7280;
}

.info-text a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.info-text a:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-outline {
  border-color: #d1d5db;
  color: #374151;
  background: white;
}

.btn-outline:hover {
  background: #f9fafb;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.login-footer {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.back-link {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.back-link:hover {
  color: #374151;
}

@media (max-width: 640px) {
  .login-page {
    padding: 1rem;
  }
  
  .login-card {
    padding: 2rem;
  }
}
</style>
