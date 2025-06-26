<template>
  <div class="vote-page">
    <!-- Animated Background -->
    <div class="floating-elements">
      <div class="floating-element" v-for="n in 8" :key="n"></div>
    </div>
    
    <div class="vote-container">
      <!-- Loading State -->
      <div v-if="loading" class="glass-container loading-state">
        <div class="loading-content">
          <div class="loading-spinner-container">
            <div class="loading-spinner"></div>
            <div class="loading-pulse"></div>
          </div>
          <h3>Loading Election</h3>
          <p>Preparing your voting experience...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="glass-container error-card">
          <div class="error-icon-container">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
          </div>
          <h2>Oops! Something went wrong</h2>
          <p class="error-message">{{ error }}</p>
          <div class="error-actions">
            <router-link to="/elections" class="glass-btn primary">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Elections
            </router-link>
            <button @click="$router.go(0)" class="glass-btn outline">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Try Again
            </button>
          </div>
        </div>
      </div>

      <!-- Voting Interface -->
      <div v-else-if="election" class="voting-interface">
        <!-- Election Header -->
        <div class="glass-container election-header">
          <div class="election-badge">
            <svg class="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Live Election
          </div>
          <h1 class="election-title">{{ election.title }}</h1>
          <p class="election-description">{{ election.description }}</p>
          <div class="election-meta">
            <div v-if="election.organization" class="meta-item">
              <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              {{ election.organization }}
            </div>
            <div class="meta-item deadline">
              <svg class="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Ends: {{ formatDate(election.deadline) }}
            </div>
          </div>
        </div>

        <!-- Already Voted State -->
        <div v-if="election.hasVoted" class="already-voted">
          <div class="glass-container voted-card">
            <div class="success-animation">
              <div class="success-circle">
                <svg class="voted-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <h2>Vote Successfully Recorded!</h2>
            <p>Thank you for participating in this election. Your voice matters and has been securely recorded.</p>
            <div class="voted-actions">
              <button @click="showResults = !showResults" class="glass-btn primary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
                {{ showResults ? 'Hide Results' : 'View Results' }}
              </button>
              <router-link to="/elections" class="glass-btn outline">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                More Elections
              </router-link>
            </div>
          </div>
        </div>

        <!-- Voter Email Input -->
        <div v-else-if="!otpVerified" class="email-verification">
          <div class="glass-container verification-card">
            <div class="verification-header">
              <div class="verification-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h2>Verify Your Identity</h2>
              <p>Enter your registered email address to receive a secure verification code</p>
            </div>
            
            <div class="verification-steps">
              <div class="step-indicator">
                <div class="step active">1</div>
                <div class="step-line"></div>
                <div class="step" :class="{ active: otpSent }">2</div>
                <div class="step-line"></div>
                <div class="step" :class="{ active: otpVerified }">3</div>
              </div>
              <div class="step-labels">
                <span>Email</span>
                <span>Verify</span>
                <span>Vote</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg class="label-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                Email Address
              </label>
              <div class="input-group">
                <input
                  v-model="emailInput"
                  type="email"
                  placeholder="your.email@example.com"
                  class="glass-input"
                  :disabled="otpSent || otpLoading"
                />
                <button 
                  @click="requestOtp" 
                  :disabled="!emailInput || otpLoading || otpSent" 
                  class="glass-btn primary"
                >
                  <svg v-if="otpLoading" class="btn-icon spinning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  {{ otpLoading && !otpSent ? 'Sending...' : 'Send Code' }}
                </button>
              </div>
            </div>

            <div v-if="otpSent" class="otp-section">
              <div class="otp-header">
                <svg class="otp-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <h3>Check Your Email</h3>
                <p>We sent a 6-digit verification code to <strong>{{ emailInput }}</strong></p>
              </div>
              
              <div class="form-group">
                <label class="form-label">Verification Code</label>
                <div class="input-group">
                  <input
                    v-model="otpInput"
                    type="text"
                    maxlength="6"
                    placeholder="000000"
                    class="glass-input otp-input"
                    :disabled="otpLoading || otpVerified"
                  />
                  <button 
                    @click="verifyOtp" 
                    :disabled="!otpInput || otpLoading || otpVerified" 
                    class="glass-btn primary"
                  >
                    <svg v-if="otpLoading" class="btn-icon spinning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {{ otpLoading ? 'Verifying...' : 'Verify Code' }}
                  </button>
                </div>
              </div>
              
              <div class="otp-help">
                <p>Didn't receive the code?</p>
                <button @click="requestOtp" class="text-link">Resend Code</button>
              </div>
            </div>

            <div v-if="otpError" class="notification error">
              <svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              {{ otpError }}
            </div>
            
            <div v-if="otpSuccess" class="notification success">
              <svg class="notification-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ otpSuccess }}
            </div>
          </div>
        </div>

        <!-- Voting Form -->
        <div v-else class="glass-container voting-form">
          <div class="voting-progress">
            <div class="progress-header">
              <h2>Cast Your Ballot</h2>
              <p>Make your selections for each position below</p>
            </div>
            <div class="progress-bar">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: `${(completedPositions / election.positions.length) * 100}%` }"></div>
              </div>
              <div class="progress-text">
                {{ completedPositions }}/{{ election.positions.length }} positions completed
              </div>
            </div>
          </div>

          <!-- Positions -->
          <div v-for="(position, posIndex) in election.positions" :key="position.id" class="glass-card position-section">
            <div class="position-header">
              <div class="position-badge">
                <span class="position-number">{{ posIndex + 1 }}</span>
              </div>
              <div class="position-info">
                <h3>{{ position.title }}</h3>
                <p v-if="position.description" class="position-description">{{ position.description }}</p>
                <div class="selection-details">
                  <div class="selection-limit">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Select {{ position.maxSelections === 1 ? '1 candidate' : `up to ${position.maxSelections} candidates` }}
                  </div>
                  <div v-if="election.allowAbstain" class="abstain-note">
                    <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Or abstain from voting
                  </div>
                </div>
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
                <div class="candidate-content">
                  <div class="candidate-header">
                    <div class="candidate-avatar">
                      {{ candidate.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="candidate-details">
                      <div class="candidate-name">{{ candidate.name }}</div>
                      <div v-if="candidate.party" class="candidate-party">{{ candidate.party }}</div>
                    </div>
                  </div>
                  
                  <div v-if="candidate.description" class="candidate-description">
                    {{ candidate.description }}
                  </div>
                  
                  <div v-if="candidate.qualifications" class="candidate-qualifications">
                    <div class="qualifications-label">
                      <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                      </svg>
                      Qualifications
                    </div>
                    <p>{{ candidate.qualifications }}</p>
                  </div>
                </div>

                <div class="selection-indicator">
                  <div class="selection-circle">
                    <svg v-if="isSelected(position.id, candidate.id)" class="check-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Abstain Option -->
              <div 
                v-if="election.allowAbstain"
                :class="['glass-card', 'abstain-card', { 'selected': isAbstained(position.id) }]"
                @click="toggleAbstain(position.id)"
              >
                <div class="abstain-content">
                  <div class="abstain-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                  </div>
                  <div class="abstain-text">
                    <h4>Abstain</h4>
                    <p>Skip voting for this position</p>
                  </div>
                </div>
                <div class="selection-indicator">
                  <div class="selection-circle">
                    <svg v-if="isAbstained(position.id)" class="check-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="glass-card submit-section">
            <div class="submit-header">
              <h3>Review Your Ballot</h3>
              <p>Please review your selections before submitting your vote</p>
            </div>
            
            <div class="submit-summary">
              <div v-for="position in election.positions" :key="position.id" class="glass-card selection-summary">
                <div class="summary-header">
                  <h4>{{ position.title }}</h4>
                  <div class="summary-status" :class="{ 
                    'complete': votes[position.id] && votes[position.id].length > 0 || abstainedPositions.includes(position.id),
                    'incomplete': !votes[position.id] || votes[position.id].length === 0 && !abstainedPositions.includes(position.id)
                  }">
                    <svg v-if="votes[position.id] && votes[position.id].length > 0 || abstainedPositions.includes(position.id)" class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <svg v-else class="status-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div class="summary-content">
                  <div v-if="votes[position.id] && votes[position.id].length > 0" class="selections">
                    <div v-for="candidateName in getSelectedCandidateNames(position.id)" :key="candidateName" class="selected-candidate">
                      <svg class="candidate-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                      {{ candidateName }}
                    </div>
                  </div>
                  <div v-else-if="abstainedPositions.includes(position.id)" class="abstained-selection">
                    <svg class="abstain-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"/>
                    </svg>
                    Abstained
                  </div>
                  <div v-else class="incomplete-selection">
                    <svg class="incomplete-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Not completed
                  </div>
                </div>
              </div>
            </div>

            <div class="submit-actions">
              <div class="submit-warning" v-if="!canSubmitVote">
                <svg class="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                Please complete all positions before submitting your vote
              </div>
              
              <button 
                @click="submitVote" 
                :disabled="!canSubmitVote || submitting"
                class="glass-btn primary large submit-btn"
              >
                <svg v-if="submitting" class="btn-icon spinning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <svg v-else class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ submitting ? 'Submitting Your Vote...' : 'Submit My Vote' }}
              </button>
              
              <p class="vote-disclaimer">
                <svg class="disclaimer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Your vote is secure and anonymous. Once submitted, it cannot be changed.
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
  position: relative;
  overflow-x: hidden;
}

