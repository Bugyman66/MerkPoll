<template>
  <div class="vote-page page-layout">
    <div class="page-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="loading" class="loading-state animate-fade-in">
          <div class="glass-container">
            <div class="loading-content">
              <div class="loading-spinner loading-spinner-lg"></div>
              <p class="text-lg text-gray-200">Loading election details...</p>
            </div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state animate-scale">
          <div class="glass-container error-card">
            <div class="error-content">
              <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <h2 class="error-title">{{ error }}</h2>
              <router-link to="/elections" class="btn btn-primary btn-hover-lift">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Elections
              </router-link>
            </div>
          </div>
        </div>

        <!-- Vote Success State -->
        <div v-else-if="voteSubmitted" class="success-state animate-scale">
          <div class="glass-container success-card">
            <div class="success-content">
              <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h2 class="success-title">Vote Submitted Successfully!</h2>
              <p class="success-description">Your vote has been recorded and secured on the blockchain with complete privacy protection.</p>
              
              <div class="vote-summary">
                <h3 class="summary-title">Your Selections:</h3>
                <div class="selections-list">
                  <div v-for="(position, index) in election.positions" :key="index" class="selection-item">
                    <div class="selection-header">
                      <strong class="position-name">{{ position.title }}:</strong>
                    </div>
                    <div v-if="userSelections[index] && userSelections[index].length > 0" class="selected-candidates">
                      <span v-for="(candidateIndex, i) in userSelections[index]" :key="i" class="candidate-badge">
                        {{ position.candidates[candidateIndex].name }}
                        <span v-if="position.candidates[candidateIndex].party" class="party-tag">
                          ({{ position.candidates[candidateIndex].party }})
                        </span>
                      </span>
                    </div>
                    <span v-else class="abstain-badge">Abstained</span>
                  </div>
                </div>
              </div>
              
              <div class="success-actions">
                <router-link to="/elections" class="btn btn-primary btn-lg btn-hover-lift">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  View Other Elections
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Voting Interface -->
        <div v-else-if="election" class="voting-interface animate-fade-in">
          <!-- Election Header -->
          <div class="glass-container election-header">
            <div class="election-info">
              <h1 class="election-title">{{ election.title || 'Election' }}</h1>
              <p v-if="election.organization" class="organization">{{ election.organization }}</p>
              <p v-if="election.description" class="description">{{ election.description }}</p>
              
              <div class="election-meta">
                <div v-if="election.deadline" class="meta-item">
                  <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Deadline: {{ formatDate(election.deadline) }}</span>
                </div>
                <div class="meta-item">
                  <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span>{{ election.positions?.length || 0 }} Position(s)</span>
                </div>
              </div>
            </div>
            
            <!-- Progress Indicator -->
            <div class="voting-progress">
              <div class="progress-header">
                <span class="progress-text">Voting Progress</span>
                <span class="progress-percentage">{{ Math.round(votingProgress) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${votingProgress}%` }"></div>
              </div>
              <div class="progress-info">
                <span class="positions-completed">{{ completedPositions }} of {{ totalPositions }} positions completed</span>
              </div>
            </div>
          </div>

          <!-- Voting Sections -->
          <div class="voting-sections">
            <div 
              v-for="(position, positionIndex) in election.positions" 
              :key="positionIndex" 
              class="position-section glass-container animate-slide-up"
              :style="`animation-delay: ${positionIndex * 0.1}s`"
            >
              <div class="position-header">
                <div class="position-title-section">
                  <h2 class="position-title">{{ position.title }}</h2>
                  <div class="position-meta">
                    <span class="selection-info">
                      Select up to {{ position.maxSelections }} candidate{{ position.maxSelections > 1 ? 's' : '' }}
                    </span>
                    <span class="current-selections">
                      {{ (userSelections[positionIndex]?.length || 0) }} selected
                    </span>
                  </div>
                </div>
                <div class="position-status">
                  <span v-if="isPositionComplete(positionIndex)" class="status-badge complete">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                    Complete
                  </span>
                  <span v-else class="status-badge pending">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Pending
                  </span>
                </div>
              </div>

              <p v-if="position.description" class="position-description">{{ position.description }}</p>

              <!-- Candidates Grid -->
              <div class="candidates-grid">
                <div 
                  v-for="(candidate, candidateIndex) in position.candidates" 
                  :key="candidateIndex"
                  :class="[
                    'candidate-card',
                    { 
                      'selected': isSelected(positionIndex, candidateIndex),
                      'disabled': !canSelectCandidate(positionIndex, candidateIndex)
                    }
                  ]"
                  @click="toggleSelection(positionIndex, candidateIndex)"
                >
                  <div class="candidate-content">
                    <div class="candidate-header">
                      <div class="candidate-info">
                        <h3 class="candidate-name">{{ candidate.name }}</h3>
                        <p v-if="candidate.party" class="candidate-party">{{ candidate.party }}</p>
                      </div>
                      <div class="selection-indicator">
                        <div class="checkbox">
                          <svg v-if="isSelected(positionIndex, candidateIndex)" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p v-if="candidate.bio" class="candidate-bio">{{ candidate.bio }}</p>
                  </div>
                </div>
              </div>

              <!-- Abstain Option -->
              <div class="abstain-section">
                <div 
                  :class="[
                    'abstain-option',
                    { 'selected': isAbstaining(positionIndex) }
                  ]"
                  @click="toggleAbstain(positionIndex)"
                >
                  <div class="abstain-content">
                    <div class="abstain-header">
                      <div class="abstain-info">
                        <h4 class="abstain-title">Abstain from this position</h4>
                        <p class="abstain-description">Choose not to vote for this position</p>
                      </div>
                      <div class="selection-indicator">
                        <div class="checkbox">
                          <svg v-if="isAbstaining(positionIndex)" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ballot Review and Submit -->
          <div v-if="showBallotReview" class="ballot-review glass-container animate-scale">
            <div class="review-header">
              <h2 class="review-title">Review Your Ballot</h2>
              <p class="review-description">Please review your selections before submitting your vote</p>
            </div>

            <div class="ballot-summary">
              <div v-for="(position, index) in election.positions" :key="index" class="ballot-position">
                <div class="ballot-position-header">
                  <h3 class="ballot-position-title">{{ position.title }}</h3>
                  <span class="selection-count">
                    {{ userSelections[index]?.length || 0 }} of {{ position.maxSelections }} selected
                  </span>
                </div>
                
                <div v-if="userSelections[index] && userSelections[index].length > 0" class="ballot-selections">
                  <div v-for="candidateIndex in userSelections[index]" :key="candidateIndex" class="ballot-candidate">
                    <span class="candidate-name">{{ position.candidates[candidateIndex].name }}</span>
                    <span v-if="position.candidates[candidateIndex].party" class="candidate-party">
                      ({{ position.candidates[candidateIndex].party }})
                    </span>
                  </div>
                </div>
                <div v-else class="ballot-abstain">
                  <span class="abstain-text">Abstained</span>
                </div>
              </div>
            </div>

            <div class="review-actions">
              <button @click="showBallotReview = false" class="btn btn-outline">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Continue Voting
              </button>
              <button @click="submitVote" class="btn btn-primary btn-lg btn-hover-lift" :disabled="submittingVote">
                <span v-if="submittingVote" class="loading-spinner loading-spinner-sm"></span>
                <svg v-else width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ submittingVote ? 'Submitting Vote...' : 'Submit Vote' }}
              </button>
            </div>
          </div>

          <!-- Voting Controls -->
          <div v-else class="voting-controls glass-container">
            <div class="controls-content">
              <div class="progress-summary">
                <span class="summary-text">{{ completedPositions }} of {{ totalPositions }} positions completed</span>
              </div>
              <div class="control-buttons">
                <router-link to="/elections" class="btn btn-ghost">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Cancel
                </router-link>
                <button 
                  @click="showBallotReview = true" 
                  class="btn btn-primary btn-lg btn-hover-lift"
                  :disabled="!canSubmitVote"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
                  </svg>
                  Review Ballot
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useElectionStore } from '../stores/election'

const route = useRoute()
const router = useRouter()
const electionStore = useElectionStore()

// Reactive state
const loading = ref(false)
const error = ref(null)
const submitting = ref(false)
const voteSubmitted = ref(false)
const election = ref(null)
const userSelections = ref([]) // Array of arrays: [positionIndex][candidateIndices]
const abstainedPositions = ref(new Set()) // Set of position indices where user abstained

// Demo election data for testing
const demoElection = {
  _id: 'demo',
  title: 'Student Union Elections 2025',
  organization: 'University of California',
  description: 'Annual student body leadership elections',
  deadline: '2025-07-01T23:59:59.000Z',
  allowAbstain: true,
  requireAllPositions: false,
  resultsVisible: true,
  positions: [
    {
      title: 'President',
      description: 'Lead the student union and represent student interests',
      maxSelections: 1,
      candidates: [
        {
          name: 'Alice Johnson',
          party: 'Reform Party',
          description: 'Experienced leader focused on student services and campus improvements',
          qualifications: 'Former VP, 3.8 GPA, Dean\'s List, Student Council 3 years',
          imageUrl: 'https://via.placeholder.com/150/059669/FFFFFF?text=AJ'
        },
        {
          name: 'Bob Smith',
          party: 'Student First',
          description: 'Advocate for affordable education and mental health resources',
          qualifications: 'Class President, Honor Society, Volunteer Coordinator',
          imageUrl: 'https://via.placeholder.com/150/dc2626/FFFFFF?text=BS'
        },
        {
          name: 'Carol Davis',
          party: 'Independent',
          description: 'Focus on sustainability and campus diversity initiatives',
          qualifications: 'Environmental Club President, 4.0 GPA, Research Assistant',
          imageUrl: 'https://via.placeholder.com/150/7c3aed/FFFFFF?text=CD'
        }
      ]
    },
    {
      title: 'Board Members',
      description: 'Oversee student union operations and budget',
      maxSelections: 3,
      candidates: [
        {
          name: 'David Wilson',
          party: 'Reform Party',
          description: 'Finance expert with business administration background',
          qualifications: 'Finance major, Treasurer of Economics Club',
          imageUrl: 'https://via.placeholder.com/150/059669/FFFFFF?text=DW'
        },
        {
          name: 'Eva Martinez',
          party: 'Student First',
          description: 'Communications specialist and event organizer',
          qualifications: 'Communications major, Event Committee Chair',
          imageUrl: 'https://via.placeholder.com/150/dc2626/FFFFFF?text=EM'
        },
        {
          name: 'Frank Brown',
          party: 'Independent',
          description: 'Technology advocate for digital student services',
          qualifications: 'Computer Science major, IT Support Team',
          imageUrl: 'https://via.placeholder.com/150/f59e0b/FFFFFF?text=FB'
        },
        {
          name: 'Grace Lee',
          party: 'Reform Party',
          description: 'Social justice advocate and community organizer',
          qualifications: 'Political Science major, Debate Team Captain',
          imageUrl: 'https://via.placeholder.com/150/059669/FFFFFF?text=GL'
        },
        {
          name: 'Henry Chen',
          party: 'Student First',
          description: 'International student representative',
          qualifications: 'International Business major, Cultural Exchange Coordinator',
          imageUrl: 'https://via.placeholder.com/150/dc2626/FFFFFF?text=HC'
        }
      ]
    }
  ]
}

// Computed properties
const totalPositions = computed(() => election.value?.positions?.length || 0)

const completedPositions = computed(() => {
  if (!election.value?.positions) return 0
  return election.value.positions.reduce((count, position, index) => {
    return count + (getPositionSelectionCount(index) > 0 || isAbstained(index) ? 1 : 0)
  }, 0)
})

const votingProgress = computed(() => {
  if (totalPositions.value === 0) return 0
  return Math.round((completedPositions.value / totalPositions.value) * 100)
})

const canSubmitVote = computed(() => {
  if (!election.value?.positions) return false
  
  // If abstaining is allowed, user can submit with any combination
  if (election.value.allowAbstain) {
    return true
  }
  
  // If requiring all positions, check that all have selections
  if (election.value.requireAllPositions) {
    return election.value.positions.every((_, index) => 
      getPositionSelectionCount(index) > 0 || isAbstained(index)
    )
  }
  
  // Otherwise, at least one position must have a selection
  return election.value.positions.some((_, index) => 
    getPositionSelectionCount(index) > 0
  )
})

// Methods
const initializeSelections = () => {
  if (!election.value?.positions) return
  
  userSelections.value = election.value.positions.map(() => [])
  abstainedPositions.value = new Set()
}

const isSelected = (positionIndex, candidateIndex) => {
  return userSelections.value[positionIndex]?.includes(candidateIndex) || false
}

const isAbstained = (positionIndex) => {
  return abstainedPositions.value.has(positionIndex)
}

const canSelectCandidate = (positionIndex, candidateIndex) => {
  if (isAbstained(positionIndex)) return false
  
  const position = election.value.positions[positionIndex]
  const currentSelections = userSelections.value[positionIndex] || []
  
  // If already selected, can always deselect
  if (currentSelections.includes(candidateIndex)) return true
  
  // Check if we've reached the maximum selections
  return currentSelections.length < position.maxSelections
}

const toggleCandidate = (positionIndex, candidateIndex) => {
  if (!canSelectCandidate(positionIndex, candidateIndex) && !isSelected(positionIndex, candidateIndex)) {
    return
  }
  
  // Clear abstain if selecting a candidate
  if (abstainedPositions.value.has(positionIndex)) {
    abstainedPositions.value.delete(positionIndex)
  }
  
  const currentSelections = userSelections.value[positionIndex] || []
  const position = election.value.positions[positionIndex]
  
  if (currentSelections.includes(candidateIndex)) {
    // Deselect
    userSelections.value[positionIndex] = currentSelections.filter(
      index => index !== candidateIndex
    )
  } else {
    // Select
    if (position.maxSelections === 1) {
      // Single selection - replace current selection
      userSelections.value[positionIndex] = [candidateIndex]
    } else {
      // Multiple selection - add to current selections
      userSelections.value[positionIndex] = [...currentSelections, candidateIndex]
    }
  }
}

const abstainFromPosition = (positionIndex) => {
  if (abstainedPositions.value.has(positionIndex)) {
    // Remove abstain
    abstainedPositions.value.delete(positionIndex)
  } else {
    // Add abstain and clear selections
    abstainedPositions.value.add(positionIndex)
    userSelections.value[positionIndex] = []
  }
}

const getPositionSelectionCount = (positionIndex) => {
  return userSelections.value[positionIndex]?.length || 0
}

const resetBallot = () => {
  initializeSelections()
}

const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const handleImageError = (event) => {
  // Hide broken image and show placeholder
  event.target.style.display = 'none'
  const placeholder = event.target.nextElementSibling
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

const submitVote = async () => {
  if (!canSubmitVote.value || submitting.value) return
  
  submitting.value = true
  error.value = null
  
  try {
    // Prepare vote data
    const voteData = {
      electionId: route.params.id,
      votes: election.value.positions.map((position, positionIndex) => ({
        positionIndex,
        positionTitle: position.title,
        candidateIndices: userSelections.value[positionIndex] || [],
        abstained: isAbstained(positionIndex),
        candidates: (userSelections.value[positionIndex] || []).map(candidateIndex => ({
          name: position.candidates[candidateIndex].name,
          party: position.candidates[candidateIndex].party
        }))
      }))
    }
    
    console.log('Submitting vote:', voteData)
    
    // For demo purposes, simulate API call
    if (route.params.id === 'demo') {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate network delay
      console.log('Demo vote submitted successfully')
    } else {
      // Real API call
      await electionStore.submitVote(route.params.id, voteData)
    }
    
    voteSubmitted.value = true
    
  } catch (err) {
    console.error('Failed to submit vote:', err)
    error.value = err.message || 'Failed to submit vote. Please try again.'
  } finally {
    submitting.value = false
  }
}

const loadElection = async () => {
  const electionId = route.params.id
  
  if (!electionId) {
    error.value = 'No election ID provided'
    return
  }
  
  // Use demo data for demo election
  if (electionId === 'demo') {
    election.value = demoElection
    initializeSelections()
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    const data = await electionStore.fetchElection(electionId)
    election.value = data
    initializeSelections()
  } catch (err) {
    console.error('Failed to load election:', err)
    error.value = err.message || 'Failed to load election'
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadElection()
})
</script>

<style scoped>
/* CSS Variables for theming */
:root {
  --primary-color: #059669;
  --primary-hover: #047857;
  --secondary-color: #6b7280;
  --success-color: #10b981;
  --error-color: #dc2626;
  --warning-color: #f59e0b;
  --background-color: #f9fafb;
  --card-background: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --border-radius: 0.75rem;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.vote-page {
  min-height: 100vh;
  background-color: var(--background-color);
  padding: 1rem;
  box-sizing: border-box;
}

.vote-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-spinner.small {
  width: 1rem;
  height: 1rem;
  border-width: 2px;
  margin: 0 0.5rem 0 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error and Success States */
.error-state,
.success-state,
.no-election {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.error-card,
.success-card,
.no-election-card {
  text-align: center;
  padding: 3rem;
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  max-width: 500px;
  width: 100%;
}

.error-icon,
.success-icon,
.no-election-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
}

.error-icon {
  color: var(--error-color);
}

.success-icon {
  color: var(--success-color);
}

.no-election-icon {
  color: var(--text-secondary);
}

/* Election Header */
.election-header {
  background: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.election-info h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.organization {
  font-size: 1.1rem;
  color: var(--primary-color);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.election-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.election-meta .icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.voting-progress {
  margin-top: 1.5rem;
}

.progress-bar {
  height: 0.5rem;
  background-color: var(--border-color);
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Voting Form */
.voting-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Position Cards */
.position-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.position-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.position-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.position-description {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.selection-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
}

.selection-limit {
  color: var(--primary-color);
  font-weight: 600;
}

.abstain-option {
  color: var(--text-secondary);
}

/* Candidates Grid */
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  padding: 2rem;
}

.candidate-card {
  position: relative;
  background: #fafafa;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.candidate-card:hover:not(.disabled) {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.candidate-card.selected {
  border-color: var(--primary-color);
  background: #f0fdf4;
  box-shadow: var(--shadow-lg);
}

.candidate-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.candidate-photo {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.candidate-photo img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border-color);
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.photo-placeholder svg {
  width: 2rem;
  height: 2rem;
}

.selection-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 1.5rem;
  height: 1.5rem;
}

.radio-indicator {
  width: 100%;
  height: 100%;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  position: relative;
  background: white;
}

.candidate-card.selected .radio-indicator {
  border-color: var(--primary-color);
}

.radio-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--primary-color);
  opacity: 0;
  transition: opacity 0.2s;
}

.candidate-card.selected .radio-dot {
  opacity: 1;
}

.checkbox-indicator {
  width: 100%;
  height: 100%;
  border: 2px solid var(--border-color);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.2s;
}

.candidate-card.selected .checkbox-indicator {
  border-color: var(--primary-color);
  background: var(--primary-color);
}

.checkmark {
  width: 1rem;
  height: 1rem;
  color: white;
}

.candidate-info {
  text-align: center;
}

.candidate-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.candidate-party {
  font-size: 0.875rem;
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.candidate-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.candidate-qualifications {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: left;
}

.candidate-qualifications strong {
  color: var(--text-primary);
}

/* Abstain Section */
.abstain-section {
  padding: 1rem 2rem;
  border-top: 1px solid var(--border-color);
  background: #fafafa;
}

.abstain-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.abstain-option input[type="checkbox"] {
  margin: 0;
}

/* Position Summary */
.position-summary {
  padding: 1rem 2rem;
  background: #f8fafc;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.selections-made {
  color: var(--primary-color);
}

.abstained {
  color: var(--warning-color);
}

.no-selection {
  color: var(--text-secondary);
}

/* Vote Submission */
.vote-submission {
  background: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.submission-summary h3 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.ballot-summary {
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.875rem;
}

.summary-row:last-child {
  border-bottom: none;
}

.position-name {
  font-weight: 600;
  color: var(--text-primary);
}

.selection-count {
  color: var(--text-secondary);
}

.submission-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.validation-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

/* Vote Success */
.vote-summary {
  margin: 2rem 0;
  text-align: left;
}

.vote-summary h3 {
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.selection-summary {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}

.selection-summary strong {
  color: var(--text-primary);
  display: block;
  margin-bottom: 0.25rem;
}

.selected-candidate {
  display: block;
  color: var(--text-secondary);
  margin-left: 1rem;
}

.party {
  color: var(--primary-color);
}

.abstain {
  color: var(--warning-color);
  font-style: italic;
  margin-left: 1rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  box-sizing: border-box;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-outline {
  border-color: var(--border-color);
  color: var(--text-primary);
  background: white;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  border-color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .vote-page {
    padding: 0.5rem;
  }
  
  .election-header,
  .position-card,
  .vote-submission {
    padding: 1.5rem;
  }
  
  .candidates-grid {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    gap: 1rem;
  }
  
  .candidate-card {
    padding: 1rem;
  }
  
  .election-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .submission-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .position-header h2 {
    font-size: 1.25rem;
  }
  
  .election-info h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .error-card,
  .success-card,
  .no-election-card {
    padding: 2rem;
  }
  
  .candidate-photo {
    width: 60px;
    height: 60px;
  }
  
  .candidate-name {
    font-size: 1rem;
  }
  
  .candidate-description,
  .candidate-qualifications {
    font-size: 0.8rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --background-color: #111827;
    --card-background: #1f2937;
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --border-color: #374151;
  }
  
  .candidate-card {
    background: #1f2937;
  }
  
  .candidate-card.selected {
    background: #064e3b;
  }
  
  .abstain-section {
    background: #374151;
  }
  
  .position-summary {
    background: #374151;
  }
  
  .ballot-summary {
    background: #374151;
  }
  
  .validation-message {
    background: #451a03;
    color: #fbbf24;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .candidate-card {
    border-width: 3px;
  }
  
  .candidate-card.selected {
    border-width: 4px;
  }
  
  .btn {
    border-width: 2px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .candidate-card,
  .btn,
  .progress-fill,
  .loading-spinner {
    transition: none;
  }
  
  .loading-spinner {
    animation: none;
  }
  
  .candidate-card:hover:not(.disabled) {
    transform: none;
  }
}

/* Touch improvements */
@media (hover: none) and (pointer: coarse) {
  .candidate-card {
    padding: 1.5rem;
  }
  
  .btn {
    padding: 1rem 1.5rem;
    min-height: 48px;
  }
  
  .selection-indicator {
    width: 2rem;
    height: 2rem;
  }
}
</style>
