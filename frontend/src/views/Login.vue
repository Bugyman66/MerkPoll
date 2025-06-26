<template>
  <div class="login-page">
    <div class="login-container">
      <div class="glass-container login-card">
        <div class="login-header">
          <h1 class="login-title">Welcome to MerkPoll</h1>
          <p class="login-subtitle">Secure voter authentication</p>
        </div>

        <div v-if="!otpSent" class="login-form">
          <h2 class="form-title">Enter Your Email</h2>
          <p class="form-description">
            We'll send you a secure OTP to verify your identity
          </p>
          
          <form @submit.prevent="sendOtp" class="form">
            <div class="form-group">
              <label class="form-label">
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                required
                class="glass-input"
                placeholder="your-email@example.com"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="glass-btn primary large"
            >
              {{ loading ? 'Sending...' : 'Send OTP' }}
            </button>
          </form>
        </div>

        <div v-else class="login-form">
          <h2 class="form-title">Verify OTP</h2>
          <p class="form-description">
            Enter the 6-digit code sent to {{ email }}
          </p>
          
          <form @submit.prevent="verifyOtp" class="form">
            <div class="form-group">
              <label class="form-label">
                OTP Code
              </label>
              <input
                v-model="otp"
                type="text"
                maxlength="6"
                required
                class="glass-input otp-input"
                placeholder="000000"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="glass-btn primary large"
            >
              {{ loading ? 'Verifying...' : 'Verify & Login' }}
            </button>
          </form>
          
          <button
            @click="resendOtp"
            class="glass-btn outline large"
          >
            Resend OTP
          </button>
        </div>

        <div v-if="error" class="glass-card error-message">
          {{ error }}
        </div>

        <!-- Admin Login -->
        <div class="admin-section">
          <div class="admin-header">
            <p class="admin-text">Election Administrator?</p>
            <button
              @click="showAdminLogin = !showAdminLogin"
              class="glass-btn outline"
            >
              Admin Login
            </button>
          </div>
          
          <div v-if="showAdminLogin" class="glass-card admin-form">
            <div class="form-group">
              <label class="form-label">
                Wallet Address
              </label>
              <input
                v-model="adminWallet"
                type="text"
                class="glass-input"
                placeholder="0x..."
              />
            </div>
            <button
              @click="adminLogin"
              :disabled="loading"
              class="glass-btn secondary large"
            >
              Connect Wallet & Sign
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const otp = ref('')
const adminWallet = ref('')
const otpSent = ref(false)
const showAdminLogin = ref(false)
const loading = ref(false)
const error = ref('')

const sendOtp = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.sendOtp(email.value)
    otpSent.value = true
  } catch (err) {
    error.value = authStore.error || 'Failed to send OTP'
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.verifyOtp(email.value, otp.value)
    router.push('/elections')
  } catch (err) {
    error.value = authStore.error || 'Invalid OTP'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  otpSent.value = false
  otp.value = ''
  await sendOtp()
}

const adminLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    // This would integrate with wallet connection logic
    // For now, we'll simulate admin login
    await authStore.login({ 
      wallet: adminWallet.value,
      isAdmin: true 
    })
    router.push('/admin')
  } catch (err) {
    error.value = authStore.error || 'Admin login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-container {
  width: 100%;
  max-width: 28rem;
}

.login-card {
  padding: 2.5rem;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  opacity: 0.8;
}

.login-form {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-description {
  opacity: 0.8;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.glass-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.glass-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.25rem;
  font-weight: 600;
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: #ff6b6b;
  padding: 1rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
}

.admin-section {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 1rem;
}

.admin-text {
  opacity: 0.8;
  margin-bottom: 1rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1.5rem;
}

.secondary {
  background: rgba(81, 207, 102, 0.2);
  border: 1px solid rgba(81, 207, 102, 0.3);
  color: #51cf66;
}

.secondary:hover:not(:disabled) {
  background: rgba(81, 207, 102, 0.3);
  box-shadow: 0 8px 25px rgba(81, 207, 102, 0.3);
  transform: translateY(-2px);
}

.large {
  width: 100%;
}

/* Responsive */
@media (max-width: 480px) {
  .login-page {
    padding: 2rem 1rem;
  }

  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .form-title {
    font-size: 1.125rem;
  }
}
</style>
