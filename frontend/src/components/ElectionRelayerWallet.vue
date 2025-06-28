<template>
  <div class="relayer-wallet-section">
    <!-- Debug: Test if component loads -->
    <div style="background: red; color: white; padding: 1rem; margin: 1rem 0;">
      <h3>🔍 DEBUG: ElectionRelayerWallet Component Loaded!</h3>
      <p>Loading: {{ loading }}</p>
      <p>Error: {{ error }}</p>
      <p>RelayerWallet: {{ relayerWallet ? 'EXISTS' : 'NULL' }}</p>
    </div>
    
    <div class="glass-card relayer-wallet-card">
      <div class="relayer-header">
        <div class="relayer-title">
          <svg class="relayer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
          </svg>
          <div>
            <h3>Relayer Wallet</h3>
            <p class="relayer-description">This wallet will be used to deploy smart contracts and cover gas fees for voters</p>
          </div>
        </div>
        <button 
          @click="fetchRelayerWallet" 
          class="glass-btn outline small"
          :disabled="loading"
        >
          <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-if="!loading">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <svg class="loading-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" v-else>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="relayerWallet" class="relayer-content">
        <!-- Wallet Address -->
        <div class="wallet-info-row">
          <div class="info-label">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H9"/>
            </svg>
            Wallet Address
          </div>
          <div class="info-value">
            <code class="wallet-address">{{ relayerWallet.address }}</code>
            <button @click="copyToClipboard(relayerWallet.address)" class="copy-btn" title="Copy address">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Balance -->
        <div class="wallet-info-row">
          <div class="info-label">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
            Balance
          </div>
          <div class="info-value">
            <span class="balance-amount">{{ relayerWallet.balance }} APT</span>
            <span class="balance-status" :class="{ 'funded': relayerWallet.isFunded, 'unfunded': !relayerWallet.isFunded }">
              {{ relayerWallet.isFunded ? 'Funded' : 'Unfunded' }}
            </span>
          </div>
        </div>

        <!-- Last Updated -->
        <div class="wallet-info-row">
          <div class="info-label">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Last Updated
          </div>
          <div class="info-value">
            <span class="last-updated">{{ formatDate(relayerWallet.lastBalanceUpdate) }}</span>
          </div>
        </div>

        <!-- Funding Instructions -->
        <div v-if="!relayerWallet.isFunded" class="funding-instructions">
          <div class="warning-header">
            <svg class="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span>Relayer Wallet Needs Funding</span>
          </div>
          <p class="funding-message">
            To create elections and enable gasless voting, you need to fund this relayer wallet with APT tokens.
          </p>
          <div class="funding-steps">
            <h4>How to fund:</h4>
            <ol>
              <li>Copy the wallet address above</li>
              <li>Use the <a href="https://aptoslabs.com/testnet-faucet" target="_blank" class="faucet-link">Aptos Testnet Faucet</a> to send APT</li>
              <li>Or transfer APT from your personal wallet</li>
              <li>Click "Refresh" to update the balance</li>
            </ol>
          </div>
        </div>

        <div v-else class="funding-success">
          <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Relayer wallet is funded and ready for election creation!</span>
        </div>
      </div>

      <div v-else-if="loading" class="relayer-loading">
        <div class="loading-spinner"></div>
        <p>Loading relayer wallet information...</p>
      </div>

      <div v-else-if="error" class="relayer-error">
        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <p>{{ error }}</p>
        <button @click="fetchRelayerWallet" class="glass-btn outline small">
          Try Again
        </button>
      </div>

      <div v-else class="relayer-empty">
        <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
        </svg>
        <p>No relayer wallet found. Please log in again to create one.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Reactive data
const relayerWallet = ref(null)
const loading = ref(false)
const error = ref(null)

// Fetch relayer wallet information from backend
async function fetchRelayerWallet() {
  console.log('🔍 fetchRelayerWallet called')
  loading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('authToken')
    console.log('🔍 Token exists:', !!token)
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await axios.get(`${API_BASE}/api/admin/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    relayerWallet.value = response.data.user.relayerWallet
    console.log('Fetched relayer wallet:', relayerWallet.value)
    
    if (!relayerWallet.value) {
      error.value = 'No relayer wallet found in your account'
    }
  } catch (err) {
    console.error('Error fetching relayer wallet:', err)
    error.value = err.response?.data?.message || 'Failed to fetch relayer wallet information'
  } finally {
    loading.value = false
  }
}

// Refresh relayer wallet balance
async function refreshBalance() {
  loading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('authToken')
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await axios.post(`${API_BASE}/api/admin/relayer/refresh-balance`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    relayerWallet.value = response.data.relayerWallet
    console.log('Refreshed relayer wallet balance:', relayerWallet.value)
  } catch (err) {
    console.error('Error refreshing balance:', err)
    error.value = err.response?.data?.message || 'Failed to refresh balance'
  } finally {
    loading.value = false
  }
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    // You could add a toast notification here
    console.log('Address copied to clipboard')
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleString()
}

// Load relayer wallet on component mount
onMounted(() => {
  console.log('🔍 ElectionRelayerWallet component mounted!')
  fetchRelayerWallet()
})
</script>

<style scoped>
.relayer-wallet-section {
  margin-bottom: 2rem;
}

.relayer-wallet-card {
  border: 2px solid rgba(99, 102, 241, 0.3);
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
}

.relayer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.relayer-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.relayer-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #6366f1;
}

.relayer-title h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.relayer-description {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  opacity: 0.8;
  color: white;
}

.refresh-icon, .loading-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.loading-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.wallet-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.wallet-info-row:last-child {
  border-bottom: none;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  opacity: 0.9;
  color: white;
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  opacity: 0.7;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.wallet-address {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.copy-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.copy-btn:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.copy-btn svg {
  width: 1rem;
  height: 1rem;
}

.balance-amount {
  font-weight: 600;
  font-size: 1rem;
}

.balance-status {
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.balance-status.funded {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.balance-status.unfunded {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.last-updated {
  font-size: 0.875rem;
  opacity: 0.8;
}

.funding-instructions {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #ef4444;
}

.warning-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.funding-message {
  margin: 0 0 1rem 0;
  opacity: 0.9;
  line-height: 1.5;
}

.funding-steps h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
}

.funding-steps ol {
  margin: 0;
  padding-left: 1.25rem;
}

.funding-steps li {
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.4;
}

.faucet-link {
  color: #6366f1;
  text-decoration: underline;
}

.faucet-link:hover {
  color: #8b5cf6;
}

.funding-success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 0.5rem;
  color: #22c55e;
  font-weight: 500;
}

.success-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.relayer-loading, .relayer-error, .relayer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  opacity: 0.8;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-icon, .empty-icon {
  width: 2rem;
  height: 2rem;
  margin-bottom: 1rem;
  color: #ef4444;
}

.empty-icon {
  color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .relayer-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .wallet-info-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }

  .info-value {
    justify-content: flex-start;
  }

  .wallet-address {
    font-size: 0.75rem;
  }
}
</style>
