<template>
  <div class="relayer-wallet-section">
    <div class="glass-card relayer-wallet-card">
      <div class="relayer-header">
        <div class="relayer-title">
          <svg class="relayer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
          </svg>
          <div>
            <h3>Relayer Wallet</h3>
            <p class="relayer-description">Used for gasless transactions and smart contract deployment</p>
          </div>
        </div>
        <button 
          @click="refreshBalance" 
          class="glass-btn outline small"
          :disabled="authStore.loading"
        >
          <svg class="refresh-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ authStore.loading ? 'Refreshing...' : 'Refresh' }}
        </button>
      </div>

      <div v-if="authStore.relayerWallet" class="relayer-content">
        <!-- Wallet Address -->
        <div class="wallet-info-row">
          <div class="info-label">
            <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2m6 0V7a2 2 0 00-2-2H9a2 2 0 00-2 2v2m6 0H9"/>
            </svg>
            Address
          </div>
          <div class="info-value">
            <span class="wallet-address">{{ authStore.relayerWallet.address }}</span>
            <button @click="copyAddress" class="copy-btn" title="Copy address">
              <svg v-if="!copied" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
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
            <span class="balance-amount">{{ authStore.relayerWallet.balance }} APT</span>
            <span class="funding-status" :class="{ funded: authStore.isRelayerWalletFunded, unfunded: !authStore.isRelayerWalletFunded }">
              {{ authStore.isRelayerWalletFunded ? 'Funded' : 'Unfunded' }}
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
            <span class="last-updated">{{ formatDate(authStore.relayerWallet.lastBalanceUpdate) }}</span>
          </div>
        </div>

        <!-- Funding Instructions -->
        <div v-if="!authStore.isRelayerWalletFunded" class="funding-instructions">
          <div class="warning-banner">
            <svg class="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <div>
              <h4>Wallet Needs Funding</h4>
              <p>This relayer wallet needs APT tokens to pay for gas fees when creating smart contracts and processing votes.</p>
            </div>
          </div>
          
          <div class="funding-steps">
            <h4>How to Fund Your Relayer Wallet:</h4>
            <ol>
              <li>Copy the relayer wallet address above</li>
              <li>Use the <a href="https://aptoslabs.com/faucet" target="_blank" rel="noopener noreferrer">Aptos Devnet Faucet</a> to send test APT</li>
              <li>Or send APT from your connected wallet to this address</li>
              <li>Click "Refresh" to update the balance</li>
            </ol>
          </div>
        </div>

        <!-- Success Message -->
        <div v-else class="funding-success">
          <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>Relayer wallet is funded and ready for use!</span>
        </div>
      </div>

      <div v-else class="relayer-loading">
        <p>Loading relayer wallet information...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const copied = ref(false)

// Copy wallet address to clipboard
async function copyAddress() {
  try {
    await navigator.clipboard.writeText(authStore.relayerWallet.address)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy address:', error)
  }
}

// Refresh balance
async function refreshBalance() {
  try {
    await authStore.refreshRelayerBalance()
  } catch (error) {
    console.error('Failed to refresh balance:', error)
  }
}

// Format date
function formatDate(dateString) {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleString()
}

onMounted(() => {
  // Auto-refresh balance when component mounts
  if (authStore.relayerWallet) {
    refreshBalance()
  }
})
</script>

<style scoped>
.relayer-wallet-section {
  margin-bottom: 2rem;
}

.relayer-wallet-card {
  padding: 2rem;
}

.relayer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.relayer-title {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.relayer-icon {
  width: 2rem;
  height: 2rem;
  opacity: 0.8;
  margin-top: 0.25rem;
}

.relayer-title h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.relayer-description {
  margin: 0;
  opacity: 0.7;
  font-size: 0.875rem;
  line-height: 1.4;
}

.refresh-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.wallet-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
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
  opacity: 0.8;
}

.info-icon {
  width: 1.125rem;
  height: 1.125rem;
  opacity: 0.7;
}

.info-value {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Courier New', monospace;
}

.wallet-address {
  font-size: 0.875rem;
  opacity: 0.9;
  word-break: break-all;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.copy-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
  padding: 0.25rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
}

.copy-btn svg {
  width: 1rem;
  height: 1rem;
}

.balance-amount {
  font-weight: 600;
  font-size: 1rem;
}

.funding-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  font-family: system-ui, sans-serif;
}

.funding-status.funded {
  background: rgba(34, 197, 94, 0.2);
  color: rgb(34, 197, 94);
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.funding-status.unfunded {
  background: rgba(239, 68, 68, 0.2);
  color: rgb(239, 68, 68);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.last-updated {
  opacity: 0.7;
  font-size: 0.875rem;
}

.funding-instructions {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.warning-banner {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.warning-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: rgb(239, 68, 68);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.warning-banner h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: rgb(239, 68, 68);
}

.warning-banner p {
  margin: 0;
  opacity: 0.9;
  line-height: 1.4;
}

.funding-steps h4 {
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
}

.funding-steps ol {
  margin: 0;
  padding-left: 1.5rem;
  opacity: 0.8;
  line-height: 1.6;
}

.funding-steps li {
  margin-bottom: 0.5rem;
}

.funding-steps a {
  color: white;
  text-decoration: underline;
  opacity: 0.9;
}

.funding-steps a:hover {
  opacity: 1;
}

.funding-success {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: 0.75rem;
  margin-top: 1.5rem;
  color: rgb(34, 197, 94);
  font-weight: 500;
}

.success-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.relayer-loading {
  text-align: center;
  padding: 2rem;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .relayer-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .wallet-info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .info-value {
    align-self: stretch;
    justify-content: space-between;
  }
  
  .wallet-address {
    max-width: none;
    word-break: break-all;
  }
  
  .warning-banner {
    flex-direction: column;
    gap: 0.75rem;
  }
}
</style>
