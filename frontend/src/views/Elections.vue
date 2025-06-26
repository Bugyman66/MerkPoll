<template>
  <div class="elections-page page-layout">
    <div class="page-content">
      <div class="container">
        <div class="elections-header animate-fade-in">
          <h1 class="section-title">Active Elections</h1>
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
              <button @click="fetchElections" class="btn btn-primary btn-hover-lift">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Try Again
              </button>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="elections-content">
          <!-- Demo Election -->
          <div class="demo-section animate-slide-up" style="animation-delay: 0.1s">
            <div class="demo-header">
              <h2 class="demo-title">Experience the Future of Voting</h2>
              <p class="demo-subtitle">Try our interactive demo with real voting features</p>
            </div>
            
            <div class="demo-election-card glass-container interactive-glow">
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
                <router-link :to="`/vote/demo`" class="btn btn-primary btn-lg btn-hover-lift">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                  </svg>
                  Try Demo Vote
                </router-link>
              </div>
            </div>
          </div>

          <!-- Elections Grid -->
          <div v-if="elections.length > 0" class="elections-section">
            <h2 class="elections-section-title">Live Elections</h2>
            <div class="elections-grid">
              <div
                v-for="(election, index) in elections"
                :key="election._id"
                class="election-card glass-container interactive-glow animate-slide-up"
                :style="`animation-delay: ${0.1 + index * 0.1}s`"
                @click="viewElection(election._id)"
              >
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
                    class="btn btn-primary btn-full btn-hover-lift"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                    </svg>
                    Vote Now
                  </button>
                  <button
                    v-else-if="election.status === 'completed'"
                    @click.stop="viewResults(election._id)"
                    class="btn btn-outline btn-full btn-hover-lift"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    View Results
                  </button>
                  <button
                    v-else
                    disabled
                    class="btn btn-ghost btn-full btn-disabled"
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ election.status === 'upcoming' ? 'Coming Soon' : 'Ended' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-state animate-scale">
            <div class="glass-container empty-card">
              <div class="empty-content">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <h3 class="empty-title">No Elections Available</h3>
                <p class="empty-description">
                  There are currently no active elections. Check back later or contact your administrator.
                </p>
                <button @click="fetchElections" class="btn btn-primary btn-hover-lift">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  Refresh
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
.elections-page {
  min-height: 100vh;
  width: 100%;
}

.page-content {
  padding: 2rem 0;
}

.elections-header {
  margin-bottom: 4rem;
  text-align: center;
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
  color: var(--color-white);
  margin: 0 auto 1.5rem auto;
  opacity: 0.8;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.error-message {
  color: var(--color-gray-300);
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
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.demo-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  color: var(--color-gray-300);
  max-width: 600px;
  margin: 0 auto;
}

.demo-election-card {
  max-width: 800px;
  margin: 0 auto;
  padding: 3rem;
  position: relative;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.demo-election-card:hover {
  transform: translateY(-4px);
  background: var(--glass-medium);
}

.demo-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-200) 100%);
  color: var(--color-black);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  box-shadow: var(--shadow-glass-sm);
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
  transition: all var(--transition-normal);
}

.election-card:hover {
  transform: translateY(-4px);
  background: var(--glass-medium);
}

.election-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.election-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-white);
  line-height: 1.3;
  flex: 1;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  border: 1px solid;
}

.status-demo {
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-200) 100%);
  color: var(--color-black);
  border-color: var(--color-white);
}

.status-active {
  background: var(--glass-medium);
  color: var(--color-white);
  border-color: var(--color-white);
}

.status-completed {
  background: var(--glass-dark);
  color: var(--color-gray-300);
  border-color: var(--color-gray-500);
}

.status-upcoming {
  background: var(--glass-dark);
  color: var(--color-gray-400);
  border-color: var(--color-gray-600);
}

.status-default {
  background: var(--glass-dark);
  color: var(--color-gray-500);
  border-color: var(--color-gray-600);
}

.election-description {
  color: var(--color-gray-300);
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
  border-bottom: 1px solid var(--glass-light);
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 0.875rem;
  color: var(--color-gray-400);
  font-weight: 500;
}

.detail-value {
  font-size: 0.875rem;
  color: var(--color-white);
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
  background: var(--glass-dark);
  border: 1px solid var(--glass-medium);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--color-gray-200);
}

.feature-item svg {
  color: var(--color-white);
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
  color: var(--color-gray-400);
  margin: 0 auto 1.5rem auto;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-white);
  margin-bottom: 1rem;
}

.empty-description {
  color: var(--color-gray-300);
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
  transition: transform var(--transition-normal);
}

.btn:hover svg {
  transform: translateX(2px);
}

/* Animation delays for staggered loading */
.animate-slide-up {
  opacity: 0;
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-title {
  color: #991b1b;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #991b1b;
  margin-bottom: 1rem;
}

/* Demo Election Styles */
.demo-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.demo-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.demo-election-card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: relative;
  margin-top: 1rem;
}

.demo-badge {
  position: absolute;
  top: -0.5rem;
  right: 1rem;
  background: #f59e0b;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.demo-election-card .election-title {
  color: #111827;
}

.demo-election-card .election-description {
  color: #6b7280;
}

.demo-election-card .detail-label {
  color: #6b7280;
}

.demo-election-card .detail-value {
  color: #059669;
  font-weight: 600;
}

/* Elections Grid */
.elections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.election-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.election-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Empty State */
.empty-state {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.empty-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 24rem;
  border: 1px solid #e5e7eb;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  color: #9ca3af;
  margin: 0 auto 1rem auto;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
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
  border: 1px solid #d1d5db;
  color: #6b7280;
  background: transparent;
}

.btn-full {
  width: 100%;
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .elections-grid {
    grid-template-columns: 1fr;
  }
  
  .election-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .election-actions {
    flex-direction: column;
  }
}
</style>
