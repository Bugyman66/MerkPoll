<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
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
                class="form-input"
                placeholder="your-email@example.com"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary btn-full"
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
                class="form-input otp-input"
                placeholder="000000"
              />
            </div>
            
            <button
              type="submit"
              :disabled="loading"
              class="btn btn-primary btn-full"
            >
              {{ loading ? 'Verifying...' : 'Verify & Login' }}
            </button>
          </form>
          
          <button
            @click="resendOtp"
            class="btn btn-text btn-full"
          >
            Resend OTP
          </button>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Admin Login -->
        <div class="admin-section">
          <div class="admin-header">
            <p class="admin-text">Election Administrator?</p>
            <button
              @click="showAdminLogin = !showAdminLogin"
              class="btn btn-outline"
            >
              Admin Login
            </button>
          </div>
          
          <div v-if="showAdminLogin" class="admin-form">
            <div class="form-group">
              <label class="form-label">
                Wallet Address
              </label>
              <input
                v-model="adminWallet"
                type="text"
                class="form-input"
                placeholder="0x..."
              />
            </div>
            <button
              @click="adminLogin"
              :disabled="loading"
              class="btn btn-secondary btn-full"
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
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
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
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  border: 1px solid #e5e7eb;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #6b7280;
}

.login-form {
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.form-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.25rem;
}

.btn {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-align: center;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-secondary {
  background-color: #10b981;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #059669;
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
  color: #2563eb;
}

.btn-text:hover {
  color: #1d4ed8;
}

.btn-full {
  width: 100%;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.375rem;
  margin-top: 1rem;
}

.admin-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 1rem;
}

.admin-text {
  color: #6b7280;
  margin-bottom: 1rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
