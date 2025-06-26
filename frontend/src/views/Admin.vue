<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- Header -->
      <div class="glass-container header-container">
        <div class="header-content">
          <h1 class="page-title">Election Administration</h1>
          <p class="page-description">Create and manage secure, decentralized elections</p>
        </div>
        <div class="wallet-section">
          <button 
            v-if="!isWalletConnected" 
            @click="connectWallet" 
            class="glass-btn primary"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}
          </button>
          <div v-else class="wallet-info">
            <div class="wallet-address">{{ truncatedAddress }}</div>
            <button @click="disconnectWallet" class="glass-btn outline">
              Disconnect
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="!isWalletConnected" class="wallet-prompt">
        <div class="glass-container prompt-card">
          <svg class="prompt-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
          </svg>
          <h2>Connect Your Wallet</h2>
          <p>To create and manage elections, please connect your Aptos wallet (e.g., Petra Wallet)</p>
          <button @click="connectWallet" class="glass-btn primary large">
            Connect Wallet
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
              Create Election
            </button>
            <button 
              @click="activeTab = 'manage'" 
              :class="['glass-tab', { active: activeTab === 'manage' }]"
            >
              Manage Elections
            </button>
          </div>
        </div>

        <!-- Create Election Tab -->
        <div v-if="activeTab === 'create'" class="glass-container tab-content">
          <div class="create-election-form">
            <h2>Create New Election</h2>
            
            <!-- Step 1: Election Details -->
            <div class="glass-card form-section">
              <h3>Election Details</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Election Title</label>
                  <input 
                    v-model="electionForm.title" 
                    type="text" 
                    placeholder="e.g., Student Union Elections 2025"
                    class="glass-input"
                  />
                </div>
                <div class="form-group">
                  <label>Organization</label>
                  <input 
                    v-model="electionForm.organization" 
                    type="text" 
                    placeholder="e.g., University of California"
                    class="glass-input"
                  />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea 
                    v-model="electionForm.description" 
                    placeholder="Brief description of the election"
                    class="glass-textarea"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Start Date</label>
                  <input 
                    v-model="electionForm.startDate" 
                    type="datetime-local" 
                    class="glass-input"
                  />
                </div>
                <div class="form-group">
                  <label>Voting Deadline</label>
                  <input 
                    v-model="electionForm.deadline" 
                    type="datetime-local" 
                    class="glass-input"
                  />
                </div>
              </div>
              
              <!-- Election Options -->
              <div class="form-options">
                <h4>Election Options</h4>
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
                <h3>Positions & Candidates</h3>
                <button @click="addPosition" type="button" class="glass-btn outline">
                  + Add Position
                </button>
              </div>

              <div v-for="(position, posIndex) in electionForm.positions" :key="posIndex" class="glass-card position-card">
                <div class="position-header">
                  <h4>Position {{ posIndex + 1 }}</h4>
                  <button 
                    v-if="electionForm.positions.length > 1"
                    @click="removePosition(posIndex)" 
                    type="button" 
                    class="glass-btn danger"
                  >
                    Remove
                  </button>
                </div>

                <div class="form-grid">
                  <div class="form-group">
                    <label>Position Title</label>
                    <input 
                      v-model="position.title" 
                      type="text" 
                      placeholder="e.g., President, Vice President, Secretary"
                      class="glass-input"
                    />
                  </div>
                  <div class="form-group">
                    <label>Position Description</label>
                    <textarea 
                      v-model="position.description" 
                      placeholder="Role responsibilities and requirements"
                      class="glass-textarea"
                    ></textarea>
                  </div>
                  <div class="form-group">
                    <label>Maximum Selections</label>
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
                    <h5>Candidates</h5>
                    <button 
                      @click="addCandidate(posIndex)" 
                      type="button" 
                      class="glass-btn outline"
                    >
                      + Add Candidate
                    </button>
                  </div>

                  <div v-for="(candidate, candIndex) in position.candidates" :key="candIndex" class="glass-card candidate-card">
                    <div class="candidate-header">
                      <span>Candidate {{ candIndex + 1 }}</span>
                      <button 
                        v-if="position.candidates.length > 1"
                        @click="removeCandidate(posIndex, candIndex)" 
                        type="button" 
                        class="glass-btn danger small"
                      >
                        Remove
                      </button>
                    </div>

                    <div class="form-grid">
                      <div class="form-group">
                        <label>Name</label>
                        <input 
                          v-model="candidate.name" 
                          type="text" 
                          placeholder="Full name"
                          class="glass-input"
                        />
                      </div>
                      <div class="form-group">
                        <label>Party/Affiliation</label>
                        <input 
                          v-model="candidate.party" 
                          type="text" 
                          placeholder="Political party or group (optional)"
                          class="glass-input"
                        />
                      </div>
                      <div class="form-group">
                        <label>Description</label>
                        <textarea 
                          v-model="candidate.description" 
                          placeholder="Brief background and platform"
                          class="glass-textarea"
                        ></textarea>
                      </div>
                      <div class="form-group">
                        <label>Qualifications</label>
                        <textarea 
                          v-model="candidate.qualifications" 
                          placeholder="Education, experience, achievements"
                          class="glass-textarea"
                        ></textarea>
                      </div>
                      <div class="form-group">
                        <label>Image URL (optional)</label>
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
              <h3>Eligible Voters</h3>
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
                    <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    <p v-if="!voterFile" class="upload-text">
                      <strong>Click to upload</strong> or drag and drop<br>
                      CSV or JSON file with voter emails
                    </p>
                    <p v-else class="file-info">
                      {{ voterFile.name }} ({{ voterEmails.length }} emails)
                    </p>
                  </div>
                  <button @click="$refs.fileInput.click()" class="glass-btn outline">
                    Choose File
                  </button>
                </div>
                
                <!-- Voter Preview -->
                <div v-if="voterEmails.length > 0" class="glass-card voter-preview">
                  <h4>Voter List Preview ({{ voterEmails.length }} voters)</h4>
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
                class="glass-btn primary large"
              >
                {{ creatingElection ? 'Creating Election...' : 'Create Election' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Manage Elections Tab -->
        <div v-if="activeTab === 'manage'" class="glass-container tab-content">
          <div class="elections-list">
            <h2>Your Elections</h2>
            <div v-if="elections.length === 0" class="glass-card empty-state">
              <p>No elections created yet. Create your first election to get started!</p>
            </div>
            <div v-else class="elections-grid">
              <div v-for="election in elections" :key="election.id" class="glass-card election-card">
                <h3>{{ election.name }}</h3>
                <p>{{ election.description }}</p>
                <div class="election-meta">
                  <span>Deadline: {{ formatDate(election.deadline) }}</span>
                  <span>Voters: {{ election.voterCount }}</span>
                  <span :class="['status', election.status]">{{ election.status }}</span>
                </div>
                <div class="election-actions">
                  <button class="glass-btn outline">View Results</button>
                  <button class="glass-btn primary">Manage</button>
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
.admin-page {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header */
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.header-content p {
  margin: 0;
  opacity: 0.8;
}

.wallet-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.wallet-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.wallet-address {
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  opacity: 0.9;
}

/* Wallet Prompt */
.wallet-prompt {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.prompt-card {
  text-align: center;
  max-width: 28rem;
  padding: 3rem;
}

.prompt-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem auto;
  opacity: 0.7;
}

.prompt-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.prompt-card p {
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Tabs */
.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem 1rem 0 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: none;
  backdrop-filter: blur(20px);
}

.tab {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 1rem 1rem 0 0;
  opacity: 0.7;
}

.tab:hover {
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.05);
}

.tab.active {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 2px solid white;
}

.tab-content {
  border-radius: 0 0 1rem 1rem;
  padding: 2rem;
}

/* Forms */
.create-election-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.form-section h4 {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.glass-input, .glass-textarea, .glass-select {
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.glass-input::placeholder,
.glass-textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.glass-input:focus,
.glass-textarea:focus,
.glass-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
}

.glass-textarea {
  resize: vertical;
  min-height: 4rem;
}

/* Position and Candidate Cards */
.position-card {
  margin-bottom: 1.5rem;
  padding: 1.5rem;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.position-header h4 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.candidates-section {
  margin-top: 1.5rem;
}

.candidates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.candidates-header h5 {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.9;
}

.candidate-card {
  margin-bottom: 1rem;
  padding: 1.25rem;
}

.candidate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-weight: 500;
  opacity: 0.8;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.form-options {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.glass-checkbox {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.glass-checkbox:hover {
  background: rgba(255, 255, 255, 0.05);
}

.glass-checkbox input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.3s ease;
}

.glass-checkbox input[type="checkbox"]:checked + .checkmark {
  background: white;
  border-color: white;
}

.glass-checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  border: solid black;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-text {
  font-size: 0.875rem;
  opacity: 0.9;
}

/* File Upload */
.upload-section {
  margin-top: 1rem;
}

.glass-upload-area {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
}

.glass-upload-area:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem auto;
  opacity: 0.7;
}

.upload-text {
  opacity: 0.8;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.file-info {
  color: white !important;
  font-weight: 500;
  opacity: 0.9;
}

.voter-preview {
  margin-top: 1.5rem;
  padding: 1.5rem;
}

.voter-preview h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.email-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.email-item {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  backdrop-filter: blur(10px);
}

.more-emails {
  padding: 0.5rem 0.75rem;
  opacity: 0.7;
  font-style: italic;
  font-size: 0.75rem;
}

/* Elections Grid */
.elections-list h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.elections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.election-card {
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.election-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.election-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.election-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  opacity: 0.8;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  margin-top: 0.5rem;
  width: fit-content;
}

.status.active {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.status.completed {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.election-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  opacity: 0.8;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-page {
    padding: 1rem 0.5rem;
  }

  .header-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    flex-direction: column;
  }

  .tab {
    border-radius: 0;
  }

  .tab.active {
    border-bottom: none;
    border-left: 3px solid white;
  }

  .elections-grid {
    grid-template-columns: 1fr;
  }

  .election-actions {
    flex-direction: column;
  }

  .position-header,
  .candidates-header,
  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .candidate-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .admin-container {
    gap: 1rem;
  }

  .header-container,
  .tab-content {
    padding: 1rem;
  }

  .form-section {
    margin-bottom: 1.5rem;
  }

  .position-card,
  .candidate-card {
    padding: 1rem;
  }
}
</style>
