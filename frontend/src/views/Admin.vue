<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Election Administration</h1>
          <p class="page-description">Create and manage secure, decentralized elections</p>
        </div>
        <div class="wallet-section">
          <button 
            v-if="!isWalletConnected" 
            @click="connectWallet" 
            class="btn btn-primary"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Connecting...' : 'Connect Wallet' }}
          </button>
          <div v-else class="wallet-info">
            <div class="wallet-address">{{ truncatedAddress }}</div>
            <button @click="disconnectWallet" class="btn btn-outline btn-sm">
              Disconnect
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div v-if="!isWalletConnected" class="wallet-prompt">
        <div class="prompt-card">
          <svg class="prompt-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 0h10a2 2 0 002-2v-3a2 2 0 00-2-2H9a2 2 0 00-2 2v3a2 2 0 002 2z"/>
          </svg>
          <h2>Connect Your Wallet</h2>
          <p>To create and manage elections, please connect your Aptos wallet (e.g., Petra Wallet)</p>
          <button @click="connectWallet" class="btn btn-primary btn-large">
            Connect Wallet
          </button>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div v-else class="admin-dashboard">
        <!-- Tabs -->
        <div class="tabs">
          <button 
            @click="activeTab = 'create'" 
            :class="['tab', { active: activeTab === 'create' }]"
          >
            Create Election
          </button>
          <button 
            @click="activeTab = 'manage'" 
            :class="['tab', { active: activeTab === 'manage' }]"
          >
            Manage Elections
          </button>
        </div>

        <!-- Create Election Tab -->
        <div v-if="activeTab === 'create'" class="tab-content">
          <div class="create-election-form">
            <h2>Create New Election</h2>
            
            <!-- Step 1: Election Details -->
            <div class="form-section">
              <h3>Election Details</h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Election Name</label>
                  <input 
                    v-model="electionForm.name" 
                    type="text" 
                    placeholder="e.g., Student Union President 2025"
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea 
                    v-model="electionForm.description" 
                    placeholder="Brief description of the election"
                    class="form-textarea"
                  ></textarea>
                </div>
                <div class="form-group">
                  <label>Voting Deadline</label>
                  <input 
                    v-model="electionForm.deadline" 
                    type="datetime-local" 
                    class="form-input"
                  />
                </div>
                <div class="form-group">
                  <label>Position/Office</label>
                  <input 
                    v-model="electionForm.position" 
                    type="text" 
                    placeholder="e.g., President, Secretary, etc."
                    class="form-input"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Candidates -->
            <div class="form-section">
              <h3>Candidates</h3>
              <div class="candidates-list">
                <div v-for="(candidate, index) in electionForm.candidates" :key="index" class="candidate-item">
                  <input 
                    v-model="candidate.name" 
                    type="text" 
                    placeholder="Candidate name"
                    class="form-input"
                  />
                  <input 
                    v-model="candidate.description" 
                    type="text" 
                    placeholder="Brief description (optional)"
                    class="form-input"
                  />
                  <button @click="removeCandidate(index)" class="btn btn-danger btn-sm">
                    Remove
                  </button>
                </div>
                <button @click="addCandidate" class="btn btn-outline">
                  + Add Candidate
                </button>
              </div>
            </div>

            <!-- Step 3: Voter List -->
            <div class="form-section">
              <h3>Eligible Voters</h3>
              <div class="upload-section">
                <div class="upload-area" @drop="handleFileDrop" @dragover.prevent @dragenter.prevent>
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
                    <p v-if="!voterFile">
                      <strong>Click to upload</strong> or drag and drop<br>
                      CSV or JSON file with voter emails
                    </p>
                    <p v-else class="file-info">
                      {{ voterFile.name }} ({{ voterEmails.length }} emails)
                    </p>
                  </div>
                  <button @click="$refs.fileInput.click()" class="btn btn-outline">
                    Choose File
                  </button>
                </div>
                
                <!-- Voter Preview -->
                <div v-if="voterEmails.length > 0" class="voter-preview">
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
                class="btn btn-primary btn-large"
              >
                {{ creatingElection ? 'Creating Election...' : 'Create Election' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Manage Elections Tab -->
        <div v-if="activeTab === 'manage'" class="tab-content">
          <div class="elections-list">
            <h2>Your Elections</h2>
            <div v-if="elections.length === 0" class="empty-state">
              <p>No elections created yet. Create your first election to get started!</p>
            </div>
            <div v-else class="elections-grid">
              <div v-for="election in elections" :key="election.id" class="election-card">
                <h3>{{ election.name }}</h3>
                <p>{{ election.description }}</p>
                <div class="election-meta">
                  <span>Deadline: {{ formatDate(election.deadline) }}</span>
                  <span>Voters: {{ election.voterCount }}</span>
                  <span :class="['status', election.status]">{{ election.status }}</span>
                </div>
                <div class="election-actions">
                  <button class="btn btn-outline btn-sm">View Results</button>
                  <button class="btn btn-primary btn-sm">Manage</button>
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

// Reactive data
const activeTab = ref('create')
const creatingElection = ref(false)
const voterFile = ref(null)
const voterEmails = ref([])
const elections = ref([])

// Election form data
const electionForm = ref({
  name: '',
  description: '',
  deadline: '',
  position: '',
  candidates: [
    { name: '', description: '' }
  ]
})

// Computed properties
const isWalletConnected = computed(() => authStore.isLoggedIn)
const walletAddress = computed(() => authStore.walletAddress)
const truncatedAddress = computed(() => authStore.truncatedAddress)

const canCreateElection = computed(() => {
  return electionForm.value.name && 
         electionForm.value.deadline && 
         electionForm.value.candidates.some(c => c.name) &&
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

// Candidate management
function addCandidate() {
  electionForm.value.candidates.push({ name: '', description: '' })
}

function removeCandidate(index) {
  if (electionForm.value.candidates.length > 1) {
    electionForm.value.candidates.splice(index, 1)
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
      name: electionForm.value.name,
      description: electionForm.value.description,
      deadline: new Date(electionForm.value.deadline).toISOString(),
      position: electionForm.value.position,
      candidates: electionForm.value.candidates.filter(c => c.name),
      voterEmails: voterEmails.value,
      adminWallet: authStore.walletAddress
    }
    
    // Create election via API
    const response = await axios.post('http://localhost:5000/api/admin/elections', electionData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    })
    
    console.log('Election created:', response.data)
    
    // Reset form
    electionForm.value = {
      name: '',
      description: '',
      deadline: '',
      position: '',
      candidates: [{ name: '', description: '' }]
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
    const response = await axios.get('http://localhost:5000/api/admin/elections', {
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
  background-color: #f9fafb;
  padding: 2rem 1rem;
}

.admin-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.header-content p {
  color: #6b7280;
  margin: 0;
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
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
}

.wallet-address {
  font-family: monospace;
  font-size: 0.875rem;
  color: #374151;
}

/* Wallet Prompt */
.wallet-prompt {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.prompt-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  text-align: center;
  max-width: 28rem;
}

.prompt-icon {
  width: 4rem;
  height: 4rem;
  color: #6b7280;
  margin: 0 auto 1rem auto;
}

.prompt-card h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.prompt-card p {
  color: #6b7280;
  margin-bottom: 2rem;
}

/* Tabs */
.tabs {
  display: flex;
  background: white;
  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid #e5e7eb;
}

.tab {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: #6b7280;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.tab:hover {
  color: #374151;
}

.tab.active {
  color: #059669;
  border-bottom: 2px solid #059669;
}

.tab-content {
  background: white;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Forms */
.create-election-form h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input, .form-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 4rem;
}

/* Candidates */
.candidates-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.candidate-item {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: center;
}

/* File Upload */
.upload-section {
  margin-top: 1rem;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: border-color 0.2s;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #059669;
}

.upload-icon {
  width: 3rem;
  height: 3rem;
  color: #6b7280;
  margin: 0 auto 1rem auto;
}

.upload-content p {
  color: #6b7280;
  margin-bottom: 1rem;
}

.file-info {
  color: #059669 !important;
  font-weight: 500;
}

.voter-preview {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.375rem;
}

.voter-preview h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
}

.email-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.email-item {
  padding: 0.25rem 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.more-emails {
  padding: 0.25rem 0.5rem;
  color: #6b7280;
  font-style: italic;
  font-size: 0.75rem;
}

/* Elections Grid */
.elections-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.election-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.election-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.election-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.election-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: #6b7280;
}

.status {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status.active {
  background: #d1fae5;
  color: #065f46;
}

.status.completed {
  background: #e5e7eb;
  color: #374151;
}

.election-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #059669;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #047857;
}

.btn-outline {
  border-color: #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background: #f9fafb;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .candidate-item {
    grid-template-columns: 1fr;
  }

  .elections-grid {
    grid-template-columns: 1fr;
  }
}
</style>
