<template>
  <div class="vote-page">
    <div class="vote-container">
      <!-- Loading State -->
      <div v-if="loading" class="glass-container loading-state">
        <div class="loading-spinner"></div>
        <p>Loading election details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="glass-container error-card">
          <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
          <h2>{{ error }}</h2>
          <router-link to="/elections" class="glass-btn primary">
            Back to Elections
          </router-link>
        </div>
      </div>

      <!-- Voting Interface -->
      <div v-else-if="election" class="voting-interface">
        <!-- Election Header -->
        <div class="glass-container election-header">
          <h1 class="election-title">{{ election.title }}</h1>
          <p class="election-description">{{ election.description }}</p>
          <div class="election-meta">
            <span v-if="election.organization" class="organization">{{ election.organization }}</span>
            <span class="deadline">Voting ends: {{ formatDate(election.deadline) }}</span>
          </div>
        </div>

        <!-- Already Voted State -->
        <div v-if="election.hasVoted" class="already-voted">
          <div class="glass-container voted-card">
            <svg class="voted-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h2>Thank You for Voting!</h2>
            <p>You have already cast your vote in this election.</p>
            <button @click="showResults = !showResults" class="glass-btn outline">
              {{ showResults ? 'Hide Results' : 'View Results' }}
            </button>
          </div>
        </div>

        <!-- Voter Email Input -->
        <div v-else-if="!otpVerified" class="email-verification">
          <div class="glass-container verification-card">
            <h2>Verify Your Eligibility</h2>
            <p>Please enter your registered email address to receive a one-time password (OTP):</p>
            <div class="form-group">
              <input
                v-model="emailInput"
                type="email"
                placeholder="Enter your email address"
                class="glass-input"
                :disabled="otpSent || otpLoading"
              />
              <button @click="requestOtp" :disabled="!emailInput || otpLoading || otpSent" class="glass-btn primary">
                {{ otpLoading && !otpSent ? 'Sending...' : 'Send OTP' }}
              </button>
            </div>
            <div v-if="otpSent" class="otp-section">
              <p>Enter the OTP sent to your email:</p>
              <input
                v-model="otpInput"
                type="text"
                maxlength="6"
                placeholder="6-digit OTP"
                class="glass-input"
                :disabled="otpLoading || otpVerified"
              />
              <button @click="verifyOtp" :disabled="!otpInput || otpLoading || otpVerified" class="glass-btn primary">
                {{ otpLoading ? 'Verifying...' : 'Verify OTP' }}
              </button>
            </div>
            <div v-if="otpError" class="error-message">{{ otpError }}</div>
            <div v-if="otpSuccess" class="success-message">{{ otpSuccess }}</div>
          </div>
        </div>

        <!-- Voting Form -->
        <div v-else class="glass-container voting-form">
          <div class="voting-progress">
            <p>Complete your ballot by voting for each position:</p>
            <div class="progress-indicator">
              {{ completedPositions }}/{{ election.positions.length }} positions completed
            </div>
          </div>

          <!-- Positions -->
          <div v-for="(position, posIndex) in election.positions" :key="position.id" class="glass-card position-section">
            <div class="position-header">
              <h3>{{ position.title }}</h3>
              <p v-if="position.description" class="position-description">{{ position.description }}</p>
              <div class="position-info">
                <span class="selection-limit">
                  Select {{ position.maxSelections === 1 ? '1 candidate' : `up to ${position.maxSelections} candidates` }}
                </span>
                <span v-if="election.allowAbstain" class="abstain-option">
                  or abstain from this position
                </span>
              </div>
            </div>

            <div class="candidates-grid">
              <div 
                v-for="candidate in position.candidates" 
                :key="candidate.id"
                :class="['glass-card', 'candidate-card', { 
                  'selected': isSelected(position.id, candidate.id),
                  'disabled': !canSelectCandidate(position.id, candidate.id)
                }]"
                @click="toggleCandidate(position.id, candidate.id)"
              >
                <div class="candidate-header">
                  <div class="candidate-name">{{ candidate.name }}</div>
                  <div v-if="candidate.party" class="candidate-party">{{ candidate.party }}</div>
                </div>
                
                <div v-if="candidate.description" class="candidate-description">
                  {{ candidate.description }}
                </div>
                
                <div v-if="candidate.qualifications" class="candidate-qualifications">
                  <strong>Qualifications:</strong> {{ candidate.qualifications }}
                </div>

                <div class="selection-indicator">
                  <svg v-if="isSelected(position.id, candidate.id)" class="check-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>

              <!-- Abstain Option -->
              <div 
                v-if="election.allowAbstain"
                :class="['glass-card', 'abstain-card', { 'selected': isAbstained(position.id) }]"
                @click="toggleAbstain(position.id)"
              >
                <div class="abstain-content">
                  <h4>Abstain</h4>
                  <p>Skip voting for this position</p>
                </div>
                <div class="selection-indicator">
                  <svg v-if="isAbstained(position.id)" class="check-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="glass-card submit-section">
            <div class="submit-summary">
              <h3>Review Your Selections</h3>
              <div v-for="position in election.positions" :key="position.id" class="glass-card selection-summary">
                <strong>{{ position.title }}:</strong>
                <span v-if="votes[position.id] && votes[position.id].length > 0">
                  {{ getSelectedCandidateNames(position.id).join(', ') }}
                </span>
                <span v-else-if="abstainedPositions.includes(position.id)" class="abstained">
                  Abstained
                </span>
                <span v-else class="incomplete">Not completed</span>
              </div>
            </div>

            <div class="submit-actions">
              <button 
                @click="submitVote" 
                :disabled="!canSubmitVote || submitting"
                class="glass-btn primary large"
              >
                {{ submitting ? 'Submitting Vote...' : 'Submit Vote' }}
              </button>
              <p class="vote-warning">
                ⚠️ Once submitted, your vote cannot be changed
              </p>
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div v-if="showResults" class="glass-container results-section">
          <h2>Election Results</h2>
          <p>Results functionality will be implemented based on the backend results API</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useElectionStore } from '../stores/election'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

