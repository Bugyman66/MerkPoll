<template>
  <div class="elections-page">
    <div class="elections-container">
      <div class="elections-header">
        <h1 class="page-title">Active Elections</h1>
        <p class="page-description">
          Participate in ongoing elections or view results
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading elections...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-card">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="error-title">Failed to Load Elections</h3>
          <p class="error-message">{{ error }}</p>
          <button @click="fetchElections" class="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>

      <!-- Elections Grid -->
      <div v-else-if="elections.length > 0" class="elections-grid">
        <div
          v-for="election in elections"
          :key="election._id"
          class="election-card"
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
              @click.stop="goToVote(election._id)"
              class="btn btn-primary btn-full"
            >
              Vote Now
            </button>
            <button
              v-else-if="election.status === 'completed'"
              @click.stop="viewResults(election._id)"
              class="btn btn-secondary btn-full"
            >
              View Results
            </button>
            <button
              v-else
              disabled
              class="btn btn-outline btn-full btn-disabled"
            >
              {{ election.status === 'upcoming' ? 'Coming Soon' : 'Ended' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-card">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 class="empty-title">No Elections Available</h3>
          <p class="empty-description">
            There are currently no active elections. Check back later or contact your administrator.
          </p>
          <button @click="fetchElections" class="btn btn-primary">
            Refresh
          </button>
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

const goToVote = (id) => {
  router.push(`/vote/${id}`)
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
  background-color: #f9fafb;
  padding: 3rem 1rem;
}

.elections-container {
  max-width: 1200px;
  margin: 0 auto;
}

.elections-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.page-description {
  color: #6b7280;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.error-card {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  max-width: 24rem;
}

.error-icon {
  width: 3rem;
  height: 3rem;
  color: #dc2626;
  margin: 0 auto 1rem auto;
}

.error-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 0.5rem;
}

.error-message {
  color: #991b1b;
  margin-bottom: 1rem;
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

.election-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.election-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-completed {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-upcoming {
  background-color: #fef3c7;
  color: #92400e;
}

.status-default {
  background-color: #f3f4f6;
  color: #374151;
}

.election-description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.election-details {
  margin-bottom: 1.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.detail-label {
  color: #6b7280;
}

.detail-value {
  color: #111827;
  font-weight: 500;
}

.election-actions {
  display: flex;
  gap: 0.5rem;
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
