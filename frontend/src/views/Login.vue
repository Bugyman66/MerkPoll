<template>
  <div class="login-page">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-particles"></div>
      <div class="energy-grid"></div>
      <div class="holographic-rings"></div>
    </div>

    <div class="login-container">
      <div class="glass-container login-card">
        <div class="login-glow-border"></div>
        <div class="login-header">
          <h1 class="login-title">Welcome to <span class="title-glow">MerkPoll</span></h1>
          <p class="login-subtitle">Secure voter authentication</p>
        </div>

        <div v-if="!otpSent" class="login-form">
          <h2 class="form-title">Enter Your <span class="title-glow">Email</span></h2>
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
              class="glass-btn primary large btn-futuristic"
            >
              <div class="btn-glow-border"></div>
              <span class="btn-text">{{ loading ? 'Sending...' : 'Send OTP' }}</span>
            </button>
          </form>
        </div>

        <div v-else class="login-form">
          <h2 class="form-title">Verify <span class="title-glow">OTP</span></h2>
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
              class="glass-btn primary large btn-futuristic"
            >
              <div class="btn-glow-border"></div>
              <span class="btn-text">{{ loading ? 'Verifying...' : 'Verify & Login' }}</span>
            </button>
          </form>
          
          <button
            @click="resendOtp"
            class="glass-btn outline large btn-futuristic"
          >
            <div class="btn-glow-border"></div>
            <span class="btn-text">Resend OTP</span>
          </button>
        </div>

        <div v-if="error" class="glass-card error-message">
          <div class="error-glow-border"></div>
          {{ error }}
        </div>

        <!-- Admin Login -->
        <div class="admin-section">
          <div class="admin-header">
            <p class="admin-text">Election <span class="title-glow">Administrator</span>?</p>
            <button
              @click="showAdminLogin = !showAdminLogin"
              class="glass-btn outline btn-futuristic"
            >
              <div class="btn-glow-border"></div>
              <span class="btn-text">Admin Login</span>
            </button>
          </div>
          
          <div v-if="showAdminLogin" class="glass-card admin-form">
            <div class="admin-form-glow-border"></div>
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
              class="glass-btn secondary large btn-futuristic"
            >
              <div class="btn-glow-border"></div>
              <span class="btn-text">Connect Wallet & Sign</span>
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
/* Import Google Fonts for futuristic typography */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800&display=swap');

.login-page {
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
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

.login-container {
  width: 100%;
  max-width: 28rem;
  position: relative;
  z-index: 1;
}

.login-card {
  padding: 2.5rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(30, 211, 194, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
}

.login-card:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(30, 211, 194, 0.5);
  box-shadow: 0 20px 40px rgba(30, 211, 194, 0.2);
}

/* Glow Borders */
.login-glow-border,
.error-glow-border,
.admin-form-glow-border {
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

.login-card:hover .login-glow-border,
.error-message:hover .error-glow-border,
.admin-form:hover .admin-form-glow-border {
  opacity: 0.6;
  animation: border-glow 2s ease-in-out infinite;
}

@keyframes border-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-family: 'Orbitron', monospace;
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-white);
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

@keyframes glow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.login-subtitle {
  font-family: 'Exo 2', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

.login-form {
  margin-bottom: 2rem;
}

.form-title {
  font-family: 'Exo 2', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-white);
  letter-spacing: -0.025em;
}

.form-description {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
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
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.glass-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(30, 211, 194, 0.3);
  border-radius: 12px;
  color: white;
  font-family: 'Exo 2', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.glass-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.glass-input:focus {
  outline: none;
  border-color: rgb(30, 211, 194);
  background: rgba(30, 211, 194, 0.1);
  box-shadow: 0 0 0 3px rgba(30, 211, 194, 0.1);
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.25rem;
  font-weight: 600;
  font-family: 'Orbitron', monospace;
}

.error-message {
  background: rgba(220, 38, 38, 0.2);
  border: 1px solid rgba(220, 38, 38, 0.3);
  color: #ff6b6b;
  padding: 1rem;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.admin-section {
  border-top: 1px solid rgba(30, 211, 194, 0.2);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.admin-header {
  text-align: center;
  margin-bottom: 1rem;
}

.admin-text {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-size: 1rem;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(30, 211, 194, 0.2);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
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
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  cursor: pointer;
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

.btn-futuristic:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 211, 194, 0.4);
}

.btn-futuristic:hover .btn-glow-border {
  opacity: 1;
  animation: border-glow 2s ease-in-out infinite;
}

.btn-futuristic:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.glass-btn {
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.primary {
  background: linear-gradient(135deg, rgba(30, 211, 194, 0.2), rgba(30, 211, 194, 0.1));
}

.outline {
  background: transparent;
  border: 2px solid rgba(207, 171, 115, 0.5);
}

.outline:hover {
  background: rgba(207, 171, 115, 0.1);
}

.secondary {
  background: linear-gradient(135deg, rgba(207, 171, 115, 0.2), rgba(207, 171, 115, 0.1));
  border: 1px solid rgba(207, 171, 115, 0.3);
  color: #cfab73;
}

.secondary:hover:not(:disabled) {
  background: rgba(207, 171, 115, 0.3);
  box-shadow: 0 8px 25px rgba(207, 171, 115, 0.3);
  transform: translateY(-2px);
}

.large {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
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

@media (min-width: 768px) {
  .login-page {
    padding: 4rem 2rem;
  }
  
  .login-card {
    padding: 3rem;
  }
}

@media (min-width: 1024px) {
  .login-page {
    padding: 5rem 2rem;
  }
  
  .login-card {
    padding: 3.5rem;
  }
}
</style>