const route = useRoute()
const router = useRouter()
const electionStore = useElectionStore()

// Reactive data
const loading = ref(true)
const error = ref(null)
const election = ref(null)
const voterEmail = ref(null)
const emailInput = ref('')
const votes = ref({}) // { positionId: [candidateId1, candidateId2] }
const abstainedPositions = ref([])
const submitting = ref(false)
const showResults = ref(false)
const otpSent = ref(false)
const otpInput = ref('')
const otpVerified = ref(false)
const otpLoading = ref(false)
const otpError = ref('')
const otpSuccess = ref('')

// Computed properties
const completedPositions = computed(() => {
  if (!election.value) return 0
  return election.value.positions.filter(position => {
    return votes.value[position.id]?.length > 0 || abstainedPositions.value.includes(position.id)
  }).length
})

const canSubmitVote = computed(() => {
  if (!election.value) return false
  
  if (election.value.requireAllPositions) {
    return completedPositions.value === election.value.positions.length
  } else {
    return completedPositions.value > 0
  }
})

// Methods
onMounted(() => {
  loadElection()
})

async function loadElection() {
  try {
    loading.value = true
    error.value = null
    // Fetch election by slug
    const slug = route.params.slug
    const data = await electionStore.fetchElectionBySlug(slug)
    election.value = data
    // Initialize votes object
    election.value.positions.forEach(position => {
      votes.value[position.id] = []
    })
  } catch (err) {
    console.error('Load election error:', err)
    if (err.response?.status === 404) {
      error.value = 'Election not found'
    } else if (err.response?.status === 400) {
      error.value = err.response.data.message || 'Election is not available for voting'
    } else {
      error.value = 'Failed to load election details'
    }
  } finally {
    loading.value = false
  }
}

async function requestOtp() {
  otpLoading.value = true
  otpError.value = ''
  otpSuccess.value = ''
  try {
    const slug = route.params.slug
    await axios.post(`${API_BASE}/api/elections/slug/${slug}/request-otp`, { email: emailInput.value })
    otpSent.value = true
    otpSuccess.value = 'OTP sent to your email.'
  } catch (err) {
    otpError.value = err.response?.data?.message || 'Failed to send OTP.'
  } finally {
    otpLoading.value = false
  }
}

async function verifyOtp() {
  otpLoading.value = true
  otpError.value = ''
  otpSuccess.value = ''
  try {
    const slug = route.params.slug
    await axios.post(`${API_BASE}/api/elections/slug/${slug}/verify-otp`, { email: emailInput.value, otp: otpInput.value })
    otpVerified.value = true
    voterEmail.value = emailInput.value
    otpSuccess.value = 'OTP verified. You may now vote.'
  } catch (err) {
    otpError.value = err.response?.data?.message || 'Invalid or expired OTP.'
  } finally {
    otpLoading.value = false
  }
}

function isSelected(positionId, candidateId) {
  return votes.value[positionId]?.includes(candidateId) || false
}

function isAbstained(positionId) {
  return abstainedPositions.value.includes(positionId)
}

function canSelectCandidate(positionId, candidateId) {
  const position = election.value.positions.find(p => p.id === positionId)
  const currentSelections = votes.value[positionId] || []
  
  // If already selected, can always deselect
  if (currentSelections.includes(candidateId)) return true
  
  // If abstained, cannot select
  if (abstainedPositions.value.includes(positionId)) return false
  
  // Check if within selection limit
  return currentSelections.length < position.maxSelections
}

function toggleCandidate(positionId, candidateId) {
  if (!canSelectCandidate(positionId, candidateId)) return
  
  // Clear abstain if selecting candidate
  if (abstainedPositions.value.includes(positionId)) {
    abstainedPositions.value = abstainedPositions.value.filter(id => id !== positionId)
  }
  
  const currentSelections = votes.value[positionId] || []
  
  if (currentSelections.includes(candidateId)) {
    // Deselect
    votes.value[positionId] = currentSelections.filter(id => id !== candidateId)
  } else {
    // Select
    votes.value[positionId] = [...currentSelections, candidateId]
  }
}

