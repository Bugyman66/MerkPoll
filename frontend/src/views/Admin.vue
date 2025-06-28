<template>
  <div class="admin-page page-layout">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="floating-particles"></div>
      <div class="energy-grid"></div>
      <div class="holographic-rings"></div>
    </div>

    <div class="admin-container">
      <!-- Header -->
      <div class="glass-container header-container">
        <div class="header-content">
          <h1 class="page-title">
            Election <span class="title-glow">Administration</span>
          </h1>
          <p class="page-description">Create and manage secure, decentralized elections</p>
        </div>
        <div class="wallet-section">
          <button 
            v-if="!isWalletConnected" 
            @click="connectWallet" 
            class="btn btn-primary btn-futuristic"
            :disabled="authStore.loading"
          >
            <div class="btn-glow-border"></div>
            <span v-if="authStore.loading" class="loading-spinner loading-spinner-sm"></span>
            <span class="btn-text">{{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}</span>
          </button>
          <div v-else class="wallet-info">
            <div class="wallet-address">{{ truncatedAddress }}</div>
            <button @click="disconnectWallet" class="btn btn-outline btn-futuristic">
              <div class="btn-glow-border"></div>
              <span class="btn-text">Disconnect</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="!isWalletConnected" class="wallet-prompt">
        <div class="glass-container prompt-card">
          <div class="prompt-icon-container">
            <svg class="prompt-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 class="prompt-title">Connect Your Wallet</h2>
          <p class="prompt-description">To create and manage elections, please connect your Aptos wallet (e.g., Petra Wallet)</p>
          <button @click="connectWallet" class="btn btn-primary btn-lg btn-futuristic">
            <div class="btn-glow-border"></div>
            <span class="btn-text">Connect Wallet</span>
          </button>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div v-else class="admin-dashboard">
        <!-- Tabs -->
        <div class="glass-container tabs-container">
          <div class="tabs">
            <button 
              @click="activeTab = 'create'" 
              :class="['glass-tab', { active: activeTab === 'create' }]"
            >
              <div class="tab-glow-border"></div>
              <span class="tab-text">Create Election</span>
            </button>
            <button 
              @click="activeTab = 'manage'" 
              :class="['glass-tab', { active: activeTab === 'manage' }]"
            >
              <div class="tab-glow-border"></div>
              <span class="tab-text">Manage Elections</span>
            </button>
          </div>
        </div>

        <!-- Create Election Tab -->
        <div v-if="activeTab === 'create'" class="glass-container tab-content">
          <div class="create-election-form">
            <h2 class="form-title">Create New <span class="title-glow">Election</span></h2>
            
            <!-- Relayer Wallet Information -->
            <ElectionRelayerWallet />
            
            <!-- Step 1: Election Details -->
            <div class="glass-card form-section">
              <h3 class="section-title">Election Details</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Election Title</label>
                  <input 
                    v-model="electionForm.title" 
                    type="text" 
                    placeholder="e.g., Student Union Elections 2025"
                    class="glass-input"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Organization</label>
                  <input 
                    v-model="electionForm.organization" 
                    type="text" 
                    placeholder="e.g., University of California"
                    class="glass-input"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea 
                    v-model="electionForm.description" 
                    placeholder="Brief description of the election"
                    class="glass-textarea"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label">Start Date</label>
                  <input 
                    v-model="electionForm.startDate" 
                    type="datetime-local" 
                    class="glass-input"
                  />
                </div>
                <div class="form-group">
                  <label class="form-label">Voting Deadline</label>
                  <input 
                    v-model="electionForm.deadline" 
                    type="datetime-local" 
                    class="glass-input"
                  />
                </div>
              </div>
              
              <!-- Election Options -->
              <div class="form-options">
                <h4 class="options-title">Election Options</h4>
                <div class="checkbox-group">
                  <label class="glass-checkbox">
                    <input 
                      v-model="electionForm.allowAbstain" 
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    <span class="checkbox-text">Allow voters to abstain from positions</span>
                  </label>
                  <label class="glass-checkbox">
                    <input 
                      v-model="electionForm.requireAllPositions" 
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    <span class="checkbox-text">Require votes for all positions</span>
                  </label>
                  <label class="glass-checkbox">
                    <input 
                      v-model="electionForm.resultsVisible" 
                      type="checkbox"
                    />
                    <span class="checkmark"></span>
                    <span class="checkbox-text">Make results visible immediately</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 2: Positions and Candidates -->
            <div class="glass-card form-section">
              <div class="section-header">
                <h3 class="section-title">Positions & Candidates</h3>
                <button @click="addPosition" type="button" class="btn btn-outline btn-futuristic">
                  <div class="btn-glow-border"></div>
                  <span class="btn-text">+ Add Position</span>
                </button>
              </div>

              <div v-for="(position, posIndex) in electionForm.positions" :key="posIndex" class="glass-card position-card">
                <div class="position-header">
                  <h4 class="position-title">Position {{ posIndex + 1 }}</h4>
                  <button 
                    v-if="electionForm.positions.length > 1"
                    @click="removePosition(posIndex)" 
                    type="button" 
                    class="btn btn-danger btn-futuristic"
                  >
                    <div class="btn-glow-border"></div>
                    <span class="btn-text">Remove</span>
                  </button>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Position Title</label>
                    <input 
                      v-model="position.title" 
                      type="text" 
                      placeholder="e.g., President, Vice President, Secretary"
                      class="glass-input"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Position Description</label>
                    <textarea 
                      v-model="position.description" 
                      placeholder="Role responsibilities and requirements"
                      class="glass-textarea"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Maximum Selections</label>
                    <select v-model="position.maxSelections" class="glass-select">
                      <option value="1">1 (Single choice)</option>
                      <option value="2">2 (Up to 2 choices)</option>
                      <option value="3">3 (Up to 3 choices)</option>
                    </select>
                  </div>
                </div>

                <!-- Candidates for this position -->
                <div class="candidates-section">
                  <div class="candidates-header">
                    <h5 class="candidates-title">Candidates</h5>
                    <button 
                      @click="addCandidate(posIndex)" 
                      type="button" 
                      class="btn btn-outline btn-futuristic"
                    >
                      <div class="btn-glow-border"></div>
                      <span class="btn-text">+ Add Candidate</span>
                    </button>
                  </div>

                  <div v-for="(candidate, candIndex) in position.candidates" :key="candIndex" class="glass-card candidate-card">
                    <div class="candidate-header">
                      <span class="candidate-label">Candidate {{ candIndex + 1 }}</span>
                      <button 
                        v-if="position.candidates.length > 1"
                        @click="removeCandidate(posIndex, candIndex)" 
                        type="button" 
                        class="btn btn-danger btn-sm btn-futuristic"
                      >
                        <div class="btn-glow-border"></div>
                        <span class="btn-text">Remove</span>
                      </button>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label class="form-label">Name</label>
                        <input 
                          v-model="candidate.name" 
                          type="text" 
                          placeholder="Full name"
                          class="glass-input"
                        />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Party/Affiliation</label>
                        <input 
                          v-model="candidate.party" 
                          type="text" 
                          placeholder="Political party or group (optional)"
                          class="glass-input"
                        />
                      </div>
                      <div class="form-group">
                        <label class="form-label">Description</label>
                        <textarea 
                          v-model="candidate.description" 
                          placeholder="Brief background and platform"
                          class="glass-textarea"
                        ></textarea>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Qualifications</label>
                        <textarea 
                          v-model="candidate.qualifications" 
                          placeholder="Education, experience, achievements"
                          class="glass-textarea"
                        ></textarea>
                      </div>
                      <div class="form-group">
                        <label class="form-label">Image URL (optional)</label>
                        <input 
                          v-model="candidate.imageUrl" 
                          type="url" 
                          placeholder="https://example.com/candidate-photo.jpg"
                          class="glass-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Step 3: Voter List -->
            <div class="glass-card form-section">
              <h3 class="section-title">Eligible Voters</h3>
              <div class="upload-section">
                <div class="glass-upload-area" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept=".csv,.json" 
                    @change="handleFileUpload"
                    style="display: none"
                  />
                  <div class="upload-content">
                    <div class="upload-icon-container">
                      <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                    </div>
                    <p v-if="!voterFile" class="upload-text">
                      <strong>Click to upload</strong> or drag and drop<br>
                      CSV or JSON file with voter emails
                    </p>
                    <p v-else class="file-info">
                      {{ voterFile.name }} ({{ voterEmails.length }} emails)
                    </p>
                  </div>
                  <button @click="$refs.fileInput.click()" class="btn btn-outline btn-futuristic">
                    <div class="btn-glow-border"></div>
                    <span class="btn-text">Choose File</span>
                  </button>
                </div>
                
                <!-- Voter Preview -->
                <div v-if="voterEmails.length > 0" class="glass-card voter-preview">
                  <h4 class="preview-title">Voter List Preview ({{ voterEmails.length }} voters)</h4>
                  <div class="email-list">
                    <div v-for="email in voterEmails.slice(0, 10)" :key="email" class="email-item">
                      {{ email }}
                    </div>
                    <div v-if="voterEmails.length > 10" class="more-emails">
                      ... and {{ voterEmails.length - 10 }} more
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Create Button -->
            <div class="form-actions">
              <button 
                @click="createElection" 
                :disabled="!canCreateElection || creatingElection"
                class="btn btn-primary btn-xl btn-futuristic"
              >
                <div class="btn-glow-border"></div>
                <span v-if="creatingElection" class="loading-spinner loading-spinner-sm"></span>
                <span class="btn-text">{{ creatingElection ? 'Creating Election...' : 'Create Election' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Manage Elections Tab -->
        <div v-if="activeTab === 'manage'" class="glass-container tab-content">
          <div class="elections-list">
            <h2 class="list-title">Your <span class="title-glow">Elections</span></h2>
            <div v-if="elections.length === 0" class="glass-card empty-state">
              <div class="empty-icon-container">
                <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
              </div>
              <p class="empty-text">No elections created yet. Create your first election to get started!</p>
            </div>
            <div v-else class="elections-grid">
              <div v-for="election in elections" :key="election.id" class="glass-card election-card">
                <div class="election-glow-border"></div>
                <h3 class="election-name">{{ election.name }}</h3>
                <p class="election-description">{{ election.description }}</p>
                <div class="election-meta">
                  <span class="meta-item">Deadline: {{ formatDate(election.deadline) }}</span>
                  <span class="meta-item">Voters: {{ election.voterCount }}</span>
                  <span :class="['status', election.status]">{{ election.status }}</span>
                </div>
                <div class="election-actions">
                  <button class="btn btn-outline btn-futuristic">
                    <div class="btn-glow-border"></div>
                    <span class="btn-text">View Results</span>
                  </button>
                  <button class="btn btn-primary btn-futuristic">
                    <div class="btn-glow-border"></div>
                    <span class="btn-text">Manage</span>
                  </button>
                </div>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
import '../styles/admin.css'
import ElectionRelayerWallet from '../components/ElectionRelayerWallet.vue'

const router = useRouter()
const authStore = useAuthStore()

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// Reactive data
const activeTab = ref('create')
const creatingElection = ref(false)
const voterFile = ref(null)
const voterEmails = ref([])
const elections = ref([])

// Election form data
const electionForm = ref({
  title: '',
  description: '',
  organization: '',
  deadline: '',
  startDate: '',
  allowAbstain: true,
  requireAllPositions: false,
  resultsVisible: false,
  positions: [
    {
      title: '',
      description: '',
      maxSelections: 1,
      candidates: [
        { 
          name: '', 
          description: '', 
          party: '', 
          qualifications: '', 
          imageUrl: '' 
        }
      ]
    }
  ]
})

// Computed properties
const isWalletConnected = computed(() => authStore.isLoggedIn)
const walletAddress = computed(() => authStore.walletAddress)
const truncatedAddress = computed(() => authStore.truncatedAddress)

const canCreateElection = computed(() => {
  return electionForm.value.title && 
         electionForm.value.deadline && 
         electionForm.value.positions.length > 0 &&
         electionForm.value.positions.every(pos => 
           pos.title && pos.candidates.some(c => c.name)
         ) &&
         voterEmails.value.length > 0
})

// Wallet functions
async function connectWallet() {
  try {
    await authStore.connectWallet()
    console.log('Wallet connected successfully')
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    alert('Failed to connect wallet. Please make sure Petra Wallet is installed and try again.')
  }
}

function disconnectWallet() {
  authStore.disconnectWallet()
}

// Position management
function addPosition() {
  electionForm.value.positions.push({
    title: '',
    description: '',
    maxSelections: 1,
    candidates: [
      { 
        name: '', 
        description: '', 
        party: '', 
        qualifications: '', 
        imageUrl: '' 
      }
    ]
  })
}

function removePosition(index) {
  if (electionForm.value.positions.length > 1) {
    electionForm.value.positions.splice(index, 1)
  }
}

// Candidate management
function addCandidate(positionIndex) {
  electionForm.value.positions[positionIndex].candidates.push({
    name: '', 
    description: '', 
    party: '', 
    qualifications: '', 
    imageUrl: ''
  })
}

function removeCandidate(positionIndex, candidateIndex) {
  const position = electionForm.value.positions[positionIndex]
  if (position.candidates.length > 1) {
    position.candidates.splice(candidateIndex, 1)
  }
}

// File upload functions
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    processVoterFile(file)
  }
}

function handleFileDrop(event) {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    processVoterFile(file)
  }
}