/* Floating Background Elements */
.floating-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.floating-element {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 20s infinite linear;
}

.floating-element:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
.floating-element:nth-child(2) { top: 20%; right: 10%; animation-delay: -2s; }
.floating-element:nth-child(3) { top: 40%; left: 5%; animation-delay: -4s; }
.floating-element:nth-child(4) { top: 60%; right: 15%; animation-delay: -6s; }
.floating-element:nth-child(5) { bottom: 20%; left: 20%; animation-delay: -8s; }
.floating-element:nth-child(6) { bottom: 10%; right: 5%; animation-delay: -10s; }
.floating-element:nth-child(7) { top: 70%; left: 50%; animation-delay: -12s; }
.floating-element:nth-child(8) { top: 30%; left: 70%; animation-delay: -14s; }

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
  75% { transform: translateY(-30px) rotate(270deg); }
}

.vote-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

/* Enhanced Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  min-height: 60vh;
}

.loading-content h3 {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.loading-content p {
  opacity: 0.8;
  font-size: 1rem;
}

.loading-spinner-container {
  position: relative;
  width: 4rem;
  height: 4rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loading-pulse {
  width: 4rem;
  height: 4rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}

/* Enhanced Error State */
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.error-card {
  text-align: center;
  padding: 3rem;
  max-width: 32rem;
  animation: fadeInUp 0.5s ease-out;
}