function toggleAbstain(positionId) {
  if (abstainedPositions.value.includes(positionId)) {
    // Remove abstain
    abstainedPositions.value = abstainedPositions.value.filter(id => id !== positionId)
  } else {
    // Add abstain and clear votes
    abstainedPositions.value.push(positionId)
    votes.value[positionId] = []
  }
}

function getSelectedCandidateNames(positionId) {
  const position = election.value.positions.find(p => p.id === positionId)
  const selectedIds = votes.value[positionId] || []
  
  return selectedIds.map(candidateId => {
    const candidate = position.candidates.find(c => c.id === candidateId)
    return candidate?.name || 'Unknown'
  })
}

async function submitVote() {
  if (!canSubmitVote.value) return
  
  submitting.value = true
  
  try {
    // Prepare vote data
    const voteData = {
      electionId: route.params.slug,
      voterEmail: voterEmail.value,
      votes: election.value.positions.map(position => ({
        positionId: position.id,
        candidateIds: votes.value[position.id] || []
      })).filter(vote => vote.candidateIds.length > 0)
    }
    
    const response = await axios.post(`${API_BASE}/api/vote/submit`, voteData)
    
    console.log('Vote submitted:', response.data)
    
    // Update election state
    election.value.hasVoted = true
    
    alert('Your vote has been submitted successfully!')
    
  } catch (error) {
    console.error('Vote submission error:', error)
    alert(error.response?.data?.message || 'Failed to submit vote. Please try again.')
  } finally {
    submitting.value = false
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}
</script>

<style scoped>
.vote-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.vote-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Loading and Error States */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.error-card {
  text-align: center;
  padding: 3rem;
  max-width: 28rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ff6b6b;
  margin: 0 auto 1.5rem;
}

.error-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Election Header */
.election-header {
  padding: 2rem;
  text-align: center;
}

.election-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.election-description {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
}

.election-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.organization,
.deadline {
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Already Voted State */
.already-voted {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.voted-card {
  text-align: center;
  padding: 3rem;
  max-width: 28rem;
}

.voted-icon {
  width: 4rem;
  height: 4rem;
  color: #51cf66;
  margin: 0 auto 1.5rem;
}

.voted-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.voted-card p {
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Email Verification */
.email-verification {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.verification-card {
  padding: 2rem;
  width: 100%;
  max-width: 500px;
}

.verification-card h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.verification-card p {
  text-align: center;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.form-group {
  display: flex;
  gap: 1rem;
}

.glass-input {
  flex: 1;
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

/* Voting Form */
.voting-form {
  overflow: hidden;
}

.voting-progress {
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-indicator {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Position Sections */
.position-section {
  padding: 2rem;
  margin-bottom: 1rem;
}

.position-header {
  margin-bottom: 1.5rem;
}

.position-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.position-description {
  opacity: 0.9;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.position-info {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.selection-limit {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.abstain-option {
  opacity: 0.8;
  padding: 0.5rem 0;
}

/* Candidates Grid */
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.candidate-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.candidate-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.candidate-card.selected {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.candidate-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.candidate-card.disabled:hover {
  transform: none;
  box-shadow: none;
}

.candidate-header {
  margin-bottom: 1rem;
}

.candidate-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.candidate-party {
  opacity: 0.8;
  font-size: 0.875rem;
  font-style: italic;
}

.candidate-description {
  margin-bottom: 1rem;
  line-height: 1.5;
  opacity: 0.9;
}

.candidate-qualifications {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.8;
}

.selection-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.check-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #51cf66;
}

/* Abstain Card */
.abstain-card {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  text-align: center;
}

.abstain-card:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.abstain-card.selected {
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.abstain-content h4 {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  opacity: 0.9;
}

.abstain-content p {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.7;
}

/* Submit Section */
.submit-section {
  padding: 2rem;
  margin-top: 1rem;
}

.submit-summary {
  margin-bottom: 2rem;
}

.submit-summary h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  font-weight: 600;
}

.selection-summary {
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selection-summary strong {
  opacity: 0.9;
}

.abstained {
  font-style: italic;
  opacity: 0.7;
}

.incomplete {
  color: #ff6b6b;
  font-style: italic;
}

.submit-actions {
  text-align: center;
}

.vote-warning {
  margin-top: 1rem;
  color: #ffd43b;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.9;
}

.results-section {
  padding: 2rem;
  text-align: center;
}

.results-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.results-section p {
  opacity: 0.8;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .vote-page {
    padding: 1rem 0.5rem;
  }
  
  .candidates-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group {
    flex-direction: column;
  }
  
  .voting-progress {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .position-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .election-meta {
    flex-direction: column;
    align-items: center;
  }

  .selection-summary {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .vote-container {
    gap: 1rem;
  }

  .position-section,
  .submit-section {
    padding: 1rem;
  }

  .election-header,
  .verification-card,
  .error-card,
  .voted-card {
    padding: 1.5rem;
  }

  .election-title {
    font-size: 1.5rem;
  }
}

.otp-section {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  color: #ff6b6b;
  margin-top: 1rem;
  text-align: center;
}

.success-message {
  color: #51cf66;
  margin-top: 1rem;
  text-align: center;
}
</style>