async function processVoterFile(file) {
  voterFile.value = file
  const text = await file.text()
  
  try {
    let emails = []
    
    if (file.name.endsWith('.csv')) {
      // Parse CSV
      const lines = text.split('\n')
      emails = lines
        .map(line => line.trim())
        .filter(line => line && isValidEmail(line))
    } else if (file.name.endsWith('.json')) {
      // Parse JSON
      const data = JSON.parse(text)
      emails = Array.isArray(data) ? data.filter(isValidEmail) : []
    }
    
    voterEmails.value = [...new Set(emails)] // Remove duplicates
    console.log(`Loaded ${voterEmails.value.length} unique voter emails`)
  } catch (error) {
    console.error('Error processing file:', error)
    alert('Error processing file. Please check the format.')
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Election creation
async function createElection() {
  if (!canCreateElection.value) return
  
  creatingElection.value = true
  
  try {
    // Prepare election data
    const electionData = {
      title: electionForm.value.title,
      description: electionForm.value.description,
      organization: electionForm.value.organization,
      deadline: new Date(electionForm.value.deadline).toISOString(),
      startDate: electionForm.value.startDate ? 
        new Date(electionForm.value.startDate).toISOString() : 
        new Date().toISOString(),
      allowAbstain: electionForm.value.allowAbstain,
      requireAllPositions: electionForm.value.requireAllPositions,
      resultsVisible: electionForm.value.resultsVisible,
      positions: electionForm.value.positions.map(position => ({
        title: position.title,
        description: position.description,
        maxSelections: position.maxSelections,
        candidates: position.candidates.filter(c => c.name).map(candidate => ({
          name: candidate.name,
          description: candidate.description,
          party: candidate.party,
          qualifications: candidate.qualifications,
          imageUrl: candidate.imageUrl
        }))
      })).filter(pos => pos.candidates.length > 0),
      voterEmails: voterEmails.value
    }
    
    // Create election via API
    const response = await axios.post(`${API_BASE}/api/admin/elections`, electionData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    
    console.log('Election created:', response.data)
    
    // Reset form
    electionForm.value = {
      title: '',
      description: '',
      organization: '',
      deadline: '',
      startDate: '',
      allowAbstain: true,
      requireAllPositions: false,
      resultsVisible: false,
      positions: [
        {
          title: '',
          description: '',
          maxSelections: 1,
          candidates: [
            { 
              name: '', 
              description: '', 
              party: '', 
              qualifications: '', 
              imageUrl: '' 
            }
          ]
        }
      ]
    }
    voterEmails.value = []
    voterFile.value = null
    
    // Switch to manage tab
    activeTab.value = 'manage'
    await loadElections()
    
    alert('Election created successfully!')
    
  } catch (error) {
    console.error('Error creating election:', error)
    alert('Failed to create election. Please try again.')
  } finally {
    creatingElection.value = false
  }
}

// Load elections
async function loadElections() {
  try {
    const response = await axios.get(`${API_BASE}/api/admin/elections`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    elections.value = response.data
  } catch (error) {
    console.error('Error loading elections:', error)
  }
}

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
  // Auth store initialization is already handled in App.vue
  if (authStore.isLoggedIn) {
    await loadElections()
  }
})
</script>

<style scoped>
/* All styles are imported from ../styles/admin.css */
</style>