.error-icon-container {
  margin-bottom: 1.5rem;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #ff6b6b;
  animation: shake 0.5s ease-in-out;
}

.error-card h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.error-message {
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced Election Header */
.election-header {
  padding: 3rem 2rem;
  text-align: center;
  animation: fadeInDown 0.6s ease-out;
}

.election-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.8s ease-out 0.2s both;
}

.badge-icon {
  width: 1rem;
  height: 1rem;
}

.election-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeIn 0.8s ease-out 0.4s both;
}

.election-description {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.7;
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 0.8s ease-out 0.6s both;
}

.election-meta {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  animation: fadeIn 0.8s ease-out 0.8s both;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.meta-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.meta-item.deadline {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.2);
}

.meta-icon {
  width: 1.125rem;
  height: 1.125rem;
  opacity: 0.8;
}

/* Enhanced Success State */
.already-voted {
  animation: fadeInUp 0.6s ease-out;
}

.voted-card {
  text-align: center;
  padding: 3rem 2rem;
  max-width: 36rem;
  margin: 0 auto;
}

.success-animation {
  margin-bottom: 2rem;
}

.success-circle {
  width: 5rem;
  height: 5rem;
  margin: 0 auto;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.1) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: successPulse 2s ease-in-out infinite;
}

.voted-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #22c55e;
}

