import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    walletAddress: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    isAdmin: false
  }),

  getters: {
    isLoggedIn: (state) => !!state.walletAddress && state.isAuthenticated,
    isAdminUser: (state) => state.isAdmin && state.isAuthenticated,
    truncatedAddress: (state) => {
      if (!state.walletAddress) return ''
      return `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
    }
  },

  actions: {
    // Connect Aptos wallet (Petra)
    async connectWallet() {
      this.loading = true
      this.error = null
      
      try {
        // Check if Petra wallet is installed
        if (!window.aptos) {
          this.error = 'Petra Wallet is not installed. Please install Petra Wallet extension.'
          // Open installation page
          window.open('https://petra.app/', '_blank')
          throw new Error('Petra Wallet not installed')
        }
        
        // Check if wallet is already connected
        try {
          const account = await window.aptos.account()
          if (account) {
            this.walletAddress = account.address
            // Authenticate with backend
            const authResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
              walletAddress: account.address,
              network: 'devnet'
            })
            
            this.user = authResponse.data.user
            this.isAuthenticated = true
            this.isAdmin = true
            
            // Store wallet info
            localStorage.setItem('walletAddress', account.address)
            localStorage.setItem('authToken', authResponse.data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${authResponse.data.token}`
            
            return authResponse.data
          }
        } catch (error) {
          // Wallet not connected, proceed with connection request
        }
        
        // Request wallet connection
        const response = await window.aptos.connect()
        
        if (!response || !response.address) {
          throw new Error('Failed to connect to wallet')
        }
        
        this.walletAddress = response.address
        
        // Authenticate with backend
        const authResponse = await axios.post(`${API_BASE_URL}/admin/login`, {
          walletAddress: response.address,
          network: response.network || 'devnet'
        })
        
        this.user = authResponse.data.user
        this.isAuthenticated = true
        this.isAdmin = true
        
        // Store wallet info
        localStorage.setItem('walletAddress', response.address)
        localStorage.setItem('authToken', authResponse.data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${authResponse.data.token}`
        
        return authResponse.data
      } catch (error) {
        console.error('Wallet connection error:', error)
        
        if (error.message.includes('User rejected')) {
          this.error = 'Connection was rejected. Please approve the connection in your wallet.'
        } else if (error.message.includes('not installed')) {
          this.error = 'Petra Wallet is not installed. Please install it to continue.'
        } else if (error.response?.status === 500) {
          this.error = 'Backend server error. Please make sure the backend is running.'
        } else if (error.response?.status) {
          this.error = error.response.data?.message || 'Authentication failed'
        } else {
          this.error = 'Failed to connect wallet. Please try again.'
        }
        
        throw error
      } finally {
        this.loading = false
      }
    },

    // Disconnect wallet
    async disconnectWallet() {
      try {
        if (window.aptos) {
          await window.aptos.disconnect()
        }
      } catch (error) {
        console.warn('Error disconnecting wallet:', error)
      }
      
      this.user = null
      this.walletAddress = null
      this.isAuthenticated = false
      this.isAdmin = false
      
      localStorage.removeItem('walletAddress')
      localStorage.removeItem('authToken')
      delete axios.defaults.headers.common['Authorization']
    },

    // Initialize auth state from localStorage
    async initializeAuth() {
      const walletAddress = localStorage.getItem('walletAddress')
      const authToken = localStorage.getItem('authToken')
      
      if (walletAddress && authToken && window.aptos) {
        try {
          // Check if wallet is still connected
          const account = await window.aptos.account()
          
          if (account && account.address === walletAddress) {
            this.walletAddress = walletAddress
            this.isAuthenticated = true
            this.isAdmin = true
            axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
            
            // Optionally verify token with backend
            try {
              const response = await axios.get(`${API_BASE_URL}/admin/profile`)
              this.user = response.data.user
            } catch (error) {
              console.warn('Token expired, clearing auth state')
              this.disconnectWallet()
            }
          } else {
            // Wallet address mismatch, clear auth
            this.disconnectWallet()
          }
        } catch (error) {
          console.warn('Failed to initialize auth:', error)
          this.disconnectWallet()
        }
      }
    },

    // Check wallet connection status
    async checkWalletConnection() {
      if (!window.aptos) return false
      
      try {
        const account = await window.aptos.account()
        return !!account
      } catch (error) {
        return false
      }
    }
  }
})
