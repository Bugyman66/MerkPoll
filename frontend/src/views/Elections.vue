<template>
  <div class="elections-page page-layout">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-particles"></div>
      <div class="energy-grid"></div>
      <div class="holographic-rings"></div>
    </div>

    <div class="page-content">
      <div class="container">
        <div class="elections-header animate-fade-in">
          <h1 class="section-title">
            Active <span class="title-glow">Elections</span>
          </h1>
          <p class="section-subtitle">
            Participate in ongoing elections or view results with complete transparency and privacy
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state animate-fade-in">
          <div class="glass-container">
            <div class="loading-content">
              <div class="loading-spinner loading-spinner-lg"></div>
              <p class="text-lg text-gray-200">Loading elections...</p>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state animate-slide-up">
          <div class="glass-container error-card">
            <div class="error-content">
              <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h3 class="error-title">Failed to Load Elections</h3>
              <p class="error-message">{{ error }}</p>
              <button @click="fetchElections" class="btn btn-primary btn-hover-lift btn-futuristic">
                <div class="btn-glow-border"></div>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span class="btn-text">Try Again</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="elections-content">
          <!-- Demo Election -->
          <div class="demo-section animate-slide-up" style="animation-delay: 0.1s">
            <div class="demo-header">
              <h2 class="demo-title">Experience the Future of <span class="title-glow">Voting</span></h2>
              <p class="demo-subtitle">Try our interactive demo with real voting features</p>
            </div>
            
            <div class="demo-election-card glass-container interactive-glow">
              <div class="demo-glow-border"></div>
              <div class="demo-badge">
                <span>INTERACTIVE DEMO</span>
              </div>
              
              <div class="election-header">
                <h3 class="election-title">Student Union Elections 2025</h3>
                <span class="status-badge status-demo">Demo Active</span>
              </div>
              
              <p class="election-description">
                Experience our new multi-position voting system with this interactive demo election featuring real candidate profiles and voting mechanics.
              </p>
              
              <div class="election-features">
                <div class="feature-item">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Multi-position voting</span>
                </div>
                <div class="feature-item">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>Candidate profiles</span>
                </div>
                <div class="feature-item">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  <span>Privacy protected</span>
                </div>
                <div class="feature-item">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Abstain option</span>
                </div>
              </div>
              
              <div class="election-actions">
                <router-link :to="`/vote/demo`" class="btn btn-primary btn-lg btn-hover-lift btn-futuristic">
                  <div class="btn-glow-border"></div>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                  <span class="btn-text">Try Demo Vote</span>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Elections Grid -->
          <div v-if="elections.length > 0" class="elections-section">
            <h2 class="elections-section-title">Live <span class="title-glow">Elections</span></h2>
            <div class="elections-grid">
              <div
                v-for="(election, index) in elections"
                :key="election._id"
                class="election-card glass-container interactive-glow animate-slide-up"
                :style="`animation-delay: ${0.1 + index * 0.1}s`"
                @click="viewElection(election._id)"
              >
                <div class="election-glow-border"></div>
                <div class="election-header">
                  <h3 class="election-title">{{ election.title }}</h3>
                  <span :class="getStatusClass(election.status)" class="status-badge">
                    {{ election.status }}
                  </span>
                </div>
                
                <p class="election-description">{{ election.description }}</p>
                
                <div class="election-details">
                  <div class="detail-row">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">{{ formatDate(election.startDate) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">End Date:</span>
                    <span class="detail-value">{{ formatDate(election.endDate) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Total Votes:</span>
                    <span class="detail-value">{{ election.totalVotes || 0 }}</span>
                  </div>
                </div>
                
                <div class="election-actions">
                  <button
                    v-if="election.status === 'active'"
                    @click.stop="goToVote(election)"
                    class="btn btn-primary btn-full btn-hover-lift btn-futuristic"
                  >
                    <div class="btn-glow-border"></div>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    <span class="btn-text">Vote Now</span>
                  </button>
                  <button
                    v-else-if="election.status === 'completed'"
                    @click.stop="viewResults(election._id)"
                    class="btn btn-outline btn-full btn-hover-lift btn-futuristic"
                  >
                    <div class="btn-glow-border"></div>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    <span class="btn-text">View Results</span>
                  </button>
                  <button
                    v-else
                    disabled
                    class="btn btn-ghost btn-full btn-disabled btn-futuristic"
                  >
                    <div class="btn-glow-border"></div>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span class="btn-text">{{ election.status === 'upcoming' ? 'Coming Soon' : 'Ended' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state animate-scale">
            <div class="glass-container empty-card">
              <div class="empty-glow-border"></div>
              <div class="empty-content">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <h3 class="empty-title">No Elections Available</h3>
                <p class="empty-description">
                  There are currently no active elections. Check back later or contact your administrator.
                </p>
                <button @click="fetchElections" class="btn btn-primary btn-hover-lift btn-futuristic">
                  <div class="btn-glow-border"></div>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="btn-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span class="btn-text">Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useElectionStore } from '../stores/election'

const router = useRouter()
const electionStore = useElectionStore()

const elections = ref([])
const loading = ref(false)
const error = ref('')

const fetchElections = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await electionStore.fetchElections()
    elections.value = response.elections || []
  } catch (err) {
    error.value = electionStore.error || 'Failed to fetch elections'
  } finally {
    loading.value = false
  }
}

const viewElection = (id) => {
  router.push(`/elections/${id}`)
}

const goToVote = (election) => {
  // Use slug for voting if available, fallback to ID
  const identifier = election.slug || election._id
  router.push(`/vote/${identifier}`)
}

const viewResults = (id) => {
  router.push(`/elections/${id}/results`)
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'status-active'
    case 'completed':
      return 'status-completed'
    case 'upcoming':
      return 'status-upcoming'
    default:
      return 'status-default'
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchElections()
})
</script>

<style scoped>
/* Import Google Fonts for futuristic typography */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@300;400;500;600;700;800&display=swap');

.elections-page {
  min-height: 100vh;
  width: 100%;
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

.page-content {
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.elections-header {
  margin-bottom: 4rem;
  text-align: center;
}

.section-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1.5rem;
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

.section-subtitle {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Glass Container */
.glass-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(30, 211, 194, 0.2);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.glass-container:hover {
  background: rgba(0, 0, 0, 0.8);
  border-color: rgba(30, 211, 194, 0.5);
  box-shadow: 0 20px 40px rgba(30, 211, 194, 0.2);
}

/* Glow Borders */
.demo-glow-border,
.election-glow-border,
.empty-glow-border {
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

.glass-container:hover .demo-glow-border,
.glass-container:hover .election-glow-border,
.glass-container:hover .empty-glow-border {
  opacity: 0.6;
  animation: border-glow 2s ease-in-out infinite;
}

@keyframes border-glow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Loading State */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.loading-content {
  text-align: center;
  padding: 3rem;
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.error-card {
  max-width: 32rem;
  width: 100%;
}

.error-content {
  text-align: center;
  padding: 3rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: rgb(30, 211, 194);
  margin: 0 auto 1.5rem auto;
  opacity: 0.8;
}

.error-title {
  font-family: 'Exo 2', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.error-message {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Demo Section */
.demo-section {
  margin-bottom: 5rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.demo-subtitle {
  font-family: 'Exo 2', sans-serif;
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
}

.demo-election-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
  position: relative;
  cursor: pointer;
  transition: all 0.4s ease;
}

.demo-election-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.demo-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, #cfab73, rgb(30, 211, 194));
  color: var(--color-black);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 20px rgba(30, 211, 194, 0.3);
}

.demo-badge span {
  background: linear-gradient(135deg, var(--color-black) 0%, var(--color-gray-800) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Elections Section */
.elections-section {
  margin-top: 4rem;
}

.elections-section-title {
  font-family: 'Orbitron', monospace;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: -0.025em;
}

.elections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.election-card {
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s ease;
}

.election-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.election-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.election-title {
  font-family: 'Exo 2', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-white);
  line-height: 1.3;
  flex: 1;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border: 1px solid;
}

.status-demo {
  background: linear-gradient(135deg, #cfab73, rgb(30, 211, 194));
  color: var(--color-black);
  border-color: #cfab73;
}

.status-active {
  background: rgba(30, 211, 194, 0.2);
  color: rgb(30, 211, 194);
  border-color: rgb(30, 211, 194);
}

.status-completed {
  background: rgba(207, 171, 115, 0.2);
  color: #cfab73;
  border-color: #cfab73;
}

.status-upcoming {
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.6);
  border-color: rgba(255, 255, 255, 0.3);
}

.status-default {
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
}

.election-description {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.election-details {
  margin-bottom: 2rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(30, 211, 194, 0.2);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.detail-value {
  font-family: 'Exo 2', sans-serif;
  font-size: 0.875rem;
  color: #cfab73;
  font-weight: 600;
  text-align: right;
}

.election-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(30, 211, 194, 0.2);
  border-radius: 8px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(30, 211, 194, 0.1);
  border-color: rgba(30, 211, 194, 0.4);
}

.feature-item svg {
  color: rgb(30, 211, 194);
  flex-shrink: 0;
}

.election-actions {
  display: flex;
  gap: 1rem;
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
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

.btn-icon {
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.btn-futuristic:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(30, 211, 194, 0.4);
}

.btn-futuristic:hover .btn-glow-border {
  opacity: 1;
  animation: border-glow 2s ease-in-out infinite;
}

.btn-futuristic:hover .btn-icon {
  transform: translateX(3px);
}

.btn-primary {
  background: linear-gradient(135deg, rgba(30, 211, 194, 0.2), rgba(30, 211, 194, 0.1));
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(207, 171, 115, 0.5);
}

.btn-outline:hover {
  background: rgba(207, 171, 115, 0.1);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.empty-card {
  max-width: 32rem;
  width: 100%;
}

.empty-content {
  text-align: center;
  padding: 3rem;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: rgb(30, 211, 194);
  margin: 0 auto 1.5rem auto;
}

.empty-title {
  font-family: 'Exo 2', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.empty-description {
  font-family: 'Rajdhani', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .page-content {
    padding: 1.5rem 0;
  }
  
  .elections-header {
    margin-bottom: 3rem;
  }
  
  .demo-section {
    margin-bottom: 3rem;
  }
  
  .demo-election-card {
    padding: 2rem 1.5rem;
  }
  
  .demo-badge {
    position: static;
    display: inline-block;
    margin-bottom: 1rem;
  }
  
  .elections-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .election-card {
    padding: 1.5rem;
  }
  
  .election-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .election-features {
    grid-template-columns: 1fr;
  }
  
  .election-actions {
    flex-direction: column;
  }
  
  .detail-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .detail-value {
    text-align: left;
  }
}

@media (min-width: 768px) {
  .page-content {
    padding: 3rem 0;
  }
  
  .elections-header {
    margin-bottom: 5rem;
  }
  
  .demo-section {
    margin-bottom: 6rem;
  }
}

@media (min-width: 1024px) {
  .page-content {
    padding: 4rem 0;
  }
  
  .elections-grid {
    gap: 3rem;
  }
  
  .election-card {
    padding: 2.5rem;
  }
  
  .demo-election-card {
    padding: 4rem;
  }
}

/* Enhanced interactions */
.btn svg {
  transition: transform 0.3s ease;
}

.btn:hover svg {
  transform: translateX(3px);
}

/* Animation classes */
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-scale {
  animation: scale 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