@keyframes successPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 20px rgba(34, 197, 94, 0); }
}

.voted-card h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #22c55e;
}

.voted-card p {
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.voted-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Enhanced Verification Section */
.email-verification {
  animation: fadeInUp 0.6s ease-out;
}

.verification-card {
  padding: 3rem 2rem;
  max-width: 32rem;
  margin: 0 auto;
}

.verification-header {
  text-align: center;
  margin-bottom: 2rem;
}

.verification-icon {
  width: 4rem;
  height: 4rem;
  color: #3b82f6;
  margin: 0 auto 1.5rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50%;
}

.verification-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.verification-header p {
  opacity: 0.9;
  line-height: 1.6;
}

.verification-steps {
  margin-bottom: 2rem;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.step {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.step.active {
  background: rgba(59, 130, 246, 0.2);
  border-color: #3b82f6;
  color: #3b82f6;
}

.step-line {
  width: 3rem;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 0.5rem;
}

.step-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  opacity: 0.7;
  margin-top: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: white;
}

.label-icon {
  width: 1rem;
  height: 1rem;
  opacity: 0.8;
}

.input-group {
  display: flex;
  gap: 0.75rem;
}

.glass-input {
  flex: 1;
}

.otp-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.otp-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.otp-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #22c55e;
  margin: 0 auto 1rem;
}

.otp-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.otp-input {
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.5rem;
}

.otp-help {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.text-link {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  text-decoration: underline;
  font-size: inherit;
  margin-left: 0.5rem;
}

.text-link:hover {
  color: #60a5fa;
}

/* Enhanced Voting Form */
.voting-form {
  padding: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.voting-progress {
  margin-bottom: 3rem;
}

.progress-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.progress-header h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.progress-header p {
  opacity: 0.9;
  font-size: 1.125rem;
}

.progress-bar {
  max-width: 24rem;
  margin: 0 auto;
}

.progress-track {
  width: 100%;
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #22c55e 100%);
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  opacity: 0.8;
}

/* Enhanced Position Section */
.position-section {
  margin-bottom: 2rem;
  padding: 2rem;
  animation: fadeInUp 0.6s ease-out;
  animation-fill-mode: both;
}

.position-section:nth-child(1) { animation-delay: 0.1s; }
.position-section:nth-child(2) { animation-delay: 0.2s; }
.position-section:nth-child(3) { animation-delay: 0.3s; }

.position-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 2rem;
}

.position-badge {
  min-width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.25rem;
}

.position-number {
  font-size: 1.125rem;
  font-weight: 700;
  color: #3b82f6;
}

.position-info {
  flex: 1;
}

.position-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.position-description {
  font-size: 1rem;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.selection-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selection-limit,
.abstain-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
}

.selection-limit .icon,
.abstain-note .icon {
  width: 1rem;
  height: 1rem;
}

.abstain-note {
  color: #f59e0b;
}

/* Enhanced Candidates Grid */
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
}

.candidate-card {
  position: relative;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;
}

.candidate-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: inherit;
  transition: all 0.3s ease;
  z-index: -1;
}

.candidate-card:hover::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
}

.candidate-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.candidate-card.selected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
}

.candidate-card.selected::before {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.candidate-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.candidate-content {
  position: relative;
  z-index: 1;
}

.candidate-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.candidate-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
}

.candidate-details {
  flex: 1;
}

.candidate-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.candidate-party {
  font-size: 0.875rem;
  opacity: 0.8;
  color: #3b82f6;
}

.candidate-description {
  font-size: 0.9rem;
  opacity: 0.9;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.candidate-qualifications {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.qualifications-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: #22c55e;
}

.qualifications-label .icon {
  width: 1rem;
  height: 1rem;
}

.candidate-qualifications p {
  font-size: 0.875rem;
  opacity: 0.9;
  line-height: 1.5;
  margin: 0;
}

.selection-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
}

.selection-circle {
  width: 1.5rem;
  height: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.candidate-card.selected .selection-circle {
  background: #3b82f6;
  border-color: #3b82f6;
}

.check-icon {
  width: 0.875rem;
  height: 0.875rem;
  color: white;
}

/* Enhanced Abstain Card */
.abstain-card {
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  position: relative;
  overflow: hidden;
}

.abstain-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
  border-radius: inherit;
  transition: all 0.3s ease;
  z-index: -1;
}

.abstain-card:hover::before {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%);
}

.abstain-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.abstain-card.selected {
  border-color: #f59e0b;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
}

.abstain-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  z-index: 1;
}

.abstain-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: #f59e0b;
  flex-shrink: 0;
}

.abstain-text h4 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #f59e0b;
}

.abstain-text p {
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
}

.abstain-card .selection-indicator {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.abstain-card.selected .selection-circle {
  background: #f59e0b;
  border-color: #f59e0b;
}

/* Enhanced Submit Section */
.submit-section {
  padding: 2rem;
  margin-top: 2rem;
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.submit-header {
  text-align: center;
  margin-bottom: 2rem;
}

.submit-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.submit-header p {
  opacity: 0.9;
}

.submit-summary {
  margin-bottom: 2rem;
}

.selection-summary {
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.summary-header h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.summary-status {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.summary-status.complete {
  color: #22c55e;
}

.summary-status.incomplete {
  color: #f59e0b;
}

.status-icon {
  width: 1rem;
  height: 1rem;
}

.summary-content {
  font-size: 0.9rem;
}

.selections {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selected-candidate {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #22c55e;
}

.candidate-icon {
  width: 1rem;
  height: 1rem;
}

.abstained-selection {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f59e0b;
}

.abstain-icon {
  width: 1rem;
  height: 1rem;
}

.incomplete-selection {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f59e0b;
}

.incomplete-icon {
  width: 1rem;
  height: 1rem;
}

.submit-actions {
  text-align: center;
}

.submit-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.warning-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.submit-btn {
  margin-bottom: 1rem;
}

.vote-disclaimer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
}

.disclaimer-icon {
  width: 1rem;
  height: 1rem;
}

/* Button Enhancements */
.glass-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.glass-btn:hover {
  transform: translateY(-2px);
}

.glass-btn.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
}

.btn-icon.spinning {
  animation: spin 1s linear infinite;
}

/* Notification Styles */
.notification {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.notification.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.notification-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .vote-page {
    padding: 1rem 0.5rem;
  }
  
  .vote-container {
    gap: 1.5rem;
  }
  
  .election-header {
    padding: 2rem 1rem;
  }
  
  .election-title {
    font-size: 2rem;
  }
  
  .election-meta {
    flex-direction: column;
    gap: 1rem;
  }
  
  .verification-card,
  .error-card,
  .voted-card {
    padding: 2rem 1rem;
  }
  
  .voting-form {
    padding: 1rem;
  }
  
  .position-header {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
  
  .candidates-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .candidate-card,
  .abstain-card {
    padding: 1rem;
  }
  
  .submit-section {
    padding: 1rem;
  }
  
  .error-actions,
  .voted-actions {
    flex-direction: column;
  }
  
  .input-group {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .election-title {
    font-size: 1.75rem;
  }
  
  .progress-header h2 {
    font-size: 1.5rem;
  }
  
  .position-info h3 {
    font-size: 1.25rem;
  }
  
  .candidate-header {
    gap: 0.75rem;
  }
  
  .candidate-avatar {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}</style>

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
